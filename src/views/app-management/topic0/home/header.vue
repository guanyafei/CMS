<template>
  <sn-search-box :fields="searchFilters">
    <sn-search-item :children="[{
        type: 'input',
        prop: 'title',
        placeholder: '请输入页面标题',
        maxlength: 30
      }, {
        type: 'button',
        text: '查询',
        buttonType: 'primary',
        triggerEvent: query,
        isRight: true
      }]">
    </sn-search-item>
    <sn-search-item
      :children="[{
        type: 'select',
        label: '上架状态',
        prop: 'publishStatus',
        list: publishTypes,
        triggerEvent: handleSelectChange
      }, {
        type: 'button',
        text: '重置',
        triggerEvent: reset,
        isRight: true
      }, {
        type: 'button',
        text: '添加专题',
        buttonType: 'outline',
        triggerEvent: reset,
        isRight: true
      }]"
    >
    </sn-search-item>
  </sn-search-box>
</template>
<script>
import * as Constant from 'js/constant'

export default {
  name: 'TopicHeader',
  componentName: 'TopicHeader',
  props: {
    searchFilters: Object
  },
  data () {
    return {
      publishTypes: Constant.TOPIC_PUBLISH_STATUS_TYPES
    }
  },
  methods: {
    handleSelectChange (code, field) {
      this.searchFilters[field] = code;
      this.$nextTick(()=>{
        this.query();
      })
    },
    query () {
      this.$parent.goto(1);
    },
    resetFilterInputs() {
      this.$parent.resetFilterInputs();
    }
  },
}
</script>
