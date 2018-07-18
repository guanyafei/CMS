<template>
  <div class="video-library">
    <sn-topbar title="视频发布"></sn-topbar>
    <search-box ref="header" :searchFilters="searchFilters" :videoPublishStatusList="videoPublishStatusList"></search-box>
    <list ref="list" :list="list" :searchFilters="searchFilters" :pageIndex="pageIndex" :selecteds.sync="selecteds" :checkAll.sync="checkAll" @getReadyList="getReadyList"></list>
    <!-- <sn-pagination :pageIndex.sync="pageInfo.pageIndex" :total="pageInfo.total" @goto="goto" :size="pageInfo.pageSize"></sn-pagination> -->
  </div>
</template>
<script>
import DI from 'interface';
import SearchBox from './search-box';
import List from './list';
const SELECT_MAPS = ['status', 'createTimeStart', 'createTimeEnd', 'title', 'id'];
export default {
  components: {
    SearchBox,
    List
  },
  data() {
    return {
      selecteds: [],
      list: [],
      pageIndex:1,
      searchFilters: {
        status: -1, // 0=未处理，1=上线,3=下线，4=已删除 替换为→ 0=待处理 1=处理中
        ...this.getDefaultData()
      },
      videoPublishStatusList: [
        {
          key: 'untreated',
          value: 0,
          name: '待处理'
        },
        {
          key: 'treating',
          value: 1,
          name: '处理中'
        }
      ]
    };
  },
  created() {
    this.getReadyList();
    this.$bus.$on('checkAllBtn-click', type => {
      this.checkAll = type;
    });
    this.$bus.$on('reload', () => {
      this.getReadyList();
    });
  },
  computed: {
    checkAll: {
      get() {
        let newList = [];
        this.list.filter(item => {
          if (item.zxStatus != 1) {
            newList.push(item);
          }
        });
        return newList.length !== 0 && this.selecteds.length === newList.length;
      },
      set(value) {
        if (value) {
          this.selecteds = this.list.reduce((arr, item) => {
            if (item.zxStatus != 1) {
              arr.push(item.id);
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
        createTimeEnd: null,
        createTimeStart: null,
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
      this.getReadyList();
    },
  getReadyList(index) {
      let pageSize = 20;
      let pageNum = index ? index : this.pageIndex;
      if(index){
        this.pageIndex = index;
      }
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
        url: DI.publish.getReadyList,
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
