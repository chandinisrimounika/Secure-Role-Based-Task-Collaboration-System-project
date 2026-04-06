package com.example.taskmanager.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.taskmanager.dto.TaskRequest;
import com.example.taskmanager.dto.TaskResponse;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.model.User;
import com.example.taskmanager.repository.TaskRepository;
import com.example.taskmanager.repository.UserRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskRepository repository;
    private final UserRepository userRepository;

    public TaskController(TaskRepository repository,
                          UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    // ✅ GET LOGGED-IN USER
    private User getAuthenticatedUser() {
        Object principal = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        String email;

        if (principal instanceof UserDetails) {
            email = ((UserDetails) principal).getUsername();
        } else {
            email = principal.toString();
        }

        User user = userRepository.findByEmail(email);

        if (user == null) {
            throw new RuntimeException("User not found");
        }

        return user;
    }

    // 🔥 CREATE TASK
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD')")
    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request) {

        User assignedUser = userRepository.findByEmail(request.getAssignedEmail());

        if (assignedUser == null) {
            return ResponseEntity.badRequest().body(null);
        }

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());

        // ✅ DEFAULT STATUS FIX
        task.setStatus(request.getStatus() != null ? request.getStatus() : "PENDING");

        task.setPriority(request.getPriority());
        task.setDeadline(request.getDeadline());
        task.setAssignedTo(assignedUser);

        Task saved = repository.save(task);

        return ResponseEntity.ok(mapToResponse(saved));
    }

    // 🔥 GET TASKS
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD','USER')")
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "id,desc") String[] sort
    ) {

        User user = getAuthenticatedUser();

        Sort.Direction direction =
                sort[1].equalsIgnoreCase("asc") ?
                        Sort.Direction.ASC :
                        Sort.Direction.DESC;

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(direction, sort[0])
        );

        Page<Task> taskPage;

        if ("ADMIN".equals(user.getRole())) {
            taskPage = repository.findAll(pageable);
        } else {
            taskPage = repository.findByAssignedTo(user, pageable);
        }

        List<TaskResponse> response = taskPage.getContent()
                .stream()
                .map(this::mapToResponse)
                .toList();

        return ResponseEntity.ok(response);
    }

    // 🔥 UPDATE TASK STATUS (FIXED ENDPOINT)
    @PreAuthorize("hasAnyRole('ADMIN','TEAM_LEAD','USER')")
    @PutMapping("/{id}")   // ✅ FIXED (IMPORTANT)
    public ResponseEntity<?> updateTaskStatus(
            @PathVariable Long id,
            @RequestBody TaskRequest request) {

        User user = getAuthenticatedUser();

        return repository.findById(id)
                .map(task -> {

                    // 🔒 USER → only own tasks
                    if ("USER".equals(user.getRole())) {
                        if (task.getAssignedTo() == null ||
                                !task.getAssignedTo().getId().equals(user.getId())) {
                            return ResponseEntity.status(403).body("Access denied");
                        }
                    }

                    // ✅ UPDATE STATUS ONLY
                    task.setStatus(request.getStatus());

                    Task updated = repository.save(task);

                    return ResponseEntity.ok(mapToResponse(updated));
                })
                .orElse(ResponseEntity.status(404).body("Task not found"));
    }

    // 🔥 DELETE TASK
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {

        if (!repository.existsById(id)) {
            return ResponseEntity.status(404).body("Task not found");
        }

        repository.deleteById(id);

        return ResponseEntity.ok("Task deleted successfully");
    }

    // ✅ DTO MAPPER (FIXED)
    private TaskResponse mapToResponse(Task task) {

        TaskResponse response = new TaskResponse();

        response.setId(task.getId());
        response.setTitle(task.getTitle());
        response.setDescription(task.getDescription());
        response.setStatus(task.getStatus());

        // ✅ IMPORTANT FIX
        response.setPriority(task.getPriority());
        response.setDeadline(task.getDeadline());

        if (task.getAssignedTo() != null) {
            response.setAssignedTo(task.getAssignedTo().getEmail());
        }

        return response;
    }
}