import bash from 'highlight.js/lib/languages/bash';
import js from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import React from 'react';
import {Router, browserHistory} from 'react-router';
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
