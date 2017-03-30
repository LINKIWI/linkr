/* global setTimeout */

import React from 'react';

/**
 * DOM paint splash screen.
 */
export default class Splash extends React.Component {
  constructor() {
    super();

    this.state = {
      opacity: 1
    };
  }

  destroy() {
    setTimeout(() => this.setState({opacity: 0}), 10);
  }

  render() {
    const {opacity} = this.state;

    return (
      <div
        className="bg-white transition"
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          width: '100%',
          height: '100vh',
          zIndex: 1000,
          opacity
        }}
      />
    );
  }
}
