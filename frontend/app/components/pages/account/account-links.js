import copy from 'copy-to-clipboard';
import dottie from 'dottie';
import humanize from 'humanize';
import React from 'react';
import request from 'browser-request';

import AccountLinkActions from './account-link-actions';
import LinkTooltip from '../../link-tooltip';
import Table from '../../table';

import Button from '../../ui/button';

import context from '../../../util/context';

/**
 * Table of links created under this user account.
 */
export default class AccountLinks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userLinks: [],
      userLinksPageNum: 0
    };
  }

  componentDidMount() {
    this.loadUserLinks((_, json) => this.setState({
      userLinks: dottie.get(json, 'links')
    }));
  }

  loadUserLinks(cb) {
    const {loading} = this.props;
    const {userLinksPageNum} = this.state;

    loading((done) => request.post({
      url: context.uris.LinksForUserURI,
      json: {
        /* eslint-disable camelcase */
        page_num: userLinksPageNum,
        num_per_page: 10
        /* eslint-enable camelcase */
      }
    }, (err, resp, json) => {
      cb(err, json);
      return done();
    }));
  }

  handleLoadMoreUserLinks(evt) {
    evt.preventDefault();

    const {userLinks, userLinksPageNum} = this.state;

    this.setState({
      userLinksPageNum: userLinksPageNum + 1
    }, () => {
      this.loadUserLinks((err, moreLinks) => {
        if (err || !dottie.get(moreLinks, 'links', [null]).length) {
          return this.setState({userLinksPageNum});
        }

        return this.setState({
          userLinks: userLinks.concat(moreLinks.links)
        });
      });
    });
  }

  render() {
    const {userLinks} = this.state;

    return (
      <div className="margin-huge--bottom">
        <p className="text--section-header">Links</p>
        <p className="text--section-caption">
          These are links you've created while logged in.
        </p>

        <Table
          className="sans-serif text-gray-60 iota margin-small--top"
          headerClassName="sans-serif bold"
          header={[
            'ALIAS',
            'OUTGOING URL',
            'CREATED',
            'PASSWORD',
            'RECAPTCHA',
            'ACTIONS'
          ]}
          entries={userLinks.map((link) => [
            // Link with tooltip for copying to clipboard
            <LinkTooltip
              tooltipClassName="kilo"
              textBeforeTransition={'Click to copy to your clipboard.'}
              textAfterTransition={'Done! Link is copied to your clipboard. Click again to follow through.'}
              onTransition={() => copy(link.full_alias)}
              href={`/${link.alias}`}
              text={link.alias}
            />,
            // Link to the outgoing URL
            <a href={link.outgoing_url}>
              {
                `${link.outgoing_url.substring(0, 60)}${link.outgoing_url.length > 60 ? '...' : ''}`
              }
            </a>,
            // Relative creation time description
            humanize.relativeTime(link.submit_time),
            // Password protection state
            link.is_password_protected ? 'Yes' : 'No',
            // Human verification/ReCAPTCHA state
            link.require_recaptcha ? 'On' : 'Off',
            // Row of available actions for each link
            <AccountLinkActions link={link} />
          ])}
        />

        <Button
          className="sans-serif bold iota text-white margin-small--top"
          text="Load more..."
          onClick={this.handleLoadMoreUserLinks.bind(this)}
        />
      </div>
    );
  }
}
