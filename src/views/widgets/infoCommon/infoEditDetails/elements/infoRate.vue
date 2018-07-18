<template>
  <sn-form-item
    prop="rate"
    ref="rateItem"
    :rules="[{
      required: false,
      message: `请选择${title}`,
      type: 'number',
      trigger: 'change'
    }]"
    :label="title"
  >
    <sn-rate v-model="ruleForm.rate" align="left"></sn-rate>
  </sn-form-item>
</template>

<script>
export default {
  name: 'InfoRate',
  componentName: 'InfoRate',
  props: {
    'ruleForm': Object,
    'title': String
  },
  methods: {
    vaildTrigger(errMsg) {
      this.$refs.rateItem.vaildTrigger(false, errMsg)
    }
  },
};
</script>
