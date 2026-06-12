import { io } from "socket.io-client";

const token = localStorage.getItem("whiteboard_user_token");

// Fallback to localhost if the environment variable isn't found
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080"; 

const socket = io(BACKEND_URL, {
  extraHeaders: token ? { Authorization: `Bearer ${token}` } : {},
});

export default socket;