<template>
  <div class="container">
    <sn-topbar title="冠名广告管理" />
    <section class="ibox between">
      <div class="search-box">
        <div class="time-box">
          <span class="time-text">有效时间</span>
          <sn-timer width="180" placeholder="起始时间" ref="filterTimeS" :maxDate="ruleForm.endTime" v-model="ruleForm.startTime" showTimepicker/>
          <span class="split">至</span>
          <sn-timer width="180" placeholder="结束时间" ref="filterTimeE" :minDate="ruleForm.startTime" v-model="ruleForm.endTime" showTimepicker/>
        </div>
        <div v-if="filteTtimeRemind" class="remind-par filteTtimeRemind">开始时间不能大于或等于结束时间</div>
        <div class="select-box blongs">
          <span class="text">所属模块</span>
          <sn-select v-model="ruleForm.advBlong" placeholder="全部" radius="16" width="120" @change="handleAdvBlong">
            <sn-option name='全部' value=''></sn-option>
            <sn-option v-for="item in advBlongList" :key="item.id" :name="item.name" :value="item.id"></sn-option>
          </sn-select>
        </div>
        <div class="select-box">
          <span class="text">广告状态</span>
          <sn-select v-model="ruleForm.advStatus" placeholder="全部" radius="16" width="120" @change="handleAdvStatus">
            <sn-option name='全部' value=''></sn-option>
            <sn-option v-for="item in advStatusList" :key="item.id" :name="item.name" :value="item.id"></sn-option>
          </sn-select>
        </div>
        <div class="select-box">
          <span class="text">广告链接</span>
          <sn-select v-model="ruleForm.advJumpUrl" placeholder="全部" radius="16" width="120" @change="handleAdvUrl">
            <sn-option name='全部' value=''></sn-option>
            <sn-option v-for="item in advUrlList" :key="item.id" :name="item.name" :value="item.id"></sn-option>
          </sn-select>
        </div>
      </div>
      <div class="btns">
        <sn-button type="primary" @click="searchHandler">查询</sn-button>
        <sn-button type="outline" @click="add">添加广告</sn-button>
      </div>
    </section>
    <sn-table :data="list" ref="table1">
      <sn-table-column label="广告基本信息" prop="info" width="20%" align="left" sloted>
        <template slot-scope="row">
          <div class="adv-info">
            <div class="img-wrap">
              <img alt="" class="adv-img" :src="row.advImgUrl" />
              <p class="id-info">ID：{{row.advId}}</p>
            </div>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label="生效日期" prop="startTime" width="15%"></sn-table-column>
      <sn-table-column label="失效日期" prop="endTime" width="15%"></sn-table-column>
      <sn-table-column label="所属模块" prop="advTabType" width="10%" sloted>
        <template slot-scope="row">
          <span>{{handleAdvType(row.advTabType)}}</span>
        </template>
      </sn-table-column>
      <sn-table-column label="广告状态" prop="advStatus" width="15%" sloted>
        <template slot-scope="row">
          <div>
            {{getAdvStatus(row.status)}}
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label="广告链接" prop="advJumpUrl" width="15%" sloted>
        <template slot-scope="row">
          {{getAdvUrl(row.advJumpUrl)}}
        </template>
      </sn-table-column>
      <sn-table-column label="操作" width="10%" sloted>
        <template slot-scope="row">
          <div class="is-column">
            <p>
              <a href="javascript:;" :class="{'btn-disabled': row.status == 1}" @click="saleOn(row)">上架</a>
              <a href="javascript:;" :class="{'btn-disabled': row.status == 0}" @click="saleOff(row)">下架</a>
            </p>
            <br>
            <p>
              <a href="javascript:;" :class="{'btn-disabled': row.status == 1}" @click="edit(row)">编辑</a>
              <a href="javascript:;" :class="{'btn-disabled': row.status == 1}" @click="showDelConfirm(row)">删除</a>
            </p>
          </div>
        </template>
      </sn-table-column>
    </sn-table>
    <sn-pagination :total="dataTotal" :size="pageSize" @goto="goto" />
    <!-- 删除提醒-->
    <sn-confirm txt ref="delConfirm" title="删除提醒" :flag="delConFlag" @sure="deleteAdv" @close="hideDelConfirm">
      确认删除该条广告吗? </sn-confirm>
    <!-- 上架提醒-->
    <sn-confirm txt ref="saleOnConfirm" title="上架提醒" :flag="saleOnFlag" @sure="saleOnAdv" @close="hideSaleOnConfirm">
      确认上架该条广告吗? </sn-confirm>
    <!-- 下架提醒-->
    <sn-confirm txt ref="saleOffConfirm" title="下架提醒" :flag="saleOffFlag" @sure="saleOffAdv" @close="hideSaleOffConfirm">
      确认下架该条广告吗? </sn-confirm>
    <!-- 添加和编辑广告 -->
    <sn-confirm ref="confirm" :title='modalTitle' txt @sure="advSure('formData')" @close="advClose" :flag="advFlag">
      <sn-form :model="formData" :rules="rules" ref="formData" label-width="80px" formWidth="400">
        <sn-form-item label="所属模块" prop="advTabType">
          <sn-select v-model="formData.advTabType" :disabled="modalTitle == '添加广告'?false:true" ref="tabSelect" radius="6" width="306" @change="advTabChangeHandler">
            <sn-option v-for="item in advBlongList" :key="item.id" :name="item.name" :value="item.id"></sn-option>
          </sn-select>
        </sn-form-item>
        <sn-form-item label="广告封面" prop="advImgUrl">
          <sn-cropper :aspectRatio="aspectRatio" size="1M" :noGif="true" v-model='formData.advImgUrl' ref="cropper" label="封面" width="306" height="158" />
        </sn-form-item>
        <sn-form-item label="广告链接" prop="advJumpUrl">
          <sn-input v-model="formData.advJumpUrl" placeholder="非必填" width="306" />
        </sn-form-item>
        <div class="form-item" v-if="formData.advTabType == 2">
          <label class="form-item__label">频道标签</label>
          <div class="form-item__content saleMatchItem">
            <sn-checkbox class="selectAll" v-model="selectAllVal" @change="handelSelectAll">全选</sn-checkbox>
            <sn-checkbox-group class="saleMatchBox" v-model="curCheckedVal">
              <sn-checkbox class="saleMatchBox-item" :label="item.competitionId+''" v-for="(item,index) in saleMatchList" :key="index">{{item.competitionName}}</sn-checkbox>
            </sn-checkbox-group>
          </div>
          <div v-if="labelRemind" class="remind-par">请选择赛事标签</div>
        </div>
        <sn-form-item label="关联频道ID" prop="relationChannelId" v-if="formData.advTabType == 3">
          <sn-input v-model="formData.relationChannelId" placeholder="请输入频道ID" width="308" />
          <p class="relationTips">可关联多个频道，频道ID之间用英文分隔</p>
        </sn-form-item>
        <sn-form-item label="球队ID" prop="teamId" v-if="formData.advTabType == 12 || formData.advTabType == 13">
          <sn-input v-model="formData.teamId" placeholder="请输入球队ID" width="306"></sn-input>
          <p class="relationTips">可输入多个球队ID，ID之间用英文分隔</p>
        </sn-form-item>
        <sn-form-item label="广告语" prop="advSlogans" v-if="formData.advTabType == 3 || formData.advTabType == 4">
          <sn-input placeholder="请输入广告语" :maxlength="advSlogansLn" v-model="formData.advSlogans" width="306" />
        </sn-form-item>
        <sn-form-item label="专题ID" prop="advTopicId" v-if="formData.advTabType == 5">
          <sn-input placeholder="请输入专题ID" type="number" :maxlength="30" v-model="formData.advTopicId" width="306" />
        </sn-form-item>
        <sn-form-item label="赛事ID" prop="advMatchId" v-if="formData.advTabType == 6">
          <sn-input placeholder="请输入赛事ID" type="number" :maxlength="30" v-model="formData.advMatchId" width="306" />
        </sn-form-item>
        <template v-if="formData.advTabType == 7 || formData.advTabType == 8">
          <sn-form-item label="关联" prop="contentType">
            <sn-radio-group v-model="formData.contentType" @change="changeStyle">
              <sn-radio :label="1">关联赛事</sn-radio>
              <sn-radio :label="2">关联节目</sn-radio>
            </sn-radio-group>
          </sn-form-item>
          <div class="form-item" v-if="formData.contentType == 1">
            <label class="form-item__label">赛事标签</label>
            <div class="form-item__content saleMatchItem">
              <sn-checkbox class="selectAll" v-model="selectAllVal" @change="handelSelectAll">全选</sn-checkbox>
              <sn-checkbox-group class="saleMatchBox" v-model="curCheckedVal">
                <sn-checkbox class="saleMatchBox-item" :label="item.competitionId+''" v-for="(item,index) in saleMatchList" :key="index">{{item.competitionName}}</sn-checkbox>
              </sn-checkbox-group>
            </div>
            <div v-if="labelRemind" class="remind-par">请选择赛事标签</div>
          </div>
          <sn-form-item label="节目ID" prop="relationProgramId" v-if="formData.contentType == 2">
            <sn-input v-model="formData.relationProgramId" placeholder="请输入节目ID" width="306" />
            <p class="relationTips">可关联多个节目，节目ID之间用英文分隔</p>
          </sn-form-item>
        </template>
        <sn-form-item label="频道ID" prop="concernId" v-if="formData.advTabType == 9 || formData.advTabType == 10 || formData.advTabType == 11">
          <sn-input placeholder="请输入频道ID" type="number" :maxlength="30" v-model="formData.concernId" width="306" />
        </sn-form-item>
        <div class="form-item">
          <label class="form-item__label">生效时间</label>
          <div class="form-item__content">
            <sn-timer width="138" placeholder="起始时间" radius="4" ref="timerS" v-model="formData.startTime" showTimepicker :maxDate="formData.endTime" />
            <span>至</span>
            <sn-timer width="138" placeholder="结束时间" radius="4" ref="timerE" v-model="formData.endTime" showTimepicker :minDate="formData.startTime" />
          </div>
          <div v-if="timeRemind" class="remind-par">开始时间不能大于或等于结束时间</div>
        </div>
      </sn-form>
    </sn-confirm>
  </div>
