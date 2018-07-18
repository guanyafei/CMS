<template>
  <div class="container">
    <sn-topbar title="栏目列表">
      <span slot="back">
        <a href="javascript:;"
          class="back" @click="backToPre"></a>
      </span>
      <span slot="subtitle">专题名称:{{channel.channelName}},专题ID:{{channel.channelId}}</span>
    </sn-topbar>
    <section class="columnBtn">
      <sn-button type="primary"
        size="mini"
        @click="addColumn">新增栏目</sn-button>
    </section>
    <sn-table ref="table"
      :data="columnList">
      <sn-table-column label="序号"
        prop="index"
        width="10%"
        sloted>
        <template slot-scope="row">
          {{ row.$index+1 }}
        </template>
      </sn-table-column>
      <sn-table-column label="栏目名称"
        prop="columnName"
        width="70%"
        align="left"></sn-table-column>
      <sn-table-column label="操作"
        prop="opt"
        width="20%"
        sloted>
        <template slot-scope="row">
          <div class="is-column">
            <sn-button type="text"
              @click="editColumn(row)">编辑</sn-button>
            <p>
              <sn-button v-if="row.$index != 0"
                type="text"
                @click="move(1,row)">上移</sn-button>
              <sn-button v-if="row.$index != columnList.length-1 "
                type="text"
                @click="move(2,row)">下移</sn-button>
            </p>
            <p>
              <sn-button type="text"
                @click="delColumn(row)">删除</sn-button>
            </p>
          </div>
        </template>
      </sn-table-column>
    </sn-table>
    <sn-confirm :flag="delColumnFlag"
      title="删除栏目"
      ref="delColumnConfirm"
      txt
      @sure="delSure"
      @close="delClose">
      确定要删除该栏目吗?
    </sn-confirm>
    <sn-confirm :flag="addColumnFlag"
      :title="`${isEditOrAdd}栏目`"
      ref="addColumnConfirm"
      txt
      @sure="saveSure('formData')"
      @close="addClose"
      closeIcon>
      <sn-form :model="formData"
        ref="formData"
        :rules="ruleForm"
        labelWidth="86px"
        formWidth="366">
        <sn-form-item label="栏目名称:"
          prop="columnName">
          <sn-input v-model="formData.columnName"
            width="280"
            placeholder="请输入名称"
            :maxlength="10"
            :totalWords="10"
            showWord="true"></sn-input>
        </sn-form-item>
      </sn-form>
    </sn-confirm>
  </div>
</template>
<script>
import DI from 'interface';
export default {
  props: ['channel'],
  data () {
    return {
      delColumnFlag: false,
      curItem: {},
      isEditOrAdd: '',//标识
      addColumnFlag: false,
      columnList: [],
      formData: {
        columnId: '',
        columnName: ''
      },
      ruleForm: {
        columnName: [{
          required: true,
          type: 'string',
          message: '请输入栏目名称',
          trigger: 'change'
        }]
      }
    }
  },
  mounted () {
    this.queryList();
  },
  methods: {
    backToPre(){ //返回
       this.$emit('change-view','contentList');
    },
    queryList () { //查询栏目列表
      this.$ajax({
        url: DI.topic.querySpecialChannelColumn,
        data: JSON.stringify({
          channelId: this.channel.channelId
        }),
        context: this,
        success: (res) => {
          if (res.retCode == '0') {
            this.columnList = res.data;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: (res) => {
          console.error('error');
        }
      });
    },
    addColumn () { //新增
      this.formData.columnName = '';
      this.isEditOrAdd = '新增';
      this.addColumnFlag = true;
      this.$refs.formData && this.$refs.formData.resetFields();
    },
    editColumn (row) {
      this.isEditOrAdd = '编辑';
      this.formData.columnName = row.columnName;
      this.formData.columnId = row.id;
      this.addColumnFlag = true;
    },
    saveSure (formName) { //保存栏目
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let url = '';
          let pms = {};
          if (this.isEditOrAdd == '新增') {
            url = DI.topic.addSpecialChannelColumn;
            pms = {
              channelId: this.channel.channelId,
              columnName: this.formData.columnName
            }
          } else {
            url = DI.topic.editSpecialChannelColumn;
            pms = {
              channelId: this.channel.channelId,
              columnId: this.formData.columnId,
              columnName: this.formData.columnName
            }
          }
          this.$ajax({
            url: url,
            data: JSON.stringify(pms),
            context: this,
            success: (res) => {
              if (res.retCode == '0') {
                this.addClose();
                setTimeout(() => {
                  this.queryList();
                }, 1300);
              } else {
                this.$message.error(res.retMsg);
              }
            },
            error: (res) => {
              console.error('error')
            }
          });
        }
      });

    },
    addClose () { //关闭
      this.addColumnFlag = false;
    },
    move (flag, row) { //1上移  2下移
      let pms = {
        moveLogo: flag == 1 ? 1 : 2,
        columnId: row.id,
        channelId: this.channel.channelId
      }
      this.$ajax({
        url: DI.topic.moveSpecialChannelColumn,
        data: JSON.stringify(pms),
        context: this,
        success: (res) => {
          if (res.retCode == '0') {
            this.$message.success(`${flag == 1 ? '上移' : '下移'}成功!`);
            setTimeout(() => {
              this.queryList();
            }, 1300);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: (res) => {
          console.error('error');
        }
      });
    },
    delSure () { //删除---确定
      this.$ajax({
        url: DI.topic.deleteSpecialChannelColumn,
        data: JSON.stringify({
          channelId: this.channel.channelId,
          columnId: this.curItem.id
        }),
        context: this,
        success: (res) => {
          if (res.retCode == '0') {
            this.delColumnFlag = false;
            setTimeout(() => {
              this.queryList();//刷新列表
            }, 1300);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: (res) => {
          console.error('error');
        }
      });
    },
    delClose () {
      this.delColumnFlag = false;
    },
    delColumn (row) { //删除
      this.curItem = row;
      this.delColumnFlag = true;

    }
  }
}
</script>
<style scoped>
.container {
  .back {
    width: 20px;
    height: 20px;
    display: inline-block;
    background: url(../../../assets/back.png) no-repeat;
    background-size: cover;
  }
  .columnBtn {
    background: #FFF;
    margin-bottom: 10px;
    padding: 20px 20px 20px 0;
    display: flex;
    justify-content: flex-end;
  }
  .is-column {
    p {
      button+button {
        margin-left: 10px;
      }
    }
  }
}
</style>

