import React from 'react';
import {Route} from 'react-router';

import Admin from './components/pages/admin';
import AppRoot from './components/app-root';
import context from './util/context';
import NotFound from './components/pages/not-found';
import Shorten from './components/pages/shorten';

export default (
  <Route path="" component={AppRoot}>
    <Route path={context.uris.AdminURI} component={Admin} />
    <Route path={context.uris.LinkNotFoundURI} component={NotFound} />
    <Route path="*" component={Shorten} />
  </Route>
);
