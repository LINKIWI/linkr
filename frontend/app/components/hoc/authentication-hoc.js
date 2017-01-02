import React from 'react';

import authentication from '../../util/authentication';

/**
 * Higher-order component used for getting details about the currently logged in user. This HOC
 * exposes a `user` prop to each wrapped component, which is an object of user details, and an
 * `isLoggedIn` prop. `user` is populated when there is a user logged in, and an empty object at
 * all other times. `isLoggedIn` is true when a user is logged in, false when no user is logged in,
 * and null when the authentication check is in progress.
 *
 * @param {XML} Component React component to wrap.
 * @returns {AuthenticationHOC} An HOC that exposes an isAdmin bool to the child component's props.
 */
function authenticationHOC(Component) {
  return class AuthenticationHOC extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        isLoggedIn: null,
        user: {}
      };
    }

    componentDidMount() {
      this.checkAuth();
    }

    checkAuth() {
      authentication.check((user) => this.setState({
        isLoggedIn: user !== false,
        user
      }));
    }

    render() {
      return (
        <Component
          ref={(elem) => {
            this.component = elem;
          }}
          {...this.props}
          {...this.state}
        />
      );
    }
  };
}

export default authenticationHOC;
