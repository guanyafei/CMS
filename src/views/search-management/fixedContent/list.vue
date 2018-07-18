
<template>
  <div class="container">
    <div class="crumb-section">
      <div class="is-line">
        <div class="time-section">
          <span class="mr-10">上架时间</span>
          <sn-timer ref="startTime" v-model="startTime" placeholder="起始时间" width="200" :maxDate="endTime" showTimepicker></sn-timer>
          <span class="mr-10" style="margin-left:10px;">至</span>
          <sn-timer ref="endTime" v-model="endTime" placeholder="结束时间" width="200" :minDate="startTime" showTimepicker></sn-timer>
        </div>
        <sn-button type="primary" @click="query">查询</sn-button>
      </div>
      <div class="is-line search-section">
        <sn-input v-model="keyword" placeholder="请输入关键词" radius="16" width="168"></sn-input>
        <sn-button type="outline" @click="addContent">新增</sn-button>
      </div>
      <sn-button class="batch-delbtn" type="warning" @click="batchDelHandle('batchDelete')">批量删除</sn-button>
    </div>
    <sn-datatable class="mt-10" :data="contentList" :border="true">
      <sn-datacolumn label="自定义" prop="checkbox" width="5%" :column-border="false">
        <sn-checkbox type="checkbox" v-model="checkAll" @change="handleCheckAllChange($event)"></sn-checkbox>
      </sn-datacolumn>
      <sn-datacolumn label="序号" prop="index" width="5%" alignment="left"></sn-datacolumn>
      <sn-datacolumn label="关键词" prop="keyword" width="10%"></sn-datacolumn>
      <sn-datacolumn label="URL" prop="jumpUrl" width="20%"></sn-datacolumn>
      <sn-datacolumn label="状态" prop="status" width="5%"></sn-datacolumn>
      <sn-datacolumn label="起始时间" prop="startTime" width="15%"></sn-datacolumn>
      <sn-datacolumn label="结束时间" prop="endTime" width="15%"></sn-datacolumn>
      <sn-datacolumn label="修改人" prop="operator" width="10%"></sn-datacolumn>
      <sn-datacolumn label="操作" prop="opt" width="15%"></sn-datacolumn>
      <template slot-scope="{row}" slot="checkbox">
        <sn-checkbox type="checkbox" v-model="curSelecteds" :label="row.id"></sn-checkbox>
      </template>
      <template slot-scope="cell" slot="index">{{cell.index + 1}}</template>
      <template slot-scope="{row}" slot="status">{{row.status ? '上架' : '下架'}}</template>
      <template slot-scope="{row}" slot="opt">
        <div class="btn-group">
          <sn-button class="mr-10" type="text" @click="editContent(row)">编辑</sn-button>
          <sn-button type="text" @click="delContent(row.id,'delete')">删除</sn-button>
        </div>
      </template>
    </sn-datatable>
    <sn-pagination ref="pagination" :size="pageSize" :total="totalCount" @goto="goto"></sn-pagination>
    <!--内容保存弹框-->
    <sn-confirm :title="fixedContentTitle" txt :flag="saveFixedContentFlag" @sure="saveFixedContentSure('formData')" @close="saveFixedContentClose">
      <sn-form ref="formData" :model="formData" :rules="contentRules" labelWidth="80px" formWidth="420">
        <sn-form-item label="关键词" prop="keyword">
          <sn-input v-model="formData.keyword" placeholder="请输入关键词" width="306" maxlength="10" totalWords="10" showWord @input="handleInputChange"></sn-input>
        </sn-form-item>
        <sn-form-item label="跳转链接" prop="jumpUrl">
          <sn-radio-group v-model="rdoVal">
            <sn-radio :label="1">内部页面</sn-radio>
            <sn-radio :label="2">内链H5</sn-radio>
            <sn-radio :label="3">外链</sn-radio>
          </sn-radio-group>
          <sn-input v-model="formData.jumpUrl" :placeholder="placeholder" width="306"></sn-input>
        </sn-form-item>
        <div class="form-items">
          <label class="form-item_label">生效时间</label>
          <div class="form-item_content">
            <sn-timer placeholder="开始时间" v-model="ruleData.startTime" radius="4" width="140" showTimepicker></sn-timer>
            <span class="splitText">至</span>
            <sn-timer placeholder="结束时间" v-model="ruleData.endTime" radius="4" width="140" showTimepicker :minDate="showTime"></sn-timer>
          </div>
          <p class="remindTips" v-if="remindErrFlag">{{remindMsg}}</p>
        </div>
      </sn-form>
    </sn-confirm>
    <!--删除提示弹框(批量)-->
    <sn-confirm v-if="viewType == 'delete' || viewType == 'batchDelete'" title="删除提示" @sure="delContentSure" @close="delContentClose" txt noflag>确定要删除当前(选中)内容吗?</sn-confirm>
  </div>
