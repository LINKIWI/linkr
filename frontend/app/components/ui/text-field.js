import React from 'react';

/**
 * A styled text input entry field.
 */
export default class TextField extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    style: React.PropTypes.object,
    placeholder: React.PropTypes.string,
    type: React.PropTypes.string,
    onChange: React.PropTypes.func
  };
  static defaultProps = {
    className: '',
    style: {},
    type: 'text',
    onChange: () => {}
  };

  /**
   * Retrieve the current value of the input field.
   *
   * @returns {String} The current value of the input field.
   */
  getValue() {
    return this.input.value;
  }

  /**
   * Set the value of the input field.
   *
   * @param {String} text String to which the input value should be set.
   */
  setValue(text) {
    this.input.value = text;
  }

  render() {
    const {className, style, placeholder, type, onChange} = this.props;

    return (
      <input
        ref={(elem) => {
          this.input = elem;
        }}
        className={`text-field ${className}`}
        type={type}
        style={style}
        placeholder={placeholder}
        autoComplete="off"
        onChange={onChange}
      />
    );
  }
}
