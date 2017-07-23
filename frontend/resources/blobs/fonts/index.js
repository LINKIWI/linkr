import karlaBold from './karla-bold.txt';
import karlaRegular from './karla-regular.txt';
import sourceCodeProMedium from './source-code-pro-medium.txt';
import sourceCodeProRegular from './source-code-pro-regular.txt';

/**
 * Factory function for generating a CSS @font-face declaration.
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
           url('/linkr/static/fonts/${file}');
    }
  `;
}

export default {
  fontFaceStyle,
  karlaBold,
  karlaRegular,
  sourceCodeProMedium,
  sourceCodeProRegular
};
