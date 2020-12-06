import React from 'react';
import { slide as Menu } from 'react-burger-menu';

import './Sidebar.scss';

const Sidebar = () => {
  return (
    <Menu className="pt-5">
      <a id="home" className="menu-item" href="#">
        Home
      </a>
      <a id="about" className="menu-item" href="#">
        About
      </a>
      <a id="contact" className="menu-item" href="#">
        Contact
      </a>
      <a className="menu-item--small" href="#">
        Settings
      </a>
    </Menu>
  );
};

export default Sidebar;
