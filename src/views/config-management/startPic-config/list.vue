
<style scoped>
.container {
  .ibox {
    display: flex;
    padding: 0 20px;
    background: #fff;
    margin-bottom: 10px;
    align-items: center;
    min-height: 72px;
    &.end {
      justify-content: flex-end;
    }
  }
  .form_time {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    span {
      margin: 0 8px;
    }
  }
  .form-item__label:before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #09bbfe;
    border-radius: 50%;
    margin-right: 5px;
    vertical-align: middle;
  }
  .remindErr {
    color: #f00;
    font-size: 12px;
    text-align: left;
    display: block;
  }
  .img-info {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .info-title {
      margin-left: 18px;
    }
  }
}
</style>
<template>
  <div class="container">
    <sn-topbar title="安卓启动图配置管理"></sn-topbar>
    <div class="ibox end">
      <div class="search-btns">
        <sn-button type="outline" @click="addConfig">新增</sn-button>
      </div>
    </div>

    <sn-datatable :data="list" :border="true">
      <sn-datacolumn label="序号" prop="index" width="10%"></sn-datacolumn>
      <sn-datacolumn label="基本信息" prop="info" width="20%"></sn-datacolumn>
      <sn-datacolumn label="展示位置" prop="showLabel" width="10%"></sn-datacolumn>
      <sn-datacolumn label="生效时间" prop="startTime" width="15%"></sn-datacolumn>
      <sn-datacolumn label="失效时间" prop="endTime" width="15%"></sn-datacolumn>
      <sn-datacolumn label="状态" prop="status" width="10%">

      </sn-datacolumn>
      <sn-datacolumn label="操作" prop="opt" width="20%"></sn-datacolumn>
       <template slot-scope="cell" slot="index">
                  {{cell.index + 1}}
      </template>
       <template slot-scope="cell" slot="info">
          <div class="img-info">
           <img :src="cell.row.advImgUrl|smallImage" alt=""/>
           <span class="info-title">{{cell.row.advTitle}}</span>
          </div>
      </template>
      <template slot-scope="cell" slot="status">
                  {{cell.row.status == 1 ? '上架': '下架'}}
      </template>

      <template slot-scope="cell" slot="opt">
        <p>
          <sn-button :disabled="cell.row.status == 1" type="text" size="mini" @click="isSaveOn(1,cell.row)">上架</sn-button>
          <sn-button :disabled="cell.row.status == 0"  type="text" size="mini" @click="isSaveOn(0,cell.row)">下架</sn-button>
        </p>
        <p style="margin-top:10px;">
          <sn-button :disabled="cell.row.status == 1" type="text" size="mini" @click="edit(cell.row)">编辑</sn-button>
          <sn-button :disabled="cell.row.status == 1" type="text" size="mini" @click="del(cell.row)">删除</sn-button>
        </p>
      </template>
    </sn-datatable>
    <sn-pagination :size="pageSize" :total="pageCount" @goto="goto"/>
    <sn-confirm txt ref="delConfirm" :flag="delFlag" title="删除提醒"  @sure="delSure" @close="delClose">确定要删除该条数据？</sn-confirm>
       <!--上架提醒-->
    <sn-confirm txt ref="saleOnConfirm" :flag="saleOnFlag" title="上架提醒"  @sure="saleOnSure" @close="saleOnClose">确认要上架吗？</sn-confirm>
        <!--下架提醒-->
     <sn-confirm txt ref="saleOffConfirm" :flag="saleOffFlag" title="下架提醒"  @sure="saleOffSure" @close="saleOffClose">确认要下架吗？</sn-confirm>
    <sn-confirm txt ref="confirm" :flag="formFlag" :title="formTitle" @sure="advSure" @close="advClose" confirmButtonText="保存" closeIcon="true">
      <sn-form :model="formData"
			  :rules="rules"
			  ref="formData"
			  label-width="80px"
			  formWidth="400">
        <sn-form-item label="展示名称" prop="advTitle">
             <sn-input v-model="formData.advTitle" :reg="/^[a-zA-Z0-9\u4e00-\u9fa5]+$/" :maxlength="10" placeholder="请输入名称(10字以内)"  width="280" hint="不能输入特殊字符" autoValid></sn-input>
        </sn-form-item>
         <sn-form-item style="margin-left:-15px;" label="启动图" prop="advImgUrl">
            <sn-cropper ref="cropper" v-model="formData.advImgUrl" :aspectRatio="aspectRatio" size="500K" :noGif="true" width="120" height="213"></sn-cropper>
        </sn-form-item>
         <sn-form-item style="margin-left:-71px;">
           	<label class="form-item__label">生效时间</label>
           <div class="form_time">
             <sn-timer ref="timerS" placeholder="起始时间" width="138" :radius="4" :maxDate="formData.endTime" v-model="formData.startTime" showTimepicker></sn-timer>
             <span>至</span>
              <sn-timer ref="timerE" placeholder="结束时间" width="138" :radius="4" :minDate="formData.startTime" v-model="formData.endTime" showTimepicker></sn-timer>
              <div class="remindErr" v-if="timeRemind">开始时间不能大于或等于结束时间</div>
           </div>
        </sn-form-item>
      </sn-form>
    </sn-confirm>
  </div>
