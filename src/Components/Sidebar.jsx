import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Sidebar.css';

function Sidebar({ aiToolsData }) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveClass = (toolId) =>
    location.pathname.includes(`/aitools/${toolId}`) ? 'active' : '';

  return (
    <div className={`sidebar-shell ${isOpen ? 'open' : 'closed'}`}>
      {/* Sidebar */}
      <aside id="app-sidebar" className="sidebar">
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
      </aside>

      {/* Toggle Button */}
      <button
        className="sidebar-toggle-btn"
        aria-controls="app-sidebar"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        title={isOpen ? 'Hide sidebar' : 'Show sidebar'}
      >
        {isOpen ? '❮' : '❯'}
      </button>
    </div>
  );
}

export default Sidebar;
