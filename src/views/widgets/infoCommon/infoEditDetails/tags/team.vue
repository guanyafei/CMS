<template>
  <div>
    <sn-form-item label="球队标签">
      <sn-autocomplete
        v-model="searchInput"
        valueKey="teamName"
        :fetchSuggestions="querySearchAsync"
        placeholder="请输入球队名称"
        @select="selectItem"
        historyKey="teamTag"
        :width="510"
      >
        <template slot-scope="{item}" slot="history">
          {{item.teamName}}
        </template>
      </sn-autocomplete>
    </sn-form-item>
    <selected-tags
      v-if="!ruleForm.hideTag"
      class="custom-tags-container"
      :tags="ruleForm.teamLabels"
      @close="handleClose"
      :label="''"
      labelWidth="108px"
    >
      <span slot="item" slot-scope="{item}">
        {{item.labelName}}
      </span>
    </selected-tags>
  </div>
</template>

<script>
import DI from 'interface';
import { setHistoryArrData } from 'utils/util';
import SelectedTags from 'widgets/infoCommon/infoEditDetails/tags/match-tags/selected-tags';

export default {
  name: 'TeamTags',
  componentName: 'TeamTags',
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
      this.ruleForm.teamLabels.splice(index, 1);
    },
    querySearchAsync(options, cb) {
      this.$ajax({
        url: DI.infoLibrary.getTeamList,
        context: this,
        loadingText: 'false',
        type: 'get',
        data: {
          teamName: options.queryString
        },
        success: res => {
          const data = res.data || {};
          const labelList = data.list || [];
          cb(labelList);
        },
        error: () => {
          console.log('error');
        }
      });
    },
    selectItem(item) {
      setHistoryArrData('teamTag', [item], 'teamId');
      if (this.ruleForm.hideTag) {
        this.ruleForm.teamLabels = [{
          labelId: item.teamId,
          labelName: item.teamName,
          labelLogo: item.teamLogo,
          labelType: '8'
        }];
        return;
      }
      let { teamLabels } = this.ruleForm;
      for (let i = 0; i < teamLabels.length; i++) {
        const labelItem = teamLabels[i];
        if (item.teamId == labelItem.labelId) {
          return;
        }
      }
      teamLabels.push({
        labelId: item.teamId,
        labelName: item.teamName,
        labelLogo: item.teamLogo,
        labelType: '8'
      });
      this.ruleForm.teamLabels = [...teamLabels];
    }
  }
};
</script>
<style scoped>
.custom-tags-container {
  margin-bottom: 0;
  min-height: 0;
}
</style>
