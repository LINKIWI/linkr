import React from 'react';
import {Route} from 'react-router';

import AppRoot from './components/app-root';

import Admin from './components/pages/admin';
import Alias from './components/pages/alias';
import Login from './components/pages/login';
import Register from './components/pages/register';
import Shorten from './components/pages/shorten';

import context from './util/context';

export default (
  <Route path="" component={AppRoot}>
    <Route path={context.uris.AdminURI} component={Admin} />
    <Route path={context.uris.LoginURI} component={Login} />
    <Route path={context.uris.UserRegistrationURI} component={Register} />
    <Route path={'/:alias'} component={Alias} />
    <Route path="*" component={Shorten} />
  </Route>
);
