<template>
  <div class="container">
    <sn-topbar title="入驻审核">
      <!-- <span slot="subtitle">频道名称: {{channel.channelName}} 频道ID: {{channel.channelId}}</span> -->
    </sn-topbar>
    <div>
      <section class="ibox between">
        <div class="search-box">
          <div class="contentBox">
            <span class="text">申请时间</span>
            <sn-timer v-model="startTimeApp" ref="startTime" placeholder="起始时间" :maxDate="endTimeApp"></sn-timer>
            <span class="timeClass">至</span>
            <sn-timer v-model="endTimeApp" ref="startTime" placeholder="起始时间" :minDate="startTimeApp" :maxDate="endTime"></sn-timer>
            <span class="text" style="margin-left: 20px;">审核时间</span>
            <sn-timer v-model="startTimeEx" ref="startTime" placeholder="起始时间" :maxDate="endTimeEx"></sn-timer>
            <span class="timeClass">至</span>
            <sn-timer v-model="endTimeEx" ref="startTime" placeholder="起始时间" :minDate="startTimeEx"></sn-timer>
          </div>
          <div class="contentBox">
            <sn-input class="adv-title" width="178" radius="16" v-model="formData.authorId" placeholder="请输入作者ID" :maxlength="30" style="margin-right: 30px"></sn-input>
            <sn-input class="adv-title" width="178" radius="16" v-model="formData.authorName" placeholder="请输入作者名称" style="margin-right: 30px" :minlength="4" :maxlength="20" autoValid></sn-input>
          </div>
          <div class="time-box">
            <span class="text">媒体类型</span>
            <sn-select v-model="formData.authorType" ref="select" placeholder="全部" radius="16" width="120" @change="handleAuthorType" class="jump-type">
              <sn-option v-for="item in authorTypeList" :key="item.key" :name="item.name" :value="item.value" :disabled="item.disabled">
              </sn-option>
            </sn-select>
            <span class="text">申请状态</span>
            <sn-select v-model="formData.applyStatus" ref="select" placeholder="全部" radius="16" width="120" @change="handleApplyType" class="jump-type">
              <sn-option v-for="item in applyList" :key="item.key" :name="item.name" :value="item.value" :disabled="item.disabled">
              </sn-option>
            </sn-select>
          </div>
        </div>
        <div>
          <div style="margin-bottom: 20px">
            <sn-button type="primary" @click="queryContentPage">查询</sn-button>
          </div>
          <div>
            <sn-button type="outline reset-button" @click="reset">重置</sn-button>
          </div>
        </div>
      </section>
      <sn-table :data="authorList" ref="table2">
        <sn-table-column label="作者信息" prop="authorName" width="200" align="center" sloted>
          <template slot-scope="row">
            <img class="headPic" :src="row.headPic" alt="" width="60" height="60">
            <ul class="introduceBox">
              <li>{{row.authorName}}</li>
              <li>ID：{{row.authorId}}</li>
              <li :title="row.introduction" class="introduce">{{row.introduction}}</li>
            </ul>
          </template>
        </sn-table-column>
        <sn-table-column label="作者类型" prop="showType" width="100" align="center" sloted>
          <template slot-scope="row">
            <span v-if="row.showType == 2">机构用户</span>
            <span v-if="row.showType == 4">个人用户</span>
          </template>
        </sn-table-column>
        <sn-table-column label="申请时间" prop="applyTime" width="150" align="center"></sn-table-column>
        <sn-table-column label="审核时间" prop="auditTime" width="150" align="center"></sn-table-column>
        <sn-table-column label="申请状态" prop="status" width="100" align="center" sloted>
          <template slot-scope="row">
            <span v-if="row.status == 1">待审核</span>
            <span v-if="row.status == 4">已驳回</span>
          </template>
        </sn-table-column>
        <sn-table-column label="操作" prop="status" width="100" align="center" sloted>
          <template slot-scope="row">
            <div class="is-column">
              <div style="margin-bottom:10px">
                <p class="operaMore" v-if="row.status == 1">
                  <a href="javascript:;" class="operaBtns" @click="confirmShow(row)">审核</a>
                </p>
                <p class="operaMore" v-if="row.status == 4">
                  <a href="javascript:;" class="operaBtns" @click="confirmShow(row)">查看</a>
                </p>
              </div>
            </div>
          </template>
        </sn-table-column>
      </sn-table>
      <sn-pagination ref="advPageTurn" :total="dataTotal" :size="pageSize" @goto="contentGoto" />
    </div>
  </div>
