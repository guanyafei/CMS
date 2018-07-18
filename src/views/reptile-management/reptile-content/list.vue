<style scoped>
  .container {
    .ibox {
      display: flex;
      align-items: center;
      min-height: 72px;
      padding: 0 20px;
      background: #fff;
      margin-bottom: 10px;
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
          div {
            &+div {
              margin-left: 30px;
            }
          }
        }
        .select-box {
          display: flex;
          height: 30px;
          align-items: center;
          margin-bottom: 20px;
          margin-right: 20px;
          float: left;
          color: #999;
          .text {
            margin-right: 10px;
          }
        }
      }
      .btns {
        display: flex;
        flex-direction: column;
        button {
          &+button {
            margin-top: 20px;
          }
        }
      }
    }
    .ibox-empty {
      margin-bottom: 10px;
    }
    a {
      color: #1684C2;
      &+a {
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
    <sn-topbar title="内容管理" />
    <section class="ibox between">
      <div class="search-box">
        <div class="time-box"><span class="time-text">抓取时间</span>
          <sn-timer width="180" placeholder="起始时间" ref="filterTimeS" :maxDate="ruleForm.endTime" v-model="ruleForm.startTime" showTimepicker />
          <span class="split">至</span>
          <sn-timer width="180" placeholder="结束时间" ref="filterTimeE" :minDate="ruleForm.startTime" v-model="ruleForm.endTime" showTimepicker />
        </div>
        <div class="input-box">
          <sn-input width="178" radius="16" placeholder="请输入内容标题" v-model="ruleForm.contentTitle" :maxlength="30"></sn-input>
          <sn-input width="178" radius="16" placeholder="请输入作者昵称" v-model="ruleForm.authorName" :maxlength="30"></sn-input>
        </div>
        <div class="select-box">
          <span class="text">目标网站</span>
          <sn-select v-model="ruleForm.site" ref="select" placeholder="全部" radius="16" width="120" @change="siteHandler">
            <sn-option name='全部' value=''></sn-option>
            <sn-option v-for="item in siteList" :key="item.websiteId" :name="item.websiteName" :value="item.websiteName" :disabled="item.disabled"></sn-option>
          </sn-select>
        </div>
        <div class="select-box">
          <span class="text">展示分类</span>
          <sn-select v-model="ruleForm.showType" ref="select" placeholder="全部" radius="16" width="120" @change="typeHandler">
            <sn-option name='全部' value=''></sn-option>
            <sn-option v-for="item in channelList" :key="item.categId" :name="item.categName" :value="item.categId" :disabled="item.disabled"></sn-option>
          </sn-select>
        </div>
        <div class="select-box">
          <span class="text">资讯状态</span>
          <sn-select v-model="ruleForm.newStatus" ref="select" placeholder="全部" radius="16" width="120" @change="statusHandler">
            <sn-option name='全部' value=''></sn-option>
            <sn-option v-for="item in newsList" :key="item.id" :name="item.name" :value="item.value" :disabled="item.disabled"></sn-option>
          </sn-select>
        </div>
      </div>
      <div class="btns">
        <sn-button type="primary" @click="search">查询</sn-button>
        <sn-button type="default" @click="reset">重置</sn-button>
      </div>
    </section>
    <sn-table :data="list" ref="table1">
      <sn-table-column label="内容基本信息" prop="info" width="30%" align="left" sloted>
        <template slot-scope="row">
          <div class="adv-info">
            <div class="img-wrap">
              <img alt="" class="adv-img" :src="row.cover" />
            </div>
            <span class="adv-title" :title="row.title">{{handleTitle(row.title)}}</span>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label="展示分类" prop="categName" width="10%"></sn-table-column>
      <sn-table-column label="来源信息" prop="infoResource" align="left" width="20%" sloted>
        <template slot-scope="row">
          <div class="resource-wrap">
            <p>目标网站：{{row.sourceWebsite}}</p>
            <p>抓取频道：{{row.grabChannel}}</p>
            <p>作者：{{row.authorName}}</p>
            <p>参考来源：{{row.source}}</p>
            <p :title="row.textLink">新闻URL：<a target="_blank" :href="row.textLink">{{handleTitle(row.textLink)}}</a></p>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label="抓取时间" prop="createTime" width="10%" sloted>
        <template slot-scope="row">
          <sn-td-date :time="row.createTime"></sn-td-date>
        </template>
      </sn-table-column>
      <sn-table-column label="原文发表时间" prop="publishTime" width="10%" sloted>
        <template slot-scope="row">
          <sn-td-date :time="row.publishTime"></sn-td-date>
        </template>
      </sn-table-column>
      <sn-table-column label="资讯状态" prop="state" width="10%" sloted>
        <template slot-scope="row">
          <div class="resource-wrap">
            <p>{{handleStatus(row)}}</p>
            <p v-if="row.staffId && row.staffId != '' && row.staffId != null">编辑ID：{{row.staffId}}</p>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label="操作" width="10%" sloted>
        <template slot-scope="row">
          <div class="is-column">
            <a href="javascript:;" @click="edit(row)">编辑</a>
          </div>
        </template>
      </sn-table-column>
    </sn-table>
    <sn-pagination :total="dataTotal" :size="pageSize" @goto="goto"/>
    <!-- 已编辑提示框 -->
    <sn-confirm txt ref="editConfirm" title="编辑提醒" :flag="editConFlag" @sure="editSure" hideCancelButton>
      该资讯已被其他人员采用，确认继续发布？
    </sn-confirm>
  </div>
</template>
<script>
  import DI from 'interface'
  import * as Constant from 'js/constant'
  export default {
    data() {
      return {
        pageIndex: 0, //默认是0
        pageSize: 20, //默认是20
        dataTotal: 0, //查询出来的数据条数
        ruleForm: {
          site: this.$bus.ruleForm && this.$bus.ruleForm.site || '',
          showType: this.$bus.ruleForm && this.$bus.ruleForm.showType || '',
          newStatus: this.$bus.ruleForm && this.$bus.ruleForm.newStatus || '',
          contentTitle: this.$bus.ruleForm && this.$bus.ruleForm.contentTitle || '',
          authorName: this.$bus.ruleForm && this.$bus.ruleForm.authorName || '',
          endTime: this.$bus.ruleForm && this.$bus.ruleForm.endTime || '',
          startTime: this.$bus.ruleForm && this.$bus.ruleForm.startTime || ''
        },
        siteList: [], // 目标网站
        channelList: [], // 展示分类
        newsList: Constant.REPTILE_STATUS, // 资讯状态
        list: [],
        editConFlag: false
      }
    },
    mounted() {
      if(this.$bus.ruleForm) {
        this.list = this.$bus.list;
        this.dataTotal = this.$bus.dataTotal;
        this.queryAllList();
        return;
      }
      this.queryList(0);
      this.queryAllList();
    },
    methods: {
      siteHandler(val) {
        this.ruleForm.site = val;
        this.queryList(0);
      },
      typeHandler(val) {
        this.ruleForm.showType = val;
        this.queryList(0);
      },
      statusHandler(val) {
        this.ruleForm.newStatus = val;
        this.queryList(0);
      },
      handleTitle(title) {
        return title && title.length > 20 ? (title.slice(0, 20) + '...') : title;
      },
      handleStatus(row) {
        return row.staffId && row.staffId != '' && row.staffId != null ? '已使用' : '未编辑';
      },
      goto(num) {
        this.pageIndex = num;
        this.queryList(num);
        window.scrollTo(0, 0);
      },
      edit(row) {
        row.ruleForm = this.ruleForm;
        this.$emit('input', row);
        this.$emit('change-view', 'edit');
      },
      editSure() {
        this.$emit('input', this.editContent.id);
        this.$emit('change-view', 'edit');
        this.editConFlag = false;
      },
      search() {
        if(this.ruleForm.startTime == '' && this.ruleForm.endTime != '') {
          this.$refs.filterTimeS.showErr('开始时间不能为空！');
          return;
        } else if (this.ruleForm.startTime != '' && this.ruleForm.endTime == '') {
          this.$refs.filterTimeE.showErr('结束时间不能为空！');
          return;
        }
        let getStartTime = parseInt(new Date(this.ruleForm.startTime).getTime(), 10),
        getEndTime = parseInt(new Date(this.ruleForm.endTime).getTime(), 10);
        if(getStartTime > getEndTime) {
          this.$refs.filterTimeE.showErr('结束时间必须大于开始时间！');
          return;
        }
        this.queryList(0);
        window.scrollTo(0, 0);
      },
      reset() {
        this.ruleForm = {
          site: '',
          showType: '',
          newStatus: '',
          contentTitle: '',
          authorName: '',
          endTime: '',
          startTime: ''
        };
      },
      queryAllList() {
        this.$ajax({
          url: DI.reptile.queryAllList,
          data: JSON.stringify({}),
          context: this,
          loadingText: '正在查询，请稍候！',
          success: (res) => {
            if(res.retCode == '0') {
              this.channelList = res.data.wormCategoryList || [];
              this.siteList = res.data.wormWebsiteList || [];
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.error('error');
          }
        });
      },
      queryList(pageNum) {
        if(pageNum === 0) {
          this.pageIndex = pageNum;
          this.$bus.$emit('syncCurPage', 1);
        }
        let params = {};
        params.title = this.ruleForm.contentTitle;
        params.authorName = this.ruleForm.authorName;
        params.sourceWebsite = this.ruleForm.site;
        params.categId = this.ruleForm.showType;
        params.isUsed = this.ruleForm.newStatus;
        // 更改了结束时间或者开始时间，页面上会改变现实，但是没有触发时间，真实时间从dom中取
        params.startTime = this.$refs.filterTimeS.$refs.input.value;
        params.endTime = this.$refs.filterTimeE.$refs.input.value;
        params.pageIndex = pageNum ? (pageNum - 1) * this.pageSize : 0;
        params.pageSize = this.pageSize;
        // params = this.$bus.deleteNullProperty(params);
        this.$ajax({
          url: DI.reptile.queryContentList,
          data: params,
          context: this,
          contentType: 'application/x-www-form-urlencoded',
          loadingText: '正在查询，请稍候！',
          success: (res) => {
            if(res.retCode == '0') {
              this.list = res.data.worms || [];
              this.dataTotal = res.data.num || 0;
              this.$bus.list = this.list;
              this.$bus.dataTotal = this.dataTotal;
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
  }
</script>
