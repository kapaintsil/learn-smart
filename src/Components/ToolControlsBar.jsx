import React from "react";
import "./ToolControlsBar.css";

const ToolControlsBar = ({ children }) => {
  return (
    <div className="tool-controls-bar">
      {children}
    </div>
  );
};

export default ToolControlsBar;
