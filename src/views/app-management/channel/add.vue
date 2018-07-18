<style scoped>
.container {
  background: #fff;
  .content-edit {
    padding: 10px 18px;
    .title {
      font-size: 14px;
      color: #666666;
      line-height: 20px;
    }
    .form-content {
      padding: 20px 0 30px;
      border-bottom: 1px solid #f0f1f5;
      .form-item {
        padding-left: 40px;
      }
      .add-tag {
        position: relative;
        display: block;
        font-size: 14px;
        color: #666666;
        line-height: 20px;
        margin-top: 20px;
        margin-bottom: 18px;
        &:after {
          content: '';
          position: absolute;
          top: 10px;
          left: 67px;
          right: 5px;
          display: inline-block;
          height: 1px;
          background: #f0f1f5;
        }
      }
      .btn {
        padding-left: 230px;
      }
    }
    .btns {
      padding-left: 260px;
      padding-top: 30px;
      padding-bottom: 50px;
      button + button {
        margin-left: 40px;
      }
    }
  }
  .selected-tag {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    height: 28px;
    line-height: 28px;
    min-width: 64px;
    border: 1px solid #09bbfe;
    color: #666;
    vertical-align: top;
    padding: 0 22px 0 10px;
    border-radius: 16px;
    & + .selected-tag {
      margin-left: 12px;
      margin-bottom: 10px;
    }
    .remove {
      position: absolute;
      right: 8px;
      top: 10px;
      display: inline-block;
      width: 10px;
      height: 10px;
      background: url(../../../assets/icon_close.png) no-repeat;
      background-size: 100% 100%;
      cursor: pointer;
    }
  }
  .remind-txt {
    position: absolute;
    bottom: -8px;
    left: 0;
    font-size: 12px;
    color: #f00;
  }
  .top3pix {
    position: relative;
  }
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
</style>
<template>
  <div class="container">
    <sn-topbar title="创建频道" />
    <div class="content-edit">
      <span class="title">内容编辑</span>
      <section class="form-content">
        <sn-form :model="formData" :rules="rules" ref="addForm" label-width="120px">
          <sn-form-item label="频道名称" prop="channelName">
            <sn-input placeholder="请输入频道名称（2-10个字）" v-model="formData.channelName" width="640" :maxlength="10"></sn-input>
          </sn-form-item>
          <sn-form-item label="频道logo" prop="channelLogo">
            <sn-cropper v-model='formData.channelLogo' label="封面" width="260" height="260" :aspectRatio="1/1"></sn-cropper>
          </sn-form-item>
          <div>
            <span class="add-tag">添加标签</span>
          </div>
          <sn-form-item label="频道类型" prop="channelType">
            <sn-select v-model="formData.channelType" ref="select" placeholder="请选择" radius="6" width="429" @change="handleChannelType">
              <sn-option
                v-for="item in channelTypeList"
                :name="item.name"
                :value="item.value"
                :key="item.value"
                :disabled="item.disabled">
              </sn-option>
            </sn-select>
          </sn-form-item>
          <sn-form-item label="运动标签" prop="sportItem">
            <sn-select v-model="formData.sportItem" ref="select" placeholder="请选择" radius="6" width="429" @change="handleSportTag">
              <sn-option
                v-for="item in sportTypeList"
                :name="item.sportItemName"
                :value="item"
                :key="item.sportItemName"
                :disabled="item.disabled">
              </sn-option>
            </sn-select>
          </sn-form-item>
          <sn-form-item label="赛事标签" prop="matchType">
            <sn-select v-model="formData.matchItem" ref="select" placeholder="请选择" radius="6" width="429" @change="handleMatchTag">
              <sn-option name="请选择" :value="''"></sn-option>
              <sn-option
                v-for="item in matchList"
                :name="item.competitionName"
                :value="item"
                :key="item.sportItemName"
                :disabled="item.disabled">
              </sn-option>
            </sn-select>
            <sn-radio-group v-model="formData.isSptMatchData" class="mt-5">
              <sn-rect-radio :label="1" :isToggle="true">展示系统默认数据楼层</sn-rect-radio>
              <sn-rect-radio :label="2" :isToggle="true">手工配置数据楼层</sn-rect-radio>
            </sn-radio-group>
          </sn-form-item>
          <sn-form-item label="资讯类型" prop="infoType">
            <sn-checkbox-group v-model="formData.infoType" class="top3pix">
              <sn-rect-checkbox label="isSptVideo" v-model="formData.isSptVideo">视频</sn-rect-checkbox>
              <sn-rect-checkbox label="isSptImgs" v-model="formData.isSptImgs">图集</sn-rect-checkbox>
              <sn-rect-checkbox label="isSptNews" v-model="formData.isSptNews">图文资讯</sn-rect-checkbox>
            </sn-checkbox-group>
          </sn-form-item>
          <sn-form-item label="资讯栏目" prop="sltedColIndex">
            <sn-radio-group v-model="formData.sltedColIndex">
              <sn-radio
                v-for="(item,index) in columnList"
                :label="index"
                :key="index">
                {{item.labelName}}
              </sn-radio>
            </sn-radio-group>
          </sn-form-item>
          <sn-form-item label="资讯来源" prop="resource">
            <sn-select v-model="formData.resource" ref="resourceSlt" placeholder="请选择" radius="6" width="429" @change="handleSourceVal">
              <sn-option
                v-for="item in sourceList"
                :name="item.name"
                :value="item.value"
                :key="item.value"
                :disabled="item.disabled">
              </sn-option>
            </sn-select>
          </sn-form-item>
          <div v-if="formData.resource == '1'">
            <sn-form-item label="作者范围" ref="authorType" prop="authorType" labelWidth="188px">
              <sn-select v-model="formData.authorType" ref="select" placeholder="请选择" radius="6" width="360" @change="handleAuthorType">
                <sn-option
                  v-for="item in authorTypeList"
                  :name="item.name"
                  :value="item.value"
                  :key="item.value"
                  :disabled="item.disabled">
                </sn-option>
              </sn-select>
            </sn-form-item>
            <sn-form-item label="上架方式" ref="onSaleType" prop="onSaleType" labelWidth="188px">
              <sn-select v-model="formData.onSaleType" ref="select" placeholder="请选择" radius="6" width="360" @change="handleSaleType">
                <sn-option
                  v-for="item in saleTypeList"
                  :name="item.name"
                  :value="item.value"
                  :key="item.value"
                  :disabled="item.disabled">
                </sn-option>
              </sn-select>
            </sn-form-item>
          </div>
          <template v-if="formData.resource == '2'">
            <sn-form-item label="选择标签" ref="sltTagType" prop="sltTagType" labelWidth="188px" class="slt-tag" style="width:360px;">
              <sn-select v-model="sltTagType" placeholder="请选择" radius="6" width="360" @change="tagTypeChnage">
                <sn-option
                  v-for="item in tagTypeList"
                  :name="item.name"
                  :value="item.value"
                  :key="item.value"
                  :disabled="item.disabled">
                </sn-option>
              </sn-select>
            </sn-form-item>
            <!--当选择标签为：项目显示-->
            <template v-if="sltTagType == '3'">
              <sn-form-item label="运动标签" labelWidth="188px">
                <sn-select v-model="sltedProgramTag" placeholder="请选择" radius="6" width="360" @change="handleSltedSport">
                  <sn-option
                    v-for="item in sportTypeList"
                    :name="item.sportItemName"
                    :value="item"
                    :key="item.sportItemName"
                    :disabled="item.disabled">
                  </sn-option>
                </sn-select>
              </sn-form-item>
            </template>
            <!--当选择标签为：赛事显示-->
            <template v-if="sltTagType == '4'">
              <sn-form-item label="运动标签" labelWidth="188px">
                <sn-select v-model="sportType" placeholder="请选择" radius="6" width="360" @change="sltSportTypeVal">
                  <sn-option
                    v-for="item in sportTypeList"
                    :name="item.sportItemName"
                    :value="item.sportItemId"
                    :key="item.sportItemId"
                    :disabled="item.disabled">
                  </sn-option>
                </sn-select>
              </sn-form-item>
              <sn-form-item label="赛事标签" labelWidth="188px">
                <sn-select v-model="sltedMatchTag" placeholder="请选择" radius="6" width="360" @change="handleSltedMatch">
                  <sn-option
                    v-for="item in matchTagsList"
                    :name="item.competitionName"
                    :value="item"
                    :key="item.competitionName"
                    :disabled="item.disabled">
                  </sn-option>
                </sn-select>
              </sn-form-item>
            </template>
            <!--当选择标签为：赛事显示-->
            <!--当选择标签为：球队显示-->
            <template v-if="sltTagType == '8'">
              <sn-form-item label="球队标签" labelWidth="188px">
                <sn-nselect-tags ref="teamSltTag" :tags="teamList" displayField="teamName" @search="queryTeamList" @select="sltedTeam" width="360">
                </sn-nselect-tags>
              </sn-form-item>
            </template>
            <!--当选择标签为：球员显示-->
            <template v-if="sltTagType == '9'">
              <sn-form-item label='球员标签' labelWidth="188px">
                <sn-select-filter :list="playerList" outputField="playerId" :displayField="['playerName','teamName']" v-model="playerVal" conWidth="363" :tags="selectedList" isTag @handleTags="sltedPlayer" @focus="focusSearchPlayer" @blur="blurSearchPlayer" placeholder="请输入球员名称">
                  <div class="empty" slot='empty' v-if='playerVal === ""'>请输入...</div>
                  <div class="empty" slot='empty' v-if='duringAjax'>加载中...</div>
                </sn-select-filter>
              </sn-form-item>
            </template>
            <!--已选中标签展示-->
            <template v-if="sltedTagList.length">
              <sn-form-item labelWidth="188px" style="position:relative;">
                <span
                  class="selected-tag"
                  v-for="(item,index) in sltedTagList"
                  :key="index"
                >
                  {{item.labelName}}
                  <span class="remove" @click="removeSltedTag(index)"></span>
                </span>
                <p v-if="showRemindFlag" class="remind-txt">{{remindTxt}}</p>
              </sn-form-item>
            </template>
            <sn-form-item label="内容星级" ref="starLevel" prop="starLevel" labelWidth="188px">
              <sn-select v-model="formData.starLevel" placeholder="请选择" radius="6" width="360" @change="handleStarLevel">
                <sn-option
                  v-for="item in starRankList"
                  :name="item.name"
                  :value="item.value"
                  :key="item.value"
                  :disabled="item.disabled">
                </sn-option>
              </sn-select>
            </sn-form-item>
            <sn-form-item label="上架方式" ref="onLabelSaleType" prop="onSaleType" labelWidth="188px">
              <sn-select v-model="formData.onSaleType" placeholder="请选择" radius="6" width="360" @change="handleSaleType">
                <sn-option
                  v-for="item in saleTypeList"
                  :name="item.name"
                  :value="item.value"
                  :key="item.value"
                  :disabled="item.disabled">
                </sn-option>
              </sn-select>
            </sn-form-item>
          </template>
        </sn-form>
      </section>
      <div class="btns">
        <sn-button type="primary" @click="addChannel">创建</sn-button>
        <sn-button @click="backList">取消</sn-button>
      </div>
    </div>
    <sn-confirm
      title="提示"
      :flag="checkWordConfirm"
      close-icon
      @close="close"
      @sure="sure"
      confirmButtonText="继续保存"
      cancelButtonText="返回检查"
      noflag>
      <div class="modal-body">
        <sn-formtip warning>内容中检测出敏感词汇，请慎重检查~</sn-formtip>
        <div class="words">
          <span class="title">敏感词汇：</span>
          <span class="word" v-for="(word, index) in sensitiveMsgList" :key="index">{{word}}</span>
        </div>
      </div>
    </sn-confirm>
  </div>
</template>

<script>
import _ from 'lodash';
import DI from 'interface';
import * as Constant from 'js/constant';
export default {
  data() {
    return {
      channelTypeList: Constant.CHANNELS_TYPE, //频道类型列表
      sourceList: Constant.INFO_SOURCE, //资讯类型列表
      saleTypeList: Constant.SALE_TYPE, //上架方式列表
      tagTypeList: Constant.TAG_TYPE, //选择标签列表
      authorTypeList: Constant.NAUTHOR_TYPE, //报名--作者范围列表
      starRankList: Constant.STAR_LEVEL, //标签匹配--内容星级列表
      tagTypeName: '', //标签类型名字
      childTagList: [],
      sportTypeList: [], //运动标签(运动类型)
      columnList: [], //资讯栏目列表
      sltedTagList: [], //已选择匹配标签列表(集合)
      sltedProgramTag: '', //已选中项目标签(标签匹配)
      sltedMatchTag: '', //已选中赛事标签(标签匹配)
      showRemindFlag: true, //添加匹配标签提示
      remindTxt: '', //添加匹配标签提示文字
      teamList: [], //查询到的球队列表
      playerList: [], //查询到的球员列表
      playerVal: '', //查询球员输入框值
      duringAjax: false, //查询球员加载等待
      matchList: [], //赛事标签列表(选择标签)
      matchTagsList: [], //赛事标签列表(匹配标签)
      sltTagType: '', //选择匹配标签类型
      formData: {
        authorType: '', //作者类型
        channelName: '', //频道名称
        channelLogo: '', //频道logo
        channelType: '', //频道类型
        infoType: ['isSptVideo', 'isSptImgs', 'isSptNews'], //资讯类型集合
        isSptImgs: 0, //是否支持图集
        isSptMatchData: 0, //是否支持赛事数据
        isSptVideo: 0, //是否支持视频
        isSptNews: 0, //是否支持图文
        sportItem: '', //运动标签
        matchItem: '', //赛事标签
        labelnrStr: [], //标签集合
        resource: '', //资讯来源
        sltedColIndex: null, //选中资讯栏目索引
        onSaleType: '', //上架方式
        starLevel: '', //资讯内容星级
        childSportType: '' //标签匹配--赛事(获取运动类型)
      },
      rules: {
        channelName: [
          {
            required: true,
            message: '请输入频道名称',
            trigger: 'change'
          },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'change'
          }
        ],
        channelLogo: [
          {
            required: true,
            message: '请上传频道logo',
            trigger: 'change'
          }
        ],
        channelType: [
          {
            required: true,
            type: 'number',
            message: '请选择频道类型',
            trigger: 'change'
          }
        ],
        sltedColIndex: [
          {
            required: true,
            type: 'number',
            message: '请选择资讯栏目',
            trigger: 'change'
          }
        ],
        sportItem: [
          {
            required: true,
            type: 'object',
            message: '请选择运动标签',
            trigger: 'change'
          }
        ],
        resource: [
          {
            required: true,
            type: 'number',
            message: '请选择资讯来源',
            trigger: 'change'
          }
        ],
        infoType: [
          {
            required: true,
            type: 'array',
            message: '请选择资讯类型',
            trigger: 'change'
          }
        ],
        onSaleType: [
          {
            required: true,
            type: 'number',
            message: '请选择上架方式',
            trigger: 'change'
          }
        ],
        starLevel: [
          {
            required: true,
            type: 'number',
            message: '请选择内容星级',
            trigger: 'change'
          }
        ],
        authorType: [
          {
            required: true,
            type: 'number',
            message: '请选择作者范围',
            trigger: 'change'
          }
        ],
        sltTagType: [
          {
            required: false,
            message: '请选择标签',
            trigger: 'change'
          }
        ]
      },
      count: 0,
      sensitiveMsgList: [],
      checkWordConfirm: false //敏感词提示弹框
    };
  },
  watch: {
    playerVal(newVal) {
      if (newVal.trim() === '') return;
      this.queryPlayerList(newVal);
    },
    'formData.isSptMatchData': function(newVal, oldVal) {
      if (newVal == 1 && !this.formData.matchItem) {
        this.formData.isSptMatchData = oldVal;
        this.$message.warning('请选择赛事标签');
      }
    },
    'formData.matchItem': function(newVal, oldVal) {
      if (!newVal && this.formData.isSptMatchData == 1) {
        this.formData.isSptMatchData = 0;
      }
    }
  },
  mounted() {
    this.queryProjectInfo(); //获取赛事类型
    this.queryColumnList(); //获取资讯栏目列表
  },
  methods: {
    focusSearchPlayer() {
      this.allowAjax = true;
    },
    blurSearchPlayer() {
      this.allowAjax = false;
    },
    tagTypeChnage(val) {
      this.sportType = '';
      this.sltTagType = val;
      this.sltedMatchTag = '';
      this.sltedProgramTag = '';
    },
    handleChannelType(val) {
      this.formData.channelType = val;
    },
    handleSportTag(item) {
      //运动标签(关注标签)
      let formData = this.formData;
      formData.sportItem = item;
      formData.matchItem = '';
      formData.isSptMatchData = 0;
      let sportItemId = item.sportItemId;
      if (sportItemId) {
        this.queryMatchList(sportItemId, 1);
      }
    },
    handleMatchTag(item) {
      //赛事标签(关注标签)
      this.formData.matchItem = item;
    },
    handleSourceVal(val) {
      //选择资讯来源
      this.formData.resource = val;
      this.hideErrorTips(val);
      this.formData.authorType = '';
      this.formData.onSaleType = '';
      this.sltTagType = '';
      this.sltedProgramTag = '';
      this.sportType = '';
      this.sltedMatchTag = '';
      this.formData.starLevel = '';
      this.playerList = [];
      this.sltedTagList = [];
    },
    hideErrorTips(type) {
      if (type == 1) {
        this.$refs.sltTagType && this.$refs.sltTagType.resetField();
        this.$refs.starLevel && this.$refs.starLevel.resetField();
        this.$refs.onLabelSaleType && this.$refs.onLabelSaleType.resetField();
      } else {
        this.$refs.authorType && this.$refs.authorType.resetField();
        this.$refs.onSaleType && this.$refs.onSaleType.resetField();
      }
    },
    handleSaleType(val) {
      //报名--上架方式
      this.formData.onSaleType = val;
    },
    handleAuthorType(val) {
      this.formData.authorType = val;
    },
    handleStarLevel(val) {
      this.formData.starLevel = val;
    },
    sltSportTypeVal(val) {
      this.sportType = val;
      if (val) {
        this.queryMatchList(val, 2);
      }
      this.sltedMatchTag = '';
    },
    handleSltedSport(item) {
      //运动标签组装(匹配标签)
      this.sltedProgramTag = item;
      let newItem = {
        labelId: item.sportItemId,
        labelName: item.sportItemName,
        labelType: 3,
        relType: 2
      };
      this.addSltedTags(newItem);
    },
    handleSltedMatch(item) {
      //赛事标签组装(匹配标签)
      this.sltedMatchTag = item;
      let newItem = {
        labelId: item.competitionId,
        labelName: item.competitionName,
        labelLogo: item.competitionLogo,
        labelType: 4,
        relType: 2
      };
      this.addSltedTags(newItem);
    },
    removeSltedTag(index) {
      //删除已选择标签(匹配标签)
      this.sltedTagList.splice(index, 1);
      this.showRemindFlag = false;
    },
    queryColumnList() {
      //获取资讯栏目列表
      this.$ajax({
        url: DI.channel.queryColumnList,
        data: JSON.stringify({}),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data;
            this.columnList = resData.columnLabelList; //赛事列表
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    queryProjectInfo() {
      //运动标签--获取运动类型
      this.$ajax({
        url: DI.channelDisplay.getProjectInfo,
        data: {},
        context: this,
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data;
            this.sportTypeList = resData.list; //赛事类型列表
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    queryMatchList(typeVal, mateVal) {
      //赛事标签--获取赛事列表
      this.$ajax({
        url: DI.channelDisplay.getMatchList,
        data: {
          sportItemId: typeVal
        },
        type: 'GET',
        context: this,
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data;
            if (mateVal == 1) {
              //选择标签
              this.matchList = resData.list;
            } else {
              //匹配标签
              this.matchTagsList = resData.list; //赛事列表
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
    queryTeamList(val) {
      //查询球队列表(标签匹配)
      this.$ajax({
        url: DI.label.getFilterTeamList,
        data: {
          teamName: val
        },
        loadingText: '正在查询，请稍候！',
        context: this,
        type: 'get',
        success: res => {
          if (res.retCode == '0') {
            this.teamList = res.data.list; //球队列表
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
      this.$refs.teamSltTag.showSelect();
    },
    queryPlayerList(val) {
      //查询球员列表(标签匹配)
      this.$ajax({
        url: DI.label.getFilterPlayerList,
        data: {
          playerName: val
        },
        loadingText: '正在查询，请稍候！',
        context: this,
        type: 'get',
        success: res => {
          if (res.retCode == '0') {
            this.playerList = res.data.list; //球队列表
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    sltedTeam(item) {
      //获取选中球队
      let newItem = {
        labelId: item.teamId,
        labelName: item.teamName,
        labelLogo: item.teamLogo,
        labelType: 8,
        relType: 2
      };
      this.addSltedTags(newItem);
    },
    sltedPlayer(item) {
      //获取选中球队
      let newItem = {
        labelId: item.playerId,
        labelName: item.playerName,
        labelLogo: item.playerLogo,
        labelType: 9,
        relType: 2
      };
      this.addSltedTags(newItem);
    },
    addSltedTags(item) {
      //添加已选中标签(验证是否有重复，是否超过了10个)
      let sltedTagList = this.sltedTagList;
      this.showRemindFlag = false;
      if (sltedTagList.length >= 10) {
        this.showRemindFlag = true;
        this.remindTxt = '添加标签已经达到10个';
        return false;
      }
      for (let i = 0; i < sltedTagList.length; i++) {
        //标签重复判断
        let curSltedTag = _.cloneDeep(sltedTagList[i]);
        if (parseInt(curSltedTag.labelId) == parseInt(item.labelId)) {
          if (parseInt(curSltedTag.labelType) == parseInt(item.labelType)) {
            this.showRemindFlag = true;
            this.remindTxt = '请不要添加重复标签！';
            return false;
          }
        }
      }
      sltedTagList.push(item);
    },
    parseCheckBoxToNum(checkboxList) {
      this.formData.isSptMatchData ? 1 : 0;
      this.formData.isSptVideo =
        checkboxList.indexOf('isSptVideo', 0) > -1 ? 1 : 0;
      this.formData.isSptImgs =
        checkboxList.indexOf('isSptImgs', 0) > -1 ? 1 : 0;
      this.formData.isSptNews =
        checkboxList.indexOf('isSptNews', 0) > -1 ? 1 : 0;
    },
    getLableList(submitData) {
      //将运动标签和赛事标签合并起来，放在标签集合字段
      let labelnrStr = submitData.labelnrStr, //标签集合
        sportItem = submitData.sportItem, //运动标签
        matchItem = submitData.matchItem, //赛事标签
        sltedColIndex = submitData.sltedColIndex, //选中资讯栏目索引
        sltedRelLabel = this.sltedTagList; //获取匹配标签
      if (sportItem != '') {
        //运动标签处理(关注标签)
        let newItem = {
          labelId: sportItem.sportItemId,
          labelName: sportItem.sportItemName,
          labelType: 3,
          relType: 1
        };
        labelnrStr.push(newItem);
      }
      if (matchItem != '') {
        //非空赛事标签处理(关注标签)
        let newItem = {
          labelId: matchItem.competitionId,
          labelName: matchItem.competitionName,
          labelLogo: matchItem.competitionLogo,
          labelType: 4,
          relType: 1
        };
        labelnrStr.push(newItem);
      }
      if (sltedColIndex != null) {
        //资讯栏目处理
        let columnList = this.columnList;
        let sltedCol = columnList[sltedColIndex];
        sltedCol.relType = 3;
        labelnrStr.push(sltedCol);
      }
      if (sltedRelLabel.length > 0) {
        submitData.labelnrStr = labelnrStr.concat(sltedRelLabel); //将两个数组进行拼接
      }
    },
    addChannel() {
      //添加频道
      this.$refs.addForm.validate(valid => {
        if (valid) {
          this.checkLimitWords();
        } else {
          return false;
        }
      });
    },
    backList() {
      this.$emit('change-view', 'list');
    },
    changeView() {
      this.$emit('change-view', 'exreview');
    },
    saveAjax() {
      const submitData = this.formData;
      this.parseCheckBoxToNum(submitData.infoType);
      this.getLableList(submitData);
      this.$ajax({
        url: DI.channel.add,
        data: JSON.stringify({
          authorType: submitData.authorType,
          channelDes: '这是频道简介',
          channelName: submitData.channelName,
          channelLogo: submitData.channelLogo,
          channelType: submitData.channelType,
          isSptImgs: submitData.isSptImgs, //是否支持图集
          isSptMatchData: +submitData.isSptMatchData, //是否支持赛事数据
          isSptNews: submitData.isSptNews, //是否支持资讯
          isSptVideo: submitData.isSptVideo, //是否支持视频
          labelnrStr: submitData.labelnrStr, //标签集合
          onSaleType: submitData.onSaleType, //资讯上架方式
          resource: submitData.resource, //
          starLevel: submitData.starLevel
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('添加成功！');
            this.sltedTagList = [];
            setTimeout(() => {
              this.backList();
            }, 1000);
          } else {
            this.$message.error(res.retMsg);
          }
          this.formData.labelnrStr = [];
        },
        error: () => {
          this.formData.labelnrStr = [];
          console.error('error')
        }
      });
    },
    checkLimitWords() {
      let _this = this;
      let reg = /\[.*\]/g;
      this.$ajax({
        url: DI.common.checkLimitWords,
        data: JSON.stringify({
          content: this.formData.channelName,
          name: ''
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.saveAjax();
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
    },
    close() {
      this.checkWordConfirm = false;
    },
    sure() {
      this.saveAjax();
      this.checkWordConfirm = false;
    }
  }
};
</script>
