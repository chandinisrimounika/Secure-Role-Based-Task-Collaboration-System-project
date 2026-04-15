import React, { useState, useEffect } from "react";
import API from "../api/axios";

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedEmail, setAssignedEmail] = useState("");
  const [users, setUsers] = useState([]);

  // ✅ NEW STATES
  const [priority, setPriority] = useState("MEDIUM");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.log("USER FETCH ERROR:", err.response?.data || err.message);
    }
  };

  const handleSubmit = async () => {
    try {
      await API.post("/tasks", {
        title,
        description,
        status: "PENDING",
        assignedEmail,
        priority,     // ✅ NEW
        deadline      // ✅ NEW
      });

      setTitle("");
      setDescription("");
      setAssignedEmail("");
      setPriority("MEDIUM");
      setDeadline("");

      onTaskCreated();
    } catch (err) {
      console.log("TASK ERROR:", err.response?.data || err.message);
      alert("Task creation failed");
    }
  };

  return (
    <div className="task-form">
      <h3>Create Task</h3>

      {/* TITLE */}
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* DESCRIPTION */}
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* USER DROPDOWN */}
      <select
        value={assignedEmail}
        onChange={(e) => setAssignedEmail(e.target.value)}
      >
        <option value="">Select User</option>

        {users
          .filter((user) => user.role === "USER")
          .map((user) => (
            <option key={user.id} value={user.email}>
              {user.email}
            </option>
          ))}
      </select>

      {/* 🔥 PRIORITY */}
      <select
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>

      {/* 🔥 DEADLINE */}
      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <button onClick={handleSubmit}>Add Task</button>
    </div>
  );
}

export default TaskForm;