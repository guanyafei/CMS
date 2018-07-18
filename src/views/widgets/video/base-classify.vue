<template>
  <div>
    <slot></slot>
    <sn-dialog
      :title="title"
      :visible.sync="curDialogVisible"
      :width="620"
      :before-close="handleClose"
    >
      <div class="container">
        <div class="search_content">
          <div class="search" >
            <input
              v-model="word"
              class="search-word"
              type="text"
              placeholder="请输入关键字查询，支持拼音首字母"
              @focus="handleFocus"
              v-clickoutside="clickOutsiteClose"
            />
            <button class="btn-search" @click="doSearch">搜索</button>
            <transition name="fade">
              <ul class="list" v-show="showHistory">
                <li>
                  <span>历史搜索标签</span>
                  <span class="line"></span>
                  <span class="clear-history" @click="clearHistory">清空</span>
                </li>
                <li class="item">
                  <span
                    class="selected-tag"
                    v-for="(item,index) in historyList"
                    :key="index"
                    @click="selectHistoryItem(item)"
                  >{{setLabelName(item)}}</span>
                </li>
                <li v-if="historyList.length == 0" class="empty">
                  <slot name='empty' v-if="historyList.length == 0">
                    暂无历史数据
                  </slot>
                </li>
              </ul>
            </transition>
          </div>
          <section class="select-area">
            <span class="selected-tag" v-for="(item,index) in curSelectedList" :key="index">
              <slot name="selected">{{setLabelName(item)}}</slot>
              <span class="sn-icon-close" @click="deleteItem(item,index)"></span>
            </span>
          </section>
          <div class="search-list">
            <ul>
              <li
                :class="['select-item', {'is-active':isInSelectedList(item)}]"
                v-for="(item,index) in list"
                :key="index"
                @click="handleSelectedItem(item,index)"
              >
                <slot name="item" :item="item">{{setLabelName(item)}}</slot>
              </li>
            </ul>
          </div>

        </div>
      </div>
      <span class="dialog_footer">
        <sn-button type="primary" v-if="fromVue == 0" @click="sure">确 定</sn-button>
        <sn-button type="primary" v-if="fromVue == 1" @click="sure" :disabled="this.curSelectedList.length===0">确 定</sn-button>
        <sn-button @click="cancel">取 消</sn-button>
      </span>
    </sn-dialog>
  </div>
</template>
<script>
import Clickoutside from 'directives/clickoutside';
import cloneDeep from 'clone-deep';
import { getHistoryArrData, setHistoryArrData, removeHistoryData } from 'utils/util';

