<style scoped>
.list {
  background-color: #fff;
  margin-top: 20px;
  padding-bottom: 20px;
}
</style>
<template>
  <div>
    <div v-show="ListShow">
      <sn-topbar title="发布详情" labels="已发布,草稿箱" @tab="tabChange"></sn-topbar>
      <NewCrumb v-if="tab == 0" ref="crumb" :selectFilters="selectFilters"></NewCrumb>
      <DraftCrumb v-if="tab == 1" ref="draftCrumb" :selectDraftFilters="selectDraftFilters"></DraftCrumb>
      <div class="list" v-if="tab == 0">
        <NewList ref="newsList" :list="list"></NewList>
        <sn-pagination ref="news" :pageIndex.sync="pageInfo.pageIndex" :size="pageInfo.pageSize" :total="pageInfo.total" @goto="goto"></sn-pagination>
      </div>
      <div class="list" v-if="tab == 1">
        <DraftList ref="draftList" :list="draftList"></DraftList>
        <sn-pagination ref="draft" :pageIndex.sync="draftPageInfo.pageIndex" :size="draftPageInfo.pageSize" :total="draftPageInfo.total" @goto="goto"></sn-pagination>
      </div>
    </div>
    <replay :content.sync="rowContent" v-if="viewType == 'replay'" @change-view="changeView"></replay>
    <comment :content.sync="rowContent" v-if="commentShow" @change-view="changeView"></comment>
    <ImportTask v-if="viewType == 'importTask'" :item.sync="rowContent" @close="close" @ok="close" view="viewType" :import-type="rowContent.$importTargetType" />
  </div>
</template>
<script>
const SELECT_MAPS = ['newsType', 'status'];
import DI from 'interface';
import { fetchNewsListAction, fetchDraftListAction } from './fetch';
import NewCrumb from './newCrumb';
import DraftCrumb from './draftCrumb';
import NewList from './newList';
import DraftList from './draftList';
import Comment from 'views/comment-management/guide-comment/comment.vue';
import Replay from 'views/comment-management/guide-comment/replay.vue';
import ImportTask from 'widgets/importTask/index';
export default {
  components: {
    DraftCrumb,
    NewCrumb,
    NewList,
    DraftList,
    Comment,
    ImportTask,
    Replay
  },
  data() {
    return {
      tab: 0,
      list: [],
      draftList: [],
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      draftPageInfo: {
        pageIndex: 1,
        pageSize: 20,
        total: 0
      },
      selectDraftFilters: {
        startTime: null,
        endTime: null,
        title: '',
        draftId: '',
        newsType: -1
      },
      selectFilters: {
        startTime: null,
        endTime: null,
        title: '',
        newsId: '',
        newsType: -1,
        status: -1
      },
      rowContent: {}, //评论引导
      replayShow: false, //回复窗口
      commentShow: false, //评论窗口
      ListShow: true, //列表窗口
      contentInfo: '',
      viewType: 'list',
      isReplay: false//通过此字段来判断当前是在回复列表还是非回复列表，来确定显示回复列表还是评论列表
    };
  },
  created() {
    this.$bus.$on('reload', () => {
      this.queryList();
    });
  },
  mounted() {
    this.tab = 0;
    this.queryList();
  },
  methods: {
    close() {
      if(this.isReplay){//当前为回复列表，则应该返回回复列表
        this.viewType = 'replay';
      }else{//非回复列表，则返回评论引用列表
        this.viewType = '';
        this.commentShow = !this.commentShow;//有则隐藏无则显示
      }
    },
    changeView(val) {
      if (val == 'importTask') {//展示填充评论
        this.viewType = val;
        this.commentShow = false;//隐藏评论列表
      }
      if (val == 'list') {//展示发布详情列表
        this.commentShow = !this.commentShow;//隐藏评论列表
        this.ListShow = !this.ListShow;//展示列表
      }
      if (val == 'replay') {//展示回复列表
        this.isReplay = true;
        this.viewType = val;
        this.commentShow = !this.commentShow;//隐藏评论引用列表
      }
      if(val == 'comment'){//展示评论列表
        this.isReplay = false;
        this.viewType = val;
        this.commentShow = !this.commentShow;
      }
    },
    tabChange(tab) {
      this.tab = tab;
      this.setDefaultData();
      this.queryList();
    },
    resetFields() {
      Object.assign(this.selectFilters, this.getDefaultData());
      Object.assign(this.selectDraftFilters, this.getDefaultData());
    },
    setDefaultData() {
      this.resetFields();
      this.selectDraftFilters.newsType = -1;
      this.selectFilters.newsType = -1;
      this.selectFilters.status = -1;
    },
    getDefaultData() {
      return {
        startTime: null,
        endTime: null,
        title: '',
        newsId: '',
        draftId: ''
      };
    },
    goto(pageNum) {
      this.pageInfo.pageIndex = pageNum;
      this.draftPageInfo.pageIndex = pageNum;
      this.queryList();
    },
    queryList() {
      //查询发布详情列表
      let pageInfo = this.pageInfo;
      let draftPageInfo = this.draftPageInfo;
      let pageIndex = (pageInfo.pageIndex - 1) * pageInfo.pageSize;
      let draftPageIndex = (draftPageInfo.pageIndex - 1) * draftPageInfo.pageSize;
      let pageSize = pageInfo.pageSize;
      let ajaxData = { ...this.selectFilters };
      let ajaxData1 = { ...this.selectDraftFilters };
      for (let value of SELECT_MAPS) {
        if (ajaxData[value] === -1) {
          ajaxData[value] = '';
        }
      }
      for (let value of SELECT_MAPS) {
        if (ajaxData1[value] === -1) {
          ajaxData1[value] = '';
        }
      }
      ajaxData = this.$bus.deleteNullProperty(ajaxData);
      ajaxData1 = this.$bus.deleteNullProperty(ajaxData1);
      if (this.tab == 0) {
        fetchNewsListAction(this, {
          params: {
            pageIndex,
            pageSize,
            ...ajaxData
          }
        });
      } else {
        fetchDraftListAction(this, {
          params: {
            pageIndex: draftPageIndex,
            pageSize,
            ...ajaxData1
          }
        });
      }
    }
  }
};
</script>
