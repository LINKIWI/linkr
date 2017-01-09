import React from 'react';

import AccountUpdatePasswordModal from './account-update-password-modal';

import Button from '../../ui/button';

/**
 * Section of the Account interface allowing the user to change his or her account password.
 */
export default class AccountUpdatePassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {displayConfirm: false};
  }

  handleUpdatePassword(evt) {
    evt.preventDefault();

    return this.updatePasswordModal.component.modal.showModal();
  }

  render() {
    return (
      <div className="margin-huge--bottom">
        <p className="text--section-header">UPDATE PASSWORD</p>
        <p className="text--section-caption">
          Update the password on your user account.
        </p>

        <Button
          className="sans-serif bold iota text-white"
          text={'Update password'}
          onClick={this.handleUpdatePassword.bind(this)}
        />

        <AccountUpdatePasswordModal
          ref={(elem) => {
            this.updatePasswordModal = elem;
          }}
        />
      </div>
    );
  }
}
