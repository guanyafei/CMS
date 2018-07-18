<template>
  <sn-form-item :label="label" class="selected-tags" :labelWidth="labelWidth">
    <section class="select-area">
      <span class="selected-tag" v-for="(item,index) in tags" :key="index">
        <slot name="item" :item="item">{{item[labelKey]}}</slot>
        <span class="close" @click="close(index)"></span>
      </span>
    </section>
  </sn-form-item>
</template>

<script>
export default {
  name: 'SelectedTags',
  props: {
    tags: Array,
    label: {
      type: String,
      default: '已选择：'
    },
    labelWidth: {
      type: String
    },
    labelKey: {
      type: String,
      default: 'labelName'
    }
  },
  methods: {
    close (index) {
      this.$emit('close', index);
    }
  }
}
</script>

<style scoped>
.select-area {
  width: 500px;
  display: flex;
  flex-wrap: wrap;
  .selected-tag {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    height: 28px;
    line-height: 28px;
    min-width: 64px;
    border: 1px solid #09bbfe;
    color: #666;
    vertical-align: top;
    padding: 0 22px 0 10px;
    border-radius: 16px;
    margin-right: 12px;
    margin-bottom: 10px;
    .close {
      position: absolute;
      right: 8px;
      top: 10px;
      display: inline-block;
      width: 10px;
      height: 10px;
      background: url(../../../../../../assets/icon_close.png) no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }
  }
}
</style>

