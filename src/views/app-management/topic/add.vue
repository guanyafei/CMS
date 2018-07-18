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
      padding: 20px 0;
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
      .slt-tag {
        width: 360px;
      }
      .relPlayer {
        padding-left: 66px;
      }
    }
    .btns {
      padding-left: 260px;
      padding-top: 30px;
      padding-bottom: 20px;
      button+button {
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
    &+.selected-tag {
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
    /*position:absolute;*/
    top: 33px;
    left: 0;
    font-size: 12px;
    color: #f00;
  }
  .empty {
    padding: 5px;
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
    <sn-topbar :title="title" />
    <div class="content-edit">
      <span class="title">内容编辑</span>
      <section class="form-content">
        <sn-form :model="formData"
          :rules="rules"
          ref="formData"
          label-width="120px">
          <sn-form-item label="专题标题"
            prop="channelName">
            <sn-input placeholder="请输入专题标题（5-30个字）"
              :maxlength="30"
              :totalWords="30"
              v-model="formData.channelName"
              width="640"
              :showWord="true"></sn-input>
          </sn-form-item>
          <sn-form-item label="专题封面"
            prop="channelLogo">
            <sn-cropper :aspectRatio="aspectRatio"
              v-model="formData.channelLogo"
              ref="cropper"
              label="封面"
              width="550"
              :height="aspectRatioHeight"
              isScoped></sn-cropper>
          </sn-form-item>
          <sn-form-item label="专题简介"
            prop="channelDes">
            <div style="width:640px;">
              <sn-input placeholder="请输入简介内容（100个字以内）"
                v-model="formData.channelDes"
                width="640"
                :showWord="true"
                type="textarea"
                :rows="4"
                :maxlength="100"
                :totalWords="100"></sn-input>
            </div>
          </sn-form-item>
          <div>
            <span class="add-tag">资讯编辑</span>
          </div>
          <sn-form-item label="资讯类型" prop="infoType">
            <sn-checkbox-group v-model="formData.infoType">
              <sn-rect-checkbox label="1">视频</sn-rect-checkbox>
              <sn-rect-checkbox label="2">图集</sn-rect-checkbox>
              <sn-rect-checkbox label="3">图文资讯</sn-rect-checkbox>
            </sn-checkbox-group>
          </sn-form-item>
          <sn-form-item label="关联项目" prop="relatedProject">
            <sn-select v-model="formData.relatedProject"
              placeholder="全部"
              radius="6"
              width="360"
              @change="handleProjectChange">
              <sn-option key="all" name="全部" :value="-1"></sn-option>
              <sn-option v-for="item in projectList"
                :key="item.sportItemId"
                :name="item.sportItemName"
                :value="item.sportItemId"
                :disabled="item.disabled">
              </sn-option>
            </sn-select>
          </sn-form-item>
          <sn-form-item label="关联赛事">
            <sn-select
              v-model="relatedMatch"
              placeholder="请选择"
              radius="6"
              width="360"
              @change="handleMatchChange"
              :disabled="sltedLabelList.length >= 3">
              <sn-option v-for="item in matchList"
                :key="item.competitionName"
                :name="item.competitionName"
                :value="item"
                :disabled="item.disabled">
              </sn-option>
              <div v-if="!matchList.length">暂无数据</div>
            </sn-select>
          </sn-form-item>
          <!-- 已选中标签展示1-->
          <template v-if="sltedLabelList.length">
            <sn-form-item labelWidth="118px">
              <span class="selected-tag" v-for="(item,index) in sltedLabelList" :key="index">
                {{item.labelName}}
                <span class="remove" @click="removeSltedLabel(index)"></span>
              </span>
              <div>
                <p v-if="showRemindFlag" class="remind-txt">{{remindTxt}}</p>
              </div>
            </sn-form-item>
          </template>
          <sn-form-item label="资讯来源"
            prop="resource">
            <!-- <sn-select-input :list="sourceList" placeholder="请选择" v-model="formData.resource" width="429" outputField="value" :hasInput="false"></sn-select-input> -->
            <sn-select v-model="formData.resource"
              placeholder="请选择"
              radius="6"
              width="360"
              @change="handleSourceVal">
              <sn-option v-for="item in sourceList"
                :name="item.name"
                :value="item.value"
                :key="item.value"
                :disabled="item.disabled"></sn-option>
            </sn-select>
          </sn-form-item>
          <div v-if="formData.resource == '1'">
            <sn-form-item label="作者范围" ref="authorType" prop="authorType" labelWidth="188px">
              <sn-select v-model="formData.authorType"
                placeholder="请选择"
                radius="6"
                width="360"
                @change="authorTypeChange">
                <sn-option v-for="item in authorList"
                  :name="item.name"
                  :value="item.value"
                  :key="item.value"
                  :disabled="item.disabled"></sn-option>
              </sn-select>
            </sn-form-item>
            <sn-form-item label="上架方式" ref="onSaleType" prop="onSaleType" labelWidth="188px">
              <sn-select
                v-model="formData.onSaleType"
                placeholder="请选择"
                radius="6"
                width="360"
                @change="onSaleTypeChange">
                <sn-option
                  v-for="item in saleTypeList"
                  :name="item.name"
                  :value="item.value"
                  :key="item.value"
                  :disabled="item.disabled"
                ></sn-option>
              </sn-select>
            </sn-form-item>
          </div>
          <template v-if="formData.resource == '2'">
            <sn-form-item label="选择标签"
              ref="sltTagType"
              prop="sltTagType"
              labelWidth="188px"
              class="slt-tag">
              <sn-select
                v-model="sltTagType"
                placeholder="请选择标签"
                radius="6"
                width="360"
                @change="tagTypeChnage">
                <sn-option
                  v-for="item in tagTypeList"
                  :name="item.name"
                  :value="item.value"
                  :key="item.value"
                  :disabled="item.disabled"></sn-option>
              </sn-select>
            </sn-form-item>
            <!-- 当选择标签为：项目显示 -->
            <template v-if="sltTagType == '3'">
              <sn-form-item label="运动分类"
                labelWidth="188px">
                <sn-select
                  v-model="sltedProgramTag"
                  placeholder="请选择标签"
                  radius="6"
                  width="360"
                  @change="handleSltedSport">
                  <sn-option
                    v-for="item in sportTypeList"
                    :name="item.sportItemName"
                    :value="item"
                    :key="item.sportItemName"
                    :disabled="item.disabled"
                  ></sn-option>
                </sn-select>
              </sn-form-item>
            </template>
            <!-- 当选择标签为：赛事显示 -->
            <template v-if="sltTagType == '4'">
              <sn-form-item label="运动分类" labelWidth="188px">
                <sn-select v-model="sportType"
                  placeholder="请选择标签"
                  radius="6"
                  width="360"
                  @change="sltSportTypeVal">
                  <sn-option v-for="item in sportTypeList"
                    :name="item.sportItemName"
                    :value="item.sportItemId"
                    :key="item.sportItemId"
                    :disabled="item.disabled"></sn-option>
                </sn-select>
              </sn-form-item>
              <sn-form-item label="赛事标签" labelWidth="188px">
                <sn-select v-model="sltedMatchTag"
                  placeholder="请选择标签"
                  radius="6"
                  width="360"
                  @change="handleSltedMatch">
                  <sn-option
                    v-for="item in matchTagsList"
                    :name="item.competitionName"
                    :value="item"
                    :key="item.competitionName"
                    :disabled="item.disabled"></sn-option>
                </sn-select>
              </sn-form-item>
            </template>
            <!-- 当选择标签为：赛事显示 -->
            <!-- 当选择标签为：球队显示 -->
            <template v-if="sltTagType == '8'">
              <div class="relPlayer">
                <sn-form-item label='球队标签'>
                  <sn-select-filter :list="teamList"
                    outputField="teamId"
                    :displayField="['teamName']"
                    v-model="teamVal"
                    conWidth="363"
                    :tags="selectedList"
                    isTag
                    @handleTags="sltedTeam"
                    @focus="focus"
                    @blur="blur"
                    placeholder="请输入球队名称">
                    <div class="empty" slot="empty" v-if="teamVal===''">请输入...</div>
                    <div class="empty" slot="empty" v-if="duringAjax">加载中...</div>
                  </sn-select-filter>
                </sn-form-item>
              </div>
            </template>
            <!-- 当选择标签为：球员显示 -->
            <template v-if="sltTagType == '9'">
              <!-- <sn-form-item label="球员标签" labelWidth="188px">
                      <sn-nselect-tags ref="playerSltTag" :tags="playerList" displayField="playerName" @search="queryPlayerList" @select="sltedPlayer" width="360"></sn-nselect-tags>
                    </sn-form-item>  -->
              <div class="relPlayer">
                <sn-form-item label='关联球员'>
                  <sn-select-filter :list="playerList"
                    outputField="playerId"
                    :displayField="['playerName','teamName']"
                    v-model="playerVal"
                    conWidth="363"
                    :tags="selectedList"
                    isTag
                    @handleTags="sltedPlayer"
                    @focus="focus"
                    @blur="blur"
                    placeholder="请输入球员名称">
                    <div class="empty"
                      slot='empty'
                      v-if='playerVal===""'>请输入...</div>
                    <div class="empty"
                      slot='empty'
                      v-if='duringAjax'>加载中...</div>
                  </sn-select-filter>
                </sn-form-item>
              </div>
            </template>
            <!-- 已选中标签展示2 -->
            <template v-if="sltedTagList.length">
              <sn-form-item labelWidth="188px">
                <span class="selected-tag"
                  v-for="(item,index) in sltedTagList"
                  :key="index">{{item.labelName}}
                  <span class="remove"
                    @click="removeSltedTag(index)"></span>
                </span>
                <div>
                  <p v-if="showRemindFlag"
                    class="remind-txt">{{remindTxt}}</p>
                </div>
              </sn-form-item>
            </template>
            <sn-form-item label="内容星级"
              ref="starLevel"
              prop="starLevel"
              labelWidth="188px">
              <sn-select v-model="formData.starLevel"
                placeholder="请选择标签"
                radius="6"
                width="360"
                @change="handleStarLevel">
                <sn-option v-for="item in starRankList"
                  :name="item.name"
                  :value="item.value"
                  :key="item.value"
                  :disabled="item.disabled"></sn-option>
              </sn-select>
            </sn-form-item>
            <sn-form-item label="上架方式"
              ref="onLabelSaleType"
              prop="onSaleType"
              labelWidth="188px">
              <sn-select v-model="formData.onSaleType"
                placeholder="请选择"
                radius="6"
                width="360"
                @change="onSaleTypeChange">
                <sn-option v-for="item in saleTypeList"
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
        <sn-button type="primary"
          @click="submitForm('formData')">{{channelId != ''?'保存':'创建'}}</sn-button>
        <sn-button @click="cancel">取消</sn-button>
      </div>
    </div>
    <sn-confirm title="提示"
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
          <span class="word"
            v-for="(word, index) in sensitiveMsgList"
            :key="index">{{word}}</span>
        </div>
      </div>
    </sn-confirm>
  </div>
</template>
<script>
import _ from 'lodash'
import DI from 'interface'
import * as Constant from 'js/constant'
export default {
  props: {
    channelId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      sltedLabelList: [],//已选中关联赛事列表
      relatedMatch: '',//关联赛事
      relatedProject: '',//关联项目
      title: '',
      sourceList: Constant.INFO_SOURCE,
      authorList: Constant.TAUTHOR_TYPE,
      saleTypeList: Constant.SALE_TYPE,
      tagTypeList: Constant.TAG_TYPE, //选择标签列表
      starRankList: Constant.STAR_LEVEL, //标签匹配--内容星级列表
      childTagList: [],
      sltTagType: '', //选择匹配标签类型
      sltedProgramTag: '', //已选中运动分类(标签匹配)
      sportTypeList: [], //运动分类(运动类型)
      matchTagsList: [],
      sportType: '',
      sltedMatchTag: '', //已选中赛事标签(标签匹配)
      showRemindFlag: true, //添加匹配标签提示
      sltedTagList: [], //已选择匹配标签列表(集合)
      remindTxt: '', //添加匹配标签提示文字
      teamList: [],
      playerList: [],
      playerVal: '',
      teamVal: '',
      duringAjax: false,
      projectList: [],//关联项目列表
      matchList: [], //关联赛事列表
      formData: {
        channelName: '',
        channelLogo: '',
        channelDes: '',
        infoType: [],
        isSptImgs: 0,
        isSptVideo: 0,
        isSptNews: 0,
        resource: '',
        starLevel: '',
        authorType: '',
        onSaleType: '',
        labelList: [],
        labelSaleType: '' // 标签匹配-上架方式
      },
      rules: {
        channelName: [{
          required: true,
          message: '请输入专题标题',
          trigger: 'change'
        }, {
          min: 5,
          max: 30,
          message: '长度在 5 到 30 个字符',
          trigger: 'blur'
        }],
        channelLogo: [{
          required: true,
          message: '请上传专题封面',
          trigger: 'change'
        }],
        channelDes: [{
          required: false,
          message: '请输入简介内容（200个字以内）',
          trigger: 'change'
        }],
        infoType: [{
          required: true,
          type: 'array',
          message: '请选择资讯类型',
          trigger: 'change'
        }],
        resource: [{
          required: true,
          type: 'number',
          message: '请选择资讯来源',
          trigger: 'change'
        }],
        authorType: [{
          required: true,
          type: 'number',
          message: '请选择作者范围',
          trigger: 'change'
        }],
        onSaleType: [{
          required: true,
          type: 'number',
          message: '请选择上架方式',
          trigger: 'change'
        }],
        sltTagType: [{
          required: false,
          message: '请选择标签',
          trigger: 'change'
        }],
        starLevel: [{
          required: true,
          type: 'number',
          message: '请选择内容星级',
          trigger: 'change'
        }],
        labelSaleType: [{
          required: true,
          type: 'number',
          message: '请选择上架方式',
          trigger: 'change'
        }]
      },
      aspectRatio: 750 / 420,
      aspectRatioHeight: 550 * 420 / 750 + '',
      sensitiveMsgList: [],
      checkWordConfirm: false,//敏感词提示弹框
      isChannelDes: true
    }
  },
  watch: {
    playerVal (newVal) {
      if (newVal.trim() === '') return;
      this.queryPlayerList(newVal);
    },
    teamVal (newVal) {
      if (newVal.trim() === '') return;
      this.queryTeamList(newVal);
    }
  },
  mounted () {
    this.queryProjectInfo(); //获取运动类型
    this.title = this.channelId ? '编辑专题' : '创建专题';
    if (this.channelId) { //编辑前查询专题记录接口
      this.queryEditInfo();
    }
  },
  methods: {
    handleProjectChange (val) { //关联项目
      this.relatedProject = val;
      if(val === -1) return;
      this.queryMatchList(val);//加载赛事列表
    },
    handleMatchChange (item) { //关联赛事
    this.showRemindFlag = false;
     let sltedLabelList = this.sltedLabelList;
      this.relatedMatch = item;
      let newItem = {
        labelId: item.competitionId,
        labelName: item.competitionName,
        labelLogo:item.competitionLogo,
        labelType:4,
        relType:4
      }
      for(let i = 0; i < sltedLabelList.length; i++){
         let curLabelItem = sltedLabelList[i];
         if(curLabelItem.labelId == newItem.labelId && curLabelItem.relType == newItem.relType ){
           this.showRemindFlag = true;
            this.remindTxt = '请不要重复添加标签!'
            return;
         }
      }
      sltedLabelList.push(newItem);
      if (sltedLabelList.length >= 3) {
        this.relatedMatch = '';
      }
    },
    tagTypeChnage (val) {
      this.sltTagType = val;
      this.sportType = '';
      this.sltedMatchTag = '';
      this.sltedProgramTag = '';
      this.playerVal = '';
      this.teamVal = '';
    },
    handleSltedSport (item) { //运动分类组装(匹配标签)
      this.sltedProgramTag = item;
      let newItem = {
        "labelId": item.sportItemId,
        "labelName": item.sportItemName,
        "labelType": 3,
        "relType": 2
      }
      this.addSltedTags(newItem);
    },
    handleSourceVal (val) {
      this.formData.resource = val;
      this.hideErrorTips(val);
      this.init();
    },
    init () {
      this.formData.authorType = '';
      this.formData.saleType = '';
      this.formData.starLevel = '';
      this.formData.onSaleType = '';
      this.sltTagType = '';
      this.sltedProgramTag = '';
      this.sportType = '';
      this.sltedMatchTag = '';
      this.playerList = [];
      this.sltedTagList = [];
    },
    hideErrorTips (type) {
      if (type == 1) {
        this.$refs.sltTagType && this.$refs.sltTagType.resetField();
        this.$refs.starLevel && this.$refs.starLevel.resetField();
        this.$refs.onLabelSaleType && this.$refs.onLabelSaleType.resetField();
      } else {
        this.$refs.authorType && this.$refs.authorType.resetField();
        this.$refs.onSaleType && this.$refs.onSaleType.resetField();
      }
    },
    authorTypeChange (val) {
      this.formData.authorType = val;
    },
    onSaleTypeChange (val) {
      this.formData.onSaleType = val;
    },
    handleLabelSaleType (val) { //标签匹配--上架方式
      this.formData.labelSaleType = val;
    },
    handleStarLevel (val) {
      this.formData.starLevel = val;
    },
    sltSportTypeVal (val) {
      this.sportType = val;
      this.queryMatchList(val);
    },
    queryMatchList (typeVal) { //赛事标签--获取赛事列表
      this.$ajax({
        url: DI.channelDisplay.getMatchList,
        data: {
          "sportItemId": typeVal
        },
        type: 'GET',
        context: this,
        success: (res) => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            this.matchTagsList = resData.list || []; //赛事列表
            this.matchList = resData.list || [];//关联赛事列表
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => { }
      });
    },
    handleSltedMatch (item) { //赛事标签组装(匹配标签)
      this.sltedMatchTag = item;
      let newItem = {
        "labelId": item.competitionId,
        "labelName": item.competitionName,
        "labelLogo": item.competitionLogo,
        "labelType": 4,
        "relType": 2
      }
      this.addSltedTags(newItem);
    },
    addSltedTags (item) { //添加已选中标签(验证是否有重复，是否超过了10个)
      let sltedTagList = this.sltedTagList;
      this.showRemindFlag = false;
      if (sltedTagList.length >= 10) {
        this.showRemindFlag = true;
        this.remindTxt = '添加标签已经达到10个';
        return false;
      }
      for (let i = 0; i < sltedTagList.length; i++) {
        let curSltedTag = _.cloneDeep(sltedTagList[i]);
        if ((curSltedTag.labelId == item.labelId) && (curSltedTag.relType == item.relType)) {
          this.showRemindFlag = true;
          this.remindTxt = '请不要添加重复标签！';
          return false;
        }
      }
      sltedTagList.push(item);
    },
    queryTeamList (val) { //查询球队列表(标签匹配)
      let list = [];
      this.$ajax({
        url: DI.label.getFilterTeamList,
        data: {
          "teamName": val
        },
        type: 'GET',
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            let resData = res.data || {};
            this.teamList = resData.list || [];
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => { }
      });
    },
    sltedTeam (item) { //获取选中球队
      let newItem = {
        "labelId": item.teamId,
        "labelName": item.teamName,
        "labelLogo": item.teamLogo,
        "labelType": 8,
        "relType": 2
      }
      this.addSltedTags(newItem);
    },
    queryPlayerList (val) { //查询球队列表(标签匹配)
      let list = [];
      this.$ajax({
        url: DI.label.getFilterPlayerList,
        data: {
          "playerName": val
        },
        type: 'GET',
        context: this,
        success: (res) => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            this.playerList = resData.list || [];
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => { }
      });
    },
    focus () {
      this.allowAjax = true;
    },
    blur () {
      this.allowAjax = false;
    },
    sltedPlayer (item) { //获取选中球队
      let newItem = {
        "labelId": item.playerId,
        "labelName": item.playerName,
        "labelLogo": item.playerLogo,
        "labelType": 9,
        "relType": 2
      }
      this.addSltedTags(newItem);
    },
    removeSltedLabel (index) { //删除已选中关联赛事
      this.sltedLabelList.splice(index, 1);
      this.showRemindFlag = false;
    },
    removeSltedTag (index) { //删除已选择标签(匹配标签)
      this.sltedTagList.splice(index, 1);
      this.showRemindFlag = false;
    },
    submitForm (formName) {
      let item = this.formData.infoType;
      this.formData.isSptVideo = this.formData.isSptImgs = this.formData.isSptNews = 0;
      for (let i = 0; i < item.length; i++) {
        if (item[i] == '1') {
          this.formData.isSptVideo = 1;
        }
        if (item[i] == '2') {
          this.formData.isSptImgs = 1;
        }
        if (item[i] == '3') {
          this.formData.isSptNews = 1;
        }
      }
      this.saveSpecial(formName);
    },
    saveSpecial (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.checkLimitWords(this.formData.channelName);
        } else {
          return false;
        }
      });
    },
    cancel () {
      this.$emit('change-view', 'list');
    },
    queryEditInfo () {
      this.$ajax({
        url: DI.topic.queryEditSpecialById,
        data: JSON.stringify({
          "channelId": this.channelId
        }),
        context: this,
        success: (res) => {
          if (res.retCode == '0') {
            let result = res.data || {};
            result.infoType = [];
            this.formData = result;
            this.formData.resource = this.formData.resource;
            this.sltedTagList = this.formData.labelList == null ? [] : this.formData.labelList;
            this.sltedLabelList = this.formData.speLabelList == null ? [] :this.formData.speLabelList;
            this.formData.onSaleType = this.formData.onSaleType == null ? '' : this.formData.onSaleType;
            if (res.data.isSptVideo == 1) {
              this.formData.infoType.push('1');
            }
            if (res.data.isSptImgs == 1) {
              this.formData.infoType.push('2');
            }
            if (res.data.isSptNews == 1) {
              this.formData.infoType.push('3');
            }
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    queryProjectInfo () { //运动分类--获取运动类型
      let list = [];
      this.$ajax({
        url: DI.channelDisplay.getProjectInfo,
        data: {},
        context: this,
        success: (res) => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            this.sportTypeList = resData.list || []; //获取运动列表
            this.projectList = resData.list || [];//获取关联项目列表
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => { }
      });
    },
    checkLimitWords (param) {
      let _this = this;
      let reg = /\[.*\]/g;
      this.$ajax({
        url: DI.common.checkLimitWords,
        data: JSON.stringify({
          content: param,
          name: ""
        }),
        context: this,
        success: (res) => {
          if (res.retCode == '0') {
            if (_this.formData.channelDes && _this.isChannelDes) {
              _this.isChannelDes = false;
              _this.checkLimitWords(_this.formData.channelDes);
            } else {
              this.saveAjax();
            }
          } else {
            let sensitiveMsg = reg.exec(res.retMsg)[0];
            this.sensitiveMsgList = JSON.parse(sensitiveMsg);
            this.checkWordConfirm = true;
            this.isChannelDes = true;
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    saveAjax () { //提交表单
      this.$ajax({
        url: DI.topic.saveSpecial,
        data: JSON.stringify({
          "authorType": this.formData.authorType,
          "channelDes": this.formData.channelDes,
          "channelLogo": this.formData.channelLogo,
          "channelName": this.formData.channelName,
          "isSptVideo": this.formData.isSptVideo,
          "isSptImgs": this.formData.isSptImgs,
          "isSptNews": this.formData.isSptNews,
          "labelList": this.sltedTagList,
          "onSaleType":this.formData.onSaleType,
          "resource":this.formData.resource,
          "starLevel": this.formData.starLevel,
          "channelId": this.channelId || '',
          "speLabelList":this.sltedLabelList
        }),
        context: this,
        success: (res) => {
          if (res.retCode == '0') {
            this.$message.success('提交成功');
            setTimeout(() => {
              this.$emit("change-view", 'list');
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
    close () {
      this.checkWordConfirm = false;
    },
    sure () {
      this.saveAjax();
      this.checkWordConfirm = false;
    }
  }
}
</script>
