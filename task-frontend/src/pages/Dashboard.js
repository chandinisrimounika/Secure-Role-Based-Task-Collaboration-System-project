import React, { useEffect, useState } from "react";
import API from "../api/axios";
import TaskForm from "../components/TaskForm";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTasks,
  FaClock,
  FaExclamationTriangle,
  FaCheckCircle
} from "react-icons/fa";

import "./Dashboard.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false); // ✅ NEW
  const [notifications, setNotifications] = useState([]); // ✅ NEW

  const navigate = useNavigate();
  const location = useLocation();

  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ FETCH TASKS (Improved)
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const res = await API.get("/tasks?page=0&size=10");

      setTasks(res.data);

    } catch (err) {
      console.log("FETCH ERROR:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ AUTO NOTIFICATIONS (Pending tasks)
  useEffect(() => {
    const pending = tasks.filter((t) => t.status === "PENDING");
    setNotifications(pending);
  }, [tasks]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const getInitials = (email) => {
    if (!email) return "U";
    return email.substring(0, 2).toUpperCase();
  };

  // ✅ SAFE SEARCH (handles undefined fields)
  const filteredTasks = tasks.filter(
    (task) =>
      (task.title || "").toLowerCase().includes(search.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(search.toLowerCase())
  );

  const groupTasks = (status) =>
    filteredTasks.filter((task) => task.status === status);

  return (
    <div className="layout">

<div className="sidebar">

  {/* LOGO SECTION */}
  <div className="sidebar-header">
    <div className="logo-box">🛡️</div>
    <div>
      <h2>TaskVault</h2>
      <p className="subtitle-sidebar">Collaboration Hub</p>
    </div>
  </div>

  <hr />

  {/* NAV ITEMS */}
  <div className="nav">

    <div
      className={`nav-item ${location.pathname === "/dashboard" ? "active" : ""}`}
      onClick={() => navigate("/dashboard")}
    >
      <span>📊</span>
      Dashboard
    </div>

    <div className="nav-item">📁 Boards</div>
    <div className="nav-item">✔ Tasks</div>
    <div className="nav-item">👥 Team</div>
    <div className="nav-item">🛡️ Roles</div>
    <div className="nav-item">⚙ Settings</div>

  </div>

  {/* LOGOUT AT VERY BOTTOM */}
  <div className="sidebar-bottom">
    <div className="nav-item logout" onClick={logout}>
      🚪 Logout
    </div>
  </div>

</div>

      {/* MAIN */}
      <div className="main">

        {/* TOPBAR */}
        <div className="topbar">

          <div>
            <h2>My Tasks</h2>
            <p className="subtitle">Manage and track your team's progress</p>
          </div>

          <div className="top-actions">

            {/* SEARCH */}
            <div className="search-box">
              🔍
              <input
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* ✅ REFRESH (LOADING STATE) */}
            <button onClick={fetchTasks} className="refresh-btn">
              {loading ? "Refreshing..." : "🔄 Refresh"}
            </button>

            {/* ✅ ONLY ADMIN */}
            {role === "ADMIN" && (
              <button className="new-btn">
                + New Task
              </button>
            )}

            {/* ✅ NOTIFICATION WORKING */}
            <div
              className="notification"
              onClick={() =>
                alert(`You have ${notifications.length} pending tasks`)
              }
            >
              🔔
              <span className="badge-count">
                {notifications.length}
              </span>
            </div>

            {/* PROFILE */}
            <div className="profile">
              <div className="avatar">{getInitials(email)}</div>
              <div>
                <p className="name">{email}</p>
                <span className="role">{role}</span>
              </div>
            </div>

          </div>
        </div>

        {/* STATS */}
        <div className="stats">

          <div className="card">
            <div className="icon blue"><FaTasks /></div>
            <div>
              <h3>{tasks.length}</h3>
              <p>Total Tasks</p>
            </div>
          </div>

          <div className="card">
            <div className="icon orange"><FaClock /></div>
            <div>
              <h3>{groupTasks("PENDING").length}</h3>
              <p>To Do</p>
            </div>
          </div>

          <div className="card">
            <div className="icon lightblue"><FaExclamationTriangle /></div>
            <div>
              <h3>{groupTasks("IN_PROGRESS").length}</h3>
              <p>In Progress</p>
            </div>
          </div>

          <div className="card">
            <div className="icon green"><FaCheckCircle /></div>
            <div>
              <h3>{groupTasks("DONE").length}</h3>
              <p>Completed</p>
            </div>
          </div>

        </div>

        {/* TASK FORM */}
        {role === "ADMIN" && (
          <div className="task-form">
            <TaskForm onTaskCreated={fetchTasks} />
          </div>
        )}

        {/* BOARD */}
        <div className="board">
          <Column title="To Do" tasks={groupTasks("PENDING")} refresh={fetchTasks} role={role} />
          <Column title="In Progress" tasks={groupTasks("IN_PROGRESS")} refresh={fetchTasks} role={role} />
          <Column title="Completed" tasks={groupTasks("DONE")} refresh={fetchTasks} role={role} />
        </div>

      </div>
    </div>
  );
}

/* COLUMN */
function Column({ title, tasks, refresh, role }) {
  return (
    <div className="column">
      <div className="column-header">
        <h3>{title}</h3>
        <span className="count">{tasks.length}</span>
      </div>

      {tasks.length === 0 && <p className="empty">No tasks</p>}

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} refresh={refresh} role={role} />
      ))}
    </div>
  );
}

