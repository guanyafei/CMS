<template>
  <div>
    <div>{{row.startTime}}</div> 
    <span>至</span>
    <div>{{row.endTime}}</div> 
  </div>
</template>

<script>
export default {
  name: 'ColumnTime',
  props: ['row']

}
</script>

<style scoped>

</style>
