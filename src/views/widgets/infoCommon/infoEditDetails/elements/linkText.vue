<template>
  <sn-form-item 
    :label='title'
    ref="formItem" 
    prop='linkText' 
    :rules="linkTextRules"
  >
    <sn-input 
      ref='linkTextInput' 
      v-model='ruleForm.linkText' 
      :placeholder="'请输入链接'+title+'，2-30个字'"
      width='100%' 
      showWord 
      :totalWords='30'
    ></sn-input>
  </sn-form-item>
</template>

<script>
export default {
  name: 'LinkText',
  componentName: 'LinkText',
  props: ['title','ruleForm'],
  data() {
    return {
      linkTextRules: [{
        required: true,
        message: `请输入链接${this.title}`,
        trigger: 'blur'
      }, {
        min: 2,
        max: 30,
        message: '长度在 2 到 30 个字符',
        trigger: 'blur'
      }]
    }
  },
  methods: {
    vaildTrigger(valid, errMsg) {
      this.$refs.formItem.vaildTrigger(valid, errMsg);
    },
  },
};
</script>
