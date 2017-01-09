import LoadingHOC from 'react-loading-hoc';
import React from 'react';
import request from 'browser-request';

import Alert, {ALERT_TYPE_SUCCESS, ALERT_TYPE_ERROR} from '../../alert';

import Button from '../../ui/button';
import LoadingBar from '../../ui/loading-bar';
import Modal from '../../ui/modal';
import TextField from '../../ui/text-field';

import context from '../../../util/context';

class AccountUpdatePasswordModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordStatus: {
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

    const newPassword = this.newPasswordInput.getValue();
    const newPasswordConfirm = this.confirmPasswordInput.getValue();

    if (newPassword !== newPasswordConfirm) {
      return this.setState({
        passwordStatus: {
          success: false,
          message: 'The new password and new password confirmation do not match. Please try again.'
        }
      });
    }

    return this.props.loading((done) => request.post({
      url: context.uris.UserUpdatePasswordURI,
      json: {
        /* eslint-disable camelcase */
        current_password: this.currentPasswordInput.getValue(),
        new_password: this.newPasswordInput.getValue()
        /* eslint-enable camelcase */
      }
    }, (err, resp, passwordStatus) => {  // eslint-disable-line handle-callback-err
      this.setState({passwordStatus});
      return done();
    }));
  }

  render() {
    const {isLoading} = this.props;
    const {passwordStatus} = this.state;

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
            passwordStatus.success !== null && (
              <Alert
                className={'iota'}
                type={passwordStatus.success ? ALERT_TYPE_SUCCESS : ALERT_TYPE_ERROR}
                title={
                  passwordStatus.success ?
                    'Your password has been updated.' :
                    'There was an error updating your password.'
                }
                message={
                  passwordStatus.success ?
                    'You may close this window.' :
                    passwordStatus.message
                }
                failure={passwordStatus.failure}
                failureMessages={{
                  /* eslint-disable camelcase */
                  failure_incomplete_params: 'You must supply both your current password and the desired new password.'
                  /* eslint-enable camelcase */
                }}
              />
            )
          }

          <div className="margin-large--bottom">
            <p className="sans-serif bold text-gray-70 delta margin-small--bottom">
              Update Password
            </p>
            <p className="sans-serif text-gray-60 iota">
              Set a new password for your account.
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

              <div className="margin--bottom">
                <p className="text--field-header">
                  New password
                </p>
                <TextField
                  ref={(elem) => {
                    this.newPasswordInput = elem;
                  }}
                  type="password"
                  className="sans-serif light"
                  style={{
                    width: '100%'
                  }}
                />
              </div>

              <div>
                <p className="text--field-header">
                  Confirm new password
                </p>
                <TextField
                  ref={(elem) => {
                    this.confirmPasswordInput = elem;
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

export default LoadingHOC(AccountUpdatePasswordModal);
