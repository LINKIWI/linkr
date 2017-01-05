import React from 'react';
import {Route} from 'react-router';

import AppRoot from './components/app-root';

import Account from './components/pages/account';
import Admin from './components/pages/admin';
import AdminLinkDetails from './components/pages/admin-link-details';
import Alias from './components/pages/alias';
import Login from './components/pages/login';
import Register from './components/pages/register';
import Shorten from './components/pages/shorten';

import context from './util/context';

const routes = (
  <Route path="" component={AppRoot}>
    <Route path={context.uris.AdminURI} component={Admin} />
    <Route path={context.uris.AdminLinkDetailsURI} component={AdminLinkDetails} />
    <Route path={context.uris.LoginURI} component={Login} />
    <Route path={context.uris.UserRegistrationURI} component={Register} />
    <Route path={context.uris.LinkAliasURI} component={Alias} />
    <Route path={context.uris.UserAccountURI} component={Account} />
    <Route path="*" component={Shorten} />
  </Route>
);

export default routes;
