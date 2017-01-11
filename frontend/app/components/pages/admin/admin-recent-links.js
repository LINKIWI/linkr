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
 * Recent links section of the admin interface.
 */
export default class AdminRecentLinks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recentLinksPageNum: 0,
      recentLinks: []
    };
  }

  componentDidMount() {
    this.loadRecentLinks((_, json) => this.setState({
      recentLinks: dottie.get(json, 'links', [])
    }));
  }

  loadRecentLinks(cb) {
    const {loading} = this.props;
    const {recentLinksPageNum} = this.state;

    loading((done) => request.post({
      url: context.uris.RecentLinksURI,
      json: {
        /* eslint-disable camelcase */
        page_num: recentLinksPageNum,
        num_per_page: 10
        /* eslint-enable camelcase */
      }
    }, (err, resp, json) => {
      cb(err, json);
      return done();
    }));
  }

  handleLoadMoreRecentLinks(evt) {
    evt.preventDefault();

    const {recentLinks, recentLinksPageNum} = this.state;

    this.setState({
      recentLinksPageNum: recentLinksPageNum + 1
    }, () => {
      this.loadRecentLinks((err, moreLinks) => {
        if (err || !dottie.get(moreLinks, 'links', [null]).length) {
          // Reset the page number to the existing (non-incremented) index.
          return this.setState({recentLinksPageNum});
        }

        return this.setState({
          recentLinks: recentLinks.concat(moreLinks.links)
        });
      });
    });
  }

  render() {
    const {recentLinks} = this.state;

    return (
      <div className="margin-huge--bottom">
        <p className="text--section-header">Links</p>
        <p className="text--section-caption">
          These are all recently created links. Click any alias to see more details about that link.
        </p>

        <Table
          className="sans-serif text-gray-60 iota margin-small--top"
          headerClassName="sans-serif bold"
          header={[
            'ALIAS',
            'OUTGOING URL',
            'CREATED'
          ]}
          entries={recentLinks.map((link) => [
            // Alias link directing to the link details page
            <Link to={`/linkr/admin/link/${link.link_id}`}>
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
          onClick={this.handleLoadMoreRecentLinks.bind(this)}
        />
      </div>
    );
  }
}
