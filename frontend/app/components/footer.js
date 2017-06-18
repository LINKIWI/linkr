import AccountCircle from 'react-icons/lib/md/account-circle';
import LoadingHOC from 'react-loading-hoc';
import MediaQuery from 'react-responsive';
import React from 'react';

import Button from './ui/button';
import LoadingBar from './ui/loading-bar';

import authentication from '../util/authentication';
import browser from '../util/browser';
import context from '../util/context';

/**
 * Footer showing account details.
 */
export class Footer extends React.Component {
  static propTypes = {
    user: React.PropTypes.object
  };

  handleAccountClick(evt) {
    evt.preventDefault();

    browser.push(context.uris.UserAccountURI);
  }

  handleLogoutClick(evt) {
    evt.preventDefault();

    this.props.loading(() => authentication.logout(() => browser.go(context.uris.HomeURI)));
  }

  render() {
    const {isLoading, user} = this.props;

    if (!user.username) {
      return null;
    }

    return (
      <div className={`footer-container transition ${isLoading && 'fade'}`}>
        <LoadingBar show={isLoading} />

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
              <span className="footer-username sans-serif bold text-gray-10 kilo margin-tiny--bottom">
                {user.username.toUpperCase()}
              </span>
            </div>

            <div className="text-right sans-serif bold kilo" style={{
              display: 'table-cell',
              verticalAlign: 'middle'
            }}>
              <Button
                className="footer-account-button footer-button sans-serif bold kilo bg-gray-10 text-gray-80"
                text={'ACCOUNT'}
                onClick={this.handleAccountClick.bind(this)}
              />
              <Button
                className="footer-logout-button footer-button sans-serif bold kilo bg-gray-10 text-gray-80 margin--left"
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

export default LoadingHOC(Footer);
