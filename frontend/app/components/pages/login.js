/* global setTimeout */

import {browserHistory, Link} from 'react-router';
import Helmet from 'react-helmet';
import React from 'react';
import request from 'browser-request';

import Alert, {ALERT_TYPE_SUCCESS, ALERT_TYPE_ERROR} from '../alert';
import Container from '../container';
import Header from '../header';
import Footer from '../footer';

import Button from '../ui/button';
import Checkbox from '../ui/checkbox';
import LoadingBar from '../ui/loading-bar';
import TextField from '../ui/text-field';

import authentication from '../../util/authentication';
import context from '../../util/context';
import DisplayUtil from '../../util/display';

/**
 * Login page for user authentication.
 */
export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      loginStatus: {},
      authCheckStatus: false
    };
  }

  componentDidMount() {
    // On page load, first make a request to the authentication check endpoint to check if the user
    // is already authenticated.
    authentication.check((authCheckStatus) => {
      this.setState({
        isLoading: false,
        authCheckStatus
      });
    });
  }

  submitLogin(evt) {
    evt.preventDefault();

    this.setState({
      isLoading: true
    });

    request.post({
      url: context.uris.AuthLoginURI,
      json: {
        /* eslint-disable camelcase */
        username: this.usernameInput.getValue(),
        password_hash: this.passwordInput.getValue(),
        remember_me: this.rememberMeCheck.isChecked()
        /* eslint-enable camelcase */
      }
    }, (err, resp, json) => {  // eslint-disable-line handle-callback-err
      this.setState({
        isLoading: false,
        loginStatus: json
      });
    });
  }

  renderLoginError() {
    const {loginStatus} = this.state;

    if (DisplayUtil.isDefined(loginStatus.success) && !loginStatus.success) {
      return (
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

    return null;
  }

  renderLoginSuccess() {
    const {loginStatus} = this.state;

    if (DisplayUtil.isDefined(loginStatus.success) && loginStatus.success) {
      setTimeout(() => browserHistory.push('/'), 1500);
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
    const {authCheckStatus} = this.state;

    if (authCheckStatus) {
      return (
        <Alert
          title={'You are already logged in.'}
          message={
            <span>
              Click <Link className="sans-serif bold" to="/">here</Link> to return to the homepage.
            </span>
          }
        />
      );
    }

    return null;
  }

  render() {
    const {isLoading} = this.state;

    return (
      <div>
        <Helmet title="Login - Linkr"/>

        {DisplayUtil.displayIf(isLoading, () => <LoadingBar />)}

        <Header selectIndex={1}/>

        <Container className={isLoading ? 'fade' : ''}>
          {this.renderLoginSuccess()}
          {this.renderLoginError()}
          {this.renderAlreadyLoggedIn()}

          <div className="margin-large--top margin-large--bottom">
            <p className="sans-serif bold text-gray-60 delta margin-large--bottom">Login</p>

            <p className="sans-serif bold text-gray-50 iota margin-tiny--bottom">USERNAME</p>
            <form>
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
          </div>
        </Container>

        <Footer />
      </div>
    );
  }
}
