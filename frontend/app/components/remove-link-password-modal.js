import {Link} from 'react-router';
import LoadingHOC from 'react-loading-hoc';
import React from 'react';
import request from 'browser-request';

import Alert, {ALERT_TYPE_SUCCESS, ALERT_TYPE_ERROR} from './alert';

import Button from './ui/button';
import LoadingBar from './ui/loading-bar';
import Modal from './ui/modal';

import context from '../util/context';

/**
 * Modal used for removing a link's password.
 */
class RemoveLinkPasswordModal extends React.Component {
  static propTypes = {
    linkID: React.PropTypes.number,
    alias: React.PropTypes.string,
    fullAlias: React.PropTypes.string,
    outgoingURL: React.PropTypes.string,
    // Function to reload the link details in the parent component.
    // This should be called after a successful server-side link update, so that the UI reflects
    // the information that was just submitted by the user.
    reloadLinkDetails: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      passwordStatus: {
        success: null
      }
    };
  }

  /**
   * Default behavior for the modal's cancel button is to close the modal.
   *
   * @param {Object} evt DOM event object
   */
  handleCancelClick(evt) {
    evt.preventDefault();

    this.modal.hideModal();
  }

  /**
   * On submission, call the API for removing the link password. This will also trigger a link
   * details reload in the parent component on success.
   *
   * @param {Object} evt DOM event object
   */
  handleSubmitClick(evt) {
    evt.preventDefault();

    const {linkID, reloadLinkDetails, loading} = this.props;

    loading((done) => request.post({
      url: context.uris.LinkUpdatePasswordURI,
      json: {
        /* eslint-disable camelcase */
        link_id: linkID,
        password: null
        /* eslint-enable camelcase */
      }
    }, (err, resp, passwordStatus) => {  // eslint-disable-line handle-callback-err
      this.setState({passwordStatus});

      if (passwordStatus.success) {
        reloadLinkDetails();
      }

      return done();
    }));
  }

  render() {
    const {alias, fullAlias, isLoading} = this.props;
    const {passwordStatus} = this.state;

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
            passwordStatus.success !== null && (
              <Alert
                className={'iota'}
                type={passwordStatus.success ? ALERT_TYPE_SUCCESS : ALERT_TYPE_ERROR}
                title={
                  passwordStatus.success ?
                    'This link\'s password was removed successfully!' :
                    'There was an error removing this link\'s password.'
                }
                message={
                  passwordStatus.success ?
                    'All future requests to this link will no longer require a password.' :
                    passwordStatus.message
                }
                failure={passwordStatus.failure}
                failureMessages={{
                  /* eslint-disable camelcase */
                  failure_incomplete_params: 'This link does not seem to exist.'
                  /* eslint-enable camelcase */
                }}
              />
            )
          }

          <div className="margin-large--bottom">
            <p className="sans-serif bold text-gray-70 delta margin-small--bottom">
              Remove Link Password
            </p>
            <p className="sans-serif text-gray-60 iota">
              This will remove the existing password from the link with the alias&nbsp;
              <span className="sans-serif bold text-orange">{alias}</span>.
              All future requests to <Link to={fullAlias}>{fullAlias}</Link> will redirect
              without prompting for a password.
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
              className="sans-serif bold iota text-white"
              text="Submit"
              onClick={this.handleSubmitClick.bind(this)}
            />
          </div>
        </div>
      </Modal>
    );
  }
}

export default LoadingHOC(RemoveLinkPasswordModal);
