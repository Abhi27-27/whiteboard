import { io } from "socket.io-client";

const BACKEND_URL = (
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"
).replace(/\/+$/, "");

// Use default transports (polling first, then upgrades to websocket).
// Polling is needed so socket.io can wake up Render.com's sleeping server
// via HTTP before attempting the WebSocket upgrade.
const socket = io(BACKEND_URL, {
  auth: (cb) => {
    const token = localStorage.getItem("whiteboard_user_token");
    cb({ token: token || "" });
  },
});

export default socket;
