<style scoped>
  .baseInfo {
    text-align: left;
    width: 680px;
    padding-left: 40px;
    background: #F2F2F2;
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
  .selectWrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .modal-body {
    width: 480px;
    .words {
      height: 128px;
      overflow: auto;
      padding-top: 15px;
      padding-left: 15px;
      padding-right: 15px;
      margin-top: 30px;
      border-radius: 4px;
      font-size: 12px;
      background-color: #f4f6fb;
      .title {
        color: #6e7690;
        font-weight: bold;
      }
      .word {
        display: inline-block;
        padding-right: 15px;
        padding-bottom: 15px;
        color: #f47b77;
      }
    }
  }
  .match-suggestions__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding-right: 10px;
  }
</style>
<template>
  <sn-confirm txt @sure="sure" @close="close" :flag="showFlag" :title="title">
    <sn-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" formWidth="600">
      <p class="baseInfo">基本信息</p>
      <!-- 主题类型 -->
      <sn-form-item label="主题类型" prop="type">
        <sn-select v-model="ruleForm.subjectType" placeholder="请选择" radius="6" width="100%" @change="changeType" :disabled="channel.subjectId">
          <sn-option v-for="item in themeTypeList" :key="item.value" :name="item.name" :value="item.value"></sn-option>
        </sn-select>
      </sn-form-item>
      <!-- 名称 -->
      <sn-form-item ref="subjectName" :label="subTitle+'名称'" prop="subjectName" v-if="ruleForm.subjectType != 2">
        <sn-input v-if="ruleForm.subjectType == 1 || ruleForm.subjectType == 3 || ruleForm.subjectType == 4" width="100%" :maxlength="nameMaxLen" :placeholder="nameplaceholder" v-model="ruleForm.subjectName" showWord :totalWords="nameMaxLen"></sn-input>
        <sn-input v-if="ruleForm.subjectType == 2 || ruleForm.subjectType == 5 || ruleForm.subjectType == 6" width="100%" :placeholder="nameplaceholder" v-model="ruleForm.subjectName" ></sn-input>
      </sn-form-item>
      <!-- 专题简介 -->
      <sn-form-item label="专题简介" prop="description" v-if="ruleForm.subjectType == 3">
        <sn-input placeholder="请输入简介内容（100个字以内）"
          v-model="ruleForm.description"
          width="510"
          :showWord="true"
          type="textarea"
          :rows="4"
          :maxlength="100"
          :totalWords="100"></sn-input>
      </sn-form-item>
      <!-- 选择赛事 -->
      <sn-form-item label="选择赛事" ref="competition" required prop="" v-if="ruleForm.subjectType == 2">
        <div class="selectWrap" style="display:flex;justify-content:space-between;">
          <!-- 运动 -->
          <sn-select v-model="sportItemId" placeholder="请选择" radius="6" width="250" @change="selectSport">
            <sn-option value="" name="请选择"></sn-option>
            <sn-option v-for="item in sportList" :key="item.sportItemId" :name="item.sportItemName" :value="item.sportItemId"></sn-option>
          </sn-select>
          <!-- 赛事 -->
          <sn-select v-model="competitionId" :disabled="sportItemId?false:true" placeholder="请选择" radius="6" width="250" @change="selectCompetition">
            <sn-option value="" name="请选择"></sn-option>
            <sn-option v-for="item in competitionList" :key="item.competitionId" :name="item.competitionName" :value="item.competitionId"></sn-option>
          </sn-select>
        </div>
      </sn-form-item>
      <!-- 选择小组 -->
      <sn-form-item :label="ruleForm.subjectType==5?'选择小组':'选择比赛'" ref="groupMatch" required prop="" v-if="ruleForm.subjectType == 5 || ruleForm.subjectType == 6">
        <!-- 比赛搜索 -->
        <div v-if="ruleForm.subjectType == 6" class="mb-10">
          <sn-autocomplete  
            class="searchInput"
            v-model="searchInput"
            valueKey="matchName"
            :fetchSuggestions="querySearchAsync"
            :isSuggestionsPages="true"
            placeholder="输入赛事关键词快速添加"
            historyKey="matchTag"
            @select="selectSearchItem"
            width="100%"
          >
            <template slot-scope="{item}" slot="history">
              {{item.matchName || item.competitionName}}
            </template>
            <template slot-scope="{item}">
              <div class="match-suggestions__item">
                <template v-if="item.matchName">
                  <span>{{item.matchName}}</span>
                  <span>{{item.matchDateTime}}</span>
                </template>
                <span v-else>{{item.competitionName}}</span>
              </div>
            </template>
          </sn-autocomplete>
        </div>

        <sn-select class="mb-10" v-model="sportItemId" placeholder="请选择" radius="6" width="510" @change="selectSport">
          <sn-option value="" name="请选择"></sn-option>
          <sn-option v-for="item in sportList" :key="item.sportItemId" :name="item.sportItemName" :value="item.sportItemId"></sn-option>
        </sn-select>
        <sn-select class="mb-10" v-model="competitionId" :disabled="sportItemId?false:true" placeholder="请选择" radius="6" width="510" @change="selectCompetition">
          <sn-option value="" name="请选择"></sn-option>
          <sn-option v-for="item in competitionList" :key="item.competitionId" :name="item.competitionName" :value="item.competitionId"></sn-option>
        </sn-select>
        <div class="selectWrap">
          <!-- 赛季标签 -->
          <sn-select v-model="seasonId" :disabled="competitionId?false:true" placeholder="请选择" radius="6" width="140" @change="selectSeason">
            <sn-option value="" name="请选择"></sn-option>
            <sn-option v-for="item in seasonList" :key="item.seasonId" :name="item.seasonName" :value="item.seasonId"></sn-option>
          </sn-select>
          <!-- 阶段/轮次标签 -->
          <sn-select v-model="roundId" :disabled="seasonId?false:true" placeholder="请选择" radius="6" width="140" @change="selectRound">
            <sn-option value="" name="请选择"></sn-option>
            <sn-option v-for="item in roundList" :key="item.stageRoundId" :name="item.stageRoundName" :value="item.stageRoundId"></sn-option>
          </sn-select>
          <!-- 小组标签 -->
          <sn-select v-if="ruleForm.subjectType==5" v-model="groupId" :disabled="roundId?false:true" placeholder="请选择" radius="6" width="210" @change="selectGroup">
            <sn-option value="" name="请选择"></sn-option>
            <sn-option v-for="item in groupList" :key="item.groupId" :name="item.groupName" :value="item.groupId"></sn-option>
          </sn-select>
          <!-- 比赛标签 -->
          <sn-select v-show="ruleForm.subjectType==6" v-model="matchId" :disabled="roundId?false:true" placeholder="请选择" radius="6" width="210" @change="selectMatch">
            <sn-option value="" name="请选择"></sn-option>
            <sn-option v-for="item in matchList" :key="item.matchId" :name="item.matchName" :value="item.matchId"></sn-option>
          </sn-select>
        </div>
      </sn-form-item>
      <!-- 主题logo -->
      <sn-form-item v-if="ruleForm.subjectType!=4 && ruleForm.subjectType!=5 && ruleForm.subjectType!=6" :label="ruleForm.subjectType==3?'上传头图':'主题logo'" prop="logo" ref="logo">
        <sn-cropper
          v-model="ruleForm.logo"
          height="130"
          :width="aspectRatioWidth"
          :aspectRatio="aspectRatio"
          ref="cropper"
          label="封面"
          isScoped
          nolibrary
          noGif
          :hasEdit="ruleForm.subjectType==1 || ruleForm.subjectType==3"
          :disabled="ruleForm.subjectType==2"
        ></sn-cropper>
      </sn-form-item>
      <p class="baseInfo" v-if="ruleForm.subjectType != 6">内容设置</p>
      <!-- 内容来源 -->
      <sn-form-item label="内容来源" prop="resource" v-if="ruleForm.subjectType != 2 && ruleForm.subjectType != 5 && ruleForm.subjectType != 6">
        <sn-select v-model="ruleForm.resource" placeholder="请选择" radius="6" width="100%" @change="handleResource" :disabled="ruleForm.subjectType==4">
          <sn-option
            v-for="item in resourceList"
            :name="item.name"
            :value="item.value"
            :key="item.value"
            :disabled="item.disabled">
          </sn-option>
        </sn-select>
      </sn-form-item>
      <!-- 内容来源-匹配 -->
      <Tag ref="tags" v-show="ruleForm.resource == 2 && ruleForm.subjectType != 2 && ruleForm.subjectType != 5 && ruleForm.subjectType != 6"/>
      <!-- 上架方式 -->
      <sn-form-item v-if="ruleForm.resource != 3 && ruleForm.resource != 4 && ruleForm.subjectType != 4 && ruleForm.subjectType != 6" label="上架方式" prop="onSaleType" class="coverStyle">
        <sn-radio-group v-model="ruleForm.onSaleType" @change="handleSaleType">
          <sn-radio :label="1">自动上架（免审）</sn-radio>
          <sn-radio :label="2">审核上架</sn-radio>
        </sn-radio-group>
      </sn-form-item>
    </sn-form>
    <sn-confirm title="提示"
      :flag="checkWordConfirm"
      close-icon
      @close="checkWordConfirm=false"
      @sure="sureCheckWords"
      confirmButtonText="继续保存"
      cancelButtonText="返回检查"
      noflag>
      <div class="modal-body">
        <sn-formtip warning>内容中检测出敏感词汇，请慎重检查~</sn-formtip>
        <div class="words">
          <span class="title">敏感词汇：</span>
          <span class="word"
            v-for="(word, index) in sensitiveMsgList"
            :key="index">{{word}}</span>
        </div>
      </div>
    </sn-confirm>
  </sn-confirm>
