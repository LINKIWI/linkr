import dottie from 'dottie';
import humanize from 'humanize';
import {Link} from 'react-router';
import React from 'react';
import request from 'browser-request';
import truncate from 'lodash.truncate';

import Table from '../../table';

import Button from '../../ui/button';

import context from '../../../util/context';

/**
 * TODO
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
          These are links the links you've created while logged in.
        </p>

        <Table
          className="sans-serif text-gray-60 iota margin-small--top"
          headerClassName="sans-serif bold"
          header={[
            'ALIAS',
            'OUTGOING URL',
            'CREATED'
          ]}
          entries={userLinks.map((link) => [
            // Alias link directing to the link details page
            <Link to={'TODO'}>
              {link.alias}
            </Link>,
            // Link to the outgoing URL
            <a href={link.outgoing_url}>
              {truncate(link.outgoing_url, {length: 80})}
            </a>,
            // Relative creation time description
            humanize.relativeTime(link.submit_time)
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
