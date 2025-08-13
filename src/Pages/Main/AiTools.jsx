import React, { Fragment } from 'react';
import { Outlet } from 'react-router-dom'; 
import aiToolsData from '../../data/AiTools';
import './AiTools.css';
import NavBar from '../../Components/NavBar';
// import Footer from '../../Components/Footer';
import Sidebar from '../../Components/Sidebar';

function AiTools() {
  return (
    <Fragment>
      <NavBar />
      <div className="ai-tools-page">
        {/* Sidebar on the left */}
        <Sidebar aiToolsData={aiToolsData} />

        {/* Tool display on the right */}
        <div className="tool-display">
          <Outlet /> {/* 👈 This will load the selected tool */}
        </div>
      </div>
    </Fragment>
  );
}

export default AiTools;
