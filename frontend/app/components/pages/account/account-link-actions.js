import Delete from 'react-icons/lib/md/delete';
import Launch from 'react-icons/lib/md/launch';
import React from 'react';
import Zoom from 'react-icons/lib/md/zoom-in';

import AccountLinkDeactivateModal from './account-link-deactivate-modal';

import Tooltip from '../../ui/tooltip';

import browser from '../../../util/browser';

export default class AccountLinkActions extends React.Component {
  handleOpenClick() {
    browser.push(this.props.link.alias);
  }

  handleDetailsClick() {
    browser.push(`/linkr/account/link/${this.props.link.alias}`);
  }

  handleDeleteClick() {
    this.deactivateModal.component.modal.showModal();
  }

  render() {
    const {link} = this.props;

    return (
      <span>
        <Tooltip
          contents={
            <span className="sans-serif kilo">Visit link</span>
          }
          tooltipStyle={{
            left: '-30px',
            width: '50px'
          }}
        >
          <Launch
            className="link-action-icon transition"
            onClick={this.handleOpenClick.bind(this)}
          />
        </Tooltip>

        <Tooltip
          contents={
            <span className="sans-serif kilo">View details</span>
          }
          tooltipStyle={{
            left: '-40px',
            width: '70px'
          }}
        >
          <Zoom
            className="link-action-icon transition"
            onClick={this.handleDetailsClick.bind(this)}
          />
        </Tooltip>

        <Tooltip
          contents={
            <span className="sans-serif kilo">Delete link</span>
          }
          tooltipStyle={{
            left: '-36px',
            width: '60px'
          }}
        >
          <Delete
            className="link-action-icon transition"
            onClick={this.handleDeleteClick.bind(this)}
          />
        </Tooltip>

        <AccountLinkDeactivateModal
          ref={(elem) => {
            this.deactivateModal = elem;
          }}
          linkID={link.link_id}
          alias={link.alias}
          fullAlias={link.full_alias}
        />
      </span>
    );
  }
}
