package com.example.taskmanager.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class TaskRequest {

    private String title;

    private String description;

    // ✅ DEFAULT STATUS (VERY IMPORTANT)
    private String status = "PENDING";

    private String priority;

    private LocalDate deadline;

    private String assignedEmail;
}