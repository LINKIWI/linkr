import Link from 'react-router/lib/Link';
import Helmet from 'react-helmet';
import LoadingHOC from 'react-loading-hoc';
import React from 'react';
import request from 'browser-request';

import Alert, {ALERT_TYPE_SUCCESS, ALERT_TYPE_ERROR} from '../alert';
import AuthenticationHOC from '../hoc/authentication-hoc';
import Container from '../container';
import Header from '../header';
import Footer from '../footer';

import Button from '../ui/button';
import LoadingBar from '../ui/loading-bar';
import TextField from '../ui/text-field';

import browser from '../../util/browser';
import context from '../../util/context';

/**
 * Registration page for new users.
 */
class Register extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      registrationStatus: {}
    };
  }

  submitRegistration(evt) {
    evt.preventDefault();

    if (this.passwordInput.getValue() !== this.confirmPasswordInput.getValue()) {
      return this.setState({
        registrationStatus: {
          success: false,
          message: 'The two passwords do not match. Please try again.'
        }
      });
    }

    return this.props.loading((done) => request.put({
      url: context.uris.UserAddURI,
      json: {
        /* eslint-disable camelcase */
        username: this.usernameInput.getValue(),
        password: this.passwordInput.getValue()
        /* eslint-enable camelcase */
      }
    }, (err, resp, registrationStatus) => {  // eslint-disable-line handle-callback-err
      this.setState({registrationStatus});
      return done();
    }));
  }

  renderRegisterError() {
    const {registrationStatus} = this.state;

    if (registrationStatus.success === false) {
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

    if (registrationStatus.success) {
      browser.push(context.uris.LoginURI, 1500);

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

  render() {
    const {isLoading, user} = this.props;

    return (
      <div>
        <Helmet title="Register - Linkr"/>
        <LoadingBar show={isLoading} />
        <Header selectIndex={3}/>

        <Container className={isLoading ? 'fade' : ''}>
          {this.renderRegisterError()}
          {this.renderRegisterSuccess()}
          {this.renderAlreadyLoggedIn()}

          {
            context.config.ALLOW_OPEN_REGISTRATION ? (
              <div className="margin-large--top margin-large--bottom">
                <p className="sans-serif bold text-gray-60 delta margin-large--bottom">Register</p>

                <form>
                  <div className="margin--bottom">
                    <p className="text--field-header">USERNAME</p>
                    <TextField
                      ref={(elem) => {
                        this.usernameInput = elem;
                      }}
                      className="login-field sans-serif light"
                    />
                  </div>

                  <div className="margin--bottom">
                    <p className="text--field-header">PASSWORD</p>
                    <TextField
                      ref={(elem) => {
                        this.passwordInput = elem;
                      }}
                      type="password"
                      className="login-field sans-serif light"
                    />
                  </div>

                  <div>
                    <p className="text--field-header">CONFIRM PASSWORD</p>
                    <TextField
                      ref={(elem) => {
                        this.confirmPasswordInput = elem;
                      }}
                      type="password"
                      className="login-field sans-serif light"
                    />
                  </div>

                  <br />

                  <Button
                    className="sans-serif bold iota text-white margin-large--top"
                    text="Register"
                    disabled={isLoading}
                    onClick={this.submitRegistration.bind(this)}
                  />
                </form>

                <p className="sans-serif iota text-gray-60 margin-huge--top">
                  Already have an account? <Link to={context.uris.LoginURI}>Login here</Link>.
                </p>
              </div>
            ) : (
              <div className="margin-large--top margin-large--bottom">
                <p className="sans-serif bold gamma text-gray-70 margin-small--bottom">OPEN REGISTRATION DISABLED</p>
                <p className="not-found-text sans-serif bold text-gray-70 margin-large--bottom transition">
                  The server administrator has disabled open user self-registration.
                </p>

                <p className="sans-serif gamma text-gray-70 margin-small--bottom">
                  Go back to the <Link to={context.uris.HomeURI}>homepage</Link>.
                </p>
              </div>
            )
          }
        </Container>

        <Footer user={user} />
      </div>
    );
  }
}

export default AuthenticationHOC(LoadingHOC(Register));
