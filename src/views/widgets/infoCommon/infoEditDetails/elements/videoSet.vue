<template>
  <sn-form-item label='视频合集ID'
    ref="setItem" 
    prop='vedioSetId' 
  >
    <sn-select ref="videoSet" v-model="ruleForm.vedioSetId" placeholder="请选择视频合集ID" width="640" @change="handleVideoIdChange">
      <sn-option key='all' name='请选择' value=''></sn-option>
      <sn-option v-for="(item, index) in ruleForm.vedioSetList" :key="index" :name="item.setTitle+'：'+item.setId" :value="''+item.setId" :disabled="item.disabled">
      </sn-option>
    </sn-select>
  </sn-form-item>
</template>

<script>
export default {
  name: 'VideoSet',
  componentName: 'VideoSet',
  props: ['ruleForm'],
  methods: {
    handleVideoIdChange(code) {
      this.ruleForm.vedioSetId = code;
    },
    vaildTrigger(errMsg) {
      this.$refs.titleItem.vaildTrigger(false,errMsg)
    },
  },
};
</script>
