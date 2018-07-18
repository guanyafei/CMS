<template>
  <div class="match-tags">
    <sn-form-item label="比赛标签" prop="matchLabels" :rules="matchRules" ref="matchLabels">
      <sn-autocomplete
        v-model="searchInput"
        valueKey="matchName"
        :fetchSuggestions="querySearchAsync"
        :isSuggestionsPages="true"
        placeholder="输入球队/比赛关键词快速添加"
        historyKey="matchTag"
        @select="selectItem"
        :width="510"
      >
        <template slot-scope="{item}" slot="history">
          {{item.matchName || item.competitionName}}
        </template>
        <template slot-scope="{item}">
          <div class="match-suggestions__item">
            <template v-if="item.matchName">
              <span>{{item.matchName}}</span>
              <span>{{item.matchDateTime}}</span>
            </template>
            <span v-else>{{item.competitionName}}</span>
          </div>
        </template>
      </sn-autocomplete>
    </sn-form-item>
    <select-area :ruleForm="ruleForm" :selectedLablesItem="selectedLablesItem"></select-area>
    <sn-form-item labelWidth="180px">
      <sn-button type="primary" @click="addLabels" :disabled="isAddBtnDisabled">添加比赛标签</sn-button>
    </sn-form-item>
    <selected-tags :tags="ruleForm.matchLabels" @close="handleClose" labelWidth="180px"></selected-tags>
  </div>
</template>
<script>
import DI from 'interface';
import emitter from 'mixins/emitter';
import * as Constant from 'js/constant';
import { setHistoryArrData } from 'utils/util';
import SelectArea from './match-tags/select-area';
import SelectedTags from './match-tags/selected-tags';

const SaveToContainerLabelKeys = ['SportsTypeTag', 'MatchTypeTag', 'MatchSeasonTag', 'MatchRoundTag', 'MatchGroupTag', 'MatchScheduleTag'];

