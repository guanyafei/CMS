<template>
  <transition name="fade">
    <ul class="history-list" v-show="showHistory">
      <li>
        <span style="color:#ccc;">历史搜索标签</span>
        <span class="line"></span>
        <span class="clear-history" @click="clearHistory">清空</span>
      </li>
      <li class="item">
        <slot></slot>
      </li>
      <li v-if="$parent.historyList.length == 0" class="empty">
        暂无历史数据
      </li>
    </ul>
  </transition>
</template>
<script>
import { removeHistoryData } from 'utils/util';
export default {
  name: 'AutocompleteHistoryList',
  componentName: 'AutocompleteHistoryList',
  props: ['historyKey'],
  data() {
    return {
      showHistory: false
    };
  },
  created() {
    this.$on('visible', val => {
      this.showHistory = val;
    });
  },
  methods: {
    clearHistory() {
      removeHistoryData(this.historyKey)
      this.$parent.handleClose();
    }
  }
};
</script>
<style scoped>
.history-list {
  position: absolute;
  font-size: 12px;
  left: 0;
  right: 0;
  top: 34px;
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
    height: 1px;
    background: #ccc;
  }
  .clear-history {
    cursor: pointer;
    color: #409eff;
  }
  .item {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
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
    text-align: left;
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
</style>
