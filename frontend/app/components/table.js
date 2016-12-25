import React from 'react';

/**
 * Component describing a table with a header and row entries.
 */
export default class Table extends React.Component {
  static propTypes = {
    headerClassName: React.PropTypes.string,
    // Expected to be of shape ['col 0 name', 'col 1 name', ...]
    header: React.PropTypes.arrayOf(React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element
    ])),
    // Expected to be of shape [
    //   ['row 0 col 0', 'row 0 col 1', ...],
    //   ['row 1 col 0', 'row 1 col 1', ...],
    //   ...
    // ]
    entries: React.PropTypes.arrayOf(React.PropTypes.arrayOf(React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.element
    ])))
  };
  static defaultProps = {
    header: [],
    entries: []
  };

  render() {
    const {header, entries, headerClassName, ...props} = this.props;

    return (
      <table {...props}>
        <thead className={headerClassName}>
          <tr className="table-row">
            {
              header.map((headerCol, idx) => (
                <td key={`header-col_${idx}`} className="table-col">
                  {headerCol}
                </td>
              ))
            }
          </tr>
        </thead>

        <tbody>
          {
            entries.map((row, rowIdx) => (
              <tr key={`row_${rowIdx}`} className="table-row">
                {row.map((elem, colIdx) => (
                  <td key={`elem_${rowIdx}-${colIdx}`} className="table-col">
                    {elem}
                  </td>
                ))}
              </tr>
            ))
          }
        </tbody>
      </table>
    );
  }
}
