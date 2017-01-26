import {browserHistory} from 'react-router';
import KeyboardBackspace from 'react-icons/lib/md/keyboard-backspace';
import React from 'react';

/**
 * Back arrow for reverse history navigation. Effectively, provides a UI component for programmatic
 * invocation of the browser's back button.
 */
const BackNav = () => (
  <div
    className="back-nav margin--bottom text-primary transition"
    onClick={browserHistory.goBack}
  >
    <KeyboardBackspace className="margin--right" />
    <span className="sans-serif bold kilo">
      GO BACK
    </span>
  </div>
);

export default BackNav;
