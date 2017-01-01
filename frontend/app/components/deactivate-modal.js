import {Link} from 'react-router';
import LoadingHOC from 'react-loading-hoc';
import React from 'react';

import Button from './ui/button';
import LoadingBar from './ui/loading-bar';
import Modal from './ui/modal';

class DeactivateModal extends React.Component {
  static propTypes = {
    alias: React.PropTypes.string,
    fullAlias: React.PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  handleCancelClick(evt) {
    evt.preventDefault();

    this.modal.hideModal();
  }

  handleSubmitClick(evt) {
    evt.preventDefault();

    this.props.loading(() => {});
  }

  render() {
    const {alias, fullAlias, isLoading} = this.props;

    return (
      <Modal
        ref={(elem) => {
          this.modal = elem;
        }}
        cancelable={!isLoading}
      >
        {isLoading && <LoadingBar />}
        <div className={`modal-content transition ${isLoading && 'fade'}`}>
          <div className="margin-large--bottom">
            <p className="sans-serif bold text-gray-70 delta margin-small--bottom">
              Deactivate Link
            </p>
            <p className="sans-serif text-gray-60 iota">
              This will deactivate the link with alias&nbsp;
              <span className="sans-serif bold text-orange">{alias}</span>.
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

export default LoadingHOC(DeactivateModal);
