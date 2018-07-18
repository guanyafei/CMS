<template>
  <div>
    <div>{{ `${contentType}: ${commentId ? commentId : row.commTitleId}` }}</div>
    <sn-td-ellipsis :str="commentId ? row.commentContent : row.commTitle" class="mt-5"></sn-td-ellipsis>
  </div>
</template>

<script>
import * as Constant from 'js/constant'
export default {
  name: 'ColumnTarget',
  props: ['row'],
  computed: {
    contentItem () {
      return Constant.getItemByValue(Constant.COMMENT_CONTENT_TYPE, this.row.commTitleType);
    },
    commentId () {
      return this.row.commentId;
    },
    contentType () {
      if (this.commentId) {
        return '评论';
      } else if (this.contentItem.key === 'info') {
        return Constant.getItemByValue(Constant.ARTICLE_TYPE, this.row.newsType).name || '资讯';
      } else {
        return this.contentItem.name;
      }
    }
  }
}
</script>

<style scoped>

</style>
