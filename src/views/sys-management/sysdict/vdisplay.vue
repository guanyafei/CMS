<style>
.container {

  .ibox {
    display: flex;
    align-items: center;
    height: auto;
    min-height: 72px;
    padding: 0 20px;
    background: #fff;
    margin-bottom: 10px;

    & .end {
      justify-content: flex-end;
    }

    & .between {
      justify-content: space-between;
    }

    .search-box {

      .time-box {
        display: flex;
        align-items: center;
        height: 30px;
        font-size: 12px;
        color: #999999;
        margin-bottom: 20px;
        margin-top: 20px;

        .time-text {
          margin-right: 10px;
        }

        .split {
          margin: 0 8px;
        }
      }
      .input-box {
        margin-bottom: 20px;
      }

      .select-box {
        display: flex;
        height: 30px;
        align-items: center;
        margin-bottom: 20px;
        color: #999;

        .text {
          margin-right: 10px;
        }
      }
    }
    .btns {
      display: flex;
      flex-direction: column;

      button {

        &+button {
          margin-top: 20px;
        }
      }
    }
  }
  .ibox-empty {
    margin-bottom: 10px;
  }

  a {
    color: #1684C2;
    & :hover {
      text-decoration: underline;
    }
  }
  .header {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 40px;
    background: #eee;
    color: #666;
  }

  .operate-par {
    padding: 5px 0;
    & a {
      margin-bottom: 10px
    }
  }


  .remind-par {
    display: none;
    margin-top: -13px;
    padding-left: 80px;
    color: #f00;
    font-size: 12px;
  }

  .match-logo {
    width: 160px;
    height: 160px;
  }

  .add-user-input {
    display: inline-block;
  }

  ,
  .add-user-btn {
    min-width: 100px;
    height: 30px;
    padding: 0 30px;
    border: 1px solid #ccc;
    border-radius: 16px;
    font-size: 12px;
    color: #666;
  }

  .top-view {
    z-index: 7000;
  }
  .rightside {
    justify-content: flex-end;
  }
}
</style>
<template>
  <div class="container">
    <sn-topbar title="系统配置字典管理">
    </sn-topbar>
    <div>
      <section class="ibox end rightside">
        <sn-button type="primary" @click="addSysDictHandler">新增系统配置字典</sn-button>
      </section>
      <sn-table :data='sysDictList' ref='vColTable'>
        <sn-table-column label='类型' prop='dictType' width='130' align="center"></sn-table-column>
        <sn-table-column label='类型描述' prop='dictTypeDesp' width='350' align="center"></sn-table-column>
        <sn-table-column label='KEY' prop='dictKey' width='350' align="center"></sn-table-column>
        <sn-table-column label='值' prop='dictValue' width='350' align="center"></sn-table-column>
        <sn-table-column label='操作' sloted width='160'>
          <template slot-scope='row'>
            <p class="operate-par is-column">
              <a href="javascript:void(0)" @click="deleteSysDictHandler(row)">删除</a>
              <a href="javascript:void(0)" @click="editSysDictHandler(row)">设置</a>
            </p>
          </template>
        </sn-table-column>
      </sn-table>
    </div>
    <!---删除弹窗的确认提示-->
    <sn-confirm class="top-view" txt ref="delMVideoConf" :flag="delDictFlag" @sure="delConfirmHandler" @close="hideDelDictConfirm">
      确定要删除吗？
    </sn-confirm>
    <!---系统配置管理弹框-->
    <sn-confirm ref="addVideoColPop" :title='curFormTitle' @sure="submitSysDictCol" @close="sysDictPopHide" :flag="sysDictPopFlag" confirmButtonText="保存" v-if="sysDictPopFlag">
      <sn-form :model="sysDictColData" ref="submitVideoForm" :rules="submitVideoRole" label-width="80px" formWidth="420" style="margin:20px">
        <sn-form-item label="类型" prop="dictType">
          <sn-select placeholder="请输入类型名称" ref="dictType" @change="selectChangeHandler" v-model="sysDictColData.dictType" width="310">
            <sn-option v-for="item in sysType" :key="item.id" :name="item.name" :value="item.name" :disabled="item.disabled">
            </sn-option>
          </sn-select>
        </sn-form-item>
        <sn-form-item label="类型描述" prop="dictTypeDesp">
          <sn-input placeholder="请输入类型描述" ref="dictTypeDesp" v-model="sysDictColData.dictTypeDesp" width="310" />
        </sn-form-item>
        <sn-form-item label="KEY" prop="dictKey">
          <sn-input placeholder="请输入KEY数" ref="dictKey" v-model="sysDictColData.dictKey" width="310" />
        </sn-form-item>
        <sn-form-item label="值" prop="dictValue">
          <sn-input placeholder="请输入值数" ref="dictValue" v-model="sysDictColData.dictValue" width="310" />
        </sn-form-item>
      </sn-form>
    </sn-confirm>
  </div>
