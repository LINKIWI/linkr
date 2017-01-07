import copy from 'copy-to-clipboard';
import dottie from 'dottie';
import Helmet from 'react-helmet';
import humanize from 'humanize';
import LoadingHOC from 'react-loading-hoc';
import React from 'react';
import request from 'browser-request';

import Container from '../../container';
import Footer from '../../footer';
import Header from '../../header';
import InfoTable from '../../info-table';
import LinkTooltip from '../../link-tooltip';

import BackNav from '../../ui/back-nav';
import LoadingBar from '../../ui/loading-bar';

import context from '../../../util/context';

/**
 * Link details page, referred from the Account interface.
 */
class AccountLinkDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {details: {}};
  }

  componentDidMount() {
    this.loadLinkDetails();
  }

  loadLinkDetails() {
    this.props.loading((done) => request.post({
      url: context.uris.LinkDetailsURI,
      json: {
        alias: this.props.params.alias
      }
    }, (err, resp, json) => {  // eslint-disable-line handle-callback-err
      const details = dottie.get(json, 'details', {});
      this.setState({details});
      return done();
    }));
  }

  renderLinkMetadata() {
    const {details} = this.state;

    return (
      <div className="margin-huge--bottom">
        <p className="sans-serif bold text-gray-70 gamma margin-small--bottom">METADATA</p>
        {details.link_id && (
          <InfoTable
            entries={[
              {
                key: 'Alias',
                value: (
                  <LinkTooltip
                    tooltipClassName="kilo"
                    textBeforeTransition={'Click to copy to your clipboard.'}
                    textAfterTransition={'Done! Link is copied to your clipboard. Click again to follow through.'}
                    onTransition={() => copy(details.full_alias)}
                    href={details.full_alias}
                  />
                )
              },
              {
                key: 'Outgoing URL',
                value: <a href={details.outgoing_url}>{details.outgoing_url}</a>
              },
              {
                key: 'Created',
                value: humanize.relativeTime(details.submit_time)
              },
              {
                key: 'Link ID',
                value: details.link_id.toString()
              },
              {
                key: 'Password protected',
                value: details.is_password_protected ? 'Yes' : 'No'
              }
            ]}
          />
        )}
      </div>
    );
  }

  renderLinkPreview() {
    return (
      <div className="margin-huge--bottom">
        <p className="sans-serif bold text-gray-70 gamma margin-small--bottom">PREVIEW</p>
        {(
          <InfoTable
            entries={[]}
          />
        )}
      </div>
    );
  }

  render() {
    const {isLoading} = this.props;

    return (
      <div>
        <Helmet title="Link Details - Account - Linkr" />
        <LoadingBar show={isLoading} />
        <Header selectIndex={1}/>

        <Container className={isLoading ? 'fade' : ''}>
          <div className="margin--top margin-large--bottom">
            <BackNav />

            <p className="sans-serif bold text-gray-70 delta margin-large--bottom">Link Details</p>

            {this.renderLinkMetadata()}
            {this.renderLinkPreview()}
          </div>
        </Container>

        <Footer />
      </div>
    );
  }
}

export default LoadingHOC(AccountLinkDetails);
