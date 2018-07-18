<template>
  <div style="{display:none}">
  </div>
</template>
<script>
export default {
  name: 'SearchItem',
  props: ['children'],
  mounted () {
    this.$parent.addList(this);
  },
  beforeDestroy () {
    this.$parent.removeList(this);
  }
}
</script>



<style scoped>
.sn-search-item--line {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.sn-search-item--between {
  display: flex;
  justify-content: space-between;
}
</style>
