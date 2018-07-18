<template>
  <div class="container">
    <sn-topbar title="展示位管理"></sn-topbar>
    <div class="ibox">
      <div class="search-box">
        <div class="input-box">
          <span class="text ml-30">展示位ID</span>
          <sn-input placeholder="请输入展示位ID" v-model="searchId" width="178" radius="16" :maxlength="20" inputType="number" class="ml-30" />
          <span class="text ml-30">展示位名称</span>
          <sn-input placeholder="请输入展示位名称" width="178" v-model="searchIitle" radius="16" :maxlength="10" class="ml-30" />
        </div>
      </div>
      <div class="search-btns">
        <p class="align-end">
          <sn-button type="primary" @click="searchDisplay">查询</sn-button>
          <sn-button type="default" class="reset-btn" @click="resetSearch">重置</sn-button>
        </p>
        <p class="add-btn">
          <sn-button type="outline" @click="showAdd()">创建展位</sn-button>
        </p>
      </div>
    </div>
    <sn-table :data='displayList' ref='table'>
      <sn-table-column label='展示位ID' width="10%" prop='id' align='center'></sn-table-column>
      <sn-table-column label='展示位名称' width="20%" prop='title' align='center'></sn-table-column>
      <sn-table-column label='类型' width="15%" align="center" sloted>
        <template slot-scope="row">
          通用
        </template>
      </sn-table-column>
      <sn-table-column label='备注' width="20%" prop='remark' align='center'></sn-table-column>
      <sn-table-column label='状态' width="20%" sloted>
        <template slot-scope="row">
          <span>{{getDisplayStatus(row.status)}}</span>
        </template>
      </sn-table-column>
      <sn-table-column label='操作'  align="center" sloted>
        <template slot-scope="row">
          <div class="is-column">
              <p class="operate-par">
                <a v-if="row.status == '1'" class="disable-link" href="javascript:;" >编辑</a>
                <a v-else href="javascript:;" @click="showEdit(row)">编辑</a>
              </p>
            <p class="operate-par">
              <a href="javascript:;" @click="showMan(row)">数据维护</a>
            </p>
            <p class="operate-par">
              <template>
                <a v-if="row.status == '1'"  href="javascript:;"  @click="showStopConfirm(row,2)">启用</a>
                <a v-else href="javascript:;" @click="showStopConfirm(row,1)">停用</a>
              </template>
            </p>
          </div>
        </template>
      </sn-table-column>
    </sn-table>
    <sn-pagination  ref="pageTurn" :total="dataTotal" :size="pageSize" @goto="goto" />
    <sn-confirm txt ref="stopConfirm" :flag="stopDisFlag"  @sure="stopDisplay()" @close="hidestopConfirm">
      确定要{{stopTip}}吗？
    </sn-confirm>
    <!-- 创建/编辑展示位 -->
     <sn-confirm :title="confirmTitle"   txt @sure="saveDisplayBtn" @close="cancelDisplayBtn" :flag="showFlag" confirmButtonText="保存">
        <sn-form  :rules="floorRules" label-width="100px" formWidth="500">
          <sn-form-item label="展示位名称" prop="resource">
            <sn-input v-model="displayTitle" placeholder="请输入名称" width="350" :maxlength="30"></sn-input>
          </sn-form-item>
          <div class="errTips" v-if="errTips">展示位名称不能为空</div>
          <sn-form-item label="备注">
            <div style="width: 350px">
              <sn-input v-model="displayRemark" placeholder="" width="350"  type="textarea" :rows="5" :maxlength="30" ></sn-input>
            </div>
          </sn-form-item>
          <div class="errTips" v-if="errContentTips">备注内容不可为空</div>
        </sn-form>
      </sn-confirm>
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
import DI from 'interface';
import * as Constant from 'js/constant';
export default {
  data() {
    return {
      showFlag:false,//展示位创建框标志
      errTips: false,//展示位创建框错误提示标志
      errContentTips: false,//展示位创建框错误提示标志
      displayRemark:'',//备注
      displayTitle: '', //展示位名称
      displayId: '', //展示位Id
      displayStatus:1,//是否停用状态  编辑默认为1
      confirmTitle:'',//创建、编辑框名称
      displayUrl:'',//创建、编辑接口
      displayData:{},//创建、编辑数据
      channelType: '', //频道类型
      displayList: [], //频道列表
      pageIndex: 1,//当前页码
      pageSize: 10,//每页数据条数
      dataTotal:0,//数据总数
      checkWordConfirm: false, //敏感词提示弹框
      sensitiveMsgList: [],
      loadingText:'',//提交提示
      stopDisFlag:false,//是否停用展示位标志
      searchIitle:'',//搜索-名称
      searchId:'',//搜索-id
      stopTip:''
    };
  },
  filters: {},
  methods: {
      //展示位创建文本框为空提示
    // displayError() {
    //  if (this.displayTitle == '') {
    //     this.errTips = true;
    //   } else {
    //     this.errTips = false;
    //   }
    //   if (this.displayRemark == '') {
    //     this.errContentTips = true;
    //   } else {
    //     this.errContentTips = false;
    //   }
    // },
    // 创建/编辑展示位 保存,
    saveDisplayBtn() {
       this.displayData ={
          remark: this.displayRemark,
          title: this.displayTitle,
          status: this.displayStatus,
          id: this.displayId
       }
      if (this.displayTitle == '') {
        this.errTips = true;
        return;
      } else {
        this.errTips = false;
      }
      if (this.displayRemark == '') {
        this.errContentTips = true;
        return;
      } else {
        this.errContentTips = false;
      }
      this.loadingText = '正在保存,请稍后';
      this.$ajax({
        url: this.displayUrl,
        data: JSON.stringify(this.displayData),
        context: this,
        loadingText: this.loadingText,
        success: res => {
          if (res.retCode == '0') {
            this.queryDisplayList(this.pageIndex);
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.log('error');
        }
      });
      this.cancelDisplayBtn();
    },
    cancelDisplayBtn() {
      this.showFlag = false;
      this.displayRemark = '';
      this.displayTitle = '';
      this.errTips = false;
      this.errContentTips = false;
      this.stopDisFlag = false;
      this.loadingText = '';
    },
    //创建展示位显示
    showAdd(){
      this.showFlag = true;
      this.confirmTitle = "创建展示位";
      this.loadingText = "正在提交,请稍后";
      this.displayStatus = 2;
      this.displayUrl = DI.display.displayAdd;
    },
      //编辑展示位显示
    showEdit(displayItem) {
        this.displayRemark = displayItem.remark;
        this.displayTitle = displayItem.title;
        this.displayId = displayItem.id;
        this.confirmTitle ="编辑展示位";
        this.showFlag = true;
        this.displayStatus = displayItem.status;
        this.displayUrl = DI.display.displayEdit;
        this.loadingText = "正在编辑,请稍后";
    },
    searchDisplay() {
      this.queryDisplayList(1);
      this.$refs.pageTurn.reset();
    },
    resetSearch() {
      this.searchId = '';
      this.searchIitle = '';
    },
    showMan(item) {
      this.$emit('input', item);
      //展示位管理显示(传当前展示位对象)
      this.$emit('change-view', 'contentList');
    },
    //获取展示位状态
    getDisplayStatus(val) {
      return Constant.DISPLAY_STATUS[val-1].status;
    },
    //分页
    goto(num) {
      this.pageIndex = num;
      this.queryDisplayList(this.pageIndex);
    },
    //查询展示位列表
    queryDisplayList(pageIndex) {
      let ajaxData = {
        id: this.searchId,
        title: this.searchIitle,
        pageNum: pageIndex ? (pageIndex - 1) * this.pageSize : 0,
        pageSize: this.pageSize,
      };
      this.$ajax({
        url: DI.display.displayList,
        data: JSON.stringify(ajaxData),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            this.displayList = resData.list || [];
            this.dataTotal = resData.totolCount || 0;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    //隐藏停用弹窗
    hidestopConfirm(){
       this.stopDisFlag = false;
       this.cancelDisplayBtn();
    },
    //展示停用弹窗
    showStopConfirm(displayItem,status){
      this.displayId = displayItem.id;
      this.stopDisFlag = true;
      this.displayStatus = status;
      this.displayRemark = displayItem.remark;
      this.displayTitle = displayItem.title;
      this.displayStatus==1?(this.stopTip = "停用"):(this.stopTip = "启用");
    },
    //停用展示位
    stopDisplay(){
       this.displayStatus==1?(this.loadingText = "正在停用,请稍后"):(this.loadingText = "正在启用,请稍后");
       this.displayUrl = DI.display.displayEdit;
       this.displayData ={
          remark: this.displayRemark,
          title: this.displayTitle,
          status: this.displayStatus,
          id: this.displayId
       }
       console.log(this.displayData)
       this.$ajax({
        url: this.displayUrl,
        data: JSON.stringify(this.displayData),
        context: this,
        loadingText: this.loadingText,
        success: res => {
          if (res.retCode == '0') {
            this.queryDisplayList(this.pageIndex);
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.log('error');
        }
      });
      this.cancelDisplayBtn();
    },
    exchange(flag, rowItem) {
      //频道上移下移
      this.$ajax({
        url: DI.channel.exchange,
        data: JSON.stringify({
          channelId: rowItem.channelId,
          channelName: this.channelName,
          channelType: this.channelType,
          movingState: flag,
          status: this.channelStatus
        }),
        context: this,
        success: res => {
          this.queryDisplayList(this.pageIndex);
          if (res.retCode == '0') {
            this.$message.success('移动成功！');
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          this.$message.error('移动失败！');
        }
      });
    },
    checkLimitWords() {
      let reg = /\[.*\]/g;
      this.$ajax({
        url: DI.common.checkLimitWords,
        data: JSON.stringify({
          content: this.markData.name,
          name: ''
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.markSetDi();
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
      this.markSetDi();
      this.checkWordConfirm = false;
    },
  },
  mounted() {
    this.queryDisplayList(1);
  }
};
</script>
<style scoped>
.container {
  .ibox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background: #fff;
    margin-bottom: 10px;
    .search-box {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      margin-bottom: 20px;
      .input-box {
        display: flex;
        margin-bottom: 20px;
        span.text {
          margin-right: 10px;
          line-height: 32px;
          font-size: 12px;
          color: #999999;
        }
      }
    }
    .search-btns {
      display: flex;
      flex-direction: column;
      button {
        & + button {
          margin-top: 20px;
        }
      }
      .reset-btn {
        margin-right: 15px;
      }
    }
  }
  .errTips {
  color: red;
  font-size: 12px;
  position: relative;
  top: -10px;
  left: -100px;
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
  .logo-img {
    width: 60px;
    height: 60px;
  }
  .operate-par,
  .info-par {
    padding: 3px 0;
    line-height: 17px;
  }
  .mark-popup {
    display: flex;
    width: 350px;
    label {
      line-height: 32px;
    }
    .input-box {
      margin-left: 12px;
    }
  }
  .disable-link {
    color: #ccc;
    &:hover {
      text-decoration: none;
      cursor: default;
    }
  }
  .align-end {
    text-align: right;
  }
  .add-btn{
      text-align: right;
      margin-top:20px;
      margin-right:14px;
  }
  .topBtn {
    border-radius: 15px;
    padding: 5px 8px;
    color: #fff;
    background: #ffa488;
  }
  .top-par {
    padding-bottom: 12px;
  }
  .label-info {
    line-height: 1.4;
  }
  .ml-30 {
    margin-left: 30px;
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
