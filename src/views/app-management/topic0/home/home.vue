<template>
  <div class="topic-home">
    <Header :searchFilters="searchFilters"></Header>
    <List :list="list"></List>
    <sn-pagination
      :pageIndex.sync="pageInfo.pageIndex"
      :total="pageInfo.total"
      :size="pageInfo.pageSize"
      @goto="goto">
    </sn-pagination>
  </div>
</template>

<script>
import { fetchTopicHomeListAction } from '../fetch';
import Header from './header';
import List from './list';
const SELECT_MAPS = ['publishStatus'];

export default {
  name: 'TopicHome',
  componentName: 'TopicHome',
  components: {
    Header,
    List
  },
  data () {
    return {
      searchFilters: {
        publishStatus: -1,
        ...this.getDefaults()
      },
      list: [],
      pageInfo: {
        total: 0,
        pageIndex: 1,
        pageSize: 20
      },
      selectedRow: null
    }
  },
  created () {
    this.$bus.$on()
    this.queryList();
  },
  methods: {
    getDefaults () {
      title: ''
    },
    queryList () {
      const { pageInfo, searchFilters } = this;
      const pageSize = pageInfo.pageSize;
      const pageIndex = (pageInfo.pageIndex - 1) * pageInfo.pageSize;

      let ajaxData = { ...searchFilters };
      for (let value of SELECT_MAPS) {
        if (ajaxData[value] === -1) {
          ajaxData[value] = '';
        }
      }
      ajaxData = this.$bus.deleteNullProperty(ajaxData);
      fetchTopicHomeListAction(this, {
        params: {
          channelName: ajaxData.title,
          status: ajaxData.publishStatus,
          pageIndex,
          pageSize
        }
      });
    },
    goto (num) {
      this.pageInfo.pageIndex = num;
      this.queryList()
    },
    resetFilterInputs () {
      Object.assign(this.searchFilters, this.getDefaultData());
    }
  },

}
</script>
