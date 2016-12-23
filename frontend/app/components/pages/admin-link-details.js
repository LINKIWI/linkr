/* global window */

import async from 'async';
import copy from 'copy-to-clipboard';
import dottie from 'dottie';
import Helmet from 'react-helmet';
import humanize from 'humanize';
import React from 'react';
import request from 'browser-request';

import Container from '../container';
import Footer from '../footer';
import Header from '../header';
import InfoTable from '../info-table';

import Button from '../ui/button';
import LoadingBar from '../ui/loading-bar';
import Tooltip from '../ui/tooltip';

import context from '../../util/context';

/**
 * TODO
 */
export default class AdminLinkDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      hitsPageNum: 0,
      hitsNumPerPage: 10,
      details: {},
      hits: {}
    };
  }

  componentDidMount() {
    async.parallel({
      details: (finished) => this.loadLinkDetails(finished),
      hits: (finished) => this.loadLinkHits(finished)
    }, (err, results) => {
      if (err) {
        // TODO alert banner
      }

      this.setState({
        isLoading: false,
        ...results
      });
    });
  }

  loadLinkDetails(cb) {
    const linkID = this.props.params.link_id;

    request.post({
      url: context.uris.LinkDetailsURI,
      json: {
        /* eslint-disable camelcase */
        link_id: linkID
        /* eslint-enable camelcase */
      }
    }, (err, resp, json) => cb(err, json));
  }

  loadLinkHits(cb) {
    const linkID = this.props.params.link_id;
    const {hitsPageNum, hitsNumPerPage} = this.state;

    request.post({
      url: context.uris.LinkHitsURI,
      json: {
        /* eslint-disable camelcase */
        link_id: linkID,
        page_num: hitsPageNum,
        num_per_page: hitsNumPerPage
        /* eslint-enable camelcase */
      }
    }, (err, resp, json) => cb(err, json));
  }

  handleLoadMoreHits() {
    const {hits, hitsPageNum} = this.state;

    // Increment the current page number.
    this.setState({
      isLoading: true,
      hitsPageNum: hitsPageNum + 1
    }, () => {
      // Append the new hit details onto the existing hits.
      this.loadLinkHits((err, moreHits) => {
        this.setState({
          isLoading: false
        });

        if (err || !dottie.get(moreHits, 'hits', [null]).length) {
          // TODO display error
          // Reset the page number to the existing (non-incremented) index.
          return this.setState({hitsPageNum});
        }

        return this.setState({
          // Sigh
          hits: {
            hits: hits.hits.concat(moreHits.hits)
          }
        });
      });
    });
  }

  render() {
    const {isLoading, isLinkCopied, details, hits} = this.state;

    const linkDetails = dottie.get(details, 'details', {});
    const linkHits = dottie.get(hits, 'hits', []);

    return (
      <div>
        <Helmet title="Link Details - Admin - Linkr"/>

        {isLoading && <LoadingBar />}

        <Header selectIndex={1}/>

        <Container className={isLoading ? 'fade' : ''}>
          <div className="margin-large--top margin-large--bottom">
            <p className="sans-serif bold text-gray-70 delta margin-large--bottom">Link Details</p>

            <div className="margin-huge--bottom">
              <p className="sans-serif bold text-gray-70 gamma margin-small--bottom">METADATA</p>
              {linkDetails.link_id && (
                <InfoTable
                  entries={[
                    {
                      key: 'Alias',
                      value: (
                        <Tooltip
                          tooltipClassName="kilo"
                          contents={
                            <p className="sans-serif">
                              {
                                isLinkCopied ?
                                'Done! Link is copied to your clipboard. Click again to follow through.' :
                                'Click to copy to your clipboard.'
                              }
                            </p>
                          }
                        >
                          <a
                            href={linkDetails.full_alias}
                            onClick={(evt) => {
                              evt.preventDefault();

                              if (isLinkCopied) {
                                window.location.href = linkDetails.full_alias;
                              } else {
                                copy(linkDetails.full_alias);
                                this.setState({
                                  isLinkCopied: true
                                });
                              }
                            }}
                          >
                            {linkDetails.full_alias}
                          </a>
                        </Tooltip>
                      )
                    },
                    {
                      key: 'Outgoing URL',
                      value: <a href={linkDetails.outgoing_url}>{linkDetails.outgoing_url}</a>
                    },
                    {
                      key: 'Created',
                      value: humanize.relativeTime(linkDetails.submit_time)
                    },
                    {
                      key: 'Link ID',
                      value: linkDetails.link_id.toString()
                    },
                    {
                      key: 'User ID', value: linkDetails.user_id || 'Anonymous'
                    },
                    {
                      key: 'Password protected',
                      value: linkDetails.is_password_protected.toString()
                    }
                  ]}
                />
              )}
            </div>

            <div className="margin-huge--bottom">
              <p className="sans-serif bold text-gray-70 gamma margin-small--bottom">HITS</p>

              <table className="sans-serif text-gray-60 iota">
                <thead className="sans-serif bold">
                  <tr className="hits-table-row">
                    <td className="hits-table-col">IP ADDRESS</td>
                    <td className="hits-table-col">TIMESTAMP</td>
                    <td className="hits-table-col">REFERER</td>
                    <td className="hits-table-col">USER AGENT</td>
                  </tr>
                </thead>
                <tbody>
                  {
                    linkHits.map((hit, idx) => (
                      <tr key={`hit_${idx}`} className="hits-table-row">
                        <td className="hits-table-col">
                          <a href={`https://freegeoip.net/?q=${hit.remote_ip}`}>{hit.remote_ip}</a>
                        </td>
                        <td className="hits-table-col">
                          {humanize.date('F j, Y g:i:s A', hit.timestamp)}
                        </td>
                        <td className="hits-table-col">
                          {(hit.referer && <a href={hit.referer}>{hit.referer}</a>) || 'Unknown'}
                        </td>
                        <td className="hits-table-col">
                          {hit.user_agent}
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

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
                />
                <span className="sans-serif iota text-gray-60">
                  Deactivate this link permanently.
                </span>
              </div>
              <div>
                <Button
                  className="sans-serif bold iota text-white margin-small--top margin-large--right"
                  text="Set Password"
                  style={{
                    width: '170px'
                  }}
                />
                <span className="sans-serif iota text-gray-60">
                  Protect this link with a password.
                </span>
              </div>

              <div>
                <Button
                  className="sans-serif bold iota text-white margin-small--top margin-large--right"
                  text="Modify"
                  style={{
                    width: '170px'
                  }}
                />
                <span className="sans-serif iota text-gray-60">
                  Edit the alias or outgoing URL of this link.
                </span>
              </div>
            </div>
          </div>
        </Container>

        <Footer />
      </div>
    );
  }
}