</template>
<script>
import DI from 'interface';
import * as Constant from 'js/constant';
export default {
  data() {
    return {
      tabIndex: 0,
      addNumberFlag: false,
      authorList: [],
      commentFlag: false,
      virtualUserList: null,
      formData: {
        authorId: '',
        authorName: '',
        authorType: '',
        applyStatus: ''
      },
      accountData: {
        numberID: '',
        labelUserName: ''
      },
      pageIndex: 0,
      pageSize: 20,
      dataTotal: 0,
      startTimeApp: '',
      startTimeEx: '',
      endTimeApp: '',
      endTimeEx: '',
      showType: '',
      startTime: '',
      status: '',
      authorTypeList: [
        {
          key: 'all',
          value: '',
          name: '全部'
        },
        {
          key: 'start',
          value: 4,
          name: '个人用户'
        },
        {
          key: 'outfit',
          value: 2,
          name: '机构用户'
        }
      ],
      applyList: [
        {
          key: 'start',
          value: '',
          name: '全部'
        },
        {
          key: 'outfit',
          value: 1,
          name: '待审核'
        },
        {
          key: 'start',
          value: 4,
          name: '已驳回'
        }
      ]
    };
  },
  mounted() {
    this.queryContentPage();
  },
  methods: {
    queryChannel() {
      this.$ajax({
        url: DI.g_comment.queryChannel,
        data: JSON.stringify({}),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.channelList = res.data.channelList || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    handleAuthorType(val) {
      this.formData.authorType = val;
      this.queryContentPage();
    },
    handleApplyType(val) {
      this.formData.applyStatus = val;
      this.queryContentPage();
    },
    contentGoto(num) {
      this.pageIndex = num;
      this.queryContentPage(num);
      window.scrollTo(0, 0);
    },
    queryUsers() {
      this.$ajax({
        url: DI.g_comment.queryUsers,
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.virtualUserList = res.data.virtualUserList || [];
            if (this.virtualUserList.length > 9) {
              this.unClick = 'disabled';
            } else {
              this.unClick = null;
            }
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    queryContentPage(pageNum) {
      let ajaxData = {};
      if (pageNum == 0) {
        this.pageIndex = pageNum;
        globalBus.$emit('syncCurPage', 1);
      }
      this.pageIndex = pageNum ? (pageNum - 1) * this.pageSize : 0;
      ajaxData = {
        auditEndTime: this.endTimeEx,
        auditStartTime: this.startTimeEx,
        authorId: this.formData.authorId,
        authorName: this.formData.authorName,
        endTime: this.endTimeApp,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
        showType: this.formData.authorType,
        startTime: this.startTimeApp,
        status: this.formData.applyStatus
      };
      this.$bus.deleteNullProperty(ajaxData);
      this.pageIndex = pageNum ? (pageNum - 1) * this.pageSize : 0;
      this.$ajax({
        url: DI.examine.authorAuditList,
        data: JSON.stringify(ajaxData),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.authorList = res.data.authorList || [];
            this.dataTotal = res.data.authorListNum || 0;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    reset() {
      this.formData = {
        authorId: '',
        authorName: ''
      };
      this.startTimeApp = '';
      this.startTimeEx = '';
      this.endTimeApp = '';
      this.endTimeEx = '';
    },
    confirmShow(row) {
      let authorId = row.authorId;
      this.$ajax({
        url: DI.examine.authorAuditDetail,
        data: JSON.stringify({
          authorId: authorId
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.$emit('input', res.data);
            this.$emit('change-view', 'content');
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    }
  }
};
</script>
<style scoped>
.container {
  .ibox {
    display: flex;
    align-items: center;
    height: auto;
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
        .dropdown-list {
          top: -10px;
        }
        .text {
          margin-right: 10px;
        }
        .jump-type {
          margin-right: 20px;
        }
      }
      .input-box {
        margin-bottom: -10px;
      }
      .contentBox {
        display: flex;
        align-items: center;
        height: 30px;
        font-size: 12px;
        color: #999999;
        margin: 20px 0 10px 0;
        .text {
          margin-right: 10px;
        }
      }
    }
  }
}
.labelName {
  display: block;
  text-align: left;
  width: 250px;
  height: 32px;
  line-height: 32px;
  background: lightgrey;
  border-radius: 4px;
  padding-left: 10px;
}
.operaMore {
  margin: 5px;
  .operaBtns {
    color: #1684c2;
  }
}
.errTips {
  color: red;
  font-size: 12px;
  position: relative;
  top: -10px;
  left: -100px;
}
.timeClass {
  margin: 0 10px;
}
.introduce {
  overflow: hidden;
  text-overflow: ellipsis;
  display: box;
  display: -webkit-box;
  box-orient: vertical;
  /*! autoprefixer: off; */
  -webkit-box-orient: vertical;
  /*autoprefixer: on;*/
  line-clamp: 2;
  -webkit-line-clamp: 2;
  letter-spacing: 3px;
  line-height: 1.8;
}
.headPic {
  border-radius: 50%;
}
.introduceBox {
  margin-left: 10px;
  width: 130px;
}
</style>
