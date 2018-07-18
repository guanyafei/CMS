<template>
  <div>
    <sn-topbar title="资讯库"></sn-topbar>
    <Header ref="header" :searchFilters="searchFilters"></Header>
    <div class="list">
      <List ref="list" :list="list" :selecteds.sync="selecteds" :checkAll.sync="checkAll"></List>
      <sn-pagination :pageIndex.sync="pageInfo.pageIndex" :total="pageInfo.total" @goto="goto" :size="pageInfo.pageSize"></sn-pagination>
    </div>
  </div>
</template>
<script>
import { fetchLibraryListAction } from './fetch';
import Header from './header';
import List from './list';
import DI from 'interface';
import Loading from 'components/new-frame/loading';
const SELECT_MAPS = ['status', 'newsType', 'sourceType', 'level', 'authorType', 'buType', 'sourceDetailType'];

export default {
  name: 'library',
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
        status: -1, // 发布状态非必填	number		资讯状态1:已发布2:已隐藏3:已删除
        newsType: -1,// 文章类型非必填	number		文章类型1.图文 2图集 3视频
        sourceType: -1,
        level: -1,	// 星级非必填	number		1:一级 2：二级 3：三级
        authorType: -1,
        buType: -1,
        sourceDetailType: -1,
        ...this.getDefaultData()
      }
    }
  },
  created () {
    this.$bus.$on('checkAllBtn-click', (type) => {
      this.checkAll = type;
    })

    this.$bus.$on('reload', () => {
      this.queryList();
    })
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
  mounted () {
    this.queryList();
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
        source: '',
        authorName: '',
        statffId: '',
        realName: '',
        mobile: ''
      }
    },
    goto (num) {
      this.pageInfo.pageIndex = num;
      this.queryList()
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
      fetchLibraryListAction(this, {
        params: {
          pageIndex,
          pageSize,
          ...ajaxData
        }
      });
    },
    /**
     * 导出列表数据
     */
    exportList () {
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

      download(this);

      /**
       * 通过XMLHttpRequest下载文件
       * @param vm
       */
      function download(vm) {
        let str = '';
        for (let key in ajaxData) {
          str += `${key}=${$.trim(ajaxData[key])}&`
        }
        const url = `/snsis-admin-web${DI.infoLibrary.exportExcel}?${str}`;
        const xhr = new XMLHttpRequest();
        const loadingSymbol = Symbol("loadingSymbol");  //用Symbol以防止多个请求的now相同
        window.loadingInstance[loadingSymbol] = Loading.service({
          fullscreen: true,
          text: '正在导出资讯库列表，请稍候！'
        });

        xhr.open('GET', url, true);
        xhr.responseType = "blob";  // 返回类型blob
        // 定义请求完成的处理函数，请求前也可以增加加载框/禁用下载按钮逻辑
        xhr.onload = function () {
          // 请求完成
          window.loadingInstance[loadingSymbol] && window.loadingInstance[loadingSymbol].close();
          delete window.loadingInstance[loadingSymbol];

          if (this.status === 200) {
            //导出文件失败 返回报错信息
            if (this.response.type == 'application/json') {
              const json = this.response;
              const reader = new FileReader();
              reader.readAsText(json);
              reader.onload = function (e) {
                vm.$message.error(JSON.parse(e.target.result).data);
              }
            }
            //导出文件成功
            else {
              const blob = this.response;
              const reader = new FileReader();
              reader.readAsDataURL(blob);  // 转换为base64，可以直接放入a表情href
              reader.onload = function (e) {
                // 转换完成，创建一个a标签用于下载
                const a = document.createElement('a');
                const date = new Date();
                const str = date.toLocaleDateString().replace(/\//g,"-");
                a.download = `资讯库 ${str}.xlsx`;
                a.href = e.target.result;
                $("body").append(a);
                a.click();
                $(a).remove();
              }
            }
          }else{
            console.error('error')
          }
        };
        // 发送ajax请求
        xhr.send()
      }
    },
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
