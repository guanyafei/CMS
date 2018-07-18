<template>
  <sn-search-box :fields="searchFilters">
    <sn-search-item :children="[{
        label: '注册时间',
        type: 'duration',
        prop: ['startTime','endTime'],
      }, {
        type: 'button',
        buttonType: 'primary',
        text: '查询',
        triggerEvent: query,
        isRight: true
      }]">
    </sn-search-item>
    <sn-search-item :children="[{
        type: 'input',
        prop: 'authorId',
        placeholder: '请输入作者ID',
        maxlength: 30
      }, {
        type: 'input',
        prop: 'authorName',
        placeholder: '请输入作者名称',
        maxlength: 10
      }, {
        type: 'button',
        text: '重置',
        triggerEvent: resetFilterInputs,
        isRight: true
      }]">
    </sn-search-item>
    <sn-search-item :children="[{
          type: 'select',
          label: '作者类型',
          prop: 'authorType',
          list: authorList,
          triggerEvent: handleSelectChange
        }, {
          type: 'select',
          label: '账号状态',
          prop: 'status',
          list: statusList,
          triggerEvent: handleSelectChange
        }, {
          type: 'button',
          text: '添加作者',
          triggerEvent: onNewAuthorClick,
          isRight: true
        }]">
    </sn-search-item>
  </sn-search-box>
</template>

<script>
import * as Constant from 'js/constant';

export default {
  name: 'SearchBox',
  componentName: 'SearchBox',
  props: ['searchFilters'],
  data () {
    return {
      authorList: Constant.LIBRARY_AUTHOR_TYPE,
      statusList: Constant.ACC_STATUS,
    }
  },
  methods: {
    query () {
      if (!this.searchFilters.startTime && this.searchFilters.endTime) {
        this.$bus.$emit('start-error-info');
        return;
      }
      if (!this.searchFilters.endTime && this.searchFilters.startTime) {
        this.$bus.$emit('end-error-info');
        return;
      }
      this.$parent.goto(1);
    },
    handleSelectChange (code, field) {
      this.searchFilters[field] = code;
      this.$nextTick(() => {
        this.query()
      })
    },
    clearDateErrMsg () {
      this.$bus.$emit('clear-start-error');
      this.$bus.$emit('clear-end-error');
    },
    resetFilterInputs () {
      this.clearDateErrMsg();
      this.$parent.resetFilterInputs();
    },
    onNewAuthorClick () {

    }
  }
}
</script>
