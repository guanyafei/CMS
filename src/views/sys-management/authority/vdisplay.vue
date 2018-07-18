<style>
.container {
  .ibox {
    display: flex;
    align-items: center;
    height: auto;
    min-height: 72px;
    padding: 0 20px;
    background: #fff;
    margin-bottom: 10px;

    & .end {
      justify-content: flex-end;
    }

    & .between {
      justify-content: space-between;
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
        margin-bottom: 20px;
      }

      .select-box {
        display: flex;
        height: 30px;
        align-items: center;
        margin-bottom: 20px;
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
        & + button {
          margin-top: 20px;
        }
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

    & :hover {
      text-decoration: underline;
    }
  }
.header {
  display: flex;
  justify-content: space-between;
  padding: 0 18px;
  height: 46px;
  border-bottom: 1px solid #e8e8e8;
  background: #fff;
  .title {
    display: inline-block;
    font-size: 16px;
    color: #333;
    line-height: 46px;
  }
  .labels {
    display: flex;
    justify-content: center;
    align-items: center;
    .item {
      font-size: 14px;
      padding: 8px 0px;
      position: relative;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #48576a;
      height: 46px;
      line-height: 2;
      box-sizing: border-box;
      cursor: pointer;
      & + .item {
        margin-left: 30px;
      }
      &.selected,
      &:hover {
        color: #0abbfe;
        border-bottom: 4px solid #0abbfe;
      }
    }
  }
}

  .operate-par {
    padding: 5px 0;
  }

  .remind-par {
    display: none;
    margin-top: -13px;
    padding-left: 80px;
    color: #f00;
    font-size: 12px;
  }

  .match-logo {
    width: 160px;
    height: 160px;
  }

  .add-user-input {
    display: inline-block;
    margin-right: 10px;
  }
  .top-view {
    z-index: 7000;
  }
  .form-item__content {
    margin-left: 0;
  }
  .form-item .form-item__content {
    margin-left: 45px !important;
  }
  .form-item .data-table thead td {
    height: 40px;
  }
  .form-item .data-table tbody td {
    height: 57px;
  }
  .form-item__content .table-body {
    border-left: 1px solid #f0f1f5;
    border-right: 1px solid #f0f1f5;
  }
}
</style>
<template>
  <div class="container">
    <div class="header">
      <div class="title">权限管理</div>
      <ul class="labels">
        <li v-for="item in navTabs"
          :key='item.tabId'
          :class="['item',
            {'selected': tabIndex==item.tabId}
          ]"
          @click.stop="tabChange(item.tabId)"
        >
          <span>
            {{item.tabName}}
          </span>
        </li>
      </ul>
    </div>
    <sn-search-box :fields="searchFilters">
      <sn-search-item
      :children="[ {
        type: 'input',
        prop: 'themeName',
        label: '主题名称',
        placeholder: '请输入名称',
        autoValid:true,
      },{
        type: 'button',
        buttonType: 'primary',
        text: '查询',
        triggerEvent: querySubjectList,
        isRight: true
      }]">
      </sn-search-item>
    </sn-search-box>
    <sn-datatable :data="subjectList" :border="true">
      <sn-datacolumn label="主题ID" prop="subjectId" :width="160">
      </sn-datacolumn>
      <sn-datacolumn label="关联ID" prop="relationId" :width="160">
      </sn-datacolumn>
      <sn-datacolumn label="主题名称" prop="subjectName" :width="auto" alignment="left">
      </sn-datacolumn>
      <sn-datacolumn label="操作" prop="opt" :width="160">
      </sn-datacolumn>
      <template slot-scope="cell" slot="opt">
        <p class="operate-par">
          <a href="javascript:void(0)" @click="authoritymgtModelShow(cell.row)">权限管理</a>
        </p>
      </template>
    </sn-datatable>
    <sn-pagination :pageIndex.sync="pageInfo.pageIndex" :total="pageInfo.total" @goto="goto" :size="pageInfo.pageSize"></sn-pagination>
    <!--频道权限管理弹框-->
    <sn-confirm v-if="authorityMgtPopFlag" ref="addVideoColPop" title='权限管理' @sure="submitVideoCol" @close="authorityMgtPopHide" :flag="authorityMgtPopFlag" confirmButtonText="保存" cancelButtonText="关闭">
      <sn-form :model="soaUserColData" ref="submitVideoForm" :rules="submitVideoRole" label-width="80px" formWidth="530" style="height:400px;overflow:auto">
        <sn-form-item label="主题名称" style="margin-left: 35px;margin-top:20px">
          <sn-input class="add-user-input" placeholder="请输入主题名称" v-model="curThemeName" width="250" disabled="true"/>
        </sn-form-item>
        <sn-form-item label="权限设定" style="margin-left: 35px;margin-top:20px">
          <sn-radio-group v-model="curPubFlag">
            <sn-radio
              v-for="item in authorityTypes"
              :key="item.id"
              :label="item.value"
            >
              {{item.name}}
            </sn-radio>
          </sn-radio-group>
        </sn-form-item>
        <sn-form-item label="添加用户" prop="soaUserAccount" ref="soaUserAccount" style="margin-left: 35px;margin-top:20px" v-show="!curPubFlag">
          <sn-input class="add-user-input" placeholder="请输入账号" v-model="soaUserColData.soaUserAccount" width="250" @change="soaUserChangeHandler" />
          <sn-button v-if="soaUserColData.soaUserAccount != ''" type="primary" @click="addUser">添加</sn-button>
          <sn-button v-else type="primary" @click="addUser" style="background-color:#ccc;" disabled>添加</sn-button>
        </sn-form-item>
        <sn-form-item label="" prop="vedioTitle" style="margin-right:45px;" v-show="!curPubFlag">
          <sn-table :data='soaUserList' ref='soaUserTable'>
            <sn-table-column label='账号' prop='soaUserId' align='left'></sn-table-column>
            <sn-table-column label='操作' sloted width='160'>
              <template slot-scope='row'>
                <p class="operate-par">
                  <a href="javascript:;" @click="showDelSoaUserConfirm(row)">删除</a>
                </p>
              </template>
            </sn-table-column>
          </sn-table>
        </sn-form-item>
      </sn-form>
    </sn-confirm>
    <!---删除频道会员的确认提示-->
    <sn-confirm class="top-view" txt ref="delMVideoConf" :flag="delSoaUserFlag" @sure="delSoaUser(delSoaUserId)" @close="hideDelVideoConfirm">
      确定要删除吗？
    </sn-confirm>
  </div>
