<template>
  <sn-confirm v-if="isShow" title="待执行评论" @close="close" @sure="updateList" confirmButtonText="保存" noflag closeIcon>
    <div class="modal-body">
      <div class="comment-edit__header">
        <div>
          <button class="button--check" @click="toggle(checkAll)">{{ checkAll ? "取消全选" : "全选" }}</button>
          <button class="button--del" @click="batchDel">删除</button>
        </div>
        <div>
          <sn-button type="primary" :circle="false" :gutter="2" @click="onImportClick">导入本地模板</sn-button>
          <input type="file" name="file" ref="fileInput" @change="fileInputChangeHandler" :style="{display:'none'}">
          <sn-button type="outline" :circle="false" :gutter="2" @click="openCrawlerDialog">从爬虫库选择</sn-button>
          <sn-button :circle="false" :gutter="2" @click="downloadTemplate">模板下载</sn-button>
        </div>
      </div>
      <sn-table :data="curList">
        <sn-table-column width="40" wall="false" tdPaddingRight="5" sloted>
          <template slot-scope="row">
            <sn-checkbox v-model="selecteds" :label="row" theme="radio">
            </sn-checkbox>
          </template>
        </sn-table-column>
        <sn-table-column label="序号" width="10%" prop="$index" sloted>
          <template slot-scope="row">
            {{ pageNo + row.$index + 1 }}
          </template>
        </sn-table-column>
        <sn-table-column label="评论内容" width="25%" prop="commContent" sloted>
          <template slot-scope="row">
            <column-content :row="row" :key="row.id"></column-content>
          </template>
        </sn-table-column>
        <sn-table-column label="点赞数" width="25%" prop="likeNum" sloted>
          <template slot-scope="row">
            <column-likenum :row="row"></column-likenum>
          </template>
        </sn-table-column>
        <sn-table-column label="来源" width="20%" prop="source" sloted>
          <template slot-scope="row">
            {{row.source || '模板导入'}}
          </template>
        </sn-table-column>
        <sn-table-column label="操作" sloted>
          <template slot-scope="row">
            <sn-button type="text" @click="delItem(row.$index)">删除</sn-button>
          </template>
        </sn-table-column>
      </sn-table>
      <sn-pagination :pageIndex.sync="pageIndex" :total="totalList.length" :size="20"></sn-pagination>
    </div>
    <edit-crawler-dialog :viewType.sync="crawlerView"></edit-crawler-dialog>
  </sn-confirm>
</template>

<script>
import DI from 'interface'
import EditCrawlerDialog from './editCrawlerDialog'
import ColumnLikenum from './column-likenum'
import ColumnContent from './column-content'

export default {
  name: 'EditComment',
  props: ['list', 'viewType'],
  components: {
    EditCrawlerDialog,
    ColumnContent,
    ColumnLikenum
  },
  data () {
    return {
      selecteds: [],
      pageIndex: 1,
      pageSize: 20,
      crawlerView: null,
      totalList: this.deepCopy(this.list)
    }
  },
  computed: {
    pageNo () {
      return (this.pageIndex - 1) * this.pageSize;
    },
    curList () {
      return this.totalList.slice(this.pageNo, this.pageNo + this.pageSize);
    },
    checkAll: {
      get () {
        return this.curList.length && this.curList.length === this.selecteds.length;
      },
      set (newValue) {
        if (newValue) {
          this.selecteds = this.curList;
        } else {
          this.selecteds = [];
        }
      }
    },
    isShow: {
      get () {
        return this.viewType;
      },
      set (newValue) {
        this.$emit('update:viewType', newValue);
      }
    }
  },
  watch: {
    pageIndex () {
      this.selecteds = [];
    }
  },
  methods: {
    deepCopy (list = []) {
      let result = []
      for (let i = 0; i < list.length; i++) {
        let element = list[i];
        result.push({
          ...element
        })
      }
      return result;
    },
    editLikenum (row) {
      row.edit = true;
    },
    openCrawlerDialog () {
      this.crawlerView = true;
    },
    toggle (type) {
      this.checkAll = !type;
    },
    close () {
      this.totalList = [...this.list];
      this.reset();
      this.isShow = null;
    },
    addCrawlerList (crawlerList) {
      let { totalList } = this;
      for (let index = 0; index < crawlerList.length; index++) {
        let element = crawlerList[index];
        if (totalList.indexOf(element) === -1) {
          totalList.push(element);
        }
      };
    },
    updateList () {
      let nullIndex = this.totalList.findIndex(n => !(n.commContent || '').trim());
      if (nullIndex > -1) {
        this.$message.warning(`评论内容不能为空，请检查第${nullIndex+1}条数据`);
        return;
      }

      let maxIndex = this.totalList.findIndex(n => (n.commContent || '').length > 500);
      if (maxIndex > -1) {
        this.$message.warning(`评论内容字数不能超过500个，请检查第${maxIndex+1}条数据`);
        return;
      }
      this.$emit('update:list', this.deepCopy(this.totalList));
      this.reset();
      this.isShow = null;
    },
    reset () {
      this.pageIndex = 1;
      this.selecteds = [];
    },
    batchDel () {
      let { selecteds, totalList } = this;
      if (selecteds.length === 0) {
        this.$message.warning('请至少选择一条评论');
        return;
      };

      for (let index = selecteds.length - 1; index > -1; index--) {
        let element = selecteds[index];
        let delIndex = totalList.indexOf(element);
        if (delIndex !== -1) {
          totalList.splice(delIndex, 1);
        }
      }
      this.selecteds = [];
    },
    delItem (curIndex) {
      let delIndex = this.pageNo + curIndex;
      this.totalList.splice(delIndex, 1);
    },
    downloadTemplate () {
      window.location.href = '/snsis-admin-web/importComment.xlsx';
    },
    onImportClick () {
      this.$refs.fileInput.click();
    },
    fileInputChangeHandler (event) {
      const files = event.target.files;
      if (files && files.length) {
        let file = files[0];
        if (/[^\.](\.xlsx?)$/i.test(file.name)) {
          let formData = new FormData();
          formData.append('excelFile', file);
          this.$ajax({
            url: DI.commentImport.uploadExcel,
            context: this,
            loadingText: '正在导入模板，请稍候。。。',
            processData: false,
            contentType: false,
            now: (new Date()).valueOf(),
            data: formData,
            success: (res) => {
              this.$refs.fileInput.value = '';
              if (res.retCode == "0") {
                let data = res.data || {};
                (data.commentList || []).map((item)=>{
                  item.excelType = true;
                })
                this.totalList = [...this.totalList, ...(data.commentList || [])];
              } else {
                this.$message.error(res.retMsg);;
              }
            },
            error: () => {
              console.log("error");
            }
          });
        } else {
          this.$refs.fileInput.value = '';
          this.$message.warning('请选择excel文件.');
        }
      }
    },
  }
}
</script>

<style scoped>
.modal-body {
  width: 800px;
}

.button--check {
  color: #09BBFE;
  padding-right: 30px;
}

.button--del {
  color: #f88a6f;
}

.comment-edit__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.sn-button:not(:last-child) {
  margin-right: 10px;
}
</style>
