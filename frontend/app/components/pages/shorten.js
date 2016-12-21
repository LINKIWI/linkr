/* global window */

import copy from 'copy-to-clipboard';
import Helmet from 'react-helmet';
import randomstring from 'randomstring';
import React from 'react';
import request from 'browser-request';
import url from 'url';

import Alert, {ALERT_TYPE_ERROR} from '../alert';
import Container from '../container';
import Header from '../header';
import Footer from '../footer';

import Button from '../ui/button';
import Checkbox from '../ui/checkbox';
import LoadingBar from '../ui/loading-bar';
import TextField from '../ui/text-field';
import Tooltip from '../ui/tooltip';

import context from '../../util/context';
import DisplayUtil from '../../util/display';

/**
 * Main interface for shortening a new link.
 */
export default class Shorten extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      submitStatus: {},
      isLinkCopied: false
    };
    this.randomAlias = randomstring.generate(10);
  }

  submit(evt) {
    evt.preventDefault();

    this.setState({
      isLoading: true,
      submitStatus: {},
      passwordProtect: false
    });

    request.put({
      url: context.uris.LinkAddURI,
      json: {
        /* eslint-disable camelcase */
        alias: this.aliasInput.getValue() || this.randomAlias,
        outgoing_url: this.outgoingURLInput.getValue(),
        password: this.passwordProtectCheck.isChecked() ? this.passwordProtectInput.getValue() : null
        /* eslint-enable camelcase */
      }
    }, (err, resp, json) => {
      if (err) {
        return this.setState({
          isLoading: false,
          submitStatus: {
            success: false,
            message: 'There was a network error. Please submitting again.'
          }
        });
      }

      return this.setState({
        isLoading: false,
        submitStatus: json
      });
    });
  }

  renderSuccess() {
    const {submitStatus, isLinkCopied} = this.state;

    const fullAliasURL = `${url.parse(context.config.LINKR_URL).href}${submitStatus.alias}`;

    return (
      <div>
        <div>
          <p className="sans-serif bold gamma text-gray-60 margin-small--bottom">SUCCESS!</p>
          <Tooltip contents={
            <p className="sans-serif">
              {
                isLinkCopied ?
                'Done! Link is copied to your clipboard. Click again to follow through.' :
                'Click on the link to copy it to your clipboard.'
              }
            </p>
          }>
            <a
              href={submitStatus.alias}
              className="shorten-field sans-serif"
              onClick={(evt) => {
                evt.preventDefault();

                if (isLinkCopied) {
                  window.location.href = submitStatus.alias;
                } else {
                  copy(fullAliasURL);
                  this.setState({
                    isLinkCopied: true
                  });
                }
              }}
            >
              {fullAliasURL}
            </a>
          </Tooltip>
        </div>

        <div>
          <p className="sans-serif bold gamma text-gray-60 margin--top margin-small--bottom">NOW POINTS TO</p>
          <a href={submitStatus.outgoing_url} className="shorten-field sans-serif">
            {submitStatus.outgoing_url}
          </a>
        </div>

        <Button
          className="sans-serif bold iota text-white margin-large--top"
          text="Shorten another?"
          onClick={(evt) => {
            evt.preventDefault();
            this.setState({
              submitStatus: {}
            });
          }}
        />
      </div>
    );
  }

  renderShorten() {
    const {isLoading, passwordProtect} = this.state;

    return (
      <div>
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
            onCheck={() => this.setState({
              passwordProtect: true
            })}
            onUncheck={() => this.setState({
              passwordProtect: false
            })}
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
            className="sans-serif bold iota text-white margin-large--top"
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
    const {isLoading, submitStatus} = this.state;

    return (
      <div>
        <Helmet title="Linkr" />

        {DisplayUtil.displayIf(isLoading, () => <LoadingBar />)}

        <Header selectIndex={0} />

        <Container className={isLoading ? 'fade' : ''}>
          {
            DisplayUtil.displayIf(
              DisplayUtil.isDefined(submitStatus.success) && !submitStatus.success,
              () => this.renderErrorAlert()
            )
          }

          <div className="margin-large--top margin-large--bottom">
            {
              DisplayUtil.displayIf(
                DisplayUtil.isDefined(submitStatus.success) && submitStatus.success,
                () => this.renderSuccess(),
                () => this.renderShorten()
              )
            }
          </div>
        </Container>

        <Footer />
      </div>
    );
  }
}
