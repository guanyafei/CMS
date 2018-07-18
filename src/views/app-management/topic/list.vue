<template>
  <div class="container">
    <sn-topbar title="专题管理" />
    <div class="ibox">
      <div class="search-box">
        <div class="input-box">
          <sn-input placeholder="请输入页面标题" width="178" radius="16" :maxlength="30" v-model="channelName"></sn-input>
        </div>
        <div class="select-box">
          <span class="text">上架状态</span>
          <sn-select v-model="channelStatus" placeholder="全部" radius="16" width="120" @change="handleChannelStatus">
            <sn-option v-for="item in selectList" :key="item.id" :name="item.name" :value="item.id"></sn-option>
          </sn-select>
        </div>
      </div>
      <div class="search-btns">
        <p>
          <sn-button class="query" type="primary" @click="queryTopicList(0)">查询</sn-button>
        </p>
        <p>
          <sn-button type="default" @click="reset">重置</sn-button>
          <sn-button class="add" type="outline" @click="changeView('add')">添加专题</sn-button>
        </p>
      </div>
    </div>
    <sn-table :data='list' ref='table'>
      <sn-table-column label='专题基本信息' prop='info' width='34%' align='left' sloted>
       <template slot-scope="row">
        <div class="adv-info">
          <div class="img-wrap">
            <img alt="" class="adv-img" :src="row.channelLogo" />
            <p class="id-info">ID：{{row.channelId}}</p>
          </div>
          <span class="adv-title">
            <p>{{row.channelName}}</p>
            <p class="adv-des" :title="row.channelDes">{{row.channelDes}}</p>
          </span>
        </div>
      </template>
      </sn-table-column>
        <sn-table-column label='内容来源' prop='resource' width='11%' sloted>
          <template slot-scope="row">
            {{handleResource(row.resource)}}<br>{{getTags(row.labelNames,row.authorType,row.resource)}}
          </template>
        </sn-table-column>
        <sn-table-column label='上架方式' prop='onSaleType' width='11%' sloted>
          <template slot-scope="row">
            {{handleSaleType(row)}}
          </template>
        </sn-table-column>
        <sn-table-column label='待上架内容' prop='waitShelvesNum' width='11%' sloted>
          <template slot-scope="row">
            <a href="javascript:;" @click="showReview(row.channelId)">{{row.waitShelvesNum}}</a>
          </template>
        </sn-table-column>
        <sn-table-column label='已上架内容' prop='shelvesNum' width='11%' sloted>
          <template slot-scope="row">
            <a href="javascript:;" @click="showContent(row)">{{row.shelvesNum}}</a>
          </template>
        </sn-table-column>
        <sn-table-column label='状态' prop='status' width='11%' sloted>
          <template slot-scope="row">
            {{handleStatus(row.status)}}
          </template>
        </sn-table-column>
        <sn-table-column label='操作' width='11%' sloted>
          <template slot-scope="row">
            <div class="is-column">
              <a v-if="row.status == '1'" href="javascript:;" @click="showOnOff(row)">下架</a>
              <a v-else href="javascript:;" @click="showOnOff(row)">上架</a><br>
              <a v-if="row.status == 1" class="disable-link delete-btn" href="javascript:;">删除</a>
              <a class="delete-btn" v-else href="javascript:;" @click="showDelConfirm(row.channelId)">删除</a><br>
              <a href="javascript:;" @click="edit(row.channelId)">编辑</a><br>
              <a href="javascript:;" @click="changeView('display',row)">展示设置</a><br>
              <a v-if="row.onSaleType =='2'" href="javascript:;" @click="showFree(row.channelId)">设定免审名单</a>
            </div>
          </template>
        </sn-table-column>
    </sn-table>
    <sn-pagination :total="dataTotal" :size="pageSize" @goto="goto" />
    <sn-confirm txt ref="shelveConfirm" :flag="onOffFlag" @sure="setOnOff(onOffChannel)" @close="hideOnOff">
                      确定要{{onOffStr}}吗？
    </sn-confirm>
    <sn-confirm txt ref="delConfirm" :flag="delConFlag" @sure="delChannel(delChannelId)" @close="hideDelConfirm">
                      确定要删除吗？
    </sn-confirm>
  </div>
