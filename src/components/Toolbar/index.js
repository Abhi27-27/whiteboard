import React, { useContext } from "react";
import classes from "./index.module.css";
import cx from "classnames";
import {
  FaSlash,
  FaRegCircle,
  FaArrowRight,
  FaPaintBrush,
  FaEraser,
  FaUndoAlt,
  FaRedoAlt,
  FaFont,
  FaDownload,
  FaPencilAlt,
} from "react-icons/fa";
import { LuRectangleHorizontal } from "react-icons/lu";
import { TOOL_ITEMS } from "../../constants";
import boardContext from "../../store/board-context";

const TOOL_CONFIG = [
  { id: TOOL_ITEMS.BRUSH, icon: <FaPaintBrush />, label: "Brush" },
  { id: TOOL_ITEMS.LINE, icon: <FaSlash />, label: "Line" },
  { id: TOOL_ITEMS.RECTANGLE, icon: <LuRectangleHorizontal />, label: "Rectangle" },
  { id: TOOL_ITEMS.CIRCLE, icon: <FaRegCircle />, label: "Circle" },
  { id: TOOL_ITEMS.ARROW, icon: <FaArrowRight />, label: "Arrow" },
  { id: TOOL_ITEMS.ERASER, icon: <FaEraser />, label: "Eraser" },
  { id: TOOL_ITEMS.TEXT, icon: <FaFont />, label: "Text" },
];

const ACTION_CONFIG = [
  { id: "undo", icon: <FaUndoAlt />, label: "Undo", action: "undo" },
  { id: "redo", icon: <FaRedoAlt />, label: "Redo", action: "redo" },
  { id: "download", icon: <FaDownload />, label: "Export", action: "download" },
];

const Toolbar = () => {
  const { activeToolItem, changeToolHandler, undo, redo } =
    useContext(boardContext);

  const handleDownloadClick = () => {
    const canvas = document.getElementById("canvas");
    const data = canvas.toDataURL("image/png");
    const anchor = document.createElement("a");
    anchor.href = data;
    anchor.download = "sketchboard.png";
    anchor.click();
  };

  const handleAction = (action) => {
    if (action === "undo") undo();
    else if (action === "redo") redo();
    else if (action === "download") handleDownloadClick();
  };

  return (
    <div className={classes.wrapper}>
      <div className={classes.brand}>
        <FaPencilAlt className={classes.brandIcon} />
        <span className={classes.brandName}>SketchBoard</span>
      </div>

      <div className={classes.container}>
        <div className={classes.toolGroup}>
          {TOOL_CONFIG.map((tool) => (
            <div
              key={tool.id}
              className={cx(classes.toolItem, {
                [classes.active]: activeToolItem === tool.id,
              })}
              onClick={() => changeToolHandler(tool.id)}
              title={tool.label}
              data-label={tool.label}
            >
              {tool.icon}
            </div>
          ))}
        </div>

        <div className={classes.divider} />

        <div className={classes.toolGroup}>
          {ACTION_CONFIG.map((item) => (
            <div
              key={item.id}
              className={classes.toolItem}
              onClick={() => handleAction(item.action)}
              title={item.label}
              data-label={item.label}
            >
              {item.icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
