/* global config */

import dottie from 'dottie';
import Link from 'react-router/lib/Link';
import MediaQuery from 'react-responsive';
import React from 'react';
import urlParse from 'url-parse';

import RecentLinkActions from './recent-link-actions';
import Table from '../../table';

import context from '../../../util/context';
import db from '../../../util/db';

export default class RecentLinks extends React.Component {
  constructor() {
    super();

    this.state = {
      recentLinks: (db.getRecentLinks() || []).slice(0, 10)
    };
  }

  render() {
    const {recentLinks} = this.state;

    if (!recentLinks.length || !dottie.get(config, 'options.enable_recent_links')) {
      return null;
    }

    return (
      <div className="margin-huge--bottom">
        <p className="text--section-header">Recent Links</p>
        <p className="text--section-caption">
          These are links recently created or accessed by this browser.
        </p>

        <Table
          className="sans-serif text-gray-60 iota"
          headerClassName="sans-serif bold"
          header={[
            'LINK',
            'ACTIONS'
          ]}
          entries={recentLinks.map((alias) => [
            <p className="sans-serif iota margin-small--right">
              <MediaQuery minWidth={450}>
                <Link key={alias} to={`/${alias}`}>
                  {`${urlParse(context.config.linkr_url).href}/${alias}`}
                </Link>
              </MediaQuery>

              <MediaQuery maxWidth={449}>
                <Link key={alias} to={`/${alias}`}>
                  {alias}
                </Link>
              </MediaQuery>
            </p>,
            <RecentLinkActions
              alias={alias}
              handleRemoveClick={() => {
                db.removeRecentLink(alias);
                this.setState({
                  recentLinks: db.getRecentLinks().slice(0, 10)
                });
              }}
            />
          ])}
        />
      </div>
    );
  }
}
