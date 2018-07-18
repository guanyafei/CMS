<template>
  <sn-confirm
    title="创建氛围"
    txt
    :flag="matchFlag"
    @close="handleClickCancelBtn"
    @sure="handleClickAddBtn"
  >
    <sn-form ref="ruleForm" :model="ruleForm" formWidth="490">
      <active-name :ruleForm="ruleForm"></active-name>
      <time-range :ruleForm="ruleForm"></time-range>
      <div class="picker-list">
        <div class="picker-item" v-for="item in colorPickerMaps" :key="item.key">
          <color-picker
            :label="item.name"
            :prop="item.key"
            :ruleForm="ruleForm"
          ></color-picker>
        </div>
      </div>
    </sn-form>
  </sn-confirm>
</template>
<script>
import ActiveName from './form-items/title';
import TimeRange from './form-items/time-range';
import ColorPicker from './form-items/color-picker';
const colorPickerMaps = [
  {
    name: '顶标题默认',
    value: '1',
    key: 'topTitle'
  },
  {
    name: '顶标题选中',
    value: '2',
    key: 'topTitleChoose'
  },
  {
    name: '底标题默认',
    value: '3',
    key: 'botTitle'
  },
  {
    name: '底标题选中',
    value: '4',
    key: 'botTitleChoose'
  },
  {
    name: '搜索框放大镜',
    value: '5',
    key: 'searchfont'
  },
  {
    name: '搜索框内背景',
    value: '6',
    key: 'searchBg'
  },
  {
    name: '搜索框默认字',
    value: '7',
    key: 'searchDefault'
  }
];

export default {
  name: 'AddAtmosphere',
  props: ['matchFlag'],
  components: {
    ActiveName,
    TimeRange,
    ColorPicker
  },
  data() {
    return {
      ruleForm: {
        title: '',
        startTime: '',
        endTime: '',
        topTitle: '',
        topTitleChoose: '',
        botTitle: '',
        botTitleChoose: '',
        searchfont: '',
        searchBg: '',
        searchDefault: '',
        fileName: '',
        skinDownloadUrl: ''
      },
      colorPickerMaps,
    };
  },
  methods: {
    handleClickAddBtn() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
        } else {
          console.log('valid failed');
        }
      });
    },
    handleClickCancelBtn() {
      this.$emit('update:matchFlag', false);
    }
  }
};
</script>
<style scoped>
.picker-list {
  display: flex;
  flex-wrap: wrap;
  .picker-item{

  }
}
</style>



