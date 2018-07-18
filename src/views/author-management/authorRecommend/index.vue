<style scoped>
  .title {
    justify-content: left;
  }
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
  }
  .ibox {
    display: flex;
    align-items: center;
    min-height: 72px;
    padding: 0 20px;
    background: #fff;
    margin: 10px 0;
    &.between {
      justify-content: space-between;
    }
    .search-box {
      max-width: 600px;
      .input-box {
        display: flex;
        align-items: center;
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
    <sn-topbar class="title" labels="作者管理,分类管理" @tab="libraryChange" :index="libraryIndex"></sn-topbar>
    <div class="navbox" v-show="libraryIndex==0">
      <div class="nav">
        <div class="topbar">
          <div class="input-box">
            <span>作者类型</span>
            <sn-topbar type="button" :labels="authorLabels" @tab="typeChange" :index="typeIndex"></sn-topbar>
          </div>
        </div>
        <section class="ibox between">
          <div class="search-box">
            <div class="input-box">
              <span>作者名称</span>
              <sn-input width="178" radius="16" :maxlength="30" placeholder="请输入主题名称" v-model="authorName"></sn-input>
            </div>
            <div class="input-box">
              <span>作者ID</span>
              <sn-input width="178" radius="16" :maxlength="30" placeholder="请输入主题ID" v-model="authorId"></sn-input>
            </div>
            <div class="typewrap" v-show="hotFlag">
              <div class="input-box">
                <span>展示类型</span>
                <sn-select v-model="showTypeSelect" placeholder="全部" radius="16" width="120" @change="handleShowType">
                  <sn-option name='全部' value=''></sn-option>
                  <sn-option v-for="item in showTypeList" :key="item.value" :name="item.name" :value="item.value">
                  </sn-option>
                </sn-select>
              </div>
              <div class="input-box">
                <span>结算类型</span>
                <sn-select v-model="settleType" placeholder="全部" radius="16" width="120" @change="handleSettleType">
                  <sn-option name='全部' value=''></sn-option>
                  <sn-option v-for="item in settleTypeList" :key="item.value" :name="item.name" :value="item.value">
                  </sn-option>
                </sn-select>
              </div>
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
    <div v-show="libraryIndex==0">
      <List :list="list" ref="list" />
      <sn-pagination ref="pageTurn" :total="dataTotal" :size="pageSize" @goto="goto" />
    </div>
    <type-list :list="authorTypeListClone" v-show="libraryIndex==1"></type-list>
    <sn-toptip></sn-toptip>
  </div>
</template>
<script>
import _ from 'lodash'
import * as Constant from 'js/constant'
import List from './list'
import TypeList from './typeList'
import { getAuthorList, getAuthorTypeList } from './fetch'

export default {
  data() {
    return {
      libraryIndex: 0,
      typeIndex: 0,
      authorId: '',
      authorName: '',
      list: [],
      pageIndex: 1,
      pageSize: 20,
      dataTotal: 0,
      showType: '',
      showTypeSelect: '',
      settleType: '',
      authorLabels: '',
      authorTypeList: [],
      hotFlag: '',
      showTypeList: Constant.SHOW_TYPE, // 展示类型
      settleTypeList: Constant.SETTLE_TYPE // 结算类型
    }
  },
  components: {
    List,
    TypeList
  },
  mounted() {
    this.getAuthorTypeList();
  },
  methods: {
    reset() {
      this.authorName = '';
      this.authorId = '';
      this.showTypeSelect = '';
      this.settleType = '';
      this.update();
    },
    libraryChange(i) {
      this.libraryIndex = i;
      if (i == 0) {
        this.typeIndex = 0;
        this.getAuthorTypeList();
      }
    },
    typeChange(i) {
      if (this.typeIndex == i) return;
      this.showTypeSelect = '';
      this.typeIndex = i;
      this.hotFlag = this.authorTypeList[i].displayTypeId == 0 ? 1 : 0;
      this.showType = this.authorTypeList[i].displayTypeId;
      this.update();
    },
    goto(num) {
      this.pageIndex = num;
      this.getList(num);
    },
    handleShowType(val) {
      this.showTypeSelect = val;
      this.update();
    },
    handleSettleType(val) {
      this.settleType = val;
      this.update();
    },
    update() {
      this.pageIndex = 1;
      this.$bus.$emit('syncCurPage', 1);
      this.getList(1);
    },
    getAuthorTypeList() {
      getAuthorTypeList(this, {}).then(res => {
        this.authorTypeList = (res.authorClassifiedList || []).filter(item => { return item.status == 1; });
        this.authorTypeListClone = _.cloneDeep(res.authorClassifiedList || []);
        this.hotFlag = this.authorTypeList[0].displayTypeId == 0 ? 1 : 0;
        this.showType = this.authorTypeList[0].displayTypeId;
        this.authorLabels = this.authorTypeList.reduce((str, val) => {
          str.push(val.systematicName);
          return str;
        }, []).toString();
        this.getList(1);
      });
    },
    getList(pageIndex) {
      let params = {};
      params = {
        pageIndex: (pageIndex - 1) * this.pageSize,
        pageSize: this.pageSize,
        authorId: this.authorId,
        authorName: this.authorName,
        settleType: this.hotFlag ? this.settleType : '',
        showType: this.showTypeSelect ? this.showTypeSelect : this.showType,
        hotFlag: this.hotFlag
      };
      getAuthorList(this, params).then(res => {
        this.list = res.authorList || [];
        this.dataTotal = res.authorListNum || 0;
      });
    },
  }
}
</script>
