<template>
  <div>
    <sn-form-item label="关联内容" prop="relNewsId">
      <div class="content-tip mt-5 mb-10">关联内容为阅读完文章后推荐读者继续阅读的其他文章，最多选择一条关联内容</div>
      <template v-if="ruleForm.relNewsId">
        <div class="is-column">
          <div class="opt is-line">
            <div class="info">
              <span>{{`内容ID：${ruleForm.relNewsId}`}}</span>
              <span>{{`内容标题：${ruleForm.relNewsName}`}}</span>
            </div>
            <span class="edit opt-txt" @click="openLinkContentConfirm">修改</span>
            <span class="del opt-txt" @click.stop="delLinkContent">删除</span>
          </div>
        </div>
      </template>
      <sn-button v-else type="primary" @click="openLinkContentConfirm" :disabled="!ruleForm.authorId">添加关联内容</sn-button>
    </sn-form-item>

    <sn-confirm
      v-if="viewType=='content'"
      title="添加关联内容"
      @close="close"
      @sure="addLinkContent"
      confirmButtonText="添加"
      close-icon
      noflag
    >
      <div class="modal-body">
        <sn-input
          v-model="submitData.param"
          width="100%"
          :height="34"
          placeholder="请输入关联内容ID或标题以快速查询"
          class="link__search"
        >
          <sn-select
            slot="prepend"
            ref="type"
            v-model="submitData.type"
            width="105"
            placeholder="请选择"
            @change="handleTypeChange">
            <sn-option v-for="item in typeList"
              :key="item.key"
              :name="item.name"
              :value="item.value">
            </sn-option>
          </sn-select>
          <sn-button
            slot="append"
            type="primary"
            :circle="false"
            @click="fetchContentList"
            class="link-search__button"
          >搜索</sn-button>
        </sn-input>
        <sn-table :data="linkContentList" theme="dialog" :scroll-loading="true" height="350" @tbody-scroll="onLinkTableScroll">
          <sn-table-column width="10%" sloted wall="false">
            <template slot-scope="row">
              <sn-radio :label="row.newsId" v-model="selectedRelContentId"></sn-radio>
            </template>
          </sn-table-column>
          <sn-table-column label="内容ID" prop="newsId" width="40%">
          </sn-table-column>
          <sn-table-column label="内容标题" prop="title">
          </sn-table-column>
        </sn-table>
      </div>
    </sn-confirm>
  </div>
</template>
<script>
import DI from 'interface';
import * as Constant from 'js/constant';

export default {
  name: 'LinkContent',
  componentName: 'LinkContent',
  props: ['ruleForm'],
  data() {
    return {
      titleText: '资讯标题',
      viewType: null,
      linkContentList: [], // 查出关联内容列表
      selectedRelContentId: '', // 选中关联内容id
      typeList: Constant.QUERY_INFO_TYPES,
      total: 0,
      submitData: {
        authorId: this.ruleForm.authorId,
        pageIndex: 0,
        pageSize: 10,
        param: '', // 关联内容input值
        type: true
      }
    };
  },
  watch: {
    relContentInput(newVal) {
      if (this.viewType == null) {
        return;
      }
    },

    'ruleForm.authorId'(newVal) {
      this.submitData.authorId = newVal;
    }
  },
  methods: {
    onLinkTableScroll() {
      if (this.total < this.submitData.pageIndex + 10) {
        this.$message.success('数据已加载完毕！');
        return;
      }
      this.submitData.pageIndex += 10;
      this.fetchContentList(true);
    },
    /**
     * @params type:Boolean 是否为滚动加载
     */
    fetchContentList(type = false) {
      let { submitData } = this;
      if (!submitData.authorId) {
        this.$message.warning('请先选择一个资讯作者！');
        return;
      }
      if (!type) {
        submitData.pageIndex = 0;
      }

      this.$ajax({
        url: DI.infoLibrary.getContentList,
        context: this,
        data: JSON.stringify(submitData),
        success: res => {
          if (res.retCode == '0') {
            const data = res.data;
            this.total = data.count || 0;
            if (type) {
              this.linkContentList.push(...(data.relList || []));
            } else {
              this.linkContentList = data.relList || [];
            }
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    addLinkContent() {
      if (!this.selectedRelContentId) {
        this.$message.warning('请选择一条关联内容！');
        return;
      }
      let selectedContentItem = this.linkContentList.find(content => {
        return content.newsId == this.selectedRelContentId;
      });

      this.selectedRelContentId = '';
      this.ruleForm.relNewsId = selectedContentItem.newsId;
      this.ruleForm.relNewsName = selectedContentItem.title;

      this.viewType = null;
    },
    openLinkContentConfirm() {
      this.selectedRelContentId = this.ruleForm.relNewsId;
      this.viewType = 'content';
      this.fetchContentList();
    },
    delLinkContent() {
      this.$set(this.ruleForm, 'relNewsId', '');
      this.$set(this.ruleForm, 'relTitle', '');
      this.$set(this.ruleForm, 'relNewsName', '');
    },
    handleTypeChange(val) {
      this.submitData.type = val;
    },
    close() {
      this.viewType = null;
      this.relContentInput = '';
      this.selectedRelContentId = '';
      this.submitData = {
        authorId: this.ruleForm.authorId,
        pageIndex: 0,
        pageSize: 10,
        param: '', // 关联内容input值
        type: true
      };
    }
  }
};
</script>
<style scoped>
.content-tip {
  height: 20px;
  padding-left: 22px;
  line-height: 20px;
  background-image: url(../../../../../assets/icon-warning.png);
  background-repeat: no-repeat;
  background-position-y: 1px;
}
.is-column {
  color: #a8adbc;
  .opt {
    .info {
      display: flex;
      justify-content: space-between;
      width: 55%;
      padding: 9px 20px;
      border: 1px solid #09bbfe;
      border-radius: 5px;
      background: #f0fbff;
    }
    .opt-txt {
      height: 20px;
      padding-left: 20px;
      margin-left: 10px;
      line-height: 20px;
      color: #09bbfe;
      cursor: pointer;
      background-repeat: no-repeat;
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
  width: 600px;
  .link__search {
    margin-bottom: 20px;
  }
  .link-search__button {
    height: 32px;
  }
}
</style>
