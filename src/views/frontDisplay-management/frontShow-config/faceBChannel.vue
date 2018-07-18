<template>
  <div id="list">
    <sn-button type="outline" class="add-channel" @click="addChannel">添加频道</sn-button>
    <div class="switch-status">
      <span class="switch-txt">B面开关</span>
      <sn-radio-group v-model="switchVal" @change="handleSwitchChange">
        <sn-radio :label="0">关闭</sn-radio>
        <sn-radio :label="1">开启非默认</sn-radio>
        <sn-radio :label="2">开启并默认</sn-radio>
      </sn-radio-group>
      <sn-button class="entrance-config" type="outline" @click="handleEntranceConfig">入口配置</sn-button>
    </div>
    <sn-datatable :data="faceBList" :border="true">
      <sn-datacolumn label="频道排序" prop="index" width="10%"></sn-datacolumn>
        <sn-datacolumn label="频道ID" prop="channelId" width="10%"></sn-datacolumn>
      <sn-datacolumn label="频道名称" prop="channelName" width="20%"></sn-datacolumn>
      <sn-datacolumn label="频道类型" prop="channelType" width="10%"></sn-datacolumn>
      <sn-datacolumn label="频道信息" prop="channelInfo" width="20%"></sn-datacolumn>
      <sn-datacolumn label="展示角标" prop="mark" width="20%"></sn-datacolumn>
      <sn-datacolumn label="操作" prop="opt" width="10%"></sn-datacolumn>
      <template slot-scope="cell" slot="index">
        <span>{{(pageIndex - 1) * pageSize + cell.index + 1}}</span>
      </template>
      <template slot-scope="cell" slot="channelType">
        {{handleConvertChannelType(cell.row.channelType,cell.row.subjectType)}}
      </template>
      <div slot-scope="cell" slot="channelInfo">
        <!--主题-->
        <template v-if="cell.row.channelType == 2">
          <p>主题ID:{{cell.row.subjectId}}</p>
          <p style="margin-top:10px;">{{cell.row.subjectName}}</p>
        </template>
        <!--短视频-->
        <!--url-->
        <template v-if="cell.row.channelType == 4">
          <p>{{cell.row.jumpUrl}}</p>
        </template>
        <!--赛事赛程和赛事积分榜-->
        <template v-if="cell.row.channelType == 6 || cell.row.channelType == 7">
          <p>比赛ID:{{cell.row.matchId}}</p>
          <p style="margin-top:10px;">{{handleMatchName(cell.row)}}</p>
        </template>
      </div>
      <template slot-scope="cell" slot="opt">
        <div class="is-column">
          <p class="btn-style">
            <sn-button class="mt-8" type="text" @click="editBChannel(cell.row)">编辑</sn-button>
            <sn-button v-if="cell.row.channelType != 0" type="text" @click="delBChannel(cell.row)">删除</sn-button>
          </p>
          <p class="btn-style">
            <sn-button class="mt-8" v-if="getUpExchange(cell)" type="text" @click="moveBChannel(cell.row,1)">上移</sn-button>
            <sn-button v-if="getDownExchange(cell)" type="text" @click="moveBChannel(cell.row,2)">下移</sn-button>
          </p>
          <p class="btn-style">
            <sn-button type="text" @click="setMark(cell.row)">角标设置</sn-button>
          </p>
        </div>
      </template>
    </sn-datatable>
    <sn-pagination @goto="goto" :total="totalCount" :size="pageSize"></sn-pagination>
    <sn-confirm txt ref="faceBConfirm" :title="channelTitle" @sure="faceBSure('formData')" :flag="addChannelFlag" @close="faceBClose" closeIcon confirmButtonText="保存">
      <sn-form :model="formData" :rules="rules" ref="formData" label-width="80px" formWidth="400">
        <sn-form-item label="频道类型" prop="channelType">
          <sn-select v-model="formData.channelType" @change="handleChannelTypeChange" :disabled="editTypeDisabled" width="320">
            <sn-option v-for="item in channelBTypeList" :key="item.key" :name="item.name" :value="item.value" :disabled="item.disabled"></sn-option>
          </sn-select>
        </sn-form-item>
        <div v-if="formData.channelType == 2">
          <sn-form-item label="查询主题" prop="subjectId">
            <sn-input v-model="formData.subjectId" width="320" placeholder="请输入主题ID" @blur="changeID(formData.subjectId)" :reg="/^\d+$/" hint="请输入数字" autoValid></sn-input>
          </sn-form-item>
          <sn-form-item label="主题信息" prop="themeInfo">
            <sn-input :disabled="true" v-model="formData.themeInfo" width="320" placeholder=""></sn-input>
          </sn-form-item>
          <p class="errTips" v-if="remindMsgFlag">请输入正确的主题ID</p>
        </div>
        <div v-if="formData.channelType == 6 || formData.channelType == 7">
          <div class="section-match">
            <span class="match-txt">选择赛事</span>
            <sn-select style="margin-right:5px" v-model="competitionVal" @change="handleCompetitionChange" width="160" :placeholder="sportPlaceHolder">
              <sn-option v-for="item in competitionList" :key="item.sportItemId" :name="item.sportItemName" :value="item.sportItemId" :disabled="item.disabled"></sn-option>
            </sn-select>
            <sn-select :disabled="competitionVal == ''" v-model="scheduleVal" @change="handleScheduleChange" width="155" :placeholder="matchPlaceHolder">
              <sn-option v-for="item in scheduleList" :key="item.competitionId" :name="item.competitionName" :value="item.competitionId" :disabled="item.disabled"></sn-option>
            </sn-select>
          </div>
          <p class="remind-msg" v-if="remindError">请选择赛事</p>
        </div>
        <sn-form-item label="频道名称" prop="channelName">
          <sn-input v-model="formData.channelName" width="320" placeholder="频道名称(10个字以内)" :maxlength="10" showWord="true" totalWords="10"></sn-input>
        </sn-form-item>
        <div v-if="formData.channelType == 4">
          <sn-form-item label="URL" prop="url">
            <sn-input v-model="formData.url" width="320" placeholder="输入链接"></sn-input>
          </sn-form-item>
        </div>

      </sn-form>
    </sn-confirm>
    <!--角标设置-->
    <sn-confirm txt ref="setMarkConfirm" title="角标设置" @sure="setMarkSure" :flag="setMarkFlag" @close="hideMark">
      <sn-form :model="markData" ref="markForm" :rules="markRule" label-width="120px" formWidth="350">
        <sn-form-item label="角标展示" prop="name" ref="nameItem">
          <sn-input placeholder="请输入角标名" v-model="markData.name" width="220" maxlength="4"></sn-input>
        </sn-form-item>
      </sn-form>
    </sn-confirm>

    <!--删除框-->
    <sn-confirm txt @sure="delSure" @close="delClose" :flag="delFlag">确定要删除吗?</sn-confirm>
    <!--入口配置弹框-->
    <set-entrance-config :dialogVisible.sync="dialogVisible"></set-entrance-config>
    <!--B面开关弹框-->
    <sn-confirm txt @sure="switchSure" @close="switchClose" :flag="switchBFlag">确定要配置吗?</sn-confirm>
  </div>
