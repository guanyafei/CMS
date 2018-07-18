<!-->节目内容列表组件<-->
<template>
  <div>
    <sn-datatable :data="list" ref="table">
      <sn-datacolumn label="自定义" prop="checkbox" :width="50" :column-border="false">
        <sn-checkbox type="checkbox" v-model="checkAll" @change="handleCheckAllChange"></sn-checkbox>
      </sn-datacolumn>
      <sn-datacolumn label="序号" prop="index" width="5%" sloted>
        <template slot-scope="cell" slot="index">
          {{cell.index+1}}
        </template>
      </sn-datacolumn>        
      <sn-datacolumn label="内容信息" prop="contentTitle" width="30%">
        <template slot-scope="{row}" slot="contentTitle">
          <div>
            <div style="margin-left: 10px;font-size:13px;">ID:{{ row.contentId }}</div> 
            <div style="margin-top: 10px;margin-left: 10px;font-size:13px;">{{ row.contentTitle }}</div> 
          </div>
        </template>
      </sn-datacolumn>
      <sn-datacolumn label="期数" prop="term" width="10%">
      </sn-datacolumn>
      <sn-datacolumn label="类型" prop="type" width="10%">
        <template slot-scope="{row}" slot="type">
          <span v-if="row.type == '1'">正片</span>
          <span v-if="row.type == '2'">花絮</span>
        </template>
      </sn-datacolumn>
      <sn-datacolumn label="视频时长" prop="contentLengthTime" width="10%" :formatter="getVideoTime"x>
      </sn-datacolumn>
      <sn-datacolumn label="更新时间" prop="updateTime" width="12%" >
      </sn-datacolumn>
      <sn-datacolumn label="状态" prop="status" width="10%">
        <template slot-scope="{row}" slot="status">
          <span v-if="row.status == '1'">上线</span>
          <span v-if="row.status == '0'">下线</span>
        </template>
      </sn-datacolumn>
      <sn-datacolumn label="操作" prop="row">
        <template slot-scope="{row}" slot="row">
          <div class="is-column">
            <p class="operate-par" style="margin-bottom:10px;">
              <template>
                <a href="javascript:;" @click="showDelConfirm(row.contentId)">删除</a>
              </template>
              <a href="javascript:;" @click="showEdit(row)">编辑</a>
            </p>
            <p class="operate-par" v-if = "row.type == '2'">
              <a href="javascript:;" @click="showOnOff(row,1)">上移</a>
              <a href="javascript:;" @click="showOnOff(row,2)">下移</a>
            </p>
            <p class="operate-par" v-if = "row.type == '1'">
              <a href="javascript:;" class="disable-link">上移</a>
              <a href="javascript:;" class="disable-link">下移</a>
            </p>
          </div>
        </template>
      </sn-datacolumn>
      <template slot-scope="{row}" slot="checkbox">
        <sn-checkbox type="checkbox" :label="row.contentId" v-model="moreProgramList" @change="delDanContent"></sn-checkbox>
      </template>
    
    <sn-confirm :flag="onDownLine" :title="lineTitle" @close='lineClose' @sure='doBatchLine' txt noflag>
      确认将{{lineTitle}}当前选中内容？
    </sn-confirm>
    <sn-confirm :flag="delConFlag" title="删除内容" @close='close' @sure='doBatchDel' txt noflag>
      确认将删除当前选中内容？
    </sn-confirm>
    <sn-confirm :flag="moredelConFlag" title="删除内容" @close='close' @sure='moredelConDel' txt noflag>
      确认将删除批量当前选中内容？
    </sn-confirm>
    </sn-datatable>
    <Edit ref="edit"></Edit>
  </div>
</template>

<script>
import DI from 'interface';
import * as Constant from 'js/constant';
import Edit from './edit';    //节目内容列表编辑弹框组件

