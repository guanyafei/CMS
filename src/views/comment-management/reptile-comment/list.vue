<style scoped>
.container {
  .ibox {
    display: flex;
    align-items: center;
    min-height: 72px;
    padding: 0 20px;
    background: #fff;
    margin-bottom: 0;
    &.end {
      justify-content: flex-end;
    }
    &.between {
      justify-content: space-between;
    }
    &.p20 {
      padding-top: 20px;
      padding-bottom: 20px;
    }
    .search-box {
      .time-box {
        display: flex;
        align-items: center;
        height: 30px;
        font-size: 12px;
        color: #999999;
        margin-bottom: 20px;
        margin-top: 20px;
        .time-text {
          margin-right: 10px;
        }
        .split {
          margin: 0 8px;
        }
      }
      .input-box {
        display: flex;
        margin-bottom: 20px;
        align-items: center;
        color: #999;
        div {
          & + div {
            margin-left: 10px;
          }
        }
        span {
          margin-right: 10px;
        }
        span:nth-child(3) {
          margin-left: 10px;
        }
      }
      .select-box {
        display: flex;
        height: 30px;
        align-items: center;
        margin-bottom: 0;
        margin-right: 20px;
        float: left;
        color: #999;
        .text {
          margin-right: 10px;
        }
      }
    }
    .btns {
      /*display: flex;
        flex-direction: column;*/
      text-align: right;
      button {
        & + button {
          margin-top: 20px;
          margin-left: 5px;
        }
      }
    }
  }
  .btn-group {
    padding-left: 20px;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    background: #fff;
    button {
      width: 108px;
      & + button {
        margin-left: 20px;
      }
    }
    .btn-b {
      flex: 1;
      text-align: right;
      margin-right: 20px;
      button {
        margin-right: 10px;
      }
      span {
        color: #09bbfe;
      }
    }
  }

  .ibox-empty {
    margin-bottom: 10px;
  }
  a {
    color: #1684c2;
    & + a {
      margin-left: 10px;
    }
    &:hover {
      text-decoration: underline;
    }
  }
  .adv-info {
    display: flex;
    align-items: center;
    .img-wrap {
      position: relative;
      .id-info {
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 0 12px;
        width: 100%;
        height: 22px;
        line-height: 22px;
        color: #fff;
        background: rgba(0, 0, 0, 0.6);
      }
      .adv-img {
        display: inline-block;
        width: 200px;
        height: 64.1px;
      }
    }
    .adv-title {
      padding-left: 8px;
      line-height: 1.3;
      width: 284px;
      height: 54px;
    }
  }
  .remind-par {
    display: none;
    padding-top: 5px;
    color: #f00;
    font-size: 12px;
    &.error {
      display: block;
      position: relative;
      top: -15px;
    }
  }
  .resource-wrap {
    display: flex;
    flex-direction: column;
    p {
      line-height: 1.3;
    }
  }
}
</style>
<template>
  <div class="container">
    <sn-topbar title="爬虫评论管理" />
    <section class="ibox between">
      <div class="search-box">
        <div class="time-box"><span class="time-text">发表时间</span>
          <sn-timer width="180" placeholder="起始时间" ref="filterTimeS" :maxDate="ruleForm.endTime" v-model="ruleForm.startTime" showTimepicker />
          <span class="split">至</span>
          <sn-timer width="180" placeholder="结束时间" ref="filterTimeE" :minDate="ruleForm.startTime" v-model="ruleForm.endTime" showTimepicker />
        </div>
        <div class="input-box">
          <span class="text">内容标题</span>
          <sn-input width="178" radius="16" placeholder="请输入标题关键字" v-model="ruleForm.title" :maxlength="30"></sn-input>
          <span class="text">评论内容</span>
          <sn-input width="178" radius="16" placeholder="请输入内容关键字" v-model="ruleForm.content" :maxlength="30"></sn-input>
        </div>
        <div class="input-box">
          <div class="select-box">
            <span class="text">来源</span>
            <sn-select v-model="ruleForm.source" ref="select" placeholder="全部" radius="16" width="120" @change="sourceHandler">
              <sn-option name='全部' value=''></sn-option>
              <sn-option v-for="item in sourceList" :key="item.source" :name="item.source" :value="item.source" :disabled="item.disabled"></sn-option>
            </sn-select>
          </div>
          <div class="select-box">
            <span class="text">使用情况</span>
            <sn-select v-model="ruleForm.useFlag" ref="select" placeholder="全部" radius="16" width="120" @change="useHandler">
              <sn-option name='全部' value=''></sn-option>
              <sn-option v-for="item in useList" :key="item.key" :name="item.name" :value="item.value" :disabled="item.disabled"></sn-option>
            </sn-select>
          </div>
        </div>
      </div>
      <div class="btns">
        <sn-button type="primary" @click="search">查询</sn-button>
        <p>
          <sn-button type="default" @click="reset">重置</sn-button>
          <sn-button type="outline" @click="excel">导出</sn-button>
        </p>
      </div>
    </section>
    <section>
      <div class="btn-group">
        <div class="btn-o">
          <sn-button type="primary" @click="uncheckAll" v-if="checkAllFlag">取消全选</sn-button>
          <sn-button type="primary" @click="checkAll" v-else>全选</sn-button>
          <sn-button type="info" @click="publishSel">发布到</sn-button>
        </div>
        <div class="btn-b">
          <span>更新动态：最近更新时间 {{updateTime}}   更新了{{updateCount}}条评论</span>
        </div>
      </div>
    </section>
    <sn-table :data="list" ref="table1">
      <sn-table-column prop="info" width="6%" sloted>
        <template slot-scope="row">
          <sn-checkbox v-model="storeIds" :label="row.id" theme="radio"></sn-checkbox>
        </template>
      </sn-table-column>
      <sn-table-column label="评论内容" prop="commContent" width="28%" sloted>
        <template slot-scope="row">
          <div class="adv-info">
            <span class="adv-title" :title="row.commContent">{{handleTitle(row.commContent)}}</span>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label="内容标题" prop="info" width="27%" sloted>
        <template slot-scope="row">
          <div class="adv-info">
            <span class="adv-title" :title="row.commTitle">{{handleTitle(row.commTitle)}}</span>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label="发表时间" prop="createTime" width="14%" sloted>
        <template slot-scope="row">
          <div>
            <p style="padding-bottom:5px;">{{row.createTime.split(' ')[0]}}</p>
            <p>{{row.createTime.split(' ')[1]}}</p>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label="来源" prop="source" width="8%"></sn-table-column>
      <sn-table-column label="使用情况" prop="xxx" width="8%" sloted>
        <template slot-scope="row">
          {{row.useFlag == 1 ? '已使用' : ''}}
        </template>
      </sn-table-column>
      <sn-table-column label="操作" width="10%" sloted>
        <template slot-scope="row">
          <div class="is-column">
            <a href="javascript:;" @click="fnPublish(row)">发布到</a>
          </div>
        </template>
      </sn-table-column>
    </sn-table>
    <sn-pagination :total="dataTotal" :size="pageSize" @goto="goto"/>
    <!-- 已编辑提示框 -->
    <sn-confirm txt ref="publishConfirm" title="发布评论" :flag="publishConFlag" @sure="publishSure('formData')" @close="hidePublishConfirm">
      <sn-form :model="formData" :rules="rules" ref="formData" label-width="80px" formWidth="444">
        <sn-form-item label="评论内容" prop="content">
          <sn-input width="100%" placeholder="请输入评论内容" :maxlength="500" v-model="formData.content"></sn-input>
        </sn-form-item>
        <sn-form-item label="点赞数" prop="likeNum">
          <sn-input width="100%" inputType="number" placeholder="请输入点赞数，默认为随机" v-model="formData.likeNum"></sn-input>
        </sn-form-item>
        <sn-form-item label="内容类型" prop="type">
          <sn-select ref="typeSelect" v-model="formData.type" placeholder="请选择" radius="6" width="100%" @change="handleSelectType">
            <sn-option v-for="item in contentTypeList" :key="item.id" :name="item.name" :value="item.id" :disabled="item.disabled"></sn-option>
          </sn-select>
        </sn-form-item>
        <sn-form-item label="内容ID" prop="id">
          <sn-input width="100%" placeholder="请输入目标内容ID" v-model="formData.id" @blur="changeID(formData.type, formData.id)"></sn-input>
          <div class="form-item__error" v-if="flag_error && formData.id != ''">未查到该ID的信息，请检查您输入的ID信息</div>
        </sn-form-item>
        <sn-form-item label="标题" prop="title">
          <sn-input width="100%" disabled v-model="formData.title"></sn-input>
        </sn-form-item>
        <sn-form-item label="发布帐号" prop="account">
          <sn-select v-model="formData.account" placeholder="请选择" radius="6" width="100%" @change="handleSelectAccount">
            <sn-option v-for="item in accountList" :key="item.virtualUserId" :name="item.virtualUserName" :value="item.virtualUserId" :disabled="item.disabled"></sn-option>
          </sn-select>
        </sn-form-item>
      </sn-form>
    </sn-confirm>
  </div>
