import React from 'react';
import {IndexRedirect, Route} from 'react-router';

import AppRoot from './components/app-root';
import Header from './components/header';

export default (
  <Route path="" component={AppRoot}>
    <Route path="*" component={Header} />
  </Route>
);
