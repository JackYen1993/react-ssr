import React from 'react';
import { Route } from "react-router-dom";
import Home from './components/Home';
import User from './components/User';

export default () => {
  return (
    <>
      <Route exact path="/" component={Home} />
      <Route path="/user" component={User} />
    </>
  );
};
