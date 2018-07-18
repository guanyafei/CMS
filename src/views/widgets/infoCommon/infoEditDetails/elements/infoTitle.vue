<template>
  <sn-form-item
    :label="title"
    ref="titleItem"
    prop="title"
    :rules="titleRules">
    <sn-input
      ref="titleInput"
      v-model="ruleForm.title"
      :placeholder="placeholder"
      width="640"
      showWord
      :totalWords="max"
    ></sn-input>
  </sn-form-item>
</template>

<script>
export default {
  name: 'InfoTitle',
  componentName: 'InfoTitle',
  props: {
    'ruleForm': Object,
    'title': String,
    'min': {
      type: Number,
      default: 5
    },
    'max': {
      type: Number,
      default: 30
    }
  },
  data() {
    return {
      titleRules: [{
        required: true,
        message: `请输入${this.title}`,
        trigger: 'blur'
      }, {
        min: this.min,
        max: this.max,
        message: `长度在 ${this.min} 到 ${this.max} 个字符`,
        trigger: 'blur'
      }]
    }
  },
  computed: {
    placeholder() {
      return `请输入${this.title}，${this.min}-${this.max}个字`
    }
  },
  methods: {
    vaildTrigger(errMsg) {
      this.$refs.titleItem.vaildTrigger(false, errMsg)
    },
  },
};
</script>
