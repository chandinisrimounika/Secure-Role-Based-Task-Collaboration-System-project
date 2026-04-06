package com.example.taskmanager.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class TaskResponse {

    private Long id;

    private String title;

    private String description;

    private String status;

    private String priority;   // ✅ included

    private LocalDate deadline; // ✅ included

    private String assignedTo; // email
}