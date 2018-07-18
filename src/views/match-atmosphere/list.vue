<template>
  <div class="container">
    <sn-topbar title="赛事氛围"></sn-topbar>
    <div>
      <section class="ibox">
        <sn-button type="outline reset-button" @click="addComfire" class="setBtn">创建氛围</sn-button>
        <sn-button type="outline reset-button" @click="addLiveComfire" class="setBtn">创建直播浮层</sn-button>
        <sn-button type="outline reset-button" @click="addIconComfire" class="setBtn">创建ICON</sn-button>
        <sn-button type="outline reset-button" @click="addFaceBComfire" class="setBtn">创建B面氛围</sn-button>
      </section>
      <sn-table :data="atmosphereList" ref="table2">
        <sn-table-column label="用户自定义名称" prop="activityName" width="200"></sn-table-column>
        <sn-table-column label="活动类型" prop="matchInfo" width="200" sloted>
          <template slot-scope="row">
            <span>{{handleActivityType(row)}}</span>
          </template>
        </sn-table-column>
        <sn-table-column label="比赛时间" prop="matchTime" width="130" align="center"></sn-table-column>
        <sn-table-column label="开始时间" prop="startTime" width="130" align="center">
        </sn-table-column>
        <sn-table-column label="结束时间" prop="endTime" width="130" align="center"></sn-table-column>
        <sn-table-column label="发布时间" prop="createTime" width="130" align="center"></sn-table-column>
        <sn-table-column label="状态" prop="status" width="100" align="center" sloted>
          <template slot-scope="row">
            <span v-if="row.status == 1">未开始</span>
            <span v-if="row.status == 2">展示中</span>
            <span v-if="row.status == 3">已结束</span>
            <span v-if="row.status == 4">已撤回</span>
          </template>
        </sn-table-column>
        <sn-table-column label="操作" prop="status" width="100" align="center" sloted>
          <template slot-scope="row">
            <a style="color: #1684C2" v-if="row.status == 1 || row.status == 2" @click="editConfirm(row)">编辑</a>
            <a style="color: #666" v-if="row.status == 3 || row.status == 4">编辑</a>
          </template>
        </sn-table-column>
      </sn-table>
      <sn-pagination ref="advPageTurn" :total="dataTotal" :size="pageSize" @goto="contentGoto" />
      <!-- 创建氛围弹框 -->
      <set-atm-dialog :matchFlag.sync="matchFlag"></set-atm-dialog>
      <!-- 创建直播浮层弹框 -->
      <set-live-dialog :matchLiveFlag.sync="matchLiveFlag"></set-live-dialog>
      <!-- 创建ICON弹框 -->
      <set-icon-dialog :matchIconFlag.sync="matchIconFlag"></set-icon-dialog>
      <!--创建B面氛围弹框-->
      <setb-atm-dialog :matchFaceBFlag.sync="matchFaceBFlag"></setb-atm-dialog>
      <edit-atm-dialog :matchFlagEdit.sync="matchFlagEdit" :skinId.sync="skinAtmId"></edit-atm-dialog>
      <edit-live-dialog :matchLiveFlagEdit.sync="matchLiveFlagEdit" :skinId.sync="skinLiveId"></edit-live-dialog>
      <edit-icon-dialog :matchIconFlagEdit.sync="matchIconFlagEdit" :skinId.sync="skinIconId"></edit-icon-dialog>
      <editb-atm-dialog :matchFlagBEdit.sync="matchFlagBEdit" :skinId.sync="skinBAtmId"></editb-atm-dialog>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import DI from 'interface';
