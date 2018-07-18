<template>
  <div>
    <Crumb ref="crumb" :selectedChannelId="selectedChannelId"></Crumb>
    <div class="list">
      <List ref="list" :list="list"></List>
      <sn-pagination ref="pagination" :total="total" @goto="goto" :size="20"></sn-pagination>
    </div>
    <sn-tips></sn-tips>
  </div>
</template>
<script>
import DI from 'interface';
import Crumb from './crumb';
import List from './list';
export default {
  name: 'comment',
  props: {
    selectedChannelId: {
      type: [String, Number],
      default: ''
    }
  },
  components: {
    Crumb,
    List
  },
  data: () => ({
    channelList: [],
    list: [],
    total: 0
  }),
  methods: {
    goto(num) {
      this.queryList(num);
    },
    queryList(pageNo = 1) {
      if (this.$refs.crumb.channelList.length == 0) {
        this.$message.warning('频道列表数据为空，无法查询审核列表！');
        return;
      }
      let { startTime, endTime, channelId, contentId, contentTitle, authorId, newsType, sourceType, level, authorType, infoFlowId } = this.$refs.crumb;
      const pageSize = 20;
      let pageIndex = (pageNo - 1) * pageSize;

      if (newsType === -1) {
        newsType = '';
      }

      if (sourceType === -1) {
        sourceType = '';
      }

      if (level === -1) {
        level = '';
      }
      if (authorType === -1) {
        authorType = '';
      }
      let ajaxData = { startTime, endTime, channelId, contentId, contentTitle, authorId, newsType, sourceType, level, authorType, infoFlowId };
      ajaxData.channelId = ajaxData.infoFlowId;
      delete ajaxData.infoFlowId;
      ajaxData = this.$bus.deleteNullProperty(ajaxData);

      this.$ajax({
        url: DI.infoReview.list,
        data: JSON.stringify({
          pageIndex,
          pageSize,
          ...ajaxData
        }),
        context: this,
        loadingText: '正在查询审核列表，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            document.body.scrollTop = 0;
            this.$bus.$emit('syncCurPage', pageNo);
            this.$bus.$emit('review-uncheckAll');

            const data = res.data || {};
            this.list = data.channelContentList || [];
            this.total = data.channelContentNum || 0;
          }
        },
        error: () => {
          console.log('error');
        }
      });
    }
  }
};
</script>

<style scoped>
.list {
  background-color: #ffffff;
  margin-top: 20px;
  padding-bottom: 20px;
}
</style>
