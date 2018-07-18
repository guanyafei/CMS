<!-->节目管理主页<-->
<template>
  <div id="idx">
    <div class="navbox" v-if="shownav">
      <sn-topbar :title="libraryTitle"></sn-topbar>
      <div class="nav">
        <EventChoice ref='choice' :list='_list'></EventChoice>
      </div>
    </div>
    <div class="addline" v-if="shownav">
        <div class="btns">
          <sn-button type="outline" @click="addTheme" style="height:30px;">新建节目</sn-button>
        </div>
    </div>

    <div v-if="shownav">
        <sn-table :data="lists" ref="lists">
          <sn-table-column label="节目信息" width="20%" sloted>
            <template slot-scope="row">
              <div>
                <div style="margin-left: 10px;font-size:13px;">ID:{{ row.programId }}</div> 
                <div style="margin-top: 10px;margin-left: 10px;font-size:13px;">{{ row.name }}</div> 
              </div>
            </template>
          </sn-table-column>
          <sn-table-column label="标签" prop="labelList" width="30%" sloted>
            <template slot-scope="row">
              <div v-for="(item,index) in row.labelList" :key="index">
                <div style="margin-right:10px">{{item.labelName}}</div>
              </div>
            </template>
          </sn-table-column>
          <sn-table-column label="状态" prop="status" width="10%" sloted>
            <template slot-scope="row">
              <span v-if="row.status == '1'">上线</span>
              <span v-if="row.status == '0'">下线</span>
            </template>
          </sn-table-column>
          <sn-table-column label="更新时间" prop="updateTime" width="10%" sloted>
            <template slot-scope="row">
              <sn-td-date :time="row.updateTime"></sn-td-date>
            </template>
          </sn-table-column>
          <sn-table-column label="视频数量" prop="contentNum" width="10%" sloted>
            <template slot-scope="row">
              <a href="javascript:void(0)" target="_self" @click="changeUrl(row)">
              <span>{{row.contentNum}}</span>
              </a>
            </template>
          </sn-table-column>
          <sn-table-column label="操作" sloted>
            <template slot-scope="row">
              <div class="is-column">
                <a href="javascript:;" @click="edit(row)">编辑</a>
                <br>
                  <a v-if="row.status == '1'" class="disable-link" href="javascript:;">删除</a>
                  <a v-else href="javascript:;" @click="showDelConfirm(row.programId)">删除</a>
                <br>
                <a v-if="row.status == '1'" @click="DownXConfirm(0,row.programId,row.name)" href="javascript:;">下线</a>
                <a v-if="row.status == '0'" @click="DownSConfirm(1,row.programId,row.name)" href="javascript:;">上线</a>
              </div>
            </template>
          </sn-table-column>
        </sn-table>
        <sn-pagination ref="pageTurn" :total="dataTotal" :size="pageSize" @goto="goto" />
        <sn-confirm txt ref="delConfirm" :flag="delConFlag" @sure="delPrograml()" @close="hideDelConfirm">
          确定要删除吗？
        </sn-confirm>
        <sn-confirm txt ref="shelveConfirm" :flag="isLineFlag" @sure="setIsLine()" @close="hideOnOff">
          确定要{{isLineStr}}吗？
        </sn-confirm>
      </div>

    <ProgramContent  v-if="isClick" :program = "program" ></ProgramContent>
    <div v-if="shownav">
      <sn-confirm txt @sure="Addsure" @close="closeAdd" :flag="showFlag" :title="title">
        <sn-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" formWidth="600">
          <p class="baseInfo">基本信息</p>
          <!-- 节目名称 -->
          <sn-form-item label="节目名称" prop="name">
            <sn-input width="100%" :maxlength="nameMaxLen" :placeholder="nameplaceholder" v-model="ruleForm.name" showWord :totalWords="nameMaxLen"></sn-input>
            <div class="form-item__error" v-if="flag_error && ruleForm.name != ''">未查到该ID的信息，请检查您输入的ID信息</div>
          </sn-form-item>
          <!-- 节目简介 -->
          <sn-form-item label="节目简介" prop="introduction">
            <sn-input :placeholder="instroduceplaceholder"
              v-model="ruleForm.introduction"
              width="510"
              :showWord="true"
              type="textarea"
              :rows="4"
              :maxlength="100"
              :totalWords="100"></sn-input>
              <div class="form-item__error" v-if="flag_error && ruleForm.program_instroduce != ''">未查到该ID的信息，请检查您输入的ID信息</div>
          </sn-form-item>
          <!-- 主题logo -->
          <p class="baseInfo">定义标签</p>
          <!-- 资讯栏目 -->
          <sn-form-item label="资讯栏目" prop="infoCol">
            <sn-radio-group v-model="formData.infoCol" class="top3pix infor_col totle_radio" @change="handleInfoCol">
                <sn-rect-radio v-for="item in labelData.columnLabelList" 
                :label="item.labelName" 
                :key="item.labelName"
                :value="item.labelName"
                :isToggle="true"
                class="BU_radio" >{{item.labelName}}</sn-rect-radio>
            </sn-radio-group>
          </sn-form-item>
          <!-- 所属BU -->
          <sn-form-item label="所属BU" prop="BU">
            <sn-radio-group v-model="formData.BU" class="top3pix totle_radio" @change="handleBU">
              <sn-rect-radio v-for="item in labelData.buLabelList" 
              :label="item.labelName" 
              :key="item.labelName"
              :value="item.labelName"
              :isToggle="true"
              class="BU_radio" >{{item.labelName}}</sn-rect-radio>
            </sn-radio-group>
          </sn-form-item>
          <!-- 运动分类 -->
          <sn-form-item label="运动分类" prop="sport">
            <sn-select v-model="formData.sport" placeholder="请选择" radius="6" width="100%" @change="handleAddType" >
              <sn-option name='请选择'
              value=''></sn-option>
              <sn-option v-for="item in labelData.sportsTypeList" 
              :name="item.sportItemName" 
              :key="item.sportItemId"
              :value="item.sportItemName"
              ></sn-option>
            </sn-select>
          </sn-form-item>
          <!-- 关联赛事 -->
          <sn-form-item label="关联赛事" prop="match">
            <sn-select v-model="formData.match" placeholder="请选择" radius="6" width="100%" @change="handleAddMatch" >
              <sn-option name='请选择'
              value=''></sn-option>
              <sn-option v-for="item in getCompetitionInfo.list" 
              :name="item.competitionName" 
              :key="item.competitionId"
              :value="item.competitionName"
              ></sn-option>
            </sn-select>
          </sn-form-item>
        </sn-form>
      </sn-confirm>
    </div>
  </div>
