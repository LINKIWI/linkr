import dottie from 'dottie';
import humanize from 'humanize';
import Link from 'react-router/lib/Link';
import React from 'react';
import request from 'browser-request';
import Search from 'react-icons/lib/md/search';

import Table from '../../table';

import Button from '../../ui/button';
import TextField from '../../ui/text-field';

import context from '../../../util/context';

/**
 * Recent links section of the admin interface.
 */
export default class AdminRecentLinks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recentLinksPageNum: 0,
      recentLinks: [],
      searchLinksPageNum: 0,
      searchLinks: []
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

  doLinkSearch(alias, cb) {
    const {searchLinksPageNum} = this.state;

    // If a request is currently in-flight as we're launching another request, abort the existing
    // XHR to to limit network overhead. (The results of the previous XHR will not be used anyway,
    // so there's no good reason to complete it).
    if (this.inFlightSearchRequest) {
      this.inFlightSearchRequest.abort();
    }

    // Record this XHR as a globally accessible class property, so that it can be referenced after
    // the request has already been dispatched (see a few lines above).
    this.inFlightSearchRequest = request.post({
      url: context.uris.LinkAliasSearchURI,
      json: {
        /* eslint-disable camelcase */
        alias,
        page_num: searchLinksPageNum,
        num_per_page: 10
        /* eslint-enable camelcase */
      }
    }, (err, resp, json) => cb(err, json));
  }

  handleLinkSearch(evt) {
    const alias = evt.target.value;

    if (!alias) {
      return this.setState({searchLinks: []});
    }

    return this.setState({
      searchLinksPageNum: 0
    }, () => this.doLinkSearch(alias, (err, json) => {
      const links = dottie.get(json, 'links', []);
      if (!err) {
        this.setState({searchLinks: links});
      }
    }));
  }

  handleLoadMoreSearchLinks(evt) {
    evt.preventDefault();

    const {searchLinks, searchLinksPageNum} = this.state;

    this.setState({
      searchLinksPageNum: searchLinksPageNum + 1
    }, () => {
      this.doLinkSearch(this.searchField.getValue(), (err, json) => {
        const links = dottie.get(json, 'links', []);
        if (err || !links.length) {
          // Reset the page number to the existing (non-incremented) index.
          return this.setState({searchLinksPageNum});
        }

        return this.setState({searchLinks: searchLinks.concat(links)});
      });
    });
  }

  handleLoadMore(evt) {
    evt.preventDefault();

    return this.isSearching() ? this.handleLoadMoreSearchLinks(evt) : this.handleLoadMoreRecentLinks(evt);
  }

  isSearching() {
    return this.searchField ? this.searchField.getValue().length > 0 : false;
  }

  render() {
    const {searchLinks, recentLinks} = this.state;

    return (
      <div className="margin-huge--bottom">
        <p className="text--section-header">Links</p>
        <p className="text--section-caption">
          These are all recently created links. Click any alias to see more details about that link.
        </p>

        <TextField
          ref={(elem) => {
            this.searchField = elem;
          }}
          className="search-bar sans-serif margin-small--bottom"
          placeholder="Search for links..."
          onChange={this.handleLinkSearch.bind(this)}
          icon={<Search />}
          iconSpacing="25px"
        />

        <Table
          className="sans-serif text-gray-60 iota margin-small--top"
          headerClassName="sans-serif bold"
          header={[
            'ALIAS',
            'OUTGOING URL',
            'CREATED'
          ]}
          entries={(this.isSearching() ? searchLinks : recentLinks).map((link) => [
            // Alias link directing to the link details page
            <Link to={`/linkr/admin/link/${link.link_id}`}>
              {link.alias}
            </Link>,
            // Link to the outgoing URL
            <a href={link.outgoing_url}>
              {
                `${link.outgoing_url.substring(0, 60)}${link.outgoing_url.length > 60 ? '...' : ''}`
              }
            </a>,
            // Relative creation time description
            humanize.relativeTime(link.submit_time)
          ])}
        />

        <Button
          className="sans-serif bold iota text-white margin-small--top"
          text="Load more..."
          onClick={this.handleLoadMore.bind(this)}
        />
      </div>
    );
  }
}
