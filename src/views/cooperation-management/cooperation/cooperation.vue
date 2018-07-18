<template>
  <div>
    <Crumb ref="crumb"></Crumb>
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
  name: 'cooperation',

  components: {
    Crumb,
    List
  },

  data: () => ({
    list: [],
    total: 0
  }),

  mounted() {
    this.queryList();
  },

  methods: {
    goto(num) {
      this.queryList(num);
    },

    queryList(pageNo = 1) {
      let { startTime, endTime, newsId, title, authorId, newsType, labelName, status, pushStatus } = this.$refs.crumb;
      const pageSize = 20;
      let pageIndex = (pageNo - 1) * pageSize;

      if (newsType === -1) {
        newsType = '';
      }

      if (status === -1) {
        status = '';
      }

      if (pushStatus === -1) {
        pushStatus = '';
      }

      let ajaxData = {
        startTime,
        endTime,
        newsId,
        labelName,
        title,
        authorId,
        newsType,
        status,
        pushStatus
      };
      ajaxData = this.$bus.deleteNullProperty(ajaxData);

      this.$ajax({
        url: DI.cooperation.queryList,
        data: JSON.stringify({
          pageIndex,
          pageSize,
          ...ajaxData
        }),
        context: this,
        loadingText: '正在查询资讯列表，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            document.body.scrollTop = 0;
            this.$bus.$emit('syncCurPage', pageNo);
            this.$bus.$emit('cooperation-uncheckAll');

            const data = res.data || {};
            this.list = [...(data.newsList || [])];
            this.total = data.newsNum || 0;
          } else {
            this.$message.error(res.retMsg);
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
