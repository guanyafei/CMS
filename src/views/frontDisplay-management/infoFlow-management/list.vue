
<template>
  <div class="container">
    <sn-topbar title="信息流管理"></sn-topbar>
    <sn-search-box :fields="searchFilters">
      <sn-search-item
        :children="[ {
        type: 'input',
        prop: 'infoFlowId',
        placeholder: '请输入id',
        label: '信息流ID',
        inputType: 'number',
        maxlength: 20
      },{
        type: 'input',
        prop: 'infoFlowName',
        label: '信息流标题',
        placeholder: '请输入标题',
        maxlength: 30
      }, {
        type: 'button',
        buttonType: 'primary',
        text: '查询',
        triggerEvent: searchInfoFlow,
        isRight: true
      }, {
        type: 'button',
        text: '重置',
        triggerEvent: resetFilterInputs,
        isRight: true
      }]">
      </sn-search-item>
      <sn-search-item
        :children="[{
        type: 'button',
        buttonType: 'outline',
        text: '新建信息流',
        triggerEvent: showAdd,
        isRight: true
      }]">
      </sn-search-item>
    </sn-search-box>
    <sn-table :data='infoFlowList' ref='table'>
      <sn-table-column label='信息流id' width="6%" prop='infoFlowId' align='center'></sn-table-column>
      <sn-table-column label='信息流标题' width="7.5%" prop='infoFlowName' align='center'></sn-table-column>
      <sn-table-column label='类型' width="7%" align="center" sloted>
        <template slot-scope="row">
          {{getInfoFlowType(row.infoFlowType)}}
        </template>
      </sn-table-column>
      <sn-table-column label='状态' width="8.3%" align="center" sloted>
        <template slot-scope="row">
          <div class="is-column">
            <!--<p class="info-par">{{row.xmbq}}</p>-->
            <!--<p class="info-par">{{row.ssbq}}</p>-->
            <p class="info-par">{{getInfoFlowStatus(row.status)}}</p>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label='内容来源' width="9.6%" align="center" sloted>
        <template slot-scope="row">
          <!--<div class="label-info" v-if="row.resource == '2'">-->
            <!--{{row.labelNames}}-->
          <!--</div>-->
          <!--<div v-else>-->
            <!--<p class="info-par">{{getInfoSource(row.resource)}}</p>-->
            <!--<p class="info-par">{{getAuthorType(row.authorType)}}</p>-->
          <!--</div>-->
          <p class="info-par">{{getInfoSource(row.resource)}}</p>
        </template>
      </sn-table-column>
      <sn-table-column label='上架方式' width="7.5%" align="center" sloted>
        <template slot-scope="row">
          <span>{{getSaleType(row.onSaleType)}}</span>
        </template>
      </sn-table-column>
      <sn-table-column label='待审核上架' width="8%" align="center" prop='waitShelvesNum' sloted>
        <template slot-scope="row">
          <a v-if="row.infoFlowFlag == '1'" href="javascript:;" class="disable-link">{{row.waitShelvesNum || 0}}</a>
          <a v-else href="javascript:;" @click="showReview(row)">{{row.waitShelvesNum || 0}}</a>
        </template>
      </sn-table-column>
      <sn-table-column label='已上架内容' width="8%" align="center" sloted>
        <template slot-scope="row">
          <a v-if="row.infoFlowFlag == '1'" href="javascript:;" class="disable-link">{{row.shelvesNum || 0}}</a>
          <a v-else href="javascript:;" @click="showContent(row)">{{row.shelvesNum || 0}}</a>
        </template>
      </sn-table-column>
      <sn-table-column label='操作' width="8.8%" align="center" sloted>
        <template slot-scope="row">
          <div class="is-column">
            <p class="operate-par">
              <a v-if="row.status == '1' " href="javascript:;" @click="showOnOff(row)">下线</a>
              <a v-else href="javascript:;" @click="showOnOff(row)">上线</a>
            </p>
            <p class="operate-par">
              <template>
                <a v-if="row.status == '1'" class="disable-link" href="javascript:;">删除</a>
                <a v-else href="javascript:;" @click="showDelConfirm(row.infoFlowId)">删除</a>
              </template>

              <a href="javascript:;" @click="showEdit(row)">编辑</a>
            </p>
            <p class="operate-par">
              <a v-if="row.onSaleType == '2'" href="javascript:;" @click="showFree(row)">免审设定</a>
              <a v-else href="javascript:;" class="disable-link">免审设定</a>
            </p>
          </div>
        </template>
      </sn-table-column>
    </sn-table>
    <sn-pagination ref="pageTurn" :total="dataTotal" :size="pageSize" @goto="goto" />
    <sn-confirm txt ref="delConfirm" :flag="delConFlag" @sure="delInfoFlow(delInfoFlowId)" @close="hideDelConfirm">
      确定要删除吗？
    </sn-confirm>
    <sn-confirm txt ref="shelveConfirm" :flag="onOffFlag" @sure="setOnOff(onOffInfoFlow)" @close="hideOnOff">
      确定要{{onOffStr}}吗？
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
        infoFlowList: [], //频道列表
        pageIndex: 1, //默认是1
        pageSize: 20, //默认是20
        dataTotal: 0, //查询出来的数据条数
        checkWordConfirm: false, //敏感词提示弹框
        delConFlag: false, //删除弹框显示开关
        delInfoFlowId: '', //删除频道Id
        onOffFlag: false, //上下架弹框显示开关
        onOffInfoFlow: '', //上下架频道对象
        onOffStr: '', //确认上下架框中上下架字符
        sensitiveMsgList: [],

        searchFilters: {
          ...this.getDefaultFilterInputs()
        }
      };
    },
    filters: {},
    methods: {
      /**
       * 获取筛选栏默认值
       * @returns {{title: string, id: string}}
       */
      getDefaultFilterInputs() {
        return {
          // infoFlowName: '',
          // infoFlowId: '',
          infoFlowId: '',
          infoFlowName: '',
        };
      },
      /**
       * 重置筛选栏
       */
      resetFilterInputs() {
        this.searchFilters = {
          ...this.getDefaultFilterInputs()
        };
        this.searchInfoFlow()
      },
      getSaleType(val) {
        //获取资讯上下架方式
        return Constant.getItemByValue(Constant.SALE_TYPE, val).name;
      },
      getInfoSource(val) {
        //获取资讯来源
        return Constant.getItemByValue(Constant.COMMON_INFOFLOW_SOURCE, val).name;
      },
      getInfoFlowStatus(val) {
        //获取频道上下架状态
        return Constant.getItemByValue(Constant.INFOFLOW_STATUS, val).name;
      },
      getInfoFlowType(val) {
        //获取频道类型
        return Constant.getItemByValue(Constant.INFOFLOW_TYPE, val).name;
      },
      getAuthorType(val) {
        //获取作者类型
        return Constant.getItemByValue(Constant.AUTHOR_TYPE, val).name;
      },
      /**
       * 筛选栏查询按钮
       */
      searchInfoFlow() {
        this.pageIndex = 1;
        this.queryFlowList(1);
        this.$refs.pageTurn.reset();
      },
      /**
       * 表格页面跳转
       * @param num
       */
      goto(num) {
        this.pageIndex = num;
        this.queryFlowList(num);
      },
      /**
       * 根据筛选栏获取列表内容
       * @param pageIndex
       */
      queryFlowList(pageIndex) {
        let ajaxData = {
          pageIndex: (pageIndex - 1) * this.pageSize,
          pageSize: this.pageSize,
          ...this.searchFilters
        };
        this.$ajax({
          url: DI.infoFlow.queryList,
          data: JSON.stringify(ajaxData),
          context: this,
          success: res => {
            if (res.retCode == '0') {
              let resData = res.data || {};
              this.infoFlowList = resData.infoFlowList || [];
              this.dataTotal = resData.infoFlowNum || 0;
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.error('error');
          }
        });
      },
      /**
       * 页面跳转
       * @param viewType
       */
      changeView(viewType) {
        this.$emit('change-view', viewType);
      },
      /**
       * 内容管理页面
       * @param infoFlowId
       */
      showContent(infoFlow) {
        this.$emit('input', infoFlow);
        this.$emit('change-view', 'contentList');
      },
      /**
       * 待审核页面
       * @param infoFlow
       */
      showReview(infoFlow) {
        this.$emit('input', infoFlow);
        this.$emit('change-view', 'review');
      },
      /**
       * 免省设定页面
       * @param infoFlowId
       */
      showFree(infoFlowId) {
        this.$emit('input', infoFlowId);
        this.changeView('exreview');
      },
      /**
       * 新建窗口
       */
      showAdd() {
        this.$emit('change-view', 'add');
      },
      /**
       * 编辑页面
       * @param infoFlowItem
       */
      showEdit(infoFlowItem) {
        this.queryInfoFlowDetail(infoFlowItem);
        // this.$emit('input', infoFlowItem);
        // this.$emit('change-view', 'edit');
      },
      /**
       * 显示删除确认框
       * @param infoFlowId
       */
      showDelConfirm(infoFlowId) {
        this.delConFlag = true;
        this.delInfoFlowId = infoFlowId;
      },
      /**
       * 关闭删除确认框
       */
      hideDelConfirm() {
        this.delConFlag = false;
      },
      /**
       * 删除信息流
       * @param infoFlowId
       */
      delInfoFlow(infoFlowId) {
        this.delConFlag = false;
        this.$ajax({
          url: DI.infoFlow.del,
          data: JSON.stringify({
            delFlag: 1,
            infoFlowId: infoFlowId, //删除频道Id
          }),
          context: this,
          success: res => {
            if (res.retCode == '0') {
              this.$message.success('删除成功！');
              this.queryFlowList(this.pageIndex);
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.error('error');
          }
        });
      },
      /**
       * 展示信息流上/下线弹窗
       * @param infoFlowItem
       */
      showOnOff(infoFlowItem) {
        this.onOffFlag = true;
        this.onOffInfoFlow = infoFlowItem;
        if (this.onOffInfoFlow.status == '0') {
          this.onOffStr = '上线';
        } else {
          this.onOffStr = '下线';
        }
      },
      /**
       * 信息流上/下线弹窗确认
       * @param infoFlowItem
       */
      setOnOff(infoFlowItem) {
        //设置上下架
        let id = infoFlowItem.infoFlowId,
          status = infoFlowItem.status;
        status = status == 1 ? 0 : 1;
        this.$ajax({
          url: DI.infoFlow.setOnOff,
          data: JSON.stringify({
            infoFlowId: id, //频道Id
            status: status //设置上下架状态
          }),
          context: this,
          success: res => {
            if (res.retCode == '0') {
              this.$message.success(this.onOffStr + '成功！');
              this.queryFlowList(this.pageIndex);
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            this.$message.error(this.onOffStr + '失败！');
          }
        });
        this.onOffFlag = false;
      },
      /**
       * 信息流弹窗关闭
       */
      hideOnOff() {
        this.onOffFlag = false;
      },

      /**
       * 获取单条信息流详情
       * @param infoFlowItem
       */
      queryInfoFlowDetail(infoFlowItem) {
        let id = infoFlowItem.infoFlowId;
        this.$ajax({
          url: DI.infoFlow.queryInfoFlowDetail,
          data: JSON.stringify({
            infoFlowId: id //频道Id
          }),
          context: this,
          success: res => {
            if (res.retCode == '0') {
              // this.$message.success(this.onOffStr + '成功！');
              this.$emit('input', res.data);
              this.$emit('change-view', 'edit');
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            this.$message.error('获取信息流详情失败！');
          }
        });
      },

      /**
       * 敏感词校验
       */
      // checkLimitWords() {
      //   let reg = /\[.*\]/g;
      //   this.$ajax({
      //     url: DI.common.checkLimitWords,
      //     data: JSON.stringify({
      //       content: this.markData.name,
      //       name: ''
      //     }),
      //     context: this,
      //     success: res => {
      //       if (res.retCode == '0') {
      //       } else {
      //         let sensitiveMsg = reg.exec(res.retMsg)[0];
      //         this.sensitiveMsgList = JSON.parse(sensitiveMsg);
      //         this.checkWordConfirm = true;
      //       }
      //     },
      //     error: () => {
      //       console.error('error');
      //     }
      //   });
      // },
      close() {
        this.checkWordConfirm = false;
      },
      sure() {
        this.checkWordConfirm = false;
      },
    },
    mounted() {
      this.queryFlowList(1);
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
  }
  .select-box {
    display: flex;
    align-items: center;
  .text {
    margin-right: 10px;
  }
  .sed-text {
    margin: 0 10px 0 30px;
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