</template>

<script>
import DI from 'interface'
import * as Constant from 'js/constant'
import { getDetail } from './fetch'
import { setHistoryArrData } from 'utils/util'
import Tag from './tag'
export default {
  props: {
    channel: {
      type: Object,
      default: function() {
        return {};
      }
    },
    index: {
      type: Number,
      default: 1
    }
  },
  components: {
    Tag
  },

  data() {
    return {
      themeTypeList: Constant.THEME_TYPE,
      placeholderTypeList: Constant.THEME_PLACEHOLDER_TYPE,
      resourceList: Constant.INFO_SOURCE,
      ruleForm: {
        subjectType: 1,
        subjectName: '',
        resource: 1,
        onSaleType: 1,
        logo: '',
        description: ''
      },
      aspectRatio: 1,
      aspectRatioWidth: 130,
      title: '',
      subTitle: '',
      nameplaceholder: '',
      showFlag: false,
      nameMaxLen: 10,
      sportItemId: '', // 运动
      sportList: [],
      competitionId: '',// 赛事
      competitionList: [],
      seasonId: '', //赛季
      seasonList: [],
      groupId: '', //小组
      groupList: [],
      roundId: '', //阶段/轮次
      roundList: [],
      matchId: '', //比赛
      matchList: [],
      checkWordConfirm: false,
      sensitiveMsgList: [],
      searchInput: ''
    }
  },
  watch: {
    showFlag(newVal, oldVal) {
      if (newVal) {
        if (this.channel.subjectId) {
          this.getDetail();
        } else {
          this.init(this.ruleForm.subjectType);
        }
      }
    },
    index(newVal, oldVal) {
      this.changeType(newVal);
      this.ruleForm.subjectType = newVal;
    },
    'ruleForm.logo': function(newVal) {
      if (newVal) {
        this.$refs.logo.validateState = 'success';
        this.$refs.logo.validateMessage = '';
      }
    }
  },
  computed: {
    rules() {
      return {
        subjectName: [{
          required: true,
          min: 1,
          message: '请输入名称',
          trigger: 'change'
        }],
        logo: [{
          required: true,
          type: 'string',
          message: '请上传封面',
          trigger: 'change'
        }],
        description: [{
          required: false,
          message: '请输入简介内容（200个字以内）',
          trigger: 'change'
        }],
        resource: [{
          required: true,
          type: 'number',
          message: '请选择上架方式',
          trigger: 'change'
        }],
        onSaleType: [{
          required: true,
          type: 'number',
          message: '请选择上架方式',
          trigger: 'change'
        }]
      }
    }
  },
  methods: {
    getDetail() {
      getDetail(this, {
        subjectId: this.channel.subjectId
      }).then(res => {
        this.initDetail(res);
      });
    },
    initDetail(ruleForm) {
      if (ruleForm.subjectId) {
        this.changeType(ruleForm.subjectType);
        this.ruleForm = ruleForm;
        this.ruleForm.onSaleType = ruleForm.onSaleType || 1;
        if (this.ruleForm.subjectType == 3) this.ruleForm.logo = this.ruleForm.cover;

        if ((ruleForm.subjectType == 1 || ruleForm.subjectType == 3 || ruleForm.subjectType == 4) && ruleForm.resource == 2) { // 匹配标签
          this.$refs.tags.getLabelList().then(() => {
            this.$refs.tags.setData(this.ruleForm);
          });
        }
        if (ruleForm.subjectType == 2) {
          let labels = ruleForm.labelnrStr || [];
          labels.filter(label => {
            if (label.labelType == 3) {
              this.sportItemId = parseInt(label.labelId);
              this.getCompetitonList();
            }
            if (label.labelType == 4) {
              this.competitionId = parseInt(label.labelId);
            }
          });
        }

        if (ruleForm.subjectType == 5 || ruleForm.subjectType == 6) { // 小组
          let labels = ruleForm.labelnrStr || [];
          labels.filter(label => {
            if (label.labelType == 3) {
              this.sportItemId = parseInt(label.labelId);
              this.getCompetitonList();
            }
            if (label.labelType == 4) {
              this.competitionId = parseInt(label.labelId);
              this.getSeasonList();
            }
            if (label.labelType == 5) {
              this.seasonId = parseInt(label.labelId);
              this.getRoundList();
            }
            if (label.labelType == 6) {
              this.roundId = label.labelId;
              if (ruleForm.subjectType == 5) this.getGroupList();
              if (ruleForm.subjectType == 6) this.getMatchList();
            }
            if (ruleForm.subjectType == 5 && label.labelType == 12) {
              this.groupId = parseInt(label.labelId);
              this.groupName = label.labelName;
            }
            if (ruleForm.subjectType == 6 && label.labelType == 7) this.matchId = parseInt(label.labelId);
          });
        }
      }
    },
    selectSport(sportItemId) {
      this.sportItemId = sportItemId;
      this.competitionId = '';
      this.competitionList = [];
      this.seasonId = '';
      this.seasonList = [];
      this.roundId = '';
      this.roundList = [];
      this.groupId = '';
      this.groupList = [];
      this.matchId = '';
      this.matchList = [];
      this.ruleForm.logo = '';
      if (sportItemId) {
        this.getCompetitonList();
      }
    },
    selectCompetition(competitionId) {
      this.competitionId = competitionId;
      this.seasonId = '';
      this.seasonList = [];
      this.roundId = '';
      this.roundList = [];
      this.groupId = '';
      this.groupList = [];
      this.matchId = '';
      this.matchList = [];
      this.ruleForm.logo = '';
      if (competitionId) {
        // this.$refs.competition.validateState = 'success';
        // this.$refs.competition.validateMessage = '';
        if (this.ruleForm.subjectType == 2) {
          this.$refs.logo.validateState = 'success';
          this.$refs.logo.validateMessage = '';
        }
        this.ruleForm.logo = this.competitionList.reduce((logo, item) => {
          if (item.competitionId == competitionId) logo = item.competitionLogo;
          return logo;
        }, '');
      }
      if (competitionId && (this.ruleForm.subjectType == 5 || this.ruleForm.subjectType == 6)) {
        this.getSeasonList();
      }
    },
    selectSeason(seasonId) {
      this.seasonId = seasonId;
      this.roundId = '';
      this.roundList = [];
      this.groupId = '';
      this.groupList = [];
      this.matchId = '';
      this.matchList = [];
      this.ruleForm.logo = '';
      if (seasonId && (this.ruleForm.subjectType == 5 || this.ruleForm.subjectType == 6)) {
        this.getRoundList();
      }
    },
    selectRound(roundId) { // 阶段/轮次
      this.roundId = roundId;
      this.groupId = '';
      this.groupList = [];
      this.matchId = '';
      this.matchList = [];
      this.ruleForm.logo = '';
      if (roundId && this.ruleForm.subjectType == 5) {
        this.getGroupList();
      } else if (roundId && this.ruleForm.subjectType == 6) {
        this.getMatchList();
      }
    },
    selectGroup(groupId) { // 小组标签类型 12？
      this.groupId = groupId;
      if (groupId) {
        this.groupName = this.$refs.tags.$refs.labels.getName(groupId, 'groupId', 'groupName', this.groupList);
        this.$refs.groupMatch.validateState = 'success';
        this.$refs.groupMatch.validateMessage = '';
      }
    },
    selectMatch(matchId) {
      this.matchId = matchId;
      this.$refs.groupMatch.validateState = 'success';
      this.$refs.groupMatch.validateMessage = '';
    },
    getCompetitonList() {
      this.$ajax({
        url: DI.infoLibrary.getGameList,
        type: 'get',
        data: {
          sportItemId: this.sportItemId
        },
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            const data = res.data;
            this.competitionList = data.list || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    getSeasonList() {
      this.$ajax({
        url: DI.infoLibrary.getSeasonList,
        type: 'get',
        data: {
          sportItemId: this.sportItemId,
          competitionId: this.competitionId
        },
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            const data = res.data;
            this.seasonList = data.list || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    getRoundList() {
      this.$ajax({
        url: DI.infoLibrary.getRoundList,// 轮次
        type: 'get',
        data: {
          sportItemId: this.sportItemId,
          competitionId: this.competitionId,
          seasonId: this.seasonId
        },
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            const data = res.data;
            this.roundList = data.list || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    getGroupList() {
      this.$ajax({
        url: DI.infoLibrary.getGroupList,// 小组
        type: 'get',
        data: {
          stageId: this.roundId
        },
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            const data = res.data;
            this.groupList = data.list || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    getMatchList() {
      this.$ajax({
        url: DI.infoLibrary.getScheduleList,// 比赛
        type: 'get',
        data: {
          sportItemId: this.sportItemId,
          competitionId: this.competitionId,
          seasonId: this.seasonId,
          stageRoundId: this.roundId
        },
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            const data = res.data;
            this.matchList = data.list || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    close () {
      this.showFlag = false;
      this.searchInput = '';
      this.sportItemId = '';
      this.competitionId = ''; 
      this.competitionList = [];
      this.seasonId = '';
      this.seasonList = [];
      this.groupId = '';
      this.groupList = [];
      this.roundId = '';
      this.roundList = [];
      this.matchId = '';
      this.matchList = [];
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
      this.$refs.tags && this.$refs.tags.clearData();
    },
    changeType (val) {
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
      if (val == 2 || val == 5 || val == 6) {
        this.$refs.tags.$refs.labels.getSportList().then(res => {
          this.sportList = res;
        });
        this.sportItemId = '';
        this.competitionId = '';
        this.competitionList = [];
        this.seasonId = '';
        this.seasonList = [];
        this.groupId = '';
        this.groupList = [];
        this.roundId = '';
        this.roundList = [];
        this.matchId = '';
        this.matchList = [];
      }
      this.aspectRatio = val == 3 ? 750 / 420 : 1;
      this.aspectRatioWidth = val == 3 ? 750 * 130 / 420 : 130;
      this.init(val);
      this.ruleForm = {
        subjectType: val,
        subjectName: '',
        resource: 1,
        onSaleType: 1,
        logo: '',
        description: ''
      };
      if (val == 4) this.ruleForm.resource = 3;
    },
    init(val) {
      this.subTitle = Constant.getItemByValue(this.themeTypeList, val).name || '栏目';
      this.title = (this.channel.subjectId ? '编辑' : '创建') + this.subTitle;
      this.nameplaceholder = Constant.getItemByValue(this.placeholderTypeList, val).name || '请输入栏目名称（2-10个字）';
      this.nameMaxLen = Constant.getItemByValue(this.placeholderTypeList, val).maxLen || 10;
      if (this.subTitle == '节目集') this.subTitle = '节目';
      if (this.subTitle == '比赛场次') this.subTitle = '比赛';
      if (val == 4) this.ruleForm.resource = 3;
      let result = this.resourceList.filter(item => {return item.value == 4;});
      if (val == 1) {
        if (!result.length) {
          this.resourceList.push({
            key: 'media',
            value: 4,
            name: '自媒体'
          });
        }
      } else {
        if (result.length) {
          this.resourceList.pop();
        }
      }
    },
    handleResource (val) {
      this.ruleForm.resource = val;
      if (val == 2) {
        this.$refs.tags.getLabelList();
      } else {
        this.ruleForm.labelnrStr = [];
      }
    },
    handleSaleType (val) {
      this.ruleForm.onSaleType = val;
    },
    sureCheckWords() {
      this.checkWordConfirm = false;
      this.sendAjax();
    },
    querySearchAsync(options, cb) {
      this.$ajax({
        url: DI.infoLibrary.fetchMatchLabelsByTitle,
        context: this,
        loadingText: 'false',
        data: JSON.stringify({
          name: options.queryString,
          pageIndex: options.pageIndex,
          pageSize: options.pageSize
        }),
        success: res => {
          const matchlist = (res.data || {}).matchlist || [];
          cb(matchlist);
        },
        error: () => {
          console.log('error');
        }
      });
    },
    selectSearchItem(item) {
      if (item.sportItemId) {
        this.sportItemId = parseInt(item.sportItemId);
        this.getCompetitonList();
      }
      if (item.competitionId) {
        this.competitionId = item.competitionId;
        this.getSeasonList();
      }
      if (item.seasonId) {
        this.seasonId = parseInt(item.seasonId);
        this.getRoundList();
      }
      if (item.stageRoundId) {
        this.roundId = item.stageRoundId;
        this.getMatchList();
      }
      if (item.matchId) this.matchId = parseInt(item.matchId);
      setHistoryArrData('matchTag', [item], ['matchId', 'competitionId']);
    },
    sure() {
      if (this.ruleForm.subjectType == 3) {
        let reg = /\[.*\]/g;
        this.$ajax({
          url: DI.common.checkLimitWords,
          data: JSON.stringify({
            content: this.ruleForm.description,
            name: ""
          }),
          context: this,
          success: (res) => {
            if (res.retCode == '0') {
              this.sendAjax();
            } else {
              let sensitiveMsg = reg.exec(res.retMsg)[0];
              this.sensitiveMsgList = JSON.parse(sensitiveMsg);
              this.checkWordConfirm = true;
            }
          },
          error: () => {
            console.error('error');
          }
        });
      } else {
        this.sendAjax();
      }
    },
    sendAjax() {
      let tags = this.$refs.tags;
      if (this.channel.subjectId) {
        this.ruleForm.subjectId = this.channel.subjectId;
        this.ruleForm.relationId = this.channel.relationId;
      }
      this.ruleForm.labelnrStr = this.ruleForm.resource == 2 ? tags.getData() : [];
      this.ruleForm.level = this.ruleForm.resource == 2 ? tags.rate : 1;
      this.ruleForm.isSptNews = this.ruleForm.resource == 2 && tags.curCheckedValGraphic.length ? 1 : 0;
      this.ruleForm.isSptImgs = this.ruleForm.resource == 2 && tags.curCheckedValImage.length ? 1 : 0;
      this.ruleForm.isSptVideo = this.ruleForm.resource == 2 && tags.curCheckedValVideo.length ? 1 : 0;
      if (this.ruleForm.subjectType == 3) this.ruleForm.cover = this.ruleForm.logo;
      if (this.ruleForm.subjectType == 2 || this.ruleForm.subjectType == 5 || this.ruleForm.subjectType == 6) {
        this.sportItemId && this.ruleForm.labelnrStr.push({
          labelId: this.sportItemId,
          labelName: tags.$refs.labels.getName(this.sportItemId, 'sportItemId', 'sportItemName', this.sportList),
          labelType: 3
        });
        this.competitionId && this.ruleForm.labelnrStr.push({
          labelId: this.competitionId,
          labelName: tags.$refs.labels.getName(this.competitionId, 'competitionId', 'competitionName', this.competitionList),
          labelType: 4
        });
      }
      if (this.ruleForm.subjectType == 5 || this.ruleForm.subjectType == 6) {
        this.seasonId && this.ruleForm.labelnrStr.push({
          labelId: this.seasonId,
          labelName: tags.$refs.labels.getName(this.seasonId, 'seasonId', 'seasonName', this.seasonList),
          labelType: 5
        });
        this.roundId && this.ruleForm.labelnrStr.push({
          labelId: this.roundId,
          labelName: tags.$refs.labels.getName(this.roundId, 'stageRoundId', 'stageRoundName', this.roundList),
          labelType: 6
        });
      }
      if (this.ruleForm.subjectType == 5) {
        this.ruleForm.groupName = this.groupName;
        this.groupId && this.ruleForm.labelnrStr.push({
          labelId: this.groupId,
          labelName: tags.$refs.labels.getName(this.groupId, 'groupId', 'groupName', this.groupList),
          labelType: 12
        });
      }
      if (this.ruleForm.subjectType == 6) {
        this.matchId && this.ruleForm.labelnrStr.push({
            labelId: this.matchId,
            labelName: tags.$refs.labels.getName(this.matchId, 'matchId', 'matchName', this.matchList),
            labelType: 7
          });
      }
      if (this.ruleForm.subjectType == 2 && this.competitionId) this.ruleForm.subjectName = tags.$refs.labels.getName(this.competitionId, 'competitionId', 'competitionName', this.competitionList);

      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (this.ruleForm.subjectType == 2 && !this.competitionId) {
            // this.$refs.competition.validateState = 'error';
            // this.$refs.competition.validateMessage = '请选择赛事';
            this.$message.warning('请选择赛事');
          } else if (this.ruleForm.subjectType == 5 && !this.groupId) {
            // this.$refs.groupMatch.validateState = 'error';
            // this.$refs.groupMatch.validateMessage = '请选择小组';
            this.$message.warning('请选择小组');
          } else if (this.ruleForm.subjectType == 6 && !this.matchId) {
            // this.$refs.groupMatch.validateState = 'error';
            // this.$refs.groupMatch.validateMessage = '请选择比赛';
            this.$message.warning('请选择比赛');
          } else {
            if (this.ruleForm.subjectType == 2 || this.ruleForm.subjectType == 5 || this.ruleForm.subjectType == 6) this.ruleForm.resource = 2;
            // 小组多加四个参数
            if (this.ruleForm.subjectType == 5) {
              this.ruleForm.sportItemId = this.sportItemId;
              this.ruleForm.competitionId = this.competitionId;
              this.ruleForm.seasonId = this.seasonId;
              this.ruleForm.stageRoundId = this.roundId;
              this.ruleForm.groupId = this.groupId;
              this.ruleForm.relationId = this.groupId;
            }
            if (this.ruleForm.subjectType == 2) this.ruleForm.relationId = this.competitionId;
            if (this.ruleForm.subjectType == 6) this.ruleForm.relationId = this.matchId;
            if ((this.ruleForm.subjectType == 1 || this.ruleForm.subjectType == 3) && this.ruleForm.resource == 2) {
              if (!tags.isAllGraphic && !tags.isAllImage && !tags.isAllVideo) return this.$message.warning('请选择内容类型');
              if (!tags.$refs.labels.getData().length) return this.$message.warning('请选择标签');
            }
            if (this.ruleForm.subjectType == 4) this.ruleForm.onSaleType = '';
            this.$ajax({
              url: this.channel.subjectId ?  DI.theme.edit : DI.theme.add,
              data: JSON.stringify(this.ruleForm),
              context: this,
              success: res => {
                if (res.retCode == '0') {
                  this.$message.success((this.channel.subjectId ? '编辑' : '创建') + '成功');
                  this.close();
                  this.$emit('update');
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
      });
    }
  }
};
</script>
