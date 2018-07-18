<template>
  <div>
    <sn-form-item label="加入节目" label-width="110px">
      <sn-autocomplete
        v-model="searchInput"
        valueKey="name"
        :isSuggestionsPages="true"
        :fetchSuggestions="querySearchAsync"
        placeholder="输入节目ID或节目名称查询"
        @select="selectItem"
        :width="360"
      >
        <div slot-scope="{item}">
          <span>{{item.name}}</span>
        </div>
      </sn-autocomplete>
      <div class="program" v-if="programFlag">
        <div class="programInfo">
          <span class="mr-5">{{ruleForm.program.name}}</span>
          <sn-input inputType="number" class="mr-5" width="60" height="24" v-model="ruleForm.program.term"></sn-input>
          <sn-select class="mr-5" v-model="ruleForm.program.type" radius="6" width="76" height="24" @change="changeType">
            <sn-option :key="1" name="正片" :value="1" :disabled="ruleForm.batchVideoList.length>1"></sn-option>
            <sn-option :key="2" name="花絮" :value="2"></sn-option>
          </sn-select>
        </div>
        <div class="delete" @click="remove">删除</div>
      </div>
    </sn-form-item>
  </div>
</template>

<script>
import DI from 'interface'

export default {
  name: 'VideoProgram',
  componentName: 'VideoProgram',
  components: {
    
  },
  props: ['ruleForm'],
  data() {
    return {
      searchInput: '',
      programFlag: false
    };
  },
  methods: {
    changeType(val) {
      this.ruleForm.program.type = val;
    },
    remove() {
      this.ruleForm.program = null;
      this.programFlag = false;
    },
    querySearchAsync(options, cb) {
      let params = {
        pageNum: options.pageIndex,
        pageSize: options.pageSize,
        programInfo: options.queryString
      };

      this.$ajax({
        url: DI.publishVideo.queryProgram,
        context: this,
        loadingText: 'false',
        data: JSON.stringify(params),
        success: res => {
          const labelList = res.data.programList || [];
          cb(labelList);
        },
        error: () => {
          console.log('error');
        }
      });
    },
    selectItem(item) {
      this.programFlag = true;
      this.ruleForm.program = {
        name: item.name,
        programId: item.programId,
        term: '',
        type: 1
      };
    }
  }
};
</script>
<style scoped>
.leftID {
  padding-left: 15px;
}
.program {
  margin-top: 2px;
  width: 360px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .programInfo {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: left;
    .mr-5 {
      margin-right: 5px;
    }
  }
  .delete {
    cursor: pointer;
    color: #1684C2;
    padding: 5px 8px;
  }
}
</style>



