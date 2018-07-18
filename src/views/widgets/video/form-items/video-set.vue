<template>
  <div>
    <sn-form-item label="加入合集" label-width="110px">
      <sn-autocomplete
        v-model="searchInput"
        valueKey="title"
        :isSuggestionsPages="true"
        :fetchSuggestions="querySearchAsync"
        placeholder="请输入合集标题/ID查询"
        @select="selectItem"
        :width="360"
      >
        <div slot-scope="{item}">
          <span>{{item.title}}</span>
          <span class="leftID">{{item.id}}</span>
        </div>
      </sn-autocomplete>
    </sn-form-item>
    <selected-tags
      class="custom-tags-container"
      :tags="ruleForm.selectedSetLabels"
      @close="handleClose"
      :label="''"
      labelWidth="110px"
    >
      <span class="txt" :title="item.setTitle" slot="item" slot-scope="{item}">
        {{item.setTitle}}
      </span>
    </selected-tags>
  </div>
</template>

<script>
import DI from 'interface';
import SelectedTags from 'widgets/infoCommon/infoEditDetails/tags/match-tags/selected-label-tags';//可输入权重值 6261wuxa

export default {
  name: 'VideoSetTags',
  componentName: 'VideoSetTags',
  components: {
    SelectedTags
  },
  props: ['ruleForm'],
  data() {
    return {
      searchInput: ''
    };
  },
  methods: {
    handleClose(index) {
      this.ruleForm.selectedSetLabels.splice(index, 1);
    },
    querySearchAsync(options, cb) {
      let params = {
        pageNum: options.pageIndex,
        pageSize: options.pageSize
      };

      if (/^[0-9]*$/.test(options.queryString)) { // id
        params.id = parseInt(options.queryString);
      } else {
        params.title = options.queryString;
      }

      this.$ajax({
        url: DI.publishVideo.queryMediaSetSuggestionListByName,
        context: this,
        loadingText: 'false',
        data: JSON.stringify(params),
        success: res => {
          const labelList = res.data || [];
          cb(labelList);
        },
        error: () => {
          console.log('error');
        }
      });
    },
    selectItem(item) {
      let { selectedSetLabels } = this.ruleForm;
      for (let i = 0; i < selectedSetLabels.length; i++) {
        const labelItem = selectedSetLabels[i];
        if (item.id == labelItem.setId) {
          return;
        }
      }
      selectedSetLabels.push({
        setId: item.id,
        setTitle: item.title,
        rank: item.rank || ''//权重值
      });
      this.ruleForm.selectedSetLabels = [...selectedSetLabels];
    }
  }
};
</script>
<style scoped>
.custom-tags-container {
  margin-bottom: 0;
  min-height: 0;
}
.leftID{
  padding-left: 15px;
}
.tag-input{
  display:inline-block;
  margin-right: 10px;
  margin-left:10px;
}
span.txt{
  display:inline-block;
  overflow: hidden;
  width:240px;
  text-overflow: ellipsis;
  white-space:nowrap;
  line-height: 30px;
  cursor: default;
}
</style>



