import Helmet from 'react-helmet';
import React from 'react';

import Container from '../container';
import DisplayUtil from '../../util/display';
import Header from '../header';
import LoadingBar from '../ui/loading-bar';

/**
 * TODO
 */
export default class Admin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const {isLoading} = this.state;

    return (
      <div>
        <Helmet title="Admin - Linkr"/>

        {DisplayUtil.displayIf(isLoading, () => <LoadingBar />)}

        <Header selectIndex={1}/>

        <Container className={isLoading ? 'fade' : ''}>
          <div className="margin-large--top margin-large--bottom">
            <p className="sans-serif bold gamma text-gray-70 margin-small--bottom">TO BE IMPLEMENTED</p>
          </div>
        </Container>
      </div>
    );
  }
}
