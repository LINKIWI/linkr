import React from 'react';

export default class Menu extends React.Component {
  static propTypes = {
    // TODO
    className: React.PropTypes.string,
    style: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  render() {
    const {onOpen, onClose, className, style} = this.props;

    return (
      <div
        className={`menu-icon ${this.state.isOpen ? 'open' : ''} ${className}`}
        style={style}
        onClick={() => {
          this.setState({
            isOpen: !this.state.isOpen
          });
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    );
  }
}
