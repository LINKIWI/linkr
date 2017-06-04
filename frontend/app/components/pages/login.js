import Link from 'react-router/lib/Link';
import LoadingHOC from 'react-loading-hoc';
import Helmet from 'react-helmet';
import React from 'react';
import request from 'browser-request';

import Alert, {ALERT_TYPE_SUCCESS, ALERT_TYPE_ERROR, ALERT_TYPE_WARN} from '../alert';
import AuthenticationHOC from '../hoc/authentication-hoc';
import Container from '../container';
import Header from '../header';
import Footer from '../footer';

import Button from '../ui/button';
import Checkbox from '../ui/checkbox';
import LoadingBar from '../ui/loading-bar';
import TextField from '../ui/text-field';

import browser from '../../util/browser';
import context from '../../util/context';

/**
 * Login page for user authentication.
 */
class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {loginStatus: {}};
  }

  submitLogin(evt) {
    evt.preventDefault();

    this.props.loading((done) => {
      request.post({
        url: context.uris.AuthLoginURI,
        json: {
          /* eslint-disable camelcase */
          username: this.usernameInput.getValue(),
          password: this.passwordInput.getValue(),
          remember_me: this.rememberMeCheck.isChecked()
          /* eslint-enable camelcase */
        }
      }, (err, resp, loginStatus) => {  // eslint-disable-line handle-callback-err
        this.setState({loginStatus});
        return done();
      });
    });
  }

  renderLoginError() {
    const {loginStatus} = this.state;

    return loginStatus.success === false && (
      <Alert
        type={ALERT_TYPE_ERROR}
        title={'There was an error logging you in.'}
        message={loginStatus.message}
        failure={loginStatus.failure}
        failureMessages={{
          /* eslint-disable camelcase */
          failure_incomplete_params: 'You must supply both username and password to login.'
          /* eslint-enable camelcase */
        }}
      />
    );
  }

  renderLoginSuccess() {
    const {loginStatus} = this.state;
    const redirect = browser.parseURL().query.redirect || context.uris.HomeURI;

    if (loginStatus.success === true) {
      browser.push(redirect, 1000);

      return (
        <Alert
          type={ALERT_TYPE_SUCCESS}
          title={'Login successful!'}
          message={'Redirecting you now...'}
        />
      );
    }

    return null;
  }

  renderAlreadyLoggedIn() {
    const {isLoggedIn} = this.props;

    return isLoggedIn && (
      <Alert
        title={'You are already logged in.'}
        message={
          <span>
            Click <Link className="sans-serif bold" to={context.uris.HomeURI}>here</Link> to return to the homepage.
          </span>
        }
      />
    );
  }

  renderLoginRedirectReason() {
    const reason = browser.parseURL().query.reason;

    const messages = {
      /* eslint-disable camelcase */
      require_login_to_create: 'The server administrator has required that users be signed in to create new links.',
      admin_only: 'Only admins are allowed to view this page.',
      account: 'You must be logged in to manage account details.'
      /* eslint-enable camelcase */
    };

    return messages[reason] && (
      <Alert
        type={ALERT_TYPE_WARN}
        title={'Please log in to continue.'}
        message={messages[reason]}
      />
    );
  }

  render() {
    const {isLoading, user} = this.props;

    return (
      <div>
        <Helmet title="Login - Linkr"/>
        <LoadingBar show={isLoading} />
        <Header selectIndex={3}/>

        <Container className={isLoading ? 'fade' : ''}>
          {this.renderLoginRedirectReason()}
          {this.renderLoginSuccess()}
          {this.renderLoginError()}
          {this.renderAlreadyLoggedIn()}

          <Alert
            title={'Looking for the demo admin interface?'}
            message={'The admin username and password are \'admin\'.'}
          />

          <div className="margin-large--top margin-large--bottom">
            <p className="sans-serif bold text-gray-60 delta margin-large--bottom">Login</p>

            <form>
              <p className="sans-serif bold text-gray-50 iota margin-tiny--bottom">USERNAME</p>
              <TextField
                ref={(elem) => {
                  this.usernameInput = elem;
                }}
                className="login-field sans-serif light margin--bottom"
              />

              <p className="sans-serif bold text-gray-50 iota margin-tiny--bottom">PASSWORD</p>
              <TextField
                ref={(elem) => {
                  this.passwordInput = elem;
                }}
                type="password"
                className="login-field sans-serif light"
              />

              <Checkbox
                ref={(elem) => {
                  this.rememberMeCheck = elem;
                }}
                className="margin--top"
                text="Remember me"
              />

              <Button
                className="sans-serif bold iota text-white margin-large--top"
                text="Login"
                disabled={isLoading}
                onClick={this.submitLogin.bind(this)}
              />
            </form>

            <p className="sans-serif iota text-gray-60 margin-huge--top">
              Don't have an account? <Link to={context.uris.UserRegistrationURI}>Register here</Link>.
            </p>
          </div>
        </Container>

        <Footer user={user} />
      </div>
    );
  }
}

export default AuthenticationHOC(LoadingHOC(Login));
