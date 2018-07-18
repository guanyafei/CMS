<style scoped>
  .baseInfo {
    text-align: left;
    width: 690px;
    padding-left: 40px;
    background: #F2F2F2;
    color: #333333;
    font-size: 14px;
    height: 32px;
    line-height: 32px;
    margin-left: -40px;
    margin-bottom: 16px;
  }
  .form-item {
    margin-bottom: 18px;
  }
</style>
<template>
  <sn-confirm txt @sure="sure" @close="close" :flag="showFlag" :title="title">
    <sn-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" formWidth="610">
      <p class="baseInfo">基本信息</p>
      <!-- id -->
      <sn-form-item label="信息流ID" labelWidth="100px" prop="infoFlowId" v-show="ruleForm.infoFlowId">
        <sn-input width="100%" :maxlength="nameMaxLen" :placeholder="nameplaceholder" v-model="ruleForm.infoFlowId" :disabled="true"></sn-input>
      </sn-form-item>
      <!-- 名称 -->
      <sn-form-item label="信息流名称" labelWidth="100px" prop="infoFlowName">
        <sn-input width="100%" :maxlength="nameMaxLen" :minlength="nameMinLen" :placeholder="nameplaceholder" v-model="ruleForm.infoFlowName"></sn-input>
        <div class="form-item__error" v-if="flag_error && ruleForm.infoFlowName != ''">未查到该ID的信息，请检查您输入的ID信息</div>
      </sn-form-item>
      <!-- 类型 -->
      <sn-form-item label="信息流类型" labelWidth="100px"  prop="infoFlowType">
        <sn-select v-model="ruleForm.infoFlowType" placeholder="请选择" radius="6" width="100%" @change="handleAddType" :disabled="true">
          <sn-option v-for="item in infoFlowTypeList" :key="item.value" :name="item.name" :value="item.value"></sn-option>
          <!--<sn-option key="2" name="通用信息流" value="2"></sn-option>-->
        </sn-select>
      </sn-form-item>
      <p class="baseInfo">标签维护</p>
      <!-- 内容来源 -->
      <sn-form-item label="内容来源" labelWidth="100px" prop="resource">
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
      <div style="margin-left: 10px;">
        <Tag ref="tags" v-show="ruleForm.resource == 2"/>
      </div>
      <!-- 上架方式 -->
      <sn-form-item v-if="ruleForm.resource == 2" label="上架方式" labelWidth="100px" prop="onSaleType" class="coverStyle">
        <sn-radio-group v-model="ruleForm.onSaleType" @change="handleSaleType">
          <sn-radio :label="1">自动上架（免审）</sn-radio>
          <sn-radio :label="2">审核上架</sn-radio>
        </sn-radio-group>
      </sn-form-item>
    </sn-form>
  </sn-confirm>
</template>

