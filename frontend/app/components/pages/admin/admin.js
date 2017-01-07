/* global window */

import dottie from 'dottie';
import Helmet from 'react-helmet';
import humanize from 'humanize';
import {Link} from 'react-router';
import LoadingHOC from 'react-loading-hoc';
import React from 'react';
import request from 'browser-request';
import truncate from 'lodash.truncate';
import url from 'url';

import AuthenticationHOC from '../../hoc/authentication-hoc';
import Alert, {ALERT_TYPE_ERROR, ALERT_TYPE_WARN} from '../../alert';
import Container from '../../container';
import Footer from '../../footer';
import Header from '../../header';
import InfoTable from '../../info-table';
import Table from '../../table';

import Button from '../../ui/button';
import LoadingBar from '../../ui/loading-bar';
import Tooltip from '../../ui/tooltip';

import context from '../../../util/context';

/**
 * Main admin interface.
 */
class Admin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recentLinksPageNum: 0,
      recentLinks: [],
      config: {}
    };
  }

  componentDidMount() {
    this.loadRecentLinks((_, json) => this.setState({
      recentLinks: dottie.get(json, 'links', [])
    }));

    this.loadConfig((_, json) => this.setState({
      config: dottie.get(json, 'config', {})
    }));
  }

  loadConfig(cb) {
    const {loading} = this.props;

    loading((done) => request.post({
      url: context.uris.ConfigURI,
      json: {}
    }, (err, resp, json) => {
      cb(err, json);
      return done();
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

  renderRecentLinks() {
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

  renderConfig() {
    const {config} = this.state;

    const configEntries = Object.keys(config).map((key) => {
      const valueMaxLength = 60;
      const configValue = config[key].toString();
      const value = configValue.length > valueMaxLength ? (
        <Tooltip contents={<span>{configValue}</span>}>
          {truncate(configValue, {length: valueMaxLength})}
        </Tooltip>
      ) : configValue;

      return {key, value};
    });

    const configFile = <span className="monospace bold">config/options.py</span>;

    return (
      <div className="margin-huge--bottom">
        <p className="text--section-header">Configuration</p>
        <p className="text--section-caption">
          These configuration values are defined server-side in {configFile}.&nbsp;
          To change any of the below values, modify {configFile} and reload Apache.
        </p>

        <InfoTable className="margin-small--top" entries={configEntries} />
      </div>
    );
  }

  render() {
    const {isLoading, isLoggedIn, user} = this.props;

    const content = (() => {
      switch (isLoggedIn) {
        case true:
          return user.is_admin ? (
            <div className="margin-large--top margin-large--bottom">
              <p className="text--page-title">Admin</p>

              {this.renderRecentLinks()}
              {this.renderConfig()}
            </div>
          ) : (
            <Alert
              type={ALERT_TYPE_ERROR}
              title={'You are not allowed to view this page.'}
              message={'This page is only accessible by admin users.'}
            />
          );
        case false:
          return (
            <Alert
              type={ALERT_TYPE_WARN}
              title={'You must be logged in to view the admin page.'}
              message={
                <span>
                  <Link
                    className="sans-serif bold"
                    to={{
                      pathname: context.uris.LoginURI,
                      query: {
                        redirect: url.parse(window.location.href).pathname
                      }
                    }}
                  >
                    Click here
                  </Link> to log in.
                </span>
              }
            />
          );
        default:
          return null;
      }
    })();

    return (
      <div>
        <Helmet title="Admin - Linkr" />

        {isLoading && <LoadingBar />}

        <Header selectIndex={1} />

        <Container className={isLoading ? 'fade' : ''}>
          {content}
        </Container>

        <Footer />
      </div>
    );
  }
}

export default AuthenticationHOC(LoadingHOC(Admin));
