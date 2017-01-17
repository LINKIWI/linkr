import React from 'react';
import Search from 'react-icons/lib/md/search';

import Button from '../../ui/button';
import TextField from '../../ui/text-field';

/**
 * User accounts section of the admin interface.
 */
export default class AdminUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="margin-huge--bottom">
        <p className="text--section-header">USERS</p>
        <p className="text--section-caption">
          These are all registered users.
        </p>

        <TextField
          ref={(elem) => {
            this.searchField = elem;
          }}
          className="search-bar sans-serif margin-small--bottom"
          placeholder="Search for users..."
          icon={<Search />}
          iconSpacing="25px"
        />

        <Button
          className="sans-serif bold iota text-white margin-small--top"
          text="User management features are coming soon"
        />
      </div>
    );
  }
}
