<style scoped>
  .nav {
    display: flex;
    flex-direction: column;
    align-items: left;
    justify-content: space-between;
    margin: 2px 0;
    padding: 10px 0;
    background: #fff;
  }
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .input-box {
      display: flex;
      align-items: center;
      margin-left: 20px;
      float: left;
    }
    .btns {
      margin-right: 20px;
    }
  }
  .ibox {
    display: flex;
    align-items: center;
    min-height: 72px;
    padding: 0 20px;
    background: #fff;
    margin: 10px 0;
    width: 100%;
    &.between {
      justify-content: space-between;
    }
    .search-box {
      .input-box {
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        margin-top: 20px;
        margin-right: 20px;
        float: left;
        span {
          margin-right: 18px;
        }
      }
    }
    .btns {
      display: flex;
      flex-direction: column;
      button {
        & + button {
          margin-top: 20px;
        }
      }
      .btn-query {
        text-align: right;
      }
      .btn-query-second {
        margin-top: 12px;
      }
      .btn-reset {
        border: 1px solid #ddd;
        background-color: #fff;
        color: #000000;
        margin-left: 20px;
      }
    }
  }
</style>
<template>
  <div id="idx">
    <div class="navbox" v-if="shownav">
      <sn-topbar :title="libraryTitle" labels="主题库" @tab="libraryChange" :index="libraryIndex"></sn-topbar>
      <div class="nav">
        <div class="topbar">
          <div class="input-box">
            <span>主题类型</span>
            <sn-topbar type="button" labels="栏目,赛事,专题,节目集,小组,比赛场次" @tab="themeChange" :index="themeIndex"></sn-topbar>
          </div>
          <div class="btns">
            <sn-button type="outline" @click="addTheme">新增</sn-button>
          </div>
        </div>
        <section class="ibox between">
          <div class="search-box">
            <div class="input-box">
              <span>主题名称</span>
              <sn-input width="178" radius="16" :maxlength="30" placeholder="请输入主题名称" v-model="subjectName"></sn-input>
            </div>
            <div class="input-box">
              <span>主题ID</span>
              <sn-input width="178" radius="16" inputType="number" :maxlength="30" placeholder="请输入主题ID" v-model="subjectId"></sn-input>
            </div>
          </div>
          <div class="btns">
            <p class="btn-query">
              <sn-button type="primary" @click="update">查询</sn-button>
            </p>
            <p class="btn-query-second">
              <sn-button class="btn-reset" type="outline" @click="reset">重置</sn-button>
            </p>
          </div>
        </section>
      </div>
    </div>
    <List v-if="viewType == 'list'" ref="list" @change-view="change" v-model="channelInfo" :index="subjectType" />
    <Add :channel="channelInfo" ref="add" @update="update" :index="subjectType" />
    <Review v-if="viewType == 'review'" :channelId="channelInfo.infoFlowId" :subjectType="channelInfo.subjectType" />
    <ExReview v-if="viewType == 'exreview'" :channelId="channelInfo.infoFlowId" :subjectType="channelInfo.subjectType" />
    <ContentList v-if="viewType == 'contentList'" @change-view="change" v-model="item" :channel="channelInfo" />
    <EditContent v-if="viewType == 'editContent'" @change-view="change" :contentItem="item" />
    <Rdisplay v-if="viewType == 'rdisplay'" @change-view="change" :channel="channelInfo" />
    <Vdisplay v-if="viewType == 'vdisplay'" @change-view="change" :channel="channelInfo" />
    <Display @change-view="changeView" v-if="viewType == 'display'" :channel="channelInfo"/>
    <ColumnList v-if="viewType== 'columnlist'" @change-view="change" v-model="item" :channel="channelInfo"></ColumnList>
    <TopicContentList v-if="viewType == 'topicContentList'" @change-view="change" v-model="item" :channel="channelInfo"/>
    <TopicEditContent v-if="viewType == 'topicEditContent'" @change-view="change" :contentItem="item"/>
    <sn-toptip></sn-toptip>
  </div>
</template>
<script>
import List from './list' // 主题列表
import Add from './add'
import Review from '../../info-management/review/index' // 审核页面
import ExReview from '../../common/exempt_review' // 通用免审页面
import ContentList from '../infoFlow-management/widgets/content/contentList' // 信息流内容管理
import EditContent from '../infoFlow-management/widgets/content/editContent'; //编辑内容
import Rdisplay from '../../app-management/channel/widgets/display/rdisplay' //推荐频道展示管理
import Vdisplay from '../../app-management/channel/widgets/display/vdisplay' //视频频道展示管理
import Display from '../../app-management/topic/display'; //专题展示管理
import ColumnList from '../../app-management/topic/columnList';//栏目列表页
import TopicContentList from '../infoFlow-management/widgets/content/topicContentList'; //专题内容页面
import TopicEditContent from '../infoFlow-management/widgets/content/topicEditContent'; //专题内容页面


export default {
  data() {
    return {
      libraryTitle: '展示主题管理',
      libraryIndex: 0,
      themeIndex: 0,
      subjectType: 1,
      viewType: 'list',
      item: {},
      channelInfo: {},
      subjectName: '',
      subjectId: ''
    }
  },
  components: {
    List,
    Add,
    Review,
    ExReview,
    ContentList,
    EditContent,
    Rdisplay,
    Vdisplay,
    Display,
    ColumnList,
    TopicContentList,
    TopicEditContent
  },
  computed: {
    shownav() {
      return this.viewType != 'review' && this.viewType != 'exreview' && this.viewType != 'contentList' && this.viewType != 'vdisplay' && this.viewType != 'rdisplay' && this.viewType != 'display' && this.viewType != 'columnlist' && this.viewType != 'editContent' && this.viewType != 'topicContentList' && this.viewType != 'topicEditContent' ;
    }
  },
  methods: {
    reset() {
      this.subjectName = '';
      this.subjectId = '';
    },
    libraryChange(i) {},
    themeChange(i) {
      this.themeIndex = i;
      this.subjectType = i + 1;
    },
    change(value) {
      if (value == 'edit') {
        this.$refs.add.channel = this.channelInfo;
        this.$refs.add.showFlag = true;
      } else {
        this.$refs.add.showFlag = false;
        this.viewType = value;
      }
    },
    addTheme() {
      this.$refs.add.showFlag = true;
      this.$refs.add.channel = {};
    },
    update() {
      this.$refs.list.pageIndex = 1;
      this.$bus.$emit('syncCurPage', 1);
      this.$refs.list.getList(1);
    }
  }
}
</script>
