<template>
  <sn-select v-model="matchVal"
    width="260"
    ref="roundSelect"
    placeholder="请选择"
    @getList="getMatchList"
    @change="matchSelectChange"
    async
  >
    <template v-if="!duringAjax">
      <sn-option
        v-for="item in matchList"
        :key="item.competitionId"
        :name="item.competitionName"
        :value="item.competitionId"
        :disabled="item.disabled"
      >
      </sn-option>
    </template>
    <div v-else class="text-center">数据加载中。。。</div>
    <div v-if="!duringAjax&&matchList.length==0" class="text-center">暂无数据</div>
  </sn-select>
</template>

<script>
import emitter from 'mixins/emitter';
import DI from 'interface'
export default {
  name: 'SelectMatch',

  componentName: 'SelectMatch',

  mixins: [emitter],

  props: ['gameId','value'],

  data() {
    return {
      matchList: [],
      duringAjax: false,
      matchVal: ''
    }
  },

  created() {
    this.$on('typeChange', this.clear);
  },

  methods: {
    matchSelectChange(val) {
      let matchList = this.matchList;

      for (let i = 0, len = matchList.length; i < len; i++) {
        if (matchList[i].competitionId == val) {
          this.matchVal = val;
          this.$emit('input', matchList[i]);
          break;
        }
      }
    },

    getMatchList() {
      if(this.gameId == '') {
        this.$message.warning('请选择赛事类型');
        return ;
      }

      if (this.matchList.length == 0) {
        this.duringAjax = true;
        this.$ajax({
          url: DI.label.getMatchListByType,
          type: 'get',
          data: {
            sportItemId: this.gameId
          },
          context: this,
          success: (res) => {
            this.duringAjax = false;
            if (res.retCode == "0") {
              const data = res.data;
              this.matchList = data.list;
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

    clear() {
      this.matchVal = '';
      this.matchList = [];
      this.$emit('input', null);
    }
  }

}
</script>

<style scoped>

</style>
