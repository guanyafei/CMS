<template>
  <sn-form-item :label="label" ref="user" prop="authorId" :rules="userRules" :label-width="labelWidth">
    <div class="container" v-clickoutside="handleClose">
      <sn-input
        v-model="author.authorName"
        :placeholder="placeholder"
        @focus="handleFocus"
        @blur="handleBlur"
      ></sn-input>
      <ul class="dropdown-list" v-if="showPropper">
        <li
          v-for="(author,index) in ruleForm.authorList"
          :key="index"
          @click="selectItem(author)"
        >{{author.authorName}}</li>
      </ul>
    </div>
  </sn-form-item>
</template>
<script>
import DI from 'interface';
import * as Constant from 'js/constant';
import debounce from 'utils/debounce';
import Clickoutside from 'directives/clickoutside';
import * as Kit from 'utils/util';
export default {
  name: 'InfoUser',
  componentName: 'InfoUser',
  props: {
    ruleForm: Object,
    data: Object,
    labelWidth: {
      type: String,
      default: '90px'
    },
    label: {
      type: String,
      default: '资讯作者'
    },
    placeholder: {
      type: String,
      default: '请输入作者账号'
    },
    checkType: Boolean
  },
  directives: { Clickoutside },
  data() {
    return {
      author: {
        account: '',
        authorId: '',
        authorName: '',
        authorType: ''
      },
      showPropper: false,
      timeout: null
    };
  },
  created() {
    this.debounceFunc = debounce(function(val) {
      this.queryAuthorInfo(val);
    }, 500);
  },
  computed: {
    userRules() {
      const validateResourceUrl = (rule, value, callback) => {
        if (this.asyncValidMsg) {
          callback(new Error(this.asyncValidMsg));
        }
        callback();
      };
      return [
        {
          required: true,
          message: `${this.placeholder}`,
          trigger: 'change'
        },
        {
          validator: validateResourceUrl,
          trigger: 'change'
        }
      ];
    },
    authorTypeItem() {
      const { authorType } = this.ruleForm;
      return Constant.getItemByValue(Constant.AUTHOR_TYPE, authorType);
    }
  },
  watch: {
    'author.authorName'(newValue) {
      this.asyncValidMsg = '';
      this.$refs.user.vaildTrigger(true, '');
      if (!newValue) {
        this.showPropper = true;
        this.asyncValidMsg = '请输入作者账号';
        this.$refs.user.vaildTrigger(false, this.asyncValidMsg);
      }
    },
    /*'ruleForm.authorId'(newValue) {
      this.asyncValidMsg = '';
      this.$refs.user.vaildTrigger(true, '');
      if (newValue && !this.ruleForm.authorName) {
        let selectedItem = this.getSelectedAuthorItemById(newValue);
        if (selectedItem) {
          selectedItem.account = selectedItem.authorName;
          this.setAuthorRelData(selectedItem);
        }
      }
    }*/
  },
  methods: {
    getSelectedAuthorItemById(id) {
      const { authorList } = this.ruleForm;
      for (let index = 0, len = authorList.length; index < len; index++) {
        const item = authorList[index];
        if (item.authorId == id) {
          return item;
        }
      }
      return null;
    },
    queryAuthorInfo(val) {
      this.$ajax({
        url: DI.infoLibrary.queryAuthorInfoByAccount,
        context: this,
        loadingText: '正在校验登录账号，请稍候！',
        data: JSON.stringify({
          phone: val
        }),
        success: res => {
          if (res.retCode == '0') {
            const data = res.data || {};
            if (!data.authorId) { // 爬虫内容编辑区分
              this.asyncValidMsg = this.checkType ? '不正确的作者账号' : '不正确的内部作者账号';
            } else {
              if (data.authorType == 2 && !this.checkType) {
                this.asyncValidMsg = '只支持内部作者账号';
              } else {
                data.account = val;
                this.setAuthorRelData(data);
              }
            }
            this.asyncValidMsg && this.$refs.user.vaildTrigger(false, this.asyncValidMsg);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    handleFocus() {
      if (!this.author.authorName) {
        this.showPropper = true;
        if (this.timeout) {
          clearTimeout(this.timeout);
        }
      }
    },
    handleBlur() {
      //输入作者id进行查询
      if (this.author.authorName) {
        if ((!this.checkType && this.author.authorName != this.ruleForm.authorName) || (this.checkType && this.author.authorName != '体坛传媒' && this.ruleForm.sourceWebsite == '体坛+') || (this.checkType && this.ruleForm.sourceWebsite != '体坛+')) {
          this.queryAuthorInfo(this.author.authorName);
        } else {
          this.asyncValidMsg = '';
          this.$refs.user.vaildTrigger(true, '');
        }
      } else {
        this.author = { authorId: '', account: '', authorName: '', authorType: '' };
        this.timeout = setTimeout(() => {
          this.setAuthorRelData(this.author);
        }, 1000);
      }
    },
    handleClose() {
      this.showPropper = false;
    },
    selectItem(author) {
      this.showPropper = false;
      author.account = author.authorName;
      this.setAuthorRelData(author);
    },
    setAuthorRelData(authorItem) {
      //移除历史记录
      Kit.removeHistoryData('_publish_writer');
      this.showPropper = false;
      //设置form值
      this.ruleForm.authorId = authorItem.authorId || '';
      this.ruleForm.authorType = authorItem.authorType || '';
      this.ruleForm.authorName = authorItem.authorName || '';
      //添加历史记录
      if (authorItem.account != '') {
        for (let key in this.author) {
          if (authorItem[key]) {
            this.author[key] = authorItem[key];
          } else {
            this.author[key] = '';
          }
        }
        Kit.setHistoryMapData('_publish_writer', this.author);
      }
      if (this.ruleForm.author) {
        this.ruleForm.author = {
          account: authorItem.account || '',
          authorId: authorItem.authorId || '',
          authorName: authorItem.authorName || '',
          authorType: authorItem.authorType || ''
        };
      }
      this.$refs.user.$emit('form.change', [this.ruleForm.authorId]);
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.ruleForm.sourceWebsite == '体坛+') {
        this.ruleForm.authorId = this.data.authorId || 'pp176@pssuning.com';
        this.ruleForm.authorName = '体坛传媒';
        this.author.authorId = this.data.authorId || 'pp176@pssuning.com';
        this.author.authorName = '体坛传媒';
        return;
      } else {
        this.ruleForm.authorId = '';
        this.ruleForm.authorName = '';
        this.author.authorId = '';
        this.author.authorName = '';
        return;
      }
      // 加载上次输入的作者信息
      if (Kit.getHistoryMapData('_publish_writer').authorId) {
        this.author = Kit.getHistoryMapData('_publish_writer');
        if(!this.ruleForm.author) this.ruleForm.author = {};
        for (let key in this.author) {
          if (this.author[key]) {
            this.ruleForm[key] = this.author[key];
            this.ruleForm.author[key] = this.author[key];
          }
        }
      }
    }, 300);
  }
};
</script>

<style scoped>
.container {
  width: 360px;
  position: relative;
  .dropdown-list {
    position: absolute;
    top: 35px;
    left: 0;
    z-index: 99999;
    min-width: 100%;
    max-height: 200px;
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 10px 0;
    overflow-y: auto;
    background: #fff;
    li {
      height: 22px;
      font-size: 12px;
      color: #242600;
      line-height: 22px;
      padding-left: 10px;
    }

    li:hover {
      background: #f6fdff;
      cursor: pointer;
    }
  }
}
</style>

