<template>
  <sn-form-item label='视频描述'
    ref="remark" 
    prop='content' 
    :rules="contentRules"
  >
    <sn-input ref='contentInput' 
      v-model='ruleForm.content' 
      placeholder='请输入视频描述' 
      width="640"
      height="100"
      type="textarea" 
      showWord 
      :totalWords='100'
    ></sn-input>
  </sn-form-item>
</template>

<script>
export default {
  name: 'VideoRemark',
  componentName: 'VideoRemark',
  props: ['ruleForm'],
  data () {
    return {
      contentRules: [{
        required: true,
        message: '请输入视频描述',
        trigger: 'blur'
      }, {
        min: 0,
        max: 100,
        message: '长度在 0 到 100 个字符',
        trigger: 'blur'
      }],
    }
  },
  methods: {
    vaildTrigger (errMsg) {
      this.$refs.remark.vaildTrigger(false, errMsg)
    },
  }
};
</script>
