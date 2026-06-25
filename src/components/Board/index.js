import {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import rough from "roughjs";
import { useNavigate } from "react-router-dom";
import boardContext from "../../store/board-context";
import { TOOL_ACTION_TYPES, TOOL_ITEMS } from "../../constants";
import toolboxContext from "../../store/toolbox-context";
import axios from "axios";
import socket from "../../utils/socket";
import classes from "./index.module.css";
import { getSvgPathFromStroke, rehydrateElements } from "../../utils/element";
import getStroke from "perfect-freehand";
import { FaLock } from "react-icons/fa";

function Board({ id }) {
  const navigate = useNavigate();
  const canvasRef = useRef();
  const textAreaRef = useRef();

  const isRemoteUpdate = useRef(false);
  const didMountRef = useRef(false);

  const {
    elements,
    toolActionType,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    boardMouseUpHandler,
    textAreaBlurHandler,
    undo,
    redo,
    setCanvasId,
    setElements,
    setHistory,
  } = useContext(boardContext);
  const { toolboxState } = useContext(toolboxContext);

  const [isAuthorized, setIsAuthorized] = useState(true);
  const elementsRef = useRef(elements);
  useEffect(() => {
    elementsRef.current = elements;
  });

  // HTTP fetch: primary load path — works even when the socket is still
  // waking up the server (Render.com free tier cold starts).
  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("whiteboard_user_token");
    if (!token) return;

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/canvas/load/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const hydrated = rehydrateElements(res.data.elements);
        isRemoteUpdate.current = true;
        setCanvasId(id);
        setElements(hydrated);
        setHistory(hydrated);
      })
      .catch((err) => console.error("Error loading canvas:", err));
  }, [id, setCanvasId, setElements, setHistory]);

  // Save when the tab/window closes so no stroke is lost.
  // fetch with keepalive:true outlives the page unload and supports auth headers.
  useEffect(() => {
    if (!id) return;

    const handleBeforeUnload = () => {
      const token = localStorage.getItem("whiteboard_user_token");
      if (!token || !elementsRef.current.length) return;
      fetch(`${process.env.REACT_APP_BACKEND_URL}/api/canvas/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ canvasId: id, elements: elementsRef.current }),
        keepalive: true,
      });
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const joinCanvas = () => {
      socket.emit("joinCanvas", { canvasId: id });
    };

    const handleLoadCanvas = (initialElements) => {
      const hydrated = rehydrateElements(initialElements);
      isRemoteUpdate.current = true;
      setCanvasId(id);
      setElements(hydrated);
      setHistory(hydrated);
    };

    const handleReceiveDrawingUpdate = (updatedElements) => {
      isRemoteUpdate.current = true;
      setElements(rehydrateElements(updatedElements));
    };

    const handleUnauthorized = (data) => {
      console.log(data.message);
      setIsAuthorized(false);
    };

    const handleCanvasDeleted = () => {
      navigate("/");
    };

    joinCanvas();
    socket.on("connect", joinCanvas);
    socket.on("loadCanvas", handleLoadCanvas);
    socket.on("receiveDrawingUpdate", handleReceiveDrawingUpdate);
    socket.on("unauthorized", handleUnauthorized);
    socket.on("canvasDeleted", handleCanvasDeleted);

    return () => {
      socket.off("connect", joinCanvas);
      socket.off("loadCanvas", handleLoadCanvas);
      socket.off("receiveDrawingUpdate", handleReceiveDrawingUpdate);
      socket.off("unauthorized", handleUnauthorized);
      socket.off("canvasDeleted", handleCanvasDeleted);
      socket.emit("leaveCanvas", { canvasId: id });
    };
  }, [id, setElements, setCanvasId, setHistory, navigate]);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (!id) return;
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }
    socket.emit("drawingUpdate", { canvasId: id, elements });
  }, [elements, id]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.ctrlKey && event.key === "z") {
        undo();
      } else if (event.ctrlKey && event.key === "y") {
        redo();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const roughCanvas = rough.canvas(canvas);

    elements.forEach((element) => {
      context.save();
      switch (element.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          roughCanvas.draw(element.roughEle);
          break;
        case TOOL_ITEMS.BRUSH:
          context.fillStyle = element.stroke;
          const path = new Path2D(
            getSvgPathFromStroke(getStroke(element.points))
          );
          context.fill(path);
          break;
        case TOOL_ITEMS.TEXT:
          context.textBaseline = "top";
          context.font = `${element.size}px Caveat`;
          context.fillStyle = element.stroke;
          context.fillText(element.text, element.x1, element.y1);
          break;
        default:
          throw new Error("Type not recognized");
      }
      context.restore();
    });

    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [elements]);

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (toolActionType === TOOL_ACTION_TYPES.WRITING) {
      setTimeout(() => {
        textarea.focus();
      }, 0);
    }
  }, [toolActionType]);

  const handleMouseDown = (event) => {
    if (!isAuthorized) return;
    boardMouseDownHandler(event, toolboxState);
  };

  const handleMouseMove = (event) => {
    if (!isAuthorized) return;
    boardMouseMoveHandler(event);
  };

  const handleMouseUp = () => {
    if (!isAuthorized) return;
    boardMouseUpHandler();
  };

  return (
    <>
      {!isAuthorized && (
        <div className={classes.unauthorizedOverlay}>
          <div className={classes.unauthorizedCard}>
            <FaLock className={classes.lockIcon} />
            <h3>View Only</h3>
            <p>You don't have edit access to this canvas.</p>
          </div>
        </div>
      )}
      {toolActionType === TOOL_ACTION_TYPES.WRITING && (
        <textarea
          type="text"
          ref={textAreaRef}
          className={classes.textElementBox}
          style={{
            top: elements[elements.length - 1].y1,
            left: elements[elements.length - 1].x1,
            fontSize: `${elements[elements.length - 1]?.size}px`,
            color: elements[elements.length - 1]?.stroke,
          }}
          onBlur={(event) => textAreaBlurHandler(event.target.value)}
        />
      )}
      <canvas
        ref={canvasRef}
        id="canvas"
        className={!isAuthorized ? classes.readOnly : ""}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  );
}

export default Board;