</template>
<script>
import DI from 'interface';
import * as Constant from 'js/constant';
export default {
  data() {
    return {
      pageIndex: 0, //默认是0
      pageSize: 20, //默认是20
      dataTotal: 0, //查询出来的数据条数
      ruleForm: {
        startTime: '',
        endTime: '',
        title: '',
        content: '',
        source: '',
        useFlag: ''
      },
      list: [],
      sourceList: [],
      accountList: [],
      checkAllFlag: false,
      publishConFlag: false,
      contentTypeList: Constant.REPTILE_CONTENTTYPE_LIST,
      formData: {
        content: '',
        likeNum: '',
        type: '',
        id: '',
        title: '',
        account: '',
        commId: ''
      },
      flag_error: false,
      rules: {
        id: [
          {
            required: true,
            message: '请输入内容ID',
            trigger: 'change'
          }
        ],
        account: [
          {
            required: true,
            message: '请选择发布帐号',
            trigger: 'change'
          }
        ],
        content: [
          {
            required: true,
            message: '请输入评论内容',
            trigger: 'change'
          }
        ]
      },
      updateTime: '00:00',
      updateCount: 0,
      excelData: {
        startTime: '',
        endTime: '',
        commTitle: '',
        commContent: '',
        source: '',
        useFlag: ''
      },
      useList: Constant.COMMENT_USE,
      selecteds: [],
      watchSelecteds: [],
      storeIds: [], // 所有勾选的
      storeList: [] // 所有选择的item list
    };
  },
  mounted() {
    this.queryList(0);
    this.querySourceList();
    this.queryAccountList();
  },
  watch: {
    storeIds(newVal, oldVal) {
      if (newVal != oldVal) {
        console.log('watch:', newVal, oldVal);
        let difference = this.diff(newVal, oldVal);
        this.list.filter((item, index) => {
          if (item.id == difference[0] && difference.length == 1) {
            if (newVal.length > oldVal.length) {
              // 增加单选
              this.watchSelecteds.push(item);
            } else {
              this.selecteds.filter((val, i) => {
                if (val.id == item.id) {
                  this.selecteds.splice(i, 1); // 移除单选
                }
              });
              this.watchSelecteds.filter((val, i) => {
                if (val.id == item.id) {
                  this.watchSelecteds.splice(i, 1); // 移除单选
                }
              });
            }
          }
        });
      }
    }
  },
  methods: {
    checkAll() {
      let curIds = [];
      this.list.length && (this.checkAllFlag = true);
      this.list.filter(item => {
        this.storeIds.push(item.id);
        curIds.push(item.id);
        this.selecteds.push(item);
      });
      this.storeList.push({
        pageIndex: this.pageIndex ? this.pageIndex : 1,
        isCheck: true,
        list: this.list,
        ids: curIds
      });
    },
    uncheckAll() {
      this.checkAllFlag = false;
      this.pageIndex = this.pageIndex ? this.pageIndex : 1;
      this.storeList.filter((item, index) => {
        if (this.pageIndex == item.pageIndex && item.isCheck) {
          this.selecteds = this.diff(this.selecteds, item.list);

          this.storeIds = this.diff(this.storeIds, item.ids);

          this.storeList.splice(index, 1);
        }
      });
    },
    goto(num) {
      this.pageIndex = num;
      this.checkAllFlag = false;
      this.storeList.filter(item => {
        if (num == item.pageIndex && item.isCheck) {
          this.checkAllFlag = true;
        }
      });
      this.queryList(num);
      window.scrollTo(0, 0);
    },
    publishSel() {
      if (this.storeIds.length) {
        this.$emit('input', this.filterSel());
        this.$emit('change-view', 'importTask');
      } else {
        this.$message.warning('请至少选择一条评论！');
      }
    },
    diff(arr1, arr2) {
      return arr1.filter(x => arr2.indexOf(x) == -1).concat(arr2.filter(x => arr1.indexOf(x) == -1));
    },
    filterSel() {
      if (this.selecteds.length) {
        this.watchSelecteds.filter(item => {
          let temp = 0;
          this.selecteds.filter(val => {
            if (val.id == item.id) {
              temp = 1;
            }
          });
          if (temp == 0) {
            this.selecteds.push(item);
          }
        });
      } else {
        this.selecteds = this.selecteds.concat(this.watchSelecteds);
      }
      return this.selecteds;
    },
    sourceHandler(val) {
      this.clearStore();
      this.excelData.source = val;
      this.ruleForm.source = val;
      this.queryList(0);
    },
    useHandler(val) {
      this.clearStore();
      if (val == -1) {
        this.ruleForm.useFlag = 0;
        this.excelData.useFlag = 0;
      } else {
        this.ruleForm.useFlag = val;
        this.excelData.useFlag = val;
      }
      this.queryList(0);
    },
    handleTitle(title) {
      return title && title.length > 55 ? title.slice(0, 55) + '...' : title;
    },
    handleStatus(row) {
      return row.staffId && row.staffId != '' && row.staffId != null ? '已使用' : '未编辑';
    },
    handleSelectType(val) {
      this.formData.type = val;
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
    },
    handleSelectAccount(val) {
      this.formData.account = val + '';
    },
    fnPublish(row) {
      this.formData.type = '0';
      this.formData.content = row.commContent;
      this.publishConFlag = true;
      this.formData.commId = row.id;
    },
    hidePublishConfirm() {
      this.clearVal();
    },
    clearStore() {
      this.selecteds = [];
      this.storeList = [];
      this.storeIds = [];
      this.checkAllFlag = false;
    },
    reset() {
      this.ruleForm = {
        startTime: '',
        endTime: '',
        title: '',
        content: '',
        source: '',
        useFlag: ''
      };
    },
    clearVal() {
      this.formData = {
        content: '',
        likeNum: '',
        type: '',
        id: '',
        title: '',
        account: ''
      };
      this.publishConFlag = false;
      this.$refs.formData && this.$refs.formData.resetFields();
    },
    excel() {
      if (!this.checkTime()) return;
      let str =
        '?startTime=' +
        this.excelData.startTime +
        '&endTime=' +
        this.excelData.endTime +
        '&commContent=' +
        this.excelData.commContent +
        '&commTitle=' +
        this.excelData.commTitle +
        '&source=' +
        this.excelData.source +
        '&useFlag=' +
        this.excelData.useFlag;
      window.location = DI.reptileCommentManagement.exportExcel + str;
    },
    publishSure(formName) {
      console.log(this.formData);
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {},
            contentType = '';
          if (this.formData.type == '0') {
            contentType = 1;
          } else if (this.formData.type == '4') {
            contentType = 2;
          } else if (this.formData.type == '10') {
            contentType = 4;
          }
          params.contentType = contentType;
          params.contentId = this.formData.id;
          params.contentTitle = this.formData.title;
          params.userId = this.formData.account;
          params.commContent = this.formData.content;
          params.likeNum = this.formData.likeNum;
          params.commId = this.formData.commId;
          this.$ajax({
            url: DI.reptileCommentManagement.commentPublish,
            data: JSON.stringify(params),
            context: this,
            success: res => {
              if (res.retCode == '0') {
                this.$message.success('发布成功');
                this.clearVal();
                setTimeout(() => {
                  this.queryList(this.pageIndex);
                }, 1300);
              } else {
                this.$message.error(res.retMsg);
              }
            },
            error: () => {
              console.error('error');
            }
          });
        } else {
          return false;
        }
      });
    },
    checkTime() {
      if (this.ruleForm.startTime == '' && this.ruleForm.endTime != '') {
        this.$refs.filterTimeS.showErr('开始时间不能为空！');
        return false;
      } else if (this.ruleForm.startTime != '' && this.ruleForm.endTime == '') {
        this.$refs.filterTimeE.showErr('结束时间不能为空！');
        return false;
      }
      let getStartTime = parseInt(new Date(this.ruleForm.startTime).getTime(), 10),
        getEndTime = parseInt(new Date(this.ruleForm.endTime).getTime(), 10);
      if (getStartTime > getEndTime) {
        this.$refs.filterTimeE.showErr('结束时间必须大于开始时间！');
        return false;
      }
      return true;
    },
    search() {
      this.clearStore();
      if (!this.checkTime()) return;
      this.excelData = {
        startTime: this.ruleForm.startTime,
        endTime: this.ruleForm.endTime,
        commTitle: this.ruleForm.title,
        commContent: this.ruleForm.content,
        source: this.ruleForm.source,
        useFlag: this.ruleForm.useFlag
      };
      this.queryList(0);
      window.scrollTo(0, 0);
    },
    changeID(type, id) {
      if (id == '') return;
      let url,
        params = {};
      if (type == '0') {
        //资讯
        url = DI.channel.getNewsInfo;
        params.newsId = parseInt(id);
      } else if (type == '4') {
        //mip视频
        url = DI.channel.queryVideoDetail + '?videoId=' + id;
      } else if (type == '10') {
        //直播节目
        url = DI.reptileCommentManagement.queryProgramInfo;
        params.matchitemShowId = parseInt(id);
      }
      this.$ajax({
        url: url,
        data: JSON.stringify(params),
        context: this,
        success: res => {
          let result = res.data || {};
          if (res.retCode == '0') {
            this.formData.title = result.title || result.matchitemShowName || '';
            this.flag_error = this.formData.title == '';
          } else {
            this.flag_error = true;
            this.formData.title = '';
          }
        },
        error: () => {}
      });
    },
    queryAccountList() {
      this.$ajax({
        url: DI.reptileCommentManagement.queryUsers,
        context: this,
        type: 'post',
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.accountList = res.data.virtualUserList || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {}
      });
    },
    querySourceList() {
      this.$ajax({
        url: DI.reptileCommentManagement.queryAllSource,
        data: JSON.stringify({}),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.sourceList = res.data.sourceList || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {}
      });
    },
    queryList(pageNum) {
      if (pageNum === 0) {
        this.pageIndex = pageNum;
        this.$bus.$emit('syncCurPage', 1);
      }
      let params = {};
      params.commTitle = this.ruleForm.title;
      params.commContent = this.ruleForm.content;
      params.source = this.ruleForm.source;
      // 更改了结束时间或者开始时间，页面上会改变现实，但是没有触发时间，真实时间从dom中取
      params.startTime = this.$refs.filterTimeS.$refs.input.value;
      params.endTime = this.$refs.filterTimeE.$refs.input.value;
      params.pageIndex = pageNum ? (pageNum - 1) * this.pageSize : 0;
      params.pageSize = this.pageSize;
      params.useFlag = this.ruleForm.useFlag == -1 ? 0 : this.ruleForm.useFlag;
      // params = this.$bus.deleteNullProperty(params);
      this.$ajax({
        url: DI.reptileCommentManagement.queryWormComment,
        data: JSON.stringify(params),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.list = res.data.commentList || [];
            this.dataTotal = res.data.commentNum || 0;
            this.updateTime = res.data.updateTime || '';
            this.updateCount = res.data.updateCommentNum || 0;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    }
  }
};
</script>