</template>
<script>
import DI from 'interface';
import * as Constant from 'js/constant';
import Message from 'components/new-frame/message';
import Http from 'utils/http';
import SetEntranceConfig from './set-entrance-config';
export default {
  components: {
    SetEntranceConfig
  },
  data() {
    let validateUrl = (rule, value, callback) => {
      if (!/^(http|https):\/\//.test(value)) {
        callback(new Error('url需为：http://或https://开头'));
      }
      callback();
    };

    return {
      count: 0,
      sportPlaceHolder: '选择运动',
      matchPlaceHolder: '选择赛事',
      curItem: {},
      remindMsgFlag: false,
      switchBFlag: false,
      subjectTypeList: Constant.SUBJECT_TYPE_LIST,
      imgObject: {
        inLogo: '',
        outLogo: ''
      },
      dialogVisible: false,
      entranceFlag: false,
      switchVal: 0, //B面开关 默认关闭
      remindError: false,
      competitionVal: '',
      scheduleVal: '',
      competitionList: [], //赛事列表
      scheduleList: [], //赛程列表
      editTypeDisabled: false,
      channelTitle: '添加频道',
      channelBTypeList: Constant.CHANNELB_TYPE_LIST,
      delFlag: false,
      addChannelFlag: false,
      setMarkFlag: false,
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      markRule: {
        name: {
          max: 4,
          min: 2,
          message: '长度在 2 到 4 个字符',
          trigger: 'change'
        }
      },
      rules: {
        channelType: [
          {
            required: true,
            type: 'number',
            message: '请选择频道类型',
            trigger: 'change'
          }
        ],
        channelName: [
          {
            required: true,
            message: '请选择频道名称',
            trigger: 'change'
          }
        ],
        subjectId: [
          {
            required: true,
            message: '主题ID不能为空',
            trigger: 'change'
          }
        ],
        url: [
          {
            required: true,
            message: 'url不能为空',
            trigger: 'change'
          },
          {
            validator: validateUrl,
            trigger: 'change'
          }
        ]
      },
      markData: {
        name: ''
      },
      formData: {
        channelType: '',
        channelName: '',
        subjectId: '',
        themeInfo: '', //主题信息
        url: ''
      },
      faceBList: []
    };
  },
  mounted() {
    this.queryList();
    this.getCompetitionList();
    this.querySwitch(); //查询B面开关
  },
  methods: {
    getUpExchange(cell) {
      return (this.pageIndex - 1) * this.pageSize + cell.index != 0;
    },
    getDownExchange(cell) {
      return (this.pageIndex - 1) * this.pageSize + cell.index != this.totalCount - 1;
    },
    handleSwitchChange(val) {
      if (this.count == 0) {
        this.switchBFlag = false;
      } else {
        this.switchBFlag = true;
      }
      this.count++;
      this.switchVal = val;
    },
    switchClose() {
      this.count = 0;
      let switchVal = localStorage.getItem('switchVal');
      if (switchVal) {
        this.switchVal = switchVal;
      }
      this.switchBFlag = false;
    },
    switchSure() {
      Http.ajax({
        url: DI.channelConfig.switchConfiguration,
        data: JSON.stringify({ switchB: parseInt(this.switchVal) }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('配置成功');
            this.switchBFlag = false;
          } else {
            this.$message.warning(res.retMsg);
          }
        },
        error: error => {
          console.log('error');
        }
      });
    },
    handleMatchName(row) {
      let matchName = '';
      row.matchList.filter(item => {
        if (item.labelType == '4') {
          matchName = item.labelName;
        }
      });
      return matchName;
    },
    querySwitch() {
      //查询B面开关
      Http.ajax({
        url: DI.channelConfig.querySwitch,
        data: JSON.stringify({}),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.switchVal = res.data.switchB;
            localStorage.setItem('switchVal', this.switchVal);
          } else {
            this.$message.warning(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    handleEntranceConfig() {
      this.dialogVisible = true;
    },

    handleCompetitionChange(val) {
      this.getMatchListByCompetitionId(val);
      this.competitionVal = val;
      this.scheduleVal = '';
    },
    handleScheduleChange(val) {
      this.scheduleVal = val;
    },
    goto(pageNum) {
      this.pageIndex = pageNum;
      this.queryList(pageNum);
    },
    delSure() {
      //删除
      let pms = { channelId: this.curItem.channelId };
      Http.ajax({
        url: DI.channelConfig.delChannel,
        data: JSON.stringify(pms),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('删除成功!');
            this.delFlag = false;
            this.queryList(this.pageIndex);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    delClose() {
      this.delFlag = false;
    },
    setMark(row) {
      this.markData.name = row.mark || '';
      this.setMarkFlag = true;
      this.curItem = row;
    },
    setMarkSure() {
      //角标设置
      let pms = { mark: this.markData.name, channelId: this.curItem.channelId };
      Http.ajax({
        url: DI.channelConfig.setMark,
        data: JSON.stringify(pms),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('设置成功');
            this.setMarkFlag = false;
            this.queryList(this.pageIndex);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    hideMark() {
      this.setMarkFlag = false;
    },
    moveBChannel(row, flag) {
      //上下移
      let pms = {
        abFlag: 2,
        channelTerminalFlag: 1,
        channelId: row.channelId,
        movingState: flag == 1 ? 1 : 2,
        isTop: 0
      };
      Http.ajax({
        url: DI.channelConfig.move,
        data: JSON.stringify(pms),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success(`${flag == 1 ? '上移' : '下移'}成功`);
            this.queryList(this.pageIndex);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    delBChannel(row) {
      this.curItem = row;
      this.delFlag = true;
    },
    handleConvertChannelType(channelType, subjectType) {
      let typeName = '';
      switch (channelType) {
        case 2:
          if (subjectType == 1) {
            typeName = '主题-栏目';
          } else if (subjectType == 2) {
            typeName = '主题-赛事';
          } else if (subjectType == 4) {
            typeName = '主题-节目集';
          } else if (subjectType == 5) {
            typeName = '主题-小组';
          }
          break;
        case 3:
          typeName = '短视频';
          break;
        case 4:
          typeName = 'URL';
          break;
        case 6:
          typeName = '赛事赛程';
          break;
        case 7:
          typeName = '赛事积分榜';
          break;
      }
      return typeName;
    },
    getSubjectTypeItem(val) {
      return Constant.getItemByValue(this.subjectTypeList, val);
    },
    editBChannel(row) {
      let subjectType = this.getSubjectTypeItem(row.subjectType).name || '';
      this.editTypeDisabled = true;
      this.addChannelFlag = true;
      this.channelTitle = '编辑频道';
      this.curItem = row;
      let matchArr = [];
      if (row.matchList) {
        matchArr = row.matchList;
      }
      for (let i = 0; i < matchArr.length; i++) {
        let listItem = matchArr[i];
        if (listItem && listItem.labelType == '3') {
          this.competitionVal = parseInt(listItem.labelId);
          this.getMatchListByCompetitionId(this.competitionVal);
        }
        if (listItem && listItem.labelType == '4') {
          this.scheduleVal = parseInt(listItem.labelId);
        }
      }
      this.formData = {
        channelId: row.channelId,
        channelName: row.channelName,
        channelType: row.channelType,
        url: row.jumpUrl,
        subjectId: '' + row.subjectId,
        themeInfo: '主题ID:' + row.subjectId + ' ' + subjectType + ' ' + '名称:' + row.subjectName
      };
    },
    changeID(id) {
      if (id == '' || !/^\d+$/.test(id)) {
        return;
      }
      let pms = { subjectId: parseInt(id) };
      Http.ajax({
        url: DI.channelConfig.queryThemeInfoById,
        data: JSON.stringify(pms),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            const data = res.data;
            const dataStr = JSON.stringify(data);
            if (dataStr != '{}') {
              this.formData.themeInfo =
                '主题ID:' + data.subjectId + ' ' + this.handleSubjectType(data.subjectType) + ' ' + '名称:' + data.subjectName;
              this.remindMsgFlag = false;
            } else {
              this.formData.themeInfo = 'sorry，查不到对应的主题信息!';
              this.remindMsgFlag = true;
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
    handleSubjectType(type) {
      let name = '';
      switch (type) {
        case 1:
          name = '栏目';
          break;
        case 2:
          name = '赛事';
          break;
        case 4:
          name = '节目集';
          break;
        case 5:
          name = '小组';
          break;
        default:
          break;
      }
      return name;
    },
    clearVal() {
      this.remindError = '';
      this.competitionVal = '';
      this.scheduleVal = '';
      this.editTypeDisabled = false;
      this.formData.channelName = '';
      this.formData.channelType = '';
      this.formData.url = '';
      this.formData.subjectId = '';
      this.formData.themeInfo = '';
      this.remindMsgFlag = false;
      this.$refs.formData && this.$refs.formData.resetFields();
    },
    faceBSure(formName) {
      //保存
      let _self = this;
      this.$refs[formName].validate(valid => {
        if (valid && !this.remindMsgFlag) {
          let reg = /^\d+$/;
          if (this.formData.subjectType == 2 && this.formData.subjectId && !reg.test(this.formData.subjectId)) {
            return;
          }
          if (
            (_self.formData.channelType == 6 || _self.formData.channelType == 7) &&
            (_self.competitionVal == '' || _self.scheduleVal == '')
          ) {
            _self.remindError = true;
            return;
          }
          const submitData = this.formData;
          let nrList = [];
          for (let i = 0; i < this.competitionList.length; i++) {
            let matchItem = this.competitionList[i];
            if (matchItem.sportItemId == this.competitionVal) {
              nrList.push({
                labelId: '' + this.competitionVal,
                labelName: matchItem.sportItemName,
                labelType: 3
              });
              break;
            }
          }
          for (let i = 0; i < this.scheduleList.length; i++) {
            let scheduleItem = this.scheduleList[i];
            if (scheduleItem.competitionId == this.scheduleVal) {
              nrList.push({
                labelId: '' + this.scheduleVal,
                labelName: scheduleItem.competitionName,
                labelType: 4
              });
              break;
            }
          }
          let pms = {
            abFlag: 2,
            channelName: submitData.channelName,
            channelTerminalFlag: 1,
            channelType: submitData.channelType,
            matchId: this.scheduleVal,
            matchList: nrList,
            jumpUrl: submitData.url || '',
            subjectId: submitData.subjectId || ''
          };
          let url = '';
          if (this.channelTitle == '编辑频道') {
            pms.channelId = submitData.channelId;
            url = DI.channelConfig.edit;
          } else {
            url = DI.channelConfig.save;
          }
          Http.ajax({
            url: url,
            data: JSON.stringify(pms),
            context: this,
            loadingText: '正在保存B面频道信息,请稍候!',
            success: res => {
              if (res.retCode == '0') {
                this.$message.success('保存成功');
                this.queryList(this.pageIndex);
                this.addChannelFlag = false;
                this.clearVal();
              } else {
                this.$message.error(res.retMsg);
              }
            },
            error: () => {
              console.log('error');
            }
          });
        }
      });
    },
    faceBClose() {
      this.addChannelFlag = false;
      this.clearVal();
    },
    addChannel() {
      this.clearVal();
      this.addChannelFlag = true;
      this.channelTitle = '添加频道';
      this.channelBTypeList.every(item => {
        item.disabled = false;
        return true;
      });
    },
    handleChannelTypeChange(val) {
      this.$refs.formData && this.$refs.formData.resetFields();
      this.formData.channelType = val;
    },
    getCompetitionList() {
      Http.ajax({
        url: DI.channelConfig.querySportsTypeList,
        data: JSON.stringify({}),
        success: res => {
          if (res.retCode == '0') {
            this.competitionList = res.data.sportsTypeList;
          } else {
            Message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    getMatchListByCompetitionId(val) {
      Http.ajax({
        url: DI.infoLibrary.getGameList,
        data: {
          sportItemId: val
        },
        loadingText: 'false',
        context: this,
        type: 'get',
        success: res => {
          if (res.retCode == '0') {
            this.scheduleList = res.data.list;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    queryList(pageindex) {
      //查询
      let params = {
        abFlag: 2,
        channelTerminalFlag: 1,
        pageIndex: pageindex != 1 ? (this.pageIndex - 1) * this.pageSize : 0,
        pageSize: this.pageSize
      };
      params = this.$bus.deleteNullProperty(params);
      Http.ajax({
        url: DI.channelConfig.queryList,
        data: JSON.stringify(params),
        context: this,
        loadingText: '正在查询B面频道信息,请稍候!',
        success: res => {
          if (res.retCode == '0') {
            this.faceBList = res.data.channelList || [];
            this.totalCount = res.data.channelNum || 0;
            this.topCountAll = res.data.topNum || 0;
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
.errTips {
  margin-left: -133px;
  line-height: 20px;
  color: #f00;
  font-size: 12px;
}
.add-channel {
  position: absolute;
  right: 37px;
  top: 70px;
}
.switch-status {
  .switch-txt {
    margin: -3px 10px 0px;
    font-size: 14px;
  }
  .entrance-config {
    position: absolute;
    right: 37px;
    top: 120px;
  }
  background: #fff;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 50px;
  margin: -10px 0px 15px 0px;
}
.is-column {
  display: flex;
  align-items: center;
  .btn-style {
    .mt-8 {
      margin-right: 8px;
    }
    margin-top: 8px;
    display: flex;
    justify-content: space-around;
  }
}
.section-match {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  .match-txt {
    color: #999;
    fongt-size: 12px;
    margin-right: 5px;
    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #09bbfe;
      border-radius: 50%;
      margin-right: 5px;
      vertical-align: middle;
    }
  }
}
.remind-msg {
  margin-left: -176px;
  color: #f00;
  font-size: 12px;
}
</style>

