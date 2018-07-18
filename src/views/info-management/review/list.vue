<template>
  <div id="list">
    <sn-table :data="list" ref="table">
      <sn-table-column width="40" wall="false" tdPaddingRight="5" sloted>
        <template slot-scope="row">
          <sn-checkbox v-model="selecteds" :label="row.id" theme="radio"></sn-checkbox>
        </template>
      </sn-table-column>
      <sn-table-column label="资讯基本信息" align="left" width="30%" tdPaddingLeft="0" sloted>
        <template slot-scope="row">
          <td-info :row="row"></td-info>
        </template>
      </sn-table-column>
      <sn-table-column label="作者" prop="authorName" width="10%" sloted>
        <template slot-scope="row">
          <sn-td-author :row="row" authorType></sn-td-author>
        </template>
      </sn-table-column>
      <sn-table-column label="标签" prop="nlrList" width="8%" sloted>
        <template slot-scope="row">
          <sn-td-ellipsis :str="getTagStr(row.nlrList)"></sn-td-ellipsis>
        </template>
      </sn-table-column>
      <sn-table-column label="文章来源" prop="sourceType" width="10%" sloted>
        <template slot-scope="row">
          {{row.sourceType==undefined?"暂无":getSourceItem(row.sourceType).name}}
        </template>
      </sn-table-column>
      <sn-table-column label="展示样式" prop="level" width="8%" sloted>
        <template slot-scope="row">
          <div>{{getItemImgName(row.isBigImg)}}</div>
        </template>
      </sn-table-column>
      <sn-table-column label="发表时间" prop="newsCreateTime" width="9%" sloted>
        <template slot-scope="row">
          <sn-td-date :time="row.newsCreateTime"></sn-td-date>
        </template>
      </sn-table-column>
      <sn-table-column label="报名时间" prop="contentCreateTime" width="9%" sloted>
        <template slot-scope="row">
          <sn-td-date :time="row.contentCreateTime"></sn-td-date>
        </template>
      </sn-table-column>
      <sn-table-column label="星级" prop="level" width="8%" sloted>
        <template slot-scope="row">
          <div>{{getItemStarName(row.level)}}</div>
        </template>
      </sn-table-column>
      <sn-table-column label="操作" sloted>
        <template slot-scope="row">
          <div class="btn-group">
            <button @click.stop="handleEditClick(row)">编辑</button>
            <div class="pt-5">
              <button @click.stop="handleAccesClick(row.id)">审核通过</button>
            </div>
            <div class="pt-5">
              <button @click.stop="handleRefuseClick(row.id)">驳回</button>
            </div>
          </div>
        </template>
      </sn-table-column>
    </sn-table>
    <refuse-confirm :viewType="viewType" ref="refuseConfirm"></refuse-confirm>
    <sn-confirm v-if="viewType=='access'||viewType=='batchAccess'" title="审核通过" @close="close" @sure="confirmAccess" txt noflag>
      确认审核通过吗？
    </sn-confirm>
  </div>
</template>

<script>
import DI from 'interface'
import * as Constant from 'js/constant'
import { getInfoPreviewUrl } from 'src/utils/envUrl'
import TdInfo from './td/tdInfo'
import RefuseConfirm from 'widgets/tdActions/refuseConfirm'

export default {
  name: 'ReviewList',
  components: {
    TdInfo,
    RefuseConfirm
  },
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data: () => ({
    viewType: "",
    selecteds: [],
    approveDate: {},
    starList: Constant.STAR_LEVEL,
    articleList: Constant.ARTICLE_TYPE
  }),
  mounted() {
    const _self = this;
    this.$nextTick(() => {
      this.$bus.$on("review-checkAll", () => {
        let checks = (_self.list || []).reduce((perVal, val) => {
          perVal.push(val.id);
          return perVal;
        }, []);
        _self.selecteds = [...checks];
      })

      this.$bus.$on("review-uncheckAll", () => {
        _self.selecteds = [];
      })
    })

  },
  watch: {
    selecteds() {
      if (this.selecteds.length === this.list.length && this.selecteds.length !== 0) {
        this.$bus.$emit("review-checkAllStatus", true);
      } else if (this.selecteds.length + 1 === this.list.length) {
        this.$bus.$emit("review-checkAllStatus", false);
      }
      if (this.selecteds.length == 0) {
        this.$bus.$emit("review-checkAllStatus", false);
      }
    }
  },
  methods: {
    getTagStr(list = []) {
      let arr = (list || []).reduce((perVal, val)=>{
        perVal.push(val.labelName);

        return perVal;
      },[]);

      if (arr && arr.length > 0) {
        return arr.join(' / ');
      }
      return '';
    },
    getSourceItem(val) {
      return Constant.getItemByValue(Constant.SOURCE_TYPE, val);
    },
    getItemImgName(val) {
      return Constant.getItemByValue(Constant.INFO_IMAGE_TYPE, val).name;
    },
    getItemStarName(val) {
      return Constant.getItemByValue(Constant.STAR_LEVEL, val).name;
    },
    handleAccesClick(id) {
      this.viewType = "access";
      this.approveDate.idList = [id];
    },
    handleRefuseClick(id) {
      this.viewType = "refuse";
      this.approveDate.idList = [id];
    },
    handleEditClick(row) {
      this.$bus.bodyScrollTop = document.body.scrollTop;
      this.$bus.$emit('gotoEdit', row)
    },
    batchHandle(type) {
      this.viewType = type;
      this.approveDate.idList = [...this.selecteds];
    },
    confirmAccess() {
      this.approveDate = {
        ...this.approveDate,
        rejectReason: "",
        status: Constant.getItemByKey(Constant.APPROVE_ACTION, "access").value
      }

      this.approve();
    },
    confirmRefuse(rejectReason) {
      this.approveDate = {
        ...this.approveDate,
        rejectReason,
        status: Constant.getItemByKey(Constant.APPROVE_ACTION, "refuse").value
      }

      this.approve(this.viewType);
    },
    approve(viewType) {
      this.approveDate = this.$bus.deleteNullProperty(this.approveDate);

      this.viewType = null;
      this.$ajax({
        url: DI.infoReview.approve,
        data: JSON.stringify({
          ...this.approveDate
        }),
        laodingText: '正在审核资讯，请稍候！',
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            //清空状态
            this.$nextTick(() => {
              this.approveDate = {};
              this.rejectReason = {};
              this.reasonKey = "";
              this.selecteds = [];

              //弹框字段清空
              this.$refs.refuseConfirm.reasonKey = '';
              this.$refs.refuseConfirm.reason = '';
            })
            this.$bus.$emit("review-checkAllStatus", false);
            this.$bus.$emit("syncCurPage",1);

            this.$parent.queryList();
          } else {
            this.viewType = viewType;
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          this.viewType = viewType;
          console.log("error");
        }
      });
    },
    close() {
      this.viewType = null;
    }
  },
};
</script>

<style scoped>
.text-gray {
  line-height: 21px;
  color: #666666;
}

button {
  color: #0ABBFE;
}

.btn-group {
  height: 50px;
}
</style>
