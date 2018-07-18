<template>
  <sn-form-item
    label='跳转链接'
    ref="formItem"
    prop="link"
    :rules="linkJumpRules"
  >
    <div>
      <sn-radio-group v-model="ruleForm.linkType">
        <sn-radio
          v-for="linkType in linkTypes"
          :key="linkType.key"
          :label="linkType.key"
        >{{ linkType.name }}</sn-radio>
      </sn-radio-group>
      <sn-input
        v-model="ruleForm.link"
        ref="linkJumpInput"
        :placeholder="placeholder"
      ></sn-input>
    </div>
  </sn-form-item>
</template>

<script>
import * as Constant from 'js/constant'
export default {
  name: 'linkJump',
  componentName: 'linkJump',
  props: ['ruleForm'],
  data () {
    return {
      linkTypes: Constant.LIBRARY_LINK_TYPES
    }
  },
  computed: {
    typeItem () {
      return Constant.getItemByKey(this.linkTypes, this.ruleForm.linkType)
    },
    placeholder () {
      return this.typeItem.placeholder || '请输入';
    },
    linkJumpRules () {
      const self = this;
      const linkJumpValidation = (rule, value, callback) => {
        let { reg, errMsg } = self.typeItem;

        if (value && !reg.test(value)) {
          callback(new Error(errMsg));
        }

        callback();
      };
      return [{
        required: true,
        message: `请输入跳转链接`,
        trigger: 'blur'
      }, {
        validator: linkJumpValidation,
        trigger: 'change'
      }];
    }
  },
  methods: {
    vaildTrigger (valid, errMsg) {
      this.$refs.formItem.vaildTrigger(valid, errMsg);
    },
  },
};
</script>
