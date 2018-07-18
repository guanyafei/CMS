<template>
  <div id="list">
    <sn-datatable :data="list" :border="true">
      <sn-datacolumn label="资讯基本信息" prop="name" width="30%" alignment="left"></sn-datacolumn>
      <sn-datacolumn label="标签" prop="labelSet" width="20%" alignment="center"></sn-datacolumn>
      <sn-datacolumn label="保存时间" prop="updateTime" width="20%" alignment="center"></sn-datacolumn>
      <sn-datacolumn label="操作" prop="opt" width="30%" alignment="center"></sn-datacolumn>
      <template slot-scope="cell" slot="name">
        <td-draft :row="cell.row"></td-draft>
      </template>
      <template slot-scope="cell" slot="labelSet">
        <sn-td-ellipsis :str="getTagStr(JSON.parse(cell.value))"></sn-td-ellipsis>

      </template>
      <template slot-scope="cell" slot="updateTime">
        <sn-td-date :time="cell.value"></sn-td-date>
      </template>
      <template slot-scope="cell" slot="opt">
        <div class="btn-group">
          <div class="pt-5">
            <sn-button type="text" @click="editDraft(cell.row)">编辑</sn-button>
          </div>
          <div class="pt-5">
            <sn-button type="text" @click="delDraft(cell.row)">删除</sn-button>
          </div>
        </div>
      </template>
    </sn-datatable>
    <sn-confirm title="删除资讯" :flag="delDraftFlag" txt @sure="delDraftConfirm" @close="delDraftClose">确定要删除该条资讯吗?</sn-confirm>
  </div>
</template>
<script>
import TdDraft from './widgets/tdDraft';
import DI from 'interface';
import * as Constant from 'js/constant';

export default {
  props:{
     list: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  components: {
    TdDraft
  },
  data () {
    return {
      list:[],
      delItem: {},
      delDraftFlag: false
    }
  },
  methods: {
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
    delDraft (row) {
      this.delItem = row;
      this.delDraftFlag = true;
    },
    delDraftConfirm () { //删除草稿
      let pms = {
        draftId: this.delItem.draftId,
        authorId:this.delItem.authorId
      }
      this.$ajax({
        url: DI.news.deleteNewsDraft,
        data: JSON.stringify(pms),
        context: this,
        success: (res) => {
          if (res.retCode == '0') {
            this.delDraftFlag = false;
            this.$parent.goto(1);
          } else {
            this.$message.warning('删除失败!');
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    delDraftClose () {
      this.delDraftFlag = false;
    },
    editDraft(row) {
      const key = Constant.getItemByValue(Constant.ARTICLE_TYPE, row.newsType).key;
      this.$router.push({
        path: `${key}`,
        query: {
          id: row.draftId,
          type: row.newsType
        }
      });
    }
  }
}

</script>
