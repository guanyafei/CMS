
<template>
  <div class="container">
    <sn-table :data='list' ref='table'>
      <sn-table-column label='序号' width='11.67%' sloted>
        <template slot-scope='row'>
          <span>{{ ($parent.pageIndex - 1) * $parent.pageSize + row.$index + 1 }}</span>
        </template>
      </sn-table-column>
      <sn-table-column label='作者ID' width="20%" prop='authorId' align='center'></sn-table-column>
      <sn-table-column label='作者信息' width="34%" align="center" sloted>
        <template slot-scope="row">
          <div class="adv-info">
            <div class="img-wrap">
              <img alt="" class="adv-img" :src="row.headPic || require('../../../assets/default-avator.png')" />
            </div>
            <span class="adv-title">
              <p class="adv-name">{{ row.authorName }}</p>
              <p class="adv-des" :title="row.introduction">{{ row.introduction }}</p>
            </span>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label='作者类型' sloted>
        <template slot-scope="row">
          <div class="authorType">
            <p>{{ getAuthorType(row.userType) }}</p>
            <p>{{ getSettleType(row.settleType) }}</p>
            <p>{{ getShowType(row.showType) }}</p>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label='操作' width="10%" align="center" sloted>
        <template slot-scope="row">
          <div class="is-column">
            <p class="operate-par">
              <a href="javascript:;" @click="showHotDialog(row)">{{ row.hotFlag ? '取消热门' : '推到热门' }}</a>
            </p>
            <p class="operate-par">
              <a v-if="getChangeUpStatus(row)" href="javascript:;" @click="exchange(1, row)">上移</a>
              <a v-if="getChangeDownStatus(row)" href="javascript:;" @click="exchange(2, row)">下移</a>
            </p>
            <p class="operate-par">
              <a v-if="list.length>1 || $parent.pageIndex > 1" href="javascript:;" @click="showInsertIndexConfirm(row)">插入到</a>
            </p>
          </div>
        </template>
      </sn-table-column>
    </sn-table>
    <sn-confirm txt :flag="dialogHotFlag" @sure="sureRecommend" @close="cancelDialog">
      {{ recommendTxt }}
    </sn-confirm>
    <sn-confirm txt :flag="insertIndexFlag" @sure="insertIndexSure('insertIndexForm')" @close="hideInsertIndexConfirm" title="编辑" :hideCancelButton="true" :sureBtnIsShow="false">
      <sn-form :model="insertIndexForm" :rules="rules" ref="insertIndexForm" label-width="80px" formWidth="390">
        <sn-form-item label="插入到" prop="insertIndex">
          <div class="insertItem">
            <sn-input width="290" :maxlength="3" v-model="insertIndexForm.insertIndex"></sn-input>
            <span class="insertText">前</span>
          </div>
        </sn-form-item>
      </sn-form>
      <div>
        <sn-button :style="getInsertStyle" size="mini" type="primary" @click="insertIndexSure('insertIndexForm')">确定</sn-button>
        <sn-button size="mini" @click="hideInsertIndexConfirm">取消</sn-button>
      </div>
    </sn-confirm>
  </div>
