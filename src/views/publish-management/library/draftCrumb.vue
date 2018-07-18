<style scoped>
</style>
<template>
  <sn-search-box :fields="selectDraftFilters">
    <sn-search-item :children="[{
         label:'保存时间',
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
         prop:'draftId',
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
  props: ['selectDraftFilters'],
  data () {
    return {
     typeList: Constant.PUBLISH_ARTICLE_TYPE,//文章类型
    }
  },
  methods: {
    handleSelectChange (code, field) {
      this.selectDraftFilters[field] = code;
      this.$nextTick(() => {
        this.handleQuery();
      });
    },
    handleQuery () { //查询
      if (!this.selectDraftFilters.startTime && this.selectDraftFilters.endTime) {
        this.$bus.$emit('start-error-info');
        return;
      }
      if (this.selectDraftFilters.startTime && !this.selectDraftFilters.endTime) {
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
