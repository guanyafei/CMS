
<template>
  <div class="container">
    <sn-table :data='list' ref='table'>
      <sn-table-column label='序号' width='20%' sloted>
        <template slot-scope='row'>
          <span>{{($parent.pageIndex - 1) * $parent.pageSize + row.$index + 1}}</span>
        </template>
      </sn-table-column>
      <sn-table-column label='分类名称' width="30%" prop='systematicName' align='center'></sn-table-column>
      <sn-table-column label='关联展示类型' width="30%" sloted>
        <template slot-scope="row">
          <p>{{row.displayTypeName}}</p>
        </template>
      </sn-table-column>
      <sn-table-column label='操作' width="20%" align="center" sloted>
        <template slot-scope="row">
          <div class="is-column">
            <p class="operate-par">
            	<a v-if="row.status" href="javascript:;" @click="showEdit(row)">编辑</a>
            	<a v-else class="disable-link" href="javascript:;">编辑</a>
              <a href="javascript:;" @click="showUseDialog(row)">{{ row.status ? '停用' : '启用'}}</a>
            </p>
            <p class="operate-par">
              <a v-if="getChangeUpStatus(row)" href="javascript:;" @click="exchange(1, row)">上移</a>
              <a v-if="getChangeDownStatus(row)" href="javascript:;" @click="exchange(2, row)">下移</a>
            </p>
          </div>
        </template>
      </sn-table-column>
    </sn-table>
    <sn-confirm txt :flag="dialogUseFlag" @sure="suerOnOff" @close="cancelDialog">
      {{ useOnOff }}
    </sn-confirm>
    <sn-confirm txt :flag="editFlag" @sure="sure('ruleForm')" @close="hideEdit" title="编辑" :hideCancelButton="true" :sureBtnIsShow="false">
      <sn-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" formWidth="390">
        <sn-form-item label="分类名称" prop="name">
          <sn-input width="100%" :maxlength="4" v-model="ruleForm.name"></sn-input>
        </sn-form-item>
      </sn-form>
      <div>
        <sn-button :style="getStyle" size="mini" type="primary" @click="sure('ruleForm')">确定</sn-button>
        <sn-button size="mini" @click="hideEdit">取消</sn-button>
      </div>
    </sn-confirm>
  </div>
</template>
<script>
import { exchangeClassify, doOnOff, editClassify } from './fetch'
export default {
  props: ['list'],
  data() {
    return {
      useOnOff: '',
      dialogUseFlag: false,
      editFlag: false,
      currentSelected: null,
      ruleForm: { name: '' }
    };
  },
  computed: {
    getStyle() {
      if (!this.ruleForm.name) {
        return `background-color:#ddd;cursor:not-allowed;margin-right:23px;margin-top:10px;`;
      } else {
        return `background-color:#09BBFE;cursor:pointer;margin-right:23px;margin-top:10px;`;
      }
    },
    rules() {
      return {
        name: [{
          required: true,
          min: 1,
          max: 4,
          message: '请输入分类名称，长度为1-4个字符',
          trigger: 'change'
        }]
      }
    }
  },
  methods: {
    showUseDialog(row) {
      let limit = this.list.filter(item => { return item.status == 1; });
      if (limit.length == 1 && row.status == 1) return this.$message.warning('至少启用一个');
      this.dialogUseFlag = true;
      this.currentSelected = row;
      this.useOnOff = row.status ? '确认停用？' : '确认启用？';
    },
    cancelDialog() {
      this.dialogUseFlag = false;
      this.currentSelected = null;
    },
    suerOnOff() {
      doOnOff(this, {
        id: this.currentSelected.id,
        status: this.currentSelected.status ? 0 : 1
      }).then(() => {
        this.dialogUseFlag = false;
        this.$message.success('操作成功');
        this.$parent.getAuthorTypeList();
      });
    },
    getChangeUpStatus(row) {
      return row.$index != 0;
    },
    getChangeDownStatus(row) {
      return row.$index != this.list.length - 1;
    },
    exchange(flag, row) {
      exchangeClassify(this, {
        id: row.id,
        movingState: flag
      }).then(() => {
        this.$message.success('操作成功');
        this.$parent.getAuthorTypeList();
      });
    },
    showEdit(row) {
      this.editFlag = true;
      this.currentSelected = row;
      this.ruleForm.name = row.systematicName;
    },
    hideEdit() {
      this.editFlag = false;
      this.currentSelected = null;
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
    },
    sure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editClassify(this, {
            id: this.currentSelected.id,
            systematicName: this.ruleForm.name
          }).then(() => {
            this.editFlag = false;
            this.$message.success('编辑成功');
            this.$parent.getAuthorTypeList();
          });
        }
      });
    }
  }
}
</script>
<style scoped>
.container {
  a {
    color: #1684c2;
    & + a {
      margin-left: 10px;
    }
    &:hover {
      text-decoration: underline;
    }
  }
  .operate-par {
    padding: 3px 0;
    line-height: 17px;
    .disable-link {
	    color: #ccc;
	    &:hover {
	      text-decoration: none;
	      cursor: default;
	    }
	  }
  }
}
</style>
