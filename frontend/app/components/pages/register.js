/* global setTimeout */

import {browserHistory} from 'react-router';
import Helmet from 'react-helmet';
import React from 'react';
import request from 'browser-request';

import Alert, {ALERT_TYPE_SUCCESS, ALERT_TYPE_ERROR} from '../alert';
import Container from '../container';
import Header from '../header';
import Footer from '../footer';

import Button from '../ui/button';
import LoadingBar from '../ui/loading-bar';
import TextField from '../ui/text-field';

import context from '../../util/context';
import DisplayUtil from '../../util/display';

/**
 * Registration page for new users.
 */
export default class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      registrationStatus: {}
    };
  }

  submitRegistration(evt) {
    evt.preventDefault();

    this.setState({
      isLoading: true
    });

    request.put({
      url: context.uris.UserAddURI,
      json: {
        /* eslint-disable camelcase */
        username: this.usernameInput.getValue(),
        password: this.passwordInput.getValue()
        /* eslint-enable camelcase */
      }
    }, (err, resp, json) => {  // eslint-disable-line handle-callback-err
      this.setState({
        isLoading: false,
        registrationStatus: json
      });
    });
  }

  renderRegisterError() {
    const {registrationStatus} = this.state;

    if (DisplayUtil.isDefined(registrationStatus.success) && !registrationStatus.success) {
      return (
        <Alert
          type={ALERT_TYPE_ERROR}
          title={'There was an error with your registration.'}
          message={registrationStatus.message}
          failure={registrationStatus.failure}
          failureMessages={{
            /* eslint-disable camelcase */
            failure_incomplete_params: 'You must supply both username and password to register.'
            /* eslint-enable camelcase */
          }}
        />
      );
    }

    return null;
  }

  renderRegisterSuccess() {
    const {registrationStatus} = this.state;

    if (DisplayUtil.isDefined(registrationStatus.success) && registrationStatus.success) {
      setTimeout(() => browserHistory.push(context.uris.LoginURI), 1500);

      return (
        <Alert
          type={ALERT_TYPE_SUCCESS}
          title={'Registration successful!'}
          message={'Redirecting you to the login page...'}
        />
      );
    }

    return null;
  }

  render() {
    const {isLoading} = this.state;

    return (
      <div>
        <Helmet title="Register - Linkr"/>

        {DisplayUtil.displayIf(isLoading, () => <LoadingBar />)}

        <Header selectIndex={1}/>

        <Container className={isLoading ? 'fade' : ''}>
          {this.renderRegisterError()}
          {this.renderRegisterSuccess()}

          <div className="margin-large--top margin-large--bottom">
            <p className="sans-serif bold text-gray-60 delta margin-large--bottom">Register</p>

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

              <br />

              <Button
                className="sans-serif bold iota text-white margin-large--top"
                text="Register"
                disabled={isLoading}
                onClick={this.submitRegistration.bind(this)}
              />
            </form>
          </div>
        </Container>

        <Footer />
      </div>
    );
  }
}
