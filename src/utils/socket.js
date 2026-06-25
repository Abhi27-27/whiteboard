import { io } from "socket.io-client";

const BACKEND_URL = (
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  auth: (cb) => {
    const token = localStorage.getItem("whiteboard_user_token");
    cb({ token: token || "" });
  },
});

export default socket;
