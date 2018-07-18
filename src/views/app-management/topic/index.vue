<style scoped></style>
<template>
  <div id="idx">
    <List @change-view="changeView" v-if="viewType == 'list'" v-model="id" />
    <Add @change-view="changeView" v-if="viewType == 'add'" :channelId="id"  />
    <Display @change-view="changeView" v-if="viewType == 'display'" :channel="id"/>
    <ExReview v-if="viewType == 'exreview'" @change-view="changeView" :channelId="id"/>
    <ContentList v-if="viewType == 'contentList'" @change-view="changeView" v-model="item" :channel="id" />
    <EditContent v-if="viewType == 'editContent'" @change-view="changeView" :contentItem="item" />
    <Review v-if="viewType == 'review'" @change-view="changeView" :channelId="id"/>
    <ColumnList v-if="viewType== 'columnlist'" @change-view="changeView" v-model="item" :channel="id"></ColumnList>
    <sn-toptip></sn-toptip>
  </div>
</template>
<script>
import ColumnList from './columnList';//栏目列表页
import Add from './add'; //添加专题
import List from './list'; //专题列表页
import Display from './display'; //展示管理
import ExReview from '../../common/exempt_review'; //通用免审页面
import ContentList from './contentList'; //展示管理
import EditContent from './editContent'; //编辑内容
import Review from '../../info-management/review/index'; //审核
export default {
  data() {
    return {
      columnList:[],
      viewType: 'list',
      id: '',
      item: {}
    }
  },
  components: {
    ColumnList,
    Add,
    List,
    ExReview,
    Display,
    ContentList,
    EditContent,
    Review
  },
  methods: {
    changeView(value) {
      this.viewType = value;
    }
  }
}
</script>
