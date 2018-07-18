<template>
  <sn-form-item label="资讯类型" prop="infoTypeVal" :rules="rules">
    <sn-radio-group v-model="ruleForm.infoTypeVal">
      <sn-rect-radio
        class="radio-group__item"
        :isToggle="true"
        v-for="item in ruleForm.categoryLabelList"
        :key="item.labelId"
        :label="''+item.labelId"
        v-if="isItemLabelShow(item.labelType)"
      >
        {{item.labelName}}
      </sn-rect-radio>
    </sn-radio-group>
  </sn-form-item>
</template>

<script>
import * as Constant from 'js/constant'

export default {
  name: 'InfoTypeTag',
  props: ['ruleForm'],
  computed: {
    isToggle () {
      let authorType = Constant.getItemByValue(Constant.AUTHOR_TYPE, this.ruleForm.authorType).key;
      return true;
    },
    rules () {
      return null;
    },
  },
  methods: {
    isItemLabelShow (labelType) {
      let { newsType } = this.ruleForm;

      // PGC视频维护视频类型标签
      if (labelType === 10 && newsType === 3) {
        return true;
      }
      if (labelType === newsType) {
        return true;
      }
      return false;
    }
  }
}
</script>
<style scoped>
.radio-group .rect-radio {
  &.radio-group__item {
    margin-left: 0;
    margin-right: 20px;
    margin-bottom: 10px;
  }
}
</style>
