<template>
  <div>
    <div>{{ `${contentType}: ${row.commTitleId}` }}</div>
    <sn-td-ellipsis :str="row.commTitle" class="mt-5"></sn-td-ellipsis>
  </div>
</template>

<script>
import * as Constant from 'js/constant'
export default {
  name: 'ColumnInfo',
  props: ['row'],
  computed: {
    contentItem () {
      return Constant.getItemByValue(Constant.COMMENT_CONTENT_TYPE, this.row.commTitleType);
    },
    contentType () {
      if (this.contentItem.key === 'info') {
        let infoName = Constant.getItemByValue(Constant.ARTICLE_TYPE, this.row.newsType).name;
        return infoName ?  `${infoName}资讯` : '资讯';
      } else {
        return this.contentItem.name;
      }
    }
  }
}
</script>

<style scoped>

</style>