<script>
  import _ from 'lodash';
  import DI from 'interface'
  import * as Constant from 'js/constant'
  import Tag from '../theme-management/tag'
  export default {
    props: {
      infoFlow: {
        type: Object,
        default: function() {
          return {};
        }
      }
    },
    components: {
      Tag
    },
    data() {
      return {
        infoFlowTypeList: Constant.INFOFLOW_TYPE,
        themeTypeList: Constant.THEME_TYPE,
        placeholderTypeList: Constant.THEME_PLACEHOLDER_TYPE,
        resourceList: Constant.COMMON_INFOFLOW_SOURCE,
        ruleForm: {
          infoFlowType: 2,
          infoFlowId: '',
          infoFlowName: '',
          resource: '',  //1:报名2:标签匹配3:手工维护
          onSaleType: 1,  //1:自动上架2:审核上架
          img: '',

          infoFlowLabelRel: [],
          isSptImgs: 1,  //	是否支持图集资讯非必填 1是0否
          isSptNews: 1, //是否支持图文资讯 1是0否
          isSptVideo: 1, //是否支持视频资讯非必填 1是0否
          level: ''
        },
        title: '',
        subTitle: '',
        nameplaceholder: '',
        flag_error: false,
        showFlag: false,
        nameMaxLen: 10,
        nameMinLen: 2,
      }
    },
    watch: {
      'ruleForm.resource': function(newVal, oldVal) {
        if (newVal == 2) {
          // this.$refs.tags.getLabelList();
          this.$refs.tags.getLabelList().then(res => {
            if (this.infoFlow.infoFlowId) {
              // this.ruleForm = this.infoFlow;
              this.ruleForm.infoFlowId = this.infoFlow.infoFlowId;
              this.ruleForm.infoFlowName = this.infoFlow.infoFlowName;
              this.ruleForm.resource = this.infoFlow.resource ? this.infoFlow.resource : '';
              this.$refs.tags.clearData();
              this.$refs.tags.setData(this.infoFlow)
            }
          });
        }
      },
      showFlag(newVal, oldVal) {
        if (newVal) {
          this.filter(this.infoFlow.infoFlowType);
          if (this.infoFlow.infoFlowId) {
            // this.ruleForm = this.infoFlow;
            this.ruleForm.infoFlowId = this.infoFlow.infoFlowId;
            this.ruleForm.infoFlowName = this.infoFlow.infoFlowName;
            this.ruleForm.resource = this.infoFlow.resource ? this.infoFlow.resource : '';
            this.ruleForm.onSaleType = parseInt(this.infoFlow.onSaleType) || '';
            this.$refs.tags.clearData();
            this.$refs.tags.setData(this.infoFlow)
          }
        }
      },
    },
    computed: {
      rules() {
        return {
          infoFlowName: [{
            required: true,
            min: 2,
            max: 10,
            type: 'string',
            message: '请至少输入2位字符',
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
        this.ruleForm = {
          infoFlowType: 2,
          infoFlowId: '',
          infoFlowName: '',
          resource: '',  //1:报名2:标签匹配3:手工维护
          onSaleType: 1,  //1:自动上架2:审核上架
          img: '',

          infoFlowLabelRel: [],
          isSptImgs: 1,  //	是否支持图集资讯非必填 1是0否
          isSptNews: 1, //是否支持图文资讯 1是0否
          isSptVideo: 1, //是否支持视频资讯非必填 1是0否
          level: ''
        };
        this.$refs.tags.clearData();
        this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
      },
      handleAddType (val) {
        this.filter(val);
        this.flag_error = false;
        this.ruleForm = {
          infoFlowType: val,
          infoFlowName: '',
          resource: 1,  //1:报名2:标签匹配3:手工维护
          onSaleType: '',  //1:自动上架2:审核上架
        };
        this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
      },
      filter (val) {
        this.subTitle = Constant.getItemByValue(this.themeTypeList, val).name || '信息流';
        this.title = (this.infoFlow.infoFlowId ? '编辑' : '新建') + this.subTitle;
        this.nameplaceholder = Constant.getItemByValue(this.placeholderTypeList, val).name || '请输入信息流名称（2-10个字）';
        this.nameMaxLen = Constant.getItemByValue(this.placeholderTypeList, val).maxLen || 10;
        if (this.subTitle == '节目集') this.subTitle = '节目';
        if (this.subTitle == '比赛场次') this.subTitle = '比赛';
      },
      handleResource (val) {
        this.ruleForm.resource = parseInt(val);
      },
      handleSaleType (val) {
        this.ruleForm.onSaleType = parseInt(val);
      },
      sure() {
        console.log('=========submit', this.ruleForm);
        let url = this.$parent.dialogType == 'add' ? DI.infoFlow.add : DI.infoFlow.edit;
        this.ruleForm.infoFlowType = 2;   //类型固定为2
        this.ruleForm.delFlag = '';
        if (this.ruleForm.resource == 2) {
          //内容来源为标签匹配时,获取内容类型，标签类型等
          this.ruleForm.infoFlowLabelRel = this.$refs.tags.getData();
          //校验是否勾选标签及选择标签
          let contentCheckBox = [], contentLabel = [];
          this.ruleForm.infoFlowLabelRel.filter(tag => {
            if (tag.hasOwnProperty('newsType') && tag.newsType != null) {
              contentCheckBox.push(tag)
            }else{
              contentLabel.push(tag)
            }
          });
          if (!contentCheckBox.length) {
            this.$message.error('请勾选内容类型！');
            return
          }
          if (!contentLabel.length) {
            this.$message.error('请选择标签！');
            return
          }

          this.ruleForm.level = this.$refs.tags.rate;
          this.ruleForm.isSptNews = this.$refs.tags.curCheckedValGraphic.length ? 1 : 0;
          this.ruleForm.isSptImgs = this.$refs.tags.curCheckedValImage.length ? 1 : 0;
          this.ruleForm.isSptVideo = this.$refs.tags.curCheckedValVideo.length ? 1 : 0;
        }
        if (this.ruleForm.resource == 3) {
          //内容来源为人工维护时,上架方式为空
          this.ruleForm.onSaleType = '';
        }
        // this.ruleForm = this.$bus.deleteNullProperty(this.ruleForm);
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.$ajax({
              url: url,
              data: JSON.stringify(this.ruleForm),
              context: this,
              success: res => {
                if (res.retCode == '0') {
                  this.$message.success((this.infoFlow.infoFlowId ? '编辑' : '创建') + '成功');
                  this.close();
                  this.$parent.$refs.list.resetFilterInputs();
                } else {
                  this.$message.error(res.retMsg);
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
