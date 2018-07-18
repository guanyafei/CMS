<template>
  <div id="list">
    <sn-table :data="list" ref="table">
      <sn-table-column width="40"
        wall="false"
        tdPaddingRight="5"
        sloted>
        <template slot-scope="row">
          <sn-checkbox v-model="curSelecteds" :label="row" theme="radio"></sn-checkbox>
        </template>
      </sn-table-column>
      <sn-table-column label="资讯基本信息" align="left" width="28%" tdPaddingLeft="0" sloted>
        <template slot-scope="row">
          <td-info :row="row"></td-info>
        </template>
      </sn-table-column>
      <sn-table-column label="作者" prop="authorName" width="12%" sloted>
        <template slot-scope="row">
          <sn-td-author :row="row"></sn-td-author>
        </template>
      </sn-table-column>
      <sn-table-column label="标签" prop="nlrList" width="12%" sloted>
        <template slot-scope="row">
          <sn-td-ellipsis :str="getTagStr(row.nlrList)"></sn-td-ellipsis>
        </template>
      </sn-table-column>
      <sn-table-column label="上架状态" prop="ccrList" width="12%" sloted>
        <template slot-scope="row">
          <td-channel :data="row.ccrList"></td-channel>
        </template>
      </sn-table-column>
      <sn-table-column label="发布时间" prop="createTime" width="10%" sloted>
        <template slot-scope="row">
          <sn-td-date :time="row.createTime"></sn-td-date>
        </template>
      </sn-table-column>
      <sn-table-column label="状态" prop="status" width="8%" sloted>
        <template slot-scope="row">
          <div>
            {{
              getItemStatus(row.status).key==='refused' ?
                  `${getItemStatus(row.status).name}:${row.rejectReason}`
                  :
                  getItemStatus(row.status).name
            }}
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label="星级"
        prop="level"
        width="8%"
        sloted>
        <template slot-scope="row">
          <div>{{getItemStarName(row.level)}}</div>
        </template>
      </sn-table-column>
      <sn-table-column label="操作" width="" sloted>
        <template slot-scope="row">
          <div class="btn-group">
            <button
                @click.stop="handleAccessClick(row)"
                v-if="getItemStatus(row.status).key==='approving'">
              审核通过
            </button>
            <button
              v-if="getItemStatus(row.status).key==='approving'"
              @click.stop="handleRefuseClick(row)">
              驳回
            </button>
            <button
              @click.stop="handleAccessClick(row)"
              v-if="getItemStatus(row.status).key==='refused'">
              重新审核通过
            </button>
            <button
              @click.stop="handleCancelHideClick(row)"
              v-if="getItemStatus(row.status).key==='hidden'">
              取消隐藏
            </button>
            <button
              @click.stop="handleHideClick(row)"
              v-if="getItemStatus(row.status).key==='published'">
              隐藏
            </button>
            <div class="pt-2">
              <button @click.stop="handleEditClick(row)">编辑</button>
            </div>
            <div class="pt-2" v-if="getItemStatus(row.status).key==='published'">
              <button @click.stop="handleSiteClick(row)">地址</button>
            </div>
            <div class="pt-2" v-if="getItemStatus(row.status).key==='published'">
              <button @click.stop="handlePublishClick(row)">
                发布上架
              </button>
            </div>
            <div class="pt-2">
              <button @click.stop="handleStarClick(row)">设置星级</button>
            </div>
          </div>
        </template>
      </sn-table-column>
    </sn-table>
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
    <sn-confirm v-if="viewType=='star'||viewType=='batchStar'"
      title="设置星级"
      @close="close"
      @sure="confirmStarSetting"
      noflag>
      <div class="modal-body modal-sm">
        <sn-rate v-model="starVal"></sn-rate>
      </div>
    </sn-confirm>
    <sn-confirm v-if="viewType=='hide'||viewType=='batchHide'"
      title="隐藏资讯"
      @close="close"
      @sure="confirmHide"
      txt
      noflag>
      您确认将当前(选中)资讯设置为隐藏状态吗？
    </sn-confirm>
    <sn-confirm v-if="viewType=='cancelHide'"
      title="资讯取消隐藏"
      @close="close"
      @sure="confirmCancelHide"
      txt
      noflag>
      您确认取消当前资讯隐藏状态吗？
    </sn-confirm>
    <sn-confirm v-if="viewType=='access'" title='审核通过' @close="close" @sure="confirmAccess" noflag>
      <div class="modal-body modal-sm">
        <template v-if="sensitiveList.length===0">
          确认审核通过吗？
        </template>
        <div v-else>
          <div class="media-modal__words">
            资讯中检查出敏感词：
            <span class="media-modal__words--light">{{sensitiveList.join('、')}}</span>
          </div>
          <div>请慎重检查！</div>
        </div>
      </div>
    </sn-confirm>
    <refuse-confirm :viewType='viewType' ref="refuseConfirm" type="media"></refuse-confirm>
    <channel-modal ref="channelModal" :viewType="viewType" :close="close" :selectedItem="selectedItem" type="media"></channel-modal>
  </div>
