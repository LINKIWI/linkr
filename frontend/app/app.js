import bash from 'highlight.js/lib/languages/bash';
import browserHistory from 'react-router/lib/browserHistory';
import js from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import React from 'react';
import Router from 'react-router/lib/Router';
import {registerLanguage} from 'react-syntax-highlighter/dist/light';

import routes from './routes';

// Explicitly register supported languages for the syntax highlighter
registerLanguage('curl', bash);
registerLanguage('python', python);
registerLanguage('javascript', js);

const App = () => (
  <Router history={browserHistory}>
    {routes}
  </Router>
);

export default App;
