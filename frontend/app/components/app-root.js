/* global setTimeout */

import Favicon from 'react-favicon';
import React from 'react';

import Splash from './splash';

export default class AppRoot extends React.Component {
  constructor() {
    super();

    this.state = {
      splashVisible: true
    };
  }

  componentDidMount() {
    this.splash.destroy();

    setTimeout(() => this.setState({splashVisible: false}), 160);
  }

  render() {
    const {children} = this.props;
    const {splashVisible} = this.state;

    return (
      <div className="app-root">
        <Favicon
          animated={false}
          url={['/static/img/favicon.png']}
        />
        {
          splashVisible && (
            <Splash ref={(elem) => {
              this.splash = elem;
            }} />
          )
        }
        {children}
      </div>
    );
  }
}
