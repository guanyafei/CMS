function setColumnStyles(originStyles, columnHeight) {
  let height = null;

  if (columnHeight && !isNaN(columnHeight)) {
    height = `${columnHeight}px`;
  }
  return {
    height,
    ...originStyles
  };
}

export default {
  render(h, context) {
    let { row, column, index, columnHeight, border, gutter } = context.props;
    let { columnStyles, formatter, cellStyles, columnBorder } = column;
    let currColumnStyles = setColumnStyles(columnStyles, columnHeight);
    let cellValue = formatter ? formatter(row[column.prop]) : row[column.prop];
    let vNode = null;
    if (column.template) {
      vNode = column.template({
        row,
        column,
        index,
        value: cellValue
      });
    } else {
      vNode = cellValue;
    }
    let isBoder = typeof columnBorder === 'boolean' ? columnBorder : border;

    return (
      <td style={currColumnStyles} class={{ 'is-border': isBoder }}>
        <div class="tn-table__cell" style={cellStyles}>
          {vNode}
        </div>
      </td>
    );
  },
  functional: true,
  name: 'TnTableCell',
  props: ['row', 'column', 'index', 'columnHeight', 'border', 'gutter']
};
