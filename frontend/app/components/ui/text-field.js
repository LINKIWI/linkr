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

  constructor() {
    super();

    this.state = {value: ''};
  }

  /**
   * Update the text field's internal state to reflect the change in input.
   *
   * @param {Object} evt DOM event object.
   */
  handleOnChange(evt) {
    this.setState({value: evt.target.value});
  }

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
    const {className, style, icon, iconSpacing, onChange = () => {}, ...props} = this.props;
    const {value} = this.state;

    return (
      <div className="text-field-container transition">
        <input
          ref={(elem) => {
            this.input = elem;
          }}
          className={`text-field transition ${className}`}
          autoComplete="off"
          style={{
            paddingLeft: icon ? iconSpacing : null,
            ...style
          }}
          value={value}
          onChange={(evt) => {
            this.handleOnChange(evt);
            onChange(evt);
          }}
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