</template>
<script>
import DI from 'interface'
import * as Constant from 'js/constant'
const SERVER_OK = "0"
export default {
  props: {
    channelId: { // 获取频道列表页面传过来的ChannelId
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      /*频道权限和主题权限的功能一样，主题也是频道的一种，所以主题可以共用频道权限的变量和接口*/
      tabIndex: 1,
      navTabs: [
        {
          tabId: 1,
          tabName: '栏目',
        }, {
          tabId: 2,
          tabName: '赛事',
        }, {
          tabId: 3,
          tabName: '专题',
        }, {
          tabId: 4,
          tabName: '节目集',
        }, {
          tabId: 5,
          tabName: '小组',
        }, {
          tabId: 6,
          tabName: '比赛场次',
        },
      ],
      searchFilters: {
        themeName: '',
      },
      pageInfo: {
        total: 0,
        pageIndex: 1,
        pageSize: 20,
      },
      authorityTypes: [
        {
          id: 1,
          name: '开放',
          value: true,
        }, {
          id: 2,
          name: '限定',
          value: false,
        },
      ],
      sureBtnIsShow: false,
      // channelList: [], // 频道权限列表
      subjectList: [], // 主题分类权限列表
      // topiclList: [], // 专题权限列表
      soaUserList: [], // 会员账户列表
      curThemeName: '', // 当前编辑的权限列表的主题名称
      // curChannelId: '', // 当前编辑的权限列表的频道id或者主题id
      curSubjectId: '',
      curPubFlag: true, // 当前编辑的权限是否开放
      soaUserColData: { // 会员信息
        soaUserAccount: '' // 会员账户
      },
      submitVideoRole: { // 添加规则
        soaUserAccount: []
      },
      authorityMgtPopFlag: false, // 权限管理弹框
      delSoaUserFlag: false, // 删除会员确认弹框
      delSoaUserData: '', // 删除频道会员用户信息
      isNumber: true, // 输入的账户是否为数字
    }
  },
  created () {
    this.sureBtnIsShow = false;
  },
  mounted () {
    this.tabChange(this.tabIndex);
  },
  methods: {
    addUser () {   // 添加用户
      if (!this.curSubjectId || !this.soaUserColData.soaUserAccount || !this.isNumber) {
        if (!this.isNumber) {
          this.$refs.soaUserAccount.vaildTrigger(false, '请输入数字');
        }
        return;
      }
      this.$ajax({
        url: DI.authoritymgt.addSoaUser,
        data: JSON.stringify({
          channelId: +this.curSubjectId,
          soaUserId: `${this.soaUserColData.soaUserAccount}`,
        }),
        type: 'POST',
        context: this,
        success: (res) => {
          if (res.retCode === SERVER_OK) {
            this.soaUserColData.soaUserAccount = "";
            this.querySoaUserBySubjectId(this.curSubjectId);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    authoritymgtModelShow (rowItem) { // 权限管理弹框显示
      this.authorityMgtPopFlag = true;
      this.curThemeName = rowItem.subjectName;
      this.curSubjectId = rowItem.subjectId;
      this.curPubFlag = +rowItem.permissionStatus === 1 ? true : false;
      if (!this.curPubFlag) {
        this.querySoaUserBySubjectId(this.curSubjectId);
      }
    },
    querySoaUserBySubjectId (subjectId) { // 根据频道ID查询会员用户
      if (subjectId) {
        this.$ajax({
          url: DI.authoritymgt.queryUserOfSubject + "?subjectId=" + subjectId,
          context: this,
          type: 'GET',
          success: (res) => {
            if (res.retCode === SERVER_OK) {
              this.soaUserList = res.data.soaUserList || [];
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.error('error');
          }
        });
      } else {

      }
    },
    authorityMgtPopHide () { //权限管理弹框隐藏方法
      //$("#remidNumTip").hide();
      let soaUserColData = this.soaUserColData;
      soaUserColData.soaUserAccount = '';
      this.$refs.soaUserAccount.resetField();
      this.authorityMgtPopFlag = false;
    },
    submitVideoCol () {
      this.$ajax({
        url: DI.authoritymgt.saveSubjectPermissionStatus,
        data: JSON.stringify({
          subjectId: this.curSubjectId,
          permissionStatus: this.curPubFlag ? 1 : 2,
        }),
        method: 'POST',
        context: this,
        success: (res) => {
          if (res.retCode === SERVER_OK) {
            this.$message.success("保存成功！");
            this.authorityMgtPopHide();
            this.querySubjectList();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    querySubjectList () { //频道权限查询
      let _self = this;
      console.log(_self.tabIndex);
      this.$ajax({
        url: DI.authoritymgt.querySubjectList,
        data: JSON.stringify({
          subjectType: _self.tabIndex,
          subjectName: _self.searchFilters.themeName,
          pageIndex: (_self.pageInfo.pageIndex-1)*_self.pageInfo.pageSize,
          pageSize: _self.pageInfo.pageSize,
        }),
        method: 'POST',
        context: this,
        success: (res) => {
          if (res.retCode === SERVER_OK) {
            let resData = res.data;
            _self.subjectList = resData.subjectList || []; //权限列表
            this.pageInfo.total = resData.subjectCount || 0;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    tabChange (index) { // tab切换方法
      this.searchFilters.themeName = '';
      this.tabIndex = index;
      this.pageInfo.pageIndex = 1;
      this.querySubjectList();
    },
    goto (num) {
      this.pageInfo.pageIndex = num;
      this.querySubjectList();
    },
    showDelSoaUserConfirm (row) { // 删除频道会员
      this.delSoaUserFlag = true;
      this.delSoaUserData = row;
    },
    hideDelVideoConfirm () { // 删除赛事视频楼层隐藏
      this.delSoaUserFlag = false;
    },
    // 输入账户不能输入数字的校验
    soaUserChangeHandler (val) {
      let regexp = /^\d+$/;
      let result = regexp.test(val);
      if (!result) {
        this.$refs.soaUserAccount.vaildTrigger(false, '请输入数字');
        this.isNumber = false;
      } else {
        this.isNumber = true;
        this.$refs.soaUserAccount.resetField();
        this.soaUserColData.soaUserAccount = val;
      }
    }
    ,
    delSoaUser () { // 删除用户
      let _self = this;
      _self.delSoaUserFlag = false;
      this.$ajax({
        url: DI.authoritymgt.deleteSoaUser,
        data: JSON.stringify({
          id: +this.delSoaUserData.id,
          soaUserId: `${this.delSoaUserData.soaUserId}`,
        }),
        context: this,
        type: 'POST',
        success: (res) => {
          if (res.retCode === SERVER_OK) {
            this.$message.success("删除成功！");
            _self.querySoaUserBySubjectId(this.curSubjectId);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    }
  },
  watch: {
    curPubFlag() {
      if (!this.curPubFlag) {
        this.querySoaUserBySubjectId(this.curSubjectId);
      }
    },
  },
}
</script>
