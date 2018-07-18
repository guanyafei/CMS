<style scoped></style>
<template>
  <div id="idx">
    <List v-if="viewType == 'list'" @change-view="change" ref='list' v-model="infoFlowInfo" />
    <Add :infoFlow="infoFlowInfo" ref="add" />
    <!--<Edit v-if="viewType == 'edit'" :channelId="channelInfo" />-->
    <Review v-if="viewType == 'review'" :channelId="infoFlowInfo.infoFlowId" />
    <ExReview v-if="viewType == 'exreview'" :channelId="infoFlowInfo.infoFlowId" />
    <ContentList v-if="viewType == 'contentList'" @change-view="change" v-model="item" :channel="infoFlowInfo"/>
    <EditContent v-if="viewType == 'editContent'" @change-view="change" :contentItem="item" />
    <ColumnList v-if="viewType== 'columnlist'" @change-view="change" v-model="item" :channel="infoFlowInfo"></ColumnList>
    <TopicContentList v-if="viewType == 'topicContentList'" @change-view="change" v-model="item" :channel="infoFlowInfo"/>
    <TopicEditContent v-if="viewType == 'topicEditContent'" @change-view="change" :contentItem="item"/>
  </div>
</template>
<script>
  import List from './list'; //信息流列表页
  import Add from './add'; //新建信息流弹窗
  // import Edit from './edit'; //编辑信息流页面
  import Review from '../../info-management/review/index'; // 审核页面
  import ExReview from '../../common/exempt_review'; // 通用免审页面
  import ContentList from './widgets/content/contentList'; //内容页面
  import EditContent from './widgets/content/editContent'; //编辑内容
  import ColumnList from '../../app-management/topic/columnList';//栏目列表页
  import TopicContentList from './widgets/content/topicContentList'; //专题内容页面
  import TopicEditContent from './widgets/content/topicEditContent'; //专题内容页面

  export default {
    data() {
      return {
        viewType: 'list',
        dialogType: '',
        id: '',
        item: {},
        infoFlowInfo: {},
      }
    },
    components: {
      List,
      Add,
      // Edit,
      Review,
      ExReview,
      ContentList,
      EditContent,
      ColumnList,
      TopicContentList,
      TopicEditContent
    },
    watch: {
      infoFlowInfo(newVal, oldVal) {
        if (newVal) {
          newVal.channelId = newVal.infoFlowId;
        }
      }
    },
    methods: {
      /**
       * 打开对应弹窗
       * @param value
       */
      change(value) {
        //新建信息流弹窗
        if (value == 'add' || value == 'edit') {
          if (value == 'add') this.$refs.add.infoFlow = {};
          this.$refs.add.showFlag = true;
          this.dialogType = value;
        } else {
          this.$refs.add.showFlag = false;
          this.dialogType = '';
          this.viewType = value;
        }
      }
    }
  }
</script>
