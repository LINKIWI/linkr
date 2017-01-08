import copy from 'copy-to-clipboard';
import dottie from 'dottie';
import Helmet from 'react-helmet';
import humanize from 'humanize';
import {Link} from 'react-router';
import LoadingHOC from 'react-loading-hoc';
import React from 'react';
import request from 'browser-request';

import Alert, {ALERT_TYPE_WARN, ALERT_TYPE_ERROR} from '../../alert';
import AuthenticationHOC from '../../hoc/authentication-hoc';
import Container from '../../container';
import Footer from '../../footer';
import Header from '../../header';
import InfoTable from '../../info-table';
import LinkDeactivateModal from './link-deactivate-modal';
import LinkEditModal from './link-edit-modal';
import LinkRemovePasswordModal from './link-remove-password-modal';
import LinkSetPasswordModal from './link-set-password-modal';
import LinkTooltip from '../../link-tooltip';
import Table from '../../table';

import BackNav from '../../ui/back-nav';
import Button from '../../ui/button';
import LoadingBar from '../../ui/loading-bar';

import browser from '../../../util/browser';
import context from '../../../util/context';

/**
 * Interface showing admin details for a single link.
 */
class AdminLinkDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hitsPageNum: 0,
      details: {},
      hits: []
    };
  }

  componentDidMount() {
    this.loadLinkDetails();
    this.loadLinkHits();
  }

  /**
   * Load details for this link ID and set component state accordingly on completion.
   */
  loadLinkDetails() {
    this.props.loading((done) => request.post({
      url: context.uris.LinkDetailsURI,
      json: {
        /* eslint-disable camelcase */
        link_id: this.props.params.link_id
        /* eslint-enable camelcase */
      }
    }, (err, resp, json) => {  // eslint-disable-line handle-callback-err
      this.setState({
        details: dottie.get(json, 'details', {})
      });
      return done();
    }));
  }

  /**
   * Load link hits for this link ID and set component state accordingly on completion.
   */
  loadLinkHits() {
    const linkID = this.props.params.link_id;
    const {hitsPageNum} = this.state;

    this.props.loading((done) => request.post({
      url: context.uris.LinkHitsURI,
      json: {
        /* eslint-disable camelcase */
        link_id: linkID,
        page_num: hitsPageNum,
        num_per_page: 10
        /* eslint-enable camelcase */
      }
    }, (err, resp, json) => {  // eslint-disable-line handle-callback-err
      this.setState({
        hits: dottie.get(json, 'hits', [])
      });
      return done();
    }));
  }

  handleLoadMoreHits() {
    const {hits, hitsPageNum} = this.state;

    // Increment the current page number.
    this.setState({
      hitsPageNum: hitsPageNum + 1
    }, () => {
      // Append the new hit details onto the existing hits.
      this.loadLinkHits((err, moreHits) => {
        if (err || !dottie.get(moreHits, 'hits', [null]).length) {
          // Reset the page number to the existing (non-incremented) index.
          return this.setState({hitsPageNum});
        }

        return this.setState({
          hits: hits.concat(moreHits.hits)
        });
      });
    });
  }

  handleDeactivateClick() {
    this.deactivateModal.component.modal.showModal();
  }

  handleEditLinkClick() {
    this.editLinkModal.component.modal.showModal();
  }

  handleSetPasswordClick() {
    this.setPasswordModal.component.modal.showModal();
  }

  handleRemovePasswordClick() {
    this.removePasswordModal.component.modal.showModal();
  }

  renderAdmin() {
    const {isLoading} = this.props;
    const {details, hits} = this.state;

    return (
      <div className="margin--top margin-large--bottom">
        <BackNav />

        <p className="sans-serif bold text-gray-70 delta margin-large--bottom">Link Details</p>

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
                  key: 'User ID',
                  value: (dottie.get(details, 'user_id', '') || 'Anonymous').toString()
                },
                {
                  key: 'Password protected',
                  value: details.is_password_protected ? 'Yes' : 'No'
                }
              ]}
            />
          )}
        </div>

        <div className="margin-huge--bottom">
          <p className="sans-serif bold text-gray-70 gamma margin-small--bottom">HITS</p>

          <Table
            className="sans-serif text-gray-60 iota"
            headerClassName="sans-serif bold"
            header={[
              'IP ADDRESS',
              'TIMESTAMP',
              'REFERER',
              'USER AGENT'
            ]}
            entries={hits.map((hit) => [
              <a href={`https://freegeoip.net/?q=${hit.remote_ip}`}>{hit.remote_ip}</a>,
              humanize.date('F j, Y g:i:s A', hit.timestamp),
              (hit.referer && <a href={hit.referer}>{hit.referer}</a>) || 'Unknown',
              hit.user_agent
            ])}
          />

          <Button
            className="sans-serif bold iota text-white margin-small--top"
            text="Load more..."
            disabled={isLoading}
            onClick={this.handleLoadMoreHits.bind(this)}
          />
        </div>

        <div>
          <p className="sans-serif bold text-gray-70 gamma margin-small--bottom">ACTIONS</p>
          <div>
            <Button
              className="sans-serif bold iota text-white margin-small--top margin-large--right"
              text="Deactivate"
              style={{
                width: '170px'
              }}
              onClick={this.handleDeactivateClick.bind(this)}
            />
            <span className="sans-serif iota text-gray-60">
              Deactivate this link permanently.
            </span>

            <LinkDeactivateModal
              ref={(elem) => {
                this.deactivateModal = elem;
              }}
              linkID={details.link_id}
              alias={details.alias}
              fullAlias={details.full_alias}
            />
          </div>

          <div>
            <Button
              className="sans-serif bold iota text-white margin-small--top margin-large--right"
              text="Modify"
              style={{
                width: '170px'
              }}
              onClick={this.handleEditLinkClick.bind(this)}
            />
            <span className="sans-serif iota text-gray-60">
              Edit the alias or outgoing URL of this link.
            </span>

            <LinkEditModal
              ref={(elem) => {
                this.editLinkModal = elem;
              }}
              linkID={details.link_id}
              alias={details.alias}
              outgoingURL={details.outgoing_url}
              reloadLinkDetails={this.loadLinkDetails.bind(this)}
            />
          </div>

          <div>
            <Button
              className="sans-serif bold iota text-white margin-small--top margin-large--right"
              text={details.is_password_protected ? 'Update Password' : 'Set Password'}
              style={{
                width: '170px'
              }}
              onClick={this.handleSetPasswordClick.bind(this)}
            />
            <span className="sans-serif iota text-gray-60">
              {
                details.is_password_protected ?
                  'Update this link\'s password.' :
                  'Protect this link with a password.'
              }
            </span>

            <LinkSetPasswordModal
              ref={(elem) => {
                this.setPasswordModal = elem;
              }}
              linkID={details.link_id}
              alias={details.alias}
              reloadLinkDetails={this.loadLinkDetails.bind(this)}
            />
          </div>

          {
            details.is_password_protected && (
              <div>
                <Button
                  className="sans-serif bold iota text-white margin-small--top margin-large--right"
                  text="Remove Password"
                  style={{
                    width: '170px'
                  }}
                  onClick={this.handleRemovePasswordClick.bind(this)}
                />
                <span className="sans-serif iota text-gray-60">
                  Remove the password on this link.
                </span>
              </div>
            )
          }

          <LinkRemovePasswordModal
            ref={(elem) => {
              this.removePasswordModal = elem;
            }}
            linkID={details.link_id}
            alias={details.alias}
            fullAlias={details.full_alias}
            reloadLinkDetails={this.loadLinkDetails.bind(this)}
          />
        </div>
      </div>
    );
  }

  render() {
    const {isLoading, isLoggedIn, user} = this.props;

    const content = (() => {
      switch (isLoggedIn) {
        case true:
          return user.is_admin ? this.renderAdmin() : (
            <Alert
              type={ALERT_TYPE_ERROR}
              title={'You are not allowed to view this page.'}
              message={'This page is only accessible by admin users.'}
            />
          );
        case false:
          return (
            <Alert
              type={ALERT_TYPE_WARN}
              title={'You must be logged in to view the admin page.'}
              message={
                <span>
                  Click&nbsp;
                  <Link
                    className="sans-serif bold"
                    to={{
                      pathname: context.uris.LoginURI,
                      query: {
                        redirect: browser.parseURL().pathname
                      }
                    }}
                  >
                    here
                  </Link> to log in.
                </span>
              }
            />
          );
        default:
          return null;
      }
    })();

    return (
      <div>
        <Helmet title="Link Details - Admin - Linkr"/>
        <LoadingBar show={isLoading} />
        <Header selectIndex={1}/>

        <Container className={isLoading ? 'fade' : ''}>
          {content}
        </Container>

        <Footer />
      </div>
    );
  }
}

export default AuthenticationHOC(LoadingHOC(AdminLinkDetails));
