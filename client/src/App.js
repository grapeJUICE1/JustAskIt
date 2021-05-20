import React, { useEffect } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import Posts from './containers/Posts/Posts';

import './App.scss';
import FullPost from './containers/FullPost/FullPost';
import Login from './containers/Auth/Login/Login';
import Signup from './containers/Auth/signup/signup';
import Profile from './containers/profile/profile';
import Users from './containers/Users/Users';

import TagsPage from './containers/TagsPage/TagsPage';
import { connect } from 'react-redux';
import * as actions from './store/actions/index';

function App(props) {
  useEffect(() => {
    props.onAutoLogin();
    //eslint-disable-next-line
  }, []);
  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/posts" />
        </Route>

        <Route path="/posts" exact component={Posts} />
        <Route path="/posts/post/:id/:slug?" component={FullPost} />
        <Route path="/tags" component={TagsPage} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/profile/:userID" component={Profile} />
        <Route path="/users" component={Users} />
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
