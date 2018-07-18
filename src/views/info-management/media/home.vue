<template>
  <div>
    <sn-topbar title="自媒体资源池"></sn-topbar>
    <Header ref="header" :checkAll="checkAll" :searchFilters="searchFilters"></Header>
    <div class="list">
      <List ref="list" :list="list" :selecteds.sync="selecteds"></List>
      <sn-pagination
        :pageIndex.sync="pageInfo.pageIndex"
        :total="pageInfo.total"
        :size="pageInfo.pageSize"
        @goto="goto">
      </sn-pagination>
    </div>
  </div>
</template>
<script>
import { fetchMediaListAction } from './fetch';
import Header from './header';
import List from './list';
const SELECT_MAPS = ['status', 'newsType', 'level', 'settleType', 'showType', 'sourceDetailType'];

export default {
  name: 'comment',
  components: {
    Header,
    List
  },
  data () {
    return {
      selecteds: [],
      list: [],
      pageInfo: {
        total: 0,
        pageIndex: 1,
        pageSize: 20
      },
      searchFilters: {
        status: -1,    // 发布状态非必填	number		资讯状态1:已发布2:已隐藏3:已删除
        newsType: -1,  // 文章类型非必填	number		文章类型1.图文 2图集 3视频
        level: -1,	   // 星级非必填	number		1:一级 2：二级 3：三级
        settleType: -1,
        showType: -1,
        sourceDetailType: -1,
        ...this.getDefaultData()
      }
    }
  },
  created () {
    this.$bus.$on('checkAllBtn-click', (type) => {
      this.checkAll = type;
    });

    this.$bus.$on('reload', () => {
      this.queryList();
    });

    this.queryList();
  },
  computed: {
    checkAll: {
      get () {
        return this.list.length !== 0 && this.selecteds.length === this.list.length;
      },
      set (value) {
        if (value) {
          this.selecteds = this.list;
        } else {
          this.selecteds = [];
        }
      }
    }
  },
  methods: {
    getDefaultData () {
      return {
        startTime: null,
        endTime: null,
        title: '',
        newsId: '',
        authorId: '',
        labelName: '',
        source: ''
      }
    },
    goto (num) {
      this.pageInfo.pageIndex = num;
      this.queryList();
    },
    resetFilterInputs () {
      Object.assign(this.searchFilters, this.getDefaultData());
    },
    queryList () {
      let pageInfo = this.pageInfo;
      let pageSize = pageInfo.pageSize;
      let pageIndex = (pageInfo.pageIndex - 1) * pageInfo.pageSize;

      let ajaxData = { ...this.searchFilters };
      for (let value of SELECT_MAPS) {
        if (ajaxData[value] === -1) {
          ajaxData[value] = '';
        }
      }
      ajaxData = this.$bus.deleteNullProperty(ajaxData);
      fetchMediaListAction(this, {
        params: {
          pageIndex,
          pageSize,
          ...ajaxData
        }
      });
    }
  }
}
</script>

<style scoped>
.list {
  background-color: #ffffff;
  margin-top: 20px;
  padding-bottom: 20px;
}
</style>