export default {
  mixins: [emitter],
  name: 'MatchTag',
  componentName: 'MatchTag',
  components: {
    SelectArea,
    SelectedTags
  },
  props: ['ruleForm'],
  data() {
    return {
      searchInput: '',
      selectedLablesItem: null,
      labelsContainer: {}
    };
  },
  computed: {
    matchRules() {
      const requiredValidation = (rule, value, callback) => {
        callback();
      };

      return [
        {
          required: false,
          message: '请添加比赛标签',
          type: 'array',
          trigger: 'change'
        },
        {
          validator: requiredValidation,
          trigger: 'change'
        }
      ];
    },
    isAddBtnDisabled() {
      let { labelsContainer } = this;
      for (const key in labelsContainer) {
        if (labelsContainer.hasOwnProperty(key) && labelsContainer[key]) {
          return false;
        }
      }

      return true;
    }
  },
  watch: {
    selectedLablesItem(newValue) {
      if (newValue) {
        this.quickAddToContainer(newValue);
      }
    },
    'ruleForm.matchLabels': {
      handler: function(val, oldVal) {
        this.$refs.matchLabels.$emit('form.change', [val]);
      },
      deep: true
    }
  },
  created() {
    this.$on('changeLabelsContainer', this.changeLabelsContainer);
  },
  methods: {
    addLabels(auto) {
      if (this.isAddBtnDisabled) {
        return;
      }
      let { labelsContainer } = this;
      let { matchLabels, teamLabels } = this.ruleForm;
      let labelType;
      let competitionName = labelsContainer.MatchTypeTag && labelsContainer.MatchTypeTag.competitionName || '';
      for (const key in labelsContainer) {
        if (labelsContainer.hasOwnProperty(key) && labelsContainer[key]) {
          const addLabel = labelsContainer[key];
          switch (key) {
            case 'SportsTypeTag':
              labelType = Constant.getItemByKey(Constant.INFO_TAB_TYPE, 'program').value;
              if (!this.isInSelectedList(matchLabels, addLabel.sportItemId, labelType)) {
                matchLabels.push({
                  labelId: addLabel.sportItemId,
                  labelName: addLabel.sportItemName,
                  labelType
                });
              }
              break;

            case 'MatchTypeTag':
              labelType = Constant.getItemByKey(Constant.INFO_TAB_TYPE, 'game').value;
              if (!this.isInSelectedList(matchLabels, addLabel.competitionId, labelType)) {
                matchLabels.push({
                  labelId: addLabel.competitionId,
                  labelName: addLabel.competitionName,
                  labelLogo: addLabel.competitionLogo,
                  labelType
                });
              }
              break;

            case 'MatchSeasonTag':
              labelType = Constant.getItemByKey(Constant.INFO_TAB_TYPE, 'season').value;
              if (!this.isInSelectedList(matchLabels, addLabel.seasonId, labelType)) {
                matchLabels.push({
                  labelId: addLabel.seasonId,
                  labelName: competitionName + ' ' + addLabel.seasonName,
                  labelType
                });
              }
              break;

            case 'MatchRoundTag':
              labelType = Constant.getItemByKey(Constant.INFO_TAB_TYPE, 'round').value;
              if (!this.isInSelectedList(matchLabels, addLabel.stageRoundId, labelType)) {
                matchLabels.push({
                  labelId: addLabel.stageRoundId,
                  labelName: competitionName + ' ' + addLabel.stageRoundName,
                  labelType
                });
              }
              break;

            case 'MatchScheduleTag':
              let scheduleLabelType = Constant.getItemByKey(Constant.INFO_TAB_TYPE, 'schedule').value;
              let teamLabelType = Constant.getItemByKey(Constant.INFO_TAB_TYPE, 'team').value;

              if (!this.isInSelectedList(matchLabels, addLabel.matchId, scheduleLabelType)) {
                if (addLabel.matchId) {
                  matchLabels.push({
                    labelId: addLabel.matchId,
                    labelName: addLabel.matchName,
                    labelType: scheduleLabelType
                  });
                }
              }
              if (!this.isInSelectedList(teamLabels, addLabel.homeTeamId, teamLabelType)) {
                if (addLabel.homeTeamId) {
                  teamLabels.push({
                    labelId: addLabel.homeTeamId,
                    labelName: addLabel.homeTeamName,
                    labelLogo: addLabel.homeTeamLogo,
                    labelType: teamLabelType
                  });
                }
              }
              if (!this.isInSelectedList(teamLabels, addLabel.guestTeamId, teamLabelType)) {
                if (addLabel.guestTeamId) {
                  teamLabels.push({
                    labelId: addLabel.guestTeamId,
                    labelName: addLabel.guestTeamName,
                    labelLogo: addLabel.guestTeamLogo,
                    labelType: teamLabelType
                  });
                }
              }
              break;

            case 'MatchGroupTag':
              labelType = Constant.getItemByKey(Constant.INFO_TAB_TYPE, 'group').value;
              if (!this.isInSelectedList(matchLabels, addLabel.groupId, labelType)) {
                matchLabels.push({
                  labelId: addLabel.groupId,
                  labelName: competitionName + ' ' + addLabel.groupName,
                  labelType
                });
              }
              break;
            default:
              break;
          }
        }
      }
      this.ruleForm.matchLabels = [...matchLabels];
      this.ruleForm.teamLabels = [...teamLabels];
      if (!auto) {
        this.$nextTick(() => {
          this.labelsContainer = {};
          this.broadcast('SelectArea', 'clearNextAllSelectedLabels', 'SportsTypeTag');
        });
      }
    },
    isInSelectedList(list, id, labelType) {
      for (let i = 0; i < list.length; i++) {
        const label = list[i];
        if (labelType == label.labelType && '' + label.labelId === '' + id) {
          return true;
        }
      }
      return false;
    },
    changeLabelsContainer(changeItem, changeKey) {
      const index = SaveToContainerLabelKeys.indexOf(changeKey);
      let deleteLabelKeys = SaveToContainerLabelKeys.slice(index + 1);
      let { labelsContainer } = this;
      labelsContainer[changeKey] = changeItem ? { ...changeItem } : null;

      for (let i = 0; i < deleteLabelKeys.length; i++) {
        const delKey = deleteLabelKeys[i];
        if (labelsContainer.hasOwnProperty(delKey)) {
          labelsContainer[delKey] = null;
        }
      }
      this.labelsContainer = { ...labelsContainer };
    },
    handleClose(index) {
      this.ruleForm.matchLabels.splice(index, 1);
    },
    querySearchAsync(options, cb) {
      this.$ajax({
        url: DI.infoLibrary.fetchMatchLabelsByTitle,
        context: this,
        loadingText: 'false',
        data: JSON.stringify({
          name: options.queryString,
          pageIndex: options.pageIndex,
          pageSize: options.pageSize
        }),
        success: res => {
          const matchlist = (res.data || {}).matchlist || [];
          cb(matchlist);
        },
        error: () => {
          console.log('error');
        }
      });
    },
    selectItem(item) {
      this.broadcast('SelectArea', 'clearNextAllSelectedLabels', 'SportsTypeTag');
      setHistoryArrData('matchTag', [item], ['matchId', 'competitionId']);
      this.selectedLablesItem = { ...item };
    },
    quickAddToContainer(item) {
      let { labelsContainer } = this;
      if (item) {
        if (item.sportItemId) {
          labelsContainer.SportsTypeTag = {
            sportItemId: item.sportItemId,
            sportItemName: item.sportItemName
          };
        }
        if (item.competitionId) {
          labelsContainer.MatchTypeTag = {
            competitionId: item.competitionId,
            competitionName: item.competitionName
          };
        }
        if (item.seasonId) {
          labelsContainer.MatchSeasonTag = {
            seasonId: item.seasonId,
            seasonName: item.seasonName
          };
        }
        if (item.stageRoundId) {
          labelsContainer.MatchRoundTag = {
            stageRoundId: item.stageRoundId,
            stageRoundName: item.stageRoundName
          };
        }
        if (item.groupId) {
          labelsContainer.MatchGroupTag = {
            groupId: item.groupId,
            groupName: item.groupName
          };
        }
        if (item.matchId) {
          labelsContainer.MatchScheduleTag = {
            matchId: item.matchId,
            matchName: item.matchName,
            matchDateTime: item.matchDateTime,
            guestTeamId: item.guestTeamId,
            guestTeamLogo: item.guestTeamLogo,
            guestTeamName: item.guestTeamName,
            homeTeamId: item.homeTeamId,
            homeTeamLogo: item.homeTeamLogo,
            homeTeamName: item.homeTeamName
          };
        }
      }
      this.labelsContainer = { ...labelsContainer };
      this.$nextTick().then(() => {
        this.addLabels(true);
      });
    }
  }
};
</script>
<style scoped>
.match-suggestions__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding-right: 10px;
}
</style>