export default {
  directives: { Clickoutside },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: String,
    max: Number,
    selectedList: {
      type: Array,
      default() {
        return [];
      }
    },
    querySuggestionList: Function,
    localStorageKey: {
      type: String,
      default: 'baseClassifyAllSuggestionList'
    },
    fromVue:Number,
  },
  data() {
    return {
      word: '',
      showHistory: false,
      searchInput: '',
      curSelectedList: [],
      classifyFlag: false,
      list: [],
      historyList: [],
    };
  },
  computed: {
    historyLocalStorageKey() {
      return `${this.localStorageKey}history`;
    },
    curDialogVisible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit('update:dialogVisible', val);
      }
    }
  },
  watch: {
    curDialogVisible(newValue) {
      if (newValue) {
        this.initData();
        this.curSelectedList = cloneDeep(this.selectedList);
        this.historyList = getHistoryArrData(this.historyLocalStorageKey);
      }
    }
  },
  methods: {
    clearHistory() {
      removeHistoryData(this.historyLocalStorageKey);
      this.historyList = [];
    },
    setLabelName(item) {
      if (item.ptitle) {
        return item.ptitle + '>' + item.title;
      }
      return item.title;
    },
    handleFocus() {
      if (!this.word) {
        this.showHistory = true;
      }
    },
    clickOutsiteClose() {
      this.showHistory = false;
    },
    selectHistoryItem(item) {
      this.handleSelectedItem(item);
    },
    handleClose(done) {
      done();
    },
    handleSelectedItem(item, index) {
      //点击按钮事件
      let { max, curSelectedList } = this;
      if (max && !(curSelectedList.length < max)) {
        this.$message.warning(`默认设置最多标签数量为${max}`);
        return;
      }
      let selectedArr = curSelectedList.filter(selectedItem => selectedItem.id === item.id);
      if (selectedArr.length === 0) {
        curSelectedList.push(item);
      }
    },
    deleteItem(item, index) {
      //删除按钮事件
      this.curSelectedList.splice(index, 1);
    },
    isInSelectedList(item) {
      let { curSelectedList } = this;
      let selectedArr = curSelectedList.filter(selectedItem => selectedItem.id === item.id);
      return selectedArr.length !== 0;
    },
    initData() {
      let allList = JSON.parse(localStorage.getItem(this.localStorageKey));
      if (allList && allList.length > 0) {
        this.list = allList;
      } else {
        this.querySuggestionList(
          {
            queryString: this.word
          },
          list => {
            localStorage.setItem(this.localStorageKey, JSON.stringify(list));
            this.list = list;
          }
        );
      }
    },
    doSearch() {
      if (this.word) {
        this.querySuggestionList(
          {
            queryString: this.word
          },
          list => {
            this.list = list;
          }
        );
      } else {
        this.initData();
      }
    },
    cancel() {
      this.word = '';
      this.curSelectedList = [];
      this.curDialogVisible = false;
    },
    sure() {
      setHistoryArrData(this.historyLocalStorageKey, cloneDeep(this.curSelectedList), 'id');
      this.$emit('update:selectedList', cloneDeep(this.curSelectedList));
      this.cancel();
    }
  }
};
</script>
<style scoped>
.input_inner {
  padding-left: 18px;
  border: 1px solid #ccc;
  width: 180px;
  height: 30px;
}
.circleClass {
  border-radius: 16px;
}
.container {
  width: 100%;
}
.search_content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  .search {
    position: relative;
    .list {
      position: absolute;
      font-size: 12px;
      left: 0;
      right: 0;
      top: 42px;
      width: 100%;
      border-radius: 4px;
      padding: 4px 10px 20px 10px;
      background: #fff;
      border: 1px solid #ccc;
      max-height: 200px;
      overflow: auto;
      z-index: 88;
      li:first-child {
        line-height: 25px;
        height: 25px;
        display: flex;
        align-items: center;
        justify-content: left;
      }
      .line {
        display: inline-block;
        flex: 1;
        background: #ccc;
        height: 1px;
      }
      .clear-history {
        cursor: pointer;
        color: #409eff;
      }
      .item {
        width: 100%;
        .selected-tag {
          cursor: pointer;
          display: inline-block;
          width: auto;
          font-size: 12px;
          position: relative;
          box-sizing: border-box;
          height: 28px;
          line-height: 28px;
          border: 1px solid #09bbfe;
          color: #666;
          vertical-align: top;
          padding: 0 8px;
          border-radius: 16px;
          margin-right: 6px;
          margin-bottom: 10px;
        }
      }
      .empty {
        height: 20px;
        padding: 2px;
      }

      .fade-enter-active,
      .fade-leave-active {
        transition: all 0.2s;
      }

      .fade-enter,
      .fade-leave-active {
        opacity: 0;
      }
    }
    .search-word {
      float: left;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      border: 1px solid #ccc;
      width: 452px;
      height: 38px;
      line-height: 38px;
      padding-left: 10px;
    }
    .btn-search {
      float: left;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      background-color: #09bbfe;
      color: #fff;
      width: 88px;
      height: 38px;
      line-height: 38px;
    }
  }
  .select-area {
    width: 540px;
    max-height: 80px;
    overflow-y: auto;
    margin-top: 6px;
    .selected-tag {
      display: inline-block;
      width: auto;
      font-size: 12px;
      position: relative;
      box-sizing: border-box;
      height: 28px;
      line-height: 28px;
      border: 1px solid #09bbfe;
      color: #666;
      vertical-align: top;
      padding: 0 8px;
      border-radius: 16px;
      margin-right: 6px;
      margin-bottom: 10px;
      .sn-icon-close {
        font-size: 14px;
        color: #09bbfe;
        cursor: pointer;
      }
    }
  }
  .search-list {
    width: 540px;
    height: 200px;
    overflow: auto;
    margin-top: 20px;
    ul {
      display: flex;
      flex-wrap: wrap;
      font-size: 14px;
      justify-content: space-between;
      .select-item {
        cursor: pointer;
        margin: 5px 0;
        width: 25%;
        padding: 0 5px;
        line-height: 1.2;
      }
      .is-active {
        color: #09bbfe;
      }
    }
  }
}
.dialog_footer {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  button {
    margin-right: 40px;
  }
}
</style>
