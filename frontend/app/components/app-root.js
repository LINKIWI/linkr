import csjs from 'csjs-inject';
import Favicon from 'react-favicon';
import React from 'react';

import fonts from '../../resources/blobs/fonts';

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
      name: 'karla-italic',
      data: fonts.karlaItalic,
      file: 'karla-italic.ttf'
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

const AppRoot = ({children}) => (
  <div className="app-root">
    <Favicon
      animated={false}
      url={['/static/img/favicon.png']}
    />
    {children}
  </div>
);

export default AppRoot;
