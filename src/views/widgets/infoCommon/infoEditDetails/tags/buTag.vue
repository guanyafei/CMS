<template>
  <sn-form-item
    v-if="ruleForm.buLabelList && ruleForm.buLabelList.length"
    label="所属BU"
    prop="infoBuVal"
    :rules="[{
        required: false,
        message: '请选择所属BU',
        trigger: 'change'
      }]">
    <sn-radio-group v-model="ruleForm.infoBuVal">
      <sn-rect-radio
        :isToggle="true"
        class="radio-group__item"
        v-for="item in ruleForm.buLabelList"
        :key="item.labelId"
        :label="''+item.labelId">
        {{item.labelName}}
      </sn-rect-radio>
    </sn-radio-group>
  </sn-form-item>
</template>

<script>
import { getHistoryArrData, setHistoryArrData, removeHistoryData } from 'utils/util'
export default {
  name: 'BuTag',
  props: ['ruleForm'],
  watch: {
    'ruleForm.infoBuVal': function(newVal, oldVal) {
      if (newVal) {
        setHistoryArrData('buTag', [newVal], 'labelId');
      } else {
        removeHistoryData('buTag');
      }
    },
    'ruleForm.buLabelList': function(newVal, oldVal) {
      if (newVal.length && this.$route.path.indexOf('edit') == -1) {
        this.setBuTag();
      }
    }
  },
  methods: {
    setBuTag() {
      let id = getHistoryArrData('buTag')[0];
      let list = this.ruleForm.buLabelList;
      list.filter(item => {
        if (id == item.labelId) {
          this.ruleForm.infoBuVal = item.labelId;
        }
      });
    }
  }
}
</script>

