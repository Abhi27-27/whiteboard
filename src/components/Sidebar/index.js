import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styles from "./index.module.css";
import { useNavigate, useParams } from "react-router-dom";
import boardContext from "../../store/board-context";
import {
  FaPlus,
  FaTrash,
  FaShareAlt,
  FaSignOutAlt,
  FaSignInAlt,
  FaLayerGroup,
  FaPencilAlt,
  FaPaperPlane,
} from "react-icons/fa";

const Sidebar = () => {
  const [canvases, setCanvases] = useState([]);
  const token = localStorage.getItem("whiteboard_user_token");
  const {
    canvasId,
    setCanvasId,
    isUserLoggedIn,
    setUserLoginStatus,
  } = useContext(boardContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [creating, setCreating] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    if (isUserLoggedIn) {
      fetchCanvases();
    }
  }, [isUserLoggedIn]);

  const fetchCanvases = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/canvas/list`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCanvases(response.data);

      if (response.data.length === 0) {
        const newCanvas = await handleCreateCanvas();
        if (newCanvas) {
          setCanvasId(newCanvas._id);
          handleCanvasClick(newCanvas._id);
        }
      } else if (!canvasId && response.data.length > 0) {
        if (!id) {
          setCanvasId(response.data[0]._id);
          handleCanvasClick(response.data[0]._id);
        }
      }
    } catch (err) {
      console.error("Error fetching canvases:", err);
    }
  };

  const handleCreateCanvas = async () => {
    setCreating(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/canvas/create`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCanvases();
      setCanvasId(response.data.canvasId);
      handleCanvasClick(response.data.canvasId);
    } catch (err) {
      console.error("Error creating canvas:", err);
      return null;
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCanvas = async (canvasItemId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/api/canvas/delete/${canvasItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchCanvases();
      if (canvases.length > 1) {
        const remaining = canvases.filter((c) => c._id !== canvasItemId);
        setCanvasId(remaining[0]._id);
        handleCanvasClick(remaining[0]._id);
      }
    } catch (err) {
      console.error("Error deleting canvas:", err);
    }
  };

  const handleCanvasClick = async (canvasItemId) => {
    setCanvasId(canvasItemId);
    navigate(`/${canvasItemId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("whiteboard_user_token");
    setCanvases([]);
    setUserLoginStatus(false);
    navigate("/");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleShare = async () => {
    if (!email.trim()) {
      setError("Please enter an email address.");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/canvas/share/${canvasId}`,
        { email },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(response.data.message);
      setEmail("");
      setTimeout(() => setSuccess(""), 5000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to share canvas.");
      setTimeout(() => setError(""), 5000);
    }
  };

  const truncateId = (canvasItemId) => {
    if (!canvasItemId) return "";
    return canvasItemId.length > 10
      ? `${canvasItemId.slice(0, 8)}…`
      : canvasItemId;
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <FaPencilAlt />
        </div>
        <div>
          <h2 className={styles.title}>My Canvases</h2>
          <p className={styles.subtitle}>
            {canvases.length} board{canvases.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <button
        className={styles.createBtn}
        onClick={handleCreateCanvas}
        disabled={!isUserLoggedIn || creating}
      >
        <FaPlus />
        {creating ? "Creating…" : "New Canvas"}
      </button>

      <div className={styles.canvasListWrapper}>
        <ul className={styles.canvasList}>
          {canvases.map((canvas, index) => (
            <li
              key={canvas._id}
              className={`${styles.canvasItem} ${
                canvas._id === canvasId || canvas._id === id
                  ? styles.selected
                  : ""
              }`}
            >
              <button
                className={styles.canvasBtn}
                onClick={() => handleCanvasClick(canvas._id)}
              >
                <FaLayerGroup className={styles.canvasIcon} />
                <div className={styles.canvasInfo}>
                  <span className={styles.canvasName}>
                    Canvas {index + 1}
                  </span>
                  <span className={styles.canvasId}>
                    {truncateId(canvas._id)}
                  </span>
                </div>
              </button>
              <button
                className={styles.deleteBtn}
                onClick={() => handleDeleteCanvas(canvas._id)}
                title="Delete canvas"
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>

        {canvases.length === 0 && isUserLoggedIn && (
          <div className={styles.emptyState}>
            <FaLayerGroup />
            <p>No canvases yet</p>
            <span>Create your first board above</span>
          </div>
        )}
      </div>

      <div className={styles.shareSection}>
        <div className={styles.shareHeader}>
          <FaShareAlt />
          <span>Share Canvas</span>
        </div>
        <div className={styles.shareInputRow}>
          <input
            type="email"
            placeholder="Collaborator email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.shareInput}
          />
          <button
            className={styles.shareBtn}
            onClick={handleShare}
            disabled={!isUserLoggedIn}
            title="Share"
          >
            <FaPaperPlane />
          </button>
        </div>
        {error && <p className={styles.errorMsg}>{error}</p>}
        {success && <p className={styles.successMsg}>{success}</p>}
      </div>

      <div className={styles.footer}>
        {isUserLoggedIn ? (
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <FaSignOutAlt />
            Sign Out
          </button>
        ) : (
          <button className={styles.loginBtn} onClick={handleLogin}>
            <FaSignInAlt />
            Sign In
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
