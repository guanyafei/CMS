<template>
  <sn-search-box :fields="fields">
    <sn-search-item :children="[{
        type: 'input',
        prop: 'contentId',
        placeholder: '请输入内容ID'
      }, {
        type: 'input',
        prop: 'contentTitle',
        placeholder: '请输入内容标题',
        maxlength: 100
      }, {
        type: 'button',
        buttonType: 'primary',
        text: '查询',
        triggerEvent: query,
        isRight: true
      }]">
    </sn-search-item>
    <sn-search-item :children="[{
          type: 'select',
          label: '内容类型',
          prop: 'contentType',
          list: contentList,
          triggerEvent: selectContentChange
        }, {
        type: 'button',
        text: '重置',
        triggerEvent: reset,
        isRight: true
      }]">
    </sn-search-item>
    <sn-search-item :children="[{
        type: 'slot',
        prop: 'checkAll'
      }, {
        type: 'slot',
        prop: 'hide'
      }]">
      <sn-button slot="checkAll" type="primary" @click="toggleCheckAll(checkAll)">{{checkAll?'取消全选':'全选'}}</sn-button>
      <sn-button slot="hide" type="success" @click="batchDel()">删除</sn-button>
    </sn-search-item>
  </sn-search-box>
</template>

<script>
import * as Constant from 'js/constant';

export default {
  name: 'CommentCrumb',
  componentName: 'CommentCrumb',
  props: ['checkAll'],
  data() {
    return {
      fields: {
        contentType: -1,
        ...this.getDefaultData()
      },
      contentList: Constant.RECOMM_CONTENT_TYPE,
    }
  },
  methods: {
    query () {
      this.$parent.goto(1);
    },
    getDefaultData() {
      return {
        contentId: '',
        contentTitle: '',
      }
    },
    selectContentChange(code) {
      this.fields.contentType = code;
      this.$nextTick(()=>{
        this.query()
      })
    },
    reset() {
      Object.assign(this.fields, this.getDefaultData());
    },
    toggleCheckAll (type) {
      this.$bus.$emit('checkAllBtn-click', !type);
    },
    batchDel () {
      let $borther = this.$parent.$refs.list;
      if ($borther.selecteds.length === 0) {
        this.$message.warning("请至少选中一条内容！");
        return;
      }

      $borther.batchDelHandle();
    },
  }
}
</script>

