<template>
  <div id="idx">
    <List v-if="viewType == 'list'" v-model="channelInfo" />
  </div>
</template>
<script>
  import List from './list'; //频道列表页
  export default {
    data() {
      return {
        viewType: 'list',
        id: '',
        channelInfo: {}
      }
    },
    components: {
      List
    }
  }
</script>
