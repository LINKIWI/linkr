import React from 'react';

const noop = () => {};

/**
 * Styled button element.
 */
export default class Button extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    style: React.PropTypes.object,
    text: React.PropTypes.string,
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func
  };
  static defaultProps = {
    className: '',
    style: {},
    text: '',
    disabled: false,
    onClick: noop
  };

  /**
   * For accessibility compatibility: by default, after clicking on the button, the DOM element
   * will still remain in focus. This workaround forces the DOM to un-focus the element after
   * mousing out, so that the focus style does not clash with the hover style.
   */
  handleMouseOut() {
    this.button.blur();
  }

  render() {
    const {className, style, text, disabled, onClick} = this.props;

    return (
      <button
        ref={(elem) => {
          this.button = elem;
        }}
        className={`button ${disabled ? 'disabled' : ''} ${className}`}
        style={style}
        onClick={disabled ? noop : onClick}
        onMouseOut={this.handleMouseOut.bind(this)}
      >
        {text}
      </button>
    );
  }
}
