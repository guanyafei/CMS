<template>
  <div id="list">
    <sn-table :data="list" ref="table">
      <sn-table-column width="40" wall="false" tdPaddingRight="5" sloted>
        <template slot-scope="row">
          <sn-checkbox v-model="curSelecteds" :label="row" theme="radio"></sn-checkbox>
        </template>
      </sn-table-column>
      <sn-table-column label="序号" prop="$No" width="8%">
      </sn-table-column>
      <sn-table-column label="封面内容" prop="contentCover" width="15%" sloted>
        <template slot-scope="row">
          <img v-img="{src:getItemCover(row.contentCover)}" :src="getItemCover(row.contentCover)|smallImage" class="cover">
        </template>
      </sn-table-column>
      <sn-table-column label="内容信息" prop="commTitle" width="30%" sloted>
        <template slot-scope="row">
          <column-info :row="row"></column-info>
        </template>
      </sn-table-column>
      <sn-table-column label="所属频道" prop="channelName" width="10%">
      </sn-table-column>
      <sn-table-column label="发表时间" prop="createTime" width="12%" sloted>
        <template slot-scope="row">
          <sn-td-date :time="row.createTime"></sn-td-date>
        </template>
      </sn-table-column>
      <sn-table-column label="展示样式" prop="isBigImg" width="10%" sloted>
        <template slot-scope="row">
          {{
            row.threeFlag === 0 ? "小图" :
            row.threeFlag === 1 ? "大图" :
            "三图"
          }}
        </template>
      </sn-table-column>
      <sn-table-column label="操作" sloted>
        <template slot-scope="row">
          <div class="is-column">
            <column-del :row="row"></column-del>
          </div>
        </template>
      </sn-table-column>
    </sn-table>
    <sn-confirm v-if="viewType==='batchDel'" title="删除内容" @close='close' @sure='doBatchDel' txt noflag>
      确认将删除当前选中内容？
    </sn-confirm>
  </div>
</template>

<script>
import DI from 'interface'
import * as Constant from 'js/constant'
import columnInfo from './column/column-info'
import columnDel from './column/actions/column-del'

export default {
  name: 'CommentList',
  componentName: 'CommentList',
  components: {
    columnInfo,
    columnDel
  },
  props: {
    selecteds: {
      type: Array
    },
    list: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data() {
    return {
      viewType: null
    }
  },
  computed: {
    curSelecteds: {
      get () {
        return this.selecteds;
      },
      set (value) {
        this.$emit('update:selecteds', value);
      }
    }
  },
  watch: {
    curSelecteds (value) {
      this.$emit('update:selecteds', value);
    }
  },
  methods: {
    getItemCover (url) {
      url = url ? url.split(';')[0] : '';
      return url
    },
    batchDelHandle () {
      this.viewType = 'batchDel';
    },
    doBatchDel () {
      this.viewType = null;
      let contentList = this.curSelecteds.reduce((prevArr, elem) => {
        prevArr.push({
          channelId: elem.channelId,
          contentId: elem.contentId,
          contentType: elem.contentType
        });
        return prevArr;
      }, [])
      this.$ajax({
        url: DI.recommend.delContent,
        context: this,
        loadingText: '正在批量删除，请稍候！',
        data: JSON.stringify({
          contentList,
          contentDelFlag: true
        }),
        success: (res) => {
          if (res.retCode == "0") {
            this.$parent.queryList();
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    close () {
      this.viewType = null;
    }
  }
}
</script>

<style scoped>
.cover {
  width: 120px;
  height: 80px;
}
</style>
