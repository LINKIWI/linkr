import Helmet from 'react-helmet';
import humanize from 'humanize';
import {Link} from 'react-router';
import LoadingHOC from 'react-loading-hoc';
import React from 'react';
import truncate from 'lodash.truncate';

import Alert, {ALERT_TYPE_WARN} from '../alert';
import AuthenticationHOC from '../hoc/authentication-hoc';
import Container from '../container';
import Footer from '../footer';
import Header from '../header';
import Table from '../table';

import Button from '../ui/button';
import LoadingBar from '../ui/loading-bar';

import context from '../../util/context';

/**
 * TODO
 */
class Account extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userLinks: []
    };
  }

  renderUserLinks() {
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
        />
      </div>
    );
  }

  render() {
    const {isLoggedIn, isLoading, user} = this.props;

    const content = (() => {
      switch (isLoggedIn) {
        case true:
          return (
            <div className="margin-large--top margin-large--bottom">
              <p className="text--page-title">Account</p>

              {this.renderUserLinks()}
            </div>
          );
        case false:
          return (
            <Alert
              type={ALERT_TYPE_WARN}
              title={'You must be logged in to view account details.'}
              message={
                <span>
                  <Link className="sans-serif bold" to={context.uris.LoginURI}>Click here</Link> to log in.
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
        <Helmet title="Account - Linkr" />

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

export default AuthenticationHOC(LoadingHOC(Account));
