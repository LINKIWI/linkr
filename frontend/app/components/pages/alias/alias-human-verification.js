/* global config */

import dottie from 'dottie';
import Helmet from 'react-helmet';
import React from 'react';
import Recaptcha from 'react-google-recaptcha';

import Alert, {ALERT_TYPE_SUCCESS, ALERT_TYPE_ERROR} from '../../alert';
import Container from '../../container';
import Footer from '../../footer';
import Header from '../../header';

import LoadingBar from '../../ui/loading-bar';

/**
 * Page providing an interface for the user to interactively perform human verification with a
 * ReCAPTCHA widget.
 */
export default class AliasHumanVerification extends React.Component {
  constructor(props) {
    super(props);

    this.state = {data: {}};
  }

  /**
   * Submit another link details fetch request, augmented by a ReCAPTCHA response string.
   *
   * @param {String} recaptcha ReCAPTCHA response string as supplied by the ReCAPTCHA widget.
   */
  submitHumanVerification(recaptcha) {
    const {setLinkAccessParams, loadLinkDetails} = this.props;

    return setLinkAccessParams({recaptcha},
      () => loadLinkDetails((_, resp, data) => this.setState({data})));
  }

  render() {
    const {isLoading, params, user} = this.props;
    const {data} = this.state;
    const details = dottie.get(data, 'details', {});

    return (
      <div>
        <Helmet title="Human Verification - Linkr" />
        {isLoading && <LoadingBar />}
        <Header />

        <Container className={isLoading && 'fade'}>
          {data.failure && data.failure === 'failure_incorrect_link_password' && (
            <Alert
              type={ALERT_TYPE_ERROR}
              title={'The submitted ReCAPTCHA was invalid.'}
              message={'Please try again.'}
            />
          )}

          {data.success && (
            <Alert
              type={ALERT_TYPE_SUCCESS}
              title={'Success!'}
              message={`Redirecting you to ${details.outgoing_url}...`}
            />
          )}

          <div className="margin-large--top margin-large--bottom">
            <p className="sans-serif bold gamma text-gray-70 margin-small--bottom">
              HUMAN VERIFICATION
            </p>
            <p className="not-found-text sans-serif bold text-gray-70 margin-large--bottom transition">
              This link requires human verification.
            </p>

            <p className="sans-serif gamma text-gray-70 margin--top margin-huge--bottom">
              Please complete the ReCAPTCHA below to
              access <span className="sans-serif bold text-orange">{params.alias}</span>.
            </p>

            <Recaptcha
              ref={(elem) => {
                this.recaptcha = elem;
              }}
              sitekey={config.secrets.recaptcha_site_key}
              onChange={this.submitHumanVerification.bind(this)}
            />
          </div>
        </Container>

        <Footer user={user} />
      </div>
    );
  }
}
