<template>
  <div id="idx">
    <sn-topbar title="评论管理" labels="待审核,已审核" ref="topbarTabs" @tab="tabChange"></sn-topbar>
    <Crumb ref="crumb" :checkAll="checkAll" :tabIndex="tabIndex"></Crumb>
    <div class="list">
      <List v-show="tabIndex == 0" ref="list" :list="list" :selecteds.sync="selecteds" :checkAll.sync="checkAll"></List>
      <audited-list v-show="tabIndex == 1" ref="ruditList" :list="list" :selecteds.sync="selecteds" :checkAll.sync="checkAll"></audited-list>
      <sn-pagination :pageIndex.sync="pageIndex" :total="total" @goto="goto" :size="20"></sn-pagination>
    </div>
  </div>
</template>
<script>
import DI from 'interface'
import Crumb from './crumb'
import List from './list'
import AuditedList from './rudited-list'

export default {
  name: 'comment',
  components: {
    Crumb,
    List,
    AuditedList
  },
  data () {
    return {
      pageIndex: 1,
      selecteds: [],
      list: [],
      total: 0,
      tabIndex:0,
      virtualUserList:[]
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
      this.queryList(this.pageIndex);
    })
    //马甲库用户
    this.loadVirtualUserList();
  },
  mounted () {
    this.queryList();
  },
  methods: {
    goto (num) {
      this.queryList(num)
    },
    //待审核已审核查询,默认待审核
    queryList (pageNo = this.pageIndex,isAuditParams = 0) {
      isAuditParams = this.tabIndex;
      let {
        startTime,
        endTime,
        commContent,
        contentTitleId,
        contentTitle,
        soaUserId,
        userId,
        commStatus,
        commSource,
        contentTitleType
      } = this.$refs.crumb.fields,
        pageSize = 20;

      if (commStatus === -1) {
        commStatus = '';
      }

      if (commSource === -1) {
        commSource = '';
      }

      if (contentTitleType === -1) {
        contentTitleType = '';
      }

      let ajaxData = {
        startTime,
        endTime,
        contentTitleId,
        commContent,
        soaUserId,
        userId,
        contentTitle,
        commStatus,
        commSource,
        contentTitleType,
        auditFlg:isAuditParams//审核待审核
      };
      ajaxData = this.$bus.deleteNullProperty(ajaxData);
      this.$ajax({
        url: DI.commentLibrary.list,
        loadingText: '正在加载评论列表，请稍候！',
        data: JSON.stringify({
          pageIndex: (pageNo - 1) * pageSize,
          pageSize,
          ...ajaxData
        }),
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            this.pageIndex = pageNo;
            document.body.scrollTop = 0;
            const data = res.data || {};
            this.list = data.commentList || [];
            this.total = data.totalCount;
            this.selecteds = [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    //加载马甲库用户,用于回复操作
    loadVirtualUserList(){
      this.$ajax({
        url: DI.g_comment.queryUsers,
        context: this,
        loadingText: '',
        success: res => {
          if (res.retCode == '0') {
            this.virtualUserList = res.data.virtualUserList || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    tabChange(index){
      this.tabIndex = index;
      this.$refs.crumb.isAudit = !index ? true : false; //显示待审核或审核
      this.queryList(1,index);
    }
  }
}
</script>

<style scoped>
.list {
  background-color: #FFFFFF;
  margin-top: 20px;
  padding-bottom: 20px;
}
</style>
<style>
.nav-box .labels .item.active{
  color: #0abbfe;
}
</style>
