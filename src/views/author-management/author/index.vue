<template>
  <div id='idx'>
    <sn-topbar title='作者库' v-if="viewType == 'list'"/>
    <Crumb ref='crumb' v-if="viewType == 'list'" />
    <div class='list' v-if="viewType == 'list'">
      <List ref='list' :list='list' v-model="choseInfo" @change-view="changeView"/>
      <sn-pagination ref='pagination' :pageIndex='pageNum' :total='total' @goto='goto' />
    </div>
    <FansList v-if="viewType == 'fansList'" ref='fansList' @change-view="changeView" :choseInfo="choseInfo"/>
    <sn-toptip></sn-toptip>
  </div>
</template>

<script>
import DI from 'interface'
import Crumb from './crumb'
import FansList from './fansList'
import List from './list'
export default {
  name: 'user',
  components: {
    Crumb,
    List,
    FansList
  },
  data: () => ({
    viewType: 'list',
    list: [],
    total: 0,
    choseInfo: '',
    pageNum: 1
  }),
  mounted() {
    this.queryList();
  },
  methods: {
    goto(num) {
      if (num) {
        this.pageNum = num;
      }
      this.queryList(num);
    },
    changeView(value) {
      this.viewType = value;
    },
    queryList(pageNo = this.pageNum) {
      let { startTime,
        endTime,
        authorId,
        authorName,
        authorType,
        status,
        settleType,
        showType } = this.$refs.crumb,
        pageSize = 10;

      if (authorType === -1) {
        authorType = '';
      }

      if (status === -1) {
        status = '';
      }

      if (settleType === -1) {
        settleType = '';
      }

      if (showType === -1) {
        showType = '';
      }
      let ajaxData = {
        startTime,
        endTime,
        authorId,
        authorName,
        authorType,
        status,
        settleType,
        showType
      };

      ajaxData = this.$bus.deleteNullProperty(ajaxData);
      this.$ajax({
        url: DI.authorLibrary.list,
        data: JSON.stringify({
          pageIndex: (pageNo - 1) * pageSize,
          pageSize,
          ...ajaxData
        }),
        context: this,
        loadingText: '正在加载作者列表，请稍候！',
        success: (res) => {
          if (res.retCode == '0') {
            document.body.scrollTop = 0;
            this.$bus.$emit('syncCurPage', pageNo);
            let data = res.data || {};
            this.list = data.authorList || [];
            this.total = data.authorListNum || 0;
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

}
</script>

<style scoped>
.list {
  background-color: #FFFFFF;
  margin-top: 20px;
  padding-bottom: 20px;
}
</style>
