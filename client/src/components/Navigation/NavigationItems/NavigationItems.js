import React from 'react';
import { Nav } from 'react-bootstrap';

const NavigationItems = () => {
  return (
    <Nav className="ml-auto  flex-nowrap">
      <Nav.Link href="#deets">Login</Nav.Link>
      <Nav.Link href="#ggg">Signup</Nav.Link>
    </Nav>
  );
};

export default NavigationItems;
