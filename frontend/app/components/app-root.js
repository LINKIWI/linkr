/* global setTimeout */

import csjs from 'csjs-inject';
import Favicon from 'react-favicon';
import React from 'react';

import fonts from '../../resources/blobs/fonts';
import Splash from './splash';

/**
 * On client-side application initialization, inject global CSS styles into the document head.
 * WARNING: The operations taken by this function are *stateful* and *have side effects*. This
 * function should only be called once.
 */
function injectGlobalStyles() {
  const fontsMeta = [
    {
      name: 'karla-regular',
      data: fonts.karlaRegular,
      file: 'karla-regular.ttf'
    },
    {
      name: 'karla-bold',
      data: fonts.karlaBold,
      file: 'karla-bold.ttf'
    },
    {
      name: 'source-code-pro-regular',
      data: fonts.sourceCodeProRegular,
      file: 'source-code-pro-regular.ttf'
    },
    {
      name: 'source-code-pro-medium',
      data: fonts.sourceCodeProMedium,
      file: 'source-code-pro-medium.ttf'
    }
  ];

  fontsMeta.forEach((font) => csjs.csjs([fonts.fontFaceStyle(font.name, font.data, font.file)]));
}

injectGlobalStyles();

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
