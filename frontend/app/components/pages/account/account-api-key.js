import copy from 'copy-to-clipboard';
import {Link} from 'react-router';
import React from 'react';

import AccountRegenerateAPIKeyModal from './account-regenerate-api-key-modal';

import Button from '../../ui/button';
import TextField from '../../ui/text-field';
import Tooltip from '../../ui/tooltip';

import context from '../../../util/context';

/**
 * Section of the Account interface allowing the user to view and regenerate the current API key.
 */
export default class AccountAPIKey extends React.Component {
  constructor(props) {
    super(props);

    this.state = {isAPIKeyCopied: false};
  }

  handleRegenerateAPIKey(evt) {
    evt.preventDefault();

    return this.regenerateAPIKeyModal.component.modal.showModal();
  }

  handleAPIKeyClick(evt) {
    this.apiKeyInput.input.setSelectionRange(0, this.apiKeyInput.input.value.length);
    copy(this.apiKeyInput.getValue());

    this.setState({isAPIKeyCopied: true});
  }

  handleAPIKeyMouseOver(evt) {
    this.apiKeyInput.input.type = 'text';
  }

  handleAPIKeyMouseOut(evt) {
    const {isAPIKeyCopied} = this.state;

    this.apiKeyInput.input.type = isAPIKeyCopied ? 'text' : 'password';
  }

  render() {
    const {user} = this.props;
    const {isAPIKeyCopied} = this.state;

    return (
      <div className="margin-huge--bottom">
        <p className="text--section-header">API KEY</p>
        <p className="text--section-caption margin--bottom">
          This is the API key associated with your account. Use it to programmatically authenticate
          requests made to the <Link to={context.uris.APIDocumentationURI}>Linkr API</Link>.
        </p>

        <div className="margin--bottom">
          <Tooltip
            contents={
              <p className="sans-serif">
                {
                  isAPIKeyCopied ?
                    'Done! API key is copied to your clipboard.' :
                    'Click to copy to your clipboard.'
                }
              </p>
            }
          >
            <TextField
              ref={(elem) => {
                this.apiKeyInput = elem;
              }}
              className="api-key-input monospace"
              type="password"
              value={user.api_key}
              onClick={this.handleAPIKeyClick.bind(this)}
              onMouseOver={this.handleAPIKeyMouseOver.bind(this)}
              onMouseOut={this.handleAPIKeyMouseOut.bind(this)}
              readOnly={true}
            />
          </Tooltip>
        </div>

        <p className="text--section-caption margin-tiny--bottom">
          Treat this API key like your password; make sure only you have access to its value as a
          secret.
        </p>
        <p className="text--section-caption">
          If your API key is ever compromised, you can invalidate your current key and generate a
          new one via the button below.
        </p>

        <Button
          className="sans-serif bold iota text-white"
          text={'Regenerate API key'}
          onClick={this.handleRegenerateAPIKey.bind(this)}
        />

        <AccountRegenerateAPIKeyModal
          ref={(elem) => {
            this.regenerateAPIKeyModal = elem;
          }}
        />
      </div>
    );
  }
}
