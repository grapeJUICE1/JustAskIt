import React, { useEffect } from 'react';
import axios from '../axios-main';
import { useAlert } from 'react-alert';
import { connect } from 'react-redux';

import * as actions from '../store/actions/index';

const checkAuth = (Wrapped) => {
  function CheckAuth(props) {
    const alert = useAlert();
    useEffect(() => {
      const resInt = axios.interceptors.response.use(
        (response) => {
          // Do something with response data
          return response;
        },
        async (error) => {
          console.log(error.response.data.message);
          switch (error.response.status) {
            case 401:
              alert.error(error.response.data.message);
              if (props.user) {
                await props.onLogout();
              }
              break;
            case 429:
              alert.error(error.response.data.message);
              break;
            case 500:
              alert.error('OOps .... Error occured ... try again later');
              break;
            case 404:
              alert.error(error.response.data.message);
              break;
            default:
              if (error.response.data.message)
                alert.error(error.response.data.message);
              else alert.error('OOps .... Error occured ... try again later');
          }
          return Promise.reject(error);
        }
      );

      return function cleanup() {
        axios.interceptors.response.eject(resInt);
      };
    });

    return <Wrapped {...props} />;
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

  return connect(mapStateToProps, mapDispatchToProps)(CheckAuth);
};

export default checkAuth;
