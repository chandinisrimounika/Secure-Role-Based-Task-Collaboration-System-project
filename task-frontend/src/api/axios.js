import axios from "axios";

const API = axios.create({
  baseURL: "https://chandini-task-backend.onrender.com/api"
});

// 🔥 AUTO ADD TOKEN
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;