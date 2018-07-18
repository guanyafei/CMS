<style scoped></style>
<template>
  <div>
    <List v-if="viewType == 'list'"  @change-view="change" ref='channelList' v-model="id" />
    <ImportTask v-if="viewType == 'importTask'" @change-view="changeView" :commentList="id" @close="close" @ok="close" />
  </div>
</template>
<script>
import DI from 'interface';
import List from './list';
import ImportTask from 'widgets/importTask/index';

export default {
  data () {
    return {
      viewType: 'list',
      id: ''
    }
  },
  components: {
    List,
    ImportTask
  },
  methods: {
    change(value) {
      this.viewType = value;
    },
    close() {
      this.viewType = 'list';
    }
  }
}
</script>
