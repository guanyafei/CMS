<template>
  <div id="idx">
    <List v-if="viewType == 'list'" @change-view="change" v-model="examineInfo" />
    <Content v-if="viewType == 'content'" @change-view="change" :examineInfo="examineInfo" />
  </div>
</template>
<script>
  import List from './list';
  import Content from './content';
  export default {
    data() {
      return {
        viewType: 'list',
        id: '',
        examineInfo: {}
      }
    },
    components: {
      List,
      Content
    },
    methods: {
      change(value) {
        this.viewType = value;
      }
    }
  }
</script>
