import dottie from 'dottie';
import LoadingHOC from 'react-loading-hoc';
import Helmet from 'react-helmet';
import React from 'react';
import request from 'browser-request';

import Alert, {ALERT_TYPE_SUCCESS} from '../../alert';
import AliasHumanVerification from './alias-human-verification';
import AliasNotFound from './alias-not-found';
import AliasPassword from './alias-password';
import AuthenticationHOC from '../../hoc/authentication-hoc';
import Container from '../../container';
import Footer from '../../footer';
import Header from '../../header';

import LoadingBar from '../../ui/loading-bar';

import browser from '../../../util/browser';
import context from '../../../util/context';

/**
 * Default status page for an alias, if redirected to the frontend.
 */
class Alias extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      alias: props.params.alias,
      // The below fields are dynamically updated by children components, and any attempts to
      // retrieve the link details use these parameters from state.
      password: null,
      recaptcha: null
    };
  }

  componentDidMount() {
    // Attempt to load link details immediately on mount.
    // This gives the user an opportunity to directly access the link without any intermediary
    // interactive steps, which is possible if (for example) the currently logged in user is an
    // admin.
    this.loadLinkDetails();
  }

  componentWillUnmount() {
    browser.clearTimeout(this.timeout);
  }

  /**
   * Set the state of this component, mutating additional parameters passed to the link details
   * API.
   *
   * @param {Object} params Object mapping of link properties.
   * @param {Function} cb Callback function triggered after the state has been updated.
   */
  setLinkAccessParams(params, cb) {
    this.setState(params, cb);
  }

  /**
   * Load details for a particular alias into component state.
   *
   * @param {Function=} cb Callback function called after setting component state.
   */
  loadLinkDetails(cb = () => {}) {
    const {alias, password, recaptcha} = this.state;

    this.props.loading((done) => {
      request.post({
        url: context.uris.LinkDetailsURI,
        json: {alias, password, recaptcha}
      }, (err, resp, data) => {
        this.setState({data});

        if (data.success) {
          // Redirect the user to the outgoing URL
          this.timeout = browser.go(dottie.get(data, 'details.outgoing_url'), 1500);

          return request.post({
            url: context.uris.LinkIncrementHitsURI,
            json: {
              /* eslint-disable camelcase */
              link_id: dottie.get(data, 'details.link_id'),
              password
              /* eslint-enable camelcase */
            }
          }, () => {
            done();
            return cb(err, resp, data);
          });
        }

        done();
        return cb(err, resp, data);
      });
    });
  }

  renderContents() {
    const {data} = this.state;
    const details = dottie.get(data, 'details', {});

    if (data.success) {
      return (
        <Alert
          type={ALERT_TYPE_SUCCESS}
          title={'Success!'}
          message={`Redirecting you to ${details.outgoing_url}...`}
        />
      );
    }

    return null;
  }

  render() {
    const {isLoading, user} = this.props;
    const {data} = this.state;

    if (data.failure === 'failure_nonexistent_link') {
      return <AliasNotFound />;
    }

    if (data.failure === 'failure_incorrect_link_password') {
      return (
        <AliasPassword
          loadLinkDetails={this.loadLinkDetails.bind(this)}
          setLinkAccessParams={this.setLinkAccessParams.bind(this)}
          {...this.props}
        />
      );
    }

    if (data.failure === 'failure_invalid_recaptcha') {
      return (
        <AliasHumanVerification
          loadLinkDetails={this.loadLinkDetails.bind(this)}
          setLinkAccessParams={this.setLinkAccessParams.bind(this)}
          {...this.props}
        />
      );
    }

    return (
      <div>
        <Helmet title="Linkr" />
        {isLoading && <LoadingBar />}
        <Header />

        <Container className={isLoading ? 'fade' : ''}>
          {this.renderContents()}
        </Container>

        <Footer user={user} />
      </div>
    );
  }
}

export default AuthenticationHOC(LoadingHOC(Alias));
