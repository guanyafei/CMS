<template>
  <div class="task-import">
    <sn-topbar title="填充任务" class="import-task" />
    <a href="javascript:;" class="back" @click="goBackBtn">
    </a>
    <sn-form :model="row" ref="ruleForm" label-width="110px">
      <div class="comment-info">
        <span class="meta">
          {{`已选择${row.list.length}条评论`}}
        </span>
        <sn-form-item prop="list" label-width="0" :rules="numRules" ref="list">
          <sn-button type="outline" :circle="false" @click="openEditDialog">导入内容管理</sn-button>
        </sn-form-item>
      </div>
      <sn-form-item label="内容类型" prop="contentType" :rules="typeRules">
        <sn-select v-model="row.contentType" width="430" ref="typeSelect" placeholder="请选择" @change="typeSelectChange">
          <sn-option name="请选择" value=""></sn-option>
          <sn-option v-for="item in contentList" :key="item.key" :name="item.name" :value="item.value" :disabled="item.key==='match'">
          </sn-option>
        </sn-select>
      </sn-form-item>
      <template v-if="typeConstantItem">
        <sn-form-item :label="typeConstantItem.idLabel" prop="contentId" ref="contentId" :rules="contentIdRules" :key="typeConstantItem.key">
          <id-input :id.sync="row.contentId" :typeConstantItem="typeConstantItem" :row="row"></id-input>
        </sn-form-item>
        <sn-form-item v-if="typeConstantItem.key==='comment'" label="评论内容" prop="content" :rules="contentRules">
          <sn-input v-model="row.content" type="textarea" width="430" disabled></sn-input>
        </sn-form-item>
        <sn-form-item v-else label="内容标题" prop="contentTitle" :rules="contentTitleRules">
          <sn-input v-model="row.contentTitle" width="430" disabled></sn-input>
        </sn-form-item>
      </template>
      <sn-form-item label="展示时间" prop="interval" :rules="timeIntervalRules">
        <sn-select v-model="row.interval" width="430" @change="handleIntervalChange">
          <sn-option v-for="time in intervalList" :key="time.key" :name="time.name" :value="time.value">
          </sn-option>
        </sn-select>
      </sn-form-item>
      <sn-form-item class="btn-group">
        <sn-button type="primary" @click="submitForm('ruleForm')">保存</sn-button>
        <sn-button @click="goBackBtn" class="task-btn-cancel">取消</sn-button>
      </sn-form-item>
    </sn-form>
    <edit-comment-dialog :viewType.sync="viewType" :list.sync="row.list"></edit-comment-dialog>
  </div>
</template>

<script>
import DI from 'interface';
import * as Constant from 'js/constant';
import EditCommentDialog from './dialog/editCommentDialog';
import IdInput from './id-input';

