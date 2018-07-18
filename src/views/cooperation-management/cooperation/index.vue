<template>
  <div id="idx">
    <sn-topbar :title="title"></sn-topbar>
    <cooperation ref="cooperation"></cooperation>
    <sn-toptip></sn-toptip>
  </div>
</template>
<script>
import Cooperation from './cooperation'
export default {
  name: 'CooperationIndex',
  components: {
    Cooperation
  },
  data: () => ({
    title: "合作推广库",
    item: null
  })
};
</script>
