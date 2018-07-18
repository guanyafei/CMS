<template>
  <sn-form-item :label="label" :prop="prop" :rules="rules" class="is-line">
    <sn-color-picker v-model="ruleForm[prop]"></sn-color-picker>
  </sn-form-item>
</template>
<script>
  export default {
    name: "ColorPicker",
    props: ['ruleForm', 'label', 'prop'],
    computed: {
      rules() {
        return [{
          required: true,
          message: `请设置色值`,
          trigger: 'blur'
        }]
      }
    }
  }
</script>
