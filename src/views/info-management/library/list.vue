<template>
  <div id="list">
    <sn-datatable :data="list" :border="true">
      <sn-datacolumn label="自定义" prop="checkbox" :width="50" :column-border="false">
        <sn-checkbox type="checkbox" v-model="checkAll" @change="handleCheckAllChange"></sn-checkbox>
      </sn-datacolumn>
      <sn-datacolumn label="资讯基本信息" prop="name" :width="310" alignment="left">
      </sn-datacolumn>
      <sn-datacolumn label="文章来源" prop="sourceType" :width="70" :formatter="getSourceTypeName" alignment="left">
      </sn-datacolumn>
      <sn-datacolumn label="作者" prop="authorName" :width="100" alignment="center">
      </sn-datacolumn>
      <sn-datacolumn label="标签" prop="nlrList" :width="100">
      </sn-datacolumn>
      <sn-datacolumn label="上架状态" prop="ccrList">
      </sn-datacolumn>
      <sn-datacolumn label="发布时间" prop="createTime" :width="100">
      </sn-datacolumn>
      <sn-datacolumn label="推荐时效" prop="expireTime" :width="100">
      </sn-datacolumn>
      <sn-datacolumn label="状态" prop="status" :width="70" :formatter="getStatusItemName">
      </sn-datacolumn>
      <sn-datacolumn label="星级" prop="level" :width="70" :formatter="getItemStarName">
      </sn-datacolumn>
      <sn-datacolumn label="操作" prop="opt" width="90">
      </sn-datacolumn>
      <template slot="checkbox" slot-scope="cell">
        <sn-checkbox type="checkbox" :label="cell.row" v-model="curSelecteds"></sn-checkbox>
      </template>
      <template slot-scope="cell" slot="name">
        <td-info :row="cell.row"></td-info>
      </template>
      <template slot-scope="cell" slot="authorName">
        <sn-td-author :row="cell.row" authorType fake-author></sn-td-author>
      </template>
      <template slot-scope="cell" slot="nlrList">
        <sn-td-ellipsis :str="getTagStr(cell.value)"></sn-td-ellipsis>
      </template>
      <template slot-scope="cell" slot="ccrList">
        <td-channel :data="cell.value"></td-channel>
      </template>
      <template slot-scope="cell" slot="createTime">
        <sn-td-date :time="cell.value"></sn-td-date>
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
      <template slot-scope="cell" slot="opt">
        <div class="btn-group">
          <button :class="getBtnClass(cell.row.status)" @click.stop="handleCancelHideClick(cell.row)" v-if="getItemStatus(cell.row.status).key==='hidden'">取消隐藏</button>
          <button :class="getBtnClass(cell.row.status)" @click.stop="handleHideClick(cell.row)" v-else>隐藏</button>
          <div class="pt-2">
            <button :class="getBtnClass(cell.row.status)" @click.stop="handleEditClick(cell.row)">编辑</button>
          </div>
          <div class="pt-2" v-if="getItemStatus(cell.row.status).key==='published'">
            <button @click.stop="handleSiteClick(cell.row)">地址</button>
          </div>
          <div class="pt-2">
            <button :class="getBtnClass(cell.row.status,'publish')" @click.stop="handlePublishClick(cell.row)">发布上架</button>
          </div>
          <div class="pt-2">
            <button :class="getBtnClass(cell.row.status)" @click.stop="handleStarClick(cell.row)">设置星级</button>
          </div>
        </div>
      </template>
    </sn-datatable>
    <sn-confirm v-if="viewType=='site'" title="资讯地址" @close="close" closeIcon :sureBtnIsShow="false" hideCancelButton noflag>
      <div class="modal-body site-body" :style="{width:'795px'}">
        <ul>
          <li class="site-item">
            <div>
              <label for="">站内路由地址：</label>
              <button class="clip-btn" @click="clipSite(multiportSite.inter)">复制地址</button>
            </div>
            <div class="ellipsis">{{multiportSite.inter}}</div>
          </li>
          <li class="site-item">
            <div>
              <label for="">移动端落地分享页：</label>
              <button class="clip-btn" @click="clipSite(multiportSite.app)">复制地址</button>
            </div>
            <div class="ellipsis">{{multiportSite.app}}</div>
          </li>
          <li class="site-item">
            <div>
              <label for="">PC端地址：</label>
              <button v-if="multiportSite.pc" class="clip-btn" @click="clipSite(multiportSite.pc)">复制地址</button>
              <span v-else>暂无</span>
            </div>
            <div v-if="multiportSite.pc" class="ellipsis">{{multiportSite.pc}}</div>
          </li>
        </ul>
      </div>
    </sn-confirm>
    <sn-confirm v-if="viewType=='star'||viewType=='batchStar'" title="设置星级" @close="close" @sure="confirmStarSetting" noflag>
      <div class="modal-body modal-sm">
        <sn-rate v-model="starVal"></sn-rate>
      </div>
    </sn-confirm>
    <sn-confirm v-if="viewType=='hide'||viewType=='batchHide'" title="隐藏资讯" @close="close" @sure="confirmHide" txt noflag>
      您确认将当前(选中)资讯设置为隐藏状态吗？
    </sn-confirm>
    <sn-confirm v-if="viewType=='cancelHide'" title="资讯取消隐藏" @close="close" @sure="confirmCancelHide" txt noflag>
      您确认取消当前资讯隐藏状态吗？
    </sn-confirm>
    <sn-confirm v-if="viewType=='timeEdit'" title="修改推荐时效" @close="close" @sure="doTimeEdit" txt noflag>
      <div class="is-line">
        <label class="modal__label--expire">推荐时效</label>
        <sn-timer v-model="expireTime" ref="expireTime" placeholder="时效时间" width="240" radius="4" timeFormat="HH:mm:ss" showTimepicker></sn-timer>
      </div>
    </sn-confirm>
    <channel-modal ref="channelModal" :viewType.sync="viewType" :close="close" :selectedItem="selectedItem"></channel-modal>
  </div>