</template>
<script>
import DI from 'interface'
import * as Constant from 'js/constant'
export default {
  data() {
    return {
      pageIndex: 0, //默认是0
      pageSize: 20, //默认是20
      dataTotal: 2, //查询出来的数据条数
      channelStatus: '',
      channelName: '',
      selectList: [{
        name: '全部',
        id: ''
      }, {
        name: '上架',
        id: '1'
      }, {
        name: '下架',
        id: '0'
      }],
      list: [],
      delConFlag: false, //删除弹框显示开关
      delChannelId: '', //删除频道Id
      onOffFlag: false, //上下架弹框显示开关
      onOffChannel: '', //上下架频道对象
      onOffStr: '' //确认上下架框中上下架字符
    }
  },
  mounted() {
    this.queryTopicList(0);
  },
  methods: {
    reset() {
      this.channelName = '';
    },
    handleChannelStatus(val) {
      this.channelStatus = val;
      this.queryTopicList(this.pageIndex);
    },
    handleStatus(status) {
      if(status == '1') {
        return '上架';
      } else if(status == '0') {
        return '下架';
      }
    },
    handleResource(resource) {
      if(resource == '1') {
        return '报名';
      } else if(resource == '2') {
        return '标签匹配';
      } else if(resource == '3') {
        return '手工维护';
      }
    },
    getTags(labels,authorType,resource) {
      let author = '';
      if(authorType == '1' && resource == '1') {
        author = '内部作者';
      } else if(authorType == '0' && resource == '1') {
        author = '全部';
      }
      return (labels == null ? '' : labels) + author;
    },
    handleSaleType(row) {
      if(row.onSaleType == '1') {
        return '自动上架';
      } else if (row.onSaleType == '2') {
        return '审核上架';
      } else if (row.resource == '3') {
        return '手工维护';
      } else {
        return '';
      }
    },
    changeView(type,channel) {
      this.$emit('input', channel);
      this.$emit('change-view', type);
    },
    goto(num) {
      this.pageIndex = num;
      this.queryTopicList(num);
      window.scrollTo(0, 0);
    },
    showContent(channel) {
      channel.isFrom = 'topic';//专题
      channel.status = channel.status;//上下架状态
      this.$emit('input', channel);
      this.$emit('change-view', 'contentList');
    },
    showReview(channelId) {
      this.$emit('input', channelId);
      this.$emit('change-view', 'review')
    },
    showOnOff(channelItem) { //显示上下架确认框
      this.onOffFlag = true;
      this.onOffChannel = channelItem;
      if(this.onOffChannel.status == '1') {
        this.onOffStr = '下架';
      } else {
        this.onOffStr = '上架';
      }
    },
    setOnOff(channelItem) { //设置上下架
      let id = channelItem.channelId;
      let status = channelItem.status;
      status = status == '1' ? '0' : '1';
      this.$ajax({
        url: DI.topic.upOrdownShelvesSpecial,
        data: JSON.stringify({
          "channelId": id, //频道Id
          "status": parseInt(status) //设置上下架状态
        }),
        context: this,
        success: (res) => {
          if(res.retCode == '0') {
            this.$message.success(this.onOffStr + '成功');
            setTimeout(() => {
              this.queryTopicList(this.pageIndex);
            }, 1300);
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
    showDelConfirm(channelId) { //显示删除确认框
      this.delConFlag = true;
      this.delChannelId = channelId;
    },
    hideDelConfirm() {
      this.delConFlag = false;
    },
    delChannel(channelId) {
      this.delConFlag = false;
      this.$ajax({
        url: DI.topic.deleteSpecial,
        data: JSON.stringify({
          "channelId": channelId, //删除频道Id
        }),
        context: this,
        success: (res) => {
          if(res.retCode == '0') {
            this.$message.success('删除成功');
            setTimeout(() => {
              this.queryTopicList(this.pageIndex);
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
    edit(channelId) {
      this.$emit('input', channelId);
      this.$emit('change-view', 'add');
    },
    showFree(channelId) { //免审名单显示
      this.$emit('input', channelId);
      this.$emit('change-view', 'exreview');
    },
    queryTopicList(pageNum) {
      if(pageNum == 0) {
        this.$bus.$emit('syncCurPage', 1);
      }
      this.$ajax({
        url: DI.topic.querySpecial,
        data: JSON.stringify({
          "channelName": this.channelName,
          "pageIndex": pageNum ? (pageNum - 1) * this.pageSize : 0,
          "pageSize": this.pageSize,
          "status": parseInt(this.channelStatus)
        }),
        context: this,
        success: (res) => {
          if(res.retCode == '0') {
            let list = res.data.specialList || [];
            this.list = list;
            this.dataTotal = res.data.specialNum || 0;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    }
  }
}
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
        &+button {
          margin-top: 20px;
        }
      }
      p:first-child {
        text-align: right;
      }
      .add {
        margin-left: 20px;
      }
    }
  }
  a {
    color: #1684C2;
    &+a {
      margin-left: 0;
    }
    &:hover {
      text-decoration: underline;
    }
  }
  .delete-btn {
    margin-top: 0;
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
        width: 179px;
        height: 100px;
      }
    }
    .adv-title {
      padding-left: 8px;
      color: #333333;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      .adv-des {
        /*height: 66px;*/
        overflow: hidden;
        text-overflow: ellipsis;
        display: box;
        display: -webkit-box;
        box-orient: vertical;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        line-clamp: 3;
        -webkit-line-clamp: 3;
        letter-spacing: 3px;
        line-height: 1.8;
        font-size: 12px;
        color: #999999;
      }
    }
  }
  .disable-link{
    color:#ccc;
    &:hover{
      text-decoration:none;
      cursor:default;
    }
  }
}
</style>
