<template>
  <div>
    {{ statusObj.name }}
  </div>
</template>

<script>
import * as Constant from 'js/constant'
export default {
  name: 'ColumnStatus',
  props: ['row'],
  computed: {
    statusObj () {
      return Constant.getItemByValue(Constant.IMPORT_COMMENT_STATUS, this.row.taskStatus);
    }
  }

}
</script>

<style scoped>

</style>