</template>

<script>
import * as Constant from 'js/constant';
import Clipboard from 'clipboard';
import { fetchInfoItemDetailsAction, doItemOperateAction, doEditExpireTimeAction } from './fetch';
import { getMultiportSite, VIDEOSET_URL } from 'src/utils/envUrl';
import TdInfo from './widgets/tdInfo';
import TdChannel from './widgets/tdChannel';
import ChannelModal from './widgets/channelModal';

export default {
  name: 'list',
  props: {
    selecteds: {
      type: Array
    },
    list: {
      type: Array,
      default: function() {
        return [];
      }
    },
    checkAll: Boolean
  },
  components: {
    TdInfo,
    TdChannel,
    ChannelModal
  },
  data() {
    return {
      viewType: '',
      starVal: 1,
      selectedItem: null,
      multiportSite: {},
      expireTime: null
    };
  },
  computed: {
    deletedIds() {
      return (this.list || []).reduce((perVal, row) => {
        if (this.getItemStatus(row.status).key === 'deleted') {
          perVal.push(row.newsId);
        }

        return perVal;
      }, []);
    },
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
    handleCheckAllChange(event) {
      this.$emit('update:checkAll', event.target.checked);
    },
    handleTimeEditClick(row) {
      this.selectedItem = row;
      this.expireTime = row.expireTime;
      this.viewType = 'timeEdit';
    },
    doTimeEdit() {
      if (!this.expireTime) {
        return;
      }
      doEditExpireTimeAction(this, {
        params: {
          newsId: this.selectedItem.newsId,
          expireTime: this.expireTime
        },
        row: this.selectedItem
      });
    },
    getSplitTimeList(time) {
      if (time) {
        return time.split(' ');
      }

      return [];
    },
    getTagStr(itemList = []) {
      let arr = (itemList || []).reduce((perVal, val) => {
        perVal.push(val.labelName);

        return perVal;
      }, []);
      if (arr && arr.length > 0) {
        return arr.join(' / ');
      }
      return '';
    },
    getItemStatus(val) {
      return Constant.getItemByValue(Constant.INFOR_STATUS, val);
    },
    getStatusItemName(val) {
      return this.getItemStatus(val).name;
    },
    getItemStarName(val) {
      return Constant.getItemByValue(Constant.STAR_LEVEL, val).name;
    },
    getSourceTypeName(val) {
      return Constant.getItemByValue(Constant.SOURCE_TYPE, val).name;
    },
    getBtnClass(val, type) {
      const itemKey = this.getItemStatus(val).key;
      if (itemKey === 'deleted' || ('publish' === type && itemKey === 'hidden')) {
        return 'is-disabled';
      }

      return;
    },
    handleSiteClick(row) {
      this.viewType = 'site';
      let typeItemKey = Constant.getItemByValue(Constant.ARTICLE_TYPE, row.newsType).key;
      if (typeItemKey === 'video') {
        this.$ajax({
          url: `${VIDEOSET_URL}/bppchannel.api?id=${row.vedioId}&showset=1&format=jsonp`,
          noBaseUrl: true,
          noFilter: true,
          type: 'GET',
          dataType: 'jsonp',
          loadingText: '正在加载视频合集列表，请稍候！',
          timeout: 5000,
          context: this,
          success(data) {
            let setItem = (data.channels && data.channels[0] && data.channels[0].setRelates)[0] || {};
            row.videoSetId = setItem.setId || '';
            this.multiportSite = getMultiportSite(row, typeItemKey);
          },
          error(err) {
            this.multiportSite = getMultiportSite(row, typeItemKey);
            console.log(err);
          }
        });
      } else {
        this.multiportSite = getMultiportSite(row, typeItemKey);
      }
    },
    clipSite(site) {
      var clipboard = new Clipboard('.clip-btn', {
        // 点击copy按钮，直接通过text直接返回复印的内容
        text: function() {
          return site;
        }
      });

      clipboard.on('success', e => {
        this.$message.success('复制成功');
      });
    },
    handleHideClick(row) {
      if (this.getItemStatus(row.status).key === 'deleted') {
        return;
      }

      this.selectedItem = row;
      this.viewType = 'hide';
    },
    handleCancelHideClick(row) {
      if (this.getItemStatus(row.status).key === 'deleted') {
        return;
      }

      this.selectedItem = row;
      this.viewType = 'cancelHide';
    },
    handleEditClick(row) {
      if (this.getItemStatus(row.status).key === 'deleted') {
        return;
      }
      this.$router.push({
        path: `edit`,
        query: {
          id: row.newsId,
          type: row.newsType
        }
      });
    },
    handlePublishClick(row) {
      const itemKey = this.getItemStatus(row.status).key;
      if (itemKey === 'deleted' || itemKey === 'hidden') {
        return;
      }
      this.selectedItem = row;
      this.$nextTick(() => {
        this.viewType = 'publish';
      });
    },
    handleStarClick(row) {
      if (this.getItemStatus(row.status).key === 'deleted') {
        return;
      }

      this.selectedItem = row;
      this.starVal = row.level;
      this.viewType = 'star';
    },
    batchHandle(type) {
      this.viewType = type;
    },
    confirmStarSetting() {
      let ajaxData = {
        level: this.starVal
      };

      if (this.viewType === 'batchStar') {
        let newsIds = this.removeDeletedIds(this.curSelecteds, this.deletedIds);

        if (newsIds.length === 0) {
          this.$message.warning('请至少选择一条非删除状态资讯！');
          return;
        }

        ajaxData.newsIds = newsIds;
        this.submitOperateData(ajaxData, '正在批量设置星级，请稍候');
      } else {
        ajaxData.newsIds = [this.selectedItem.newsId];
        this.submitOperateData(ajaxData, '正在设置星级，请稍候');
      }
    },
    confirmHide() {
      let ajaxData = {
        status: 2
      };

      if (this.viewType === 'batchHide') {
        let newsIds = this.removeDeletedIds(this.curSelecteds, this.deletedIds);

        if (newsIds.length === 0) {
          this.$message.warning('请至少选择一条非删除状态资讯！');
          return;
        }

        ajaxData.newsIds = newsIds;
        this.submitOperateData(ajaxData, '正在批量隐藏资讯状态，请稍候');
      } else {
        ajaxData.newsIds = [this.selectedItem.newsId];
        this.submitOperateData(ajaxData, '正在隐藏资讯状态，请稍候');
      }
    },
    removeDeletedIds(totalList, deletedIds) {
      return totalList.reduce((totalIds, item) => {
        if (deletedIds.indexOf(item.newsId) === -1) {
          totalIds.push(item.newsId);
        }

        return totalIds;
      }, []);
    },
    confirmCancelHide() {
      let ajaxData = {
        status: 1,
        newsIds: [this.selectedItem.newsId]
      };

      this.submitOperateData(ajaxData, '正在取消资讯隐藏状态');
    },
    submitOperateData(ajaxData, loadingText) {
      this.viewType = null;
      doItemOperateAction(this, {
        params: ajaxData,
        loadingText
      });
    },
    close() {
      (this.starVal = 1), (this.selectedItem = null);
      this.expireTime = '';
      this.viewType = null;
      this.$refs.channelModal && (this.$refs.channelModal.ruleForm.channelSet = []);
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
  background: url(../../../assets/icon-edit-small.png) no-repeat;
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
</style>
