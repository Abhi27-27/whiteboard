# Collaborative Whiteboard - Frontend

A real-time whiteboard where several logged-in users can draw on the same board and
see each other's strokes as they happen. It has the usual drawing tools, undo and
redo, and saves automatically.

This is the frontend repo, built with React. It talks to a separate Node and Express
backend.

## Tech stack

- React (Create React App)
- React Router for navigation
- HTML Canvas for the drawing surface
- RoughJS for the hand-drawn look of shapes
- perfect-freehand for the brush
- socket.io-client for the live connection
- axios for REST calls

## Features

- Seven tools: brush, line, rectangle, circle, arrow, eraser and text
- Real-time drawing shared across everyone on the same board
- Undo and redo with full history
- Account sign up and login
- Create boards, share them with specific users, and delete them
- Boards save automatically

## How it works

The drawing is kept as a list of elements in React state. Anything you draw adds to
or updates that list, and the canvas is redrawn from the list. When the list changes
because of your own drawing, it is sent over the socket to the server, which shares
it with the other users on the board.

```
you draw -> the element list updates -> sent over the socket -> other users' boards update
```

One important detail: when an update arrives from another user, the app shows it but
does not send it back out. Without this guard the same update would bounce between
users in a loop. A small flag marks remote updates so they are rendered but not
re-broadcast.

State is managed with React Context and a reducer, which keeps all the changes (tool
changes, drawing, undo, redo and so on) in one predictable place.

## Project structure

```
src/
  App.js                     routing and layout
  constants.js               the tool list and the reducer action types
  store/
    board-context.js         the board context
    BoardProvider.js         the reducer and the drawing handlers, including undo/redo
    toolbox-context.js       toolbox context (color, fill, size)
    ToolboxProvider.js
  components/
    Board/                   the canvas, the socket wiring and the rendering
    Toolbar/                 tool buttons, undo, redo, download
    Toolbox/                 color, fill and size pickers
    Sidebar/                 board list, create, share, delete
    Login, Register, Landing
  utils/
    socket.js                creates the socket and attaches the token
    element.js               builds and redraws shapes, eraser hit testing
    math.js                  geometry helpers
    api.js                   axios calls
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- The backend running (locally or deployed)

### Install and run

```bash
npm install
npm start
```

The app runs on http://localhost:3000.

### Backend URL

Set the backend URL the app should connect to (used for both the API and the socket).
With Create React App this is an environment variable in a `.env` file:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

## Build and deploy

```bash
npm run build
```

This produces a static build that can be hosted on Vercel or Netlify. Point the
backend URL at your deployed server, and make sure that server allows this site's URL
in its CORS settings.