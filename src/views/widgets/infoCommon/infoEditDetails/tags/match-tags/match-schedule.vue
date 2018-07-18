<template>
  <sn-select
    v-model="value"
    :name="name"
    width="440"
    ref="scheduleSelect"
    placeholder="请选择比赛"
    @getList="getScheduleList"
    @change="scheduleSelectChange"
    :disabled="!ancestor.matchRoundVal"
    async
  >
    <template v-if="!duringAjax&&scheduleSuggestions.length!==0">
      <sn-option value="" name="请选择"></sn-option>
      <sn-option
        v-for="item in scheduleSuggestions"
        :key="item.matchId"
        :name="`${item.homeTeamName}vs${item.guestTeamName}`"
        :value="''+item.matchId"
        :disabled="item.disabled">
      </sn-option>
    </template>
    <div class="text-center">
      <template v-if="duringAjax">数据加载中。。。</template>
      <template v-else-if="scheduleSuggestions.length==0">暂无数据</template>
    </div>
  </sn-select>
</template>

<script>
import _ from 'lodash'
import DI from 'interface'
import emitter from 'mixins/emitter'
import * as Constant from 'js/constant'
export default {
  mixins: [emitter],
  name: 'MatchScheduleTag',
  componentName: 'MatchScheduleTag',
  props: {
    value: [String, Number],
    name: String
  },
  data() {
    return {
      scheduleSuggestions: [],
      duringAjax: false,
      ancestor: this.$parent.$parent
    }
  },
  created () {
    this.$on('clearSelfSelectedState', this.clear);
  },
  methods: {
    clear () {
      this.scheduleSuggestions = [];
      this.$emit('input', '');
    },
    scheduleSelectChange(val) {
      const oldVal = this.value;

      this.$emit('input', val);
      this.dispatch('MatchTag', 'changeLabelsContainer', [this.getSelectedItemById(val), 'MatchScheduleTag']);

      /* this.$nextTick(() => {
        this.$bus.$emit('refreshSettleTeamList', {
          newList: this.getTeamListFromItem(val),
          oldList: this.getTeamListFromItem(oldVal)
        })
      }) */
    },
    getScheduleList() {
      const { sportsTypeVal, matchTypeVal, matchSeasonVal, matchRoundVal} = this.ancestor;

      if (this.scheduleSuggestions.length == 0) {
        if (!sportsTypeVal) {
          this.$message.warning('请选择运动分类！');
          return;
        }

        if (!matchTypeVal) {
          this.$message.warning('请选择赛事！');
          return ;
        }

        if (!matchSeasonVal) {
          this.$message.warning('请选择赛季！');
          return ;
        }

        if (!matchRoundVal) {
          this.$message.warning('请选择轮次！');
          return ;
        }

        let ajaxData = {
          sportItemId: sportsTypeVal,
          competitionId: matchTypeVal,
          seasonId: matchSeasonVal,
          stageRoundId: matchRoundVal
        };
        this.duringAjax = true;
        this.$ajax({
          url: DI.infoLibrary.getScheduleList,
          type: 'get',
          data: ajaxData,
          context: this,
          success: (res) => {
            this.duringAjax = false;
            if (res.retCode == "0") {
              const data = res.data || {};
              this.scheduleSuggestions = data.list || [];
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.log("error");
          }
        });
      }

    },
    getSelectedItemById(val) {
      return this.scheduleSuggestions.find((schedule) => {
        return  val === '' + schedule.matchId
      })
    },
    getTeamListFromItem(val) {
      let item = this.getSelectedItemById(val);

      if (item == null) {
        return []
      }

      return [
        {
          teamId: '' + item.homeTeamId,
          teamName: item.homeTeamName,
          teamLogo: item.homeTeamLogo
        },
        {
          teamId: '' + item.guestTeamId,
          teamName: item.guestTeamName,
          teamLogo: item.guestTeamLogo
        }
      ]
    }
  }
}
</script>