export default {
  name: 'ImportComment',
  components: {
    EditCommentDialog,
    IdInput
  },
  props: ['commentList', 'item', 'importType'],
  data() {
    let { item, importType } = this;
    let contentType = '',
      contentId = '',
      content = '',
      contentTitle = '',
      commTitleId = '',
      commTitleType = '';
    if (importType) {
      contentType = Constant.getItemByKey(Constant.COMMENT_CONTENT_TYPE, importType).value;
    }
    if (item) {
      if (importType === 'comment') {
        contentId = item.commId;
        content = item.commContent;
        contentTitle = item.commTitle;
        commTitleId = item.commTitleId;
        commTitleType = item.commTitleType;
      } else {
        contentId = item.contentId;
        contentTitle = item.title;
      }
    }
    return {
      contentList: Constant.COMMENT_CONTENT_TYPE,
      intervalList: Constant.IMPORT_INTERVAL_LIST,
      viewType: null, // 控制新增灌水任务弹框
      row: {
        list: this.commentList || [],
        contentType,
        contentId,
        content,
        contentTitle,
        commTitleId,
        commTitleType,
        interval: ''
      }
    };
  },
  computed: {
    typeConstantItem() {
      const { row, contentList } = this;
      if (row.contentType) {
        return Constant.getItemByValue(contentList, row.contentType);
      }
      return null;
    },
    typeRules() {
      return [
        {
          required: true,
          message: '请选择内容类型',
          type: 'number',
          trigger: 'change'
        }
      ];
    },
    numRules() {
      const numValidator = (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请导入评论'));
        }
        if (value.length > 500) {
          callback(new Error('评论最多导入500条'));
        }
        callback();
      };
      return [
        {
          validator: numValidator,
          trigger: 'change'
        }
      ];
    },
    contentIdRules() {
      const { typeConstantItem } = this;
      if (typeConstantItem) {
        return [
          {
            required: true,
            message: `请输入${typeConstantItem.idLabel}`,
            trigger: 'change'
          }
        ];
      }
      return null;
    },
    contentRules() {
      const { typeConstantItem } = this;
      if (typeConstantItem) {
        return [
          {
            required: true,
            message: `未查询出相关联评论内容`,
            trigger: 'change'
          }
        ];
      }
      return null;
    },
    contentTitleRules() {
      const { typeConstantItem } = this;
      if (typeConstantItem) {
        return [
          {
            required: true,
            message: `未查询出相关联内容标题`,
            trigger: 'change'
          }
        ];
      }
      return null;
    },
    timeIntervalRules() {
      return [
        {
          required: true,
          message: '请选择展示时间',
          type: 'number',
          trigger: 'change'
        }
      ];
    }
  },
  watch: {
    'row.contentType'() {
      this.row.contentId = '';
      this.row.contentTitle = '';
      this.row.content = '';
    },
    'row.contentId'() {
      this.row.contentTitle = '';
      this.row.content = '';
    },
    'row.list'(newVal, oldVal) {
      if (oldVal.length === 0) {
        this.$refs.list.vaildTrigger(true);
      }
    }
  },
  created() {
    // 评论来源列表
    this.querySoureList();
  },
  beforeDestroy() {
    window.localStorage.removeItem('sourceList');
  },
  methods: {
    typeSelectChange(value) {
      this.row.contentType = value;
    },
    handleIntervalChange(value) {
      this.row.interval = value;
    },
    openEditDialog() {
      this.viewType = true;
    },

    goBackBtn() {
      if (this.item && this.item.contentInfoNew) {
        this.$emit('update:item', this.item.contentInfoNew);
      }
      this.clear();
      this.$emit('close');
    },
    clear() {
      this.row.contentType = '';
      this.row.interval = '';
    },
    submitForm(formName) {
      let { row, typeConstantItem, item } = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let list = row.list.reduce((prevArr, elem) => {
            let id = null;
            if (!elem.excelType) {
              id = elem.id;
            }
            prevArr.push({
              commId: id,
              commContent: elem.commContent,
              likeNum: elem.likeNum || ''
            });
            return prevArr;
          }, []);
          let startTime = this.getFormatDate(Date.now());
          let endTime = this.getFormatDate(Date.now() + row.interval * 60 * 1000);
          let params = {
            commTitle: row.contentTitle,
            commTitleId: typeConstantItem.key === 'comment' ? row.commTitleId : row.contentId,
            commTitleType: typeConstantItem.key === 'comment' ? row.commTitleType : row.contentType,
            commentContent: row.content,
            commentId: typeConstantItem.key === 'comment' ? row.contentId : '',
            commentList: list,
            startTime,
            endTime
          };
          this.$ajax({
            url: DI.commentImport.createTask,
            context: this,
            loadingText: '正在新增灌水任务，请稍候！',
            data: JSON.stringify(params),
            success: res => {
              if (res.retCode == '0') {
                if (item && item.contentInfoNew) {
                  this.$emit('update:item', item.contentInfoNew);
                }
                this.$emit('ok');
              } else {
                this.$message.error(res.retMsg);
              }
            },
            error: () => {
              console.log('error');
            }
          });
        }
      });
    },
    querySoureList() {
      this.$ajax({
        url: DI.reptileCommentManagement.queryAllSource,
        context: this,
        loadingText: 'false',
        success: res => {
          if (res.retCode == '0') {
            const data = res.data;
            let tar = (data.sourceList || []).reduce((prevArr, elem) => {
              prevArr.push({
                key: elem.source,
                value: elem.source,
                name: elem.source
              });
              return prevArr;
            }, []);
            window.localStorage.setItem('sourceList', JSON.stringify(tar));
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    getFormatDate(time) {
      var date = null;
      if (time) {
        date = new Date(time);
      } else {
        date = new Date();
      }
      var seperator1 = '-';
      var seperator2 = ':';
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      var strHour = date.getHours();
      var strMin = date.getMinutes();
      var strSec = date.getSeconds();
      if (month >= 1 && month <= 9) {
        month = '0' + month;
      }
      if (strDate >= 0 && strDate <= 9) {
        strDate = '0' + strDate;
      }
      if (strHour >= 0 && strHour <= 9) {
        strHour = '0' + strHour;
      }
      if (strMin >= 0 && strMin <= 9) {
        strMin = '0' + strMin;
      }
      if (strSec >= 0 && strSec <= 9) {
        strSec = '0' + strSec;
      }
      var currentdate =
        date.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + strHour + seperator2 + strMin + seperator2 + strSec;
      return currentdate;
    }
  }
};
</script>

<style scoped>
.task-import {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: #fff;
}
.import-task {
  margin-left: 20px;
}
.comment-info {
  display: flex;
}

.meta {
  display: inline-block;
  width: 110px;
  margin-top: 10px;
  margin-right: 10px;
  margin-left: -10px;
  color: #09bbfe;
  text-align: right;
}

form {
  padding: 20px 30px;
}
.btn-group {
  border-top: 1px solid #e8e8e8;
  padding-top: 30px;
}
.item-time__inner {
  display: flex;
  align-items: center;
}
.item-time__text {
  padding: 0 10px;
}
.time__form {
  margin-left: -34px;
  margin-top: 10px;
}
.task-btn-cancel {
  margin-left: 40px;
}
.back {
  position: absolute;
  top: 13px;
  left: 15px;
  width: 20px;
  height: 20px;
  display: inline-block;
  background: url(../../../assets/back.png) no-repeat;
  background-size: cover;
}
</style>
