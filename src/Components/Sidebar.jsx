import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ aiToolsData }) {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveClass = (toolId) => {
    return location.pathname.includes(`/aitools/${toolId}`) ? 'active' : '';
  };

  return (
    <div className="sidebar">
      <div className="sidebar-title">AI Tools</div>
      <ul className="sidebar-menu">
        {aiToolsData.map((tool) => (
          <li
            key={tool.id}
            className={`sidebar-tool-item ${getActiveClass(tool.id)}`}
            onClick={() => navigate(`/aitools/${tool.id}`)}
          >
            <img
              src={tool.icon}
              alt={`${tool.name} icon`}
              className="sidebar-tool-icon"
              draggable="false"
            />
            <span className="sidebar-tool-name">{tool.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
