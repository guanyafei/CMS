<template>
  <sn-form-item label="活动名称" prop="title" :rules="titleRules">
    <sn-input
      vmodel="ruleForm.title"
      :maxlength="20"
      placeholder="请输入活动名称"
      width="410"
      :disabled="disabled"
    ></sn-input>
  </sn-form-item>
</template>
<script>
export default {
  name: 'TitleFormItem',
  props: ['ruleForm', 'disabled'],
  computed: {
    titleRules() {
      return [
        {
          required: true,
          message: `请输入活动名称`,
          trigger: 'blur'
        }
      ];
    }
  }
};
</script>
