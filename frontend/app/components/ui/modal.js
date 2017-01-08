/* global setTimeout */

import React from 'react';

/**
 * Component describing a modal within a full-window container.
 */
export default class Modal extends React.Component {
  static propTypes = {
    // True to allow the user to close the modal by clicking outside the modal.
    cancelable: React.PropTypes.bool
  };
  static defaultProps = {
    cancelable: true
  };

  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      style: {
        display: 'none'
      }
    };
  }

  toggleVisibility() {
    const {isVisible} = this.state;

    if (!isVisible) {
      this.showModal();
    } else {
      this.hideModal();
    }
  }

  showModal() {
    const {isVisible} = this.state;

    if (isVisible) {
      return;
    }

    this.setState({
      style: {
        display: 'block',
        opacity: 0
      }
    }, () => setTimeout(() => this.setState({
      style: {
        opacity: 1
      }
    }), 10));

    this.setState({isVisible: true});
  }

  hideModal() {
    const {isVisible} = this.state;

    if (!isVisible) {
      return;
    }

    this.setState({
      style: {
        opacity: 0
      }
    }, () => setTimeout(() => this.setState({
      style: {
        display: 'none'
      }
    }), 150));

    this.setState({isVisible: false});
  }

  handleContainerClick(evt) {
    const {cancelable} = this.props;

    // The modal container's onClick callback will be triggered for the entire DOM tree starting
    // from the parent of the modal container. We only want to hide the modal if the clicked
    // element is the container itself, and not any of its children elements.
    if (evt.target === this.container && cancelable) {
      this.hideModal();
    }
  }

  render() {
    const {style} = this.state;
    const {children} = this.props;

    return (
      <div
        ref={(elem) => {
          this.container = elem;
        }}
        className="modal-container transition"
        style={style}
        onClick={this.handleContainerClick.bind(this)}
      >
        <div className="modal">
          {children}
        </div>
      </div>
    );
  }
}
