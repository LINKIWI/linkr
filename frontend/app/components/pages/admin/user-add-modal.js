import LoadingHOC from 'react-loading-hoc';
import React from 'react';
import request from 'browser-request';

import Alert, {ALERT_TYPE_SUCCESS, ALERT_TYPE_ERROR} from '../../alert';

import Button from '../../ui/button';
import Checkbox from '../../ui/checkbox';
import LoadingBar from '../../ui/loading-bar';
import Modal from '../../ui/modal';
import TextField from '../../ui/text-field';

import context from '../../../util/context';

/**
 * Modal used for adding a new user as an admin.
 */
class UserAddModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      addUserStatus: {
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
   * On submission, call the API for creating a new user with the text in the input fields.
   *
   * @param {Object} evt DOM event object
   */
  handleSubmitClick(evt) {
    evt.preventDefault();

    const {loading} = this.props;

    const username = this.usernameInput.getValue();
    const password = this.passwordInput.getValue();
    const passwordConfirm = this.confirmPasswordInput.getValue();
    const isAdmin = this.adminCheck.isChecked();

    if (password !== passwordConfirm) {
      return this.setState({
        addUserStatus: {
          success: false,
          message: 'The password and password confirmation do not match. Please try again.'
        }
      });
    }

    return loading((done) => request.put({
      url: context.uris.UserAddURI,
      json: {
        /* eslint-disable camelcase */
        username,
        password,
        is_admin: isAdmin
        /* eslint-enable camelcase */
      }
    }, (err, resp, addUserStatus = {}) => {  // eslint-disable-line handle-callback-err
      this.setState({addUserStatus});
      return done();
    }));
  }

  render() {
    const {isLoading} = this.props;
    const {addUserStatus} = this.state;

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
            addUserStatus.success !== null && (
              <Alert
                className={'iota'}
                type={addUserStatus.success ? ALERT_TYPE_SUCCESS : ALERT_TYPE_ERROR}
                title={
                  addUserStatus.success ?
                    'This user was created successfully!' :
                    'There was an error creating this user.'
                }
                message={
                  addUserStatus.success ?
                    <span>
                      You may now log in as&nbsp;
                      <span className="sans-serif bold">{addUserStatus.username}</span>.
                    </span> :
                    addUserStatus.message
                }
                failure={addUserStatus.failure}
                failureMessages={{
                  /* eslint-disable camelcase */
                  failure_incomplete_params: 'Both username and password must be supplied.'
                  /* eslint-enable camelcase */
                }}
              />
            )
          }

          <div className="margin-large--bottom">
            <p className="sans-serif bold text-gray-70 delta margin-small--bottom">
              Add New User
            </p>
            <p className="sans-serif text-gray-60 iota">
              Create a new user. You may optionally give this user an administrator role.
            </p>
          </div>

          <form>
            <div className="margin-large--bottom">
              <div className="margin--bottom">
                <p className="text--field-header">
                  Username
                </p>
                <TextField
                  ref={(elem) => {
                    this.usernameInput = elem;
                  }}
                  className="sans-serif light"
                  style={{width: '100%'}}
                />
              </div>

              <div className="margin--bottom">
                <p className="text--field-header">
                  Password
                </p>
                <TextField
                  ref={(elem) => {
                    this.passwordInput = elem;
                  }}
                  className="sans-serif light"
                  type="password"
                  style={{width: '100%'}}
                />
              </div>

              <div className="margin--bottom">
                <p className="text--field-header">
                  Confirm password
                </p>
                <TextField
                  ref={(elem) => {
                    this.confirmPasswordInput = elem;
                  }}
                  className="sans-serif light"
                  type="password"
                  style={{width: '100%'}}
                />
              </div>

              <Checkbox
                ref={(elem) => {
                  this.adminCheck = elem;
                }}
                text="Admin user"
              />
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

export default LoadingHOC(UserAddModal);
