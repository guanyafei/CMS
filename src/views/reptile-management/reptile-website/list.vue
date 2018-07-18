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
        padding: 2px 0;
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
    <sn-topbar title="网站管理" />
    <section class="ibox between">
      <div class="search-box">
        <div class="select-box">
          <span class="text">网站分类</span>
          <sn-input width="178" radius="6" :maxlength="12" placeholder="请输入网站名称" v-model="siteName"></sn-input>
        </div>
      </div>
      <div class="btns">
        <sn-button type="primary" @click="search">查询</sn-button>
        <sn-button type="default" @click="add">添加网站</sn-button>
      </div>
    </section>
    <sn-table :data="list" ref="table1">
      <sn-table-column label="网站分类" prop="websiteName" align="left" width="50%"></sn-table-column>
      <sn-table-column label="操作" width="50%" sloted>
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
    <sn-confirm txt ref="addConfirm" :title="modalTitle" :flag="addConFlag" @sure="saveSite('siteData')" @close="hideConfirm">
      <sn-form :model="siteData" :rules="rules" ref="siteData" label-width="80px" formWidth="400">
        <sn-form-item :label="modalTitle+'网站'" prop="siteAddName">
          <sn-input width="278" radius="0" placeholder="请输入网站名称" v-model="siteData.siteAddName"></sn-input>
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
        curContent: {},
        addConFlag: false,
        modalTitle: '添加',
        siteName: '',
        siteData: {
          siteAddName: ''
        },
        siteType: '',
        siteList: [],
        list: [{
          name: '懂球帝'
        }],
        rules: {
          siteAddName: [{
            required: true,
            message: '请输入网站名称',
            trigger: 'change'
          }]
        }
      }
    },
    mounted() {
      this.queryList(0);
    },
    methods: {
      siteHandler(val) {
        this.ruleForm.site = val;
        this.queryList(0);
      },
      goto(num) {
        this.pageIndex = num;
        this.queryList(num);
        window.scrollTo(0, 0);
      },
      search() {
        this.queryList(0);
        window.scrollTo(0, 0);
      },
      add() {
        this.addConFlag = true;
        this.modalTitle = '添加';
      },
      edit(row) {
        this.addConFlag = true;
        this.modalTitle = '编辑';
        this.siteData.siteAddName = row.websiteName || '';
        this.curContent = row;
      },
      search() {
        this.queryList(0);
      },
      reset() {
        this.siteType = '';
      },
      showDelConfirm(row) {
        this.delConFlag = true;
        this.curContent = row;
      },
      hideConfirm() {
        this.delConFlag = this.addConFlag = false;
        this.siteData.siteAddName = '';
        this.$refs.siteData && this.$refs.siteData.resetFields();
      },
      deleteSite() {
        let params = {};
        params.websiteId = this.curContent.websiteId;
        params = this.$bus.deleteNullProperty(params);

        this.$ajax({
          url: DI.reptile.delWebsite,
          data: JSON.stringify(params),
          context: this,
          loadingText: '正在删除，请稍候！',
          success: (res) => {
            if(res.retCode == '0') {
              this.$message.success('删除成功');
              this.hideConfirm();
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
      },
      saveSite(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            let url = '', params = {};
            if(this.modalTitle == '添加') {
              url = DI.reptile.addWebsite;
            } else {
              url = DI.reptile.editWebsite;
              params.websiteId = this.curContent.websiteId;
            }
            params.websiteName = this.siteData.siteAddName;
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
      queryList(pageNum) {
        if(pageNum === 0) {
          this.pageIndex = pageNum;
          this.$bus.$emit('syncCurPage', 1);
        }
        let params = {};
        params.websiteName = this.siteName;
        params.pageIndex = pageNum ? (pageNum - 1) * this.pageSize : 0;
        params.pageSize = this.pageSize;
        params = this.$bus.deleteNullProperty(params);

        this.$ajax({
          url: DI.reptile.queryWebsiteList,
          data: JSON.stringify(params),
          context: this,
          loadingText: '正在查询，请稍候！',
          success: (res) => {
            if(res.retCode == '0') {
              this.list = res.data.wormWebsiteList || [];
              this.dataTotal = res.data.wormWebsiteNum || 0;
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
