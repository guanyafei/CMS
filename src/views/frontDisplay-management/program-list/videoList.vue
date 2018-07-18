<!-->添加视频弹框的视频列表组件<-->
<template>
  <div class="videoData">
    <sn-datatable :data="list" :border="true">
      <sn-datacolumn label="自定义" prop="checkbox" :width="50" :column-border="false">
        <sn-checkbox type="checkbox" v-model="checkAll" @change="handleCheckAllChanger"></sn-checkbox>
      </sn-datacolumn>
      <sn-datacolumn label="视频信息" prop="list" :width="310" alignment="left">
        <template slot-scope="{row}" slot="list">
          <div class="videoInfo">
            <div class="lfInfo">
              <img :src="row.picUrl"/>
              <div class="title">ID:{{row.id}}</div>
            </div>
            <div class="rgInfo">{{row.title}}</div>
          </div>
        </template>
      </sn-datacolumn>
      <sn-datacolumn label="基础分类" prop="cataName"  width="8%">
      </sn-datacolumn>
      <sn-datacolumn label="视频状态" prop="status" width="8%">
        <template slot-scope="{value}" slot="status">
          <span v-if="value == '1'">上线</span>
          <span v-if="value == '3'">下线</span>
        </template>
      </sn-datacolumn>
      <sn-datacolumn label="发布时间" prop="publishTime" width="10%" :formatter="getPublishTime">
      </sn-datacolumn>
      <sn-datacolumn label="视频时长" prop="duration"  width="8%" :formatter="getVideoTime">
      </sn-datacolumn>
      <sn-datacolumn label="期数" prop="term"  width="12%" :height="200">
        <template slot-scope="{row}" slot="term">
          <div class="labeltrem">
            <sn-input ref="contentId"
            v-model="row.term"
            width="75"
            radius="2"
            placeholder="请输数字"
            :reg="/^\d+$/"
            :maxlength="10"
            :totalWords="10"
            inputType="number"
            :value="row.term"
            required 
            autoValid
            ></sn-input>
            <div class="form-item__error" v-if="flag_error && row.term != ''">未查到该ID的信息，请检查您输入的ID信息</div>
          </div>
        </template>
      </sn-datacolumn>
      <sn-datacolumn label="类型" prop="type" width="10%" >
        <template slot-scope="{row}" slot="type">
        <div class="labeltype">
          <sn-select ref="type"
              v-model="row.type"
              placeholder="请选择"
              radius="2"
              width="70"
              @change="handleTypeChange"
              style="font-size:12px;"class="lineList">
              <sn-option v-for="item in typeList"
                :key="item.key"
                :name="item.name"
                :value="{row:row,type:item.key}"
                :disabled="item.disabled">
              </sn-option>
          </sn-select>
        </div>
        </template>
      </sn-datacolumn>
      <sn-datacolumn label="操作" prop="opt" width="90">
      </sn-datacolumn>
      <template slot-scope="{row}" slot="checkbox">
        <sn-checkbox type="checkbox" :label="row" v-model="curSelecteds" @change="dan"></sn-checkbox>
      </template>
      <template slot-scope="row" slot="opt">
        <div class="is-column">
          <p class="operate-par" style="margin-bottom:10px;">
            <template>
              <a href="javascript:;" @click="showDelConfirm(row)">删除</a>
            </template>
          </p>
        </div>
      </template>
    </sn-datatable>
    <sn-confirm :flag="delConFlag" title="删除内容" @close='close' @sure='doBatchDel' txt noflag>
      确认将删除当前选中内容？
    </sn-confirm>
  </div>
</template>

<script>
import DI from 'interface';
import { formatDate } from 'utils/util';

