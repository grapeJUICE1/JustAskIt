import React, { useEffect } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import Posts from './containers/Posts/Posts';

import './App.scss';
import FullPost from './containers/FullPost/FullPost';
import Login from './containers/Auth/Login/Login';
import Signup from './containers/Auth/signup/signup';
import Profile from './containers/profile/profile';
import Editor from './components/Editor/Editor';
import { connect } from 'react-redux';
import * as actions from './store/actions/index';

function App(props) {
  useEffect(() => {
    props.onAutoLogin();
  }, []);
  return (
    <Layout>
      <Switch>
        <Route path="/posts" exact component={Posts} />
        <Route path="/ed" exact component={Editor} />
        <Route path="/login" exact component={Login} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/profile/:userID" exact component={Profile} />
        <Route path="/posts/post/:id/:slug?" component={FullPost} />
        <Route path="/" exact>
          <Redirect to="/posts" />
        </Route>
      </Switch>
    </Layout>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAutoLogin: () => dispatch(actions.autoLogin()),
  };
};
export default connect(null, mapDispatchToProps)(withRouter(App));
