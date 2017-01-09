import Helmet from 'react-helmet';
import {Link} from 'react-router';
import LoadingHOC from 'react-loading-hoc';
import React from 'react';

import AccountAPIKey from './account-api-key';
import AccountDeactivation from './account-deactivation';
import AccountLinks from './account-links';
import AccountUpdatePassword from './account-update-password';
import Alert, {ALERT_TYPE_WARN} from '../../alert';
import AuthenticationHOC from '../../hoc/authentication-hoc';
import Container from '../../container';
import Footer from '../../footer';
import Header from '../../header';

import LoadingBar from '../../ui/loading-bar';

import context from '../../../util/context';

/**
 * User account control panel page.
 */
class Account extends React.Component {
  render() {
    const {isLoggedIn, isLoading} = this.props;

    const content = (() => {
      switch (isLoggedIn) {
        case true:
          return (
            <div className="margin-large--top margin-large--bottom">
              <p className="text--page-title">Account</p>

              <AccountLinks {...this.props} />
              <AccountUpdatePassword {...this.props} />
              <AccountAPIKey {...this.props} />
              <AccountDeactivation {...this.props} />
            </div>
          );
        case false:
          return (
            <Alert
              type={ALERT_TYPE_WARN}
              title={'You must be logged in to view account details.'}
              message={
                <span>
                  Click <Link className="sans-serif bold" to={context.uris.LoginURI}>here</Link> to log in.
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
        <LoadingBar show={isLoading} />
        <Header />

        <Container className={isLoading ? 'fade' : ''}>
          {content}
        </Container>

        <Footer />
      </div>
    );
  }
}

export default AuthenticationHOC(LoadingHOC(Account));
