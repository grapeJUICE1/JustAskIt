import React from 'react';
import styles from './loginSignupBox.module.scss';
import { Container } from 'react-bootstrap';
import classnames from 'classnames';

function loginSignupBox({ data, inputs, title }) {
  const inputChangeHandler = (evt, field) => {
    evt.preventDefault();
    data.setState({ [field]: evt.target.value });
  };
  const focus = (evt) => {
    evt.preventDefault();
    data.setState({ spanStyle: { opacity: 0 } });
  };
  const blur = (evt) => {
    evt.preventDefault();
    data.setState({ spanStyle: { opacity: 1 } });
  };

  const submitHandler = async (evt) => {
    evt.preventDefault();
    await data.authenticate();

    if (!data.props.error && data.props.isAuthenticated) {
      data.setState({
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
        data.props.history.push('/posts');
      }, 1000);
    } else {
      data.setState({
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

  return (
    <Container className="d-flex flex-column justify-content-between ml-lg-4 pt-5 mt-5">
      <form className={styles.login} onSubmit={submitHandler}>
        <fieldset>
          <legend className={styles.legend}>{title}</legend>
          {inputs.map((inp, ind) => (
            <div key={ind} className={styles.input}>
              <input
                style={data.state.inputStyle}
                onFocus={focus}
                onBlur={blur}
                onChange={(evt) => inputChangeHandler(evt, inp[1])}
                type={inp[0]}
                placeholder={inp[1]}
                required
              />
              <span style={data.state.spanStyle}>
                <i className="far fa-envelope"></i>
              </span>
            </div>
          ))}

          <button
            type="submit"
            style={data.state.submitButtonStyle}
            className={styles.submit}
          >
            <i
              className={classnames({
                'fas fa-long-arrow-alt-right': !data.props.isAuthenticated,
                'fas fa-check': data.props.isAuthenticated,
              })}
            ></i>
          </button>
        </fieldset>

        <div className={styles.feedback} style={data.state.feedbackStyle}>
          {data.props.error ? data.props.error.message : 'login successful'}{' '}
          <br />
          {!data.props.error ? 'redirecting...' : null}
        </div>
      </form>
    </Container>
  );
}

export default loginSignupBox;
