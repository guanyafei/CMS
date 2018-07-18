<template>
  <div>
    <sn-form-item label='关联内容' prop='relNewsId'>
      <div class='content-tip mt-5 mb-10'>关联内容为阅读完文章后推荐读者继续阅读的其他文章，最多选择一条关联内容</div>
      <template v-if='ruleForm.relNewsId'>
        <div class='is-column'>
          <div class='opt is-line'>
            <div class='info'>
              <span>{{`内容ID：${ruleForm.relNewsId}`}}</span>
              <span>{{`内容标题：${ruleForm.relNewsName}`}}</span>
            </div>
            <span class='edit opt-txt' @click='openLinkContentConfirm'>修改</span>
            <span class='del opt-txt' @click.stop='delLinkContent'>删除</span>
          </div>
        </div>
      </template>
      <sn-button type='primary' @click='openLinkContentConfirm' v-else>添加关联内容</sn-button>
    </sn-form-item>
    <sn-confirm v-if="viewType=='content'" title='添加关联内容' @close='close' @sure='addLinkContent' confirmButtonText='添加' noflag close-icon>
      <div class="modal-body">
        <sn-input
          v-model='relContentInput'
          width='100%'
          placeholder='请输入关联内容ID或标题以快速查询'
        >
          <sn-button slot="append" type="primary" :circle="false" @click="queryLinkContentList">搜索</sn-button>
        </sn-input>
        <sn-table :data='linkContentList' class="content-modal__table" theme="dialog" :scroll-loading="true" height='350' @tbody-scroll="onLinkTableScroll">
          <sn-table-column width='10%' sloted wall="false">
            <template slot-scope='row'>
              <sn-radio :label='row.newsId' v-model='selectedRelContentId'></sn-radio>
            </template>
          </sn-table-column>
          <sn-table-column label='内容ID' prop='newsId' width='40%'>
          </sn-table-column>
          <sn-table-column label='内容标题' prop='title'>
          </sn-table-column>
        </sn-table>
      </div>
    </sn-confirm>
  </div>
</template>
<script>
import DI from 'interface'
export default {
  name: 'CrawlerLinkContent',
  componentName: 'CrawlerLinkContent',
  props: ['ruleForm', 'data'],
  data () {
    return {
      titleText: '资讯标题',
      viewType: null,
      total: 0,
      linkPageIndex: 0, // 查出关联页码参数
      linkContentList: [],// 查出关联内容列表
      relContentInput: '',// 关联内容input值
      selectedRelContentId: '',// 选中关联内容id
    }
  },
  methods: {
    onLinkTableScroll () {
      this.linkNewsDataLoading = true;
      if (this.total < this.linkPageIndex + 10) {
        this.$message.success('数据已加载完毕！');
        return;
      }
      this.linkPageIndex += 10;

      this.$ajax({
        url: DI.reptile.fetchLinkContentList,
        context: this,
        data: JSON.stringify({
          param: this.relContentInput,
          pageIndex: this.linkPageIndex,
          pageSize: 10
        }),
        success: (res) => {
          if (res.retCode == "0") {
            const data = res.data;
            this.total = data.relNum || 0;
            this.linkContentList.push(...(data.relList || []));
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    queryLinkContentList (num = 1) {
      this.linkPageIndex = 0;
      let ajaxData = {
        pageSize: 10,
        pageIndex: this.linkPageIndex
      };

      if (this.relContentInput) {
        ajaxData.param = this.relContentInput;
      }

      this.$ajax({
        url: DI.reptile.fetchLinkContentList,
        context: this,
        data: JSON.stringify(ajaxData),
        success: (res) => {
          if (res.retCode == "0") {
            const data = res.data;
            this.linkContentList = data.relList;
            this.total = data.relNum || 0;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    addLinkContent () {
      if (!this.selectedRelContentId) {
        this.$message.warning('请选择一条关联内容！');
        return;
      }
      let selectedContentItem = this.linkContentList.find((content) => {
        return content.newsId == this.selectedRelContentId;
      })

      this.selectedRelContentId = '';
      this.ruleForm.relNewsId = selectedContentItem.newsId;
      this.ruleForm.relNewsName = selectedContentItem.title;

      this.viewType = null;
    },
    openLinkContentConfirm () {
      this.selectedRelContentId = this.ruleForm.relNewsId;
      this.viewType = 'content';
      this.$nextTick(() => {
        this.queryLinkContentList();
      })
    },
    delLinkContent () {
      this.$set(this.ruleForm, 'relNewsId', '')
      this.$set(this.ruleForm, 'relTitle', '')
      this.$set(this.ruleForm, 'relNewsName', '')
    },
    close () {
      this.viewType = null;
      this.relContentInput = '';
      this.selectedRelContentId = '';
      this.linkContentList = [];
    },
  }
}
</script>
<style scoped>
.content-tip {
  background-image: url(../../../../../assets/icon-warning.png);
  background-repeat: no-repeat;
  padding-left: 22px;
  height: 20px;
  background-position-y: 1px;
  line-height: 20px;
}

.is-column {
  color: #A8ADBC;
  .opt {
    margin-top: 20px;
    .info {
      border: 1px solid #09BBFE;
      padding: 9px 20px;
      border-radius: 5px;
      background: #F0FBFF;
      display: flex;
      justify-content: space-between;
      width: 55%;
    }
    .opt-txt {
      color: #09BBFE;
      margin-left: 10px;
      padding-left: 20px;
      background-repeat: no-repeat;
      height: 20px;
      line-height: 20px;
      cursor: pointer;
      background-position-y: 3px;
      &.edit {
        background-image: url(../../../../../assets/icon-edit-small.png);
      }
      &.del {
        background-image: url(../../../../../assets/icon-del-small.png);
      }
    }
  }
}

.modal-body {
  width: 650px;
  .content-modal__table {
    margin-top: 20px;
  }
}
</style>
