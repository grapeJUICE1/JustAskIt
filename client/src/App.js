import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Switch, withRouter } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import Posts from './containers/Posts/Posts';

import './App.scss';

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/posts" component={Posts} />
      </Switch>
    </Layout>
  );
}

export default withRouter(App);
