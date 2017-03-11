import Link from 'react-router/lib/Link';
import LoadingHOC from 'react-loading-hoc';
import React from 'react';
import request from 'browser-request';

import Alert, {ALERT_TYPE_SUCCESS, ALERT_TYPE_ERROR} from '../../alert';

import Button from '../../ui/button';
import LoadingBar from '../../ui/loading-bar';
import Modal from '../../ui/modal';
import TextField from '../../ui/text-field';

import context from '../../../util/context';

class AccountRegenerateAPIKeyModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      regenerateStatus: {
        success: null
      }
    };
  }

  handleCancelClick(evt) {
    evt.preventDefault();

    this.modal.hideModal();
  }

  handleSubmitClick(evt) {
    evt.preventDefault();

    this.props.loading((done) => request.post({
      url: context.uris.UserRegenerateAPIKeyURI,
      json: {
        password: this.currentPasswordInput.getValue()
      }
    }, (err, resp, regenerateStatus) => {  // eslint-disable-line handle-callback-err
      this.setState({regenerateStatus});
      return done();
    }));
  }

  render() {
    const {isLoading} = this.props;
    const {regenerateStatus} = this.state;

    return (
      <Modal
        ref={(elem) => {
          this.modal = elem;
        }}
        cancelable={!isLoading}
      >
        <LoadingBar show={isLoading} />

        <div className={`modal-content transition ${isLoading && 'fade'}`}>
          {
            regenerateStatus.success !== null && (
              <Alert
                className={'iota'}
                type={regenerateStatus.success ? ALERT_TYPE_SUCCESS : ALERT_TYPE_ERROR}
                title={
                  regenerateStatus.success ?
                    'A new API key has been generated for your account!' :
                    'There was an error generating a new API key for your account.'
                }
                message={
                  regenerateStatus.success ?
                    'Close this window and refresh the page to see your new API key.' :
                    regenerateStatus.message
                }
                failure={regenerateStatus.failure}
                failureMessages={{
                  /* eslint-disable camelcase */
                  failure_incomplete_params: 'You must enter your current password to generate a new API key.'
                  /* eslint-enable camelcase */
                }}
              />
            )
          }

          <div className="margin-large--bottom">
            <p className="sans-serif bold text-gray-70 delta margin-small--bottom">
              Regenerate API Key
            </p>
            <p className="sans-serif text-gray-60 iota margin-small--bottom">
              This will generate a new API key for your account. Note that your old API key will no
              longer authenticate you to the Linkr backend, and you must use your new API key for
              future API requests.
            </p>
            <p className="sans-serif text-gray-60 iota margin-small--bottom">
              See the <Link to={context.uris.APIDocumentationURI}>API documentation</Link> for more
              information about the Linkr API.
            </p>
            <p className="sans-serif text-gray-60 iota margin-small--bottom">
              Confirm your current account password to continue.
            </p>
          </div>

          <form>
            <div className="margin-large--bottom">
              <div className="margin--bottom">
                <p className="text--field-header">
                  Current password
                </p>
                <TextField
                  ref={(elem) => {
                    this.currentPasswordInput = elem;
                  }}
                  type="password"
                  className="sans-serif light"
                  style={{
                    width: '100%'
                  }}
                />
              </div>
            </div>

            <div className="text-right">
              <a
                className="sans-serif bold iota margin--right"
                href="#"
                onClick={this.handleCancelClick.bind(this)}
              >
                CANCEL
              </a>
              <Button
                className="sans-serif bold iota text-white"
                text="Submit"
                onClick={this.handleSubmitClick.bind(this)}
              />
            </div>
          </form>
        </div>
      </Modal>
    );
  }
}

export default LoadingHOC(AccountRegenerateAPIKeyModal);
