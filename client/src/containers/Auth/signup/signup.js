import { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import loginSignupBox from '../../../components/auth/loginSignupBox';

import * as actions from '../../../store/actions/index';

class Signup extends Component {
  state = {
    spanStyle: {},
    submitButtonStyle: {},
    feedbackStyle: {},
    inputStyle: {},
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  };
  authenticate = async () => {
    await this.props.onSignup({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm,
    });
  };

  render() {
    let data = this;
    return loginSignupBox({
      data,
      inputs: [
        ['name', 'name'],
        ['email', 'email'],
        ['password', 'password'],
        ['passwordConfirm', 'passwordConfirm'],
      ],
      title: 'Signup',
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
    onSignup: (data) => dispatch(actions.signup(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Signup));
