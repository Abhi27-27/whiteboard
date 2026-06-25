# 🎨 SketchBoard — Real-Time Collaborative Whiteboard (Frontend)

<div align="center">

![SketchBoard](https://img.shields.io/badge/SketchBoard-Whiteboard-6366f1?style=for-the-badge&logo=react&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Socket.io](https://img.shields.io/badge/Socket.io-4-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![RoughJS](https://img.shields.io/badge/RoughJS-Hand--drawn-f59e0b?style=for-the-badge)

**Think visually. Create together. Draw in real time.**

[🌐 Live Demo](https://whiteboard-alpha-pied.vercel.app/) · [⚙️ Backend Repo](https://github.com/Abhi27-27/whiteboard-backend) · [🐛 Report Bug](https://github.com/Abhi27-27/whiteboard/issues)

</div>

---

## 📌 Overview

SketchBoard is a full-stack real-time collaborative whiteboard application. Users can draw, annotate, and collaborate live on shared canvases with multi-tool support, undo/redo, and cloud persistence. This repository contains the **React frontend**.

---

## 🚀 Live Demo

> **Deployed on Vercel:** [https://whiteboard-alpha-pied.vercel.app/](https://whiteboard-alpha-pied.vercel.app/)

---

## ✨ Features

- 🖌️ **Multi-Tool Drawing** — Brush, Line, Rectangle, Circle, Arrow, Text, and Eraser
- 🤝 **Real-Time Collaboration** — Socket.io syncs drawings live across all connected users
- 🔐 **JWT Authentication** — Secure login/register with token stored in localStorage
- 🎨 **Stroke & Fill Colors** — Color picker + preset palette for stroke and fill customization
- 📏 **Size Control** — Adjustable brush/stroke size and font size per tool
- ↩️ **Undo / Redo** — Full history stack with Ctrl+Z / Ctrl+Y keyboard shortcuts
- 💾 **Cloud Save** — Canvas elements auto-persisted to MongoDB on every drawing update
- 📥 **Export Canvas** — Download the current board as a PNG image
- 🔒 **View-Only Mode** — Unauthorized users see the canvas but cannot edit it
- 📱 **Responsive Landing Page** — Animated hero with feature highlights

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | React 18 (CRA) |
| Styling | CSS Modules |
| Drawing | RoughJS + Perfect Freehand |
| Real-Time | Socket.io Client |
| State Management | React Context API + useReducer |
| HTTP | Axios + Fetch API |
| Icons | React Icons |
| Deployment | Vercel |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Board/              # Canvas element — drawing, rendering, socket sync
│   ├── Toolbar/            # Top toolbar — tools, undo, redo, export
│   ├── Toolbox/            # Side panel — stroke, fill, size controls
│   ├── Sidebar/            # Canvas management sidebar
│   ├── Landing/            # Public landing page (unauthenticated)
│   ├── Login/              # Login form
│   └── Register/           # Registration form
├── store/
│   ├── board-context.js    # Board context definition
│   ├── BoardProvider.jsx   # Board state + reducer (elements, history, tools)
│   ├── toolbox-context.js  # Toolbox context definition
│   └── ToolboxProvider.jsx # Toolbox state (stroke, fill, size per tool)
├── utils/
│   ├── element.js          # createElement, isPointNearElement, rehydrateElements
│   ├── math.js             # Geometry helpers (line distance, arrow heads, midpoint)
│   ├── api.js              # Canvas REST API helpers (load, update)
│   └── socket.js           # Socket.io client initialization with auth header
├── constants/
│   └── index.js            # TOOL_ITEMS, COLORS, BOARD_ACTIONS, TOOLBOX_ACTIONS
└── App.jsx                 # Routes: /, /:id, /login, /register
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v16+
- Backend server running (see [Backend Repo](https://github.com/Abhi27-27/whiteboard-backend))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Abhi27-27/whiteboard.git
cd whiteboard

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

> For production, set `REACT_APP_BACKEND_URL` to your deployed backend URL.

### Run Locally

```bash
npm start
```

App runs at `http://localhost:3000`

---

## 🔌 Socket Events

| Event | Direction | Description |
|---|---|---|
| `joinCanvas` | Client → Server | Join a canvas room by ID |
| `loadCanvas` | Server → Client | Receive initial canvas elements |
| `drawingUpdate` | Client → Server | Broadcast drawing changes |
| `receiveDrawingUpdate` | Server → Client | Receive others' drawing changes |
| `unauthorized` | Server → Client | Notify of access denial |

---

## 🔗 Backend

This frontend connects to the SketchBoard REST API + WebSocket server.

> **Backend Repository:** [https://github.com/Abhi27-27/whiteboard-backend](https://github.com/Abhi27-27/whiteboard-backend)

Make sure the backend is running before starting the frontend locally.

---


<div align="center">
Made by <a href="https://github.com/Abhi27-27">Marreddy Abhiram Muni Reddy</a> · IIT Kharagpur
</div>
