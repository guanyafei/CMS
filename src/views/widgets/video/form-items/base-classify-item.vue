<template>
  <sn-form-item label="基础分类" :prop="'baseClassifySelectedItem.title'" :rules="baseRules">
    <base-classify
      ref="baseClassify"
      title="基础分类"
      :dialogVisible.sync="dialogVisible"
      :selectedList.sync="selectedList"
      :querySuggestionList="querySuggestionList"
      :max="1"
      :fromVue='fromVue'
    >
      <span class="classify-selected-name">{{ ruleForm.baseClassifySelectedItem.fullTitle }}</span>
      <sn-button type="primary" @click="openBaseClassifyDialog">设置</sn-button>
    </base-classify>
  </sn-form-item>
</template>
<script>
import DI from 'interface';
import BaseClassify from 'widgets/video/base-classify.vue';

export default {
  components: {
    BaseClassify
  },
  props: ['ruleForm'],
  data() {
    return {
      dialogVisible: false,
      fromVue:1,//区分基础分类组件里为空是否可以点击的判断
    };
  },
  computed: {
    selectedList: {
      get() {
        if (this.ruleForm.baseClassifySelectedItem.ptitle) {
          this.ruleForm.baseClassifySelectedItem.fullTitle = this.ruleForm.baseClassifySelectedItem.ptitle + '>' + this.ruleForm.baseClassifySelectedItem.title;
        }else{
          this.ruleForm.baseClassifySelectedItem.fullTitle = this.ruleForm.baseClassifySelectedItem.title
        }
        let { baseClassifySelectedItem } = this.ruleForm;
        return [
          {
            ...baseClassifySelectedItem
          }
        ];
      },
      set(newArr) {
        this.ruleForm.baseClassifySelectedItem = { ...newArr[0] };
      }
    },
    baseRules() {
      return {
        required: true,
        message: '基础分类不能为空',
        trigger: 'change'
      };
    }
  },
  methods: {
    openBaseClassifyDialog() {
      this.$refs.baseClassify.word = '';
      this.dialogVisible = true;
      this.fromVue = 1;//区分基础分类组件里为空是否可以点击的判断
    },
    querySuggestionList(options, callback) {
      this.$ajax({
        url: DI.componentsMediaClassify.queryBaseClassifySuggestionList,
        context: this,
        loadingText: '正在加载全量数据，请稍候！',
        data: JSON.stringify({
          title: options.queryString
        }),
        success: res => {
          if (res.retCode == '0') {
            let list = res.data || [];
            callback(list);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    }
  }
};
</script>
<style scoped>
.classify-selected-name {
  margin-right: 5px;
}
</style>

