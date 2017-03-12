import dottie from 'dottie';
import flat from 'flat';
import React from 'react';
import request from 'browser-request';

import InfoTable from '../../info-table';

import Tooltip from '../../ui/tooltip';

import context from '../../../util/context';

/**
 * Server-side configuration section of the admin interface.
 */
export default class AdminConfig extends React.Component {
  constructor(props) {
    super(props);

    this.state = {config: {}};
  }

  componentDidMount() {
    this.loadConfig((_, json) => this.setState({
      config: dottie.get(json, 'config', {})
    }));
  }

  loadConfig(cb) {
    const {loading} = this.props;

    loading((done) => request.post({
      url: context.uris.ConfigURI,
      json: {}
    }, (err, resp, json) => {
      cb(err, json);
      return done();
    }));
  }

  render() {
    const {config} = this.state;
    const flatConfig = flat.flatten(config);

    const configEntries = Object.keys(flatConfig).map((key) => {
      const valueMaxLength = 60;
      const configValue = (flatConfig[key] === null ? 'null' : flatConfig[key]).toString();
      const value = configValue.length > valueMaxLength ? (
        <Tooltip contents={<span>{configValue}</span>}>
          {`${configValue.substring(0, valueMaxLength)}...`}
        </Tooltip>
      ) : configValue;

      return {key, value};
    });

    const configFile = (
      <span>
        <span className="monospace bold">config/options/&#42;.json</span>
        &nbsp;and&nbsp;
        <span className="monospace bold">config/secrets/&#42;.json</span>
      </span>
    );

    return (
      <div className="margin-huge--bottom">
        <p className="text--section-header">Configuration</p>
        <p className="text--section-caption">
          These configuration values are defined server-side in {configFile}.&nbsp;
          To change any of the below values, modify {configFile}, rebuild frontend resources, and
          reload Apache.
        </p>

        <InfoTable className="margin-small--top" entries={configEntries} />
      </div>
    );
  }
}
