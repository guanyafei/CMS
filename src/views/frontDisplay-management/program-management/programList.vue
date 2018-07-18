<template>
  <div>
    <sn-table :data="list" ref="table">
      <sn-table-column label="节目信息" width="30%" sloted>
        <template slot-scope="row">
          <div>
            <div style="margin-left: 10px;font-size:13px;">ID:{{ row.programId }}</div>
            <div style="margin-top: 10px;margin-left: 10px;font-size:13px;">{{ row.name }}</div>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label="标签" prop="labelList" width="20%" sloted>
        <template slot-scope="row">
          <div v-for="(item,index) in row.labelList" :key="index">
            <div style="margin-right:10px">{{item.labelName}}</div>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label="状态" prop="status" width="10%" sloted>
        <template slot-scope="row">
          <span v-if="row.status == '1'">上线</span>
          <span v-if="row.status == '0'">下线</span>
        </template>
      </sn-table-column>
      <sn-table-column label="更新时间" prop="updateTime" width="15%" sloted>
        <template slot-scope="row">
          <sn-td-date :time="row.updateTime"></sn-td-date>
        </template>
      </sn-table-column>
      <sn-table-column label="视频数量" prop="contentNum" width="10%" sloted>
        <template slot-scope="row">
          <a href="javascript:void(0)" target="_self" @click="changeUrl">
          <span>{{row.contentNum}}</span>
          </a>
        </template>
      </sn-table-column>
      <sn-table-column label="操作" sloted>
				<template slot-scope="row">
					<div class="is-column">
						<a href="javascript:;" @click="edit(row)">编辑</a>
						<br>
              <a v-if="row.status == '1'" class="disable-link" href="javascript:;">删除</a>
              <a v-else href="javascript:;" @click="showDelConfirm(row.programId)">删除</a>
            <br>
            <a v-if="row.status == '1'" @click="DownLineConfirm(0,row.programId)" href="javascript:;">下线</a>
            <a v-else @click="DownLineConfirm(1,row.programId)" href="javascript:;">上线</a>
					</div>
				</template>
      </sn-table-column>
    </sn-table>
    <sn-pagination ref="pageTurn" :total="dataTotal" :size="pageSize" @goto="goto" />
    <sn-confirm txt ref="delConfirm" :flag="delConFlag" @sure="delPrograml()" @close="hideDelConfirm">
      确定要删除吗？
    </sn-confirm>
    <sn-confirm txt ref="shelveConfirm" :flag="isLineFlag" @sure="setIsLine()" @close="hideOnOff">
      确定要{{isLineStr}}吗？
    </sn-confirm>
  </div>
</template>

<script>
import DI from 'interface';
import * as Constant from 'js/constant';
const DEFAULT_SILENCE_DAYS = 1;

