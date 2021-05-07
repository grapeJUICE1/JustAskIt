import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import styles from './Login.module.scss';
import classnames from 'classnames';
import { connect } from 'react-redux';

import loginSignupBox from '../../../components/auth/loginSignupBox';
import * as actions from '../../../store/actions/index';

class Login extends Component {
  state = {
    spanStyle: {},
    submitButtonStyle: {},
    feedbackStyle: {},
    inputStyle: {},
    email: '',
    password: '',
  };
  authenticate = async () => {
    await this.props.onLogin({
      email: this.state.email,
      password: this.state.password,
    });
  };

  render() {
    let data = this;
    return loginSignupBox({
      data,
      inputs: [
        ['email', 'email'],
        ['password', 'password'],
      ],
      title: 'Login',
    });
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.user,
    error: state.auth.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (data) => dispatch(actions.login(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
