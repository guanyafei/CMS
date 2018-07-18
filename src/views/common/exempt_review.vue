<style scoped>
.container {
  .ibox {
    display: flex;
    padding: 0 20px;
    background: #fff;
    margin-bottom: 10px;
    align-items: center;
    min-height: 72px;
    &.end {
      justify-content: flex-end;
    }
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
  .remind-text {
    padding-bottom: 6px;
    height: 18px;
    font-size: 12px;
    color: #f00;
    text-align: center;
  }
  .scroll-container {
    overflow: hidden;
  }
  .gray-tab {
    width: 100%;
  }
  .btn-group {
    text-align: center;
    .cancel-btn {
      margin-left: 30px;
    }
  }
  .goback {
    font-size: 20px;
    color: #000;
    position: absolute;
    top: 23px;
    left: 12px;
  }
  .title {
    padding-left: 26px;
  }
}
</style>
<template>
  <div class="container">
    <a v-if="channelId" href="javascript:;">
      <span slot="subtitle" class="goback" @click="goback">←</span>
    </a>
    <sn-topbar class="title" title="免审名单"></sn-topbar>
    <div class="ibox end">
      <div class="search-btns">
        <sn-button type="outline" @click="addExreview()">添加免审名单</sn-button>
      </div>
    </div>
    <sn-table :data='freeTriallist' ref='table'>
      <sn-table-column label='作者ID' prop="authorId" width='260'></sn-table-column>
      <sn-table-column label='作者名称' prop='authorName' align='left'></sn-table-column>
      <sn-table-column label='操作' width="130" sloted>
        <template slot-scope="row">
          <a href="javascript:;" @click="showDelConf(row.id)">删除</a>
        </template>
      </sn-table-column>
    </sn-table>
    <sn-pagination :total="listCount" :size="pageSize" @goto="goto" />
    <sn-confirm ref="matchModal" title='添加免审名单' txt :flag="addFlag">
      <div style="width: 640px;">
        <div class="form-item" style="padding: 0 30px;">
          <label class="form-item__label" style="width: 80px;">添加作者</label>
          <div style="margin-left: 80px;display: flex;align-items: center;justify-content: space-between;">
            <sn-input placeholder="请输入作者ID精确查找" v-model="authorId" width="360" />
            <sn-button type="primary" @click="queryAuthorList">搜索作者</sn-button>
          </div>
        </div>

        <sn-scroll-loader :distance="-73" ref="loader">
          <thead class="bg-gray">
            <tr>
              <th>操作</th>
              <th>作者名称</th>
              <th>作者ID</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="authorInfo.authorId">
              <td>
                <sn-checkbox v-model="checkedIndex" theme="radio">&nbsp;</sn-checkbox>
              </td>
              <td>{{authorInfo.authorName}}</td>
              <td>{{authorInfo.authorId}}</td>
            </tr>
          </tbody>
        </sn-scroll-loader>
        <div class="remind-text" v-show="remindShow">{{remindInfo}}</div>
      </div>
      <div slot="btn-group" class="btn-group">
        <sn-button size="mini" type="primary" @click="addAuthor" :disabled="!checkedIndex">添加</sn-button>
        <sn-button size="mini" @click="addClose" class="cancel-btn">取消</sn-button>
      </div>
    </sn-confirm>
    <sn-confirm txt ref="delConfirm" :flag="delConfFlag" @sure="delFreeTrial(delId)" @close="hideDelConf">确定要删除吗？</sn-confirm>
  </div>
</template>
<script>
import DI from 'interface';
export default {
  props: {
    channelId: {
      type: String,
      default: ''
    },
    subjectType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      addFlag: false,
      authorId: '', //作者Id(用户输入)
      authorList: [], //查询出来的作者列表
      authorInfo: {}, //查询出来的作者信息
      aPageNum: 1, //作者列表页码
      count: 0,
      delId: '', //删除免审作者Id
      freeTriallist: [], //免审名单列表
      listCount: 50, //获取的数据总条数
      pageIndex: 1, //当前页
      pageSize: 20, //每页纪录数
      checkedIndex: false, //作者是否选中（添加免审弹框
      remindShow: false, //提示显示
      remindInfo: '', //提示信息
      delConfFlag: false //删除弹框开关
    };
  },
  created() {},
  methods: {
    goback() {
      this.$parent.viewType = 'list';
      this.$parent.themeIndex = parseInt(this.subjectType) - 1;
      this.$parent.subjectType = parseInt(this.subjectType);
    },
    showDelConf(id) {
      //删除弹框显示
      this.delConfFlag = true;
      this.delId = id;
    },
    hideDelConf() {
      //删除弹框隐藏
      this.delConfFlag = false;
    },
    delFreeTrial(id) {
      //免审名单删除
      this.$ajax({
        url: DI.channel.delFreeTrial,
        data: JSON.stringify({
          id: id //免审名单主键Id
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('删除成功！');
            this.getFreeList(1);
          } else {
            this.remindInfo = res.retMsg;
            this.remindShow = true;
          }
        },
        error: () => {
          console.error('error');
        }
      });
      this.hideDelConf();
    },
    addExreview() {
      this.addFlag = true;
    },
    addClose() {
      this.authorId = '';
      this.authorInfo = '';
      this.remindShow = false;
      this.checkedIndex = false;
      this.addFlag = false;
    },
    addAuthor() {
      //添加免审作者
      let authorInfo = this.authorInfo;
      this.$ajax({
        url: DI.channel.saveFreeTrial,
        data: JSON.stringify({
          authorId: authorInfo.authorId, //作者Id
          channelId: this.channelId
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('添加成功！');
            this.addClose();
            this.getFreeList(1);
          } else {
            this.remindInfo = res.retMsg;
            this.remindShow = true;
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    getFreeList(pageIndex) {
      //查询免审列表
      this.$ajax({
        url: DI.channel.queryFreeTrial,
        data: JSON.stringify({
          channelId: this.channelId, //频道Id
          pageIndex: (this.pageIndex - 1) * this.pageSize,
          pageSize: this.pageSize
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            this.freeTriallist = resData.freeTriallist || [];
            this.listCount = resData.freeTrialNum || 0;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    queryAuthorList() {
      //查询作者列表(根据作者ID)
      this.remindShow = false;
      this.$ajax({
        url: DI.authorLibrary.queryAuthorInfo,
        data: JSON.stringify({
          authorId: this.authorId //作者Id
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.authorInfo = res.data || {};
            let authorInfo = this.authorInfo;
            if (!authorInfo.authorId) {
              this.$message.warning('未查询到数据！');
            }
            this.checkedIndex = false;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    goto(val) {
      this.getFreeList(val);
      this.pageIndex = val;
    }
  },
  mounted() {
    this.getFreeList(1);
    if (this.authorList.length < 21) {
      this.$refs.loader.complete = true;
    }
  }
};
</script>
