<template>
  <sn-form-item :label="label" class="selected-tags" :labelWidth="labelWidth">
    <section class="select-area">
      <span class="selected-tag" v-for="(item,index) in tags" :key="index">
        <slot name="item" :item="item">
          {{item[labelKey]}}
        </slot>
        <button class="del-btn" @click="close(index)">删除</button>
        <sn-input class="tag-input" v-model="item.rank" inputType='number' radius="2" width="75" placeholder="权重值" maxlength="6"></sn-input>
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
    display: block;
    box-sizing: border-box;
    height: 25px;
    line-height: 30px;
    width: 360px;
    color: #666;
    vertical-align: top;
    margin-bottom: 10px;
    .tag-input{
      float: right;
    }
    .del-btn{
      float:right;
      margin-left: 10px;
      font-size: 14px;
      color: #F47B77;
      line-height: 30px;
    }
  }
}
</style>
<style>
  .tag-input{
    .input-box input{
      padding-right:10px !important;
    }
  }
</style>

