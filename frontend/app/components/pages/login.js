import {Link} from 'react-router';
import Helmet from 'react-helmet';
import React from 'react';
import request from 'browser-request';

import Alert, {ALERT_TYPE_SUCCESS, ALERT_TYPE_ERROR} from '../alert';
import Button from '../ui/button';
import Container from '../container';
import context from '../../util/context';
import DisplayUtil from '../../util/display';
import Header from '../header';
import LoadingBar from '../ui/loading-bar';
import TextField from '../ui/text-field';

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
    request.post({
      url: context.uris.AuthCheckURI,
      json: {}
    }, (err, resp) => {
      this.setState({
        isLoading: false,
        authCheckStatus: !err && resp.statusCode === 200
      });
    });
  }

  submitLogin() {
    this.setState({
      isLoading: true
    });

    request.post({
      url: context.uris.AuthLoginURI,
      json: {
        /* eslint-disable camelcase */
        username: this.usernameInput.getValue(),
        password_hash: this.passwordInput.getValue()
        /* eslint-enable camelcase */
      }
    }, (err, resp, json) => {  // eslint-disable-line handle-callback-err
      this.setState({
        isLoading: false,
        loginStatus: json
      });
    });
  }

  render() {
    const {isLoading, loginStatus, authCheckStatus} = this.state;

    return (
      <div>
        <Helmet title="Login - Linkr"/>

        {DisplayUtil.displayIf(isLoading, () => <LoadingBar />)}

        <Header selectIndex={1}/>

        <Container className={isLoading ? 'fade' : ''}>
          {
            DisplayUtil.displayIf(
              DisplayUtil.isDefined(loginStatus.success) && !loginStatus.success,
              () => (
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
              )
            )
          }

          {
            DisplayUtil.displayIf(authCheckStatus, () => (
              <Alert
                type={ALERT_TYPE_SUCCESS}
                title={'You are already logged in.'}
                message={
                  <span>
                    Click <Link className="sans-serif bold" to="/">here</Link> to return to the homepage.
                  </span>
                }
              />
            ))
          }

          <div className="margin-large--top margin-large--bottom">
            <p className="sans-serif bold text-gray-60 delta margin-large--bottom">Login</p>

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

            <br />

            <Button
              className="sans-serif bold iota text-white margin-large--top"
              text="Login"
              disabled={isLoading}
              onClick={this.submitLogin.bind(this)}
            />
          </div>
        </Container>
      </div>
    );
  }
}
