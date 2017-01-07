import {browserHistory} from 'react-router';
import React from 'react';

import Tooltip from './ui/tooltip';

/**
 * Link with a stateful tooltip. Clicking on the link for the first time induces a transition.
 */
export default class LinkTooltip extends React.Component {
  static propTypes = {
    textBeforeTransition: React.PropTypes.string,
    textAfterTransition: React.PropTypes.string,
    tooltipClassName: React.PropTypes.string,
    linkClassName: React.PropTypes.string,
    href: React.PropTypes.string,
    text: React.PropTypes.string,
    onTransition: React.PropTypes.func
  };
  static defaultProps = {
    href: '#',
    onTransition: () => {}
  };

  constructor(props) {
    super(props);

    this.state = {
      isStateTransitioned: false
    };
  }

  handleLinkClick(evt) {
    const {href, onTransition} = this.props;
    const {isStateTransitioned} = this.state;
    evt.preventDefault();

    if (isStateTransitioned) {
      browserHistory.push(href);
    } else {
      onTransition(evt);
      this.setState({isStateTransitioned: true});
    }
  }

  render() {
    const {
      href,
      text,
      textBeforeTransition,
      textAfterTransition,
      tooltipClassName,
      linkClassName
    } = this.props;
    const {isStateTransitioned} = this.state;

    return (
      <Tooltip
        tooltipClassName={tooltipClassName}
        contents={
          <p className="sans-serif">
            {isStateTransitioned ? textAfterTransition : textBeforeTransition}
          </p>
        }
      >
        <a className={linkClassName} href={href} onClick={this.handleLinkClick.bind(this)}>
          {text || href}
        </a>
      </Tooltip>
    );
  }
}
