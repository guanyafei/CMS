<template>
  <div class="tn-table">
    <div class="tn-table__header" ref="headerWrapper">
      <table :style="tableStyle">
        <thead>
          <slot></slot>
        </thead>
      </table>
    </div>
    <div class="tn-table__body"
        ref="bodyWrapper"
        :style="{height:height+'px'}"
        v-infinite-scroll="infiniteScrollLoad"
        infinite-scroll-disabled="busy"
        infinite-scroll-distance="10">
      <table :class="{'tn-table--striped':striped}" :style="tableStyle">
        <tbody>
          <tr v-for="(row, index) in data" :key="index">
            <table-cell v-for="(column, columnIndex) in columns"
              :key="columnIndex"
              :row="row"
              :column="column"
              :columnHeight="columnHeight"
              :border="border"
              :gutter="gutter"
              :index="index">
            </table-cell>
          </tr>
          <tr v-if="busy">
            <td :colspan="columns.length">
              <div class="tn-table-loading__container">
                <i class="tn-icon-loading-b"></i>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="tn-table__empty" v-if="data.length === 0">
      <slot name="empty">
        <div class="tn-table__empty--img">
        </div>
        <div class="tn-table__empty--text">
          当前暂无数据
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import TableCell from './table-cell';
export default {
  name: 'TnTable',
  props: {
    data: {
      type: Array,
      default: []
    },
    columnHeight: [Number, String],
    minWidth: Number,
    border: {
      type: Boolean,
      default: false
    },
    striped: {
      type: Boolean,
      default: false
    },
    gutter: {
      type: Number,
      default: 10
    },
    height: Number,
    infiniteScroll: {
      type: Boolean,
      default: false
    },
    loadMore: Function
  },
  components: {
    TableCell
  },
  data () {
    return {
      columns: [],
      busy: false
    };
  },
  computed: {
    tableWidth () {
      let width = 0;
      let { columns } = this;
      for (let index = 0; index < columns.length; index++) {
        let column = columns[index];
        if (column.width && !isNaN(column.width)) {
          width += column.width;
        } else {
          return '100%';
        }
      }
      return width + 'px';
    },
    tableStyle () {
      if (this.minWidth) {
        return {
          minWidth: `${this.minWidth}px`,
          width: this.tableWidth
        }
      } else {
        return {
          width: this.tableWidth
        }
      }
    }
  },
  mounted () {
    this.bindEvents();
  },
  methods: {
    addColumn (column) {
      this.columns.push(column);
    },
    removeColumn (column) {
      let index = this.columns.indexOf(column);
      this.columns.splice(index, 1);
    },
    infiniteScrollLoad () {
      if (!this.infiniteScroll) {
        return ;
      }
      this.busy = true;
      this.loadMore().then((value)=>{
        this.busy = false;
        console.log(value);
      });
    },
    bindEvents () {
      const { headerWrapper, bodyWrapper } = this.$refs;
      bodyWrapper.addEventListener('scroll', function () {
        if (headerWrapper) headerWrapper.scrollLeft = this.scrollLeft;
      });
    }
  }

};
</script>

<style>
@import './table.css'
</style>
