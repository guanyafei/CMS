<template>
  <sn-form-item label="关联赛事" labelWidth="180px">
    <sn-select
      v-model="value"
      :name="name"
      width="440"
      :labelWidth="180"
      placeholder="请选择赛事"
      @getList="getGameList"
      @change="gameSelectChange"
      async
      :disabled="!$parent.sportsTypeVal">
      <template v-if="!loading && matchSuggestions.length!==0">
        <sn-option value= "" name='请选择'></sn-option>
        <sn-option
          v-for="item in matchSuggestions"
          :key="item.competitionId"
          :name="item.competitionName"
          :value="''+item.competitionId"
          :disabled="item.disabled">
        </sn-option>
      </template>
      <div v-if="loading" class="text-center">数据加载中。。。</div>
      <div v-if="!loading && matchSuggestions.length==0" class="text-center">暂无数据</div>
    </sn-select>
  </sn-form-item>
</template>

<script>
import DI from 'interface'
import emitter from 'mixins/emitter'
import * as Constant from 'js/constant'

export default {
  mixins: [emitter],
  name: 'MatchTypeTag',
  componentName: 'MatchTypeTag',
  props: {
    value: [String, Number],
    name: String
  },
  data () {
    return {
      matchSuggestions: [],
      loading: false,
    }
  },
  created () {
    this.$on('clearSelfSelectedState', this.clear);
  },
  methods: {
    clear () {
      this.matchSuggestions = [];
      this.$emit('input', '');
    },
    gameSelectChange (val) {
      this.$emit('input', val);
      this.dispatch('SelectArea', 'clearNextAllSelectedLabels', 'MatchSeasonTag');
      this.dispatch('MatchTag', 'changeLabelsContainer', [this.getSelectedItemById(val), 'MatchTypeTag']);
    },
    getGameList () {
      const { sportsTypeVal } = this.$parent;
      if (this.matchSuggestions.length == 0) {
        if (!sportsTypeVal) {
          this.$message.warning('请选择运动分类！');
          return;
        }
        this.loading = true;
        this.$ajax({
          url: DI.infoLibrary.getGameList,
          type: 'get',
          data: {
            sportItemId: sportsTypeVal
          },
          context: this,
          success: (res) => {
            this.loading = false;
            if (res.retCode == "0") {
              const data = res.data;
              this.matchSuggestions = data.list;
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
    clear () {
      this.matchSuggestions = [];
      this.$emit('input', '')
    },
    getSelectedItemById (val) {
      return this.matchSuggestions.find((game) => {
        return val === '' + game.competitionId
      })
    }
  }
}
</script>

<style scoped>
.is-line {
  margin-left: 90px;
}
.mr-5 {
  margin-right: 5px;
}
</style>
