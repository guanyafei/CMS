<template>

    <base-classify
      title="前端分类"
      :dialogVisible.sync="dialogVisible"
      :selectedList.sync="selectedList"
      :querySuggestionList="querySuggestionList"
      localStorageKey="frontClassifyAllSuggestionList"
      :fromVue='fromVue'
    >
      <sn-form-item label="前端分类" class="mb-0" prop="frontClassifySelectedLabels" :rules="frontRules">
        <sn-input readOnly placeholder="请选择前端分类"  @focus="openFrontClassifyDialog"></sn-input>
      </sn-form-item>

      <selected-tags
        class="mb-0 mt-18"
        :tags="ruleForm.frontClassifySelectedLabels"
        @close="handleClose"
        :label="''"
      >
        <template slot-scope="{item}" slot="item">
          {{item.title}}
        </template>
      </selected-tags>
    </base-classify>
</template>
<script>
import DI from 'interface';
import BaseClassify from 'widgets/video/base-classify.vue';
import SelectedTags from 'widgets/infoCommon/infoEditDetails/tags/match-tags/selected-tags';

export default {
  components: {
    BaseClassify,
    SelectedTags
  },
  props: ['ruleForm'],
  data() {
    return {
      dialogVisible: false,
      fromVue:1,
    };
  },
  computed: {
    selectedList: {
      get() {
        let { frontClassifySelectedLabels } = this.ruleForm;
        return frontClassifySelectedLabels;
      },
      set(newArr) {
        this.ruleForm.frontClassifySelectedLabels = newArr;
      }
    },
    frontRules() {
      return {
        required: true,
        type: 'array',
        message: '前端分类不能为空',
        trigger: 'change'
      };
    }
  },
  methods: {
    handleClose(index) {
      this.ruleForm.frontClassifySelectedLabels.splice(index, 1);
    },
    openFrontClassifyDialog() {
      this.dialogVisible = true;
      this.fromVue = 1;
    },
    querySuggestionList(options, callback) {
      this.$ajax({
        url: DI.componentsMediaClassify.queryFrontClassifySuggestionList,
        context: this,
        loadingText: '正在查询分类列表，请稍候！',
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
.mb-0 {
  margin-bottom: 0;
}
.mt-18 {
  margin-top: 18px;
}
</style>



