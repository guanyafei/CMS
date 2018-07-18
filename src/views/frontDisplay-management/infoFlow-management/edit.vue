<template>
  <div class="container">
    <sn-topbar title="编辑频道" />
    <div class="content-edit">
      <span class="title">内容编辑</span>
      <section class="form-content">
        <sn-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" >
          <p class="baseInfo">基本信息</p>
          <!-- 名称 -->
          <sn-form-item label="信息流名称" prop="name">
            <sn-input width="100%" :maxlength="nameMaxLen" :placeholder="nameplaceholder" v-model="ruleForm.name"></sn-input>
            <div class="form-item__error" v-if="flag_error && ruleForm.name != ''">未查到该ID的信息，请检查您输入的ID信息</div>
          </sn-form-item>
          <!-- 主题类型 -->
          <sn-form-item label="信息流类型" prop="type">
            <sn-select v-model="ruleForm.type" placeholder="请选择" radius="6" width="100%" @change="handleAddType" :disabled="channel.channelId">
              <sn-option v-for="item in themeTypeList" :key="item.value" :name="item.name" :value="item.value"></sn-option>
            </sn-select>
          </sn-form-item>
          <p class="baseInfo">内容设置</p>
          <!-- 内容来源 -->
          <sn-form-item label="内容来源" prop="resource">
            <sn-select v-model="ruleForm.resource" placeholder="请选择" radius="6" width="100%" @change="handleResource">
              <sn-option
                v-for="item in resourceList"
                :name="item.name"
                :value="item.value"
                :key="item.value"
                :disabled="item.disabled">
              </sn-option>
            </sn-select>
          </sn-form-item>
          <!-- 内容来源-匹配 -->
          <!--<Tag ref="tag" v-show="ruleForm.resource == 2"/>-->
          <!-- 上架方式 -->
          <sn-form-item v-show="ruleForm.resource != 3" label="上架方式" prop="onSaleType" class="coverStyle">
            <sn-radio-group v-model="ruleForm.onSaleType" @change="handleSaleType">
              <sn-radio :label="1">自动上架（免审）</sn-radio>
              <sn-radio :label="2">审核上架</sn-radio>
            </sn-radio-group>
          </sn-form-item>
        </sn-form>
      </section>
      <div class="btns">
        <sn-button type="primary" @click="editChannel">保存</sn-button>
        <sn-button @click="backList">取消</sn-button>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import DI from 'interface'
  import * as Constant from 'js/constant'
  // import Tag from './tag'
  export default {
    props: {
      channel: {
        type: Object,
        default: function() {
          return {};
        }
      }
    },
    components: {
      // Tag
    },
    data() {
      return {
        themeTypeList: Constant.THEME_TYPE,
        placeholderTypeList: Constant.THEME_PLACEHOLDER_TYPE,
        resourceList: Constant.INFO_SOURCE,
        ruleForm: {
          type: 1,
          name: '',
          resource: '',
          onSaleType: '',
          img: ''
        },
        title: '',
        subTitle: '',
        nameplaceholder: '',
        flag_error: false,
        showFlag: false,
        nameMaxLen: 10
      }
    },
    watch: {
      showFlag(newVal, oldVal) {
        if (newVal) {
          this.filter(this.channel.channelType);
          if (this.channel.channelId) this.ruleForm = this.channel;
        }
      }
    },
    computed: {
      rules() {
        return {
          name: [{
            required: true,
            min: 1,
            max: 30,
            message: '请输入名称',
            trigger: 'change'
          }],
          img: [{
            required: false,
            type: 'string',
            message: '请上传封面',
            trigger: 'change'
          }],
          resource: [{
            required: true,
            type: 'number',
            message: '请选择上架方式',
            trigger: 'change'
          }],
          onSaleType: [{
            required: true,
            type: 'number',
            message: '请选择上架方式',
            trigger: 'change'
          }]
        }
      }
    },
    methods: {
      close () {
        this.showFlag = false;
        this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
      },
      handleAddType (val) {
        this.filter(val);
        this.flag_error = false;
        this.ruleForm = {
          type: val,
          name: '',
          resource: 1,
          onSaleType: '',
          img: ''
        };
        this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
      },
      filter (val) {
        this.subTitle = Constant.getItemByValue(this.themeTypeList, val).name || '栏目';
        this.title = (this.channel.channelId ? '编辑' : '创建') + this.subTitle;
        this.nameplaceholder = Constant.getItemByValue(this.placeholderTypeList, val).name || '请输入栏目名称（1-10个字）';
        this.nameMaxLen = Constant.getItemByValue(this.placeholderTypeList, val).maxLen || 10;
        if (this.subTitle == '节目集') this.subTitle = '节目';
        if (this.subTitle == '比赛场次') this.subTitle = '比赛';
      },
      handleResource (val) {
        this.ruleForm.resource = val;
      },
      handleSaleType (val) {
        this.ruleForm.onSaleType = val;
      },
      sure() {
        console.log('=========submit', this.ruleForm);
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.$ajax({
              url: DI.theme.addxxx,
              data: JSON.stringify(this.ruleForm),
              context: this,
              success: res => {
                if (res.retCode == '0') {
                  this.$message.success((this.channel.channelId ? '编辑' : '创建') + '成功');
                  this.close();
                }
              },
              error: () => {
                console.error('error');
              }
            });
          }
        });
      }
    }
  };
</script>
<style scoped>
  .container {
    background: #fff;
  .content-edit {
    padding: 10px 18px;
  .title {
    font-size: 14px;
    color: #666666;
    line-height: 20px;
  }
  .form-content {
    padding: 20px 0 30px;
    border-bottom: 1px solid #f0f1f5;
  .form-item {
    padding-left: 40px;
  }
  .add-tag {
    position: relative;
    display: block;
    font-size: 14px;
    color: #666666;
    line-height: 20px;
    margin-top: 20px;
    margin-bottom: 18px;
  &:after {
     content: '';
     position: absolute;
     top: 10px;
     left: 67px;
     right: 5px;
     display: inline-block;
     height: 1px;
     background: #f0f1f5;
   }
  }
  .btn {
    padding-left: 230px;
  }
  }
  .btns {
    padding-left: 260px;
    padding-top: 30px;
    padding-bottom: 50px;
  button + button {
    margin-left: 40px;
  }
  }
  }
  .selected-tag {
    position: relative;
    display: inline-block;
    box-sizing: border-box;
    height: 28px;
    line-height: 28px;
    min-width: 64px;
    border: 1px solid #09bbfe;
    color: #666;
    vertical-align: top;
    padding: 0 22px 0 10px;
    border-radius: 16px;
  & + .selected-tag {
      margin-left: 12px;
      margin-bottom: 10px;
    }
  .remove {
    position: absolute;
    right: 8px;
    top: 10px;
    display: inline-block;
    width: 10px;
    height: 10px;
    background: url(../../../assets/icon_close.png) no-repeat;
    background-size: 100% 100%;
    cursor: pointer;
  }
  }
  .remind-txt {
    position: absolute;
    bottom: -8px;
    left: 0;
    font-size: 12px;
    color: #f00;
  }
  }
  .modal-body {
    width: 480px;
  .words {
    height: 128px;
    overflow: auto;
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 30px;
    border-radius: 4px;
    font-size: 12px;
    background-color: #f4f6fb;
  .title {
    color: #6e7690;
    font-weight: bold;
  }
  .word {
    display: inline-block;
    padding-right: 15px;
    padding-bottom: 15px;
    color: #f47b77;
  }
  }
  }
</style>
