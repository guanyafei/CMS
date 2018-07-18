<template>
  <div id="idx">
    <sn-topbar title="推荐内容库"></sn-topbar>
    <search-box ref="searchBox" :checkAll="checkAll"></search-box>
    <div class="list">
      <List ref="list" :list="list" :selecteds.sync="selecteds"></List>
      <sn-pagination :pageIndex.sync="pageIndex" :total="total" @goto="goto" :size="20"></sn-pagination>
    </div>
  </div>
</template>
<script>
import DI from 'interface'
import SearchBox from './search-box'
import List from './list'

export default {
  name: 'RecommendContent',
  components: {
    SearchBox,
    List
  },
  data () {
    return {
      pageIndex: 1,
      selecteds: [],
      list: [],
      total: 0
    }
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
  created () {
    let _this = this;

    this.$bus.$on('checkAllBtn-click', (type) => {
      _this.checkAll = type;
    });

    this.$bus.$on('reload', () => {
      this.queryList();
    })
  },
  mounted () {
    this.queryList();
  },
  methods: {
    goto (num) {
      this.pageIndex = num;
      this.queryList()
    },
    queryList () {
      let {
        contentId,
        contentTitle,
        contentType
      } = this.$refs.searchBox.fields,
        pageSize = 20;

      if (contentType === -1) {
        contentType = '';
      }

      let ajaxData = {
        contentId,
        contentTitle,
        contentType
      };
      ajaxData = this.$bus.deleteNullProperty(ajaxData);

      this.$ajax({
        url: DI.recommend.list,
        loadingText: '正在加载内容列表，请稍候！',
        data: JSON.stringify({
          pageIndex: (this.pageIndex - 1) * pageSize,
          pageSize,
          ...ajaxData
        }),
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            document.body.scrollTop = 0;
            const data = res.data || {};
            this.list = (data.contentList || []).map((item, index)=>{
              item.$No = (this.pageIndex - 1) * pageSize + index + 1;
              return item;
            });
            this.total = data.contentCount || 0;
            this.selecteds = [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    }
  }
}
</script>