export default {
  name: 'UserList',
  componentName: 'UserList',
  props: {
    list: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data(){
    return {
      pageIndex: 1,
      pageSize: 20,
      dataTotal: 0,
      isLineStr:'',//确定上下线的字符
      delConFlag:false,//删除弹框是否显示
      isLineFlag:false, //上下线弹框是否显示
      delProgramlId:'',//每次删除某项ProgramId
      status:'',//需要上下线某项ProgramId
      programId_:'',//获取某条porgramID
      programName:'',//获取某条节目名称
      proId:'',
      title:''
    }
  },
  methods: {
    changeView(viewType) {
      this.$emit('change-view', viewType);
    },
    changeUrl(){
      this.proId = 1;
      this.title = "222"
      this.changeView('ProgramContent');
    },
    getTagStr(str) {
      if (str) {
        return str.split(',').join(' / ');
      }
      return '';
    },
    goto(num) {
      this.pageIndex = num;
      this.getList(num);
    },
    //获取节目列表
    getList(pageIndex) {
      //查询频道列表
      let ajaxData = {
        programId: '',
        programName: '',
        pageIndex: (pageIndex - 1) * this.pageSize,
        pageSize: this.pageSize,
        status: ''
      };
      this.$ajax({
        url: DI.programMana.queryProgramList,
        data: JSON.stringify(ajaxData),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            this.list = resData.programList || [];
            this.dataTotal = resData.programNum || 0;
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
    showDelConfirm(programId) {
      //显示删除确认框
      this.delConFlag = true;
      this.delProgramlId = programId;
    },
    //点击确认按钮删除回调
    delPrograml(){
      let ajaxData = {
        programId:this.delProgramlId
      }
      this.$ajax({
        url: DI.programMana.deleteProgram,
        data: JSON.stringify(ajaxData),
        context: this,
        loadingText:"正在删除中，请稍候",
        success: res => {
          if (res.retCode == '0') {
              this.$message.success('删除成功');
              this.delConFlag = false;
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
    edit(row){
      this.$parent.$refs.add.programId = row.programId;
      this.$parent.$refs.add.ruleForm = {
        name:'',
        introduction:'',
        labelList:[]
      };
      this.$parent.$refs.add.showFlag = true;
      this.$parent.$refs.add.getInitLabel();
      this.$parent.$refs.add.filter();
      this.programId_ = row.programId;
      this.$parent.$refs.add.formData.BU = "";
      this.$parent.$refs.add.formData.infoCol = "";
      this.$parent.$refs.add.formData.sport = "";
      this.$parent.$refs.add.formData.match = "";
      this.getProDetail();
    },
    //获取单条节目的详情
    getProDetail() {
      //查询频道列表
      let ajaxData = {
        programId: this.programId_,
        programName: '',
        pageIndex: 0,
        pageSize: 20,
        status: ''
      };
      //查询频道列表
      this.$ajax({
        url: DI.programMana.queryProgramList,
        data: JSON.stringify(ajaxData),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || {};
              this.$parent.$refs.add.ruleForm.name = resData.programList[0].name;
              this.$parent.$refs.add.ruleForm.introduction = resData.programList[0].introduction;
              //查询详情进行回写
              this.getLabelDetail(resData.programList[0].labelList);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    //执行查询详情进行回写
    getLabelDetail(labelData){
      labelData.forEach((item,index) => {
        if(item.labelType == "2"){
          this.$parent.$refs.add.formData.infoCol=item.labelName;
          this.$parent.$refs.add.label_info = {
            labelId:item.labelId,
            labelLogo:'',
            labelName:item.labelName,
            labelType:2
          }
        }else if(item.labelType == "3"){
          this.$parent.$refs.add.formData.sport=item.labelName;
          this.$parent.$refs.add.label_sport = {
            labelId:item.labelId,
            labelLogo:'',
            labelName:item.labelName,
            labelType:3
          }
          //调用关联赛事
          this.getMatch(item.labelId,labelData);
        }else if(item.labelType == "10"){
          this.$parent.$refs.add.formData.BU=item.labelName;
          this.$parent.$refs.add.label_BU = {
            labelId:item.labelId,
            labelLogo:'',
            labelName:item.labelName,
            labelType:10
          }
        }
      })
    },
    getMatch(id,labelData){
      this.$parent.$refs.add.sportItemId = id;
      labelData.forEach((item,index) => {
        if(item.labelType == "4"){
          this.$parent.$refs.add.label_match = {
            labelId:item.labelId,
            labelLogo:'',
            labelName:item.labelName,
            labelType:4
          }
          this.$parent.$refs.add.getMatchData();
          this.$parent.$refs.add.formData.match=item.labelName;
          return;
        }
      })

    }
  },
  mounted() {
    this.getList(1);
  }
};
</script>

<style scoped>
button {
  color: #0abbfe;
}

.btn-group {
  height: 50px;
}

.modal-body {
  padding-bottom: 0px;
  width: 300px;
}

.day {
  margin-top: 10px;
}

.sn-button {
  height: 24px;
  padding: 0 10px;
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

.info-elements {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  .elem-item {
    padding-left: 20px;
    background-repeat: no-repeat;
    background-size: 16px 16px;
    font-size: 16px;
    margin-right: 16px;
    &.elem-like {
      background-image: url(../../../assets/icon-like.png);
    }
    &.elem-follow {
      background-image: url(../../../assets/icon-follow.png);
    }
    &.elem-comment {
      background-image: url(../../../assets/icon-comment.png);
    }
  }
}

.radio-group {
  display: flex;
  flex-direction: column;
  margin-left: 15px;

  .is-line {
    margin-bottom: 15px;
  }

  .radio {
    display: flex;
    align-items: center;
    margin-left: 0;
    margin-right: 0;
    padding-bottom: 0;
    & + .radio {
      margin-top: 10px;
    }
  }

  .ban-ipt {
    position: relative;

    &::before {
      content: '\5929';
      position: absolute;
      left: 41px;
      top: 3px;
      font-size: 11px;
      color: #666;
    }

    .mini {
      border: 1px solid #ccc;
      border-radius: 16px;
      color: #0abbfe;
      margin-left: 10px;
      width: 50px;
      padding-left: 7px;
      padding-right: 19px;
    }

    .err-msg {
      color: red;
      font-size: 14px;
    }
  }
}

.text-gray {
  color: #666;
}
.disable-link {
  color: #ccc;
  &:hover {
    text-decoration: none;
    cursor: default;
  }
}
</style>
