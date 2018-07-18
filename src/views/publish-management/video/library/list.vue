<template>
  <div id="list">
    <sn-datatable :data="list" :border="true">
      <sn-datacolumn label="自定义" prop="checkbox" :width="50" :column-border="false">
        <sn-checkbox type="checkbox" v-model="checkAll" @change="handleCheckAllChange"></sn-checkbox>
      </sn-datacolumn>
      <sn-datacolumn label="基础信息" prop="title" :width="310" alignment="left">
      </sn-datacolumn>
      <sn-datacolumn label="视频类型" prop="vt"  :formatter="getvtItemName">
      </sn-datacolumn>
      <sn-datacolumn label="基础分类" prop="cataName" >
      </sn-datacolumn>
      <sn-datacolumn label="内容类型" prop="contentType"  :formatter="getcontentTypeItemName">
      </sn-datacolumn>
      <sn-datacolumn label="创建时间" prop="createTime" :formatter="getPublishTime">
      </sn-datacolumn>
      <sn-datacolumn label="视频时长" prop="duration"  :formatter="getVideoTime">
      </sn-datacolumn>
      <sn-datacolumn label="状态" prop="zxStatus"  :formatter="getzxStatusItemName">
      </sn-datacolumn>
      <sn-datacolumn label="操作" prop="opt" width="90">
      </sn-datacolumn>
      <template slot="checkbox" slot-scope="{row}">
        <sn-checkbox type="checkbox" :disabled="row.zxStatus == 1"  :label="row.id" v-model="curSelecteds"></sn-checkbox>
      </template>
      <template slot-scope="{row}" slot="title">
        <td-info :row="row" @showPreview="handleDetailClick(row.id)"></td-info>
      </template>
      <template slot-scope="{row}" slot="opt">
        <div class="btn-group">
          <button @click.stop="handleDetailClick(row.id)">查看</button>
          <div class="pt-2">
            <button  @click.stop="handlePublishClick(row)" :class="{'is-disabled':row.zxStatus == 1}" :disabled="row.zxStatus == 1">发布</button>
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
    <sn-confirm v-if="viewType=='detailMore'" title="查看视频" @close="close" closeIcon noflag>
      <div slot="btn-group"></div>
      <detail-confirm :channelId = "channelId"></detail-confirm>
    </sn-confirm>
  </div>
</template>

<script>
import * as Constant from 'js/constant';
import DI from 'interface';
import TdInfo from './tdInfo';
import { formatDate } from 'utils/util';
import DetailConfirm from './detailConfirm';

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
      type: Number,
      default: 1
    }
  },
  components: {
    TdInfo,
    DetailConfirm
  },
  data() {
    return {
      list: [],
      viewType: '',
      starVal: 1,
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
    }
  },
  methods: {
    handlePublishClick(row) {
      this.$router.push({
        path: '/videoPublish',
        query: {
          ids: row.id
        }
      });
    },
    handleCheckAllChange(event) {
      this.$emit('update:checkAll', event.target.checked);
    },
    batchHandle(type) {
      this.$confirm('确认批量发布?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({
          path: '/videoPublish',
          query: {
            ids: this.selecteds.join(',')
          }
        });
      });
    },
    goto(flag) {
      if (flag == 0 && this.pageIndex != 1) {
        // 首页
        this.pageIndex = 1;
        // this.queryList();
      }
      if (flag == -1 && this.pageIndex != 1) {
        // 上一页
        this.pageIndex--;
        // this.queryList();
      }
      if (flag == 1) {
        this.pageIndex++;
        // this.queryList();
      }
      this.$emit('getReadyList', this.pageIndex);

    },
    getPublishTime(time) {
      let publishTimeShow = '';
      publishTimeShow = formatDate(time, 'yyyy-MM-dd hh:mm:ss');
      return publishTimeShow;
    },
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
    getcontentTypeItemName(val) {
      let name = '';
      switch (val) {
        case 0:
          name = '正片';
          break;
        case 1:
          name = '预告';
          break;
        case 2:
          name = '花絮';
          break;
        case 3:
          name = '其它非正片';
          break;
        case 4:
          name = '为看点';
          break;
        case 5:
          name = '音频';
          break;
        case 6:
          name = '音乐';
          break;
        default:
          break;
      }
      return name;
    },
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
    confirmHide() {
      this.viewType = '';
    },
    close() {
      this.viewType = '';
    },
    handleDetailClick(id) {
      this.channelId = id;
      this.viewType = 'detailMore';
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
