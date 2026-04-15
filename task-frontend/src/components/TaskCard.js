import React from "react";
import API from "../api/axios";

function TaskCard({ task, refresh, role }) {

  // ✅ UPDATE STATUS
  const updateStatus = async (newStatus) => {
    try {
      console.log("Updating Task:", task.id, "→", newStatus);

      await API.put(`/tasks/${task.id}`, {
        status: newStatus
      });

      refresh(); // reload tasks
    } catch (err) {
      console.log("❌ Update failed:", err.response?.data || err.message);
    }
  };

  // ✅ DELETE TASK (ADMIN ONLY)
  const deleteTask = async () => {
    try {
      await API.delete(`/tasks/${task.id}`);
      refresh();
    } catch (err) {
      console.log("❌ Delete failed:", err.response?.data || err.message);
    }
  };

  return (
    <div className="task-card">

      {/* TITLE */}
      <h4>{task.title || "No Title"}</h4>

      {/* DESCRIPTION */}
      <p>{task.description || "No Description"}</p>

      {/* TAGS */}
      <div className="tags">
        {task.priority && (
          <span className={`priority ${task.priority}`}>
            {task.priority}
          </span>
        )}

        {task.deadline && (
          <span className="deadline">
            📅 {task.deadline}
          </span>
        )}
      </div>

      {/* ASSIGNED USER */}
      <div className="user">
        👤 {task.assignedTo || "Unassigned"}
      </div>

      {/* ACTION BUTTONS */}
      <div className="actions">

        {/* ▶ START (USER + ADMIN) */}
        {task.status === "PENDING" && (
          <button
            className="start-btn"
            onClick={() => updateStatus("IN_PROGRESS")}
          >
            ▶ Start
          </button>
        )}

        {/* ✔ DONE */}
        {task.status === "IN_PROGRESS" && (
          <button
            className="done-btn"
            onClick={() => updateStatus("DONE")}
          >
            ✔ Done
          </button>
        )}

        {/* ❌ DELETE (ADMIN ONLY) */}
        {role === "ADMIN" && (
          <button
            onClick={deleteTask}
            className="delete-btn"
          >
            ❌ Delete
          </button>
        )}

      </div>
    </div>
  );
}

export default TaskCard;