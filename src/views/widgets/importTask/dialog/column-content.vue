<template>
  <div v-clickoutside="hide" v-key="row.id">
    <sn-input
      ref="content"
      v-model="row.commContent"
      type="textarea"
      v-if="edit"
      @blur="onblur"
      width="160"
      totalWords="500"
      autoValid
      required
      showWord></sn-input>
    <div class="content-edit" v-else>
      <sn-td-ellipsis :str="row.commContent"></sn-td-ellipsis>
      <edit-button :edit.sync="edit"></edit-button>
    </div>
  </div>
</template>

<script>
import Clickoutside from 'directives/clickoutside';
import EditButton from './edit-button';
export default {
  name: 'ColumnContent',
  directives: { Clickoutside },
  components: {
    EditButton
  },
  props: ['row'],
  data () {
    return {
      edit: false
    }
  },
  methods: {
    onblur (event, valid) {
      if (valid) {
        this.edit = false;
      }
    },
    hide () {
      if (!this.$refs.content || this.$refs.content.check()) {
        this.edit = false;
      }
    }
  }
}
</script>

<style scoped>
.content-edit {
  display: flex;
  align-items: flex-start;
}
</style>
