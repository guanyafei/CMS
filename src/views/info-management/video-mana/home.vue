<template>
  <div class="video-library">
    <sn-topbar title="视频管理"></sn-topbar>
    <Header ref="header" :searchFilters="searchFilters"></Header>
    <list ref="list" :list="list" :searchFilters="searchFilters" :pageIndex="pageIndex" :selecteds.sync="selecteds" :checkAll.sync="checkAll"></list>
  </div>
</template>
<script>
import Header from './header';
import List from './list';
import DI from 'interface';
const SELECT_MAPS = ['status', 'publishTimeEnd', 'publishTimeStart', 'title', 'id'];
export default {
  components: {
    Header,
    List
  },
  data() {
    return {
      selecteds: [],
      list: [],
      pageIndex: 1,
      searchFilters: {
        status: -1, // 0=未处理，1=上线,3=下线，4=已删除
        ...this.getDefaultData()
      }
    };
  },
  created() {
    this.queryList();
    this.$bus.$on('checkAllBtn-click', type => {
      this.checkAll = type;
    });
    this.$bus.$on('reload', () => {
      this.queryList();
    });
  },
  computed: {
    checkAll: {
      get() {
        let availAllList = this.list.reduce((arr, item) => {
          if (item.newsId) {
            arr.push(item.newsId);
          }
          return arr;
        }, []);
        return this.list.length !== 0 && this.selecteds.length === availAllList.length;
      },
      set(value) {
        if (value) {
          this.selecteds = this.list.reduce((arr, item) => {
            if (item.newsId) {
              arr.push(item.newsId);
            }
            return arr;
          }, []);
        } else {
          this.selecteds = [];
        }
      }
    }
  },
  methods: {
    getDefaultData() {
      return {
        publishTimeEnd: null,
        publishTimeStart: null,
        title: '',
        id: '',
        cataIds: ''
      };
    },
    resetFilterInputs() {
      this.searchFilters = {
        status: -1, // 0=未处理，1=上线,3=下线，4=已删除
        ...this.getDefaultData()
      };
    },
    goto(num) {
      this.pageIndex = num;
      this.queryList();
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
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    }
  }
};
</script>