</template>
<script>
import DI from 'interface';
import { formatDate } from 'utils/util';
export default {
  data() {
    return {
      shelfFlag: 0,
      saleOnFlag: false,
      saleOffFlag: false,
      timeRemind: false,
      aspectRatio: 108 / 192,
      formTitle: '新增',
      formFlag: false,
      delFlag: false,
      curItem: {},
      list: [],
      pageIndex: 1,
      pageSize: 10,
      pageCount: 0,
      formData: {
        advTitle: '',
        advImgUrl: '',
        startTime: null,
        endTime: null
      },
      curItem: {},
      list: [],
      pageIndex: 1,
      pageSize: 10,
      formData: {
        advTitle: '',
        advImgUrl: '',
        startTime: null,
        endTime: null
      },
      rules: {
        advTitle: [
          {
            required: true,
            message: '名称不能为空',
            trigger: 'change'
          }
        ],
        advImgUrl: [
          {
            required: true,
            message: '请上传图片',
            trigger: 'change'
          }
        ]
      }
    };
  },
  mounted() {
    this.queryList(0);
  },
  methods: {
    goto(pageNum) {
      this.pageIndex = pageNum;
      this.queryList(pageNum);
    },
    saleOnSure() {
      //上架
      this.saleAjax();
    },
    saleOffSure() {
      //下架
      this.saleAjax();
    },
    saleOnClose() {
      this.saleOnFlag = false;
    },
    saleOffClose() {
      this.saleOffFlag = false;
    },
    saleAjax() {
      let pms = {
        advId: this.curItem.advId,
        status: this.shelfFlag == 1 ? 1 : 0,
        endTime: this.curItem.endTime
      };
      this.$ajax({
        url: DI.startPicConfig.edit,
        data: JSON.stringify(pms),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            let msg = this.shelfFlag == 1 ? '上架成功' : '下架成功';
            this.$message.success(msg);
            this.queryList(this.pageIndex);
          } else {
            this.$message.warning(res.retMsg);
          }
          this.saleOnFlag = false;
          this.saleOffFlag = false;
        },
        error: () => {
          console.log('error');
        }
      });
    },
    isSaveOn(flag, row) {
      //上下架
      if (flag) {
        this.saleOnFlag = true;
      } else {
        this.saleOffFlag = true;
      }
      this.curItem = row;
      this.shelfFlag = flag;
    },
    clearData() {
      this.formData.advTitle = '';
      this.formData.advImgUrl = '';
      this.formData.startTime = null;
      this.formData.endTime = null;
      this.formTitle = '新增';
      this.timeRemind = false;
      this.$refs.formData && this.$refs.formData.resetFields();
      this.$refs.timerS.showErr(false);
      this.$refs.timerE.showErr(false);
    },
    advSure() {
      //保存
      let reg = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;
      if (this.formData.advTitle && !reg.test(this.formData.advTitle)) {
        this.$message.warning('名称不能包含特殊字符!');
        return;
      }
      let nowTime = new Date().getTime();
      let formatTime = formatDate(nowTime, 'yyyy-MM-dd hh:mm');

      if (this.formData.startTime != null && this.formData.endTime != null && this.formData.startTime >= this.formData.endTime) {
        this.timeRemind = true;
        return;
      }
      this.$refs.formData.validate(valid => {
        if (valid && this.formData.startTime != null && this.formData.endTime != null) {
          if (this.formData.startTime <= formatTime) {
            this.$refs.timerS.showErr('开始时间要大于当前时间!');
            return;
          }
          let url = '';
          let pms = {
            advImgUrl: this.formData.advImgUrl,
            advTitle: this.formData.advTitle,
            showLabel: '启动页',
            startTime: this.formData.startTime,
            endTime: this.formData.endTime
          };
          if (this.formTitle == '编辑') {
            url = DI.startPicConfig.edit;
            pms.advId = this.curItem.advId;
          } else {
            url = DI.startPicConfig.add;
          }

          this.$ajax({
            url: url,
            data: JSON.stringify(pms),
            loadingText: '正在保存当前数据,请稍候!',
            context: this,
            success: res => {
              if (res.retCode == '0') {
                this.$message.success('保存成功!');
                this.clearData();
                this.formFlag = false;
                this.queryList(this.pageIndex);
              } else {
                this.$message.warning(res.retMsg);
              }
            },
            error: () => {
              console.log('error');
            }
          });
        } else {
          if (this.formData.startTime == null) {
            this.$refs.timerS.showErr('请选择起始时间');
          }
          if (this.formData.endTime == null) {
            this.$refs.timerE.showErr('请选择结束时间');
          }
          return;
        }
      });
    },
    advClose() {
      this.clearData();
      this.formFlag = false;
    },
    delSure() {
      //删除
      this.$ajax({
        url: DI.startPicConfig.del,
        data: JSON.stringify({
          advId: this.curItem.advId
        }),
        loadingText: '正在删除当前数据,请稍候!',
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('删除成功!');
            this.queryList(this.pageIndex);
            this.delFlag = false;
          } else {
            this.$message.warning(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    delClose() {
      this.delFlag = false;
    },
    addConfig() {
      //新增
      this.formTitle = '新增';
      this.formFlag = true;
    },
    edit(row) {
      this.curItem = row;
      this.formFlag = true;
      this.formTitle = '编辑';
      this.formData.advTitle = row.advTitle;
      this.formData.advImgUrl = row.advImgUrl;
      this.formData.startTime = row.startTime;
      this.formData.endTime = row.endTime;
      //编辑
    },
    del(row) {
      this.curItem = row;
      this.delFlag = true;
    },
    queryList(pageindex) {
      let ajaxData = {
        pageIndex: pageindex ? (pageindex - 1) * this.pageSize : 0,
        pageSize: this.pageSize
      };
      this.$ajax({
        url: DI.startPicConfig.list,
        data: JSON.stringify(ajaxData),
        loadingText: '正在查询当前列表信息,请稍候!',
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.list = res.data.list || [];
          } else {
            this.$message.warning(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    }
  }
};
</script>

