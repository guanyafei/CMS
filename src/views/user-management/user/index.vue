<template>
  <div id='idx'>
    <sn-topbar title='用户管理'></sn-topbar>
    <Crumb ref='crumb'></Crumb>
    <div class='list'>
      <List ref='list' :list='list'></List>
      <sn-pagination ref='pagination' :total='total' @goto='goto' :size="20"></sn-pagination>
    </div>
  </div>
</template>

<script>
import DI from 'interface'
import Crumb from './crumb'
import List from './list'
export default {
  name: 'user',

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
      this.queryList(num)
    },

    queryList(pageNo = 1) {
      let { startTime,
        endTime,
        resource,
        pptvUserId,
        userLabel,
        flag } = this.$refs.crumb,
        pageSize = 20;

      if (resource === -1) {
        resource = '';
      }

      if (flag === -1) {
        flag = '';
      }

      let ajaxData = {
        startTime,
        endTime,
        resource,
        pptvUserId,
        userLabel,
        flag
      };

      ajaxData = this.$bus.deleteNullProperty(ajaxData);

      this.$ajax({
        url: DI.user.list,
        data: JSON.stringify({
          pageIndex: (pageNo - 1) * pageSize,
          pageSize,
          ...ajaxData
        }),
        loadingText: '正在加载用户列表，请稍候！',
        context: this,
        success: (res) => {
          if (res.retCode == '0') {
            document.body.scrollTop = 0;
            this.$bus.$emit('syncCurPage', pageNo);
            let data = res.data || {};
            this.list = data.list || [];
            this.total = data.listNum || 0;
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
