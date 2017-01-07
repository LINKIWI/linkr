import {Link} from 'react-router';
import Helmet from 'react-helmet';
import React from 'react';

import Container from '../container';
import Header from '../header';

import context from '../../util/context';

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
