<style scoped></style>
<template>
  <div id="idx">
    <List  v-if="viewType == 'list'" @change-view="change" ref='channelList' v-model="id"/>
  </div>
</template>
<script>
import List from './list'; //冠名广告列表页

export default {
  data() {
    return {
      viewType: 'list'
    }
  },
  components: {
    List
  },
  methods: {
    change(value) {
      this.viewType = value;
    }
  }
}
</script>
