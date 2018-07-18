<template>
  <div>
    <sn-topbar title="内容列表"></sn-topbar>
    <Crumb ref="crumb"></Crumb>
    <div class="list">
      <List ref="list" :list="list"></List>
      <sn-pagination ref="pagination" :total="total" @goto="goto" :size="20"></sn-pagination>
    </div>
  </div>
</template>

<script>
import DI from 'interface'
import Crumb from './crumb'
import List from './list'

export default {
  name: 'Import',
  components: {
    Crumb,
    List
  },
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.queryList();
  },
  methods: {
    goto (num) {
      this.queryList(num)
    },

    queryList (pageNo = 1) {
      let pageSize = 20;

      this.$ajax({
        url: DI.commentImport.list,
        data: JSON.stringify({
          pageNo,
          pageSize
        }),
        context: this,
        loadingText: '正在查询评论内容列表，请稍候！',
        success: (res) => {
          if (res.retCode == "0") {
            const data = res.data;
            this.$bus.$emit("syncCurPage", pageNo);
            document.body.scrollTop = 0;
            this.list = data.taskList || [];
            this.total = data.taskListCount || 0;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    }
  }

}
</script>

<style scoped>

</style>
