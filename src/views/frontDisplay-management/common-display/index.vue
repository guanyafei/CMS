<style scoped></style>
<template>
  <div id="idx">
    <List v-if="viewType == 'list'" @change-view="change" ref='channelList' v-model="displayInfo" />
    <ContentList v-if="viewType == 'contentList'" @change-view="change" :displayItem="this.displayInfo" />
    <!-- <ContentList v-if="viewType == 'contentList'" @change-view="change" :displayLocationId="id" /> -->
    <sn-toptip></sn-toptip>
  </div>
</template>
<script>

import List from './list'; //频道列表页
import ContentList from './contentList'; //展示位内容管理

  export default {
    data() {
      return {
        viewType: 'list',
        id: '',
        displayInfo: {}
      }
    },
    components: {
      List,
      ContentList,
    },
    methods: {
      change(value) {
        this.viewType = value;
      }
    }
  }
</script>