</template>
<script>
import DI from 'interface'
import * as Constant from 'js/constant'
const SERVER_OK = "0"
const ISEDIT = "设置系统配置字典";
const ISCREATE = '新增系统配置字典';
export default {
  props: {
    channelId: { //获取频道列表页面传过来的ChannelId
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      /*频道权限和主题权限的功能一样，主题也是频道的一种，所以主题可以共用频道权限的变量和接口*/
      tabIndex: 0,
      sysDictList: [], // 系统配置管理列表
      curSysDict: {}, //当前删除或设置的行数据
      curFormTitle: '', // 当前是编辑还是创建弹窗的标题
      soaUserList: [], // 会员账户列表
      curChannelId: '', // 当前编辑的权限列表的频道id或者主题id
      sysDictColData: { // 系统配置信息
        dictType: '', // 系统配置类型
        dictTypeDesp: '', // 系统配置描述
        dictKey: '', // 系统配置KEY
        dictValue: '' // 系统配置的数值
      },
      sysType: Constant.SYSTYPE, // 系统配置类型
      submitVideoRole: { //添加规则
        soaUserAccount: [],
        dictType: {   // 系统配置类型
          required: true,
          message: '请选择类型',
          default: ''
        },
        dictKey: {    // 系统配置KEY
          required: true,
          message: '请输入key',
          default: ''
        },
        dictValue: {   // 系统配置的数值
          required: true,
          message: '请输入值',
          default: ''
        }
      },
      sysDictPopFlag: false, // 权限管理弹框
      delDictFlag: false, //删除会员确认弹框
    }
  },
  mounted () {
    this.querySysDictHandler();
  },
  created () {
  },
  methods: {
    querySysDictHandler () {
      this.$ajax({
        url: DI.sysDictmgt.querySysDict,
        context: this,
        success: (res) => {
          if (res.retCode === SERVER_OK) {
            this.sysDictList = res.data.sysDictList || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      })
    },
    addSysDictHandler () {
      this.sysDictPopFlag = true;
      this.curFormTitle = ISCREATE;
      this.sysDictColData = {
        dictType: '',
        dictTypeDesp: '',
        dictKey: '',
        dictValue: ''
      };
    },
    deleteSysDictHandler (row) {
      this.curSysDict = row;
      this.delDictFlag = true;
    },
    delConfirmHandler () {
      this.delDictFlag = false;
      this.$ajax({
        url: DI.sysDictmgt.delSysDict + "?dictType=" + this.curSysDict.dictType + "&id=" + this.curSysDict.id,
        context: this,
        type: 'GET',
        success: (res) => {
          if (res.retCode === SERVER_OK) {
            console.log("删除成功！")
            this.$message.success("删除成功！");
            this.querySysDictHandler(); // 删除完刷新页面
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    editSysDictHandler (row) {
      this.sysDictPopFlag = true;
      this.curFormTitle = ISEDIT;
      this.sysDictColData = {
        id: row.id,
        dictType: row.dictType,
        dictTypeDesp: row.dictTypeDesp,
        dictKey: row.dictKey,
        dictValue: row.dictValue
      };

    },
    authoritymgtModelShow (rowItem) { // 权限管理弹框显示
      this.sysDictPopFlag = true;
      this.curChannelId = rowItem.channelId;
    },
    sysDictPopHide () { // 系统配置管理弹框隐藏方法
      this.sysDictPopFlag = false;
    },
    submitSysDictCol () { //提交合集数据(新增&编辑)
      console.log("提交")
      let url = '', reqBody = {};
      if (this.curFormTitle === ISCREATE) {
        url = DI.sysDictmgt.addSysDict;
      } else {
        url = DI.sysDictmgt.editSysDict
      }
      this.$refs.submitVideoForm.validate((valid) => {
        if (valid) {
          reqBody = {
            "id": this.sysDictColData.id, // 系统配置id
            "dictType": this.sysDictColData.dictType, // 系统配置类型
            "dictTypeDesp": this.sysDictColData.dictTypeDesp, // 系统配置类型描述
            "dictKey": this.sysDictColData.dictKey,  // 系统配置key
            "dictValue": this.sysDictColData.dictValue  // 系统配置value
          };
          this.$ajax({
            url: url,
            data: JSON.stringify(reqBody),
            context: this,
            success: (res) => {
              if (res.retCode === SERVER_OK) {
                this.sysDictPopFlag = false;
                this.$message.success("提交成功！");
                this.querySysDictHandler();
              } else {
                this.$message.error(res.retMsg);
              }
            },
            error: () => {
              console.error('error');
            }
          });
        } else {
          console.log('submit err');
        }
      })
    },
    hideDelDictConfirm () { // 取消弹框

      this.delDictFlag = false;
    },
    selectChangeHandler (newVal) {
      if (newVal) {
        this.sysDictColData.dictType = newVal;
      }

    }

  }
}
</script>
