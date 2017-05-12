/* global config */

import bash from 'highlight.js/lib/languages/bash';
import browserHistory from 'react-router/lib/browserHistory';
import dottie from 'dottie';
import js from 'highlight.js/lib/languages/javascript';
import PiwikReactRouter from 'piwik-react-router';
import python from 'highlight.js/lib/languages/python';
import React from 'react';
import Router from 'react-router/lib/Router';
import {registerLanguage} from 'react-syntax-highlighter/dist/light';

import routes from './routes';

// Explicitly register supported languages for the syntax highlighter
registerLanguage('curl', bash);
registerLanguage('python', python);
registerLanguage('javascript', js);

// Piwik initialization
const piwik = dottie.get(config, 'options.piwik.url') && PiwikReactRouter(config.options.piwik);

const App = () => (
  <Router history={piwik ? piwik.connectToHistory(browserHistory) : browserHistory}>
    {routes}
  </Router>
);

export default App;
