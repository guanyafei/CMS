<style scoped>
  .channelName {
    display: block;
    text-align: left;
    line-height: 32px;
    padding-left: 15px;
    position: relative;
    top: -2px;
  }
  .editBtn {
    color: #1684C2;
  }
  .toTip {
    color: red;
    font-size: 12px;
  }
</style>
<template>
  <div class="container">
    <sn-topbar title="信息流广告位"/>
    <sn-table :data="list" ref="table1" :tdHeight="50">
      <sn-table-column label='频道' prop="channelName" width='20%'>
      </sn-table-column>
      <sn-table-column label='广告位起始位置' prop="startIndex" width='20%' sloted>
        <template slot-scope='row'>
          <span v-if="row.startIndex === null">未配置</span>
          <span v-else>第{{row.startIndex}}个资讯位置</span>
        </template>
      </sn-table-column>
      <sn-table-column label='每两个广告位间隔' width='20%' sloted>
        <template slot-scope='row'>
          <span v-if="row.advInterval === null">未配置</span>
          <span v-else>{{row.advInterval}}个资讯位</span>
        </template>
      </sn-table-column>
      <sn-table-column label='操作' width='5%' sloted>
        <template slot-scope="row">
          <div class="is-column">
            <a class="editBtn" href="javascript:;" @click="edit(row)">编辑</a>
          </div>
        </template>
      </sn-table-column>
    </sn-table>
    <sn-pagination :total="dataTotal" :size="pageSize" @goto="goto"/>
    <sn-confirm ref="confirm" title='编辑' txt @sure="comfire('formData')" @close="hideDelConfirm" :flag="editFlag">
      <sn-form :model="formData" :rules="rules" ref="formData" label-width="80px" formWidth="400">
        <sn-form-item label="频道" prop="channelName">
          <span class="channelName">{{channelName}}</span>
        </sn-form-item>
        <sn-form-item label="起始位置" prop="startIndex">
          <sn-input
            placeholder="请输入数值"
            :maxlength="100"
            v-model="formData.startIndex"
            width="306"
          />
        </sn-form-item>
        <sn-form-item label="之间间隔" prop="advInterval" >
          <sn-input
            placeholder="请输入数值"
            :maxlength="100"
            v-model="formData.advInterval"
            width="306"
          />
        </sn-form-item>
      </sn-form>
      <span class="toTip" v-if="isNull">不可只有一个设为空值</span>
    </sn-confirm>
  </div>
</template>
<script>
  import DI from 'interface'
  export default {
    data() {
      let validateStartLength = (rule, value, callback) => {
        let reg = /^([1-9]?|[1-9][0-9]*)$/;
        const result = reg.test(value);
        if (!result) {
          callback(new Error("请输入正整数"));
        } else {
          callback();
        }
      };
      return {
        delConFlag: false,
        pageIndex: 0, //默认是0
        pageSize: 20, //默认是20
        dataTotal: 2, //查询出来的数据条数
        list: [],
        formData:{
          channelId: '',
          startIndex: '',
          advInterval: ''
        },
        channelName: '',
        editFlag: false,
        channelList: [
          {
            id: 1,
            name: '热门'
          },{
            id: 2,
            name: '视频'
          },{
            id: 3,
            name: '中超'
          }
        ],
        rules: {
          startIndex: [{
            validator: validateStartLength,
            trigger: 'blur'
            }],
          advInterval: [{
            validator: validateStartLength,
            trigger: 'blur'
          }]
        },
        isNull: false
      }
    },
    components: {
    },
    mounted() {
      this.queryList();
    },
    methods: {
      edit(row) {
        this.formData = {
          startIndex: row.startIndex || '',
          advInterval: row.advInterval || '',
          channelId: row. channelId
        }
        this.channelName = row.channelName;
        this.editFlag = true;
      },
      goto(num) {
        this.pageIndex = num;
        this.queryList(num);
        window.scrollTo(0, 0);
      },
      comfire(formName) {
        this.$refs[formName].validate((valid) => {
          let startIndex = this.formData.startIndex;
          let advInterval = this.formData.advInterval;
          if ((startIndex && advInterval) || (startIndex === '' && advInterval === '')) {
            this.isNull = false;
          } else {
            this.isNull = true;
            return;
          }
          if(valid) {
            let url = '';
            url = DI.advFlow.editeInfoAdv;
            this.$ajax({
              url: url,
              data: JSON.stringify(this.formData),
              context: this,
              loadingText:'正在保存，请稍候...',
              success: (res) => {
                if(res.retCode == '0') {
                  this.$message.success('提交成功');
                  this.editFlag = false;
                  setTimeout(() => {
                    this.queryList(this.pageIndex)
                  }, 1000);
                } else {
                  this.$message.error(res.retMsg);
                }
              },
              error: () => {
                this.$message.error('查询出错！');
              }
            });
          }
        });
      },
      hideDelConfirm() {
        this.editFlag = false;
        this.isNull = false;
        this.$refs.formData && this.$refs.formData.resetFields();
      },
      queryList(pageNum) {
        if(pageNum == 0) {
          this.pageIndex = pageNum;
          this.$bus.$emit('syncCurPage', 1);
        }
        var params = {};
        params.pageIndex = pageNum ? (pageNum - 1) * this.pageSize : 0;
        params.pageSize = this.pageSize;
        params = this.$bus.deleteNullProperty(params);
        this.$ajax({
          url: DI.advFlow.queryInfoAdvList,
          data: JSON.stringify(params),
          context: this,
          loadingText: '正在查询，请稍候...',
          success: (res) => {
            if(res.retCode == '0') {
              this.list = res.data.channelInfoAdvList || [];
              this.dataTotal = res.data.count || 0;
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            this.$message.error('查询出错！');
          }
        });
      },
    }
  }
</script>
