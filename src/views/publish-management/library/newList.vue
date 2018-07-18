<style scoped>
   is-disabled{
     color:#b1b1b1;
     cursor:not-allowed;
   }
</style>
<template>
<!-- 已发布-->
  <div id="list">
    <sn-datatable :data="list" :border="true">
      <sn-datacolumn label="资讯基本信息" prop="name" width="30%" alignment="left"></sn-datacolumn>
      <sn-datacolumn label="标签" prop="nlrList" width="15%" alignment="center"></sn-datacolumn>
      <sn-datacolumn label="发布时间" prop="createTime" width="15%" alignment="center"></sn-datacolumn>
      <sn-datacolumn label="上架状态" prop="ccrList" width="10%" alignment="center"></sn-datacolumn>
      <sn-datacolumn label="资讯状态" prop="status" width="10%" alignment="center"></sn-datacolumn>
      <!-- 6261-->
      <sn-datacolumn label="评论数" prop="comments" width="10%" alignment="center">
        <template slot-scope="cell" slot="comments">
          <td-comment :row="cell.row"></td-comment>
        </template>
      </sn-datacolumn>

      <sn-datacolumn label="操作" prop="opt" width="20%" alignment="center"></sn-datacolumn>
      <template slot-scope="cell" slot="name">
        <td-info :row="cell.row"></td-info>
      </template>
      <template slot-scope="cell" slot="nlrList">
        <sn-td-ellipsis :str="getTagStr(cell.value)"></sn-td-ellipsis>
      </template>
      <template slot-scope="cell" slot="createTime">
        <sn-td-date :time="cell.value"></sn-td-date>
      </template>
      <template slot-scope="cell" slot="ccrList">
        <td-channel :data="cell.value"></td-channel>
      </template>
      <template slot-scope="cell" slot="status">
        {{getStatusName(cell.value).name}}
      </template>
      <template slot-scope="cell" slot="opt">
        <div class="btn-group">
          <sn-button type="text" :disabled="getBtnClass(cell.row.status)" @click="handleAppendPublish(cell.row)">追加发布</sn-button>
          <div class="pt-5">
            <sn-button type="text" @click="edit(cell.row)">编辑</sn-button>
          </div>
          <div class="pt-5">
            <sn-button type="text"  @click="del(cell.row)">删除</sn-button>
          </div>
        </div>
      </template>
    </sn-datatable>
    <sn-confirm title="删除资讯" :flag="delInfoFlag" txt @sure="delConfirm" @close="delClose">确定要删除该资讯吗?</sn-confirm>
    <channel-modal ref="channelModal" :viewType.sync="viewType" :close="close" :selectedItem="selectedItem"></channel-modal>
  </div>
</template>
<script>
import DI from 'interface';
import * as Constant from 'js/constant';
import TdInfo from './widgets/tdInfo';
import TdChannel from './widgets/tdChannel';
import ChannelModal from './widgets/channelModal';
import TdComment from './widgets/tdComment';
export default {
  components: {
    TdInfo,
    TdChannel,
    ChannelModal,
    TdComment
  },
  props: {
    list: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data () {
    return {
      list:[],
      delItem: {},
      delInfoFlag: false,
      selectedItem: null,
      viewType: null
    }
  },
  methods: {
    getBtnClass (val) {
      let itemKey = Constant.getItemByValue(Constant.PUBLISH_INFOR_STATUS,val).key;
      if(itemKey == 'hidden'){
        return 'is-disabled';
      }
      return;
    },
    del (row) { //删除
      this.delInfoFlag = true;
      this.delItem = row;
    },
    delConfirm () {
      let pms = {
        newsId: this.delItem.newsId,
        authorId:this.delItem.authorId
      }
      this.$ajax({
        url: DI.news.deleteNews,
        data: JSON.stringify(pms),
        context: this,
        success: (res) => {
          if (res.retCode == '0') {
            this.$parent.goto(1);
            this.delInfoFlag = false;
          } else {
            this.$message.warning('删除失败!');
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    delClose () {
      this.delInfoFlag = false;
    },
    getTagStr (itemList = []) {
      let arr = (itemList || []).reduce((preVal, item) => {
        preVal.push(item.labelName);
        return preVal;
      }, []);
      if (arr && arr.length > 0) {
        return arr.join(' / ');
      }
      return '';
    },
    getStatusName (val) {
      return Constant.getItemByValue(Constant.PUBLISH_INFOR_STATUS, val);
    },
    edit (row) {
      this.$router.push({
          path:`edit`,
          query:{
             id:row.newsId,
             type:row.newsType
          }
      });
    },
    handleAppendPublish (row) { //追加发布
      this.selectedItem = row;
      this.$nextTick(() => {
        this.viewType = 'publish';
      });
      const { newId } = row;
    },
    close () {
      this.selectedItem = null;
      this.viewType = null;
      this.$refs.channelModal && (this.$refs.channelModal.ruleForm.channelSet = []);
    }
  }

}
</script>
