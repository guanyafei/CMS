<style scoped>
  .baseInfo {
    text-align: left;
    width: 113%;
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
  .BU_radio{
    margin-right: 20px;
    margin-left: 0 !important;
    margin-top: 10px;
  }
  .totle_radio{
    text-align: left !important;
    margin-top: -10px;
  }
</style>
<template>
  <sn-confirm txt @sure="sure" @close="close" :flag="showFlag" :title="title">
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
          <sn-option name='全部'
          value=''></sn-option>
          <sn-option v-for="item in labelData.sportsTypeList" 
          :name="item.sportItemName" 
          :key="item.sportItemName"
          :value="item.sportItemName"
          ></sn-option>
        </sn-select>
      </sn-form-item>
      <!-- 关联赛事 -->
      <sn-form-item label="关联赛事" prop="match">
        <sn-select v-model="formData.match" placeholder="请选择" radius="6" width="100%" @change="handleAddMatch" >
          <sn-option name='全部'
          value=''></sn-option>
          <sn-option v-for="item in getCompetitionInfo.list" 
          :name="item.competitionName" 
          :key="item.competitionName"
          :value="item.competitionName"
          ></sn-option>
        </sn-select>
      </sn-form-item>
    </sn-form>
  </sn-confirm>
</template>

<script>
import _ from 'lodash';
import DI from 'interface';
import * as Constant from 'js/constant';
export default {
  props: {
    list_: {
      type: Array,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      ruleForm: {
        name:'',
        introduction:'',
        labelList:[]
      },
      label_info:null,//资讯栏目label数据
      label_BU:null,  //BU的label数据
      label_sport:null,//运动分类的label数据
      label_match:null,//关联赛事的label数据
      title: '',
      subTitle: '',
      nameplaceholder: '',
      instroduceplaceholder:'',
      flag_error: false,
      showFlag: false,
      nameMaxLen: 30,
      formData: {
        infoCol: '',      //资讯栏目
        BU:'',            //所属BU集合
        sport:'123',         //运动分类
        match:'',         //关联赛事
        default:'1',
        other:'0',
        resource: '', //资讯来源
      },
      labelData:'',   //获取资讯栏目、所属BU、运动分类数据
      sportItemId:'', //获取关联赛事所需的id
      getCompetitionInfo:'',//获取关联赛事的数据,
      programId:'',//编辑的时候针对id赋值
      matchId:'',//获取所选择赛事ID
      rules() {
        return {
          name: [{
            required: true,
            min: 1,
            max: 10,
            message: '请输入节目名称',
            trigger: 'change'
          }],
          introduction: [{
            required: true,
            min: 1,
            max: 100,
            message: '请输入节目简介',
            trigger: 'change'
          }]
        }
      }
    }
  },
  methods: {
    close () {
      this.showFlag = false;
      this.$refs.tag && this.$refs.tag.clearData();
    },
    //运动分类操作
    handleAddType (val) {
      console.log(val);
      this.labelData.sportsTypeList.forEach((item) =>{
        if(item.sportItemName == val){
          this.sportItemId = item.sportItemId;
          return;
        }
      })
      this.label_sport = null;
      this.label_sport = {
        labelId:this.sportItemId,
        labelLogo:'',
        labelName:val,
        labelType:3
      }
      //获取关联赛事数据
      this.getMatchData();
      this.flag_error = false;
      this.formData.sport = val;
    },
    //资讯栏目操作
    handleInfoCol(value){
      let infoColId = "";
      this.labelData.columnLabelList.forEach((item) =>{
        if(item.labelName == value){
          infoColId = item.labelId;
          return;
        }
      })
      this.label_info = null;
      this.label_info = {
        labelId:infoColId,
        labelLogo:'',
        labelName:value,
        labelType:2
      }
    },
    //所属BU操作
    handleBU(value){
      let BuId = "";
      this.labelData.buLabelList.forEach((item) =>{
        if(item.sportItemName == value){
          BuId = item.labelId;
          return;
        }
      })
      this.label_BU = null;
      this.label_BU = {
        labelId:BuId,
        labelLogo:'',
        labelName:value,
        labelType:10
      }
    },
    //关联赛事操作
    handleAddMatch(value){
      this.getCompetitionInfo.list.forEach((item) =>{
        if(item.competitionName == value){
          this.matchId = item.competitionId;
          return;
        }
      })
      this.label_match = null;
      this.label_match = {
        labelId:this.matchId,
        labelLogo:'',
        labelName:value,
        labelType:4
      }
      this.formData.match = value;
    },
    filter () {
      this.subTitle = '节目';
      this.title = (this.programId != "" ? '编辑' : '新建') + this.subTitle;
      this.nameplaceholder = '请输入栏目名称（1-30个字）';
      this.instroduceplaceholder = '请输入栏目名称（1-100个字）';
      this.nameMaxLen = 10;
      this.instroMaxLen = 100;
    },
    sure() {
      console.log('=========submit', this.ruleForm);
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.label_info != null?(this.ruleForm.labelList.push(this.label_info)):(this.label_info = null);
          this.label_BU != null?(this.ruleForm.labelList.push(this.label_BU)):(this.label_BU = null);
          this.label_sport != null?(this.ruleForm.labelList.push(this.label_sport)):(this.label_sport = null);
          this.label_match != null?(this.ruleForm.labelList.push(this.label_match)):(this.label_match = null);
          let url_ = "";
          if(this.programId == ""){
            url_ = DI.programMana.addProgram;
            delete this.ruleForm.programId;
          }else{
            url_ = DI.programMana.editProgram;
            this.ruleForm.programId = this.programId;
          }
          this.$ajax({
            url:url_,
            data: JSON.stringify(this.ruleForm),
            context: this,
            success: res => {
              if (res.retCode == '0') {
                this.$message.success('创建成功');
                this.close();
                setTimeout(() => {
                  // this.$parent.getList(1);
                  this.query();
                }, 800)
                // this.query();
              }
            },
            error: () => {
              console.error('error');
            }
          })
        }
      });
    },
    query(){
      let ajaxData = {
          programId: '', //文章ID非必填
          programName: '', //文章标题非必填
          status: '', //状态非必填
          pageIndex: 0,
          pageSize: 20,
        }
      //查询频道列表
      this.$ajax({
        url: DI.programMana.queryProgramList,
        data: JSON.stringify(ajaxData),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            setTimeout(()=>{
            },800)
            this.$parent._list = resData.programList || [];
            this.$parent.dataTotal = resData.programNum || 0;
            this.$emit("changeList", resData.programList);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    //获取新建节目标签
    getInitLabel(){
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
    getMatchData(){
      this.$ajax({
        url: DI.programMana.competionId+'?sportItemId='+this.sportItemId,
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
    this.getInitLabel();
  }
};
</script>
