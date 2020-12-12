import React from 'react';
import { Nav } from 'react-bootstrap';
import { withRouter } from 'react-router';

const NavigationItems = (props) => {
  return (
    <Nav className="ml-auto  flex-nowrap">
      <Nav.Link onClick={(e) => props.history.push('/login')}>Login</Nav.Link>
      <Nav.Link onClick={(e) => props.history.push('/login')}>Signup</Nav.Link>
    </Nav>
  );
};

export default withRouter(NavigationItems);
