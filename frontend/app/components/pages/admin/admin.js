import Helmet from 'react-helmet';
import LoadingHOC from 'react-loading-hoc';
import React from 'react';

import AdminConfig from './admin-config';
import AdminVersion from './admin-version';
import AdminRecentLinks from './admin-recent-links';
import AdminUsers from './admin-users';
import AuthenticationHOC from '../../hoc/authentication-hoc';
import Alert, {ALERT_TYPE_ERROR} from '../../alert';
import Container from '../../container';
import Footer from '../../footer';
import Header from '../../header';

import LoadingBar from '../../ui/loading-bar';

import browser from '../../../util/browser';

/**
 * Main admin interface.
 */
const Admin = (props) => {
  const {isLoading, isLoggedIn, user} = props;

  if (isLoggedIn === false) {
    browser.loginRedirect('admin_only');
  }

  const content = isLoggedIn && (
    user.is_admin ? (
      <div className="margin-large--top margin-large--bottom">
        <p className="text--page-title">Admin</p>

        <AdminRecentLinks {...props} />
        <AdminUsers {...props} />
        <AdminConfig {...props} />
        <AdminVersion {...props} />
      </div>
    ) : (
      <Alert
        type={ALERT_TYPE_ERROR}
        title={'You are not allowed to view this page.'}
        message={'This page is only accessible by admin users.'}
      />
    )
  );

  return (
    <div>
      <Helmet title="Admin - Linkr" />
      <LoadingBar show={isLoading} />
      <Header selectIndex={1} />

      <Container className={isLoading ? 'fade' : ''}>
        {content}
      </Container>

      <Footer user={user} />
    </div>
  );
};

export default AuthenticationHOC(LoadingHOC(Admin));
