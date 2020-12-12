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
      <Navbar.Brand href="#home" className="ml-3">
        <h3>JustAskIt</h3>
      </Navbar.Brand>
      <NavigationItems />
    </Navbar>
  );
};

export default Toolbar;
