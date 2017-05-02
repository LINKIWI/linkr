import browserHistory from 'react-router/lib/browserHistory';
import KeyboardBackspace from 'react-icons/lib/md/keyboard-backspace';
import React from 'react';

/**
 * Back arrow for reverse history navigation. Effectively, provides a UI component for programmatic
 * invocation of the browser's back button.
 */
const BackNav = () => (
  <div className="margin--bottom">
    <span className="back-nav text-primary transition" onClick={browserHistory.goBack}>
      <KeyboardBackspace className="margin--right" />
      <span className="sans-serif bold kilo">
        GO BACK
      </span>
    </span>
  </div>
);

export default BackNav;
