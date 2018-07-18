<template>
  <sn-form-item :label="label" prop="infoColumnVal" :rules="rules">
    <sn-radio-group v-model="ruleForm.infoColumnVal">
      <sn-rect-radio
        class="radio-group__item"
        v-for="item in ruleForm.columnLabelList"
        :isToggle="true"
        :key="item.labelId"
        :label="''+item.labelId"
      >
        {{item.labelName}}
      </sn-rect-radio>
    </sn-radio-group>
  </sn-form-item>
</template>
<script>
import * as Constant from 'js/constant'
import { getHistoryArrData, setHistoryArrData, removeHistoryData } from 'utils/util'
export default {
  name: 'InfoColumnTag',
  props: {
    'ruleForm': {},
    label: {
      type: String,
      default: '资讯栏目'
    }
  },
  computed: {
    isToggle() {
      // let authorType = Constant.getItemByValue(Constant.AUTHOR_TYPE, this.ruleForm.authorType).key;
      return true;
    },
    rules() {
      return null;
    }
  },
  watch: {
    'ruleForm.infoColumnVal': function(newVal, oldVal) {
      if (newVal) {
        setHistoryArrData('columnTag', [newVal], 'labelId');
      } else {
        removeHistoryData('columnTag');
      }
    },
    'ruleForm.columnLabelList': function(newVal, oldVal) {
      if (newVal.length && this.$route.path.indexOf('edit') == -1) {
        this.setColumnTag();
      }
    }
  },
  methods: {
    setColumnTag() {
      let id = getHistoryArrData('columnTag')[0];
      let list = this.ruleForm.columnLabelList;
      list.filter(item => {
        if (id == item.labelId) {
          this.ruleForm.infoColumnVal = item.labelId + '';
        }
      });
    }
  }
};
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
