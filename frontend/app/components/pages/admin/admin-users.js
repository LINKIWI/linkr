import dottie from 'dottie';
import humanize from 'humanize';
import React from 'react';
import request from 'browser-request';
import Search from 'react-icons/lib/md/search';

import Table from '../../table';
import UserAddModal from './user-add-modal';

import Button from '../../ui/button';
import TextField from '../../ui/text-field';

import context from '../../../util/context';

/**
 * User accounts section of the admin interface.
 */
export default class AdminUsers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recentUsersPageNum: 0,
      recentUsers: [],
      searchUsersPageNum: 0,
      searchUsers: []
    };
  }

  componentDidMount() {
    this.loadRecentUsers((_, json) => this.setState({
      recentUsers: dottie.get(json, 'users', [])
    }));
  }

  loadRecentUsers(cb) {
    const {loading} = this.props;
    const {recentUsersPageNum} = this.state;

    loading((done) => request.post({
      url: context.uris.RecentUsersURI,
      json: {
        /* eslint-disable camelcase */
        page_num: recentUsersPageNum,
        num_per_page: 10
        /* eslint-enable camelcase */
      }
    }, (err, resp, json) => {
      cb(err, json);
      return done();
    }));
  }

  handleLoadMoreRecentUsers(evt) {
    evt.preventDefault();

    const {recentUsers, recentUsersPageNum} = this.state;

    this.setState({
      recentUsersPageNum: recentUsersPageNum + 1
    }, () => {
      this.loadRecentUsers((err, moreUsers) => {
        if (err || !dottie.get(moreUsers, 'users', [null]).length) {
          // Reset the page number to the existing (non-incremented) index.
          return this.setState({recentUsersPageNum});
        }

        return this.setState({
          recentUsers: recentUsers.concat(moreUsers.users)
        });
      });
    });
  }

  handleAddUserClick(evt) {
    evt.preventDefault();

    this.userAddModal.component.modal.showModal();
  }

  doUserSearch(username, cb) {
    const {searchUsersPageNum} = this.state;

    if (this.inFlightSearchRequest) {
      this.inFlightSearchRequest.abort();
    }

    this.inFlightSearchRequest = request.post({
      url: context.uris.UserSearchURI,
      json: {
        /* eslint-disable camelcase */
        username,
        page_num: searchUsersPageNum,
        num_per_page: 10
        /* eslint-enable camelcase */
      }
    }, (err, resp, json) => cb(err, json));
  }

  handleUserSearch(evt) {
    const username = evt.target.value;

    if (!username) {
      return this.setState({searchUsers: []});
    }

    return this.setState({
      searchUsersPageNum: 0
    }, () => this.doUserSearch(username, (err, json = {}) => {
      if (!err) {
        this.setState({searchUsers: json.users || []});
      }
    }));
  }

  isSearching() {
    return this.searchField ? this.searchField.getValue().length > 0 : false;
  }

  render() {
    const {recentUsers, searchUsers} = this.state;

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
          onChange={this.handleUserSearch.bind(this)}
          icon={<Search />}
          iconSpacing="25px"
        />

        <Table
          className="sans-serif text-gray-60 iota margin-small--top"
          headerClassName="sans-serif bold"
          header={[
            'USERNAME',
            'SIGNUP IP',
            'ADMIN',
            'SIGNUP TIME'
          ]}
          entries={(this.isSearching() ? searchUsers : recentUsers).map((user) => [
            user.username,
            user.signup_ip,
            user.is_admin ? 'Yes' : 'No',
            humanize.date('F j, Y g:i A', user.signup_time)
          ])}
        />

        <Button
          className="sans-serif bold iota text-white margin-small--top"
          text="Load more..."
          onClick={this.handleLoadMoreRecentUsers.bind(this)}
        />
        <Button
          className="sans-serif bold iota text-white margin--left margin-small--top"
          text="Add user"
          onClick={this.handleAddUserClick.bind(this)}
        />

        <UserAddModal
          ref={(elem) => {
            this.userAddModal = elem;
          }}
        />
      </div>
    );
  }
}
