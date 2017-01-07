import dottie from 'dottie';
import Helmet from 'react-helmet';
import React from 'react';

import Alert, {ALERT_TYPE_SUCCESS, ALERT_TYPE_ERROR} from '../alert';
import Container from '../container';
import Header from '../header';

import Button from '../ui/button';
import LoadingBar from '../ui/loading-bar';
import TextField from '../ui/text-field';

/**
 * Page providing an interface for the user to interactively enter a password to access a
 * password-protected link.
 */
export default class AliasPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {data: {}};
  }

  /**
   * Submit a password check on the current link.
   *
   * @param {Object} evt DOM event triggered by form submit.
   */
  submitPassword(evt) {
    evt.preventDefault();

    const {params, loadLinkDetails} = this.props;

    const alias = params.alias;
    const password = this.linkPasswordInput.getValue();
    loadLinkDetails(alias, password, (_, resp, data) => this.setState({data}));
  }

  render() {
    const {isLoading} = this.props;
    const {data} = this.state;
    const details = dottie.get(data, 'details', {});

    return (
      <div>
        <Helmet title="Password Protected Link - Linkr" />
        {isLoading && <LoadingBar />}
        <Header />

        <Container className={isLoading && 'fade'}>
          {data.failure && data.failure === 'failure_incorrect_link_password' && (
            <Alert
              type={ALERT_TYPE_ERROR}
              title={'The submitted password was not correct.'}
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
        </Container>
      </div>
    );
  }
}
