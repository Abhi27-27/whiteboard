import axios from "axios";

const API_BASE_URL = `${(
  process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"
).replace(/\/+$/, "")}/api/canvas`;

const getAuthHeader = () => {
  const token = localStorage.getItem("whiteboard_user_token");
  return { Authorization: token ? `Bearer ${token}` : "" };
};

export const updateCanvas = async (canvasId, elements) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/update`,
      { canvasId, elements },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating canvas:", error.message);
  }
};

export const fetchInitialCanvasElements = async (canvasId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/load/${canvasId}`, {
      headers: getAuthHeader(),
    });
    return response.data.elements;
  } catch (error) {
    console.error("Error fetching initial canvas elements:", error.message);
  }
};