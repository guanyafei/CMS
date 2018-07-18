<template>
  <div id="list">
    <sn-datatable :data="list" :border="true">
      <sn-datacolumn label="自定义" prop="checkbox" :width="50" :column-border="false">
        <sn-checkbox type="checkbox" v-model="checkAll" @change="handleCheckAllChange"></sn-checkbox>
      </sn-datacolumn>
      <sn-datacolumn label="基础信息" prop="title" :width="310" alignment="left">
      </sn-datacolumn>
      <sn-datacolumn label="视频类型" prop="vt" :width="70" :formatter="getvtItemName">
      </sn-datacolumn>
      <sn-datacolumn label="基础分类" prop="cataName" >
      </sn-datacolumn>
      <sn-datacolumn label="视频分类" prop="programType" >
      </sn-datacolumn>
      <sn-datacolumn label="标签" prop="labels" :width="100">
      </sn-datacolumn>
      <sn-datacolumn label="视频状态" prop="status"  :formatter="getVideoStatus">
      </sn-datacolumn>
      <sn-datacolumn label="发布时间" prop="publishTime" :width="70" :formatter="getPublishTime">
      </sn-datacolumn>
      <sn-datacolumn label="视频时长" prop="duration" :width="70" :formatter="getVideoTime">
      </sn-datacolumn>
      <sn-datacolumn label="清晰度" prop="definition" :width="70">
      </sn-datacolumn>
      <sn-datacolumn label="上架状态" prop="channels" :width="70">
      </sn-datacolumn>
      <sn-datacolumn label="操作" prop="opt" width="90">
      </sn-datacolumn>
      <template slot="checkbox" slot-scope="{row}">
        <sn-checkbox type="checkbox" :label="row.newsId" v-model="curSelecteds" :disabled="!row.newsId"></sn-checkbox>
      </template>
      <template slot-scope="{row}" slot="title">
        <td-info :row="row" @showPreview="handleDetailClick(row.id)"></td-info>
      </template>
      <template slot-scope="{row}" slot="labels">
        <td-label :data="row.labels"></td-label>
      </template>
      <template slot-scope="{row}" slot="channels">
        <td-channel :data="row.channels"></td-channel>
      </template>
      <template slot-scope="cell" slot="expireTime">
        <ul v-if="cell.value">
          <li class="pt-5">
            {{getSplitTimeList(cell.value)[0]}}
          </li>
          <li class="pt-5">
            {{getSplitTimeList(cell.value)[1]}}
            <span class="td-time__edit" @click="handleTimeEditClick(cell.row)"></span>
          </li>
        </ul>
      </template>
      <template slot-scope="{row}" slot="opt">
        <div class="btn-group">
          <button @click.stop="handleDetailClick(row.id)">查看</button>
          <div class="pt-2">
            <button @click.stop="handleEditClick(row)">编辑</button>
          </div>
        </div>
      </template>
    </sn-datatable>
    <template>
      <div class="pagination">
        <span @click="goto(0)">首页</span>
        <a href="javascript:;" @click="goto(-1)">＜</a>
        <a href="javascript:;" class="cur">{{pageIndex}}</a>
        <a href="javascript:;" @click="goto(1)">＞</a>
      </div>
    </template>
    <sn-confirm v-if="viewType=='star'||viewType=='batchStar'" title="设置星级" @close="close" @sure="confirmStarSetting" noflag>
      <div class="modal-body modal-sm">
        <sn-rate v-model="starVal"></sn-rate>
      </div>
    </sn-confirm>
    <sn-confirm v-if="viewType=='detailMore'" title="查看视频" @close="detailHide" closeIcon noflag>
      <div slot="btn-group"></div>
      <detail-confirm :channelId = "channelId"></detail-confirm>
    </sn-confirm>
    <!-- <sn-pagination :pageIndex.sync="pageInfo.pageIndex" :total="pageInfo.total" @goto="goto" :size="pageInfo.pageSize"></sn-pagination> -->
  </div>
</template>