import * as Constant from 'js/constant';
import SetAtmDialog from './confirm/set-atm-dialog';
import SetIconDialog from './confirm/set-icon-dialog';
import SetLiveDialog from './confirm/set-live-dialog';
import SetbAtmDialog from './confirm/set-batm-dialog';
import EditAtmDialog from './confirm/edit-atm-dialog';
import EditIconDialog from './confirm/edit-icon-dialog';
import EditLiveDialog from './confirm/edit-live-dialog';
import EditbAtmDialog from './confirm/edit-batm-dialog';
export default {
  props: {},
  components: {
    SetAtmDialog,
    SetIconDialog,
    SetLiveDialog,
    EditIconDialog,
    EditLiveDialog,
    EditAtmDialog,
    SetbAtmDialog,
    EditbAtmDialog
  },
  data() {
    return {
      atmosphereList: [],
      pageIndex: 0, //默认是1
      pageSize: 20, //默认是20
      dataTotal: 0, //查询出来的数据条数
      matchFlag: false,
      matchLiveFlag: false,
      matchIconFlag: false,
      matchFlagEdit: false,
      matchFaceBFlag: false,
      matchFlagBEdit: false,
      matchIconFlagEdit: false,
      matchLiveFlagEdit: false,
      matchitemShowId: '',
      skinDownloadUrl: '',
      matchItemInfo: {
        matchDes: '',
        matchTime: ''
      },
      jumpType: 0,
      jumpUrl: '',
      showPicFlag: true,
      confirmLabel: '',
      imgList: [],
      imgObj: {},
      flagLabel: '',
      showError: false,
      jumpUrl: '',
      skinBAtmId: '',
      skinAtmId: '',
      skinLiveId: '',
      skinIconId: ''
    };
  },
  mounted() {
    this.queryList();
  },
  watch: {
    matchFlag(newValue) {
      if (!newValue) {
        this.reset();
      }
    },
    matchLiveFlag(newValue) {
      if (!newValue) {
        this.reset();
      }
    },
    matchIconFlag(newValue) {
      if (!newValue) {
        this.reset();
      }
    },
    matchFlagEdit(newValue) {
      if (!newValue) {
        this.reset();
      }
    },
    matchFlagBEdit(newValue) {
      if (!newValue) {
        this.reset();
      }
    },
    matchIconFlagEdit(newValue) {
      if (!newValue) {
        this.reset();
      }
    },
    matchLiveFlagEdit(newValue) {
      if (!newValue) {
        this.reset();
      }
    }
  },
  methods: {
    handleActivityType(row) {
      let typeName = '';
      if (row.skinType == 2) {
        typeName = 'B面氛围';
      } else {
        if (row.activityType == 1) {
          typeName = '氛围皮肤';
        } else if (row.activityType == 2) {
          typeName = '直播浮层';
        } else if (row.activityType == 3) {
          typeName = '单个ICON';
        }
      }
      return typeName;
    },
    queryList(pageNum) {
      if (pageNum == 0) {
        this.pageIndex = pageNum;
        this.$bus.$emit('syncCurPage', 1);
      }
      let params = {};
      params.pageIndex = pageNum ? (pageNum - 1) * this.pageSize : 0;
      params.pageSize = this.pageSize;
      params = this.$bus.deleteNullProperty(params);
      this.$ajax({
        url: DI.atmosphere.faceBQueryList,
        data: JSON.stringify(params),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.atmosphereList = res.data.list || [];
            this.dataTotal = res.data.count || 0;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    contentGoto(num) {
      this.pageIndex = num;
      this.queryList(num);
      window.scrollTo(0, 0);
    },
    editConfirm(row) {
      if (row.skinType == 2) {
        //B面
        this.matchFlagBEdit = true;
        this.skinBAtmId = row.skinId;
      } else {
        //A面
        let activityType = row.activityType;
        if (activityType == 1) {
          this.matchFlagEdit = true;
          this.skinAtmId = row.skinId;
        } else if (activityType == 2) {
          this.matchLiveFlagEdit = true;
          this.skinLiveId = row.skinId;
        } else if (activityType == 3) {
          this.matchIconFlagEdit = true;
          this.skinIconId = row.skinId;
        }
      }
    },

    addComfire() {
      this.matchFlag = true;
      this.showPicFlag = true;
      this.skinAtmId = '';
      this.skinLiveId = '';
      this.skinIconId = '';
    },
    addFaceBComfire() {
      this.matchFaceBFlag = true;
    },
    addLiveComfire() {
      this.matchLiveFlag = true;
    },
    addIconComfire() {
      this.matchIconFlag = true;
    },
    saveLiveBtn() {
      this.matchLiveFlag = false;
    },
    saveIconBtn() {
      this.matchIconFlag = false;
    },
    cancelLiveBtn() {
      this.matchLiveFlag = false;
    },
    cancelIconBtn() {
      this.matchIconFlag = false;
    },
    reset() {
      this.showError = false;
      this.matchFlag = false;
      this.matchLiveFlag = false;
      this.programShow = false;
      this.jumpUrlShow = false;
      this.matchItemInfo = {
        matchDes: '',
        matchTime: ''
      };
      this.matchitemShowId = '';
      this.imgList = [];
      this.jumpUrl = '';
      this.jumpType = 0;
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
.labelShow {
  width: 60px;
}
.editTimes {
  font-size: 12px;
  position: relative;
  top: -3px;
}
.file {
  position: relative;
  display: inline-block;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  padding: 4px 12px;
  overflow: hidden;
  color: #666;
  text-decoration: none;
  text-indent: 0;
  line-height: 20px;
}
.file input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
}
.labelTips {
  height: 62px;
  line-height: 62px;
}
.setBtn {
  margin-right: 30px;
}
</style>
