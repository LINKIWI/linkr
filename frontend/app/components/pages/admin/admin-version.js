import dottie from 'dottie';
import React from 'react';
import request from 'browser-request';

import InfoTable from '../../info-table';

import context from '../../../util/context';

/**
 * Information about the server-deployed version of Linkr.
 */
export default class AdminVersion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      version: {
        branch: '',
        sha: '',
        message: '',
        date: '',
        remote: {}
      }
    };
  }

  componentDidMount() {
    this.loadVersion((_, json) => this.setState({
      version: dottie.get(json, 'version', {})
    }));
  }

  loadVersion(cb) {
    const {loading} = this.props;

    loading((done) => request.post({
      url: context.uris.VersionURI,
      json: {}
    }, (err, resp, json) => {
      cb(err, json);
      return done();
    }));
  }

  render() {
    const {version} = this.state;

    const remotes = Object.keys(version.remote).map((name) => ({
      key: `Remote (${name})`,
      value: version.remote[name].join(', ')
    }));

    const versionEntries = [
      {key: 'Branch', value: version.branch},
      {key: 'SHA', value: version.sha},
      {key: 'Message', value: version.message},
      {key: 'Date', value: version.date}
    ].concat(remotes);

    return (
      <div className="margin-huge--bottom">
        <p className="text--section-header">Deployment</p>
        <p className="text--section-caption">
          This is the version of the currently deployed instance of Linkr on the server.
        </p>

        <InfoTable className="margin-small--top" entries={versionEntries} />
      </div>
    );
  }
}
