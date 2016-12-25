import React from 'react';

/**
 * Create a higher-order component wrapping a child component, passing along all props as a proxy.
 *
 * @param {XML} Component The React component to wrap.
 * @returns {HOC} A wrapper component that exposes additional component props accessible via the
 *                child component.
 */
function hoc(Component) {
  return class HOC extends React.Component {
    /**
     * Create a new instance of the HOC with state defaults.
     *
     * @param {Object} props Props passed from other HOCs.
     */
    constructor(props) {
      super(props);

      this.state = {isLoading: false};
    }

    /**
     * Set the current isLoading state.
     *
     * @param {Boolean} isLoading Whether the component is currently loading.
     */
    setIsLoading(isLoading) {
      this.setState({isLoading});
    }

    /**
     * Execute a function that sets the current loading state while it is executing.
     *
     * @param {Function} func Function to execute. Expect a callback as its first parameter, which,
     *                        when called, resets the current loading state.
     */
    loading(func) {
      this.setIsLoading(true);
      func(this.setIsLoading.bind(this, false));
    }

    /**
     * Render the wrapped component, passing along props from this HOC's internal state.
     *
     * @returns {XML} The wrapped component with additional props.
     */
    render() {
      return (
        <Component
          loading={this.loading.bind(this)}
          {...this.props}
          {...this.state}
        />
      );
    }
  };
}

export default hoc;
