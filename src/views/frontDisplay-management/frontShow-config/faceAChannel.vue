<template>
  <div id="list">
    <sn-button type="outline" class="add-channel" @click="addChannel">添加频道</sn-button>
    <sn-datatable :data="faceAList" :border="true">
      <sn-datacolumn label="频道排序" prop="index" width="10%"></sn-datacolumn>
      <sn-datacolumn label="频道ID" prop="channelId" width="10%"></sn-datacolumn>
      <sn-datacolumn label="频道名称" prop="channelName" width="20%"></sn-datacolumn>
      <sn-datacolumn label="频道类型" prop="channelType" width="10%"></sn-datacolumn>
      <sn-datacolumn label="频道信息" prop="channelInfo" width="20%"></sn-datacolumn>
      <sn-datacolumn label="展示角标" prop="mark" width="20%"></sn-datacolumn>
      <sn-datacolumn label="操作" prop="opt" width="10%"></sn-datacolumn>
      <div slot-scope="cell" slot="index">

        <template v-if="cell.row.channelType == 1">
          <span>{{(pageIndex-1)*pageSize + cell.index + 1}}</span>
        </template>
        <template v-if="cell.row.channelType != 1">
          <span class="indexTop" v-if="cell.row.topFlag == 1">{{(pageIndex-1)*pageSize + cell.index + 1 +' 置顶'}}</span>
          <span v-else>{{(pageIndex-1)*pageSize + cell.index + 1}}</span>
        </template>
      </div>
      <template slot-scope="cell" slot="channelType">
        {{handleConvertChannelType(cell.row.channelType,cell.row.subjectType)}}
      </template>
      <div slot-scope="cell" slot="channelInfo">
        <!-- 首页 -->
        <template v-if="cell.row.channelType == 1">
          <p>ID:{{cell.row.subjectId}}</p>
          <p style="margin-top:10px;">{{cell.row.subjectName}}</p>
        </template>
        <!--主题-->
        <!--其它-->
        <template v-if="cell.row.channelType == 2">
          <p>ID:{{cell.row.subjectId}}</p>
          <p style="margin-top:10px;">{{cell.row.subjectName}}</p>
        </template>
        <!--短视频-->
        <!--url-->
        <template v-if="cell.row.channelType == 4">
          <p>{{cell.row.jumpUrl}}</p>
        </template>
      </div>
      <template slot-scope="cell" slot="opt">
        <div class="is-column">
          <p class="btn-style">
            <sn-button class="mr-8" type="text" @click="editAChannel(cell.row)">编辑</sn-button>
            <sn-button v-if="cell.row.channelType != 1" type="text" @click="delAChannel(cell.row)">删除</sn-button>
          </p>
          <p class="btn-style">
            <sn-button class="mr-8" v-if="getChangeUpStatus(cell)" type="text" @click="moveAChannel(cell.row,1)">上移</sn-button>
            <sn-button v-if="getChangeDownStatus(cell)" type="text" @click="moveAChannel(cell.row,2)">下移</sn-button>
          </p>
          <p class="btn-style">
            <sn-button type="text" @click="setMark(cell.row)">角标设置</sn-button>
          </p>
          <p class="btn-style">
            <sn-button v-if="cell.row.channelType != 1 && (cell.row.topFlag == 0 || cell.row.topFlag == null)" class="mr-8" type="text" @click="showTopConfirm(cell.row)">置顶</sn-button>
            <sn-button v-if="cell.row.channelType != 1 && cell.row.topFlag == 1" type="text" @click="showTopConfirm(cell.row)">取消置顶</sn-button>
          </p>
        </div>
      </template>
    </sn-datatable>
    <sn-pagination @goto="goto" :total="totalCount" :size="pageSize"></sn-pagination>

    <sn-confirm txt ref="faceAConfirm" :title="channelTitle" @sure="faceASure('formData')" :flag="addChannelFlag" @close="faceAClose" closeIcon confirmButtonText="保存">
      <sn-form :model="formData" :rules="rules" ref="formData" label-width="80px" formWidth="400">
        <sn-form-item label="频道类型" prop="channelType">
          <sn-select v-model="formData.channelType" @change="handleChannelTypeChange" :disabled="isDisabled" width="320">
            <sn-option v-for="item in channelTypeList" :key="item.key" :name="item.name" :value="item.value" :disabled="item.disabled"></sn-option>
          </sn-select>
        </sn-form-item>
        <div v-if="formData.channelType == 1 && channelTitle == '编辑频道'">
          <sn-form-item label="栏目信息" prop="columnInfo">
            <sn-input :disabled="true" v-model="formData.columnInfo" width="320" placeholder=""></sn-input>
          </sn-form-item>
        </div>
        <div v-if="formData.channelType == 2">
          <sn-form-item label="查询主题" prop="subjectId">
            <sn-input v-model="formData.subjectId" width="320" placeholder="请输入主题ID" @blur="changeID(formData.subjectId)" :reg="/^\d+$/" hint="请输入数字" autoValid></sn-input>
          </sn-form-item>
          <sn-form-item label="主题信息" prop="themeInfo">
            <sn-input :disabled="true" v-model="formData.themeInfo" width="320"></sn-input>
          </sn-form-item>
          <p class="errTips" v-if="remindMsgFlag">请输入正确的主题ID</p>
        </div>
        <sn-form-item label="频道名称" prop="channelName">
          <sn-input v-model="formData.channelName" width="320" placeholder="频道名称(10个字以内)" :maxlength="10" showWord="true" totalWords="10"></sn-input>
        </sn-form-item>
        <div v-if="formData.channelType == 4">
          <sn-form-item label="URL" prop="url">
            <sn-input v-model="formData.url" width="320" placeholder="输入链接"></sn-input>
          </sn-form-item>
        </div>

      </sn-form>
    </sn-confirm>
    <!--角标设置-->
    <sn-confirm txt ref="setMarkConfirm" title="角标设置" @sure="setMarkSure('formData')" :flag="setMarkFlag" @close="hideMark">
      <sn-form :model="markData" ref="markForm" :rules="markRule" label-width="120px" formWidth="350">
        <sn-form-item label="角标展示" prop="name" ref="nameItem">
          <sn-input placeholder="请输入角标名" v-model="markData.name" width="220" maxlength="4"></sn-input>
        </sn-form-item>
      </sn-form>

    </sn-confirm>
    <!--删除框-->
    <sn-confirm txt @sure="delSure" @close="delClose" :flag="delFlag">确定要删除吗?</sn-confirm>
  </div>
