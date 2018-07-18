<style scoped>

</style>
<template>
  <div id="idx">
    <List v-if="viewType == 'list'" ref="configList"></List>
  </div>
</template>
<script>
import List  from './list'
export default {
  components: {
    List
  },
  data () {
    return {
       viewType:'list'
    }
  }
}
</script>

