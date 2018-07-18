<template>
  <sn-form-item
    :label="label"
    ref="source"
    prop="source"
    class="soure-item"
    :rules="sourceRules"
  >
    <div class="link-info" >
      <div class="is-line">
        <sn-radio
          v-for="item in sourceList" :key="item.key"
          :label="item.value"
          v-model="ruleForm.sourceDetailType"
          @input="handleSourceDetailTypeChange"
          class="source-radio"
        >
        <slot :item="item" name="item">
          {{item[sourceNameKey]}}
        </slot>
        </sn-radio>
      </div>
      <sn-input
        v-if="sourceItem.key!='origin'"
        v-model="ruleForm.source"
        class="mr-10"
        :maxlength="sourceItem.valid.max"
        width="250"
        :placeholder="sourceItem.placeholder"
      ></sn-input>
    </div>
  </sn-form-item>
</template>

<script>
import DI from 'interface';
import debounce from 'utils/debounce';
import * as Constant from 'js/constant';

export default {
  name: 'InfoResource',
  componentName: 'InfoResource',
  props: {
    'ruleForm': {},
    label: {
      type: String,
      default: '资讯来源'
    },
    sourceType: {
      type: String,
      default: 'info'
    }
  },
  data() {
    return {
      sourceList: Constant.INFO_SOURCE_TYPES
    };
  },
  computed: {
    sourceNameKey() {
      return this.sourceType === 'info' ? 'name' : 'videoName';
    },
    sourceItem() {
      const { sourceDetailType } = this.ruleForm;
      return Constant.getItemByValue(this.sourceList, sourceDetailType);
    },
    sourceRules() {
      const { sourceItem } = this;
      let validateResourceUrl = (rule, value, callback) => {
        const { min, max, isRequired } = sourceItem.valid;
        const len = value.length;
        if (sourceItem.key == 'origin') {
          callback();
        }
        if (len == 0) {
          isRequired && callback(new Error(`请输入${sourceItem[this.sourceNameKey]}`));
        } else {
          if (len < min || len > max) {
            callback(new Error(`长度在 ${min} 到 ${max} 个字符`));
          }
        }
        callback();
      };
      return [
        {
          validator: validateResourceUrl,
          trigger: 'change'
        }
      ];
    }
  },
  methods: {
    handleSourceDetailTypeChange() {
      this.ruleForm.source = '';
      this.$refs.source.vaildTrigger(true);
    }
  }
};
</script>
<style scoped>
.source-radio.radio {
  margin-right: 10px;
}
</style>

