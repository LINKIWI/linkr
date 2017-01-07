import React from 'react';

import AccountDeactivateModal from './account-deactivate-modal';

import Button from '../../ui/button';

export default class AccountDeactivation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {displayConfirm: false};
  }

  handleDeactivateAccount(evt) {
    evt.preventDefault();

    const {displayConfirm} = this.state;

    if (!displayConfirm) {
      return this.setState({displayConfirm: true});
    }

    return this.deactivateModal.component.modal.showModal();
  }

  render() {
    const {displayConfirm} = this.state;

    return (
      <div className="margin-huge--bottom">
        <p className="text--section-header">ACCOUNT DEACTIVATION</p>
        <p className="text--section-caption">
          This will permanently delete your account as well as all links created under your account.
          <br />
          <span className="sans-serif bold text-red">You can't undo this action.</span>&nbsp;
          <span className="text-red">Please be sure this is what you want to do!</span>
        </p>

        <Button
          className="sans-serif bold iota text-white bg-red"
          text={displayConfirm ? 'Are you sure?' : 'Deactivate account'}
          onClick={this.handleDeactivateAccount.bind(this)}
        />

        <AccountDeactivateModal
          ref={(elem) => {
            this.deactivateModal = elem;
          }}
        />
      </div>
    );
  }
}
