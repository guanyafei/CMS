<!-->节目内容列表页面的查询功能组件<-->
<template>
  <div class="crumb">
    <div class="is-line line space-between">
      <div class="is-line">
          <span class="label mr-10">视频ID</span>
        <sn-input ref="contentId"
          class="mr-30"
          v-model="ajaxData.contentId"
          width="200"
          radius="16"
          placeholder="请输入视频ID"
          inputType="number"
          maxlength=20></sn-input>
          <span class="label mr-10">标题名称</span>
        <sn-input class="mr-30"
          v-model="ajaxData.contentTitle"
          width="200"
          radius="16"
          placeholder="请输入标题关键字"
          maxlength=30></sn-input>
      </div>
      <sn-button type="primary" @click="query">查询</sn-button>
    </div>
    <div class="is-line line space-between">
      <div class="is-line cell mr-30">
        <span class="label">期数</span>
        <sn-select ref="term"
          v-model="ajaxData.term"
          placeholder="全部"
          radius="16"
          width="135"
          @change="handleTypeChange">
          <sn-option key='all'
            name='全部'
            :value='-1'></sn-option>
          <sn-option v-for="item in termList"
            :key="item.term"
            :name="item.term"
            :value="item.term"
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
      termList:'',
      term:"",
      ajaxData : {
        contentId:'',
        contentTitle:'',
        programId:this.$parent.programId,
        term:'',
        pageIndex: 0,
        pageSize:20,
      }
    };
  },
  computed: {
    matchRules() {
      const requiredValidation = (rule, value, callback) => {
        callback();
      };

      return [
        {
          required: false,
          message: '请添加比赛标签',
          type: 'array',
          trigger: 'change'
        },
        {
          validator: requiredValidation,
          trigger: 'change'
        }
      ];
    },
  },
  methods: {
    handleTypeChange(code) {
      code == -1?(code = ""):"";
      this.ajaxData.term = code;
      this.query();
    },
    reset() {
      this.ajaxData.contentId = "";
      this.ajaxData.contentTitle = "";
      this.ajaxData.term = "";
    },
    query(){
      this.ajaxData.programId = this.$parent.programId;
      //查询频道列表
      this.$ajax({
        // url: DI.programMana.queryProgramList,
        url:DI.programList.queryProgramContentList,
        data: JSON.stringify(this.ajaxData),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            this.$parent.$refs.list.list = resData.programContentList || [];
            this.$parent.$refs.list.dataTotal = resData.contentNum || 0;
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
};
</script>

<style scoped>
.crumb {
  background-color: #ffffff;
  width: 100%;
  padding-top:20px;
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