export default {
  name: 'CommentList',
  componentName: 'CommentList',
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
  components: {
    Edit
  },
  data() {
    return {
      delConFlag:false,
      onDownLine:false,
      moredelConFlag:false,
      lineTitle:'',
      statusNum:'',
      pageIndex:1,
      pageSize:20,
      contentIdList:[],//单独删除某条数据
      moreProgramList:[],//批量勾选数据
      moveDataList:'',
      checkAll:Boolean,
    }
  },
  methods: {
    handleCheckAllChange(){
      if(this.checkAll){
        this.moreProgramList = [];
        let vd_list =  this.$parent.list;
        vd_list.forEach((item) => {
          this.moreProgramList.push(item.contentId)
        })
        console.log(this.moreProgramList);
      }else{
        this.moreProgramList = [];
        console.log(this.moreProgramList);
      }

    },
    delDanContent(){
      if(this.moreProgramList.length == this.list.length && this.list.length != 0){
        this.checkAll = true;
      }else if(this.moreProgramList.length == 0){
        this.checkAll = false;
      }else if(this.moreProgramList.length < this.list.length){
        this.checkAll = false;
      }
      console.log(this.moreProgramList);
    },
    doBatchDel () {
      let contentIdList_ = "";
      if(this.contentIdList.length == 1){
        contentIdList_ = this.contentIdList;
      }else if(this.moreProgramList.length > 0){
          contentIdList_ = this.moreProgramList;
      }
      this.delConFlag = false;
      this.$ajax({
        url: DI.programList.deleteProgramContent,
        context: this,
        loadingText: '正在删除，请稍候！',
        data: JSON.stringify({
          contentIdList:contentIdList_,
          programId:this.$parent.programId
        }),
        success: (res) => {
          if (res.retCode == "0") {
            this.contentIdList = [];
            this.moreProgramList = [];
            this.checkAll = false;
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
    doBatchLine(row){
      this.onDownLine = false;
      this.$ajax({
        url: DI.programList.moveProgramContent,
        context: this,
        loadingText: '正在'+this.lineTitle+'，请稍候！',
        data: JSON.stringify(this.moveDataList),
        success: (res) => {
          if (res.retCode == "0") {
            this.$parent.goto(1);
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
      this.delConFlag = false;
      this.contentIdList = [];
      if(this.list.length == 0){
        this.checkAll = false;
      }
    },
    lineClose(){
      this.onDownLine = false;
    },
    moreClose(){
      this.moredelConFlag = false;
    },
    showDelConfirm(id){
      this.contentIdList = [];
      this.delConFlag = true;
      this.contentIdList.push(id);
    },
    showOnOff(row,num){
      this.onDownLine = true;
      num == 1?(this.lineTitle = "上移",this.statusNum = 1):(this.lineTitle = "下移",this.statusNum = 2);
      this.moveDataList = {
        contentId:row.contentId,
        movingState:num,
        programId:this.$parent.programId,
        term:row.term,
        contentTitle:this.$parent.$refs.searchBox.ajaxData.contentTitle
      }
    },
    getVideoTime(time) {
      var theTime = parseInt(time); // 秒
      var theTime1 = 0; // 分
      var theTime2 = 0; // 小时
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60);
        theTime = parseInt(theTime % 60);
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60);
          theTime1 = parseInt(theTime1 % 60);
        }
      }
      var result = '' + parseInt(theTime) + '秒';
      if (theTime1 > 0) {
        result = '' + parseInt(theTime1) + '分' + result;
      }
      if (theTime2 > 0) {
        result = '' + parseInt(theTime2) + '小时' + result;
      }
      return result;
    },
    showEdit(row){
      this.$refs.edit.term = row.term;
      this.$refs.edit.type = row.type;
      this.$refs.edit.contentId = row.contentId;
      (row.type == "1")?(this.$refs.edit.typeTitle = "正片"):(this.$refs.edit.typeTitle = "花絮");
      this.$refs.edit.showFlag = true;
    }
  },

}
</script>

<style scoped>
.cover {
  width: 120px;
  height: 80px;
}
.disable-link {
  color: #ccc;
  &:hover {
    text-decoration: none;
    cursor: default;
  }
}
</style>
