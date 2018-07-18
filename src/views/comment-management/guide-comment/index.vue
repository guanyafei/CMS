<template>
  <div id="idx">
    <List v-if="viewType == 'list'" @change-view="change" v-model="contentInfo"></List>
    <Comment v-if="viewType == 'comment'" @change-view="change" :content.sync="contentInfo"></Comment>
    <Replay v-if="viewType == 'replay'" @change-view="change" :content.sync="contentInfo"></Replay>
    <ImportTask
        v-if="viewType == 'importTask'"
        @change-view="change"
        :item.sync="contentInfo"
        @close="close"
        @ok="close"
        view="viewType"
        :import-type="contentInfo.$importTargetType"
    />
  </div>
</template>
<script>
import List from './list';
import Comment from './comment';
import Replay from './replay';
import ImportTask from 'widgets/importTask/index';
export default {
  name: 'comment',
  components: {
    List,
    Comment,
    Replay,
    ImportTask
  },

  data: () => ({
    contentInfo: '',
    viewType: 'list',
    prevView: ''
  }),
  methods: {
    change(value) {
      this.prevView = this.viewType;
      this.viewType = value;
    },
    close(option) {
      this.viewType = this.prevView;
    }
  }
}
</script>