export default {
  name: 'UserList',
  componentName: 'UserList',
  props: ["list"],
  data(){
    return{
      rules: {
        term: [
          {
            required: true,
            min: 1,
            max: 3,
            message: '请输入数字',
            trigger: 'change'
          }
        ]
      },
      delConFlag:false,
      onDownLine:false,
      videoList:'',
      typeList: [{
        key: '1',
        value: '正片',
        name: '正片'
      },{
        key: '2',
        value: '花絮',
        name: '花絮'
      }],
      type:'',
      termNum:'',
      checkAll:Boolean,
      check:false,
      curSelecteds:[],
      rowData:'',
    }
  },
  methods: {
    close(){
      this.delConFlag = false;
      if(this.curSelecteds.length < this.list.length){
        this.checkAll = false;
      }
    },
    handleCheckAllChanger(){
      if(this.checkAll){
        this.curSelecteds = [];
        let vd_list = this.list;
        vd_list.forEach((item) => {
          this.curSelecteds.push(item)
        })
        console.log(this.curSelecteds)
      }else{
        this.curSelecteds = [];
        console.log(this.curSelecteds)
      }    
    },
    dan(){
      if(this.curSelecteds.length == this.list.length && this.list.length != 0){
        this.checkAll = true;
      }else if(this.curSelecteds.length == 0){
        this.checkAll = false;
      }else if(this.curSelecteds.length < this.list.length){
        this.checkAll = false;
      }
    },
    handleTypeChange(val){
      val.row.type = val.type;
      val.row.contentCover = val.row.picUrl;
      val.row.contentId = val.row.id;
      val.row.contentLengthTime = val.row.duration;
      val.row.contentTitle = val.row.title;
    },
    goto(num) {
      this.pageIndex = num;
      this.getList(num);
    },
    //获取节目列表
    getList(pageIndex) {
      //查询频道列表
      this.$ajax({
        url: DI.programList.getVideoList,
        data: JSON.stringify(this.videoList),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data.videoList || {};
            for(let item of resData){
              item.term = "";
              item.type = "";
              item.contentCover = "";
              item.contentId = "";
              item.contentLengthTime = "";
              item.contentTitle = "";
              item.programId = this.$parent.$parent.programId;
            }
            this.list = resData;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    // 确定删除此节目
    showDelConfirm(row) {
      //显示删除确认框
      this.delConFlag = true;
      this.rowData = row;
      if(this.list.length == 0){
        this.checkAll = false;
      }
    },
    //点击确认按钮删除回调
    doBatchDel(){
      if(this.rowData.row.id){
        this.curSelecteds.forEach((item,index) => {
          if(item.id == this.rowData.row.id){
            this.curSelecteds.splice(index,1);
          }
        })
      }
      (this.list).splice((this.rowData.index),1);
      this.delConFlag = false;
      if(this.list.length == 0){
        this.checkAll = false;
      }
    },
    //点击确认按钮上下线回调
    setIsLine(){
      let ajaxData = {
        programId:this.delProgramlId,
        status:this.status_
      }
      this.$ajax({
        url: DI.programMana.updateProgramState,
        data: JSON.stringify(ajaxData),
        context: this,
        loadingText:"正在"+this.isLineStr+"中，请稍候",
        success: res => {
          if (res.retCode == '0') {
              this.$message.success(this.isLineStr+'成功');
              this.isLineFlag = false;
              this.getList(1);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    //确定上下节目
    DownLineConfirm(status_,programId_) {
      //显示上下线确认框
      this.isLineFlag = true;
      this.delProgramlId = programId_; 
      this.status_ = status_;
      status_ == 1?(this.isLineStr = "上线"):(this.isLineStr = "下线");
    },
    //取消上下线弹框显示
    hideOnOff() {
      //隐藏上下线确认框
      this.isLineFlag = false;
    },
    //隐藏删除弹框显示
    hideDelConfirm() {
      this.delConFlag = false;
    },
    getPublishTime(time) {
      let publishTimeShow = '';
      publishTimeShow = formatDate(time, 'yyyy-MM-dd hh:mm:ss');
      return publishTimeShow;
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
  }
};
</script>

<style scoped>
.videoInfo{
  height:135px;
  .lfInfo{
    position: relative;
    float:left;
    top: 30px;
    img{
      width:120px;
      height:80px;
    }
    .title{
      height:20px;
      position:relative;
      opacity: 0.8;
      background: #333333;
      font-size: 12px;
      color: #FFFFFF;
      line-height:18px;
      top: -20px;
    }
  }
  .rgInfo{
    float:right;
    width:120px;
    height:35px;
    position: relative;
    top: 50px;
  }
}
.info {
  display: flex;
  align-items: center;
  height: 80px;
  .info-img,
  .img-logo {
    width: 80px;
    height: 80px;
    border: 1px solid #eee;
    border-radius: 80px;
  }
  .info-title {
    margin-left: 20px;
    color: #333333;
    font-size: 18px;
  }
}
.disable-link {
  color: #ccc;
  &:hover {
    text-decoration: none;
    cursor: default;
  }
}
.labeltype{
  ul{
    padding:20px;
    li.item{
    font-size: 12px;
    padding: 7px 10px;
    height: 24px;
    margin: -8px 0;
    }
  }
}
.labeltrem input{
    padding:5px 10px !important;
}
</style>
