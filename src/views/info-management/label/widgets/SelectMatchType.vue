<template>
  <div>
    <sn-select v-model="value"
      width="260"
      ref="typeSelect"
      placeholder="请选择"
      @getList="getTypeList"
      @change="typeSelectChange"
      async
    >
      <template v-if="!duringAjax">
        <sn-option
          v-for="item in typeList"
          :key="item.sportItemId"
          :name="item.sportItemName"
          :value="item.sportItemId"
          :disabled="item.disabled"
        >
        </sn-option>
      </template>
      <div v-else class="text-center">数据加载中。。。</div>
      <div v-if="!duringAjax&&typeList.length==0" class="text-center">暂无数据</div>
    </sn-select>
  </div>
</template>

<script>
import emitter from 'mixins/emitter';
import DI from 'interface'
export default {
  mixins: [emitter],
  name: 'SelectMatchType',
  componentName: 'SelectMatchType',
  props: ['value'],
  data() {
    return {
      typeList: [],
      tips: '',
      duringAjax: false
    }
  },
  methods: {
    typeSelectChange(val) {
      this.$emit('input', val);
    },
    getTypeList() {
      if (this.typeList.length == 0) {
        this.duringAjax = true;
        this.$ajax({
          url: DI.label.getMatchTypeList,
          type: 'get',
          context: this,
          success: (res) => {
            this.duringAjax = false;
            if (res.retCode == "0") {
              const data = res.data;
              this.typeList = data.list;
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.log("error");
          }
        });

      }
    }
  }

}
</script>

<style scoped>

</style>