</template>
<script>
import DI from 'interface';
import * as Constant from 'js/constant';
export default {
  data() {
    let _self = this;
    let handleValidation = (rule, value, callback) => {
      if (_self.rdoVal == 1 && !value.startsWith('pptvsports://')) {
        callback(new Error('请输入pptvsports://开头的原生页面路由地址'));
      } else if (_self.rdoVal == 2 && !(value.startsWith('http://') || value.startsWith('https://'))) {
        callback(new Error('请输入http://或https://开头的页面路由地址'));
      } else if (_self.rdoVal == 3 && !(value.startsWith('http://') || value.startsWith('https://'))) {
        callback(new Error('请输入http://或https://开头的页面路由地址'));
      } else {
        callback();
      }
    };
    return {
      showTime: new Date(),
      fixedContentName: '',
      remindMsg: '',
      remindErrFlag: true,
      rdoVal: '1',
      jumpUrlTypeList: Constant.COMMON_JUMP_LINK_TYPES,
      placeholder: '请输入pptvsports://开头的原生页面路由地址',
      pageIndex: 0,
      pageSize: 20,
      totalCount: 0,
      curItem: {},
      viewType: '',
      startTime: null,
      endTime: null,
      keyword: '',
      fixedContentTitle: '',
      saveFixedContentFlag: false,
      contentRules: {
        keyword: [
          {
            required: true,
            message: '请输入关键词',
            trigger: 'change'
          }
        ],
        jumpUrl: [
          {
            required: true,
            message: '跳转链接不可为空',
            trigger: 'change'
          },
          {
            validator: handleValidation,
            trigger: 'change'
          }
        ]
      },
      ruleData: {
        startTime: '',
        endTime: ''
      },
      formData: {
        keyword: '',
        jumpUrl: ''
      },
      contentList: [],
      checkAll: false,
      curSelecteds: []
    };
  },
  watch: {
    curSelecteds(newArr) {
      this.contentList.length != 0 && newArr.length == this.contentList.length ? (this.checkAll = true) : (this.checkAll = false);
    },
    rdoVal(newVal) {
      this.placeholder = Constant.getItemByValue(this.jumpUrlTypeList, newVal).placeholder;
    }
  },
  mounted() {
    this.queryContentList(0);
  },
  methods: {
    handleInputChange(val) {
      clearInterval(timeId);
      var timeId = setTimeout(()=>{this.delayFunction(val)},2000);
    },
    delayFunction(val) {
      for (let i = 0; i < this.contentList.length; i++) {
        const item = this.contentList[i];
        if (item.keyword == val) {
          this.$message.warning('当前已存在相同的关键词，请重新输入!');
          return;
        }
      }
    },
    clearVal() {
      this.formData.keyword = '';
      this.formData.jumpUrl = '';
      this.showTime = new Date();
      this.ruleData.startTime = '';
      this.ruleData.endTime = '';
      this.remindMsg = '';
      this.rdoVal = '1';
      this.remindErrFlag = false;
      this.$refs.startTime.showErr(false);
      this.$refs.endTime.showErr(false);
      this.$refs.formData && this.$refs.formData.resetFields();
    },
    query() {
      this.clearDateErrMsg();
      if (!this.startTime && this.endTime) {
        this.$refs.startTime.showErr('请选择开始时间');
        return;
      }
      if (!this.endTime && this.startTime) {
        this.$refs.endTime.showErr('请选择结束时间');
        return;
      }
      if (this.startTime > this.endTime) {
        this.$refs.endTime.showErr('结束时间必须大于等于开始时间!');
        return;
      }
      this.queryContentList(0);
    },
    clearDateErrMsg(){
     this.$bus.$emit('clear-start-error');
     this.$bus.$emit('clear-end-error');
    },
    goto(num) {
      this.pageIndex = num;
      this.queryContentList(num);
      window.scrollTo(0, 0);
    },
    handleCheckAllChange(event) {
      //全选与取消
      if (this.checkAll && this.contentList.length != 0) {
        this.curSelecteds = this.contentList.reduce((preArr, item) => {
          preArr.push(item.id);
          return preArr;
        }, []);
      } else {
        this.curSelecteds = [];
      }
    },
    delContentSure() {
      //删除确认
      let pms = {};
      if (this.viewType == 'delete') {
        //单个删除
        pms.keywordIds = [this.curItem.id];
      } else if (this.viewType == 'batchDelete') {
        //批量删除
        pms.keywordIds = this.curSelecteds;
      }
      this.handleSubmitData(pms);
    },
    handleSubmitData(params) {
      this.$ajax({
        url: DI.fixedContent.batchDeleteKeywordList,
        data: JSON.stringify(params),
        loadingText: '正在删除中,请稍后...',
        success: res => {
          if (res.retCode == '0') {
            this.viewType = '';
            this.queryContentList(this.pageIndex);
          } else {
            this.$message.warning(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    delContentClose() {
      this.viewType = '';
      this.curSelecteds = [];
    },
    batchDelHandle(type) {
      //批量删除
      if (!this.curSelecteds.length) {
        this.$message.warning('请至少选择一条内容!');
        return;
      }
      this.viewType = type;
    },
    delContent(id, type) {
      this.curItem.id = id;
      this.viewType = type;
    },

    addContent() {
      //新增
      this.clearVal();
      this.fixedContentTitle = '新增固定内容';
      this.fixedContentName = 'addContent';
      this.saveFixedContentFlag = true;
    },
    editContent(row) {
      //编辑
      this.fixedContentTitle = '编辑固定内容';
      this.fixedContentName = 'editContent';
      this.rdoVal = row.jumpType;
      this.ruleData = {
        startTime: row.startTime,
        endTime: row.endTime
      };
      this.formData = {
        id: row.id,
        keyword: row.keyword,
        jumpUrl: row.jumpUrl
      };
      this.saveFixedContentFlag = true;
    },
    saveFixedContentClose() {
      this.clearVal();
      this.saveFixedContentFlag = false;
    },
    saveFixedContentSure(formName) {
      //保存
      this.$refs[formName].validate(valid => {
        const formData = this.formData;
        if (!this.ruleData.startTime) {
          this.remindErrFlag = true;
          this.remindMsg = '请选择开始时间';
          return;
        }
        if (!this.ruleData.endTime) {
          this.remindErrFlag = true;
          this.remindMsg = '请选择结束时间';
          return;
        }
        if (this.ruleData.startTime > this.ruleData.endTime) {
          this.remindErrFlag = true;
          this.remindMsg = '开始时间必须小于等于结束时间!';
          return;
        }
        if (valid) {
          let url = '';
          let params = {};
          if (this.fixedContentName == 'addContent') {
            url = DI.fixedContent.addKeywordList;
          } else if (this.fixedContentName == 'editContent') {
            url = DI.fixedContent.updateKeywordList;
            params.id = formData.id;
          }
          (params.jumpType = parseInt(this.rdoVal)), (params.keyword = formData.keyword);
          params.startTime = this.ruleData.startTime;
          params.endTime = this.ruleData.endTime;
          params.jumpUrl = formData.jumpUrl;
          this.$ajax({
            url: url,
            data: JSON.stringify(params),
            loadingText: '正在保存中,请稍后...',
            success: res => {
              if (res.retCode == '0') {
                this.saveFixedContentFlag = false;
                this.clearVal();
                this.queryContentList();
              } else {
                this.$message.warning(res.retMsg);
              }
            },
            error: () => {
              console.log('error');
            }
          });
        }
      });
    },
    queryContentList(pageindex) {
      if (pageindex == 0) {
        this.pageIndex = pageindex;
        this.$bus.$emit('syncCurPage', 1);
      }
      let pms = {
        pageIndex: pageindex != 0 ? (pageindex - 1) * this.pageSize : 0,
        pageSize: this.pageSize,
        startTime: this.startTime,
        endTime: this.endTime,
        keyword: this.keyword
      };
      pms = this.$bus.deleteNullProperty(pms);
      this.$ajax({
        url: DI.fixedContent.queryKeywordList,
        data: JSON.stringify(pms),
        loadingText: '正在加载中,请稍后...',
        success: res => {
          if (res.retCode == '0') {
            this.clearVal();
            this.contentList = res.data.list || [];
            this.totalCount = res.data.count || 0;
          } else {
            this.$message.warning(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    }
  }
};
</script>
<style>
.container-box .input-box .words {
  position: absolute;
  left: 238px !important;
  top: 10px;
  color: #bbb;
  right: 10px;
}
</style>

<style scoped>
.container {
  border-bottom: 1px solid #ccc;
  .crumb-section {
    margin-bottom: 16px;
    background: #fff;
  }
  .is-line {
    padding: 20px;
    justify-content: space-between;
  }
}
.time-section {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.search-section {
  margin-top: -20px;
}
.batch-delbtn {
  margin-left: 20px;
  margin-bottom: 20px;
}
.btn-group {
  display: flex;
  justify-content: center;
  align-items: center;
}
.form-items {
  margin-top: 20px;
  .form-item_label {
    margin-top: 8px;
    color: #999;
    font-size: 14px;
    float: left;
    &::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      background: #09bbfe;
      border-radius: 50%;
      margin-right: 3px;
      vertical-align: center;
    }
  }
  .form-item_content {
    margin-left: 80px;
    display: flex;
    align-items: center;
    span {
      color: #999;
      margin: 0 4px;
    }
  }
  .remindTips {
    margin-left: 80px;
    padding-top: 5px;
    text-align: left;
    color: #ff4949;
    font-size: 12px;
  }
}
</style>