</template>

<script>
import Clipboard from 'clipboard';
import { getMultiportSite, VIDEOSET_URL } from 'src/utils/envUrl';
import { doItemOperateAction, doItemBatchOperateAction } from './fetch';
import * as Constant from 'js/constant';
import TdChannel from './widgets/tdChannel';
import TdInfo from './widgets/tdInfo';
import ChannelModal from './widgets/channelModal';
import RefuseConfirm from 'widgets/tdActions/refuseConfirm';

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
    }
  },
  components: {
    TdInfo,
    TdChannel,
    ChannelModal,
    RefuseConfirm
  },
  data: () => ({
    viewType: '',
    starVal: 1,
    selectedItem: null,
    sensitiveList: []
  }),
  computed: {
    curSelecteds: {
      get() {
        return this.selecteds;
      },
      set(value) {
        this.$emit('update:selecteds', value);
      }
    },
    selectedIds() {
      return this.curSelecteds.reduce((totalIds, item) => {
        totalIds.push(item.newsId);
        return totalIds;
      }, []);
    },
    selectedPublishItems() {
      return this.curSelecteds.reduce((totalIds, item) => {
        if (this.getItemStatus(item.status).key === 'published') {
          totalIds.push(item.newsId);
        }
        return totalIds;
      }, []);
    }
  },
  watch: {
    curSelecteds(value) {
      this.$emit('update:selecteds', value);
    }
  },
  methods: {
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
      return Constant.getItemByValue(Constant.MEDIA_INFO_STATUS, val);
    },
    getItemStarName(val) {
      return Constant.getItemByValue(Constant.STAR_LEVEL, val).name;
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
    handleAccessClick(row) {
      let itemKey = this.getItemStatus(row.status).key;
      if (itemKey !== 'approving' && itemKey !== 'refused') {
        return;
      }
      this.selectedItem = row;
      this.checkSensetive(row, list => {
        this.viewType = 'access';
        this.sensitiveList = list;
      });
    },
    checkSensetive(row, sumitCallback) {
      let sensitiveList = [];
      let content = getText(row.content, Constant.getItemByValue(Constant.ARTICLE_TYPE, row.newsType).key);
      let checkQueue = [
        {
          loadingText: '正在校验敏感词，请稍候！',
          params: {
            content: `${row.title}${content}`,
            name: '资讯'
          },
          callback: res => {
            if (res.retCode != '0') {
              sensitiveList = getSensitiveList(res.retMsg);
            }
            sumitCallback(sensitiveList);
          }
        }
      ];
      this.$bus.sensitiveCheck(checkQueue);

      function getSensitiveList(str) {
        let result = [];
        let indexStart = str.indexOf('[') + 1;
        let indexEnd = str.indexOf(']');
        str = str.substring(indexStart, indexEnd).replace(/"/g, '');
        result = str.split(',');

        return result;
      }
      function getText(str, infoType) {
        let resultStr = '';
        switch (infoType) {
          case 'text':
          case 'video':
          case 'daily':
          case 'shortV':
            let wrapper = document.createElement('div');
            wrapper.innerHTML = str;
            resultStr = wrapper.innerText;
            break;
          case 'picture':
            let tempDom = document.createElement('div');
            tempDom.innerHTML = str;
            let content = JSON.parse(tempDom.innerText);
            let list = [];
            for (let i = 0; i < content.length; i++) {
              let item = content[i];
              resultStr += item.picDes;
            }
          default:
            break;
        }
        return resultStr;
      }
    },

    handleRefuseClick(row) {
      if (this.getItemStatus(row.status).key !== 'approving') {
        return;
      }
      this.selectedItem = row;
      this.viewType = 'refuse';
    },
    handleHideClick(row) {
      this.selectedItem = row;
      this.viewType = 'hide';
    },
    handleCancelHideClick(row) {
      this.selectedItem = row;
      this.viewType = 'cancelHide';
    },
    handleEditClick(row) {
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
      const { newsId } = row;
      if (itemKey === 'hidden') {
        return;
      }
      this.selectedItem = row;
      this.$nextTick(() => {
        this.viewType = 'publish';
      });
    },
    handleStarClick(row) {
      this.selectedItem = row;
      this.starVal = row.level;
      this.viewType = 'star';
    },
    batchHandle(type) {
      if (type === 'batchHide') {
        if (this.selectedPublishItems.length === 0) {
          this.$message.warning('请至少选择一条已发布状态资讯！');
          return;
        }
      }
      this.viewType = type;
    },
    confirmAccess() {
      let ajaxData = {
        status: 1,
        newsId: this.selectedItem.newsId
      };
      this.itemOperateAjax(ajaxData, '资讯正在审核通过，请稍候');
    },
    confirmStarSetting() {
      let ajaxData = {
        level: this.starVal
      };

      if (this.viewType === 'batchStar') {
        ajaxData.newsIds = this.selectedIds;
        this.listBatchOperateAjax(ajaxData, '正在批量设置星级，请稍候');
      } else {
        ajaxData.newsId = this.selectedItem.newsId;
        this.itemOperateAjax(ajaxData, '正在设置星级，请稍候');
      }
    },
    confirmHide() {
      let ajaxData = { status: 2 };

      if (this.viewType === 'batchHide') {
        ajaxData.newsIds = this.selectedPublishItems;
        this.listBatchOperateAjax(ajaxData, '正在批量隐藏资讯状态，请稍候');
      } else {
        ajaxData.newsId = this.selectedItem.newsId;
        this.itemOperateAjax(ajaxData, '正在隐藏资讯状态，请稍候');
      }
    },
    confirmCancelHide() {
      let ajaxData = {
        status: 1,
        newsId: this.selectedItem.newsId
      };

      this.itemOperateAjax(ajaxData, '正在取消资讯隐藏状态');
    },
    confirmRefuse(rejectReason) {
      let ajaxData = {
        newsId: this.selectedItem.newsId,
        rejectReason,
        status: Constant.getItemByKey(Constant.MEDIA_INFO_STATUS, 'refused').value
      };

      this.itemOperateAjax(ajaxData, '正在审核资讯，请稍候！');
    },
    itemOperateAjax(ajaxData, loadingText) {
      this.viewType = null;
      doItemOperateAction(this, {
        params: { ...ajaxData },
        loadingText
      });
    },
    listBatchOperateAjax(ajaxData, loadingText) {
      this.viewType = null;
      doItemBatchOperateAction(this, {
        params: { ...ajaxData },
        loadingText
      });
    },
    close() {
      this.starVal = 1;
      this.selectedItem = null;
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
.modal-body {
  &.modal-sm {
    width: 360px;
    font-size: 14px;
    text-align: center;
    .media-modal__words {
      margin-bottom: 5px;
    }
    .media-modal__words--light {
      color: #f47b77;
    }
  }
}
</style>
