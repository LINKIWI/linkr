import Helmet from 'react-helmet';
import LoadingHOC from 'react-loading-hoc';
import React from 'react';

import APIEndpoint from './api-endpoint';
import APIInformation from './api-information';
import AuthenticationHOC from '../../hoc/authentication-hoc';
import Container from '../../container';
import Footer from '../../footer';
import Header from '../../header';

import LoadingBar from '../../ui/loading-bar';

import apiData from '../../../../resources/api/data';

/**
 * API documentation page. Shows API information overview and details for each individual endpoint.
 */
class APIDocumentation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {language: 'curl'};
  }

  renderLanguageSelector(selectorLanguage) {
    const {language} = this.state;

    return (
      <a
        href="#"
        className={`${(language === selectorLanguage) && 'sans-serif bold'} margin--right`}
        onClick={(evt) => {
          evt.preventDefault();

          this.setState({language: selectorLanguage});
        }}
      >
        {selectorLanguage.toUpperCase()}
      </a>
    );
  }

  render() {
    const {isLoading, user} = this.props;
    const {language} = this.state;

    return (
      <div>
        <Helmet title="API Documentation - Linkr" />
        <LoadingBar show={isLoading} />
        <Header />

        <Container className={isLoading ? 'fade' : ''} style={{paddingRight: 0}}>
          <div className="api-description-container margin-large--top margin-large--bottom">
            <div className="api-description">
              <p className="text--page-title">API Documentation</p>

              <div className="api-code-column" />

              <div className="api-language-selector">
                <div className="link-alt sans-serif iota margin-huge--top margin-large--left margin--bottom">
                  {this.renderLanguageSelector('curl')}
                  {this.renderLanguageSelector('python')}
                  {this.renderLanguageSelector('javascript')}
                </div>
              </div>

              <APIInformation
                className="margin-huge--bottom"
                language={language}
              />

              {
                apiData.endpoints.map((entry) => (
                  <APIEndpoint
                    key={`endpoint_${entry.endpoint.uri}`}
                    title={entry.meta.title}
                    subtitle={entry.meta.subtitle}
                    description={entry.meta.description}
                    authentication={entry.meta.authentication}
                    language={language}
                    method={entry.endpoint.method}
                    uri={entry.endpoint.uri}
                    parameters={entry.endpoint.parameters}
                    response={entry.endpoint.response}
                    errors={entry.endpoint.errors}
                    {...this.props}
                  />
                ))
              }
            </div>
          </div>
        </Container>

        <Footer user={user} />
      </div>
    );
  }
}

export default AuthenticationHOC(LoadingHOC(APIDocumentation));
