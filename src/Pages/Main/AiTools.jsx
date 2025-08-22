import React, { Fragment } from 'react';
import { Outlet } from 'react-router-dom';
import aiToolsData from '../../data/AiTools';
import NavBar from '../../Components/NavBar';
import Sidebar from '../../Components/Sidebar';

function AiTools() {
  return (
    <Fragment>
      <NavBar />
      <div className='flex h-screen bg-gray-50 dark:bg-gray-900'>
        {/* Sidebar on the left */}
        <Sidebar aiToolsData={aiToolsData} />

        {/* Tool display on the right */}
        <div className='flex-1 overflow-auto'>
          <Outlet />
        </div>
      </div>
    </Fragment>
  );
}

export default AiTools;
