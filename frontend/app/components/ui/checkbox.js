import Check from 'react-icons/lib/md/check';
import React from 'react';

const KEY_CODE_SPACE = 32;
const KEY_CODE_ENTER = 13;
const KEY_CODE_ESCAPE = 27;

const noop = () => {};

/**
 * Styled checkbox element.
 */
export default class Checkbox extends React.Component {
  static propTypes = {
    className: React.PropTypes.string,
    style: React.PropTypes.object,
    isChecked: React.PropTypes.bool,
    text: React.PropTypes.string,
    onCheck: React.PropTypes.func,
    onUncheck: React.PropTypes.func
  };
  static defaultProps = {
    className: '',
    style: {},
    isChecked: false,
    onCheck: noop,
    onUncheck: noop
  };

  constructor(props) {
    super(props);

    this.state = {
      isChecked: props.isChecked
    };
  }

  /**
   * Toggle the current check state of the checkbox. This will also trigger the check/uncheck
   * callbacks as appropriate.
   */
  toggleCheckState() {
    const {isChecked} = this.state;
    const {onCheck, onUncheck} = this.props;

    this.setState({
      isChecked: !isChecked
    });

    (isChecked ? onUncheck : onCheck)();
  }

  /**
   * Clicking the checkbox should toggle the current check state.
   */
  handleClick() {
    this.toggleCheckState();
  }

  /**
   * For accessibility compatibility: by default, after clicking on the checkbox, the DOM element
   * will still remain in focus. This workaround forces the DOM to un-focus the element after
   * mousing out, so that the focus style does not clash with the hover style.
   */
  handleMouseOut() {
    this.container.blur();
  }

  /**
   * For accessibility compatibility: while the checkbox is in focus, pressing the space and enter
   * keys should toggle the checkbox while pressing the escape key should always uncheck it.
   *
   * @param {Object} evt The keyboard DOM event.
   * @returns {*} Return value is unused.
   */
  handleKeyDown(evt) {
    const {onUncheck} = this.props;

    switch (evt.keyCode) {
      case KEY_CODE_SPACE:
      case KEY_CODE_ENTER:
        return this.toggleCheckState();
      case KEY_CODE_ESCAPE:
        this.setState({
          isChecked: false
        });
        return onUncheck();
      default:
        return null;
    }
  }

  /**
   * Return whether the checkbox is currently checked.
   *
   * @returns {Boolean} True if the checkbox is currently checked; false otherwise.
   */
  isChecked() {
    return this.state.isChecked;
  }

  render() {
    const {text, className, style} = this.props;
    const {isChecked} = this.state;

    return (
      <div className={className} style={style}>
        <span
          className="check-container transition"
          onClick={this.handleClick.bind(this)}
          draggable="false"
        >
          <span
            ref={(elem) => {
              this.container = elem;
            }}
            className="checkbox transition"
            onMouseOut={this.handleMouseOut.bind(this)}
            onKeyDown={this.handleKeyDown.bind(this)}
            tabIndex={0}
          >
            <Check className={`check ${isChecked ? 'visible' : 'hidden'} transition`} />
          </span>
          <span className="checkbox-text margin-small--left sans-serif iota text-gray-60">
            {text}
          </span>
        </span>
      </div>
    );
  }
}
