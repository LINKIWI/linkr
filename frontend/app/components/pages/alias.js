import dottie from 'dottie';
import LoadingHOC from 'react-loading-hoc';
import Helmet from 'react-helmet';
import React from 'react';
import request from 'browser-request';

import Alert, {ALERT_TYPE_SUCCESS} from '../alert';
import AliasNotFound from './alias-not-found';
import AliasPassword from './alias-password';
import Container from '../container';
import Header from '../header';

import LoadingBar from '../ui/loading-bar';

import browser from '../../util/browser';
import context from '../../util/context';

/**
 * Default status page for an alias, if redirected to the frontend.
 */
class Alias extends React.Component {
  constructor(props) {
    super(props);

    this.state = {data: {}};
  }

  componentDidMount() {
    // Attempt to load link details immediately on mount.
    // This gives the user an opportunity to directly access the link without any intermediary
    // interactive steps, which is possible if (for example) the currently logged in user is an
    // admin.
    this.loadLinkDetails(this.props.params.alias, null, (_, resp, data) => this.setState({data}));
  }

  /**
   * Load details for a particular alias into component state.
   *
   * @param {String} alias Link alias.
   * @param {String} password Optional password for the alias, if necessary.
   * @param {Function=} cb Callback function called after setting component state.
   */
  loadLinkDetails(alias, password, cb) {
    this.props.loading((done) => {
      request.post({
        url: context.uris.LinkDetailsURI,
        json: {alias, password}
      }, (err, resp, json) => {
        if (json.success) {
          // Redirect the user to the outgoing URL
          browser.go(dottie.get(json, 'details.outgoing_url'), 1500);

          return request.post({
            url: context.uris.LinkIncrementHitsURI,
            json: {
              /* eslint-disable camelcase */
              link_id: dottie.get(json, 'details.link_id'),
              password
              /* eslint-enable camelcase */
            }
          }, () => {
            done();
            return cb(err, resp, json);
          });
        }

        done();
        return cb(err, resp, json);
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
    const {isLoading} = this.props;
    const {data} = this.state;

    if (data.failure === 'failure_nonexistent_link') {
      return <AliasNotFound />;
    }

    if (data.failure === 'failure_incorrect_link_password') {
      return (
        <AliasPassword
          loadLinkDetails={this.loadLinkDetails.bind(this)}
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
      </div>
    );
  }
}

export default LoadingHOC(Alias);
