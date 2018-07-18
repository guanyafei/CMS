<template>
  <div>
    <sn-form-item label="球员标签">
      <sn-autocomplete
        v-model="searchInput"
        valueKey="playerName"
        :fetchSuggestions="querySearchAsync"
        placeholder="请输入球员名称"
        historyKey="playerTag"
        @select="selectItem"
        :width="510"
      >
        <template slot-scope="{item}" slot="history">
          {{item.playerName}}
        </template>
        <template slot-scope="{item}">
          <div class="match-suggestions__item">
            <template>
              <span>{{item.playerName}}</span>
              <span>{{item.teamName}}</span>
            </template>
          </div>
        </template>
      </sn-autocomplete>
    </sn-form-item>
    <selected-tags
      v-if="!ruleForm.hideTag"
      class="custom-tags-container"
      :tags="ruleForm.playerLabels"
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
  name: 'PlayerTags',
  componentName: 'PlayerTags',
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
      this.ruleForm.playerLabels.splice(index, 1);
    },
    querySearchAsync(options, cb) {
      this.$ajax({
        url: DI.infoLibrary.getPlayerList,
        context: this,
        type: 'get',
        loadingText: 'false',
        data: {
          playerName: options.queryString
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
      setHistoryArrData('playerTag', [item], ['playerId']);
      if (this.ruleForm.hideTag) {
        this.ruleForm.playerLabels = [{
          labelId: item.playerId,
          labelName: item.playerName,
          labelLogo: item.playerLogo,
          labelType: '9'
        }];
        return;
      }
      let { playerLabels } = this.ruleForm;
      for (let i = 0; i < playerLabels.length; i++) {
        const labelItem = playerLabels[i];
        if (item.playerId == labelItem.labelId) {
          return;
        }
      }
      playerLabels.push({
        labelId: item.playerId,
        labelName: item.playerName,
        labelLogo: item.playerLogo,
        labelType: '9'
      });
      this.ruleForm.playerLabels = [...playerLabels];
    }
  }
};
</script>
<style scoped>
.custom-tags-container {
  margin-bottom: 0;
  min-height: 0;
}
.match-suggestions__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding-right: 10px;
}
</style>
