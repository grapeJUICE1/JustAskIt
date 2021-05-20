import React, { useState } from 'react';
import { Nav } from 'react-bootstrap';
import { withRouter, Redirect } from 'react-router';
import { connect } from 'react-redux';
import { useAlert } from 'react-alert';
import * as actions from '../../../store/actions/index';

// import React from 'react'

function NavigationItems(props) {
  const alert = useAlert();
  const [redirect, setRedirect] = useState(null);

  // useEffect(() => {}, [redirect]);
  return (
    <>
      {redirect ? <Redirect to={redirect} /> : ''}
      <Nav className="ml-auto  flex-nowrap">
        {props.user ? (
          <>
            <Nav.Link
              onClick={(e) => props.history.push(`/profile/${props.user._id}`)}
            >
              Profile
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                props.onLogout();
                alert.info('logging out');
                setTimeout(() => {
                  setRedirect('/login');
                }, 1000);
              }}
            >
              Logout
            </Nav.Link>
          </>
        ) : (
          <>
            <Nav.Link onClick={(e) => props.history.push('/login')}>
              Login
            </Nav.Link>
            <Nav.Link onClick={(e) => props.history.push('/signup')}>
              Signup
            </Nav.Link>
          </>
        )}
      </Nav>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => dispatch(actions.logout()),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NavigationItems));
