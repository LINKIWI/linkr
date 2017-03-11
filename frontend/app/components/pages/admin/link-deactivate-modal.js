/* global setTimeout */

import browserHistory from 'react-router/lib/browserHistory';
import Link from 'react-router/lib/Link';
import LoadingHOC from 'react-loading-hoc';
import React from 'react';
import request from 'browser-request';

import Alert, {ALERT_TYPE_SUCCESS, ALERT_TYPE_ERROR} from '../../alert';

import Button from '../../ui/button';
import LoadingBar from '../../ui/loading-bar';
import Modal from '../../ui/modal';

import context from '../../../util/context';

class LinkDeactivateModal extends React.Component {
  static propTypes = {
    linkID: React.PropTypes.number,
    alias: React.PropTypes.string,
    fullAlias: React.PropTypes.string
  };

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

    const {linkID, loading} = this.props;

    loading((done) => request({
      url: context.uris.LinkDeleteURI,
      method: 'DELETE',
      json: {
        /* eslint-disable camelcase */
        link_id: linkID
        /* eslint-enable camelcase */
      }
    }, (err, resp, deactivateStatus) => {  // eslint-disable-line handle-callback-err
      this.setState({deactivateStatus});

      // On successful deactivation, redirect back to the admin page
      if (deactivateStatus.success) {
        setTimeout(() => browserHistory.push(context.uris.AdminURI), 3000);
      }

      return done();
    }));
  }

  render() {
    const {alias, fullAlias, isLoading} = this.props;
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
                    'This link was deactivated successfully!' :
                    'There was an error deactivating this link.'
                }
                message={
                  deactivateStatus.success ?
                    'Redirecting you back to the admin page...' :
                    deactivateStatus.message
                }
                failure={deactivateStatus.failure}
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
              Deactivate Link
            </p>
            <p className="sans-serif text-gray-60 iota">
              This will deactivate the link with alias&nbsp;
              <span className="sans-serif bold text-primary">{alias}</span>.
              All future requests to <Link to={fullAlias}>{fullAlias}</Link> will no longer redirect.
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

export default LoadingHOC(LinkDeactivateModal);
