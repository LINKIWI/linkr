import Helmet from 'react-helmet';
import LoadingHOC from 'react-loading-hoc';
import React from 'react';

import AccountAPIKey from './account-api-key';
import AccountDeactivation from './account-deactivation';
import AccountDetails from './account-details';
import AccountLinks from './account-links';
import AccountUpdatePassword from './account-update-password';
import AuthenticationHOC from '../../hoc/authentication-hoc';
import Container from '../../container';
import Footer from '../../footer';
import Header from '../../header';

import LoadingBar from '../../ui/loading-bar';

import browser from '../../../util/browser';

/**
 * User account control panel page.
 */
const Account = (props) => {
  const {isLoading, isLoggedIn, user} = props;

  if (isLoggedIn === false) {
    browser.loginRedirect('account');
  }

  const content = isLoggedIn && (
    <div className="margin-large--top margin-large--bottom">
      <p className="text--page-title">Account</p>

      <AccountDetails {...props} />
      <AccountLinks {...props} />
      <AccountUpdatePassword {...props} />
      <AccountAPIKey {...props} />
      <AccountDeactivation {...props} />
    </div>
  );

  return (
    <div>
      <Helmet title="Account - Linkr" />
      <LoadingBar show={isLoading} />
      <Header />

      <Container className={isLoading ? 'fade' : ''}>
        {content}
      </Container>

      <Footer user={user} />
    </div>
  );
};

export default AuthenticationHOC(LoadingHOC(Account));
