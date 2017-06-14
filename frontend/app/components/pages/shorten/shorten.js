import Helmet from 'react-helmet';
import Help from 'react-icons/lib/md/help-outline';
import LoadingHOC from 'react-loading-hoc';
import range from 'range';
import React from 'react';
import request from 'browser-request';
import urlParse from 'url-parse';

import Alert, {ALERT_TYPE_ERROR, ALERT_TYPE_WARN} from '../../alert';
import AuthenticationHOC from '../../hoc/authentication-hoc';
import Container from '../../container';
import Header from '../../header';
import Footer from '../../footer';
import RecentLinks from './recent-links';
import shortenData from '../../../../resources/data/shorten';

import Button from '../../ui/button';
import Checkbox from '../../ui/checkbox';
import LoadingBar from '../../ui/loading-bar';
import TextField from '../../ui/text-field';
import Tooltip from '../../ui/tooltip';

import browser from '../../../util/browser';
import context from '../../../util/context';
import db from '../../../util/db';

/**
 * Main interface for shortening a new link.
 */
class Shorten extends React.Component {
  constructor(props) {
    super(props);

    this.state = {submitStatus: {}};
    this.randomURL = shortenData.examples[Math.trunc(Math.random() * shortenData.examples.length)];
    this.randomAlias = generateRandomAlias(10);
  }

  submit(evt) {
    evt.preventDefault();

    this.setState({submitStatus: {}});

    const rawOutgoingURL = this.outgoingURLInput.getValue();
    // The second parameter to urlParse is a hack to get around the fact that the library, for some
    // unknown bizarre reason, defaults to using the browser's window location as a root path if the
    // input is a relative path. This is quite stupid as the URL parsed here is not in any way
    // related to the browser location, so passing a bogus root name forces the library to fall back
    // to parsing the input URL as-is without prepending the current window location.
    const outgoingURL = urlParse(rawOutgoingURL, '.').protocol ?
      rawOutgoingURL : `http://${rawOutgoingURL}`;

    this.props.loading((done) => {
      request.put({
        url: context.uris.LinkAddURI,
        json: {
          /* eslint-disable camelcase */
          alias: this.aliasInput.getValue() || this.randomAlias,
          outgoing_url: outgoingURL,
          password: this.passwordProtectCheck.isChecked() ? this.passwordProtectInput.getValue() : null,
          require_recaptcha: this.recaptchaCheck.isChecked()
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

        // Add this newly created link as an item in the recent links
        db.addRecentLink(submitStatus.alias);

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
        <Alert
          type={ALERT_TYPE_WARN}
          title={'Usage warning!'}
          message={
            <span>
              This is a <span className="sans-serif bold">demo</span> instance of Linkr.
              It should not be used as a public, general-purpose link shortener; please deploy an
              instance to your own servers for this purpose. This demo instance's database is
              automatically reset every 24 hours.
            </span>
          }
        />

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
            placeholder={this.randomURL}
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
              {urlParse(context.config.linkr_url).href}/
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
              this.recaptchaCheck = elem;
            }}
            className="margin-large--top"
            text={
              <span>
                Require human verification
                <Tooltip
                  tooltipStyle={{
                    width: '210px',
                    marginLeft: '-99px',
                    cursor: 'default'
                  }}
                  contents={
                    <p className="sans-serif kilo">
                      Require users to perform a CAPTCHA verification before accessing the link.
                    </p>
                  }
                >
                  <Help className="help-icon margin-small--left" />
                </Tooltip>
              </span>
            }
          />

          <Checkbox
            ref={(elem) => {
              this.passwordProtectCheck = elem;
            }}
            className="margin-small--top"
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
    const {isLoading, isLoggedIn, user} = this.props;
    const {submitStatus} = this.state;

    if (submitStatus.success === true) {
      browser.push(`/linkr/success/${submitStatus.alias}`);
    }

    if (isLoggedIn === false && context.config.require_login_to_create) {
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

          <div style={{marginTop: '70px'}}>
            <RecentLinks />
          </div>
        </Container>

        <Footer user={user} />
      </div>
    );
  }
}

/**
 * Generate a random alphanumeric alias.
 *
 * @param {Number} length Desired random alias length.
 * @returns {String} A random alias consisting only of alphabetic and numeric characters.
 */
function generateRandomAlias(length) {
  const alpha = 'abcdefghijklmnopqrstuvwxyz';
  const nums = '0123456789';
  const chars = (alpha.toLowerCase() + alpha.toUpperCase() + nums).split('');

  return range
    .range(0, length)
    .map(() => chars[Math.floor(Math.random() * chars.length)])
    .join('');
}

export default AuthenticationHOC(LoadingHOC(Shorten));