</template>
<script>
import * as Constant from 'js/constant'
import { recommendHot, exchangeAuthor, doInsertIndex } from './fetch'
export default {
  props: ['list'],
  data() {
    return {
      recommendTxt: '',
      dialogHotFlag: false,
      insertIndexFlag: false,
      currentSelected: null,
      insertIndexForm: { insertIndex: '' }
    };
  },
  watch: {

  },
  computed: {
    getInsertStyle() {
      let reg = /^[0-9]+$/;
      if (!reg.test(this.insertIndexForm.insertIndex) || this.insertIndexForm.insertIndex == 0 || this.insertIndexForm.insertIndex > 100) {
        return `background-color:#ddd;cursor:not-allowed;margin-right:23px;margin-top:10px;`;
      } else {
        return `background-color:#09BBFE;cursor:pointer;margin-right:23px;margin-top:10px;`;
      }
    },
    rules() {
      return {
        insertIndex: [{
          required: true,
          message: '请输入排序号',
          trigger: 'change'
        }]
      }
    }
  },
  methods: {
    getSettleType(val) {
      return Constant.getItemByValue(Constant.SETTLE_TYPE, val).name;
    },
    getShowType(val) {
      return Constant.getItemByValue(Constant.SHOW_TYPE, val).name;
    },
    getAuthorType(val) {
      return val == 1 ? '内部作者' : '外部作者';
    },
    showHotDialog(row) {
      this.dialogHotFlag = true;
      this.currentSelected = row;
      this.recommendTxt = row.hotFlag ? '确认将所选作者取消热门推荐？' : '确认将所选作者推到热门推荐？';
    },
    cancelDialog() {
      this.dialogHotFlag = false;
      this.currentSelected = null;
    },
    sureRecommend() {
      recommendHot(this, {
        authorId: this.currentSelected.authorId,
        hotFlag: this.currentSelected.hotFlag ? 0 : 1
      }).then(() => {
        this.dialogHotFlag = false;
        this.$message.success('操作成功');
        this.$parent.update();
      });
    },
    getChangeUpStatus(row) {
      return row.$index != 0;
    },
    getChangeDownStatus(row) {
      return row.$index != this.list.length - 1;
    },
    exchange(flag, row) {
      let params = {};
      params = {
        authorId: row.authorId,
        authorName: this.$parent.authorName,
        hotFlag: row.hotFlag,
        movingState: flag,
        settleType: this.$parent.settleType,
        showType: this.$parent.showType
      };
      exchangeAuthor(this, params).then(() => {
        this.$message.success('操作成功');
        this.$parent.update();
      });
    },
    showInsertIndexConfirm(row) {
      this.insertIndexFlag = true;
      this.currentSelected = row;
    },
    hideInsertIndexConfirm() {
      this.insertIndexFlag = false;
      this.currentSelected = null;
      this.$refs.insertIndexForm && this.$refs.insertIndexForm.resetFields();
    },
    insertIndexSure(formName) {
      let reg = /^[0-9]+$/;
      if (!reg.test(this.insertIndexForm.insertIndex) || this.insertIndexForm.insertIndex == 0 || this.insertIndexForm.insertIndex > 100)
        return;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {};
          params = {
            authorId: this.currentSelected.authorId,
            authorName: this.$parent.authorName,
            contentPosition: (this.$parent.pageIndex - 1) * this.$parent.pageSize + this.currentSelected.$index + 1,
            hotFlag: this.$parent.hotFlag,
            insertId: this.insertIndexForm.insertIndex,
            removeAuthorId: this.currentSelected.authorId,
            settleType: this.$parent.settleType,
            showType: this.$parent.showType
          };
          doInsertIndex(this, params).then(() => {
            this.hideInsertIndexConfirm();
            this.$message.success('插入成功');
            this.$parent.update();
          });
        }
      });
    }
  }
}
</script>
<style scoped>
.container {
  .authorType p {
    margin-bottom: 5px;
  }
  .adv-info {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;
    .img-wrap {
      position: relative;
      .id-info {
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 0;
        width: 100%;
        height: auto;
        line-height: 22px;
        color: #fff;
        background: rgba(0, 0, 0, 0.6);
        word-wrap: break-word;
        text-align: center;
      }
      .adv-img {
        display: block;
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
    }
    .adv-title {
      padding-left: 8px;
      line-height: 1.3;
      .adv-name {
        text-align: left;
        line-height: 1.3;
        letter-spacing: 2px;
      }
      .adv-des {
        overflow: hidden;
        text-overflow: ellipsis;
        display: box;
        display: -webkit-box;
        box-orient: vertical;
        /*! autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */
        line-clamp: 3;
        -webkit-line-clamp: 3;
        letter-spacing: 3px;
        line-height: 1.3;
        font-size: 12px;
        color: #999999;
        margin-top: 2px;
        text-align: left;
      }
    }
  }
  a {
    color: #1684c2;
    & + a {
      margin-left: 10px;
    }
    &:hover {
      text-decoration: underline;
    }
  }
  .operate-par {
    padding: 3px 0;
    line-height: 17px;
  }
  .insertItem {
    display: flex;
    align-items: center;
  }
  .insertText {
    margin-left: 5px;
  }
}
</style>
