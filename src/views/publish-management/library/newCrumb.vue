<style scoped>

</style>
<template>
  <sn-search-box :fields="selectFilters">
    <sn-search-item :children="[{
             label:'发布时间',
             type:'duration',
             prop:['startTime','endTime']
    }]">
    </sn-search-item>
    <sn-search-item :children="[{
             type:'input',
             prop:'title',
             placeholder:'请输入文章标题',
             maxlength:30
      }, {
             type:'input',
             prop:'newsId',
             placeholder:'请输入资讯ID',
         inputType: 'number',
         maxlength: 20
          },{
             type: 'button',
             buttonType:'primary',
             text: '查询',
             triggerEvent: handleQuery,
             isRight: true
      }]">
    </sn-search-item>
    <sn-search-item :children="[{
             type:'select',
             prop:'newsType',
             label:'文章类型',
             list:typeList,
             triggerEvent:handleSelectChange
      }, {
             type:'select',
             prop:'status',
             label:'发布状态',
             list:statusList,
             triggerEvent:handleSelectChange
          },{
            type: 'button',
             text: '重置',
             triggerEvent: reset,
             isRight: true
      }]">
    </sn-search-item>
  </sn-search-box>
</template>
<script>
import * as Constant from 'js/constant';
export default {
  props: ['selectFilters'],
  data () {
    return {
      typeList: Constant.PUBLISH_ARTICLE_TYPE,//文章类型
      statusList: Constant.PUBLISH_INFOR_STATUS//发布状态
    }
  },
  methods: {
    handleSelectChange (code, field) {
      this.selectFilters[field] = code;
      this.$nextTick(() => {
        this.handleQuery();
      });
    },
    handleQuery () { //查询
      if (!this.selectFilters.startTime && this.selectFilters.endTime) {
        this.$bus.$emit('start-error-info');
        return;
      }
      if (this.selectFilters.startTime && !this.selectFilters.endTime) {
        this.$bus.$emit('end-error-info');
        return;
      }

      this.$parent.goto(1);

    },
    clearDateErrMsg () {
      this.$bus.$emit('clear-start-error');
      this.$bus.$emit('clear-end-error');
    },
    reset () { //重置
      this.clearDateErrMsg();
      this.$parent.resetFields();
    }
  }
}
</script>