<script>
import * as Constant from 'js/constant';
import DI from 'interface';
import TdInfo from './tdInfo';
import TdChannel from './tdChannel';
import TdLabel from './tdLabel';
import DetailConfirm from 'views/publish-management/video/library/detailConfirm';
import { formatDate } from 'utils/util';
const SELECT_MAPS = ['status', 'publishTimeEnd', 'publishTimeStart', 'title', 'id'];
export default {
  name: 'list',
  props: {
    selecteds: {
      type: Array
    },
    checkAll: Boolean,
    list: {
      type: Array
    },
    pageIndex: {
      type: Number
    },
    searchFilters: {
      type: Object
    }
  },
  components: {
    TdInfo,
    TdChannel,
    TdLabel,
    DetailConfirm
  },
  data() {
    return {
      viewType: '',
      starVal: 1,
      selectedItem: null,
      multiportSite: {},
      expireTime: null,
      channelId: ''
    };
  },
  computed: {
    curSelecteds: {
      get() {
        return this.selecteds;
      },
      set(value) {
        this.$emit('update:selecteds', value);
      }
    }
  },
  watch: {
    curSelecteds(value) {
      this.$emit('update:selecteds', value);
    },
    list(value) {
      console.log(value);
    }
  },
  mounted() {
    this.getReadyList();
  },
  methods: {
    getVideoTime(time) {
      var theTime = parseInt(time); // 秒
      var theTime1 = 0; // 分
      var theTime2 = 0; // 小时
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60);
          theTime1 = parseInt(theTime1 % 60);
        }
      }
      var result = '' + parseInt(theTime) + '秒';
      if (theTime1 > 0) {
        result = '' + parseInt(theTime1) + '分' + result;
      }
      if (theTime2 > 0) {
        result = '' + parseInt(theTime2) + '小时' + result;
      }
      return result;
    },
    goto(flag) {
      if (flag == 0 && this.pageIndex != 1) { // 首页
        this.pageIndex = 1;
        this.queryList();
      }
      if (flag == -1 && this.pageIndex != 1) { // 上一页
        this.pageIndex--;
        this.queryList();
      }
      if (flag == 1) {
        this.pageIndex++;
        this.queryList();
      }
    },
    queryList() {
      let pageSize = 20;
      let pageNum = this.pageIndex;

      let ajaxData = {
        pageNum,
        pageSize,
        ...this.searchFilters
      };
      for (let value of SELECT_MAPS) {
        if (ajaxData[value] === -1) {
          ajaxData[value] = '';
        }
      }
      ajaxData = this.$bus.deleteNullProperty(ajaxData);
      this.$ajax({
        url: DI.publish.getMediaList,
        data: JSON.stringify(ajaxData),
        loadingText: '正在查询当前资讯信息，请稍候！',
        context: this,
        success: res => {
          if (res.retCode == '0') {
            const data = res.data || [];
            this.list = data;
            // if (!data.length) {
            //   this.pageIndex--;
            // }
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    handleEditClick(row) {
      this.$router.push({
        path: '/edit',
        query: {
          id: row.id
        }
      });
    },
    handleCheckAllChange(event) {
      this.$emit('update:checkAll', event.target.checked);
    },
    getReadyList() {},
    getvtItemName(val) {
      let name = '';
      switch (val) {
        case 0:
          name = '直播';
          break;
        case 3:
          name = '点播';
          break;
        case 4:
          name = '二代直播';
          break;
        case 21:
          name = '剧集';
          break;
        case 22:
          name = '合集';
          break;
        default:
          break;
      }
      return name;
    },
    batchHandle(type) {
      this.viewType = type;
    },
    confirmStarSetting() {
      let ajaxData = {
        level: this.starVal
      };
      if (this.viewType === 'batchStar') {
        ajaxData.newsIds = this.curSelecteds;
        this.submitOperateData(ajaxData, '正在批量设置星级，请稍候');
      } else {
        ajaxData.newsIds = [this.selectedItem.newsId];
        this.submitOperateData(ajaxData, '正在设置星级，请稍候');
      }
    },
    submitOperateData(ajaxData, loadingText) {
      this.viewType = null;
      this.$ajax({
        url: DI.infoLibrary.statusAndLevel,
        context: this,
        loadingText: loadingText,
        data: JSON.stringify(ajaxData),
        success: res => {
          if (res.retCode == '0') {
            this.starVal = 1; // 重置星级为一级
            this.$bus.$emit('reload'); // 刷新当前页面
          } else {
            this.$message.warning('warning', res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    close() {
      (this.starVal = 1), (this.selectedItem = null);
      this.expireTime = '';
      this.viewType = null;
    },
    getzxStatusItemName(val) {
      let name = '';
      switch (val) {
        case 0:
          name = '待处理';
          break;
        case 1:
          name = '处理中';
          break;
        default:
          break;
      }
      return name;
    },
    getVideoStatus(val) {
      let name = '';
      switch (val) {
        case 0:
          name = '未处理';
          break;
        case 1:
          name = '上线';
          break;
        case 3:
          name = '下线';
          break;
        case 4:
          name = '已删除';
          break;
        default:
          break;
      }
      return name;
    },
    getPublishTime(time) {
      let publishTimeShow = '';
      publishTimeShow = formatDate(time, 'yyyy-MM-dd hh:mm:ss');
      return publishTimeShow;
    },
    handleDetailClick(id) {
      this.channelId = id;
      this.viewType = 'detailMore';
    },
    detailHide() {
      this.viewType = '';
    }
  }
};
</script>

<style scoped>
button {
  color: #0abbfe;
}

.pt-2 {
  padding-top: 2px;
}
.td-time__edit {
  width: 15px;
  height: 13px;
  display: inline-block;
  cursor: pointer;
}
.is-disabled {
  color: #a1a1a1;
  cursor: not-allowed;
}
.site-item {
  padding: 10px;
  button {
    font-size: 14px;
  }
  .ellipsis {
    line-height: 30px;
  }
}
.modal__label--expire {
  margin-right: 5px;
}
.modal-body {
  &.modal-sm {
    width: 360px;
  }
}
.pagination {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .cur {
    margin: 0 5px;
    cursor: auto;
    color: #0abbfe;
  }
  span,
  a {
    color: #666;
    display: block;
    padding: 8px 10px;
    border: 1px solid #ccc;
  }
  span {
    margin-right: 5px;
    cursor: pointer;
  }
}
</style>
