<template>
  <div id='list'>
    <sn-table :data="list" ref="table">
      <sn-table-column width="40" wall="false" tdPaddingRight="5" sloted>
        <template slot-scope="row">
          <sn-checkbox v-model="selecteds" :label="row.newsId" theme="radio"></sn-checkbox>
        </template>
      </sn-table-column>
      <sn-table-column label="资讯基本信息" align="left" width="30%" tdPaddingLeft="0" sloted>
        <template slot-scope="row">
          <td-info :row="row"></td-info>
        </template>
      </sn-table-column>
      <sn-table-column label="作者" prop="authorName" width="9%">
      </sn-table-column>
      <sn-table-column label="标签" prop="nlrList" width="11%" sloted>
        <template slot-scope="row">
          <sn-td-ellipsis :str="getTagStr(row.nlrList)"></sn-td-ellipsis>
        </template>
      </sn-table-column>
      <sn-table-column label="推送状态" prop="isPush" width="12%" sloted>
        <template slot-scope="row">
          <div class="push-state">
            <p v-if="row.newsType == 1 || row.newsType == 3">{{row.isPushToday ? '已发布至今日头条' : '未发布至今日头条'}}</p>
            <p v-if="row.newsType == 1 || row.newsType == 2 || row.newsType == 3 || row.newsType == 10">{{row.isPushMZSS ? '已发布至苏宁易购' : '未发布至苏宁易购'}}</p>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label="发布时间" prop="createTime" width="8%" sloted>
        <template slot-scope="row">
          <sn-td-date :time="row.createTime"></sn-td-date>
        </template>
      </sn-table-column>
      <sn-table-column label="状态" prop="status" width="9%" sloted>
        <template slot-scope="row">
          <div>{{ getItemStatus(row.status).name }}</div>
        </template>
      </sn-table-column>
      <sn-table-column label="资讯来源" prop="source" width="9%" sloted>
        <template slot-scope="row">
          <div>{{ row.source == null || row.source === '' ? "原创资讯" : "转载资讯"}}</div>
        </template>
      </sn-table-column>
      <sn-table-column label="操作" sloted>
        <template slot-scope="row">
          <div class="btn-status">
            <button @click.stop="handlePushToNews(row)" v-if="row.newsType == 1 || row.newsType== 3">
              {{ row.isPushToday === 1 ? "取消推送至今日头条" : "推送至今日头条"}}
            </button>

            <button @click.stop="handlePushToEasyBuy(row)">
              {{ row.isPushMZSS === 1 ? "取消推送至易购" : "推送至易购"}}
            </button>
          </div>
        </template>
      </sn-table-column>
    </sn-table>
    <sn-confirm v-if="viewType === 'pushToNews' || viewType ==='batchPushToNews'" title="推送资讯" @close="close" @sure="handleInfo('push')" txt noflag>
      您确认将当前(选中)资讯推送至今日头条吗？
    </sn-confirm>
    <sn-confirm v-if="viewType === 'pushToEasyBuy' || viewType ==='batchPushToEasyBuy'" title="推送资讯" @close="close" @sure="handleInfo('push')" txt noflag>
      您确认将当前(选中)资讯推送至苏宁易购吗？
    </sn-confirm>
    <sn-confirm v-if="viewType === 'cancelPushToNews'" title="取消资讯推送" @close="close" @sure="handleInfo('unpush')" txt noflag>
      您确认取消当前资讯推送到今日头条吗？
    </sn-confirm>
    <sn-confirm v-if="viewType === 'cancelPushToEasyBuy'" title="取消资讯推送" @close="close" @sure="handleInfo('unpush')" txt noflag>
      您确认取消当前资讯推送到苏宁易购吗？
    </sn-confirm>
    <sn-confirm txt noflag title="取消资讯推送" v-if="viewType === 'batchCancelPush'" @sure="handleInfo('unpush')" @close="close">您确认取消当前(选中)资讯推送状态吗？</sn-confirm>
  </div>
</template>

