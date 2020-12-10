import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import styles from './Login.module.scss';
import classnames from 'classnames';
import { connect } from 'react-redux';

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
  inputChangeHandler = (evt, field) => {
    evt.preventDefault();
    this.setState({ [field]: evt.target.value });
  };
  focus = (evt) => {
    evt.preventDefault();
    this.setState({ spanStyle: { opacity: 0 } });
  };
  blur = (evt) => {
    evt.preventDefault();
    this.setState({ spanStyle: { opacity: 1 } });
  };

  submitHandler = async (evt) => {
    evt.preventDefault();
    await this.authenticate();

    if (!this.props.error && this.props.isAuthenticated) {
      this.setState({
        submitButtonStyle: {
          background: '#2ecc71',
          borderColor: '#2ecc71',
        },
        feedbackStyle: {
          transition: 'all .4s',
          display: 'block',
          opacity: 1,
          bottom: '-80px',
        },
        inputStyle: { borderColor: '#2ecc71' },
      });
      setTimeout(() => {
        this.props.history.push('/posts');
      }, 1000);
    } else {
      this.setState({
        submitButtonStyle: {
          background: 'red',
          borderColor: 'red',
        },
        feedbackStyle: {
          transition: 'all .4s',
          display: 'block',
          opacity: 1,
          bottom: '-80px',
          backgroundColor: 'red',
        },
        inputStyle: { borderColor: 'red' },
      });
    }
  };
  render() {
    return (
      <Container className="d-flex flex-column justify-content-between ml-lg-4 pt-5 mt-5">
        <form className={styles.login} onSubmit={this.submitHandler}>
          <fieldset>
            <legend className={styles.legend}>Login</legend>

            {/* <div className={styles.input}>
              <input
                onFocus={focus}
                onBlur={blur}
                onChange={(evt) => this.inputChangeHandler(evt, 'username')}
                type="text"
                placeholder="username"
                required
              />
              <span style={this.state.spanStyle}>
                <i className="far fa-user"></i>
              </span>
            </div> */}
            <div className={styles.input}>
              <input
                style={this.state.inputStyle}
                onFocus={this.focus}
                onBlur={this.blur}
                onChange={(evt) => this.inputChangeHandler(evt, 'email')}
                type="email"
                placeholder="Email"
                required
              />
              <span style={this.state.spanStyle}>
                <i className="far fa-envelope"></i>
              </span>
            </div>

            <div className={styles.input}>
              <input
                style={this.state.inputStyle}
                type="password"
                placeholder="Password"
                onFocus={this.focus}
                onBlur={this.blur}
                onChange={(evt) => this.inputChangeHandler(evt, 'password')}
                required
              />
              <span style={{ ...this.state.spanStyle }}>
                <i className="fas fa-lock"></i>
              </span>
            </div>
            {/* <div className={styles.input}>
              <input
                type="password"
                placeholder="Confirm password"
                onFocus={focus}
                onBlur={blur}
                onChange={(evt) =>
                  this.inputChangeHandler(evt, 'passwordConfirm')
                }
                required
              />
              <span style={{ ...this.state.spanStyle }}>
                <i className="fas fa-lock"></i>
              </span>
            </div> */}

            <button
              type="submit"
              style={this.state.submitButtonStyle}
              className={styles.submit}
            >
              <i
                className={classnames({
                  'fas fa-long-arrow-alt-right': !this.props.isAuthenticated,
                  'fas fa-check': this.props.isAuthenticated,
                })}
              ></i>
            </button>
          </fieldset>

          <div className={styles.feedback} style={this.state.feedbackStyle}>
            {this.props.error ? this.props.error.message : 'login successful'}{' '}
            <br />
            {!this.props.error ? 'redirecting...' : null}
          </div>
        </form>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.token != null,
    error: state.auth.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (data) => dispatch(actions.login(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Login));
