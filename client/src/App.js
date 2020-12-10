import React, { useEffect } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import Posts from './containers/Posts/Posts';

import './App.scss';
import FullPost from './containers/FullPost/FullPost';
import Login from './containers/Auth/Login/Login';
import Editor from './components/Editor/Editor';
import { connect } from 'react-redux';
import jwt_decode from 'jwt-decode';

function App(props) {
  useEffect(() => {
    console.log(document.cookie);
  });
  useEffect(() => {
    if (props.token) {
      if (Date.now() <= new Date(jwt_decode(props.token).exp)) {
        console.log('expired');
      }
    }
  });
  return (
    <Layout>
      <Switch>
        <Route path="/posts" exact component={Posts} />
        <Route path="/ed" exact component={Editor} />
        <Route path="/login" exact component={Login} />
        <Route path="/posts/post/:id/:slug?" component={FullPost} />
        <Route path="/" exact>
          <Redirect to="/posts" />
        </Route>
      </Switch>
    </Layout>
  );
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};
export default connect(mapStateToProps)(withRouter(App));
