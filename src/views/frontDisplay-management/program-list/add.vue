<!-->添加视频弹框组件以及查询功能视频功能<-->
<style scoped>
  .baseInfo {
    text-align:left;
    margin-bottom:10px;
    margin-left:10px;
  }
  .selectBtn{
    float:right;
    position:relative;
    top:-30px;
    right:130px;
  }
  .selectDetail{
    box-sizing:border-box;
    width:100%;
    height:30px;
  }
  .form-item {
    margin-bottom: 18px;
  }
  .BU_radio{
    margin-right: 20px;
    margin-left: 0 !important;
    margin-top: 10px;
  }
  .totle_radio{
    text-align: left !important;
    margin-top: -10px;
  }
.pagination {
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .cur {
    margin: 0 5px;
    cursor: auto;
    color: #0abbfe;
  }
  span,
  a {
    color: #666;
    display: block;
    padding: 8px 10px;
    border: 1px solid #ccc;
  }
  span {
    margin-right: 5px;
    cursor: pointer;
  }
}
</style>
<template>
  <sn-confirm txt @sure="sure" @close="close" :flag="showFlag" title="添加视频">
    <sn-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" formWidth="880" style="margin:-10px -40px 20px;">
    <sn-form-item label="视频查询" prop="matchLabels" :rules="matchRules" ref="matchLabels" style="margin-left:170px;">
      <sn-autocomplete
        v-model="searchInput"
        valueKey="title"
        :fetchSuggestions="querySearchAsync"
        :isSuggestionsPages="false"
        placeholder="请输入视频ID或视频标题"
        @select="selectItem"
        :isSupportSuggestionsNew="false"
        :width="400">
        <template slot-scope="{item}">
          <div class="match-suggestions__item">
            <span>{{item.id}}</span>
            <span>{{item.title}}</span>
          </div>
        </template>
      </sn-autocomplete>
      <select-area :ruleForm="ruleForm" :selectedLablesItem="selectedLablesItem"></select-area>
    </sn-form-item>   
      <p class="baseInfo"><a href="javascript:void(0)" @click="moreDel">批量删除</a></p>
      <VideoList ref="video" :list="videolist"></VideoList>
    </sn-form>
    <sn-confirm :flag="delConFlag" title="删除内容" @close='closeDel' @sure='MoreDelList' txt noflag>
      确认将删除当前选中内容？
    </sn-confirm>
  </sn-confirm>
</template>

<script>
import _ from 'lodash';
import DI from 'interface';
import * as Constant from 'js/constant';
import VideoList from './videoList'  //添加视频弹框的视频列表组件
export default {
  props: {
    list: {
      type: Array,
      default: function() {
        return {};
      }
    }
  },
  components: {
    VideoList,
  },
  data() {
    return {
      showFlag:false,
      delConFlag:false,
      onDownLine:false,
      selectData:'',
      list:'',
      getVideoList:{
        id:'',
        pageNum:1,
        pageSize:10,
        title:'',
      },
      contentId:'',
      rules() {
        return {
          name: [{
            required: true,
            min: 1,
            max: 10,
            message: '请输入节目名称',
            trigger: 'change'
          }],
          introduction: [{
            required: true,
            min: 1,
            max: 100,
            message: '请输入节目简介',
            trigger: 'change'
          }]
        }
      },
      programId:'',
      searchInput:'',
      selectedLablesItem:null,
      video:[],
      videolist:[],
      title:'123',
    }
  },
  methods: {
    close () {
      this.showFlag = false;
      this.$refs.tag && this.$refs.tag.clearData();
    },
    closeDel(){
      this.delConFlag = false;
    },
    filter () {
      this.subTitle = '节目';
      this.title = (this.programId != "" ? '编辑' : '新建') + this.subTitle;
      this.nameplaceholder = '请输入栏目名称（1-10个字）';
      this.instroduceplaceholder = '请输入栏目名称（1-100个字）';
      this.nameMaxLen = 10;
      this.instroMaxLen = 100;
    },
    sure() {
      this.$ajax({
        url:DI.programList.addProgramContent,
        data: JSON.stringify(this.videolist),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('创建成功');
            this.close();
            this.$parent.goto(1)
          }else{
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      })
    },
    query(){
      this.$refs.video.videoList = this.getVideoList;
      this.querySearchAsync({pageNum:1,pageSize:10});
    },
    select(val){
      var re = /^[0-9]*$/;
      if(re.test(val)){
        this.getVideoList.id = val;
        this.getVideoList.title = "";
      }else{
        this.getVideoList.id = "";
        this.getVideoList.title = val;
      } 
    },
    moreDel(){
      if(this.$refs.video.curSelecteds.length == 0){
        this.$message.error("至少勾选一个视频");
      }else{
        this.delConFlag = true;
      }
    },
    MoreDelList(){
      this.delConFlag = false;
      let list = this.videolist;
      let curSelect = this.$refs.video.curSelecteds;
      for(let i = 0;i<list.length;i++){
        for(let j = 0;j<curSelect.length;j++){
          if(list[i].id == curSelect[j].id){
            list.splice(i,1);
          }
        }
      }
      if(this.videolist.length == 0){
        this.$refs.video.checkAll = false;
      }
    },
    selectItem(item) {
      this.selectedLablesItem = { ...item };
      if((this.videolist).length != 0){
        let list = this.videolist;
        let flag = "";
        for(let i = 0;i<list.length;i++){
          if(list[i].id == item.id){
            flag = 1;
          }
        }
        flag == 1?flag = "":(this.videolist).push(item);
      }else{
        (this.videolist).push(item);
      }
      if(this.videolist.length != this.$refs.video.curSelecteds.length){
        this.$refs.video.checkAll = false;
      }
      this.$message.success("添加视频成功！");
    },
    querySearchAsync(ops,cb) {
      this.select(ops.queryString);
      this.getVideoList.pageNum = ops.pageIndex;
      this.getVideoList.pageSize = ops.pageSize;
      //查询频道列表
      this.$ajax({
        url: DI.programList.getVideoList,
        data: JSON.stringify(this.getVideoList),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            if(res.data && res.data.videoList){
              let resData = res.data.videoList || {};
              for(let item of resData){
                item.term = "";
                item.type = "";
                item.contentCover = "";
                item.contentId = "";
                item.contentLengthTime = "";
                item.contentTitle = "";
                item.programId = this.$parent.programId;
                item.programName = this.$parent.title;
              }
              const matchlist = (resData || {}) || [];
              cb(matchlist);
            }
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },    
  },
};
</script>
