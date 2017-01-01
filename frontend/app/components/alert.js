import dottie from 'dottie';
import React from 'react';

export const ALERT_TYPE_INFO = 'alertTypeInfo';
export const ALERT_TYPE_SUCCESS = 'alertTypeSuccess';
export const ALERT_TYPE_WARN = 'alertTypeWarn';
export const ALERT_TYPE_ERROR = 'alertTypeError';

/**
 * Alert banner component.
 */
export default class Alert extends React.Component {
  static propTypes = {
    type: React.PropTypes.oneOf([
      ALERT_TYPE_INFO,
      ALERT_TYPE_SUCCESS,
      ALERT_TYPE_WARN,
      ALERT_TYPE_ERROR
    ]),
    title: React.PropTypes.string,
    message: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element
    ]),
    failure: React.PropTypes.string,
    failureMessages: React.PropTypes.object,
    className: React.PropTypes.string
  };
  static defaultProps = {
    type: ALERT_TYPE_INFO
  };

  render() {
    const {type, title, message, failure, failureMessages, className} = this.props;
    const alertClasses = {
      [ALERT_TYPE_INFO]: 'text-blue',
      [ALERT_TYPE_SUCCESS]: 'alert-success text-green',
      [ALERT_TYPE_WARN]: 'alert-warn text-orange',
      [ALERT_TYPE_ERROR]: 'alert-error text-red'
    };

    return (
      <div className={`alert ${alertClasses[type]} sans-serif gamma margin-large--bottom ${className}`}>
        <span className="alert-title sans-serif bold">{title}</span>&nbsp;
        <span className="alert-message">
          {(type === ALERT_TYPE_ERROR && dottie.get(failureMessages, failure)) || message}
        </span>
      </div>
    );
  }
}
