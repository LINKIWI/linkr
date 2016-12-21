import React from 'react';
import {Route} from 'react-router';

import AppRoot from './components/app-root';

import Admin from './components/pages/admin';
import Login from './components/pages/login';
import NotFound from './components/pages/not-found';
import Register from './components/pages/register';
import Shorten from './components/pages/shorten';

import context from './util/context';

export default (
  <Route path="" component={AppRoot}>
    <Route path={context.uris.AdminURI} component={Admin} />
    <Route path={context.uris.LoginURI} component={Login} />
    <Route path={context.uris.UserRegistrationURI} component={Register} />
    <Route path={context.uris.LinkNotFoundURI} component={NotFound} />
    <Route path="*" component={Shorten} />
  </Route>
);
