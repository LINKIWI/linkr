import copy from 'copy-to-clipboard';
import dottie from 'dottie';
import Helmet from 'react-helmet';
import Link from 'react-router/lib/Link';
import LoadingHOC from 'react-loading-hoc';
import React from 'react';
import request from 'browser-request';
import urlParse from 'url-parse';

import Alert, {ALERT_TYPE_ERROR} from '../../alert';
import AuthenticationHOC from '../../hoc/authentication-hoc';
import Container from '../../container';
import Footer from '../../footer';
import Header from '../../header';
import LinkTooltip from '../../link-tooltip';

import Button from '../../ui/button';
import LoadingBar from '../../ui/loading-bar';

import browser from '../../../util/browser';
import context from '../../../util/context';

class ShortenSuccess extends React.Component {
  constructor(props) {
    super(props);

    this.state = {data: {}};
  }

  componentDidMount() {
    this.props.loading((done) => request.post({
      url: context.uris.LinkDetailsURI,
      json: {
        alias: this.props.params.alias
      }
    }, (err, resp, data = {}) => {  // eslint-disable-line handle-callback-err
      this.setState({data});
      return done();
    }));
  }

  handleShortenAnotherClick() {
    browser.push(context.uris.HomeURI);
  }

  render() {
    const {isLoading, params, user} = this.props;
    const {data} = this.state;

    const details = dottie.get(data, 'details', {
      /* eslint-disable camelcase */
      alias: params.alias,
      full_alias: `${urlParse(context.config.linkr_url).href}/${params.alias}`
      /* eslint-enable camelcase */
    });

    const content = (() => {
      switch (data.failure) {
        case 'failure_nonexistent_link':
          return (
            <Alert
              type={ALERT_TYPE_ERROR}
              title={'There was an error creating your link.'}
              message={
                <span>
                  This link doesn't seem to exist.
                  Maybe <Link className="sans-serif bold" to={context.uris.HomeURI}>go back</Link> and
                  try a second time?
                </span>
              }
            />
          );
        default:
          return (data.success !== undefined) && (
            <div className="margin-large--top margin-large--bottom">
              <div>
                <p className="sans-serif bold gamma text-gray-60 margin-small--bottom">
                  SUCCESS!
                </p>
                <LinkTooltip
                  textBeforeTransition={'Click on the link to copy it to your clipboard.'}
                  textAfterTransition={'Done! Link is copied to your clipboard. Click again to follow through.'}
                  linkClassName="shorten-field sans-serif"
                  onTransition={() => copy(details.full_alias)}
                  href={`/${details.alias}`}
                  text={details.full_alias}
                />
              </div>

              {
                details.outgoing_url ? (
                  <div>
                    <p className="sans-serif bold gamma text-gray-60 margin--top margin-small--bottom">
                      NOW POINTS TO
                    </p>
                    <a href={details.outgoing_url} className="shorten-field sans-serif margin-small--bottom">
                      {details.outgoing_url}
                    </a>
                  </div>
                ) : (
                  <div>
                    <p className="sans-serif gamma text-gray-70 margin--top margin-large--bottom">
                      has been created.
                    </p>
                    <p className="sans-serif gamma text-gray-70">
                      Click on the above link to visit the site.
                    </p>
                  </div>
                )
              }

              <Button
                className="sans-serif bold iota text-white margin-huge--top"
                text="Shorten another?"
                onClick={this.handleShortenAnotherClick.bind(this)}
              />
            </div>
          );
      }
    })();

    return (
      <div>
        <Helmet title="Success - Linkr" />
        <LoadingBar show={isLoading} />
        <Header selectIndex={0} />

        <Container className={isLoading ? 'fade' : ''}>
          {content}
        </Container>

        <Footer user={user} />
      </div>
    );
  }
}

export default AuthenticationHOC(LoadingHOC(ShortenSuccess));
