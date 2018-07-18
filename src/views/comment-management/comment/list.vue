<template>
<!-- 待审核-->
  <div id='list'>
    <sn-datatable :data="list" :border="true">
      <sn-datacolumn label="自定义" prop="checkbox" width="2%" :column-border="false">
        <sn-checkbox type="checkbox" v-model="checkAll" @change="handleCheckAllChange"></sn-checkbox>
        <template slot="checkbox" slot-scope="cell">
          <sn-checkbox type="checkbox" :label="cell.row" v-model="curSelecteds"></sn-checkbox>
        </template>
      </sn-datacolumn>
      <sn-datacolumn label="评论ID" prop="commId" width="5%" alignment="center"></sn-datacolumn>
      <sn-datacolumn label="评论内容" prop="commContent" width="20%" alignment="center">
        <template slot-scope="cell" slot="commContent">
          <column-content :row="cell.row">
            <template slot="desc">
                <div v-html="fmtComment(cell.row)" :title="(cell.row.replyComment && cell.row.replyComment.commContent) || (cell.row.parentComment && cell.row.parentComment.commContent)" style="display:inline;">
            </div>
            </template>
          </column-content>
        </template>
      </sn-datacolumn>
      <sn-datacolumn label="内容信息" prop="commTitle" width="10%" alignment="center">
        <template slot-scope="cell" slot="commTitle">
          <column-info :row="cell.row"></column-info>
        </template>
      </sn-datacolumn>
      <sn-datacolumn label="发表时间" prop="createTime" width="10%" alignment="center">
        <template slot-scope="cell" slot="createTime">
            <p>{{fmtDisplayDateTime(cell.row.createTime).date}}</p>
            <p class="mt-5">{{fmtDisplayDateTime(cell.row.createTime).time}}</p>
        </template>
      </sn-datacolumn>
      <sn-datacolumn label="评论人" prop="userId" width="10%" alignment="center">
        <template slot-scope="cell" slot="userId">
          <div>
            <div>{{`ID:${cell.row.userId}`}}</div>
            <div class="mt-5">{{cell.row.userNickName}}</div>
            <div class="day mt-5" v-show="getBanItem(cell.row.forbiddenStatus).key!=='normal'">
              <sn-button type="warning">
                {{
                  getBanItem(cell.row.forbiddenStatus).key === "forever"?
                  getBanItem(cell.row.forbiddenStatus).name
                  :
                  `禁言剩余${cell.row.forbiddenDays}天`
                }}
              </sn-button>
            </div>
          </div>
        </template>
      </sn-datacolumn>
      <sn-datacolumn label="审核状态" prop="isAudit" width="5%" alignment="center">
        <template slot-scope="cell" slot="isAudit">
          <div>{{cell.row.isAudit ? '已审核' : '待审核'}}</div>
        </template>
      </sn-datacolumn>
      <sn-datacolumn label="显示状态" prop="commStatus" width="5%" alignment="center">
        <template slot-scope="cell" slot="commStatus">
          <div>{{getStatusItem(cell.row.commStatus).name}}</div>
        </template>
      </sn-datacolumn>
      <sn-datacolumn label="评论来源" prop="commSource" width="5%" alignment="center">
        <template slot-scope="cell" slot="commSource">
          <div>{{getSourceItem(cell.row.commSource).name || "前台评论"}}</div>
        </template>
      </sn-datacolumn>
      <sn-datacolumn label="操作" prop="opt" width="6%" >
        <template slot-scope="cell" slot="opt">
          <div class="is-column" :key="cell.row.commId">
            <!-- 审核通过-->
            <audit-option :row="cell.row"></audit-option>
            <toggle-hide :row="cell.row"></toggle-hide>
            <reply :row="cell.row"></reply>
            <toggle-forbidden :row="cell.row"></toggle-forbidden>
            <!-- <edit-like :row="cell.row"></edit-like> -->
          </div>
        </template>
      </sn-datacolumn>
    </sn-datatable>
  </div>
</template>

<script>
import DI from 'interface';
import * as Constant from 'js/constant';
import { findSensitive } from 'js/filters'
import columnContent from './column/column-content';//评论内容
import columnInfo from './column/column-info';//内容信息
import ToggleHide from './column/actions/toggle-hide';//隐藏
import ToggleForbidden from './column/actions/toggle-forbidden';//禁言
// import EditLike from './column/actions/edit-like';
import AuditOption from './column/actions/audit-option'//审核
import Reply from './column/actions/reply' //回复
export default {
  name: 'CommentList',
  componentName: 'CommentList',
  components: {
    columnContent,
    columnInfo,
    ToggleHide,
    ToggleForbidden,
    // EditLike,
    AuditOption,
    Reply
  },
  props: {
    selecteds: {
      type: Array
    },
    list: {
      type: Array,
      default: function() {
        return [];
      }
    },
    checkAll:Boolean
  },
  data() {
    return {
      viewType: null
    };
  },
  computed: {
    curSelecteds: {
      get() {
        return this.selecteds;
      },
      set(value) {
        this.$emit('update:selecteds', value);
      }
    }
  },
  watch: {
    curSelecteds(value) {
      this.$emit('update:selecteds', value);
    }
  },
  methods: {
    //格式化评论,分类父级与引用
    fmtComment(row){
      let fmt = '',len = 0;
        if(row.replyComment){//引用
          len = row.replyComment.commContent.length;
          fmt = row.replyComment.commContent;
          if(row.commImgList && row.commImgList.length){
            if(len > 50){
              fmt = `${fmt.substr(0,50)}...`; 
            }
          }else{
            if(len > 100){
              fmt = `${fmt.substr(0,100)}...`; 
            }
          }
          return  `//<span style="color:#0abbfe">${row.replyComment.userNickName || '匿名用户'}: </span>${row.replyComment.commImgList && row.replyComment.commImgList.length ? '[图片]':''}${findSensitive(fmt)}`;
        }
        if(row.parentComment){//父级
          len = row.parentComment.commContent.length;
          fmt = row.parentComment.commContent;
          if(row.commImgList && row.commImgList.length){
            if(len > 50){
              fmt = `${fmt.substr(0,50)}...`; 
            }
          }else{
            if(len > 100){
              fmt = `${fmt.substr(0,100)}...`; 
            }
          }
          return  `//<span style="color:#0abbfe">${row.parentComment.userNickName || '匿名用户'}: </span>${row.parentComment.commImgList && row.parentComment.commImgList.length ? '[图片]':''}${findSensitive(fmt)}`;
        }
        return '';
    },
    getBanItem(val) {
      return Constant.getItemByValue(Constant.BANNED_STATUS, val);
    },
    getStatusItem(val) {
      return Constant.getItemByValue(Constant.COMMENT_STATUS, val);
    },
    getSourceItem(val) {
      return Constant.getItemByValue(Constant.COMMENT_SOURCE_TYPE, val);
    },
    handleCheckAllChange(event) {
      this.$emit('update:checkAll', event.target.checked);
    },
    fmtDisplayDateTime(dateTime){
        if(!dateTime){
            return '-';
        }
        dateTime = dateTime.split(' ');
        return {date:dateTime[0],time:dateTime[1]}
    }
  }
};
</script>

<style scoped>
.btn-group {
  height: 50px;
}
.text-gray {
  color: #666;
}
</style>
<style>
 .day{
     .sn-button.sn-button--warning{
         padding-right:5px !important;
         padding-left:5px !important;
     }
 }
</style>