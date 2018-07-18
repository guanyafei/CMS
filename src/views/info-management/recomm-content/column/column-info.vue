<template>
  <div>
    <div>{{ `${contentType}: ${row.contentId}` }}</div>
    <sn-td-ellipsis :str="row.contentTitle" class="mt-5"></sn-td-ellipsis>
  </div>
</template>

<script>
import * as Constant from 'js/constant'
export default {
  name: 'ColumnInfo',
  props: ['row'],
  computed: {
    contentType () {
      return Constant.getItemByValue(Constant.LIST_RECOMM_CONTENT_TYPE, this.row.contentType).name;
    }
  }
}
</script>

<style scoped>

</style>
