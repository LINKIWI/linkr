import Link from 'react-router/lib/Link';
import Helmet from 'react-helmet';
import React from 'react';

import Alert, {ALERT_TYPE_INFO} from '../../alert';
import Container from '../../container';
import Header from '../../header';

import context from '../../../util/context';

/**
 * Generic page for indicating that no link exists with the provided alias.
 *
 * @constructor
 */
const AliasNotFound = () => (
  <div>
    <Helmet title="Not Found - Linkr" />
    <Header />

    <Container>
      <div className="margin-large--top margin-large--bottom">
        <Alert
          type={ALERT_TYPE_INFO}
          title={'Looking for a link?'}
          message={
            <span>
              This is a demo instance of the open source Linkr project. It is not intended for
              general-purpose use; this instance's database is automatically reset every 24 hours.
              If you're expecting something here, please ask the owner of this link to use a private
              deployment of Linkr.
            </span>
          }
        />

        <p className="sans-serif bold gamma text-gray-70 margin-small--bottom">LINK NOT FOUND</p>
        <p className="not-found-text sans-serif bold text-gray-70 margin-large--bottom transition">
          The requested link does not exist.
        </p>

        <p className="sans-serif gamma text-gray-70 margin-small--bottom">
          Try to <Link to={context.uris.HomeURI}>create a new link</Link>.
        </p>
      </div>
    </Container>
  </div>
);

export default AliasNotFound;