</template>
<script>
import DI from 'interface';
import * as Constant from 'js/constant';
export default {
  data() {
    let advUrlValidation = (rule, value, callback) => {
      if (value == '') {
        callback();
      } else if (!(value.startsWith('pptvsports://') || value.startsWith('http://') || value.startsWith('https://'))) {
        callback(new Error('url开头需为：http://或https或pptvsports://开头'));
      }
      callback();
    };
    return {
      pageIndex: 0,
      pageSize: 5,
      dataTotal: 0,
      formData: {
        teamId: '',
        saleMatchs: [],
        advTabType: '',
        advImgUrl: '',
        advJumpType: '',
        advJumpUrl: '',
        startTime: '',
        endTime: '',
        advSlogans: '',
        advTopicId: '',
        advMatchId: '',
        relationProgramId: '',
        relationMatchId: '',
        relationChannelId: '',
        contentType: 1, // 1赛事,2节目
        concernId: ''
      },
      ruleForm: {
        advBlong: '',
        advJumpUrl: '',
        endTime: '',
        startTime: '',
        advStatus: ''
      },
      list: [],
      saleMatchList: [],
      curAdvItem: {},
      curCheckedVal: [],
      advFlag: false,
      advSaleFlag: false,
      selectList: Constant.G_JUMP_TYPE,
      advStatusList: Constant.ADV_STATUS_LIST,
      advBlongList: Constant.G_ADVBLONGLIST,
      advUrlList: Constant.ADV_URL_LIST,
      delConFlag: false,
      delContent: {},
      rules: {
        advImgUrl: [
          {
            required: true,
            message: '请上传图片',
            trigger: 'change'
          }
        ],
        advTabType: [
          {
            required: true,
            type: 'number',
            message: '请选择所属模块',
            trigger: 'change'
          }
        ],
        contentType: [
          {
            required: true,
            type: 'number',
            message: '请选择关联类型',
            trigger: 'change'
          }
        ],
        advSlogans: [
          {
            required: true,
            message: '请输入广告语',
            trigger: 'change'
          }
        ],
        advTopicId: [
          {
            required: true,
            message: '请输入专题ID',
            trigger: 'change'
          }
        ],
        advMatchId: [
          {
            required: true,
            message: '请输入赛事ID',
            trigger: 'change'
          }
        ],
        relationProgramId: [
          {
            required: true,
            message: '请输入节目ID',
            trigger: 'change'
          }
        ],
        relationMatchId: [
          {
            required: true,
            message: '请输入赛事ID',
            trigger: 'change'
          }
        ],
        relationChannelId: [
          {
            required: true,
            message: '请输入频道ID',
            trigger: 'change'
          }
        ],
        concernId: [
          {
            required: true,
            message: '请输入频道ID',
            trigger: 'change'
          }
        ],
        teamId: [
          {
            required: true,
            message: '请输入球队ID',
            trigger: 'change'
          }
        ],
        startTime: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: 'change'
          }
        ],
        endTime: [
          {
            required: true,
            message: '请选择结束时间',
            trigger: 'change'
          }
        ],
        advJumpUrl: [
          {
            required: false,
            message: 'url开头需为：http://或https或pptvsports://开头',
            trigger: 'change'
          },
          {
            validator: advUrlValidation,
            trigger: 'change'
          }
        ]
      },
      filteTtimeRemind: false, // 过滤部分时间校验不符的校验提示
      timeRemind: false, // 创建部分时间校验不符的校验提示
      timeRemindSale: false, // 创建部分时间校验不符的校验提示
      labelRemind: false,
      saleOnFlag: false,
      saleOffFlag: false,
      selectAllVal: false,
      aspectRatio: '',
      programIds: [
        {
          value: ''
        }
      ],
      programIdFlag: false,
      advSlogansLn: 6
    };
  },
  watch: {
    curCheckedVal(newVal, oldVal) {
      if (newVal.length) {
        this.labelRemind = false;
        if (newVal.length == this.saleMatchList.length) {
          this.selectAllVal = true;
        } else {
          this.selectAllVal = false;
        }
      }
    }
  },
  mounted() {
    this.queryList(0);
    this.queryMatchLabels(); //查询赛事标签
  },
  methods: {
    getAdvStatus(status) {
      return status ? '上架' : '下架';
    },
    getJumpType(val) {
      return Constant.getItemByValue(Constant.G_JUMP_TYPE, val).name;
    },
    getAdvUrl(val) {
      return val == '' ? '无链接' : val;
    },
    searchHandler() {
      if (!this.checkTime()) return;
      this.queryList(0);
    },
    checkTime() {
      if (this.ruleForm.startTime == '' && this.ruleForm.endTime != '') {
        this.$refs.filterTimeS.showErr('开始时间不能为空！');
        return false;
      } else if (this.ruleForm.startTime != '' && this.ruleForm.endTime == '') {
        this.$refs.filterTimeE.showErr('结束时间不能为空！');
        return false;
      }
      let getStartTime = parseInt(new Date(this.ruleForm.startTime).getTime(), 10),
        getEndTime = parseInt(new Date(this.ruleForm.endTime).getTime(), 10);
      if (getStartTime > getEndTime) {
        this.$refs.filterTimeE.showErr('结束时间必须大于开始时间！');
        return false;
      }
      return true;
    },
    clearVal() {
      this.formData = {
        teamId: '',
        advTabType: '',
        advImgUrl: '',
        advJumpType: '',
        advJumpUrl: '',
        startTime: '',
        endTime: '',
        advSlogans: '',
        advTopicId: '',
        advMatchId: '',
        relationProgramId: '',
        relationMatchId: '',
        relationChannelId: '',
        contentType: 2,
        concernId: '',
        saleMatchs: []
      };
      this.$nextTick(() => {
        this.$refs.tabSelect.init();
      });
      this.curCheckedVal = [];
      this.curAdvItem = {};
      this.advFlag = false;
      this.saleOnFlag = false;
      this.saleOffFlag = false;
      this.selectAllVal = false;
      this.timeRemind = this.timeRemindSale = this.labelRemind = false;
      this.$refs.formData && this.$refs.formData.resetFields();
      this.$refs.timerS.showErr(false);
      this.$refs.timerE.showErr(false);
      this.programIdFlag = false;
      $('.sn-popup-content').scrollTop(0);
    },
    goto(num) {
      this.pageIndex = num;
      this.queryList(num);
      window.scrollTo(0, 0);
    },
    changeStyle(val) {
      this.formData.contentType = val;
    },
    advSure(formName) {
      let getStartTime = parseInt(new Date(this.formData.startTime).getTime(), 10),
        getEndTime = parseInt(new Date(this.formData.endTime).getTime(), 10);
      if (getStartTime >= getEndTime) {
        this.timeRemind = true;
        return false;
      } else {
        this.timeRemind = false;
      }
      if (this.curCheckedVal.length == 0 && this.formData.contentType == 1) {
        this.labelRemind = true;
      } else {
        this.labelRemind = false;
      }
      if (this.formData.advTabType == 7 && !this.handelProgramIds().length) {
        this.programIdFlag = true;
      } else {
        this.programIdFlag = false;
      }
      this.$refs[formName].validate(valid => {
        if (valid && !this.labelRemind && this.formData.startTime != '' && this.formData.endTime != '') {
          if (this.formData.advTabType == 3 || this.formData.advTabType == 4) {
            let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+$/;
            if (!reg.test(this.formData.advSlogans)) {
              this.$message.warning('广告语只可输入汉字、字母和数字!');
              return false;
            }
          }
          let url = '';
          if (this.modalTitle === '添加广告') {
            url = DI.g_advment.addTitleAdv;
          } else {
            url = DI.g_advment.modifyTitleAdv;
          }
          this.formData.advJumpType = this.handleValidateUrl(this.formData);
          this.formData.saleMatchs = this.handleSaleMatchs();
          let filterData = this.handleSaleMatchs();
          let tempFlag = false;
          filterData.filter(item => {
            if (item.matchId.toString().includes('，')) tempFlag = true;
          });

          if (tempFlag) {
            const formData = this.formData;
            let remindTxt = '';
            if (formData.advTabType == 3) {
              remindTxt = '频道ID之间请用英文分隔';
            } else if (formData.advTabType == 12 || formData.advTabType == 13) {
              remindTxt = '球队ID之间请用英文分隔';
            } else {
              this.formData.contentType == 2 ? '节目' : '赛事' + 'ID之间请用英文分隔';
            }
            this.$message.warning(remindTxt);
            return false;
          }
          this.$ajax({
            url: url,
            data: JSON.stringify(this.formData),
            context: this,
            loadingText: this.modalTitle === '添加广告' ? '正在添加，请稍后...' : '正在保存，请稍后...',
            success: res => {
              if (res.retCode == '0') {
                this.$message.success('提交成功');
                this.clearVal();
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
          if (this.formData.startTime == '') {
            this.$refs.timerS.showErr('请选择开始时间');
          }
          if (this.formData.endTime == '') {
            this.$refs.timerE.showErr('请选择结束时间');
          }
          return false;
        }
      });
    },
    handleSaleMatchs() {
      let saleMatchs = [];
      //专题 赛事  频道 连版
      if (
        this.formData.advTabType == 5 ||
        this.formData.advTabType == 6 ||
        this.formData.advTabType == 9 ||
        this.formData.advTabType == 10 ||
        this.formData.advTabType == 11
      ) {
        saleMatchs = [
          {
            matchId: this.formData.advTopicId || this.formData.advMatchId || this.formData.concernId,
            matchName: ''
          }
        ];
      } else if (this.formData.advTabType == 12 || this.formData.advTabType == 13) {
        //球队主页
        let teamId = this.formData.teamId;
        teamId.split(',').filter(tId => {
          if (tId.trim() != '' && tId.length) {
            saleMatchs.push({
              matchId: tId.trim(),
              matchName: ''
            });
          }
        });
      } else if (this.formData.advTabType == 3) {
        //比赛推荐
        let list =
          this.formData.advTabType == 3
            ? this.formData.relationChannelId
            : this.formData.contentType == 1 ? this.formData.relationMatchId : this.formData.relationProgramId;
        list.split(',').filter(id => {
          if (id != '' && id != ' ' && id.length) {
            saleMatchs.push({
              matchId: id.trim(),
              matchName: ''
            });
          }
        });
      } else if (this.formData.advTabType == 8 || this.formData.advTabType == 7) {
        //浮层和对阵
        if (this.formData.contentType == 1) {
          this.curCheckedVal.filter(id => {
            if (id != '' && id != ' ' && id.length) {
              saleMatchs.push({
                contentType: 1,
                matchId: id.trim(),
                matchName: ''
              });
            }
          });
        }
        if (this.formData.contentType == 2) {
          let ids = this.formData.relationProgramId;
          ids.split(',').filter(id => {
            saleMatchs.push({
              contentType: 2,
              matchId: id.trim(),
              matchName: ''
            });
          });
        }
      } else if (this.formData.advTabType == 2 || this.formData.advTabType == 4) {
        //数据频道和热门比赛
        this.curCheckedVal.filter(id => {
          if (id != '' && id != ' ' && id.length) {
            saleMatchs.push({
              matchId: id.trim(),
              matchName: ''
            });
          }
        });
      }
      return saleMatchs;
    },
    handelProgramIds() {
      let ids = [];
      this.programIds.filter(item => {
        if (item.value != '') {
          ids.push(item.value);
        }
      });

      return ids;
    },
    advClose() {
      this.clearVal();
      this.curAdvItem = {};
      this.advFlag = this.advSaleFlag = false;
    },
    saleOn(row) {
      if (row.status == 1) return;
      this.saleOnFlag = true;
      this.curAdvItem = row;
    },
    saleOnAdv() {
      let params = {};
      params.advId = this.curAdvItem.advId;
      params.matchs = this.curAdvItem.saleMatchs;
      params.saleCode = 1;
      this.reqSaleAdv(params);
    },
    saleOff(row) {
      if (row.status == 0) return;
      this.saleOffFlag = true;
      this.curAdvItem = row;
    },
    saleOffAdv() {
      let params = {};
      params.advId = this.curAdvItem.advId;
      params.matchs = [];
      params.saleCode = 0;
      this.reqSaleAdv(params);
    },
    hideSaleOffConfirm() {
      this.saleOffFlag = false;
      this.curAdvItem = {};
    },
    hideSaleOnConfirm() {
      this.saleOnFlag = false;
      this.curAdvItem = {};
    },
    reqSaleAdv(params) {
      this.$ajax({
        url: DI.g_advment.saleTitleAdv,
        data: JSON.stringify(params),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success(params.saleCode ? '上架成功' : '下架成功');
            this.clearVal();
            this.advSaleFlag = false;
            setTimeout(() => {
              this.queryList(this.pageIndex);
            }, 1000);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    add() {
      this.clearVal();
      this.modalTitle = '添加广告';
      this.advFlag = true;
      this.formData.advTabType = 2;
      this.aspectRatio = 710 / 90;
    },
    handleValidateUrl(row) {
      if (row.advJumpUrl.startsWith('http://') || row.advJumpUrl.startsWith('https://')) {
        return '7';
      } else if (row.advJumpUrl.startsWith('pptvsports://')) {
        return '10';
      } else if (row.advJumpUrl == '') {
        return '9';
      }
    },
    edit(row) {
      if (row.status === 1) return;
      this.getCheckedId(row.saleMatchs); // 显示已选择标签Id组合
      this.formData = {
        advTabType: row.advTabType,
        advId: row.advId,
        advImgUrl: row.advImgUrl,
        advJumpType: row.advJumpUrl,
        advJumpUrl: row.advJumpUrl,
        startTime: row.startTime,
        endTime: row.endTime,
        advSlogans: row.advSlogans,
        advTopicId: row.advTabType == 5 ? this.handleIds(row) : '',
        advMatchId: row.advTabType == 6 ? this.handleIds(row) : '',
        teamId: row.advTabType == 12 || row.advTabType == 13 ? this.handleIds(row) : '',
        relationProgramId: (row.advTabType == 7 || row.advTabType == 8) && this.handleContentType(row) == 2 ? this.handleIds(row) : '',
        relationMatchId: (row.advTabType == 7 || row.advTabType == 8) && this.handleContentType(row) == 1 ? this.handleIds(row) : '',
        relationChannelId: row.advTabType == 3 ? this.handleIds(row) : '',
        contentType: this.handleContentType(row),
        concernId: row.advTabType == 9 || row.advTabType == 10 || row.advTabType == 11 ? this.handleIds(row) : '',
        saleMatchs: row.saleMatchs == null ? [] : row.saleMatchs
      };
      this.modalTitle = '编辑广告';
      this.advFlag = true;

      if (row.advTabType == 1) {
        this.aspectRatio = 702 / 225;
      } else if (row.advTabType == 2 || row.advTabType == 10 || row.advTabType == 11) {
        this.aspectRatio = 710 / 90;
      } else if (row.advTabType == 7) {
        this.aspectRatio = 375 / 120;
      } else if (row.advTabType == 13) { //横图
        this.aspectRatio = 288 / 40;
      } else if (row.advTabType == 12) { //小图
        this.aspectRatio = 1;
      } else {
        this.aspectRatio = 100 / 32;
      }

      if (row.advTabType == 3) {
        this.advSlogansLn = 6;
      } else if (row.advTabType == 4) {
        this.advSlogansLn = 10;
      }
    },
    handleIds(row) {
      if (row.advTabType == 5 || row.advTabType == 6 || row.advTabType == 9 || row.advTabType == 10 || row.advTabType == 11) {
        return row.saleMatchs[0] ? row.saleMatchs[0].matchId : '';
      } else if (row.advTabType == 3 || row.advTabType == 7 || row.advTabType == 8 || row.advTabType == 12 || row.advTabType == 13) {
        let ids = [];
        row.saleMatchs.filter(item => {
          ids.push(item.matchId);
        });
        return ids.join(',');
      } else {
        return '';
      }
    },
    handleContentType(row) {
      //1---赛事   2---节目
      let type = 2;
      if (row.advTabType == 7 || row.advTabType == 8) {
        row.saleMatchs.filter(item => {
          type = item.contentType;
        });
      }
      return type;
    },
    getCheckedId(list) {
      if (list !== null && list.length) {
        list.filter(item => {
          this.curCheckedVal.push(item.matchId);
        });
      }
    },
    showDelConfirm(row) {
      if (row.status === 1) return;
      this.delConFlag = true;
      this.delContent = row;
    },
    hideDelConfirm() {
      this.delConFlag = false;
    },
    deleteAdv() {
      let params = {};
      params.advId = this.delContent.advId;
      this.$ajax({
        url: DI.g_advment.deleteTitleAdv,
        data: JSON.stringify(params),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('删除成功');
            this.delConFlag = false;
            setTimeout(() => {
              this.queryList(this.pageIndex);
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
    queryList(pageNum) {
      if (pageNum == 0) {
        this.pageIndex = pageNum;
        this.$bus.$emit('syncCurPage', 1);
      }
      let params = {};
      params.advTabType = this.ruleForm.advBlong;
      params.advJumpType = this.ruleForm.advJumpUrl;
      params.status = this.ruleForm.advStatus;
      // 更改了结束时间或者开始时间，页面上会改变现实，但是没有触发时间，真实时间从dom中取
      params.startTime = this.$refs.filterTimeS.$refs.input.value;
      params.endTime = this.$refs.filterTimeE.$refs.input.value;
      params.pageIndex = pageNum ? (pageNum - 1) * this.pageSize : 0;
      params.pageSize = this.pageSize;
      params = this.$bus.deleteNullProperty(params);
      this.$ajax({
        url: DI.g_advment.queryTitleAdList,
        data: JSON.stringify(params),
        context: this,
        loadingText: '正在查询，请稍后...',
        success: res => {
          if (res.retCode == '0') {
            this.list = res.data.list || [];
            this.dataTotal = res.data.listNum || 0;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    queryMatchLabels() {
      //获取赛事标签集合
      this.$ajax({
        url: DI.g_advment.getFootballMatch,
        data: {},
        context: this,
        loadingText: '正在查询，请稍后...',
        success: res => {
          if (res.retCode == '0') {
            this.saleMatchList = res.data.list || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    handleAdvStatus(val) {
      this.ruleForm.advStatus = val;
      this.queryList(0);
    },
    handleAdvUrl(val) {
      this.ruleForm.advJumpUrl = val;
      this.queryList(0);
    },
    handleAdvBlong(val) {
      this.ruleForm.advBlong = val;
      this.queryList(0);
    },
    handleAdvType(val) {
      return Constant.getItemByValue(Constant.G_ADVBLONGLIST, val).name;
    },
    advTabChangeHandler(val) {
      this.$refs.formData && this.$refs.formData.resetFields();
      this.formData.advImgUrl = '';
      this.formData.advTabType = val;
      if (val == 1) {
        this.aspectRatio = 702 / 225;
      } else if (val == 2 || val == 10 || val == 11) {
        this.aspectRatio = 710 / 90;
      } else if (val == 7) {
        this.aspectRatio = 375 / 120;
      } else if (val == 9) {
        this.aspectRatio = 80 / 20;
      } else if (val == 8) {
        this.aspectRatio = '';
      } else if (val == 13) {
        this.aspectRatio = 288 / 40;
      } else if (val == 12) {
        this.aspectRatio = 1;
      } else {
        this.aspectRatio = 100 / 32;
      }
      this.$refs.timerS.showErr(false);
      this.$refs.timerE.showErr(false);
      this.programIdFlag = false;

      if (val == 3) {
        this.advSlogansLn = 6;
      } else if (val == 4) {
        this.advSlogansLn = 10;
      }
    },
    handelSelectAll() {
      //全选
      let list = [];
      if (this.selectAllVal) {
        this.saleMatchList.filter(item => {
          list.push(item.competitionId + '');
        });
      }
      this.curCheckedVal = list;
    }
  }
};
</script>
<style scoped>
.container {
  .ibox {
    display: flex;
    align-items: center;
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
      }
      .input-box {
        display: flex;
        margin: 20px;
        float: left;
        div {
          & + div {
            margin-left: 30px;
          }
        }
      }
      .select-box {
        display: flex;
        height: 30px;
        align-items: center;
        margin-bottom: 20px;
        margin-right: 20px;
        float: left;
        color: #999;
        .text {
          margin-right: 10px;
        }
      }
      .blongs {
        margin-bottom: 0;
        margin-left: 0;
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
        width: 200px;
        height: 64.1px;
      }
    }
    .adv-title {
      padding-left: 8px;
    }
  }
  .remind-par {
    padding-top: 5px;
    color: #f00;
    font-size: 12px;
    text-align: left;
    padding-left: 80px;
    display: block;
  }
  .remind-url {
    margin-top: -10px;
    margin-bottom: 5px;
    color: #f00;
    font-size: 12px;
    text-align: left;
    padding-left: 80px;
  }
  .filteTtimeRemind {
    display: block;
    position: relative;
    top: -15px;
  }
  .form-item {
    margin-bottom: 15px;
    .form-item__label:before {
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
  .saleMatchItem {
    margin-bottom: 0;
    flex-direction: column;
    .saleMatchBox {
      width: 320px;
      margin-top: 5px;
      text-align: left;
      .saleMatchBox-item {
        margin: 0 27px 10px 0;
      }
    }
    .selectAll {
      float: left;
      margin-top: 6px;
      width: 100%;
      text-align: left;
    }
  }
  .btn-disabled {
    cursor: not-allowed;
    color: #ccc;
    &:hover {
      text-decoration: none;
    }
  }
  .status-wrap {
    margin-top: 5px;
    p + {
      margin-top: 5px;
      line-height: 1.3;
    }
  }
  .tip {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    img {
      height: 16px;
      margin-right: 5px;
    }
    span {
      font-size: 14px;
      color: #999;
    }
  }
  .form-item__label {
    width: 80px;
  }
  .form-item__content {
    margin-left: 80px;
    display: flex;
    align-items: center;
    span {
      margin: 0 8px;
    }
  }
  .relationTips {
    text-align: left;
    font-size: 12px;
    margin-top: 5px;
    color: #999;
  }
}
</style>
