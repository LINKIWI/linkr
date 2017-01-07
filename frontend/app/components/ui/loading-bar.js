/* global setTimeout, clearTimeout */

import React from 'react';

export const POSITION_LEFT = 0;
export const POSITION_RIGHT = 100;
export const BOUNCE_INTERVAL = 1200;

/**
 * Describes a globally-positioned loading bar animation.
 */
export default class LoadingBar extends React.Component {
  static propTypes = {
    show: React.PropTypes.bool
  };
  static defaultProps = {
    show: true
  };

  constructor(props) {
    super(props);

    this.state = {
      // Describes the horizontal position of the loading bar
      position: POSITION_LEFT
    };
  }

  componentDidMount() {
    // When the component mounts, we want to immediately start the animation from left to right.
    // However, to avoid a race condition whereby we update the state while the component is mounting,
    // we will queue this event to occur as soon as possible *after* the component is mounted. It
    // is also necessary to record the interval as a class property to that it can be canceled promptly
    // if the component is immediately unmounted.
    this.interval = setTimeout(() => this.tick(), 1);
  }

  componentWillUnmount() {
    clearTimeout(this.interval);
  }

  tick() {
    // On every tick, we'll update the position to the other boundary.
    // Additionally, we'll schedule another tick for BOUNCE_INTERVAL ms from now.
    this.setState({
      position: this.state.position === POSITION_LEFT ? POSITION_RIGHT : POSITION_LEFT
    });
    this.interval = setTimeout(() => this.tick(), BOUNCE_INTERVAL);
  }

  render() {
    const {show} = this.props;
    const {position} = this.state;
    const offset = position === POSITION_LEFT ? -POSITION_RIGHT : POSITION_LEFT;

    return show && (
      <div className="loading-bar-container">
        <div className="loading-bar" style={{
          marginLeft: `calc(${position}% + ${offset}px)`
        }} />
      </div>
    );
  }
}
