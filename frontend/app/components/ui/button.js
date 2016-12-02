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

  render() {
    const {className, style, text, disabled, onClick} = this.props;

    return (
      <button
        className={`button ${disabled ? 'disabled' : ''} ${className}`}
        style={style}
        onClick={disabled ? noop : onClick}
      >
        {text}
      </button>
    );
  }
}
