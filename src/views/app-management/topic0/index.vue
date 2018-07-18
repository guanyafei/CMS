<template>
  <div id="idx">
    <router-view class="view"></router-view>
    <sn-toptip></sn-toptip>
  </div>
</template>
<script>
  export default {
    name: 'TopicIndex',
    componentName: 'TopicIndex',
    created () {
      this.events = {
        setSelectedRow: (row) => {
          this.$bus.selectedRow = row;
        }
      }
      this.$bus.$on('setSelect')
    },
    beforeDestroy () {

    }
  }
</script>
