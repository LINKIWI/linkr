import LoadingHOC from 'react-loading-hoc';
import React from 'react';
import request from 'browser-request';

import Alert, {ALERT_TYPE_SUCCESS, ALERT_TYPE_ERROR} from '../../alert';

import Button from '../../ui/button';
import LoadingBar from '../../ui/loading-bar';
import Modal from '../../ui/modal';

import browser from '../../../util/browser';
import context from '../../../util/context';

class LinkDeactivateModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      deactivateStatus: {
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

    this.props.loading((done) => request({
      url: context.uris.UserDeactivationURI,
      method: 'DELETE',
      json: {}
    }, (err, resp, deactivateStatus) => {  // eslint-disable-line handle-callback-err
      this.setState({deactivateStatus});

      // On successful deactivation, redirect back to the admin page
      if (deactivateStatus.success) {
        browser.go(context.uris.HomeURI, 3000);
      }

      return done();
    }));
  }

  render() {
    const {isLoading} = this.props;
    const {deactivateStatus} = this.state;

    return (
      <Modal
        ref={(elem) => {
          this.modal = elem;
        }}
        cancelable={!isLoading}
      >
        {isLoading && <LoadingBar />}

        <div className={`modal-content transition ${isLoading && 'fade'}`}>
          {
            deactivateStatus.success !== null && (
              <Alert
                className={'iota'}
                type={deactivateStatus.success ? ALERT_TYPE_SUCCESS : ALERT_TYPE_ERROR}
                title={
                  deactivateStatus.success ?
                    'Your account has been deactivated.' :
                    'There was an error deactivating your account.'
                }
                message={
                  deactivateStatus.success ?
                    'Redirecting you back to the main page...' :
                    deactivateStatus.message
                }
              />
            )
          }

          <div className="margin-large--bottom">
            <p className="sans-serif bold text-gray-70 delta margin-small--bottom">
              Deactivate Account
            </p>
            <p className="sans-serif text-gray-60 iota margin-small--bottom">
              This will delete your account and all links created in the web interface while you were logged in,
              or programmatically via the API while authenticated with your API key.
            </p>
            <p className="sans-serif text-gray-60 iota margin-small--bottom">
              This might take a while, depending on the number of links you've created.
            </p>
            <p className="sans-serif bold iota text-red">
              After you delete your account, you won't be able to recover any of your data.
            </p>
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
              className="sans-serif bold iota text-white bg-red"
              text="Deactivate"
              onClick={this.handleSubmitClick.bind(this)}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

export default LoadingHOC(LinkDeactivateModal);
