import React from 'react';

/**
 * Generic two-column table visually mapping keys to values.
 */
export default class InfoTable extends React.Component {
  static propTypes = {
    entries: React.PropTypes.arrayOf(React.PropTypes.shape({
      key: React.PropTypes.string,
      value: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.element
      ])
    }))
  };
  static defaultProps = {
    entries: []
  };

  render() {
    const {entries, ...props} = this.props;

    return (
      <table {...props}>
        <tbody>
          {
            entries.map((entry, idx) => (
              <tr key={`entry_${idx}`}>
                <td className="sans-serif bold text-gray-60 iota" style={{
                  height: '20px',
                  paddingRight: '30px',
                  verticalAlign: 'top'
                }}>
                  {entry.key}
                </td>
                <td className="sans-serif text-gray-60 iota" style={{
                  verticalAlign: 'top'
                }}>
                  {entry.value}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  }
}