<script>
import DI from 'interface';
import * as Constant from 'js/constant';
import TdInfo from './widgets/tdInfo';
export default {
  name: 'list',
  props: {
    list: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  components: {
    TdInfo
  },

  data() {
    return {
      selecteds: [],
      articleList: Constant.ARTICLE_TYPE,
      viewType: '',
      starVal: 1,
      selectedItem: null,
      pushFlag: '' //头条或易购推送标记
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.$bus.$on('cooperation-checkAll', () => {
        let checks = this.list.reduce((perVal, val) => {
          perVal.push(val.newsId);
          return perVal;
        }, []);
        this.selecteds = [...checks];
      });

      this.$bus.$on('cooperation-uncheckAll', () => {
        this.selecteds = [];
      });
    });
  },
  watch: {
    selecteds() {
      if (this.selecteds.length === this.list.length && this.selecteds.length !== 0) {
        this.$bus.$emit('cooperation-checkAllStatus', true);
      } else if (this.selecteds.length + 1 === this.list.length) {
        this.$bus.$emit('cooperation-checkAllStatus', false);
      }
      if (this.selecteds.length == 0) {
        this.$bus.$emit('cooperation-checkAllStatus', false);
      }
    }
  },

  methods: {
    getTagStr(list = []) {
      let arr = (list || []).reduce((perVal, val) => {
        perVal.push(val.labelName);

        return perVal;
      }, []);
      if (arr && arr.length > 0) {
        return arr.join(' / ');
      }
      return '';
    },

    getItemArticle(val) {
      return Constant.getItemByValue(Constant.ARTICLE_TYPE, val);
    },

    getItemStatus(val) {
      return Constant.getItemByValue(Constant.INFOR_STATUS, val);
    },

    getItemPushStatus(val) {
      return Constant.getItemByValue(Constant.INFOR_PUSHSTATUS, val);
    },
    handlePushToNews(row) {
      //单个推送至今日头条
      this.selectedItem = row;
      row.isPushToday ? (this.viewType = 'cancelPushToNews') : (this.viewType = 'pushToNews');
      this.pushFlag = 'news';
    },
    handlePushToEasyBuy(row) {
      //单个推送至苏宁易购
      this.selectedItem = row;
      row.isPushMZSS ? (this.viewType = 'cancelPushToEasyBuy') : (this.viewType = 'pushToEasyBuy');
      this.pushFlag = 'easybuy';
    },
    batchHandle(type) {
      this.viewType = type;
    },
    handleInfo(type) {
      //推送和取消推送确认
      let pushTarget = '';
      const actionObj = Constant.getItemByKey(Constant.INFOR_PUSH_ACTION, type);
      if (this.pushFlag == 'news' || this.viewType == 'batchPushToNews') {
        pushTarget = 1;
      } else if (this.pushFlag == 'easybuy' || this.viewType == 'batchPushToEasyBuy') {
        pushTarget = 2;
      } else if (this.viewType == 'batchCancelPush') {
        pushTarget = 1;
      }
      let ajaxData = {
        isPush: actionObj.value,
        pushTarget
      };

      if (this.viewType.indexOf('batch') > -1) {
        //批量操作
        let filterIds = this.selecteds;
        let filterItems = [];
        for (let i = 0, idLen = filterIds.length; i < idLen; i++) {
          for (let j = 0, len = this.list.length; j < len; j++) {
            let temp = this.list[j];
            if (filterIds[i] === temp.newsId) {
              //批量推送
              filterItems.push({
                isPushToday: temp.isPushToday,
                isPushMZSS: temp.isPushMZSS,
                newsId: temp.newsId,
                newsType: temp.newsType,
                status: temp.status
              });
              break;
            }
          }
        }
        ajaxData.newses = filterItems;
      } else {
        //单个推送
        ajaxData.newses = [
          {
            isPushToday: this.selectedItem.isPushToday,
            isPushMZSS: this.selectedItem.isPushMZSS,
            newsId: this.selectedItem.newsId,
            newsType: this.selectedItem.newsType,
            status: this.selectedItem.status
          }
        ];
      }
      this.doHandleInfo(ajaxData, `正在批量${actionObj.name}资讯，请稍候`, this.viewType);
    },
    doHandleInfo(ajaxData, loadingText, viewType) {
      this.viewType = null;
      this.$ajax({
        url: DI.cooperation.pushAction,
        context: this,
        loadingText,
        data: JSON.stringify(ajaxData),
        success: res => {
          if (res.retCode == '0') {
            this.pushFlag = '';
            this.$parent.$refs.crumb.uncheckAll();
            this.$parent.queryList();
          } else {
            this.viewType = viewType;
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          this.viewType = viewType;
          console.log('error');
        }
      });
    },

    close() {
      this.$parent.$refs.crumb.uncheckAll();
      this.selectedItem = null;
      this.viewType = null;
    }
  }
};
</script>

<style scoped>
button {
  color: #0abbfe;
}
.push-state,
.btn-status {
  display: flex;
  align-items: center;
  flex-direction: column;
}
.btn-status button {
  margin-top: 10px;
}
.push-state p {
  margin-bottom: 10px;
}
.is-disabled {
  color: #a1a1a1;
  cursor: not-allowed;
}
</style>
