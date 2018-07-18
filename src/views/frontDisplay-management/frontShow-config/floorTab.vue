<template>
  <div id="list">
    <sn-datatable :data="floorList" :border="true">
      <sn-datacolumn label="排序" prop="index" width="10%"></sn-datacolumn>
      <sn-datacolumn label="导航名称" prop="navigationName" width="25%"></sn-datacolumn>
      <sn-datacolumn label="导航类型" prop="navigationType" width="25%" :formatter="handleConvertType"></sn-datacolumn>
      <sn-datacolumn label="信息" prop="navigationUrl" width="20%"></sn-datacolumn>
      <sn-datacolumn label="操作" prop="opt" width="20%"></sn-datacolumn>
      <template slot-scope="cell" slot="index">{{cell.index + 1}}</template>
      <template slot-scope="cell" slot="opt">
        <p>
          <sn-button type="text" @click="edit(cell.row)">编辑</sn-button>
        </p>
        <p class="mt-5">
          <sn-button type="text" @click="move(cell.row,1)" v-if="cell.index != 0">上移</sn-button>
          <sn-button type="text" @click="move(cell.row,2)" v-if="cell.index != 4">下移</sn-button>
        </p>
      </template>
    </sn-datatable>
    <sn-confirm ref="floorTabConfirm" txt :flag="editFlag" title="编辑" @sure="floorTabSure('formData')" @close="floorTabClose" closeIcon confirmButtonText="保存">
      <sn-form :model="formData" :rules="rules" ref="formData" label-width="80px" formWidth="400">
        <sn-form-item label="导航类型" prop="navigationType">
          <sn-select v-model="formData.navigationType" @change="handleTypeChange" width="290">
            <sn-option v-for="item in navTypeList" :key="item.key" :name="item.name" :value="item.value" :disabled="item.disabled"></sn-option>
          </sn-select>
        </sn-form-item>

        <sn-form-item label="导航名称" prop="navigationName" style="margin:20px 0px;">
          <sn-input v-model="formData.navigationName" placeholder="导航名称(4个字以内)" :maxlength="4" width="290" showWord="true" totalWords="4"></sn-input>
        </sn-form-item>
        <div v-if="formData.navigationType == 7">
          <sn-form-item label="URL" prop="navigationUrl">
            <sn-input v-model="formData.navigationUrl" width="290"></sn-input>
          </sn-form-item>
        </div>
      </sn-form>
    </sn-confirm>
  </div>
</template>
<script>
import * as Constant from 'js/constant';
import DI from 'interface';
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
      editFlag: false,
      curItem: {},
      navTypeList: Constant.NAV_TYPE_LIST,
      formData: {
        navigationName: '',
        navigationType: '',
        navigationUrl: ''
      },
      rules: {
        navigationName: [
          {
            required: true,
            message: '请输入导航名称',
            trigger: 'change'
          }
        ],
        navigationType: [
          {
            required: true,
            type: 'number',
            message: '请输入导航类型',
            trigger: 'change'
          }
        ],
        navigationUrl: [
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
      floorList: []
    };
  },
  mounted() {
    this.queryList();
  },
  methods: {
    handleConvertType(val) {
      let name = '';
      switch (val) {
        case 1:
          name = '资讯';
          break;
        case 2:
          name = '直播';
          break;
        case 3:
          name = '社区';
          break;
        case 4:
          name = '数据';
          break;
        case 5:
          name = '我的';
          break;
        case 6:
          name = '短视频';
          break;
        case 7:
          name = 'URL';
          break;
        default:
          break;
      }
      return name;
    },
    queryList() {
      Http.ajax({
        url: DI.floorTab.queryList,
        data: JSON.stringify({}),
        context: this,
        loadingText: '正在查询底部导航配置信息,请稍候!',
        success: res => {
          if (res.retCode == '0') {
             this.floorList = res.data.list || [];
          } else {
            Message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    clearFormData() {
      this.formData.navigationName = '';
      this.formData.navigationType = '';
      this.formData.navigationUrl = '';
      this.$refs.formData && this.$refs.formData.resetFields();
    },
    handleTypeChange(val) {
      this.formData.navigationType = val;
    },
    edit(row) {
      this.editFlag = true;
      this.curItem = row;
      this.formData.navigationName = row.navigationName;
      this.formData.navigationType = row.navigationType;
      this.formData.navigationUrl = row.navigationUrl;
    },
    move(row, type) {
      let params = {
        moveLogo: type == 1 ? 1 : 2, //1---上移 2---下移
        navigationId: row.navigationId
      };
      Http.ajax({
        url: DI.floorTab.move,
        data: JSON.stringify(params),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            Message.success(`${type == 1 ? '上移' : '下移'}成功!`);
            this.queryList();
          } else {
            Message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    floorTabSure(formName) {
      //编辑保存
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            navigationId: this.curItem.navigationId,
            navigationName: this.formData.navigationName,
            navigationType: this.formData.navigationType,
            navigationUrl: this.formData.navigationUrl || ''
          };
          Http.ajax({
            url: DI.floorTab.edit,
            data: JSON.stringify(params),
            context: this,
            loadingText: '正在保存配置信息,请稍候!',
            success: res => {
              if (res.retCode == '0') {
                Message.success('保存成功');
                this.editFlag = false;
                this.queryList();
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
    floorTabClose() {
      this.editFlag = false;
      this.clearFormData();
    }
  }
};
</script>
<style scoped>

</style>

