import React from 'react';

/**
 * TODO
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
    const {entries} = this.props;

    return (
      <table>
        <tbody>
          {
            entries.map((entry, idx) => (
              <tr key={`entry_${idx}`}>
                <td className="sans-serif bold text-gray-60 iota" style={{
                  height: '20px',
                  paddingRight: '30px'
                }}>
                  {entry.key}
                </td>
                <td className="sans-serif text-gray-60 iota">
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
