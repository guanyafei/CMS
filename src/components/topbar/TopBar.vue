
<template>
  <nav class="nav-box" :class="{'nobottom': type && type=='button'}">
    <div class="title" v-if="title">
      <slot name="back"></slot>
      <h3>{{title}}</h3>
      <slot name="subtitle"></slot>
    </div>
    <div class="link">
      <slot name="link"></slot>
    </div>
    <ul class="labels" v-if="labelsArr&&labelsArr.length">
      <li
        v-if="type && type=='button'"
        class="item-button"
        v-for="(item, idx) in labelsArr"
        :key="idx"
        :class="{'active-button': idx == tabIndex}"
        @click="doTab(idx)"
      >{{item}}</li>
      <li
        v-if="!type"
        class="item"
        v-for="(item, idx) in labelsArr"
        :key="idx"
        :class="{'active': idx == tabIndex}"
        @click="doTab(idx)"
      >{{item}}</li>
    </ul>
  </nav>
</template>
<script>
export default {
  props: {
    title: String,
    labels: String,
    index: {
      type: Number,
      default: 0
    },
    type: String
  },
  data() {
    return {
      labelsArr: [],
      tabIndex: 0
    };
  },
  watch: {
    labels(newVal) {
      this.init();
    },
    index(newVal) {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.labels) {
        this.labelsArr = this.labels.split(',');
      }
      this.tabIndex = this.index;
    },
    doTab(idx) {
      this.tabIndex = idx;
      this.$emit('tab', this.tabIndex);
    }
  }
};
</script>
<style>
.nav-box {
  display: flex;
  justify-content: space-between;
  padding: 0 18px;
  height: 46px;
  border-bottom: 1px solid #e8e8e8;
  background: #fff;
  &.nobottom {
    border-bottom: none;
  }
  .link {
    font-size: 18px;
    padding-top: 18px;
  }
  .title {
    h3 {
      display: inline-block;
      font-size: 16px;
      color: #333;
      line-height: 46px;
    }
    span {
      font-size: 12px;
      color: #999;
      margin-left: 10px;
    }
  }
  .labels {
    display: flex;
    justify-content: center;
    align-items: center;
    .item {
      position: relative;
      min-width: 60px;
      text-align: center;
      height: 46px;
      line-height: 46px;
      font-size: 14px;
      color: #666;
      cursor: pointer;
      & + .item {
        margin-left: 30px;
      }
      &.active:after {
        position: absolute;
        content: '';
        left: 50%;
        width: 60px;
        margin-left: -30px;
        bottom: 0;
        height: 4px;
        background: #0abbfe;
      }
    }
    .item-button {
      position: relative;
      min-width: 80px;
      text-align: center;
      height: 30px;
      line-height: 28px;
      font-size: 12px;
      color: #666;
      cursor: pointer;
      border-radius: 100px;
      border: 1px solid #cccccc;
      & + .item-button {
        margin-left: 10px;
      }
      &.active-button {
        background: #0abbfe;
        color: #ffffff;
        border: 1px solid #0abbfe;
      }
    }
  }
}
</style>
