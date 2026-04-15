# 🛡️ Secure Role-Based Task & Collaboration System

A full-stack web application for managing tasks efficiently with **role-based access control**, built using **Spring Boot (Backend)** and **React (Frontend)**.

---

## 🚀 Project Overview

This project allows teams to collaborate and manage tasks in a structured way.

* Admins can create and assign tasks
* Users can view and update their tasks
* Secure authentication using JWT
* Clean and modern dashboard UI

---

## ✨ Features

### 🔐 Authentication & Authorization

* JWT-based login system
* Secure API access
* Role-based control (ADMIN / USER)

---

### 📋 Task Management

* Create tasks (Admin)
* Assign tasks to users
* Update task status:

  * 🟡 PENDING
  * 🔵 IN_PROGRESS
  * 🟢 DONE
* Delete tasks (Admin only)

---

### 📊 Dashboard

* Kanban-style board
* Task grouping by status
* Real-time updates

---

### 🔍 Search

* Live search filtering
* Search by title and description

---

### 🔔 Notifications

* Shows count of pending tasks
* Dynamic updates

---

### 🎨 UI Features

* Sidebar navigation
* Topbar with search & profile
* Responsive layout
* Priority & deadline indicators

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Axios
* React Router
* CSS
* React Icons

---

### Backend

* Spring Boot
* Spring Security
* JWT Authentication
* Hibernate (JPA)
* MySQL / H2

---

## 📁 Project Structure

```
Secure-Role-Based-Task-Collaboration-System/
│
├── frontend/
│   ├── src/
│   ├── components/
│   ├── pages/
│   └── api/
│
├── backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   └── security/
```

---

## ⚙️ Installation & Setup

### 🔹 Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on:
👉 http://localhost:8080

---

### 🔹 Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on:
👉 http://localhost:3000

---

## 🔑 API Endpoints

### Authentication

* `POST /auth/login`

### Tasks

* `GET /tasks`
* `POST /tasks` (Admin)
* `PUT /tasks/{id}`
* `DELETE /tasks/{id}` (Admin)

---

## 🔄 Workflow

1. User logs in
2. JWT token is generated
3. Token is stored in localStorage
4. API requests include token
5. Backend validates token
6. Tasks are fetched based on role

---

## 🧪 Sample Data

| Title           | Priority | Status      |
| --------------- | -------- | ----------- |
| Build UI        | HIGH     | PENDING     |
| API Integration | MEDIUM   | IN_PROGRESS |
| Fix Bug         | HIGH     | DONE        |

---

## 💡 Key Highlights

* Role-based UI rendering
* Secure authentication system
* Real-time dashboard updates
* Clean and modern UI design

---

## 🚧 Future Enhancements

* Drag & drop tasks
* Email notifications
* Real-time updates (WebSockets)
* Team collaboration features

---

## 👩‍💻 Author

**Chandini Sri Mounika-AP22110010544**