/* TASK CARD */
/* TASK CARD */
function TaskCard({ task, refresh, role }) {

  const updateStatus = async (newStatus) => {
    try {
      await API.put(`/tasks/${task.id}`, {
        status: newStatus
      });
      refresh();
    } catch (err) {
      console.log("Update failed", err);
    }
  };

  const deleteTask = async () => {
    try {
      await API.delete(`/tasks/${task.id}`);
      refresh();
    } catch (err) {
      console.log("Delete failed", err);
    }
  };

  const tags = ["FRONTEND", "UX"];

  return (
    <div className="task-card-new">

      {/* TITLE */}
      <h4>{task.title}</h4>
      <p>{task.description}</p>

      {/* TAGS */}
      <div className="tag-row">
        {tags.map((tag, i) => (
          <span key={i} className="tag">{tag}</span>
        ))}
      </div>

      {/* PRIORITY + STATUS */}
      <div className="status-row">
        {task.priority && (
          <span className={`priority ${task.priority}`}>
            ↑ {task.priority}
          </span>
        )}

        <span className={`status ${task.status}`}>
          {task.status.replace("_", " ")}
        </span>
      </div>

      <hr />

      {/* USER + DATE */}
      <div className="bottom-row">

        <div className="user-info">
          <div className="avatar-small">
            {(task.assignedTo || "U")[0].toUpperCase()}
          </div>
          <span>{task.assignedTo || "Unassigned"}</span>
        </div>

        {task.deadline && (
          <span className="date">📅 {task.deadline}</span>
        )}

      </div>

      {/* ✅ START BUTTON (FIXED) */}
      {task.status === "PENDING" && (
        <button
          className="start-btn"
          onClick={() => updateStatus("IN_PROGRESS")}
        >
          ▶ Start
        </button>
      )}

      {/* ✅ DONE BUTTON */}
      {task.status === "IN_PROGRESS" && (
        <button
          className="mark-done-btn"
          onClick={() => updateStatus("DONE")}
        >
          ✓ Mark Done
        </button>
      )}

      {/* ADMIN DELETE */}
      {role === "ADMIN" && (
        <button onClick={deleteTask} className="delete-btn">
          Delete
        </button>
      )}

    </div>
  );
}
export default Dashboard;


