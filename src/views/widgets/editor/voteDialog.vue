<template>
  <sn-confirm
    title="插入投票"
    v-if="viewType==='vote'"
    @close="close"
    @sure="doInsert"
    noflag>
    <div class="main">
      <sn-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" formWidth="500">
        <sn-form-item label="投票标题" prop="title">
          <sn-input maxlength="15" placeholder="请输入标题，15字以内" v-model="ruleForm.title"></sn-input>
        </sn-form-item>
        <sn-form-item label="投票类型" required>
          <sn-radio-group v-model="ruleForm.type" @change="changeType">
            <sn-radio :label="1">单选</sn-radio>
            <sn-radio :label="2">多选</sn-radio>
          </sn-radio-group>
        </sn-form-item>
        <sn-form-item label="截止时间" prop="deadLine">
          <sn-select v-model="ruleForm.deadLine" placeholder="请选择" radius="6" width="360" @change="changeTime">
          <sn-option v-for="item in dayList" :key="item.value" :name="item.value" :value="item.value"></sn-option>
        </sn-select>
        </sn-form-item>
        <sn-form-item label="选项描述" required ref="options">
          <p class="vote_options" v-for="(item, i) in ruleForm.options">
            <sn-input maxlength="15" placeholder="请输入标题，15字以内" v-model="item.description" @input="changeInput(i)"></sn-input>
            <a v-show="i > 1" class="remove" @click="removeOptions(i)"></a>
          </p>
        </sn-form-item>
        <div class="vote_button" @click="addOptions">添加选项</div>
      </sn-form>
    </div>
  </sn-confirm>
</template>
<script>
import _ from 'lodash';

export default {
  name: 'VoteDialog',
  props: {
    viewType: [String, Object]
  },
  data() {
    return {
      voteInfo: {},
      ruleForm: {
        title: '',
        type: 1,
        deadLine: '',
        options: [{ description: '' }, { description: '' }]
      },
      dayList: [{
        value: '1天'
      }, {
        value: '2天'
      }, {
        value: '3天'
      }, {
        value: '4天'
      }, {
        value: '5天'
      }]
    };
  },
  computed: {
    rules() {
      return {
        title: [{
          required: true,
          min: 1,
          max: 15,
          message: '请输入标题',
          trigger: 'change'
        }],
        deadLine: [{
          required: true,
          message: '请选择截止时间',
          trigger: 'change'
        }]
      }
    }
  },
  methods: {
    doInsert() {
      this.$refs.ruleForm.validate(valid => {
        let list = this.ruleForm.options;
        let validOption = true;
        for (let i = 0; i < list.length; i++) {
          if (!list[i].description) {
            this.$refs.options.validateState = 'error';
            this.$refs.options.validateMessage = '请输入选项描述';
            $('.vote_options').eq(i).find('.input__inner').css('border', '1px solid #f47b77');
            validOption = false;
          } else {
            $('.vote_options').eq(i).find('.input__inner').css('border', '1px solid #ccc');
          }
        }
        if(valid && validOption) {
          this.$emit('close');
          this.$emit('sure', _.cloneDeep(this.ruleForm));
        }
      });
    },
    addOptions() {
      this.ruleForm.options.push({ description: '' });
    },
    removeOptions(i) {
      this.ruleForm.options.splice(i, 1);
    },
    changeInput(i) {
      let list = this.ruleForm.options;
      for (let i = 0; i < list.length; i++) {
        if (!list[i].description) {
          $('.vote_options').eq(i).find('.input__inner').css('border', '1px solid #f47b77');
        } else {
          $('.vote_options').eq(i).find('.input__inner').css('border', '1px solid #ccc');
        }
      }
      if (!this.ruleForm.options[i].description) {
        this.$refs.options.validateState = 'error';
        this.$refs.options.validateMessage = '请输入选项描述';
      }
      let checkAllList = this.ruleForm.options.filter(item => {
        return item.description != '';
      });
      if (checkAllList.length == this.ruleForm.options.length) {
        this.$refs.options.validateState = 'success';
        this.$refs.options.validateMessage = '';
      }
    },
    changeType(val) {
      this.ruleForm.type = val;
    },
    changeTime(val) {
      this.ruleForm.deadLine = val;
    },
    close() {
      this.$emit('close');
      if(!this.$parent.voteInfo) this.reset();
    },
    reset() {
      this.$refs.ruleForm && this.$refs.ruleForm.resetFields();
      this.ruleForm = {
        title: '',
        type: 1,
        deadLine: '',
        options: [{ description: '' }, { description: '' }]
      };
    }
  }
};
</script>

<style scoped>
  .main {
    width: 560px;
    padding: 0 30px;
    .vote_options {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 7px 0;
    }
    .vote_button {
      font-size: 14px;
      color: #1684C2;
      cursor: pointer;
      margin-left: 90px;
      margin-top: 20px;
    }
    .remove { 
      display: inline-block; 
      width: 20px;
      height: 5px; 
      background: #ccc;
      line-height: 0;
      font-size: 0;
      vertical-align: middle;
      -webkit-transform: rotate(45deg);
      &:after {
        content: '/';
        display: block;
        width: 20px;
        height: 5px;
        background: #ccc;
        -webkit-transform: rotate(-90deg);
      }
      &:hover {
        background: #666;
        &:after {
          background: #666;
        }
      }
    }
  }
</style>
