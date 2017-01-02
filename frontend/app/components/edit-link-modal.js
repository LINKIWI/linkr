import LoadingHOC from 'react-loading-hoc';
import React from 'react';
import request from 'browser-request';

import Alert, {ALERT_TYPE_SUCCESS, ALERT_TYPE_ERROR} from './alert';

import Button from './ui/button';
import LoadingBar from './ui/loading-bar';
import Modal from './ui/modal';
import TextField from './ui/text-field';

import context from '../util/context';

/**
 * Modal used for updating a link's alias and/or outgoing URL.
 */
class EditLinkModal extends React.Component {
  static propTypes = {
    linkID: React.PropTypes.number,
    alias: React.PropTypes.string,
    outgoingURL: React.PropTypes.string,
    // Function to reload the link details in the parent component.
    // This should be called after a successful server-side link update, so that the UI reflects
    // the information that was just submitted by the user.
    reloadLinkDetails: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      editStatus: {
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
   * On submission, call the API for updating the link information with the text in the input
   * fields. This will also trigger a link details reload in the parent component on success.
   *
   * @param {Object} evt DOM event object
   */
  handleSubmitClick(evt) {
    evt.preventDefault();

    const {linkID, reloadLinkDetails, loading} = this.props;

    loading((done) => request.post({
      url: context.uris.LinkEditURI,
      json: {
        /* eslint-disable camelcase */
        link_id: linkID,
        alias: this.linkAliasInput.getValue() || null,
        outgoing_url: this.linkOutgoingURLInput.getValue() || null
        /* eslint-enable camelcase */
      }
    }, (err, resp, editStatus) => {  // eslint-disable-line handle-callback-err
      this.setState({editStatus});

      if (editStatus.success) {
        reloadLinkDetails();
      }

      return done();
    }));
  }

  render() {
    const {alias, outgoingURL, isLoading} = this.props;
    const {editStatus} = this.state;

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
            editStatus.success !== null && (
              <Alert
                className={'iota'}
                type={editStatus.success ? ALERT_TYPE_SUCCESS : ALERT_TYPE_ERROR}
                title={
                  editStatus.success ?
                    'This link was updated successfully!' :
                    'There was an error updating this link.'
                }
                message={
                  editStatus.success ?
                    'You may now close this dialog to see the updated information.' :
                    editStatus.message
                }
                failure={editStatus.failure}
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
              Edit Link Details
            </p>
            <p className="sans-serif text-gray-60 iota">
              Edit the alias and outgoing URL for the link with alias&nbsp;
              <span className="sans-serif bold text-orange">{alias}</span>.
            </p>
          </div>

          <form>
            <div className="margin-large--bottom">
              <div className="margin--bottom">
                <p className="text--field-header">
                  New alias
                </p>
                <TextField
                  ref={(elem) => {
                    this.linkAliasInput = elem;
                  }}
                  className="sans-serif light"
                  style={{
                    width: '100%'
                  }}
                  placeholder={alias}
                />
              </div>

              <div>
                <p className="text--field-header">
                  Outgoing URL
                </p>
                <TextField
                  ref={(elem) => {
                    this.linkOutgoingURLInput = elem;
                  }}
                  className="sans-serif light"
                  style={{
                    width: '100%'
                  }}
                  placeholder={outgoingURL}
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

export default LoadingHOC(EditLinkModal);
