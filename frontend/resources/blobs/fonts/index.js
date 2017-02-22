import karlaBold from './karla-bold.txt';
import karlaBoldItalic from './karla-bold-italic.txt';
import karlaItalic from './karla-italic.txt';
import karlaRegular from './karla-regular.txt';
import sourceCodeProMedium from './source-code-pro-medium.txt';
import sourceCodeProRegular from './source-code-pro-regular.txt';

/**
 * Factory function for generating a CSS @font-face declaration.
 *
 * TODO: inline styles migration, move this to a styles folder as a factory function on font styles
 *
 * @param {String} name Name of the font-family.
 * @param {String} data Base64-encoded font data.
 * @param {String} file Name of the static font file, to use as a fallback.
 * @returns {String} CSS @font-face declaration for this font.
 */
function fontFaceStyle(name, data, file) {
  return `
    @font-face {
      font-family: '${name}';
      src: url(data:application/x-font-ttf;base64,${data}),
           url('/static/fonts/${file}');
    }
  `;
}

export default {
  fontFaceStyle,
  karlaBold,
  karlaBoldItalic,
  karlaItalic,
  karlaRegular,
  sourceCodeProMedium,
  sourceCodeProRegular
};
