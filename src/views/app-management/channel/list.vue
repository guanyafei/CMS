
<template>
  <div class="container">
    <sn-topbar title="资讯频道管理"></sn-topbar>
    <div class="ibox">
      <div class="search-box">
        <div class="input-box">
          <sn-input placeholder="请输入频道ID" v-model="channelId" width="178" radius="16" :maxlength="20" inputType="number" />
          <sn-input placeholder="请输入频道名称" width="178" v-model="channelName" radius="16" :maxlength="10" class="ml-30" />
        </div>
        <div class="select-box">
          <span class="text">频道类型</span>
          <sn-select v-model="channelType" placeholder="全部" radius="16" width="120" @change="handleChannelType">
            <sn-option name="全部" :value="''">全部</sn-option>
            <sn-option v-for="item in channelTypeList" :key="item.id" :name="item.name" :value="item.value" :disabled="item.disabled">
            </sn-option>
          </sn-select>
          <span class="sed-text">频道状态</span>
          <sn-select v-model="channelStatus" placeholder="全部" radius="16" width="120" @change="handleChannelStatus">
            <sn-option name="全部" :value="''">全部</sn-option>
            <sn-option v-for="item in channelStatusList" :key="item.id" :name="item.name" :value="item.value" :disabled="item.disabled">
            </sn-option>
          </sn-select>
        </div>
      </div>
      <div class="search-btns">
        <p class="align-end">
          <sn-button type="primary" @click="searchChannel">查询</sn-button>
        </p>
        <p>
          <sn-button type="default" class="reset-btn" @click="resetSearch">重置</sn-button>
          <sn-button type="outline" @click="changeView('add')">创建频道</sn-button>
        </p>
      </div>
    </div>
    <sn-table :data='channelList' ref='table'>
      <sn-table-column label='顺序' width="7.5%" sloted>
        <template slot-scope='row'>
          <div class="is-column">
            <p class="top-par" v-if="row.topFlag == '1' && row.channelType == '2'"><label class="topBtn">{{(pageIndex-1)*pageSize+row.$index+1}} 置顶</label></p>
            <p class="operate-par" v-else>{{(pageIndex-1)*pageSize+row.$index+1}}</p>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label='频道ID' width="6%" prop='channelId' align='center'></sn-table-column>
      <sn-table-column label='频道名称' width="7.5%" prop='channelName' align='center'></sn-table-column>
      <sn-table-column label='角标展示' width="7%" prop='mark' align='center'></sn-table-column>
      <sn-table-column label='频道logo' width="7.5%" align="center" sloted>
        <template slot-scope="row">
          <img v-if="row.channelLogo" class="logo-img" alt="" :src="row.channelLogo" />
        </template>
      </sn-table-column>
      <sn-table-column label='频道类型' width="7%" align="center" sloted>
        <template slot-scope="row">
          {{getChannelType(row.channelType)}}
        </template>
      </sn-table-column>
      <sn-table-column label='频道标签' width="8.3%" align="center" sloted>
        <template slot-scope="row">
          <div class="is-column">
            <p class="info-par">{{row.xmbq}}</p>
            <p class="info-par">{{row.ssbq}}</p>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label='资讯来源' width="9.6%" align="center" sloted>
        <template slot-scope="row">
          <div class="label-info" v-if="row.resource == '2'">
            {{row.labelNames}}
          </div>
          <div v-else>
            <p class="info-par">{{getInfoSource(row.resource)}}</p>
            <p class="info-par">{{getAuthorType(row.authorType)}}</p>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label='上架方式' width="7.5%" align="center" sloted>
        <template slot-scope="row">
          <span>{{getSaleType(row.onSaleType)}}</span>
        </template>
      </sn-table-column>
      <sn-table-column label='待上架内容' width="8%" align="center" prop='waitShelvesNum' sloted>
        <template slot-scope="row">
          <a v-if="row.channelFlag == '1'" href="javascript:;" class="disable-link">{{row.waitShelvesNum}}</a>
          <a v-else href="javascript:;" @click="showReview(row.channelId)">{{row.waitShelvesNum}}</a>
        </template>
      </sn-table-column>
      <sn-table-column label='已上架内容' width="8%" align="center" sloted>
        <template slot-scope="row">
          <a v-if="row.channelFlag == '1'" href="javascript:;" class="disable-link">{{row.shelvesNum}}</a>
          <a v-else href="javascript:;" @click="showContent(row)">{{row.shelvesNum}}</a>
        </template>
      </sn-table-column>
      <sn-table-column label='频道状态' sloted>
        <template slot-scope="row">
          <span>{{getChannelStatus(row.status)}}</span>
        </template>
      </sn-table-column>
      <sn-table-column label='操作' width="8.8%" align="center" sloted>
        <template slot-scope="row">
          <div class="is-column">
            <p class="operate-par">
              <a v-if="row.status == '1' " href="javascript:;" @click="showOnOff(row)">下架</a>
              <a v-else href="javascript:;" @click="showOnOff(row)">上架</a>
            </p>
            <p class="operate-par">
              <template>
                <a v-if="row.status == '1'" class="disable-link" href="javascript:;">删除</a>
                <a v-else href="javascript:;" @click="showDelConfirm(row.channelId)">删除</a>
              </template>

              <a href="javascript:;" @click="showEdit(row)">编辑</a>
            </p>
            <template v-if="row.channelType == '2'" class="operate-par">
              <p v-if="row.topFlag == '0' || row.topFlag == null" class="operate-par">
                <a href="javascript:;" @click="showSetTopConfirm(row)">置顶</a>
              </p>
              <p v-else class="operate-par">
                <a href="javascript:;" @click="showSetTopConfirm(row)">取消置顶</a>
              </p>
            </template>
            <p class="operate-par">
              <a v-if="row.$index > 0 || pageIndex > 1" href="javascript:;" @click="exchange(1,row)">上移</a>
              <a v-if="(dataTotal-1) > ((pageIndex-1)*pageSize+row.$index)" href="javascript:;" @click="exchange(2,row)">下移</a>
            </p>
            <p class="operate-par">
              <a href="javascript:;" @click="showSetMark(row.channelId)">角标设置</a>
            </p>
            <p class="operate-par">
              <a v-if="row.freeFlag == '1'" href="javascript:;" @click="showFree(row.channelId)">免审设定</a>
            </p>
            <p class="operate-par">
              <a href="javascript:;" @click="showMan(row)">展示管理</a>
            </p>
          </div>
        </template>
      </sn-table-column>
    </sn-table>
    <sn-pagination ref="pageTurn" :total="dataTotal" :size="pageSize" @goto="goto" />
    <sn-confirm txt ref="delConfirm" :flag="delConFlag" @sure="delChannel(delChannelId)" @close="hideDelConfirm">
      确定要删除吗？
    </sn-confirm>
    <sn-confirm txt ref="setTopConfirm" :flag="setTopFlag" @sure="setStickyTop(setTopChannel)" @close="hideSetTopConfirm">
      确定{{setTopStr}}吗？
    </sn-confirm>
    <sn-confirm txt ref="shelveConfirm" :flag="onOffFlag" @sure="setOnOff(onOffChannel)" @close="hideOnOff">
      确定要{{onOffStr}}吗？
    </sn-confirm>
    <sn-confirm txt title="角标设置" ref="" :flag="setMarkFlag" @sure="setMark()" @close="hideSetMark">
      <div class="mark-popup">
        <sn-form :model="markData" ref="markForm" :rules="markRule" label-width="120px">
          <sn-form-item label="角标展示" prop="name" ref="nameItem">
            <sn-input placeholder="请输入角标名" v-model="markData.name" width="220" maxlength="4"></sn-input>
          </sn-form-item>
        </sn-form>
      </div>
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
      channelList: [], //频道列表
      pageIndex: 1, //默认是1
      pageSize: 20, //默认是20
      dataTotal: 0, //查询出来的数据条数
      channelId: '', //频道Id
      channelName: '', //频道名称
      channelType: '', //频道类型
      channelTypeList: Constant.CHANNELS_TYPE, //频道类型列表
      channelStatus: '', //频道状态
      channelStatusList: Constant.CHANNEL_STATUS, //频道状态列表
      checkWordConfirm: false, //敏感词提示弹框
      delConFlag: false, //删除弹框显示开关
      delChannelId: '', //删除频道Id
      onOffFlag: false, //上下架弹框显示开关
      onOffChannel: '', //上下架频道对象
      onOffStr: '', //确认上下架框中上下架字符
      setMarkFlag: false, //角标设置弹框开关
      setTopChannel: '', //置顶&取消置顶数据项
      setTopFlag: false, //置顶弹框开关
      setTopStr: '', //置顶确认字符
      markData: {
        //角标设定数据
        channelId: '',
        name: '' //角标名
      },
      markRule: {
        //角标设定验证规则
        name: [
          {
            min: 2,
            max: 4,
            message: '长度在 2 到 4 个字符',
            trigger: 'change'
          }
        ]
      },
      sensitiveMsgList: []
    };
  },
  filters: {},
  methods: {
    getSaleType(val) {
      //获取资讯上下架方式
      return Constant.getItemByValue(Constant.SALE_TYPE, val).name;
    },
    getInfoSource(val) {
      //获取资讯来源
      return Constant.getItemByValue(Constant.INFO_SOURCE, val).name;
    },
    getChannelStatus(val) {
      //获取频道上下架状态
      return Constant.getItemByValue(Constant.CHANNEL_STATUS, val).name;
    },
    getChannelType(val) {
      //获取频道类型
      return Constant.getItemByValue(Constant.CHANNELS_TYPE, val).name;
    },
    getAuthorType(val) {
      //获取作者类型
      return Constant.getItemByValue(Constant.AUTHOR_TYPE, val).name;
    },
    handleChannelType(val) {
      this.channelType = val;
      this.searchChannel();
    },
    handleChannelStatus(val) {
      this.channelStatus = val;
      this.searchChannel();
    },
    goto(num) {
      this.pageIndex = num;
      this.queryChannelList(num);
    },
    searchChannel() {
      this.pageIndex = 1;
      this.queryChannelList(1);
      this.$refs.pageTurn.reset();
    },
    queryChannelList(pageIndex) {
      //查询频道列表
      let ajaxData = {
        channelId: this.channelId,
        channelName: this.channelName,
        channelType: this.channelType,
        pageIndex: (pageIndex - 1) * this.pageSize,
        pageSize: this.pageSize,
        status: this.channelStatus
      };
      this.$ajax({
        url: DI.channel.queryList,
        data: JSON.stringify(ajaxData),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            this.channelList = resData.channelList || [];
            this.dataTotal = resData.channelNum || 0;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    resetSearch() {
      this.channelId = '';
      this.channelName = '';
    },
    changeView(viewType) {
      this.$emit('change-view', viewType);
    },
    showContent(channel) {
      this.$emit('input', channel);
      this.$emit('change-view', 'contentList');
    },
    showReview(channelId) {
      this.$emit('input', channelId);
      this.$emit('change-view', 'review');
    },
    showMan(item) {
      //展示管理显示(传当前频道对象)
      this.$emit('input', item);
      let channelFlag = item.channelFlag;
      if (channelFlag == '1') {
        //视频频道
        this.changeView('vdisplay');
        return false;
      }
      if (channelFlag == '2') {
        //推荐频道
        this.changeView('rdisplay');
        return false;
      }
      if (channelFlag == '3') {
        //定制频道
        this.changeView('rdisplay');
        return false;
      }
    },
    showFree(channelId) {
      //免审名单显示
      this.$emit('input', channelId);
      this.changeView('exreview');
    },
    showEdit(channelItem) {
      //编辑频道显示
      this.$emit('input', channelItem);
      this.$nextTick(() => {
        this.changeView('edit');
      });
    },
    showDelConfirm(channelId) {
      //显示删除确认框
      this.delConFlag = true;
      this.delChannelId = channelId;
    },
    hideDelConfirm() {
      this.delConFlag = false;
    },
    showSetTopConfirm(item) {
      //显示置顶确认框
      if (item.topFlag == '1') {
        this.setTopStr = '取消置顶';
      } else {
        this.setTopStr = '置顶';
      }
      this.setTopFlag = true;
      this.setTopChannel = item;
    },
    hideSetTopConfirm() {
      //隐藏置顶确认框
      this.setTopFlag = false;
    },
    delChannel(channelId) {
      //删除频道
      this.delConFlag = false;
      this.$ajax({
        url: DI.channel.del,
        data: JSON.stringify({
          channelId: channelId //删除频道Id
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('删除成功！');
            this.queryChannelList(this.pageIndex);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    setStickyTop(channel) {
      //固定频道置顶
      let channelId = channel.channelId,
        channelType = channel.channelType,
        topFlag = channel.topFlag,
        isTop = '';
      this.hideSetTopConfirm();
      if (topFlag == '0') {
        //置顶
        isTop = 1;
      } else {
        //不置顶
        isTop = 0;
      }
      this.$ajax({
        url: DI.channel.setTop,
        data: JSON.stringify({
          channelId: channelId, //置顶频道Id
          channelType: channelType,
          isTop: isTop //置顶标记值
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('置顶成功！');
            this.queryChannelList(this.pageIndex);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    showOnOff(channelItem) {
      //显示上下架确认框
      this.onOffFlag = true;
      this.onOffChannel = channelItem;
      if (this.onOffChannel.status == '1') {
        this.onOffStr = '下架';
      } else {
        this.onOffStr = '上架';
      }
    },
    setOnOff(channelItem) {
      //设置上下架
      let id = channelItem.channelId,
        status = channelItem.status;
      status = status == '1' ? '0' : '1';
      this.$ajax({
        url: DI.channel.setOnOff,
        data: JSON.stringify({
          channelId: id, //频道Id
          status: status //设置上下架状态
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success(this.onOffStr + '成功！');
            this.queryChannelList(this.pageIndex);
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
    hideOnOff() {
      this.onOffFlag = false;
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
          this.queryChannelList(this.pageIndex);
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
    showSetMark(channelId) {
      //显示角标设置弹框
      this.setMarkFlag = true;
      this.markData.channelId = channelId;
    },
    setMark() {
      //角标设定
      this.$refs.markForm.validate(valid => {
        if (valid) {
          this.checkLimitWords();
        } else {
          return false;
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
    markSetDi() {
      let formData = this.markData;
      this.$ajax({
        url: DI.channel.markSet,
        data: JSON.stringify({
          channelId: formData.channelId,
          mark: formData.name //角标名
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('设置成功！');
            this.queryChannelList(this.pageIndex);
            this.hideSetMark();
          } else {
            this.$message.error(res.retMsg);
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
    hideSetMark() {
      //隐藏角标弹出框
      this.setMarkFlag = false;
      this.markData.name = '';
      this.$refs.nameItem.validateState = 'success';
      this.$refs.nameItem.validateMessage = '';
    }
  },
  mounted() {
    this.queryChannelList(1);
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
