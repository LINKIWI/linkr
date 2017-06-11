import Close from 'react-icons/lib/md/close';
import copy from 'copy-to-clipboard';
import Copy from 'react-icons/lib/md/content-copy';
import React from 'react';
import urlParse from 'url-parse';

import Tooltip from '../../ui/tooltip';

import context from '../../../util/context';

export default class RecentLinkActions extends React.Component {
  constructor() {
    super();

    this.state = {
      isAliasCopied: false
    };
  }

  handleCopyClick() {
    const {alias} = this.props;
    const fullURL = `${urlParse(context.config.linkr_url).href}/${alias}`;

    copy(fullURL);
    this.setState({isAliasCopied: true});
  }

  handleRemoveClick() {
    this.props.handleRemoveClick();
  }

  render() {
    const {isAliasCopied} = this.state;

    return (
      <span>
        <Tooltip
          contents={
            <span className="sans-serif kilo">
              {isAliasCopied ? 'Done!' : 'Copy link to clipboard'}
            </span>
          }
          tooltipStyle={{
            left: '-40px',
            width: '70px'
          }}
        >
          <Copy
            className="link-action-icon transition"
            onClick={this.handleCopyClick.bind(this)}
          />
        </Tooltip>

        <Tooltip
          contents={
            <span className="sans-serif kilo">Remove this link from recent history</span>
          }
          tooltipStyle={{
            left: '-66px',
            width: '120px'
          }}
        >
          <Close
            className="link-action-icon transition"
            onClick={this.handleRemoveClick.bind(this)}
          />
        </Tooltip>
      </span>
    );
  }
}
