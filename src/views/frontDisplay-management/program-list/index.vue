<!-->节目内容列表主页面<-->
<template>
  <div id="idx" style="margin:-10px;">
    <div class="topReturn">
      <a href="javascript:void(0)" @click="backToPre">←</a>
      <sn-topbar :title="title" style="padding-left:50px;font-size:16px;">
      </sn-topbar>
    </div>
    <search-box ref="searchBox"></search-box>         
    <div class="addline">
        <div class="btn-lf">
          <a href="javascript:void(0)" @click="moreDel">批量删除</a>
        </div>
        <div class="btns">
          <sn-button type="outline" @click="addVideo">添加视频</sn-button>
        </div>
    </div>
    <div class="list">
      <List ref="list" :list="list" ></List>                                 
      <sn-pagination :pageIndex.sync="pageIndex" :total="total" @goto="goto" :size="pageSize"></sn-pagination>
    </div>
    <Add ref="add"></Add>
  </div>
</template>
<script>
import DI from 'interface';
import SearchBox from './searchList';       //节目内容列表上面查询功能组件
import List from './list';                  //节目内容列表组件
import Add from './add';                    //添加视频弹框组件


export default {
  name: 'RecommendContent',
  components: {
    SearchBox,
    List,
    Add
  },
  props:{
    program:{
      type:Object,
      default:{}
    }
  },
  data () {
    return {
      pageIndex: 1,
      selecteds: [],
      list: '',
      total: 0,
      pageSize:20,
      programId:'',
      title:'',
      returnPro:'<'
    }
  },
  methods: {
    backToPre(){
      this.$parent.shownav = true;
      this.$parent.isClick = false;
      this.$parent.getList(1)
      console.log(this.$parent);
    },
    goto (num) {
      this.pageIndex = num;
      this.queryList(num)
    },
    moreDel(){
      if(this.$refs.list.moreProgramList.length == 0){
        this.$message.error("请勾选所删除的选项");
      }else{
        this.$refs.list.delConFlag = true;
      }
    },
    queryList (pageIndex) {
      let ajaxData = {
        contentId:'',
        contentTitle:'',
        programId:this.programId,
        term:'',
        pageIndex: (this.pageIndex - 1) * this.pageSize,
        pageSize:this.pageSize,
      }
      this.$ajax({
        url: DI.programList.queryProgramContentList,
        loadingText: '正在加载内容列表，请稍候！',
        data: JSON.stringify(
          ajaxData
        ),
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            const data = res.data || {};
            this.list = data.programContentList;
            this.$refs.searchBox.termList = data.programTermList;
            this.total = data.contentNum || 0;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    getUrl(){
      let url = window.location.search;
      let arr = url.split("&");
      arr.forEach((item,index) =>{
        index == 0?(this.programId=(item.split("="))[1]):"";
        index == 1?(this.title=(item.split("="))[1]):"";
      })    
      this.$refs.add.programId = this.programId;
      this.$refs.searchBox.ajaxData.programId = this.programId;
      this.goto(1);
    },
    addVideo(){
      this.$refs.add.showFlag = true;
      this.$refs.add.selectData = "";
      this.$refs.add.$refs.video.list = "";
      this.$refs.add.videolist = [];
      this.$refs.add.$refs.video.checkAll = false;
    }
  },
  mounted(){
    //获取url的id和name
    this.programId = this.program.row.programId;
    this.title = this.program.row.name;
    this.goto(1);
  }
}
</script>
<style scoped>
  .topReturn{
    a{
      position:absolute;
      font-size: 26px;
      color: #000;
      left: 30px;
      top: 21px;
    }
  }
  .addline{
    margin-top: 10px;
    background: #fff;
    padding: 10px 0;
    overflow: hidden;
    .btns{
      float: right;
      margin-right:20px;
    }
    .btn-lf{
      float: left;
      margin-left:20px;
      a{
        font-size: 14px;
        color: #1684C2;
        line-height: 18px;
        display: inline-block;
        margin-top: 10px;
      }
    }
  }
</style>
