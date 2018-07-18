<template>
  <sn-form-item label="资讯来源"
    ref="source"
    prop="sourceWebsite"
    class="soure-item"
    :rules="sourceRules">
    <div class="is-line link-info">
      <sn-radio label="original"
        v-model="linkInfoType">原创资讯</sn-radio>
      <sn-radio label="reprint"
        v-model="linkInfoType">转载资讯</sn-radio>
      <sn-input v-model="ruleForm.sourceWebsite"
        class="url-input"
        :maxlength="max"
        :disabled="linkInfoType=='original'"
        :placeholder="`请输入转载来源，${min}-${max}个字`"></sn-input>
    </div>
  </sn-form-item>
</template>

<script>
export default {
  name: 'InfoResource',
  componentName: 'InfoResource',
  props: ['ruleForm', 'max', 'min'],
  data () {
    let validateResourceUrl = (rule, value, callback) => {
      if (this.linkInfoType === 'reprint') {
        if (value.length == 0) {
          callback(new Error('请输入转载来源'));
        }
        if (value.length < this.min || value.length > this.max) {
          callback(new Error(`长度在 ${this.min} 到 ${this.max} 个字符`));
        }
        callback();
      }
      callback();
    };
    return {
      linkInfoType: this.ruleForm.sourceWebsite ? 'reprint' : 'original',//关联资讯类型：original原创资讯 reprint转载资讯
      sourceRules: [{
        validator: validateResourceUrl,
        trigger: 'change'
      }]
    }
  },
  watch: {
    linkInfoType (newVal) {
      if (newVal === 'original') {
        this.ruleForm.sourceWebsite = '';
        this.$refs.source.vaildTrigger(false);
      }
    }
  },
}
</script>

