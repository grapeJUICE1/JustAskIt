import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Switch, withRouter } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import Posts from './containers/Posts/Posts';

import './App.scss';
import FullPost from './containers/FullPost/FullPost';
import Editor from './components/Editor/Editor';

function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/posts" exact component={Posts} />
        <Route path="/ed" exact component={Editor} />
        <Route path="/posts/post/:id/:slug?" component={FullPost} />
      </Switch>
    </Layout>
  );
}

export default App;
