<template>
  <div v-clickoutside="hide">
    <sn-input v-model="row.likeNum" inputType="number" v-if="edit" @blur="edit=false" width="140" maxlength="8"></sn-input>
    <div class="num-edit" v-else>
      <div>{{row.likeNum || '随机'}}</div>
      <edit-button :edit.sync="edit"></edit-button>
    </div>
  </div>
</template>

<script>
import EditButton from './edit-button';
import Clickoutside from 'directives/clickoutside';
export default {
  name: 'ColumnLikenum',
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
    hide () {
      this.edit = false;
    }
  }
}
</script>

<style scoped>
.num-edit {
  display: flex;
  align-items: flex-start;
}
</style>
