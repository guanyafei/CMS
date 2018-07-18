<template>
  <sn-form-item label="选择快速属性组">
    <div class="quick-list">
      <span class="quick-item" 
      :class="{active:isSelect == index}" 
      v-for="(item, index) in quickList" 
      :key="item.key" 
      @click="quickSelect(item.details,index)">{{item.name}}</span>
    </div>
  </sn-form-item>
</template>
<script>
import * as Constant from 'js/constant';
export default {
  props: ['ruleForm'],
  data() {
    return {
      quickList: Constant.QUICK_SELECT_POLICY_LIST,
      isSelect:-1
    };
  },
  methods: {
    quickSelect(details,index) {
      this.isSelect = index;
      Object.assign(this.ruleForm, details)
    }
  },
};
</script>
<style scoped>
.quick-list {
  width: 700px;
  display: flex;
  flex-wrap: wrap;
}
.quick-item {
  display: inline-block;
  line-height: 32px;
  color: #333;
  margin-right: 30px;
  cursor: pointer;
}
.active{
  color: #09bbfe;
}
</style>

