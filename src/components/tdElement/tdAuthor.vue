<template>
  <div>
    <div class="is-line">
      <span>id:</span>
      <span class="author-id" :title="row.authorId">{{row.authorId}}</span>
    </div>
    <p>{{row.authorName}}</p>
    <p v-if="!authorType">{{getItemSettleName(row.settleType)}}</p>
    <p v-if="!authorType">{{getItemShowName(row.showType)}}</p>
    <p v-if="authorType">{{getItemAuthorName(row.authorType)}}</p>
    <div v-if="fakeAuthor && row.source && row.sourceDetailType == 3" class="is-line mt-5">
      <span>外约:</span>
      <span class="ellipsis fake-name" :title="row.source">{{row.source}}</span>
    </div>
  </div>
</template>

<script>
import * as Constant from 'js/constant'

export default {
  name: 'name',
  props: {
    'row': Object,
    'authorType': {
      type: Boolean,
      default: false
    },
    fakeAuthor: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getItemSettleName (val) {
      return Constant.getItemByValue(Constant.SETTLE_TYPE, val).name;
    },
    getItemShowName (val) {
      return Constant.getItemByValue(Constant.SHOW_TYPE, val).name;
    },
    getItemAuthorName (val) {
      return Constant.getItemByValue(Constant.AUTHOR_TYPE, val).name;
    }
  }
}
</script>

<style scoped>
  p:not(first-of-type) {
    margin-top: 3px;
  }
  .author-id,
  .fake-name {
    width: 80px;
    text-align: left;
  }
.author-id{
  justify-content: space-between;
}
</style>
