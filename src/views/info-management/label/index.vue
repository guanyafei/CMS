<template>
  <div id="idx">
    <div class="header">
      <div class="title">{{title}}</div>
      <ul class="labels">
        <li v-for="item in labels"
          :key='item.key'
          :class="['item',
            {'selected': labelSelected==item.key}
          ]"
          @click.stop="switchTo(item.key)"
        >
          <span>
            {{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <keep-alive>
      <component :is="labelSelected" ref="selected" :list="selectedList" :total="total" @goto="goto"></component>
    </keep-alive>
  </div>
</template>
<script>
import * as Constant from 'js/constant'
import DI from 'interface'
import Type from './type'
import ColumnLabel from './column'
import Match from './match'
import Team from './team'
import Player from './player'
export default {
  name: 'SnLabel',

  componentName: 'SnLabel',

  components: {
    Type,
    ColumnLabel,
    Match,
    Team,
    Player
  },

  data: () => ({
    title: "标签管理",
    labels: Constant.LABEL_TAB_TYPE,
    labelSelected: "type",
    selectedList: [],
    total: 0
  }),

  watch: {
    labelSelected (newVal, oldVal) {
      this.$nextTick().then(() => {
        if (this[`${this.labelSelected}List`] == null) {
          this.queryList();
        } else {
          this.selectedList = [...this[`${this.labelSelected}List`]];
          if (this.isPaging()) {
            this.total = this[`${this.labelSelected}total`];
            this.$bus.$emit("syncCurPage", this[`${this.labelSelected}num`]);
          }
        }
      })
    }
  },

  mounted () {
    this.queryList();
  },

  methods: {
    queryList (num = 1) {
      let data = {};
      const isPaging = this.isPaging();
      let type = 'post';

      if (!this.$bus.curPageStartNo) {
        this.$bus.curPageStartNo = {};
      }
      this.$bus.curPageStartNo[this.labelSelected] = (num - 1) * (data.pageSize || 20);
      //分页传参
      if (isPaging) {
        data.pageSize = 20;
        data.pageIndex = (num - 1) * data.pageSize;
        type = 'get';
      }

      this.$ajax({
        url: DI.label[`${this.labelSelected}list`],
        context: this,
        type,
        loadingText: '正在加载标签列表',
        data,
        success: (res) => {
          console.log(this.$bus);
          if (res.retCode == "0") {
            const data = res.data || {};

            this[`${this.labelSelected}List`] = data[Constant.getItemByKey(this.labels, this.labelSelected).resListName] || [];
            this.selectedList = [...this[`${this.labelSelected}List`]];

            if (isPaging) {
              document.body.scrollTop = 0;
              this.$bus.$emit('syncCurPage', num);
              this.total = data[`${this.labelSelected}ListCount`] || 0;
              this[`${this.labelSelected}total`] = this.total;

              this[`${this.labelSelected}num`] = num;
            }
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },

    switchTo (key) {
      if (key === this.labelSelected) {
        return;
      }

      this.selectedList = [];
      this.labelSelected = key;
    },

    goto (num) {
      this.queryList(num);
    },

    isPaging () {
      return Constant.LABEL_TAB_TYPE.find((label) => {
        return label.key == this.labelSelected
      }).paging
    }
  }
}
</script>

<style scoped>
.list {
  background-color: #ffffff;
  margin-top: 20px;
  padding-bottom: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  padding: 0 18px;
  height: 46px;
  border-bottom: 1px solid #e8e8e8;
  background: #fff;
  .title {
    display: inline-block;
    font-size: 16px;
    color: #333;
    line-height: 46px;
  }
  .labels {
    display: flex;
    justify-content: center;
    align-items: center;
    .item {
      font-size: 14px;
      padding: 8px 0px;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #48576a;
      height: 46px;
      line-height: 2;
      box-sizing: border-box;
      cursor: pointer;
      & + .item {
        margin-left: 30px;
      }
      &.selected,
      &:hover {
        border-bottom: 4px solid #0abbfe;
      }
    }
  }
}
</style>
