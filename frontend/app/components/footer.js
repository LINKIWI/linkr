/* global window */

import AccountCircle from 'react-icons/lib/md/account-circle';
import {browserHistory} from 'react-router';
import MediaQuery from 'react-responsive';
import React from 'react';

import Button from './ui/button';
import LoadingBar from './ui/loading-bar';

import authentication from '../util/authentication';
import context from '../util/context';

export default class Footer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isLoggedIn: false
    };
  }

  componentDidMount() {
    this.checkAuthStatus();
  }

  checkAuthStatus() {
    authentication.check((isLoggedIn, username) => {
      this.setState({
        isLoggedIn,
        username
      });
    });
  }

  handleAccountClick(evt) {
    evt.preventDefault();

    browserHistory.push(context.uris.UserAccountURI);
  }

  handleLogoutClick(evt) {
    evt.preventDefault();

    this.setState({
      isLoading: true
    });
    authentication.logout(() => {
      window.location.href = context.uris.HomeURI;
    });
  }

  render() {
    const {isLoading, username} = this.state;

    if (!username) {
      return null;
    }

    return (
      <div className={`footer-container transition ${isLoading && 'fade'}`}>
        {isLoading && <LoadingBar />}

        <div className="footer bg-gray-80 text-gray-10 sans-serif link-alt">
          <div style={{
            display: 'table',
            width: '100%'
          }}>
            <div style={{
              display: 'table-cell',
              verticalAlign: 'middle'
            }}>
              <MediaQuery minWidth={500}>
                <p className="sans-serif text-gray-30 kilo margin-tiny--bottom">LOGGED IN AS</p>
              </MediaQuery>
              <span>
                <AccountCircle
                  className="margin-small--right"
                  style={{
                    height: 25,
                    width: 25
                  }}
                />
              </span>
              <span className="sans-serif bold text-gray-10 kilo margin-tiny--bottom">
                {username.toUpperCase()}
              </span>
            </div>

            <div className="text-right sans-serif bold kilo" style={{
              display: 'table-cell',
              verticalAlign: 'middle'
            }}>
              <Button
                className="footer-button sans-serif bold kilo bg-gray-10 text-gray-80"
                text={'ACCOUNT'}
                onClick={this.handleAccountClick.bind(this)}
              />
              <Button
                className="footer-button sans-serif bold kilo bg-gray-10 text-gray-80 margin--left"
                text={'LOGOUT'}
                onClick={this.handleLogoutClick.bind(this)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
