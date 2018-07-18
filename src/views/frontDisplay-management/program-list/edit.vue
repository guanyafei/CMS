<!-->节目内容列表编辑弹框组件<-->
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
  <sn-confirm txt @sure="sure" @close="close" :flag="showFlag" title="编辑">
    <sn-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" formWidth="505">
      <!-- 视频期数 -->
      <sn-form-item label="视频期数" prop="term">
        <sn-input
          class="mr-30"
          v-model="term"
          width="360"
          height="32"
          radius="0"
          placeholder="请输入期数"
          inputType="number"
          maxlength=20></sn-input>
      </sn-form-item>
      <!-- 视频类型 -->
        <sn-form-item label="视频类型" prop="title">
          <sn-select v-model="typeTitle" placeholder="请选择" radius="0" width="360" height="32" @change="handleTypeChange">
              <sn-option v-for="item in typeList"
                :key="item.key"
                :name="item.name"
                :value="item.name">
            </sn-option>
          </sn-select>
      </sn-form-item>
    </sn-form>
  </sn-confirm>
</template>

<script>
import DI from 'interface';
export default {
  data() {
    return {
      showFlag:false,
      name:'',
      match:'',
      getCompetitionInfo:'',
      nameMaxLen:'',
      term:'',
      type:'',
      typeTitle:'',
      contentId:'',
      typeList: [{
        key: '1',
        value: '正片',
        name: '正片'
      },{
        key: '2',
        value: '花絮',
        name: '花絮'
      }],
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
    sure() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$ajax({
            url:DI.programList.editProgramContent,
            data: JSON.stringify({
              contentId:this.contentId,
              programId:this.$parent.$parent.programId,
              term:this.term,
              type:this.type
            }),
            context: this,
            success: res => {
              if (res.retCode == '0') {
                this.$message.success('创建成功');
                this.close();
                this.$parent.$parent.goto(1);
              }else{
                this.$message.error(res.retMsg);
              }
            },
            error: () => {
              console.error('error');
            }
          })
        }
      });
    },
    handleTypeChange(val){
      val == "正片"?(this.typeTitle = "正片"):(this.typeTitle = "花絮");
      val == "正片"?(this.type = "1"):(this.type = "2");
      console.log(this.type);
    }
  },
};
</script>
