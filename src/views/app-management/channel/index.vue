<style scoped></style>
<template>
  <div id="idx">
    <List v-if="viewType == 'list'" @change-view="change" ref='channelList' v-model="channelInfo" />
    <Edit v-if="viewType == 'edit'" @change-view="change" :channel="channelInfo" />
    <Add v-if="viewType == 'add'" @change-view="change" />
    <Rdisplay v-if="viewType == 'rdisplay'" @change-view="change" :channel="channelInfo" />
    <Vdisplay v-if="viewType == 'vdisplay'" @change-view="change" :channel="channelInfo" />
    <Review v-if="viewType == 'review'" :channelId="channelInfo" />
    <ExReview v-if="viewType == 'exreview'" :channelId="channelInfo" />
    <ContentList v-if="viewType == 'contentList'" @change-view="change" v-model="item" :channel="channelInfo" />
    <EditContent v-if="viewType == 'editContent'" @change-view="change" :contentItem="item" />
    <sn-toptip></sn-toptip>
  </div>
</template>
<script>
import Add from './add'; //创建频道
import Edit from './edit'; //编辑频道
import List from './list'; //频道列表页
import Rdisplay from './widgets/display/rdisplay'; //推荐频道展示管理
import Vdisplay from './widgets/display/vdisplay'; //视频频道展示管理
import ExReview from '../../common/exempt_review'; //通用免审页面
import Review from '../../info-management/review/index'; //审核页面
import ContentList from './widgets/content/contentList'; //内容管理
import EditContent from './widgets/content/editContent'; //编辑内容

  export default {
    data() {
      return {
        viewType: 'list',
        id: '',
        item: {},
        channelInfo: {}
      }
    },
    components: {
      Add,
      Edit,
      List,
      Rdisplay,
      Vdisplay,
      ExReview,
      Review,
      ContentList,
      EditContent
    },
    methods: {
      change(value) {
        this.viewType = value;
      }
    }
  }
</script>
