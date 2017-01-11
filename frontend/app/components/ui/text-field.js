import extend from 'deep-extend';
import React from 'react';

/**
 * A styled text input entry field.
 */
export default class TextField extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    icon: React.PropTypes.element,
    iconSpacing: React.PropTypes.string
  };
  static defaultProps = {
    className: ''
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
    const {className, style, icon, iconSpacing, ...props} = this.props;

    return (
      <div className="text-field-container transition">
        <input
          ref={(elem) => {
            this.input = elem;
          }}
          className={`text-field transition ${className}`}
          autoComplete="off"
          style={extend({
            paddingLeft: icon ? iconSpacing : null
          }, style)}
          {...props}
        />
        {
          icon && (
            <span className="text-field-icon">
              {icon}
            </span>
          )
        }
      </div>
    );
  }
}