</template>
<script>
import * as Constant from 'js/constant';
const DEFAULT_SILENCE_DAYS = 1;
import EventChoice from './eventChoice';              //节目管理的查询功能组件
import ProgramContent from '../program-list/index';   //节目内容列表组件
import DI from 'interface';
export default {
  data() {
    return {
      rules: {
        name: [
          {
            required: true,
            min: 1,
            max: 30,
            message: '请输入节目名称',
            trigger: 'change'
          }
        ],
        introduction: [
          {
            required: true,
            min: 1,
            max: 100,
            message: '请输入节目简介',
            trigger: 'change'
          }
        ]
      },
      libraryTitle: '节目管理',
      viewType: '',
      item: {},
      shownav: true,
      pageIndex: 1,
      _list: [],
      pageSize: 20,
      dataTotal: 0,
      isLineStr: '', //确定上下线的字符
      delConFlag: false, //删除弹框是否显示
      isLineFlag: false, //上下线弹框是否显示
      delProgramlId: '', //每次删除某项ProgramId
      isLineName:'',     //获取上下线的proName
      status: '', //需要上下线某项ProgramId
      programId_: '', //获取某条porgramID
      programName: '', //获取某条节目名称
      program: {
        programId: '',
        name: ''
      },
      isClick: false,

      ruleForm: {
        name: '',
        introduction: '',
        labelList: []
      },
      label_info: "", //资讯栏目label数据
      label_BU: "", //BU的label数据
      label_sport: "", //运动分类的label数据
      label_match: "", //关联赛事的label数据
      title: '',
      subTitle: '',
      nameplaceholder: '',
      instroduceplaceholder: '',
      flag_error: false,
      showFlag: false,
      nameMaxLen: 30,
      formData: {
        infoCol: '', //资讯栏目
        BU: '', //所属BU集合
        sport: '', //运动分类
        match: '', //关联赛事
        default: '1',
        other: '0',
        resource: '' //资讯来源
      },
      labelData: '', //获取资讯栏目、所属BU、运动分类数据
      sportItemId: '', //获取关联赛事所需的id
      getCompetitionInfo: '', //获取关联赛事的数据,
      programId: '', //编辑的时候针对id赋值
      matchId: '', //获取所选择赛事ID
      lists:'',


      ajaxProgramId:'',//获取列表所传的programId
      ajaxProgramName:''    //获取列表所传的programName
    };
  },
  components: {
    EventChoice,
    ProgramContent
  },
  methods: {
    change() {
      value == 'ProgramContent' ? (this.shownav = false) : (this.shownav = true);
      this.viewType = value;
    },
    addTheme() {
      let addProgram = this;
      addProgram.programId = '';
      addProgram.showFlag = true;
      addProgram.getInitLabel();
      addProgram.filter();
      addProgram.ruleForm = {
        name: '',
        introduction: '',
        labelList: []
      };
      addProgram.label_sport = "";
      addProgram.label_match = "";
      addProgram.formData.infoCol = '';
      addProgram.formData.BU = '';
      addProgram.formData.sport = '';
      addProgram.formData.match = '';
      addProgram.$refs.choice.ajaxData.programId = "";
      addProgram.$refs.choice.ajaxData.programName = "";
      addProgram.$refs.choice.ajaxData.status = "";
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
    },
    //节目管理列表
    changeView(viewType) {
      this.$emit('change-view', viewType);
    },
    changeUrl(row) {
      this.isClick = true;
      this.shownav = false;
      this.program = { row };
      console.log(this.program);
    },
    getTagStr(str) {
      if (str) {
        return str.split(',').join(' / ');
      }
      return '';
    },
    goto(num) {
      this.pageIndex = num;
      this.getList(num);
      window.scrollTo(0, 0);
    },
    //获取节目列表
    getList(pageIndex) {
      //查询频道列表
      let ajaxData = {
        programId: this.ajaxProgramId,
        programName: this.ajaxProgramName,
        pageIndex: pageIndex != 1 ? (this.pageIndex - 1) * this.pageSize : 0,
        pageSize: this.pageSize,
        status: this.status
      };
      this.$ajax({
        url: DI.programMana.queryProgramList,
        data: JSON.stringify(ajaxData),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            let list = resData.programList || [];
            this._list = list;
            this.lists = list;
            this.dataTotal = resData.programNum || 0;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    // 确定删除此节目
    showDelConfirm(programId) {
      //显示删除确认框
      this.delConFlag = true;
      this.delProgramlId = programId;
    },
    //点击确认按钮删除回调
    delPrograml() {
      let ajaxData = {
        programId: this.delProgramlId
      };
      this.$ajax({
        url: DI.programMana.deleteProgram,
        data: JSON.stringify(ajaxData),
        context: this,
        loadingText: '正在删除中，请稍候',
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('删除成功');
            this.delConFlag = false;
            this.getList(1);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    //点击确认按钮上下线回调
    setIsLine() {
      let ajaxData = {
        programId: this.delProgramlId,
        programName	:this.isLineName,
        status: this.status
      };
      this.$ajax({
        url: DI.programMana.updateProgramState,
        data: JSON.stringify(ajaxData),
        context: this,
        loadingText: '正在' + this.isLineStr + '中，请稍候',
        success: res => {
          if (res.retCode == '0') {
            this.$message.success(this.isLineStr + '成功');
            this.status = '';
            this.getList(1);
            setTimeout(() => {
              this.isLineFlag = false;
            }, 800);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    //确定上下节目
    DownXConfirm(status_, programId_,name_) {
      //显示上下线确认框
      this.isLineFlag = true;
      this.delProgramlId = programId_;
      this.isLineName = name_;
      this.status = status_;
      status_ == 1 ? (this.isLineStr = '上线') : (this.isLineStr = '下线');
    },
    DownSConfirm(status_, programId_,name_) {
      //显示上下线确认框
      this.isLineFlag = true;
      this.delProgramlId = programId_;
      this.isLineName = name_;
      this.status = status_;
      status_ == 0 ? (this.isLineStr = '下线') : (this.isLineStr = '上线');
    },
    //取消上下线弹框显示
    hideOnOff() {
      //隐藏上下线确认框
      this.isLineFlag = false;
    },
    //隐藏删除弹框显示
    hideDelConfirm() {
      this.delConFlag = false;
    },
    edit(row) {
      this.programId = row.programId;
      (this.name = ''), (this.introduction = ''), (this.labelList = []), (this.showFlag = true);
      this.getInitLabel();
      this.filter();
      this.programId_ = row.programId;
      this.formData.BU = '';
      this.formData.infoCol = '';
      this.formData.sport = '';
      this.formData.match = '';
      this.getProDetail();
    },
    //获取单条节目的详情
    getProDetail() {
      //查询频道列表
      let ajaxData = {
        programId: this.programId_,
        programName: '',
        pageIndex: 0,
        pageSize: 20,
        status: ''
      };
      //查询频道列表
      this.$ajax({
        url: DI.programMana.queryProgramList,
        data: JSON.stringify(ajaxData),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            this.ruleForm.name = resData.programList[0].name;
            this.ruleForm.introduction = resData.programList[0].introduction;
            //查询详情进行回写
            this.getLabelDetail(resData.programList[0].labelList);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    //执行查询详情进行回写
    getLabelDetail(labelData) {
      labelData.forEach((item, index) => {
        if (item.labelType == '2') {
          this.formData.infoCol = item.labelName;
          this.label_info = {
            labelId: item.labelId,
            labelLogo: '',
            labelName: item.labelName,
            labelType: 2
          };
        } else if (item.labelType == '3') {
          this.formData.sport = item.labelName;
          this.label_sport = {
            labelId: item.labelId,
            labelLogo: '',
            labelName: item.labelName,
            labelType: 3
          };
          //调用关联赛事
          this.getMatch(item.labelId, labelData);
        } else if (item.labelType == '10') {
          this.formData.BU = item.labelName;
          this.label_BU = {
            labelId: item.labelId,
            labelLogo: '',
            labelName: item.labelName,
            labelType: 10
          };
        }
      });
    },
    getMatch(id, labelData) {
      this.sportItemId = id;
      labelData.forEach((item, index) => {
        if (item.labelType == '4') {
          this.label_match = {
            labelId: item.labelId,
            labelLogo: '',
            labelName: item.labelName,
            labelType: 4
          };
          this.getMatchData();
          this.formData.match = item.labelName;
          return;
        }
      });
    },

    //添加节目列表
    closeAdd() {
      this.showFlag = false;
    },
    //运动分类操作
    handleAddType(val) {
      console.log(val);
      if(val == ''){
        this.formData.match = "";
        this.label_match = "";
      }
      this.labelData.sportsTypeList.forEach(item => {
        if (item.sportItemName == val) {
          this.sportItemId = item.sportItemId;
          return;
        }
      });
      this.label_sport = "";
      this.label_sport = {
        labelId: this.sportItemId,
        labelLogo: '',
        labelName: val,
        labelType: 3
      };
      //获取关联赛事数据
      this.getMatchData();
      this.flag_error = false;
      this.formData.sport = val;
    },
    //资讯栏目操作
    handleInfoCol(value) {
      console.log(value);
      let infoColId = '';
      this.labelData.columnLabelList.forEach(item => {
        if (item.labelName == value) {
          infoColId = item.labelId;
          return;
        }
      });
      this.label_info = "";
      this.label_info = {
        labelId: infoColId,
        labelLogo: '',
        labelName: value,
        labelType: 2
      };
    },
    //所属BU操作
    handleBU(value) {
      let BuId = '';
      this.labelData.buLabelList.forEach(item => {
        if (item.sportItemName == value) {
          BuId = item.labelId;
          return;
        }
      });
      this.label_BU = "";
      this.label_BU = {
        labelId: BuId,
        labelLogo: '',
        labelName: value,
        labelType: 10
      };
    },
    //关联赛事操作
    handleAddMatch(value) {
      this.getCompetitionInfo.list.forEach(item => {
        if (item.competitionName == value) {
          this.matchId = item.competitionId;
          return;
        }
      });
      this.label_match = "";
      this.label_match = {
        labelId: this.matchId,
        labelLogo: '',
        labelName: value,
        labelType: 4
      };
      this.formData.match = value;
    },
    filter() {
      this.subTitle = '节目';
      this.title = (this.programId != '' ? '编辑' : '新建') + this.subTitle;
      this.nameplaceholder = '请输入栏目名称（1-30个字）';
      this.instroduceplaceholder = '请输入栏目名称（1-100个字）';
      this.nameMaxLen = 30;
      this.instroMaxLen = 100;
    },
    Addsure() {
      this.$refs.ruleForm.validate(valid => {
        this.formData.sport = "";
        this.formData.match = "";
        this.ruleForm.labelList = [];
        if (valid) {
          this.label_info != "" ? this.ruleForm.labelList.push(this.label_info) : (this.label_info = "");
          this.label_BU != "" ? this.ruleForm.labelList.push(this.label_BU) : (this.label_BU = "");
          this.label_sport != "" ? this.ruleForm.labelList.push(this.label_sport) : (this.label_sport = "");
          this.label_match != "" ? this.ruleForm.labelList.push(this.label_match) : (this.label_match = "");
          let url_ = '';
          if (this.programId == '') {
            url_ = DI.programMana.addProgram;
            delete this.ruleForm.programId;
          } else {
            url_ = DI.programMana.editProgram;
            this.ruleForm.programId = this.programId;
          }
          this.$ajax({
            url: url_,
            data: JSON.stringify(this.ruleForm),
            context: this,
            success: res => {
              if (res.retCode == '0') {
                this.goto(1);
                setTimeout(() => {
                  this.closeAdd();
                }, 800);
                this.$message.success('创建成功');
              } else {
                this.$message.error(res.retMsg);
              }
            },
            error: () => {
              console.error('error');
            }
          });
        }
      });
    },
    //获取新建节目标签
    getInitLabel() {
      this.$ajax({
        url: DI.programMana.initProgramLable,
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.labelData = res.data || {};
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    //获取新建节目关联赛事的接口
    getMatchData() {
      this.$ajax({
        url: DI.programMana.competionId + '?sportItemId=' + this.sportItemId,
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.getCompetitionInfo = res.data || {};
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
  mounted() {
    this.getList(1);
  }
};
</script>
<style scoped>
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 2px 0;
  padding: 20px 0 10px;
  background: #fff;
}
.addline {
  margin-top: 10px;
  background: #fff;
  padding: 10px 0;
  overflow: hidden;
  .btns {
    float: right;
    margin-right: 20px;
  }
}

button {
  color: #0abbfe;
}

.btn-group {
  height: 50px;
}

.modal-body {
  padding-bottom: 0px;
  width: 300px;
}

.day {
  margin-top: 10px;
}

.sn-button {
  height: 24px;
  padding: 0 10px;
}

.info {
  display: flex;
  align-items: center;
  height: 80px;
  .info-img,
  .img-logo {
    width: 80px;
    height: 80px;
    border: 1px solid #eee;
    border-radius: 80px;
  }
  .info-title {
    margin-left: 20px;
    color: #333333;
    font-size: 18px;
  }
}

.info-elements {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  .elem-item {
    padding-left: 20px;
    background-repeat: no-repeat;
    background-size: 16px 16px;
    font-size: 16px;
    margin-right: 16px;
    &.elem-like {
      background-image: url(../../../assets/icon-like.png);
    }
    &.elem-follow {
      background-image: url(../../../assets/icon-follow.png);
    }
    &.elem-comment {
      background-image: url(../../../assets/icon-comment.png);
    }
  }
}

.radio-group {
  display: flex;
  flex-direction: column;
  margin-left: 15px;

  .is-line {
    margin-bottom: 15px;
  }

  .radio {
    display: flex;
    align-items: center;
    margin-left: 0;
    margin-right: 0;
    padding-bottom: 0;
    & + .radio {
      margin-top: 10px;
    }
  }

  .ban-ipt {
    position: relative;

    &::before {
      content: '\5929';
      position: absolute;
      left: 41px;
      top: 3px;
      font-size: 11px;
      color: #666;
    }

    .mini {
      border: 1px solid #ccc;
      border-radius: 16px;
      color: #0abbfe;
      margin-left: 10px;
      width: 50px;
      padding-left: 7px;
      padding-right: 19px;
    }

    .err-msg {
      color: red;
      font-size: 14px;
    }
  }
}

.text-gray {
  color: #666;
}
.disable-link {
  color: #ccc;
  &:hover {
    text-decoration: none;
    cursor: default;
  }
}

.baseInfo {
  text-align: left;
  width: 113%;
  padding-left: 40px;
  background: #f2f2f2;
  color: #333333;
  font-size: 14px;
  height: 32px;
  line-height: 32px;
  margin-left: -40px;
  margin-bottom: 16px;
}
.form-item {
  margin-bottom: 18px;
}
.BU_radio {
  margin-right: 20px;
  margin-left: 0 !important;
  margin-top: 10px;
}
.totle_radio {
  text-align: left !important;
  margin-top: -10px;
  flex-flow: wrap !important;
}
</style>
