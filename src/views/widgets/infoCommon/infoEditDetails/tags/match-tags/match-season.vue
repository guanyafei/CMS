<template>
  <sn-select
    v-model="value"
    :name="name"
    width="143"
    ref="seasonSelect"
    placeholder="请选择赛季"
    @getList="getSeasonList"
    @change="seasonSelectChange"
    async
    :disabled="!ancestor.matchTypeVal">
    <template v-if="!duringAjax&&seasonSuggestions.length!==0">
      <sn-option value= "" name="请选择"></sn-option>
      <sn-option
        v-for="item in seasonSuggestions"
        :key="item.seasonId"
        :name="item.seasonName"
        :value="''+item.seasonId"
        :disabled="item.disabled">
      </sn-option>
    </template>
    <div v-if="duringAjax" class="text-center">数据加载中。。。</div>
    <div v-if="!duringAjax&&seasonSuggestions.length==0" class="text-center">暂无数据</div>
  </sn-select>
</template>

<script>
import DI from 'interface'
import emitter from 'mixins/emitter'
import * as Constant from 'js/constant'

export default {
  mixins: [emitter],
  name: 'MatchSeasonTag',
  componentName: 'MatchSeasonTag',
  props: {
    value: [String, Number],
    name: String
  },
  data () {
    return {
      seasonSuggestions: [],
      duringAjax: false,
      ancestor: this.$parent.$parent
    }
  },
  created () {
    this.$on('clearSelfSelectedState', this.clear);
  },
  methods: {
    clear () {
      this.seasonSuggestions = [];
      this.$emit('input', '');
    },
    seasonSelectChange (val, item) {
      this.$emit('input', val);
      this.dispatch('SelectArea', 'clearNextAllSelectedLabels', 'MatchRoundTag');
      this.dispatch('MatchTag', 'changeLabelsContainer', [this.getSelectedItemById(val), 'MatchSeasonTag']);
    },
    getSeasonList () {
      const { sportsTypeVal, matchTypeVal } = this.ancestor;

      if (this.seasonSuggestions.length == 0) {
        if (!sportsTypeVal) {
          this.$message.warning('请选择运动分类！');
          return;
        }

        if (!matchTypeVal) {
          this.$message.warning('请选择赛事！');
          return;
        }

        let ajaxData = {
          sportItemId: sportsTypeVal,
          competitionId: matchTypeVal
        };
        this.duringAjax = true;
        this.$ajax({
          url: DI.infoLibrary.getSeasonList,
          type: 'get',
          data: ajaxData,
          context: this,
          success: (res) => {
            this.duringAjax = false;
            if (res.retCode == "0") {
              const data = res.data;
              this.seasonSuggestions = data.list;
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
    getSelectedItemById (val) {
      return this.seasonSuggestions.find((season) => {
        return val === '' + season.seasonId
      })
    }
  }
}
</script>
