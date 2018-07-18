<template>
  <div>
    <button @click.stop="viewType=true" v-if="showButton">重新执行</button>
    <sn-confirm v-if="viewType" :title="重新执行" @close='close' @sure='submit()' txt noflag>
      确认重新执行吗?
    </sn-confirm>
  </div>
</template>

<script>
import * as Constant from 'js/constant'
import DI from 'interface'
export default {
  name: 'ColumnRerun',
  props: ['row'],
  data() {
    return {
      viewType: null
    }
  },
  computed: {
    showButton () {
      return Constant.getItemByValue(Constant.IMPORT_COMMENT_STATUS, this.row.taskStatus).key === 'failed';
    }
  },
  methods: {
    close () {
      this.viewType = null;
    },
    submit () {
      this.viewType = null;
      this.$ajax({
        url: DI.commentImport.rerun,
        context: this,
        loadingText: '正在重新执行灌水任务，请稍候！',
        data: JSON.stringify({
          commImportTaskId: this.row.commImportTaskId
        }),
        success: (res) => {
          if (res.retCode == "0") {
            this.row.taskStatus = Constant.getItemByKey(Constant.IMPORT_COMMENT_STATUS, "dong").value;
          } else {
            this.viewType = true;
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
button {
  color: #0ABBFE;
}
</style>
