<template>
  <sn-select
    v-model="value"
    :name="name"
    width="143"
    ref="roundSelect"
    placeholder="请选择阶段"
    @getList="getRoundList"
    @change="roundSelectChange"
    async
    :disabled="!ancestor.matchSeasonVal">
    <template v-if="!loading&&roundSuggestions.length!==0">
      <sn-option value= '' name='请选择'></sn-option>
      <sn-option
        v-for="item in roundSuggestions"
        :key="item.stageRoundId"
        :name="item.stageRoundName"
        :value="''+item.stageRoundId"
        :disabled="item.disabled">
      </sn-option>
    </template>
    <div v-if="loading" class="text-center">数据加载中。。。</div>
    <div v-if="!loading&&roundSuggestions.length==0" class="text-center">暂无数据</div>
  </sn-select>
</template>

<script>
import DI from 'interface';
import emitter from 'mixins/emitter';
import * as Constant from 'js/constant';
export default {
  mixins: [emitter],
  name: 'MatchRoundTag',
  componentName: 'MatchRoundTag',
  props: {
    value: [String, Number],
    name: String
  },
  data() {
    return {
      roundSuggestions: [],
      loading: false,
      ancestor: this.$parent.$parent
    };
  },
  created() {
    this.$on('clearSelfSelectedState', this.clear);
  },
  methods: {
    clear() {
      this.scheduleSuggestions = [];
      this.$emit('input', '');
    },
    roundSelectChange(val) {
      this.$emit('input', val);
      this.dispatch('SelectArea', 'clearNextAllSelectedLabels', 'MatchScheduleTag');
      this.dispatch('SelectArea', 'clearNextAllSelectedLabels', 'MatchGroupTag');
      this.dispatch('MatchTag', 'changeLabelsContainer', [this.getSelectedItemById(val), 'MatchRoundTag']);
    },
    getRoundList() {
      const { sportsTypeVal, matchTypeVal, matchSeasonVal } = this.ancestor;

      if (this.roundSuggestions.length === 0) {
        if (!sportsTypeVal) {
          this.$message.warning('请选择运动分类！');
          return;
        }

        if (!matchTypeVal) {
          this.$message.warning('请选择赛事！');
          return;
        }

        if (!matchSeasonVal) {
          this.$message.warning('请选择赛季！');
          return;
        }

        let ajaxData = {
          sportItemId: sportsTypeVal,
          competitionId: matchTypeVal,
          seasonId: matchSeasonVal
        };
        this.loading = true;
        this.$ajax({
          url: DI.infoLibrary.getRoundList,
          type: 'get',
          data: ajaxData,
          context: this,
          success: res => {
            this.loading = false;
            if (res.retCode == '0') {
              const data = res.data;
              this.roundSuggestions = data.list;
            } else {
              this.$message.error(res.retMsg);;
            }
          },
          error: () => {
            console.log('error');
          }
        });
      }
    },
    clear() {
      this.roundSuggestions = [];
      this.$emit('input', '');
    },
    getSelectedItemById(val) {
      return this.roundSuggestions.find(round => {
        return val === '' + round.stageRoundId;
      });
    }
  }
};
</script>
