import copy from 'copy-to-clipboard';
import dottie from 'dottie';
import Helmet from 'react-helmet';
import humanize from 'humanize';
import React from 'react';
import request from 'browser-request';
import truncate from 'lodash.truncate';

import Container from '../container';
import Footer from '../footer';
import Header from '../header';
import HOC from '../hoc';
import LinkTooltip from '../link-tooltip';
import Table from '../table';

import Button from '../ui/button';
import LoadingBar from '../ui/loading-bar';

import context from '../../util/context';

/**
 * Main admin interface.
 */
class Admin extends React.Component {
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
      done();
      return cb(err, json);
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

  renderRecentLinks() {
    const {recentLinks} = this.state;

    return (
      <div className="margin-huge--bottom">
        <p className="text--section-header">LINKS</p>

        <Table
          className="sans-serif text-gray-60 iota"
          headerClassName="sans-serif bold"
          header={[
            'ALIAS',
            'OUTGOING URL',
            'CREATED'
          ]}
          entries={recentLinks.map((link) => [
            // Alias link with a click-to-copy tooltip
            <LinkTooltip
              textBeforeTransition={'Click to copy to your clipboard.'}
              textAfterTransition={
                'Done! Link is copied to your clipboard. Click again to follow through.'
              }
              tooltipClassName={'sans-serif kilo'}
              href={link.full_alias}
              onTransition={() => copy(link.full_alias)}
            />,
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

  render() {
    const {isLoading} = this.props;

    return (
      <div>
        <Helmet title="Admin - Linkr"/>

        {isLoading && <LoadingBar />}

        <Header selectIndex={1}/>

        <Container className={isLoading ? 'fade' : ''}>
          <div className="margin-large--top margin-large--bottom">
            <p className="text--page-title">Admin</p>

            {this.renderRecentLinks()}
          </div>
        </Container>

        <Footer />
      </div>
    );
  }
}

export default HOC(Admin);
