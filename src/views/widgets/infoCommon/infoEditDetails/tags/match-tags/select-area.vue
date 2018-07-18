<template>
  <div>
    <sports-type v-model="sportsTypeVal" :sportsSuggestions="ruleForm.sportsTypeList"></sports-type>
    <match-type v-model="matchTypeVal" :name="matchTypeName"></match-type>
    <sn-form-item labelWidth="180px">
      <div class="is-line" style="width: 440px;justify-content: space-between;margin-bottom: 10px;">
        <match-season
          v-model="matchSeasonVal"
          :name="matchSeasonName"
        >
        </match-season>
        <match-round
          v-model="matchRoundVal"
          :name="matchRoundName"
        >
        </match-round>
        <match-group
          v-model="matchGroupVal"
          :name="matchGroupName"
        >
        </match-group>
      </div>
      <match-schedule
        v-model="matchScheduleVal"
        :name="matchScheduleName"
      >
      </match-schedule>
    </sn-form-item>
  </div>
</template>

<script>
import DI from 'interface';
import emitter from 'mixins/emitter';
import SportsType from './sports-type';
import MatchType from './match-type';
import MatchSeason from './match-season';
import MatchRound from './match-round';
import MatchSchedule from './match-schedule';
import MatchGroup from './match-group';
const ClearLabelsComponentNames = ['SportsTypeTag', 'MatchTypeTag', 'MatchSeasonTag', 'MatchRoundTag', 'MatchGroupTag', 'MatchScheduleTag'];
export default {
  mixins: [emitter],
  name: 'SelectArea',
  componentName: 'SelectArea',
  props: ['ruleForm', 'selectedLablesItem'],
  components: {
    SportsType,
    MatchType,
    MatchSeason,
    MatchRound,
    MatchSchedule,
    MatchGroup
  },
  data () {
    return {
      sportsTypeVal: '',
      matchTypeVal: '',
      matchTypeName: '',
      matchSeasonVal: '',
      matchSeasonName: '',
      matchRoundVal: '',
      matchRoundName: '',
      matchScheduleVal: '',
      matchScheduleName: '',
      matchGroupVal: '',
      matchGroupName: ''
    }
  },
  watch: {
    selectedLablesItem (newValue) {
      if (newValue) {
        this.sportsTypeVal = newValue.sportItemId || '';
        this.matchTypeVal = newValue.competitionId || '';
        this.matchTypeName = newValue.competitionName || '';
        this.matchSeasonVal = newValue.seasonId || '';
        this.matchSeasonName = newValue.seasonName || '';
        this.matchRoundVal = newValue.stageRoundId || '';
        this.matchRoundName = newValue.stageRoundName || '';
        this.matchGroupVal = newValue.groupId || '';
        this.matchGroupName = newValue.groupName || '';
        this.matchScheduleVal = newValue.matchId || '';
        this.matchScheduleName = newValue.matchName || '';
      }
    }
  },
  created () {
    this.$on('clearNextAllSelectedLabels', this.clearNextAllSelectedLabels);
  },
  methods: {
    clearNextAllSelectedLabels (key) {
      const index = ClearLabelsComponentNames.indexOf(key);
      let clearArr = ClearLabelsComponentNames.slice(index);
      for (let i = 0; i < clearArr.length; i++) {
        const curKey = clearArr[i];
        this.broadcast(curKey, 'clearSelfSelectedState', this);
      }
    }
  }
}
</script>

