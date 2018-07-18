<script>
export default {
  render (h) {
    const renderCell = option => {
      const { rule, row, $index } = option;
      row.$index = $index;
      if (rule.sloted) {
        return (
          <div class={getCellClass(rule.align)} style={getCellStyle(rule)}>
            {
              rule.$slot(row)
            }
          </div>
        );
      } else {
        return (
          <div class={getCellClass(rule.align)} style={getCellStyle(rule)}>
            {
              row[rule.prop]
            }
          </div>
        )
      }
    };
    const getCellClass = align => `cell cell-${align}`;
    const getCellStyle = rule => `padding-left:${rule.tdPaddingLeft}px;padding-right:${rule.tdPaddingRight}px;`;
    const getTdWidth = width => {
      if (!width) {
        return null;
      }
      if (width.indexOf('%') > -1) {
        return `width:${width};`;
      } else {
        return `width:${width}px;`;
      }
    }
    const getTdStyle = (width, height) => {
      if (height) {
        return `${getTdWidth(width)}height:${height}px;`;
      } else {
        return `${getTdWidth(width)}`;
      }

    }
    let tableHeaderCls = 'table-header';
    if (!this.tableHeader) {
      tableHeaderCls += ' is-hide';
    }
    const tableCls = `data-table table-theme__${this.theme}`;
    const getTbodyHeight = height => {
      return `height:${height}px;`;
    };
    return (
      <div class={tableCls} style="width:100%">
        <div class={tableHeaderCls}>
          <table>
            <thead>
              <tr>
                {
                  this._l(this.rules, (rule, $index) =>
                    <td key={$index} style={rule.width ? getTdWidth(rule.width) : null}>
                      <div class={getCellClass(rule.align)} style={getCellStyle(rule)}>{rule.label}</div>
                    </td>
                  )
                }
              </tr>
            </thead>
          </table>
        </div>
        <div class="table-body" style={this.height ? getTbodyHeight(this.height) : null} ref="tbody">
          <table>
            <tbody>
              {
                this._l(this.data, (row, $index) =>
                  <tr key={$index}
                    on-click={($event) => this.handleClick($event, row, $index)}>
                    {
                      this._l(this.rules, (rule, $tdIndex) =>
                        <td
                          key={$tdIndex}
                          style={getTdStyle(rule.width, this.tdHeight)}
                          class={rule.wall === "true" ? "wall" : null}
                        >
                          {renderCell({ rule, row, $index })}
                        </td>
                      )
                    }
                  </tr>
                )
              }
            </tbody>
          </table>
          {
            this.data.length == 0 ?
              <div class="empty">
                <div class="empty-img">
                </div>
                <div class="empty-text">
                  {
                    this.$slots.empty ?
                      this.$slots.empty
                      :
                      "当前暂无数据"
                  }
                </div>
              </div> :
              null
          }
          {
            this.$slots.tips ? this.$slots.tips : null
          }
          {
            this.$slots.loading ? this.$slots.loading : null
          }
        </div>
        {this.$slots.default}
      </div>
    )
  },

  mounted () {
    this.rules = [];
    this.$children.forEach((child) => {
      let temp = { ...child._props };
      if (child._props.sloted) {
        temp.$slot = child.$scopedSlots.default;
      }

      this.rules.push(temp);
    });

    if (this.scrollLoading) {
      let self = this;
      let $tbody = this.$refs.tbody;
      $tbody.addEventListener('mousewheel', (e) => {
        let scrollTop = $tbody.scrollTop,
            scrollHeight = $tbody.scrollHeight,
            clientHeight = $tbody.clientHeight,
            diffValue = scrollHeight-clientHeight-scrollTop;
        if (e.wheelDelta <0 && diffValue < 20 && scrollHeight > clientHeight) {
          if (this.timer) {
            clearTimeout(this.timer);
          }
          this.timer = setTimeout(()=>{
            self.$emit('tbody-scroll', e, this);
          }, 50);
        }
      }, false);
    }
  },
  beforeDestroy () {
    this.timer = null
  },
  props: {
    data: {
      type: Array,
      default: function () {
        return []
      }
    },
    theme: {
      type: String,
      default: 'default'
    },
    height: {
      type: [String, Number]
    },
    tdHeight: {
      type: Number
    },
    scrollLoading: {
      type: Boolean,
      default: false
    },
    tableHeader: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    handleClick (event, row, index) {
      this.$emit('row-click', event, row, index);
    }
  },

  data: () => ({
    rules: []
  })
}
</script>

<style scoped>
.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}

thead {
  display: table-header-group;
  vertical-align: middle;
  border-color: inherit;
}

tbody {
  display: table-row-group;
  vertical-align: middle;
  border-color: inherit;
  color: #666;
}

tr {
  display: table-row;
  vertical-align: inherit;
  border-color: inherit;
}
.table-header {
  &.is-hide {
    display: none;
  }
}
.data-table {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  background-color: #fff;
  font-size: 12px;
  color: rgb(31, 45, 61);

  thead > tr > td {
    height: 50px;
    border-bottom: 1px solid #EBEAE6;
    color: #657180;
    font-weight: bold;
    background-color: #ebebeb;
  }
  tbody tr {
    &:hover {
      background-color: #F0FBFF;
    }
  }
  tbody > tr > td {
    height: 100px;
    border-bottom: 1px solid #F0F1F5;

    &.wall+.wall::after {
      content: ' ';
      border-right: 1px solid #F0F1F5;
      height: 69%;
      position: absolute;
      top: 16%;
      left: 0;
    }
  }
  td {
    min-width: 0;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
  }
  .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 24px;
    padding-top: 5px;
    padding-bottom: 5px;
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    &.cell-center {
      justify-content: center;
      text-align: center;
    }
  }
}

.table-theme__default {
  .empty {
    text-align: center;
    padding: 120px 0;
    .empty-img {
      height: 130px;
      background-image: url(../../assets/icon-blank01.png);
      background-repeat: no-repeat;
      background-position: center;
      background-size: 11% 130%;
    }
    .empty-text {
      color: #54565F;
      font-size: 16px;
    }
  }
}

.table-theme__dialog {
  .empty {
    text-align: center;
    padding: 100px 0;
    .empty-text {
      color: #54565F;
      font-size: 20px;
    }
  }
  thead td {
    border-bottom: none;
    background-color: #F5F5F5;
    color: #777777;
    height: 40px;
  }
  .table-body {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-left: 1px solid #F0F1F5;
    border-right: 1px solid #F0F1F5;
    border-bottom: 1px solid #F0F1F5;
    border-radius: 4px;
    min-height: 200px;
    overflow-y: auto;
    tbody td {
      height: 45px;
    }
  }
  .table-tips {
    width: 100%;
    text-align: center;
    color: #aaaaaa;
    font-size: 20px;
    height: 50px;
    line-height: 50px;
  }
}
</style>
