<template>
  <div class="topic-home__actions is-column">
    <sn-button
      type="text"
      size="mini"
      @click="handleChangeShelfStatusBtnClick(row)"
    >
      {{ row.status == '1' ? '下架' : '上架' }}
    </sn-button>
    <sn-button type="text" size="mini">删除</sn-button>
    <sn-button type="text" size="mini">编辑</sn-button>
    <sn-button type="text" size="mini">展示设置</sn-button>
    <sn-button type="text" size="mini">设定免审名单</sn-button>
  </div>
</template>
<script>
  export default {
    name: 'TopicHomeListActions',
    componentName: 'TopicHomeListActions',
    props: ['row', 'selectedRow'],
    methods: {
      handleChangeShelfStatusBtnClick (row) {
        this.$emit('update:selectedRow', { ...row });
      }
    },
  }
</script>
