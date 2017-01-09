import Helmet from 'react-helmet';
import LoadingHOC from 'react-loading-hoc';
import randomstring from 'randomstring';
import React from 'react';
import request from 'browser-request';
import url from 'url';

import Alert, {ALERT_TYPE_ERROR} from '../../alert';
import AuthenticationHOC from '../../hoc/authentication-hoc';
import Container from '../../container';
import Header from '../../header';
import Footer from '../../footer';

import Button from '../../ui/button';
import Checkbox from '../../ui/checkbox';
import LoadingBar from '../../ui/loading-bar';
import TextField from '../../ui/text-field';

import browser from '../../../util/browser';
import context from '../../../util/context';

/**
 * Main interface for shortening a new link.
 */
class Shorten extends React.Component {
  constructor(props) {
    super(props);

    this.state = {submitStatus: {}};
    this.randomAlias = randomstring.generate(10);
  }

  submit(evt) {
    evt.preventDefault();

    this.setState({
      submitStatus: {},
      passwordProtect: false
    });

    this.props.loading((done) => {
      request.put({
        url: context.uris.LinkAddURI,
        json: {
          /* eslint-disable camelcase */
          alias: this.aliasInput.getValue() || this.randomAlias,
          outgoing_url: this.outgoingURLInput.getValue(),
          password: this.passwordProtectCheck.isChecked() ? this.passwordProtectInput.getValue() : null
          /* eslint-enable camelcase */
        }
      }, (err, resp, submitStatus) => {
        if (err) {
          this.setState({
            submitStatus: {
              success: false,
              message: 'There was a network error. Please submitting again.'
            }
          });
          return done();
        }

        this.setState({submitStatus});
        return done();
      });
    });
  }

  renderShorten() {
    const {isLoading} = this.props;
    const {passwordProtect} = this.state;

    return (
      <div className="margin-large--top margin-large--bottom">
        <p className="sans-serif bold gamma text-gray-60 margin-small--bottom">SHORTEN</p>
        <form>
          <TextField
            ref={(elem) => {
              this.outgoingURLInput = elem;
            }}
            className="shorten-field sans-serif light"
            style={{
              width: '100%'
            }}
            placeholder="https://google.com"
          />

          <p className="sans-serif bold gamma text-gray-60 margin--top margin-small--bottom">TO</p>
          <div style={{
            display: 'table',
            width: '100%'
          }}>
            <span className="shorten-field sans-serif light text-gray-70" style={{
              display: 'table-cell',
              width: '1%',
              whiteSpace: 'nowrap'
            }}>
              {url.parse(context.config.LINKR_URL).href}
            </span>
            <TextField
              ref={(elem) => {
                this.aliasInput = elem;
              }}
              className="shorten-field sans-serif light"
              style={{
                display: 'table-cell',
                width: '100%'
              }}
              placeholder={this.randomAlias}
            />
          </div>

          <Checkbox
            ref={(elem) => {
              this.passwordProtectCheck = elem;
            }}
            className="margin-large--top"
            text="Password protect this link"
            onCheck={() => this.setState({passwordProtect: true})}
            onUncheck={() => this.setState({passwordProtect: false})}
          />

          {
            passwordProtect && (
              <div className="margin-tiny--bottom margin--top">
                <p className="sans-serif bold text-gray-60 iota">
                  LINK PASSWORD
                </p>
                <p className="sans-serif text-gray-50 kilo margin-small--bottom">
                  Users will be prompted to enter this password before they can access this link.
                </p>

                <TextField
                  ref={(elem) => {
                    this.passwordProtectInput = elem;
                  }}
                  className="login-field sans-serif light"
                  type="password"
                />
              </div>
            )
          }

          <Button
            className="sans-serif bold iota text-white margin-huge--top"
            text="Shorten"
            disabled={isLoading}
            onClick={this.submit.bind(this)}
          />
        </form>
      </div>
    );
  }

  renderErrorAlert() {
    const {submitStatus} = this.state;

    return (
      <Alert
        type={ALERT_TYPE_ERROR}
        title={'There was an error submitting your link.'}
        message={submitStatus.message}
        failure={submitStatus.failure}
        failureMessages={{
          /* eslint-disable camelcase */
          failure_incomplete_params: 'You must supply a URL to link to.',
          failure_undefined: 'There was an unknown failure. Please try again later or file an issue on Github.'
          /* eslint-enable camelcase */
        }}
      />
    );
  }

  render() {
    const {isLoading, isLoggedIn} = this.props;
    const {submitStatus} = this.state;

    if (submitStatus.success === true) {
      browser.push(`/linkr/success/${submitStatus.alias}`);
    }

    if (isLoggedIn === false && context.config.REQUIRE_LOGIN_TO_CREATE) {
      browser.loginRedirect('require_login_to_create');
    }

    return (
      <div>
        <Helmet title="Linkr" />
        <LoadingBar show={isLoading} />
        <Header selectIndex={0} />

        <Container className={isLoading ? 'fade' : ''}>
          {(submitStatus.success === false) && this.renderErrorAlert()}
          {this.renderShorten()}
        </Container>

        <Footer />
      </div>
    );
  }
}

export default AuthenticationHOC(LoadingHOC(Shorten));
