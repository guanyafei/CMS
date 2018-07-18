<template>
  <div>
    <span>{{`${row.commCount}条`}}</span>
    <button class="column-btn--detail mt-5" @click="openDetailDailog">查看详情</button>
    <sn-confirm
      v-if="viewType"
      title="灌水内容"
      @close="close"
      noflag
      closeIcon
      :sureBtnIsShow="false"
      hideCancelButton>
      <div class="modal-body">
        <sn-table :data="list" ref="table">
          <sn-table-column label="序号" width="20%" prop="$index" sloted>
            <template slot-scope="row">
              {{ row.curPageNo + row.$index + 1 }}
            </template>
          </sn-table-column>
          <sn-table-column label="评论内容" prop="commContent"></sn-table-column>
        </sn-table>
        <sn-pagination ref="pagination" :total="total" @goto="goto" :size="20"></sn-pagination>
      </div>
    </sn-confirm>
  </div>
</template>

<script>
import DI from 'interface'

export default {
  name: 'ColumnDetail',
  props: ['row'],
  data() {
    return {
      list: [],
      total: 0,
      viewType: null
    }
  },
  methods: {
    openDetailDailog () {
      this.viewType = true;
      this.queryImportList();
    },
    close () {
      this.viewType = null;
    },
    goto (num) {
      this.queryImportList(num)
    },
    queryImportList (pageNo = 1) {
      let pageSize = 20;
      let { commImportTaskId } = this.row;
      this.$ajax({
        url: DI.commentImport.queryImportDetail,
        now: (new Date()).valueOf(),
        context: this,
        loadingText: '正在查询灌水详情，请稍候！',
        data: JSON.stringify({
          commImportTaskId,
          pageNo,
          pageSize
        }),
        success: (res) => {
          if (res.retCode == "0") {
            let data = res.data;
            let importList = (data.commentList || []).map(row => {
              row.curPageNo = (pageNo-1) * pageSize;
              return row;
            });
            this.list = importList;
            this.total = data.commentListCount;
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          this.viewType = true;
          console.log("error");
        }
      });
    }
  }
}
</script>

<style scoped>
.column-btn--detail {
  display: block;
  color: #f88a6f;
}
.modal-body {
  width: 800px;
}
</style>
