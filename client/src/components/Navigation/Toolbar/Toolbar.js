import React from 'react';
import { Navbar } from 'react-bootstrap';
import NavigationItems from '../NavigationItems/NavigationItems';
import Sidebar from '../Sidebar/Sidebar';

const Toolbar = () => {
  return (
    <Navbar
      style={{ backgroundColor: 'rgb(202, 149, 122)' }}
      variant="light"
      fixed="top"
    >
      <Sidebar />
      <Navbar.Brand className="ml-3" href="/posts">
        <img
          alt="logo"
          src="https://res.cloudinary.com/grapecluster/image/upload/v1621597330/justAskItLogo.png"
          style={{ width: '6.25rem' }}
        />
      </Navbar.Brand>
      <NavigationItems />
    </Navbar>
  );
};

export default Toolbar;