</template>
<script>
import DI from 'interface';
import * as Constant from 'js/constant';
import Message from 'components/new-frame/message';
import Http from 'utils/http';
export default {
  data() {
    let validateUrl = (rule, value, callback) => {
      if (!/^(http|https):\/\//.test(value)) {
        callback(new Error('url需为：http://或https://开头'));
      }
      callback();
    };
    return {
      curItem: {},
      remindMsgFlag: false,
      noTopFirstIndex: 0,
      isDisabled: false,
      subjectTypeList: Constant.SUBJECT_TYPE_LIST,
      topNum: 0, //置顶总条数
      channelTitle: '添加频道',
      channelTypeList: Constant.CHANNEL_TYPE_LIST,
      delFlag: false,
      addChannelFlag: false,
      setMarkFlag: false,
      pageIndex: 1,
      pageSize: 20,
      totalCount: 0,
      markRule: {
        name: {
          max: 4,
          min: 2,
          message: '长度在 2 到 4 个字符',
          trigger: 'change'
        }
      },
      rules: {
        channelType: [
          {
            required: true,
            type: 'number',
            message: '请选择频道类型',
            trigger: 'change'
          }
        ],
        channelName: [
          {
            required: true,
            message: '请选择频道名称',
            trigger: 'change'
          }
        ],
        subjectId: [
          {
            required: true,
            message: '主题ID不能为空',
            trigger: 'change'
          }
        ],
        url: [
          {
            required: true,
            message: 'url不能为空',
            trigger: 'change'
          },
          {
            validator: validateUrl,
            trigger: 'change'
          }
        ]
      },
      markData: {
        name: ''
      },
      formData: {
        channelType: '',
        channelName: '',
        subjectId: '',
        themeInfo: '', //主题信息
        columnInfo: '', //栏目信息
        url: ''
      },
      faceAList: []
    };
  },
  mounted() {
    this.queryList();
  },
  methods: {
    getSubjectTypeItem(val) {
      return Constant.getItemByValue(this.subjectTypeList, val);
    },
    getChangeUpStatus(cell) {
      //上移
      if (this.pageIndex >= 2 && (this.pageIndex - 1) * this.pageSize + cell.index == this.topNum + 1) {
        return false;
      }
      if (cell.row.topFlag == 1 && cell.index == 1 && this.pageIndex == 1) {
        return false;
      }
      if ((cell.row.topFlag == 0 || cell.row.topFlag == null) && (this.pageIndex - 1) * this.pageSize + cell.index == this.topNum + 1) {
        return false;
      }
      return cell.row.channelType != 1;
    },
    getChangeDownStatus(cell) {
      //下移
      if (cell.row.topFlag == 1 && (this.pageIndex - 1) * this.pageSize + cell.index == this.topNum) {
        return false;
      }
      if ((this.pageIndex - 1) * this.pageSize + cell.index == this.totalCount - 1) {
        return false;
      }
      return cell.index >= 0 && cell.row.channelType != 1;
    },
    goto(pageNum) {
      this.pageIndex = pageNum;
      this.queryList(pageNum);
    },
    showTopConfirm(row) {
      //置顶操作
      let pms = {
        channelType: row.channelType,
        channelName: row.channelName,
        channelId: row.channelId,
        isTop: row.topFlag ? 0 : 1
      };
      Http.ajax({
        url: DI.channelConfig.changeTop,
        data: JSON.stringify(pms),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            Message.success('操作成功!');
            setTimeout(() => {
              this.queryList(this.pageIndex);
            }, 1300);
          } else {
            Message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },

    delSure() {
      //删除
      let pms = { channelId: this.curItem.channelId };
      Http.ajax({
        url: DI.channelConfig.delChannel,
        data: JSON.stringify(pms),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            Message.success('删除成功!');
            this.delFlag = false;
            this.queryList(this.pageIndex);
          } else {
            Message.error(res.retMsg);
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
    setMark(row) {
      this.markData.name = row.mark || '';
      this.curItem = row;
      this.setMarkFlag = true;
    },
    setMarkSure() {
      //角标设置
      let pms = { mark: this.markData.name, channelId: this.curItem.channelId };
      Http.ajax({
        url: DI.channelConfig.setMark,
        data: JSON.stringify(pms),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            Message.success('设置成功');
            this.setMarkFlag = false;
            this.queryList(this.pageIndex);
          } else {
            Message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    hideMark() {
      this.setMarkFlag = false;
    },
    moveAChannel(row, flag) {
      //上下移
      let pms = {
        abFlag: 1,
        channelTerminalFlag: 1,
        channelId: row.channelId,
        movingState: flag == 1 ? 1 : 2,
        isTop: row.topFlag
      };
      Http.ajax({
        url: DI.channelConfig.move,
        data: JSON.stringify(pms),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            Message.success(`${flag == 1 ? '上移' : '下移'}成功`);
            this.queryList(this.pageIndex);
          } else {
            Message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    delAChannel(row) {
      this.curItem = row;
      this.delFlag = true;
    },
    handleConvertChannelType(channelType, subjectType) {
      let typeName = '';
      switch (channelType) {
        case 1:
          typeName = '首页';
          break;
        case 2:
          if (subjectType == 1) {
            typeName = '主题-栏目';
          } else if (subjectType == 2) {
            typeName = '主题-赛事';
          } else if (subjectType == 4) {
            typeName = '主题-节目集';
          } else if (subjectType == 5) {
            typeName = '主题-小组';
          }
          break;
        case 3:
          typeName = '短视频';
          break;
        case 4:
          typeName = 'URL';
          break;
      }
      return typeName;
    },
    editAChannel(row) {
      this.isDisabled = true;
      let subjectType = this.getSubjectTypeItem(row.subjectType).name || '';
      this.addChannelFlag = true;
      this.channelTitle = '编辑频道';
      this.curItem = row;
      let res = this.channelTypeList.find(item => {
        return item.value == 1;
      });
      if (!res) {
        this.channelTypeList.push({ key: 'home', value: 1, name: '首页' });
      }
      this.formData = {
        channelId: row.channelId,
        channelName: row.channelName,
        channelType: row.channelType,
        url: row.jumpUrl,
        themeInfo: '主题ID:' + row.subjectId + ' ' + subjectType + ' ' + '名称:' + row.subjectName,
        columnInfo: 'ID:' + row.subjectId + '名称:' + row.subjectName,
        subjectId: '' + row.subjectId
      };
    },
    changeID(id) {
      if (id == '' || !/^\d+$/.test(id)) {
        return;
      }
      let pms = { subjectId: parseInt(id) };
      Http.ajax({
        url: DI.channelConfig.queryThemeInfoById,
        data: JSON.stringify(pms),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            const data = res.data;
            const dataStr = JSON.stringify(data);
            if (dataStr != '{}') {
              this.formData.themeInfo =
                '主题ID:' + data.subjectId + ' ' + this.handleSubjectType(data.subjectType) + ' ' + '名称:' + data.subjectName;
              this.remindMsgFlag = false;
            } else {
              this.formData.themeInfo = 'sorry，查不到对应的主题信息!';
              this.remindMsgFlag = true;
              return;
            }
          } else {
            Message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    handleSubjectType(type) {
      let name = '';
      switch (type) {
        case 1:
          name = '栏目';
          break;
        case 2:
          name = '赛事';
          break;
        case 4:
          name = '节目集';
          break;
        case 5:
          name = '小组';
          break;
        default:
          break;
      }
      return name;
    },
    clearVal() {
      this.isDisabled = false;
      this.formData.channelName = '';
      this.formData.channelType = '';
      this.formData.url = '';
      this.formData.subjectId = '';
      this.formData.columnInfo = '';
      this.formData.themeInfo = '';
      this.remindMsgFlag = false;
      this.$refs.formData && this.$refs.formData.resetFields();
    },
    faceASure(formName) {
      //保存
      this.$refs[formName].validate(valid => {
        if (valid && !this.remindMsgFlag) {
          let reg = /^\d+$/;
          if (this.formData.subjectType == 2 && this.formData.subjectId && !reg.test(this.formData.subjectId)) {
            return;
          }
          const submitData = this.formData;
          let pms = {
            abFlag: 1,
            channelName: submitData.channelName,
            channelTerminalFlag: 1,
            channelType: submitData.channelType,
            jumpUrl: submitData.url || '',
            subjectId: submitData.subjectId || ''
          };
          let url = '';
          if (this.channelTitle == '编辑频道') {
            pms.channelId = submitData.channelId;
            url = DI.channelConfig.edit;
          } else {
            url = DI.channelConfig.save;
          }
          Http.ajax({
            url: url,
            data: JSON.stringify(pms),
            context: this,
            loadingText: '正在保存A面频道信息,请稍候!',
            success: res => {
              if (res.retCode == '0') {
                Message.success('保存成功');
                this.queryList(this.pageIndex);
                this.addChannelFlag = false;
                this.clearVal();
              } else {
                Message.error(res.retMsg);
              }
            },
            error: () => {
              console.log('error');
            }
          });
        }
      });
    },
    faceAClose() {
      this.clearVal();
      this.addChannelFlag = false;
    },
    addChannel() {
      this.addChannelFlag = true;
      this.channelTitle = '添加频道';
      let index = this.channelTypeList.findIndex(item => {
        return item.value == 1; //首页
      });
      if (index != -1) {
        this.channelTypeList.splice(index, 1);
      }
      this.clearVal();
    },
    handleChannelTypeChange(val) {
      this.$refs.formData && this.$refs.formData.resetFields();
      this.formData.channelType = val;
    },
    queryList(pageindex) {
      //查询
      let params = {
        abFlag: 1, //1---A面 2---B面
        channelTerminalFlag: 1, //1---app端 2---pc端
        pageIndex: pageindex != 1 ? (this.pageIndex - 1) * this.pageSize : 0,
        pageSize: this.pageSize
      };
      params = this.$bus.deleteNullProperty(params);
      Http.ajax({
        url: DI.channelConfig.queryList,
        data: JSON.stringify(params),
        context: this,
        loadingText: '正在查询A面频道信息,请稍候!',
        success: res => {
          if (res.retCode == '0') {
            this.faceAList = res.data.channelList || [];
            this.totalCount = res.data.channelNum || 0;
            this.topNum = res.data.topNum || 0; //置顶总条数
          } else {
            Message.error(res.retMsg);
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
<style scoped>
.errTips {
  margin-left: -133px;
  line-height: 20px;
  color: #f00;
  font-size: 12px;
}
.add-channel {
  position: absolute;
  right: 37px;
  top: 70px;
}
.indexTop {
  box-sizing: border-box;
  padding: 5px 10px;
  border-radius: 15px;
  background: #ffa488;
  color: #fff;
}
.is-column {
  display: flex;
  align-items: center;
  .btn-style {
    .mr-8 {
      margin-right: 8px;
    }
    margin-top: 8px;
    display: flex;
    justify-content: space-around;
  }
}
.top-txt {
  float: right;
  margin-top: -22px;
  margin-right: -7px;
  color: #999;
}
</style>

