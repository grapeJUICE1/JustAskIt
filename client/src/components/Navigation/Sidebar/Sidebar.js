import React, { useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'react-router-dom';

import './Sidebar.scss';

const Sidebar = () => {
  const [isMenuOpen, handleMenu] = useState(false);
  const handleCloseMenu = () => {
    handleMenu(false);
  };
  const handleStateChange = (state) => {
    handleMenu(state.isOpen);
  };
  return (
    <Menu
      className="pt-5"
      width={'130px'}
      isOpen={isMenuOpen}
      onStateChange={handleStateChange}
    >
      <Link
        id="posts"
        style={{ color: 'lightgray' }}
        onClick={handleCloseMenu}
        className="menu-item"
        to="/posts"
      >
        Posts
      </Link>
      <br />
      <Link
        id="users"
        style={{ color: 'lightgray' }}
        onClick={handleCloseMenu}
        className="menu-item"
        to="/users"
      >
        Users
      </Link>
      <br />
      <Link
        id="users"
        style={{ color: 'lightgray' }}
        onClick={handleCloseMenu}
        className="menu-item"
        to="/tags"
      >
        Tags
      </Link>
    </Menu>
  );
};

export default Sidebar;
