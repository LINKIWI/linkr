/* global window, setTimeout */

import dottie from 'dottie';
import {Link} from 'react-router';
import Helmet from 'react-helmet';
import React from 'react';
import request from 'browser-request';

import Alert, {ALERT_TYPE_SUCCESS, ALERT_TYPE_ERROR} from '../alert';
import Container from '../container';
import Header from '../header';

import Button from '../ui/button';
import LoadingBar from '../ui/loading-bar';
import TextField from '../ui/text-field';

import context from '../../util/context';

/**
 * Default status page for an alias, if redirected to the frontend.
 */
export default class Alias extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      initialLoad: true,
      details: {}
    };
  }

  componentDidMount() {
    this.loadLinkDetails(this.props.params.alias, null, false, () => {
      this.setState({
        initialLoad: true
      });
    });
  }

  /**
   * Load details for a particular alias into component state.
   *
   * @param {String} alias Link alias.
   * @param {String} password Optional password for the alias, if necessary.
   * @param {Boolean} incrementHits True to request for the backend to increment the number of hits
   *                                on thi link when the request completes.
   * @param {Function=} cb Callback function called after setting component state.
   */
  loadLinkDetails(alias, password, incrementHits, cb) {
    this.setState({
      isLoading: true
    });

    request.post({
      url: context.uris.LinkDetailsURI,
      json: {
        /* eslint-disable camelcase */
        alias,
        password,
        increment_hits: incrementHits
        /* eslint-enable camelcase */
      }
    }, (err, resp, json) => {  // eslint-disable-line handle-callback-err
      this.setState({
        isLoading: false,
        initialLoad: false,
        details: json
      });
      (cb || (() => {}))(err, resp, json);
    });
  }

  /**
   * Submit a password check on the current link.
   *
   * @param {Object} evt DOM event triggered by form submit.
   */
  submitPassword(evt) {
    evt.preventDefault();

    this.loadLinkDetails(this.props.params.alias, this.linkPasswordInput.getValue(), true);
  }

  /**
   * Render an element for details about a nonexistent link.
   *
   * @returns {XML} React element for the page contents for a nonexistent link.
   */
  renderLinkNotFound() {
    return (
      <div className="margin-large--top margin-large--bottom">
        <p className="sans-serif bold gamma text-gray-70 margin-small--bottom">LINK NOT FOUND</p>
        <p className="not-found-text sans-serif bold text-gray-70 margin-large--bottom transition">
          The requested link does not exist.
        </p>

        <p className="sans-serif gamma text-gray-70 margin-small--bottom">
          Try to <Link to={context.uris.HomeURI}>create a new link</Link>.
        </p>
      </div>
    );
  }

  /**
   * Render an element for a password submission form for a password-protected link.
   *
   * @returns {XML} React element for the page contents for a password-protected link.
   */
  renderLinkPassword() {
    const {isLoading} = this.state;

    return (
      <div className="margin-large--top margin-large--bottom">
        <p className="sans-serif bold gamma text-gray-70 margin-small--bottom">PASSWORD PROTECTED LINK</p>
        <p className="not-found-text sans-serif bold text-gray-70 margin-large--bottom transition">
          This link is password protected.
        </p>

        <p className="sans-serif gamma text-gray-70 margin--top margin-small--bottom">
          Enter the link password below to continue.
        </p>

        <form>
          <TextField
            ref={(elem) => {
              this.linkPasswordInput = elem;
            }}
            type="password"
            className="shorten-field sans-serif light margin--bottom"
            style={{
              width: '100%'
            }}
          />

          <Button
            className="sans-serif bold gamma text-white margin-large--top"
            text="Submit"
            disabled={isLoading}
            onClick={this.submitPassword.bind(this)}
            style={{
              padding: '15px 30px'
            }}
          />
        </form>
      </div>
    );
  }

  render() {
    const {isLoading, initialLoad, details} = this.state;

    const contents = (() => {
      switch (details.failure) {
        case 'failure_nonexistent_alias':
          return this.renderLinkNotFound();
        case 'failure_incorrect_link_password':
          return this.renderLinkPassword();
        default:
          return null;
      }
    })();
    const outgoingURL = dottie.get(details, 'details.outgoing_url');

    if (outgoingURL) {
      setTimeout(() => {
        window.location.href = outgoingURL;
      }, 1500);
    }

    return (
      <div>
        <Helmet title="Linkr" />

        {isLoading && <LoadingBar />}

        <Header selectIndex={-1} />

        <Container className={isLoading ? 'fade' : ''}>
          {outgoingURL && (
            <Alert
              type={ALERT_TYPE_SUCCESS}
              title={'Success!'}
              message={`Redirecting you to ${outgoingURL}...`}
            />
          )}

          {details.failure && details.failure === 'failure_incorrect_link_password' && !initialLoad && (
            <Alert
              type={ALERT_TYPE_ERROR}
              title={'The submitted password was not correct.'}
              message={'Please try again.'}
            />
          )}

          {contents}
        </Container>
      </div>
    );
  }
}
