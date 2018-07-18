<template>
  <div class="crumb">
    <div class="is-line line space-between">
      <div class="is-line">
          <span class="label mr-10">节目ID</span>
        <sn-input ref="programId"
          class="mr-30"
          v-model="ajaxData.programId"
          width="200"
          radius="16"
          placeholder="请输入ID"
          inputType="number"
          maxlength=20></sn-input>
          <span class="label mr-10">节目名称</span>
        <sn-input class="mr-30"
          v-model="ajaxData.programName"
          width="200"
          radius="16"
          placeholder="请输入名称"
          maxlength=30></sn-input>
      </div>
      <sn-button type="primary" @click="query">查询</sn-button>
    </div>
    <div class="is-line line space-between">
      <div class="is-line cell mr-30">
        <span class="label">状态</span>
        <sn-select ref="status"
          v-model="ajaxData.status"
          placeholder="全部"
          radius="16"
          width="135"
          @change="handleTypeChange">
          <sn-option key='all'
            name='全部'
            :value='-1'></sn-option>
          <sn-option v-for="item in typeList"
            :key="item.key"
            :name="item.name"
            :value="item.key"
            :disabled="item.disabled">
          </sn-option>
        </sn-select>
      </div>
      <sn-button @click="reset">重置</sn-button>
    </div>
  </div>
</template>

<script>
import DI from 'interface';
export default {
  name: 'crumb',
  props: {
    selectedChannelId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      channelId: this.selectedChannelId || '',
      channelList: [],
      typeList: [{
        key: '0',
        value: '下线',
        name: '下线'
      },{
        key: '1',
        value: '上线',
        name: '上线 '
      }],
      ajaxData:{
        programId: '', //文章ID非必填
        programName: '', //文章标题非必填
        status: '', //状态非必填
        pageIndex: 0,
        pageSize: 20,
      }
    };
  },
  methods: {
    handleTypeChange(code) {
      code == -1?(code = ""):"";
      this.ajaxData.status = code;
      this.$parent.status = code; 
      if( ((this.$parent.status).length != 0) && ((this.ajaxData.programId).length != 0) ){
        this.$parent.ajaxProgramId = this.ajaxData.programId;
      }else if( ((this.ajaxData.programName).length != 0) && ((this.$parent.status).length != 0) ){
        this.$parent.ajaxProgramName = this.ajaxData.programName;
      }else if( ((this.ajaxData.programName).length != 0) && ((this.ajaxData.programId).length != 0) ){
        this.$parent.ajaxProgramName = this.ajaxData.programName;
        this.$parent.ajaxProgramId = this.ajaxData.programId;
      }
      this.selectList();
    },
    reset() {
      this.ajaxData = {
        programId: '', //文章ID非必填
        programName: '', //文章标题非必填
        status: '', //状态非必填
        pageIndex: 0,
        pageSize: 20,
      }
      this.$parent.status = "";
      this.$parent.ajaxProgramId = "";
      this.$parent.ajaxProgramName = "";
    },
    query(){
      if((this.ajaxData.programId).length != 0){
        this.$parent.ajaxProgramId = this.ajaxData.programId;
      }else if((this.ajaxData.programName).length != 0){
        this.$parent.ajaxProgramName = this.ajaxData.programName;
      }else if( ((this.ajaxData.programName).length != 0) && ((this.ajaxData.programId).length != 0) ){
        this.$parent.ajaxProgramName = this.ajaxData.programName;
        this.$parent.ajaxProgramId = this.ajaxData.programId;
      }
      this.selectList();
    },
    selectList(){
      //查询频道列表
      this.$ajax({
        url: DI.programMana.queryProgramList,
        data: JSON.stringify(this.ajaxData),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            this.$parent.lists = resData.programList || [];
            this.$parent.dataTotal = resData.programNum || 0;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
  },
};
</script>

<style scoped>
.crumb {
  background-color: #ffffff;
  width: 100%;
}

.cell {
  padding: 20px 0 10px;
  .label {
    padding-right: 10px;
  }
}

.line {
  padding-left: 20px;
  padding-right: 20px;
}

.btn-group {
  padding-left: 20px;
  padding-bottom: 20px;
  button {
    width: 108px;
    & + button {
      margin-left: 30px;
    }
  }
}
</style>
