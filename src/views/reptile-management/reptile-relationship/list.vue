<style scoped>
  .container {
    .ibox {
      display: flex;
      align-items: center;
      min-height: 72px;
      padding: 0 20px;
      background: #fff;
      margin-bottom: 0;
      &.between {
        justify-content: space-between;
      }
      .search-box {
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
        display: flex;
        flex-direction: column;
        button {
          &+button {
            margin-top: 20px;
          }
        }
      }
    }
    a {
      color: #1684C2;
      &+a {
        margin-left: 0;
        margin-top: 4px;
      }
      &:hover {
       text-decoration: underline;
     }
    }
  }
</style>
<template>
  <div class="container">
    <sn-topbar title="对应关系" />
    <section class="ibox between">
      <div class="search-box">
        <div class="select-box">
          <span class="text">展示分类</span>
          <sn-select v-model="classifyType" ref="select" placeholder="全部" radius="16" width="120" @change="classifyHandler">
            <sn-option name='全部' value=''></sn-option>
            <sn-option v-for="item in channelList" :key="item.categId" :name="item.categName" :value="item.categId" :disabled="item.disabled"></sn-option>
          </sn-select>
        </div>
        <div class="select-box">
          <span class="text">网站分类</span>
          <sn-select v-model="siteType" ref="select" placeholder="全部" radius="16" width="120" @change="siteHandler">
            <sn-option name='全部' value=''></sn-option>
            <sn-option v-for="item in siteList" :key="item.websiteId" :name="item.websiteName" :value="item.websiteId" :disabled="item.disabled"></sn-option>
          </sn-select>
        </div>
      </div>
      <div class="btns">
        <sn-button type="primary" @click="add">添加对应关系</sn-button>
      </div>
    </section>
    <sn-table :data="list" ref="table1">
      <sn-table-column label="展示分类" prop="categName" align="left" width="25%"></sn-table-column>
      <sn-table-column label="网站分类" prop="websiteName" align="left" width="25%"></sn-table-column>
      <sn-table-column label="抓取频道" prop="grabChannel" align="left" width="25%"></sn-table-column>
      <sn-table-column label="操作" width="25%" sloted>
        <template slot-scope="row">
          <div class="is-column">
            <a href="javascript:;" @click="edit(row)">编辑</a>
            <a href="javascript:;" @click="showDelConfirm(row)">删除</a>
          </div>
        </template>
      </sn-table-column>
    </sn-table>
    <sn-pagination :total="dataTotal" :size="pageSize" @goto="goto"/>
    <!-- 删除框 -->
    <sn-confirm txt ref="delConfirm" title="删除提醒" :flag="delConFlag" @sure="deleteSite" @close="hideConfirm">
      确认删除？
    </sn-confirm>
    <sn-confirm txt ref="addConfirm" :title="modalTitle+'对应关系'" :flag="addConFlag" @sure="saveSite('siteData')" @close="hideConfirm">
      <sn-form :model="siteData" :rules="rules" ref="siteData" label-width="80px" formWidth="400">
        <sn-form-item label="展示分类" prop="channel">
          <sn-select ref="channelSelect" v-model="siteData.channel" placeholder="请选择" radius="6" width="306" @change="handleSelectChannel">
            <sn-option v-for="item in channelList" :key="item.categId" :name="item.categName" :value="item.categId"></sn-option>
          </sn-select>
        </sn-form-item>
        <sn-form-item label="网站分类" prop="site">
          <sn-select ref="siteSelect" v-model="siteData.site" placeholder="请选择" radius="6" width="306" @change="handleSelectSite">
            <sn-option v-for="item in siteList" :key="item.websiteId" :name="item.websiteName" :value="item.websiteId"></sn-option>
          </sn-select>
        </sn-form-item>
        <sn-form-item label="抓取频道" prop="channelName">
          <sn-input width="306" radius="6" :maxlength="30" placeholder="请输入抓取频道" v-model="siteData.channelName"></sn-input>
        </sn-form-item>
      </sn-form>
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
        delConFlag: false,
        addConFlag: false,
        curContent: {},
        modalTitle: '添加',
        siteData: {
          channel: '',
          channelName: '',
          site: ''
        },
        classifyType: '',
        siteType: '',
        channelList: [{
          id: 1,
          name: '热门'
        }],
        siteList: [{
          id: 2,
          name: '懂球帝'
        }],
        list: [{
          channel: '热门',
          site: '懂球帝',
          channelName: '今日头条'
        }],
        rules: {
          channel: [{
            required: true,
            type: 'number',
            message: '请选择展示分类',
            trigger: 'change'
          }],
          site: [{
            required: true,
            type: 'number',
            message: '请选择网站分类',
            trigger: 'change'
          }],
          channelName: [{
            required: true,
            message: '请输入抓取频道',
            trigger: 'change'
          }]
        }
      }
    },
    mounted() {
      this.queryList(0);
      this.queryAllList();
    },
    methods: {
      classifyHandler(val) {
        this.classifyType = val;
        this.queryList(0);
      },
      siteHandler(val) {
        this.siteType = val;
        this.queryList(0);
      },
      handleSelectChannel(val) {
        this.siteData.channel = val;
      },
      handleSelectSite(val) {
        this.siteData.site = val;
      },
      goto(num) {
        this.pageIndex = num;
        this.queryList(num);
        window.scrollTo(0, 0);
      },
      add() {
        this.addConFlag = true;
        this.modalTitle = '添加';
      },
      edit(row) {
        this.addConFlag = true;
        this.modalTitle = '编辑';
        this.curContent = row;
        this.siteData = {
          channel: row.categId,
          channelName: row.grabChannel,
          site: row.websiteId
        };
      },
      search() {
        this.queryList(0);
      },
      reset() {
        this.classifyType = this.siteType = '';
      },
      showDelConfirm(row) {
        this.delConFlag = true;
        this.curContent = row;
      },
      hideConfirm() {
        this.delConFlag = this.addConFlag = false;
        this.channelName = '';
        this.curContent = {};
        this.siteData = {
          channel: '',
          channelName: '',
          site: ''
        };
        this.$refs.siteData && this.$refs.siteData.resetFields();
      },
      deleteSite() {
        let params = {};
        params.id = this.curContent.id;
        params = this.$bus.deleteNullProperty(params);

        this.$ajax({
          url: DI.reptile.delRelationship,
          data: JSON.stringify(params),
          context: this,
          loadingText: '正在删除，请稍候！',
          success: (res) => {
            if(res.retCode == '0') {
              this.$message.success('删除成功');
              this.hideConfirm();
              setTimeout(() => {
                this.queryList(this.pageIndex);
              }, 1000);
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.error('error');
          }
        });
      },
      saveSite(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            let url = '', params = {};
            if(this.modalTitle == '添加') {
              url = DI.reptile.addRelationship;
            } else {
              url = DI.reptile.editRelationship;
              params.id = this.curContent.id;
            }
            params.categId = this.siteData.channel;
            params.websiteId = this.siteData.site;
            params.grabChannel = this.siteData.channelName;
            params = this.$bus.deleteNullProperty(params);

            this.$ajax({
              url: url,
              data: JSON.stringify(params),
              context: this,
              loadingText: '正在保存，请稍候！',
              success: (res) => {
                if(res.retCode == '0') {
                  this.$message.success(this.modalTitle + '成功');
                  this.hideConfirm();
                  setTimeout(() => {
                    this.queryList(this.pageIndex);
                  }, 1300);
                } else {
                  this.$message.error(res.retMsg);
                }
              },
              error: () => {
                this.$message.warning(this.modalTitle + '失败！');
              }
            });
          } else {
            return false;
          }
        });
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
        params.categId = this.classifyType;
        params.websiteId = this.siteType;
        params.pageIndex = pageNum ? (pageNum - 1) * this.pageSize : 0;
        params.pageSize = this.pageSize;
        params = this.$bus.deleteNullProperty(params);

        this.$ajax({
          url: DI.reptile.queryRelationshipList,
          data: JSON.stringify(params),
          context: this,
          loadingText: '正在查询，请稍候！',
          success: (res) => {
            if(res.retCode == '0') {
              this.list = res.data.wormCategWebsiteList || [];
              this.dataTotal = res.data.wormCategWebsiteNum || 0;
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.error('error')
          }
        });
      }
    }
  }
</script>
