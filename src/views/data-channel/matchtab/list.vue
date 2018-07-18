<style scoped>
.container {
  .ibox {
    display: flex;
    align-items: center;
    min-height: 72px;
    padding: 0 20px;
    background: #fff;
    .search-box {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      margin-bottom: 20px;
      .input-box {
        display: flex;
        margin-bottom: 20px;
      }
      .select-box {
        display: flex;
        align-items: center;
        .text {
          margin-right: 10px;
        }
      }
    }
    &.between {
      justify-content: space-between;
    }
    .btns {
      display: flex;
      flex-direction: column;
      margin-top: 5px;
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
    &:hover {
      text-decoration: underline;
    }
  }
  .adv-info {
    display: flex;
    align-items: center;
    .img-wrap {
      position: relative;
      .id-info {
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 0 12px;
        width: 100%;
        height: 22px;
        line-height: 22px;
        color: #fff;
        background: rgba(0, 0, 0, 0.6);
      }
      .adv-img {
        display: inline-block;
        width: 80px;
        height: 80px;
      }
    }
    .adv-title {
      padding-left: 8px;
    }
  }
  .form-item {
    margin-bottom: 15px;
  }
  .btn-disabled {
    cursor: not-allowed;
    color: #ccc;
    &:hover {
      text-decoration: none;
    }
  }
  .tabinfo {
    width: 500px;
    padding: 9px 20px;
    background-color: #fff;
    border: 1px solid #f0f1f5;
    border-top: 0px;
    .rank-wrap {
      p {
        display: flex;
        margin-bottom: 16px;
        width: 50%;
        justify-content: space-around;
      }
      .rank-colour.hack {
        margin-top: 1px;
      }
    }
    .txt {
      font-size: 14px;
      float: left;
    }
    .ckGroup1 {
      max-width: 500px;
      margin-top: 10px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
    }
  }
}
</style>
<style>
.rank-wrap {
  p {
    display: flex;
    margin-bottom: 4px;
  }
  .label {
    margin-right: 10px;
  }
  .rank-colour {
    display: inline-block;
    width: 15px;
    height: 15px;
    margin-right: 4px;
    &.bg-red {
      background: #fa4c4c;
    }
    &.bg-blue {
      background: #4c97fa;
    }
    &.bg-purple {
      background: #b729db;
    }
    &.bg-green {
      background: #00b255;
    }
    &.bg-grey {
      background: #909090;
    }
    &.hack {
      margin-top: -2px;
    }
  }
  .rank-name {
    max-width: 90px;
    text-align: left;
    line-height: 1.3;
  }
}
</style>
<template>
  <div class="container">
    <sn-topbar title="赛事TAB管理" />
    <section class="ibox between">
      <div class="search-box">
        <div class="input-box">
          <sn-input
            :reg="/^[A-Za-z0-9\u4e00-\u9fa5]+$/"
            hint="请输入中文、英文或数字"
            autoValid
            placeholder="请输入TAB名称"
            width="178"
            radius="16"
            :maxlength="6"
            v-model="tabName"
          ></sn-input>
        </div>
        <div class="select-box">
          <span class="text">TAB状态</span>
          <sn-select
            v-model="tabStatus"
            placeholder="全部"
            radius="16"
            width="120"
            @change="handleTabStatus"
          >
            <sn-option name="全部" value="-1"></sn-option>
            <sn-option
              v-for="item in tabStatusList"
              :key="item.key"
              :name="item.name"
              :value="item.value"
            ></sn-option>
          </sn-select>
        </div>
      </div>
      <div class="btns">
        <sn-button type="primary" @click="search">查询</sn-button>
        <sn-button type="outline" @click="addMatch">创建赛事TAB</sn-button>
      </div>
    </section>
    <sn-table :data="list" ref="table1">
      <sn-table-column label="顺序" prop="seqTab" width="5%"></sn-table-column>
      <sn-table-column label="TAB名称" prop="tabName" width="10%"></sn-table-column>
      <sn-table-column label="关联赛事" prop="tabMatchName" width="10%"></sn-table-column>
      <sn-table-column label="关联赛季" prop="tabSeasonName"  width="10%"></sn-table-column>
      <sn-table-column label="TAB角标" prop="tabMatchMark" width="10%"></sn-table-column>
      <sn-table-column label="赛事说明" prop="tabMatchDes" width="10%" sloted>
        <template slot-scope="row">
          <div :title="row.tabMatchDes">{{getMatchDes(row.tabMatchDes)}}</div>
        </template>
      </sn-table-column>
      <sn-table-column label="排名颜色" prop="colorList" width="15%" sloted>
        <template slot-scope="row">
          <ColorTableCel :tableInfo="row"></ColorTableCel>
        </template>
      </sn-table-column>
      <sn-table-column label="TAB状态" prop="tabMatchStatus" width="10%" sloted>
        <template slot-scope="row">
          <div>{{getMatchStatus(row.tabMatchStatus)}}</div>
        </template>
      </sn-table-column>
      <sn-table-column label="操作" width="18%" sloted>
        <template slot-scope="row">
          <div class="is-column">
            <p>
              <a href="javascript:;"
                @click="showEditConfirm(row)">编辑</a>
              <a href="javascript:;"
                @click="showSaleConfirm(row)">{{row.tabMatchStatus?'下架':'上架'}}</a>
            </p>
            <br>
            <p>
              <a href="javascript:;" :class="{'btn-disabled': row.tabMatchStatus == 1}" @click="showDelConfirm(row)">删除</a>
            </p>
            <br>
            <p>
              <a href="javascript:;" @click="showRankConfirm(row)">设置排名颜色</a>
            </p>
          </div>
        </template>
      </sn-table-column>
    </sn-table>
    <sn-pagination :total="dataTotal" :size="pageSize" @goto="goto" />
    <!-- 删除框 -->
    <sn-confirm
      txt
      ref="delConfirm"
      title="删除提醒"
      :flag="delConFlag"
      @sure="deleteMatch"
      @close="hideConfirm">
      确认删除该该赛事？
    </sn-confirm>
    <!-- 下架框 -->
    <sn-confirm
      txt
      ref="saleConfirm"
      :title="saleStatusTxt+'提醒'"
      :flag="saleFlag"
      @sure="saleSure"
      @close="hideConfirm">
      确认{{saleStatusTxt}}该赛事？
    </sn-confirm>
    <!-- 创建TAB -->
    <sn-confirm
      title="创建赛事TAB"
      txt
      @sure="addSure('matchData')"
      @close="hideConfirm"
      :flag="addFlag"
    >
      <sn-form :model="matchData" :rules="rules" ref="matchData" label-width="80px" formWidth="400">
        <sn-form-item label="关联项目" prop="relatedProject">
          <sn-select
            v-model="matchData.relatedProject"
            placeholder="全部"
            radius="6"
            width="306"
            @change="handleSelectProject"
          >
            <sn-option
              v-for="item in projectList"
              :key="item.sportItemId"
              :name="item.sportItemName"
              :value="item.sportItemId"
            ></sn-option>
            <div v-if="!projectList.length">暂无数据</div>
          </sn-select>
        </sn-form-item>
        <sn-form-item label="关联赛事" prop="relatedMatch" ref="relatedMatch">
          <sn-select
            v-model="matchData.relatedMatch"
            placeholder="请选择"
            radius="6"
            width="306"
            @change="handleSelectMatch"
          >
            <sn-option
              v-for="item in matchList"
              :key="item.competitionId"
              :name="item.competitionName"
              :value="item.competitionId"
            ></sn-option>
            <div v-if="!matchList.length">暂无数据</div>
          </sn-select>
        </sn-form-item>
        <sn-form-item
          label="关联赛季"
          :key="seasonList.length?relatedSeason:''"
          prop="relatedSeason"
          :rules="relatedSeasonRules"
          ref="relatedSeason"
        >
          <sn-select
            v-model="matchData.relatedSeason"
            :placeholder="placeholder"
            radius="6"
            width="306"
            :disabled="!seasonList.length"
            @change="handleSelectSeason"
          >
            <sn-option
              v-for="item in seasonList"
              :key="item.seasonId"
              :name="item.seasonName"
              :value="item.seasonId"
            ></sn-option>
            <div v-if="!seasonList.length">暂无数据</div>
          </sn-select>
        </sn-form-item>
        <sn-form-item label="TAB名称" prop="tabName">
          <sn-input
            width="306"
            radius="6"
            :maxlength="6"
            placeholder="请输入TAB名称"
            v-model="matchData.tabName"
          ></sn-input>
        </sn-form-item>
      </sn-form>
    </sn-confirm>
    <!-- 编辑 -->
    <sn-confirm
      title="编辑"
      txt
      @sure="editMatch('formData')"
      @close="hideConfirm"
      :flag="editFlag"
    >
      <sn-form
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="80px"
        formWidth="400"
      >
        <sn-form-item label="展示排序" prop="sortIndex">
          <sn-input
            width="306"
            radius="6"
            :maxlength="6"
            placeholder="请输入排序"
            v-model="formData.sortIndex"
          ></sn-input>
        </sn-form-item>
        <sn-form-item label="TAB名称" prop="editTabName">
          <sn-input
            width="306"
            radius="6"
            disabled
            v-model="formData.editTabName"
          ></sn-input>
        </sn-form-item>
        <sn-form-item label="TAB角标" prop="corner">
          <sn-input
            width="306"
            radius="6"
            placeholder="请输入角标内容"
            :maxlength="8"
            v-model="formData.corner"
          ></sn-input>
        </sn-form-item>
        <sn-form-item
          label="关联赛季"
          :key=" seasonList.length ? relatedSeason : ''"
          :rules="relatedSeason1Rules"
          prop="relatedSeason"
        >
          <sn-select
            v-model="formData.relatedSeason"
            :placeholder="placeholder"
            width="306"
            :disabled="!seasonList.length"
            @change="handleEditSelectSeason"
          >
            <sn-option
              v-for="item in seasonList"
              :key="item.seasonId"
              :name="item.seasonName"
              :value="item"
              :disabled="item.disabled"
            ></sn-option>
            <div v-if="!seasonList.length">暂无数据</div>
          </sn-select>
        </sn-form-item>
        <sn-form-item label="实时开关" >
          <div style="margin-top:6px;float:left">
           <sn-checkbox v-model="switchOnOrOff"></sn-checkbox>
           </div>
        </sn-form-item>
        <sn-form-item label="赛事说明">
          <div class="edit-block">
            <sn-input
              width="306"
              class="editMatchDesc"
              placeholder="赛事规则等相关说明..."
              type="textarea"
              v-model="formData.matchDes"
              :rows="3"
            ></sn-input>
          </div>
        </sn-form-item>
      </sn-form>
    </sn-confirm>
    <!-- 设置赛事LOGO -->
    <sn-confirm
      txt
      :flag="matchLogoFlag"
      title="设置赛事LOGO"
      @close="hideConfirm"
      @sure="saveMatchLogo('matchLogoData')"
      confirmButtonText="保存"
    >
      <sn-form
        :model="matchLogoData"
        :rules="rules"
        ref="matchLogoData"
        label-width="80px"
        formWidth="400"
      >
        <sn-form-item label="图片" prop="matchLogo">
          <sn-cropper
            :aspectRatio="1"
            v-model="matchLogoData.matchLogo"
            ref="cropper"
            label="封面"
            width="130"
            height="130" />
        </sn-form-item>
      </sn-form>
    </sn-confirm>
    <!-- 设置排名 -->
    <sn-confirm
      txt
      :flag="matchRankFlag"
      title="排名颜色设置"
      @close="hideConfirm"
      @sure="saveMatchRank('matchRankData')"
      confirmButtonText="保存"
    >
      <sn-table :data="matchRankList" class="contentRankList" theme="dialog" :height="200">
        <sn-table-column
          label="排名"
          prop="index"
          width="10%"
          sloted
        >
          <template slot-scope="row">
            {{row.$index + 1}}
          </template>
        </sn-table-column>
        <sn-table-column label="颜色" prop="colours" width='90%' sloted>
          <template slot-scope="row">
            <sn-radio-group v-model="row.radioVal" class="rank-wrap">
              <sn-radio label="0">不设置</sn-radio>
              <sn-radio label="#FA4C4C">
                <span class="rank-colour bg-red hack"></span>
              </sn-radio>
              <sn-radio label="#4C97FA">
                <span class="rank-colour bg-blue hack"></span>
              </sn-radio>
              <sn-radio label="#B729DB">
                <span class="rank-colour bg-purple hack"></span>
              </sn-radio>
              <sn-radio label="#00B255">
                <span class="rank-colour bg-green hack"></span>
              </sn-radio>
              <sn-radio label="#909090">
                <span class="rank-colour bg-grey hack"></span>
              </sn-radio>
            </sn-radio-group>
          </template>
        </sn-table-column>
      </sn-table>
      <div class="tabinfo">
        <span class="txt">勾选出前台展示的排名颜色说明</span><br />
        <div class="ckGroup1 rank-wrap">
          <p v-for="(item, index) in rankColor" :key="item">
            <sn-checkbox v-model="rankCheckboxs['rankCheckbox'+ index]"
              :true-label="item"
              false-label=""
              :disabled="handleColor(item)"></sn-checkbox>
            <span :style="{'backgroundColor':item}"
              class="rank-colour hack"></span>
            <sn-input
              :ref="'rankInputs'+index"
              :disabled="handleColor(item)"
              v-model="rankInputs['rankColorInput'+ index]"
              width="165"
              height="18"
              :maxlength="8"
              autoValid
              required
              :reg="/^[A-Za-z0-9\u4e00-\u9fa5]+$/"
              hint="请输入中文、英文或数字"
              placeholder="请输入说明（8个字以内）"
            ></sn-input>
          </p>
        </div>
      </div>
    </sn-confirm>
  </div>
</template>
<script>
import DI from 'interface'
import * as Constant from 'js/constant'
import ColorTableCel from './colorTableCel';
export default {
  data () {
    return {
      switchOnOrOff:false,
      placeholder: '',
      tabSeaId: '',//编辑要传的赛季id
      isEdit: false,
      seasonName: '',//选中的赛季名称
      pageIndex: 0,
      pageSize: 15,
      dataTotal: 0,
      scoreRankNum: 0,
      saleStatusTxt: '',
      tabName: '',
      tabStatus: '',
      matchData: {
        relatedProject: '',
        relatedMatch: '',
        relatedSeason: '',
        tabName: '',
      },
      formData: {
        relatedSeason: '',
        sortIndex: '',
        editTabName: '',
        corner: '',
        matchDes: '',
      },
      matchLogoData: {
        matchLogo: ''
      },
      matchRankData: [],
      list: [],
      matchList: [],
      projectList: [],
      seasonList: [],
      tabStatusList: Constant.TAB_STATUS,
      matchRankList: [],
      curMatchItem: {},
      saleFlag: false,
      delConFlag: false,
      addFlag: false,
      editFlag: false,
      matchLogoFlag: false,
      matchRankFlag: false,
      rankSettingFlag: false,
      rules: {
        tabName: [{
          required: true,
          message: '请输入TAB名称',
          trigger: 'blur'
        }, {
          min: 1,
          max: 6,
          message: '长度在1到6个字符',
          trigger: 'change'
        }],
        sortIndex: [{
          required: true,
          type: 'string',
          message: '请输入展示排序',
          trigger: 'change'
        }],
        relatedProject: [{
          required: true,
          type: 'number',
          message: '请选择关联项目',
          trigger: 'change'
        }],
        relatedMatch: [{
          required: true,
          type: 'number',
          message: '请选择关联赛事',
          trigger: 'change'
        }],
        corner: [{
          required: false,
          message: '请输入角标内容',
          trigger: 'change'
        }, {
          min: 2,
          max: 8,
          message: '长度在2到8个字符',
          trigger: 'change'
        }],
        matchDes: [{
          required: true,
          message: '请输入赛事说明',
          trigger: 'change'
        }],
        matchLogo: [{
          required: true,
          type: 'string',
          message: '请上传封面',
          trigger: 'blur'
        }]
      },
      //tab需求新增参数
      rankColor: ['#FA4C4C', '#4C97FA', '#B729DB', '#00B255', '#909090'],
      rankInputs: {
        rankColorInput0: '',
        rankColorInput1: '',
        rankColorInput2: '',
        rankColorInput3: '',
        rankColorInput4: '',
      },
      rankCheckboxs: {
        rankCheckbox0: '#FA4C4C',
        rankCheckbox1: '#4C97FA',
        rankCheckbox2: '#B729DB',
        rankCheckbox3: '#00B255',
        rankCheckbox4: '#909090',
      }
    }
  },
  components: {
    ColorTableCel
  },
  mounted () {
    this.queryList(0);
    this.queryProjectList(); //查询关联项目
  },
  computed: {
    relatedSeason1Rules () { //编辑
      if (!this.seasonList.length) {
        return null;
      } else {
        return [{
          required: true,
          type: 'string',
          message: '请选择关联赛季',
          trigger: 'change'
        }]
      }
    },
    relatedSeasonRules () { //新增
      if (!this.seasonList.length) {
        return null;
      } else {
        return [{
          required: true,
          type: 'number',
          message: '请选择关联赛季',
          trigger: 'change'
        }]
      }
    }
  },
  methods: {
    hasColor (list, color) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].radioVal === color) {
          this.rankCheckboxs['rankCheckbox' + this.rankColor.indexOf(color)] = color;
          return false
        }
      }
      let num = this.rankColor.indexOf(color);
      if (num > -1) {
        this.rankCheckboxs['rankCheckbox' + this.rankColor.indexOf(color)] = '';
        this.rankInputs['rankColorInput' + this.rankColor.indexOf(color)] = '';
        this.$nextTick(() => {
          this.$refs['rankInputs' + this.rankColor.indexOf(color)][0].errMsg = '';
        }, 0)
      }
      return true
    },
    handleColor (color) {
      return this.matchRankList && this.matchRankList.length > 0 && this.hasColor(this.matchRankList, color)
    },
    goto (num) {
      this.pageIndex = num;
      this.queryList(num);
      window.scrollTo(0, 0);
    },
    search () {
      this.queryList(0);
      window.scrollTo(0, 0);
    },
    getMatchDes (matchDes = '') {
      return matchDes && matchDes.length > 20 ? matchDes.slice(0, 20) + '...' : matchDes;
    },
    getMatchStatus (status) {
      return status ? '上架' : '下架';
    },
    setRank () {
      this.rankSettingFlag = true;
    },
    addMatch () {
      this.isEdit = false;
      this.addFlag = true;
      this.seasonName = '';
      this.placeholder = '请选择';
      this.matchList = [];
      this.seasonList = [];
    },
    hideConfirm () {
      this.scoreRankNum = 0;
      this.matchRankList = [];
      this.curMatchItem = {};
      this.addFlag = this.saleFlag = this.delConFlag = this.editFlag = this.matchLogoFlag = this.matchRankFlag = false;
      this.matchData = {
        relatedProject: '',
        tabName: '',
        relatedMatch: '',
        relatedSeason: ''
      };
      this.formData = {
        sortIndex: '',
        editTabName: '',
        corner: '',
        matchDes: '',
        relatedSeason: ''
      };
      this.matchLogoData.matchLogo = '';
      this.$refs.formData && this.$refs.formData.resetFields();
      this.$refs.matchData && this.$refs.matchData.resetFields();
      Object.keys(this.rankCheckboxs).every((item, index) => {
        this.$refs[`rankInputs${index}`][0].errMsg = '';
        return true;
      });
      $('.table-body').eq(1).scrollTop(0)// 组件list
    },
    showSaleConfirm (row) {
      this.saleStatusTxt = row.tabMatchStatus ? '下架' : '上架';
      this.curMatchItem = row;
      this.saleFlag = true;
    },
    showDelConfirm (row) { //显示删除确认框
      if (row.tabMatchStatus === 1) return;
      this.delConFlag = true;
      this.curMatchItem = row;
    },
    showEditConfirm (row) {
      this.isEdit = true;//编辑操作
      this.switchOnOrOff = (row.isActual == null || row.isActual == 0) ? false : true;
      this.tabSeaId = parseInt(row.tabSeasonId, 10);
      this.curMatchItem = row;
      this.querySeasonList(row.tabMatchId);//查询赛季列表
      this.formData = {
        relatedSeason: row.tabSeasonName,
        sortIndex: row.seqTab + '',
        editTabName: row.tabName || '',
        corner: row.tabMatchMark || '',
        matchDes: row.tabMatchDes || ''
      };
      this.editFlag = true;
      this.$refs.formData && this.$refs.formData.resetFields();
    },
    showLogoConfirm (row) {
      this.matchLogoFlag = true;
      this.matchLogoData.matchLogo = row.matchLogo || '';
    },
    showRankConfirm (row) {
      this.curMatchItem = row;
      this.queryScoreRankNum(row);
    },
    handleSelectProject (val) { //关联项目
      this.clearSelectedMatch();
      this.clearSelectedSeason();
      this.matchData.relatedProject = val;
      this.queryMatchList(val);
    },
    handleSelectMatch (val) { //关联赛事
      this.clearSelectedSeason();
      this.matchData.relatedMatch = val;
      if (!val) return;
      this.querySeasonList(val);
    },
    clearSelectedMatch () {
      this.matchData.relatedMatch = '';
      this.matchList = [];
      this.$nextTick(() => {
        this.$refs.relatedMatch.vaildTrigger(true);
      })
    },
    clearSelectedSeason () {
      this.matchData.relatedSeason = '';
      this.seasonList = [];
      this.$nextTick(() => {
        this.$refs.relatedSeason.vaildTrigger(true);
      })
    },
    querySeasonList (val) { //查询赛季列表
      let pms1 = {
        sportItemId: this.matchData.relatedProject,
        competitionId: val
      };
      let pms2 = {
        sportItemId: this.curMatchItem.tabSportItemId,
        competitionId: val
      };
      this.$ajax({
        type: 'GET',
        url: DI.matchTab.getSeasonListByMatchId,
        data: this.isEdit ? pms2 : pms1,
        context: this,
        loadingText: '正在查询，请稍候...',
        success: (res) => {
          if (res.retCode == '0') {
            this.seasonList = res.data.list || [];
            if (!this.seasonList.length) {
              this.placeholder = '请选择';
              return;
            }
            this.placeholder = this.curMatchItem.tabSeasonName || (this.seasonList && this.seasonList[0].seasonName);
            this.tabSeaId = this.seasonList[0].seasonId;
            this.formData.relatedSeason = this.placeholder;
            this.seasonName = this.placeholder;
            this.matchData.relatedSeason = this.seasonList[0].seasonId;
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    handleSelectSeason (val) { //新增---关联赛季
      this.matchData.relatedSeason = val.seasonId;
      this.seasonName = val.seasonName;
    },
    handleEditSelectSeason (val) { //编辑---关联赛季
      this.formData.relatedSeason = val.seasonName;
      this.tabSeaId = val.seasonId;
    },
    handleTabStatus (val) {
      this.tabStatus = val;
      this.queryList(0);
    },
    saveMatchRank () { // 设置排名颜色
      let params = {};
      params.matchTabColorList = this.handleSubmitData();
      let isOk = true;
      //校验是否有为空的情况...
      Object.keys(this.rankCheckboxs).every((item, index) => {
        if (this.rankCheckboxs[item]) {
          isOk = this.$refs[`rankInputs${index}`][0].check();
        }
        return true;
      })
      if (!isOk) return;
      this.$ajax({
        url: DI.matchTab.matchTabEditColor,
        data: JSON.stringify(params),
        context: this,
        success: (res) => {
          if (res.retCode == '0') {
            this.$message.success('设置成功');
            this.hideConfirm();
            setTimeout(() => {
              this.queryList(this.pageIndex);
            }, 1000);
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.error('error')
        }
      });
    },
    saveMatchLogo (formName) { //设置赛事LOGO
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {};
          params.matchLogo = this.matchLogoData.matchLogo;
          params.tabId = this.curMatchItem.tabId;
          this.$ajax({
            url: DI.matchTab.matchTabEditInfo,
            data: JSON.stringify(params),
            context: this,
            success: (res) => {
              if (res.retCode == '0') {
                this.$message.success('设置成功');
                this.hideConfirm();
                setTimeout(() => {
                  this.queryList(this.pageIndex);
                }, 1000);
              } else {
                this.$message.error(res.retMsg);
              }
            },
            error: () => {
              console.error('error');
            }
          });
        } else {
          return false;
        }
      });
    },
    addSure (formName) { //创建TAB
      let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
      var _self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!reg.test(this.matchData.tabName)) {
            this.$message.warning('TAB名称只可输入汉字、字母和数字!');
            return false;
          }
          let params = {};
          params.tabSportItemId = this.matchData.relatedProject;
          params.tabMatchId = this.matchData.relatedMatch;
          params.tabSeasonName = this.seasonName;
          params.tabSeasonId = this.matchData.relatedSeason;
          params.tabName = this.matchData.tabName;
          this.$ajax({
            url: DI.matchTab.matchTabCreate,
            data: JSON.stringify(params),
            context: this,
            loadingText: '正在创建，请稍候...',
            success: (res) => {
              if (res.retCode == '0') {
                this.$message.success('创建成功');
                this.hideConfirm();
                setTimeout(() => {
                  this.queryList(this.pageIndex);
                }, 1000);
              } else {
                this.$message.error(res.retMsg);
              }
            },
            error: () => {
              console.error('error')
            }
          });
        } else {
          return false;
        }
      });
    },
    saleSure () { // 上下架
      let params = {};
      params.tabId = this.curMatchItem.tabId;
      params.tabMatchStatus = this.curMatchItem.tabMatchStatus == 1 ? 0 : 1;
      this.$ajax({
        url: DI.matchTab.matchTabEditInfo,
        data: JSON.stringify(params),
        context: this,
        success: (res) => {
          if (res.retCode == '0') {
            this.$message.success(this.saleStatusTxt + '成功');
            this.hideConfirm();
            setTimeout(() => {
              this.queryList(this.pageIndex);
            }, 1000);
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.error('error')
        }
      });
    },
    deleteMatch () { //删除赛事TAB
      let params = {};
      params.tabId = this.curMatchItem.tabId;
      this.$ajax({
        url: DI.matchTab.matchTabDelete,
        data: JSON.stringify(params),
        context: this,
        success: (res) => {
          if (res.retCode == '0') {
            this.$message.success('删除成功');
            this.hideConfirm();
            setTimeout(() => {
              this.queryList(this.pageIndex);
            }, 1300);
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.error('error')
        }
      });
    },
    editMatch (formName) { //编辑
      let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.formData.corner != '' && !reg.test(this.formData.corner)) {
            this.$message.warning('TAB角标只可输入汉字、字母和数字!');
            return false;
          }
          let params = {};
          params.indexs = this.formData.sortIndex;
          params.tabId = this.curMatchItem.tabId;
          params.tabMatchMark = this.formData.corner;
          params.tabSeasonName = this.formData.relatedSeason;
          params.tabSeasonId = this.tabSeaId;
          params.tabMatchDes = this.formData.matchDes;
          params.isActual = this.switchOnOrOff ? 1 : 0;//实时开关  1开启 ---0关闭
          this.$ajax({
            url: DI.matchTab.matchTabEditInfo,
            data: JSON.stringify(params),
            context: this,
            success: (res) => {
              if (res.retCode == '0') {
                this.$message.success('编辑成功');
                this.hideConfirm();
                setTimeout(() => {
                  this.queryList(this.pageIndex);
                }, 1000);
              } else {
                this.$message.error(res.retMsg);;
              }
            },
            error: () => {
              console.error('error')
            }
          });
        } else {
          return false;
        }
      });
    },
    queryList (pageNum) {
      if (pageNum == 0) {
        this.pageIndex = pageNum;
        this.$bus.$emit('syncCurPage', 1);
      }
      let params = {};
      params.pageIndex = pageNum ? (pageNum - 1) * this.pageSize : 0;
      params.pageSize = this.pageSize;
      params.tabName = this.tabName;
      params.tabMatchStatus = this.tabStatus == '-1' ? '' : this.tabStatus;
      params = this.$bus.deleteNullProperty(params);
      this.$ajax({
        url: DI.matchTab.matchTabInfoListGet,
        data: JSON.stringify(params),
        context: this,
        loadingText: '正在查询，请稍候...',
        success: (res) => {
          if (res.retCode == '0') {
            this.list = res.data.list || [];
            this.dataTotal = res.data.listNum || 0;
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    queryMatchList (id) { //查询赛事列表
      let params = {};
      params.sportItemId = id;
      this.$ajax({
        url: DI.matchTab.getUnlinkedTabMatchId,
        data: JSON.stringify(params),
        context: this,
        loadingText: '正在查询，请稍候...',
        success: (res) => {
          if (res.retCode == '0') {
            this.matchList = res.data.list || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    queryProjectList () {
      this.$ajax({
        url: DI.matchTab.queryProjectList,
        data: JSON.stringify({}),
        context: this,
        loadingText: '正在查询，请稍候...',
        success: (res) => {
          if (res.retCode == '0') {
            this.projectList = res.data || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          this.$message.warning('查询出错！');
        }
      });
    },
    queryScoreRankNum (row) {
      let params = {};
      params.tabMatchId = row.tabMatchId;
      this.$ajax({
        url: DI.matchTab.matchLeagueDataNumGet,
        data: JSON.stringify(params),
        context: this,
        loadingText: '正在查询，请稍候...',
        success: (res) => {
          if (res.retCode == '0') {
            this.scoreRankNum = res.data.count || 0;
            this.handleTableData(row);
            setTimeout(() => {
              if (this.scoreRankNum) {
                this.matchRankFlag = true;
              } else {
                this.$message.warning('当前赛事不能设置排名颜色！');
              }
            }, 50)
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          this.$message.warning('查询出错！');
        }
      });
    },
    getColorDesc (radioVal) {
      let result = '';
      if (radioVal === '0') return result;
      Object.keys(this.rankCheckboxs).every((item, cur) => {
        let index = this.rankCheckboxs[item].indexOf(radioVal);
        if (index > -1) {
          result = this.rankInputs['rankColorInput' + cur];
          return false;
        }
        return true
      })
      return result;
    },
    handleSubmitData () {
      let list = [];
      for (let i = 0; i < this.scoreRankNum; i++) {
        let params = {};
        params.color = this.matchRankList[i].radioVal;
        params.rank = i + 1;
        params.tabId = this.curMatchItem.tabId;
        params.colorDesc = this.getColorDesc(this.matchRankList[i].radioVal);
        list.push(params);
      }
      return list;
    },
    handleTableData (row) {
      this.matchRankList = [];
      let list = row.matchTabColorEntityList || [];
      for (let i = 1; i <= this.scoreRankNum; i++) {
        this.matchRankList.push({
          radioVal: this.compareRank(i, list)
        });
      }
      let colorDescs = row.colorDescs || [];
      colorDescs.every((item, index) => {
        if (item.color !== '0') {
          this.rankInputs[`rankColorInput${this.rankColor.indexOf(item.color)}`] = item.color_desc ? item.color_desc : '';
          this.$nextTick(() => {
            this.$refs['rankInputs' + this.rankColor.indexOf(item.color)][0].errMsg = '';
          }, 0)
        }
        return true
      })
    },
    compareRank (i, list) {
      let temp = '0';
      list.filter((item) => {
        if (item.rank == i) {
          temp = item.color;
          return false;
        }
      });
      return temp;
    }
  }
}
</script>
