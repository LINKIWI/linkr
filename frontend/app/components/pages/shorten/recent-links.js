import Link from 'react-router/lib/Link';
import React from 'react';

import RecentLinkActions from './recent-link-actions';
import Table from '../../table';

import db from '../../../util/db';

export default class RecentLinks extends React.Component {
  constructor() {
    super();

    this.state = {
      recentLinks: db.getRecentLinks().slice(0, 10)
    };
  }

  render() {
    const {recentLinks} = this.state;

    if (!recentLinks.length) {
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
            'ALIAS',
            'ACTIONS'
          ]}
          entries={recentLinks.map((alias) => [
            <p className="sans-serif iota margin-small--right">
              <Link key={alias} to={`/${alias}`}>
                {alias}
              </Link>
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
