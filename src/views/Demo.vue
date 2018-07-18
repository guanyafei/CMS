<style>
body {
  background: #fff;
}

.demo-page {
  padding: 100px;
}

.intro {
  margin: 10px 0;
  font-size: 18px;
  color: #f00;
}

.page-box {
  padding: 20px;
}

.breadcrumb {
  color: #999;
}

.page-name {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 19px 0 14px;

  .title-box {
    height: 30px;
    padding-top: 6px;

    p {
      padding-left: 8px;
      border-left: 2px solid #03a9f4;
      font-size: 18px;
    }
  }
}

.image-div {
  height: 500px;
  width: 500px;
  img {
    max-width: 100%;
    /* This rule is very important, please do not ignore this! */
  }
}

.btn {
  display: block;
  min-width: 80px;
  height: 30px;
  padding: 0 20px;
  border: 1px solid #03a9f4;
  border-radius: 15px;
  font-size: 14px;
  color: #fff;
  background-color: #03a9f4;

  &.btn-big {
    min-width: 155px;
    height: 40px;
    border-radius: 20px;
  }
  &.btn-default {
    border-color: #03a9f4;
    color: #03a9f4;
    background-color: #fff;
  }
  &.btn-link {
    color: #03a9f4;
    border: none;
    background-color: transparent;
    text-decoration: underline;
  }
  &.dis {
    border-color: #999;
    color: #fff;
    background-color: #999;
    cursor: not-allowed;
  }
  &.btn-transparent {
    border-color: #ffffff;
    background-color: transparent;
  }
}
</style>
<template>
  <div class="demo-page">
    <sn-button @click="openMessage">error</sn-button>
    <sn-button @click="openMessage1">success</sn-button>
    <sn-button @click="openMessage2">warning</sn-button>
    <sn-button @click="openMessage3">info</sn-button>
    <br>
    <base-classify ref="baseClassify" @formData="getData">
      <sn-button @click="classify">基础前端分类</sn-button>
    </base-classify>
    <sn-form>
      <region-block :dialogVisible.sync="dialogVisible" @formData="getSubmitData">
        <sn-button @click="region">地域屏蔽</sn-button>
      </region-block>
    </sn-form>

    <section>带输入的模糊下拉选择: {{selectVal}}
      <br>
      <br>
      <sn-select-filter :list="list" outputField="name" v-model="selectVal" :ifFilter="true" conWidth="360"></sn-select-filter>
      <br>
      <br>
      <br> 带标签的输入框 {{tagVal}}---{{tags4Val}}
      <br>
      <br>presetVal{{presetVal}}
      <sn-select-tags :tags="tags" v-model="tagVal" width="360" :presetVal="presetVal">
        <sn-rect-checkbox label="1" v-model="tags4Val">是否展示数据楼层</sn-rect-checkbox>
      </sn-select-tags>
      <button @click="presetVal = 4">Test</button>
      <br>
      <br>
      <br> 带模糊搜索框的下拉框 {{inputVal}}
      <br>
      <br>
      <sn-select-input :list="inputList" placeholder="请选择" v-model="inputVal" conWidth="360"></sn-select-input>
      <br>
      <br>
      <br>
      <br> 多选框: {{checkdVal}}
      <br>
      <br>
      <sn-checkbox-group v-model="checkdVal">
        <sn-checkbox disabled :label="1">中超</sn-checkbox>
        <sn-checkbox disabled label="2">英超</sn-checkbox>
        <sn-checkbox label="3">意甲</sn-checkbox>
        <sn-checkbox label="4">世界杯</sn-checkbox>
      </sn-checkbox-group>
      <br>
      <br> 单个多选框 : {{singleVal}}
      <br>
      <br>
      <sn-checkbox v-model="singleVal">中国联赛</sn-checkbox>
      <br>
      <br> 圆形单选框: {{checkRadioVal}}
      <br>
      <sn-checkbox v-model="checkRadioVal" theme="radio">中国联赛</sn-checkbox>
      <br>
      <br>
      <br> 多个单选框 : {{radioVal}}
      <br>
      <sn-radio-group v-model="radioVal">
        <sn-radio :label="1">原创资讯</sn-radio>
        <sn-radio :label="2">转载资讯</sn-radio>
      </sn-radio-group>
      <br>
      <p>
        <sn-input v-model="inputVal1" placeholder="请输入栏目内容"></sn-input>
      </p>
      <hr>
      <p>
        下拉框：
        <sn-select v-model="newvalue" ref="select" placeholder="请选择11" radius="16" width="130" @change="newSelectChange">
          <sn-option v-for="item in selectList" :key="item.id" :name="item.name" :value="item.id" :disabled="item.disabled">
          </sn-option>
        </sn-select>
      </p>
      <br>
      <p class="intro">时间轴</p>
      <sn-time-axis @select="checkTime"></sn-time-axis>
      <p class="intro">矩形单选框 xx{{reactVal}}</p>
      <sn-radio-group v-model="reactVal">
        <sn-rect-radio label="1">视频类型</sn-rect-radio>
        <sn-rect-radio label="2">音频类型</sn-rect-radio>
      </sn-radio-group>
      <p class="intro">矩形多选框 xx{{rectcheckdVal}}</p>
      <sn-checkbox-group v-model="rectcheckdVal">
        <sn-rect-checkbox label="1">图文合集1</sn-rect-checkbox>
        <sn-rect-checkbox label="2">图文合集2</sn-rect-checkbox>
        <sn-rect-checkbox label="3">图文合集3</sn-rect-checkbox>
        <sn-rect-checkbox label="4">图文合集4</sn-rect-checkbox>
      </sn-checkbox-group>
      <p class="intro">表单</p>
      <p> {{ruleForm}}</p>
      <section style="width: 700px;background:#fff;padding: 50px 100px;">
        <sn-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
          <sn-form-item label="活动名称" prop="field1">
            <sn-input v-model="ruleForm.field1" />
          </sn-form-item>
          <sn-form-item label="频道名称" prop="field2">
            <sn-radio-group v-model="ruleForm.field2">
              <sn-radio :label="1">原创资讯</sn-radio>
              <sn-radio :label="2">转载资讯</sn-radio>
            </sn-radio-group>
          </sn-form-item>
          <sn-form-item label="频道类型" prop="field3">
            <sn-checkbox-group v-model="ruleForm.field3">
              <sn-checkbox disabled :label="1">中超</sn-checkbox>
              <sn-checkbox disabled label="2">英超</sn-checkbox>
              <sn-checkbox label="3">意甲</sn-checkbox>
              <sn-checkbox label="4">世界杯</sn-checkbox>
            </sn-checkbox-group>
          </sn-form-item>
          <sn-form-item label="邮箱" prop="field4">
            <sn-input v-model="ruleForm.field4" />
          </sn-form-item>
          <sn-form-item label="手机号" prop="field5">
            <sn-input v-model="ruleForm.field5" />
          </sn-form-item>
          <sn-form-item label="个人简介" prop="field7">
            <sn-input type="textarea" v-model="ruleForm.field7" />
          </sn-form-item>
          <sn-form-item label="作者范围" prop="field6" labelWidth="140px">
            <sn-select-input :list="inputList" placeholder="请选择" v-model="ruleForm.field6"></sn-select-input>
          </sn-form-item>
          <sn-form-item>
            <sn-button type="primary" @click="submitForm('ruleForm')">确定</sn-button>
            <sn-button @click="resetForm('ruleForm')">重置</sn-button>
          </sn-form-item>
        </sn-form>
      </section>
    </section>
    <p class="intro">表格控件</p>
    <sn-table :data='tableList' ref='table'>
      <sn-table-column label='序号' prop='date' width='100' sloted>
        <template slot-scope='row'>
          {{row.$index+1}}
        </template>
      </sn-table-column>
      <sn-table-column label='日期' prop='date' width='20%' align='left'></sn-table-column>
      <sn-table-column label='姓名' prop='name' width=''></sn-table-column>
      <sn-table-column label='地址' prop='address' width='20%'></sn-table-column>
      <sn-table-column label='清单' prop='checkList' width='' sloted>
        <template slot-scope='row'>
          <ul>
            <li>年龄：{{row.attr.age}}</li>
            <li>电话：{{row.attr.tel}}</li>
          </ul>
        </template>
      </sn-table-column>
      <sn-table-column label='操作' width='' sloted>
        <template slot-scope='row'>
          <button @click.stop='handleClick(row, $event)'>del</button>
        </template>
      </sn-table-column>
    </sn-table>
    <hr>
    <sn-cropper v-model='imgUrl' ref="cropper" label="封面" width="360" height="260">
    </sn-cropper>
    <hr>
    <p class="intro">按钮</p>
    <sn-button>样式1</sn-button>
    <sn-button type="primary">样式2</sn-button>
    <sn-button type="success">样式3</sn-button>
    <sn-button type="warning">样式4</sn-button>
    <sn-button type="info">样式5</sn-button>
    <sn-button type="info" disabled>禁用</sn-button>
    <br>
    <br>
    <sn-button type="info" size="mini">小号</sn-button>
    <p class="intro">翻页控件</p>
    <sn-pagination :total="100" :size="30" @goto="goto" />
    <p class="intro">弹框（纯文字弹框直接加入txt属性即可，非纯文字内容不需要加txt属性！）</p>
    <sn-button @click="confirm1">弹框</sn-button>
    <sn-confirm @sure="sure1" @close="hide1" txt :flag="flag1">
      123
    </sn-confirm>
    <p class="intro">富文本</p>
    <sn-quill />
  </div>
</template>
<script>
import DI from 'interface'
import BaseClassify from 'widgets/video/base-classify';
import RegionBlock from 'widgets/video/region-block';
export default {
  components: {
    BaseClassify,
    RegionBlock
  },
  data () {
    return {
      dialogVisible: false,
      presetVal: "",
      tags4Val: "",
      rectcheckdVal: [],
      reactVal: "1",
      selectList: [{
        name: 'aa',
        id: 111
      },
      {
        name: 'bbbbbbbbbbbbbbbb',
        id: 222,
        disabled: true
      },
      {
        name: 'ccc',
        id: 333
      }],
      newvalue: "",
      inputVal1: "",
      inputVal2: "",
      ruleForm: { "field1": "", "field2": 2, "field3": ["3", "4"], "field4": "", "field5": "", "field6": 1, "field7": "" },
      singleVal: true,
      checkRadioVal: true,
      checkdVal: [1, "3"],
      radioVal: 1,
      tagVal: 2,
      inputVal: "",
      selectVal: '',
      inputList: [{
        id: 1,
        name: '悉尼网球公开赛'
      }, {
        id: 2,
        name: '瑞士网球公开赛'
      }, {
        id: 3,
        name: '法国网球公开赛'
      }, {
        id: 4,
        name: '悉尼网球公开赛'
      }, {
        id: 5,
        name: '美国网球公开赛'
      }, {
        id: 6,
        name: '美国网球公开赛'
      }, {
        id: 7,
        name: '美国网球公开赛'
      }, {
        id: 8,
        name: '美国网球公开赛'
      }, {
        id: 8,
        name: '美国网球公开赛'
      }, {
        id: 8,
        name: '美国网球公开赛'
      }, {
        id: 8,
        name: '美国网球公开赛'
      }],
      list: [{
        name: "Milk"
      }, {
        name: "Donuts"
      }, {
        name: "Cookies"
      }, {
        name: "Chocolate"
      }, {
        name: "Peanut Butter"
      }, {
        name: "Pepto Bismol"
      }, {
        name: "Pepto Bismol (Chocolate flavor)"
      }, {
        name: "Pepto Bismol (Cookie flavor)"
      }],
      tags: [{ id: 1, name: '贝克汉姆' }, { id: 2, name: '李毅' }, { id: 3, name: '罗纳尔多' }, { id: 4, name: '巴萨' }, { id: 5, name: '苏宁' }, { id: 6, name: '高特拉' }],
      tableList: [{
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        attr: {
          age: '28',
          tel: '110'
        }
      }, {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        attr: {
          age: '28',
          tel: '119'
        }
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄',
        attr: {
          age: '28',
          tel: '120'
        }
      }],
      flag1: false,
      rules: {
        field1: [{
          required: true,
          message: '请输入活动名称',
          trigger: 'blur'
        }, {
          min: 3,
          max: 5,
          message: '长度在 3 到 5 个字符',
          trigger: 'blur'
        }],
        field2: [{
          required: true,
          type: 'number',
          message: '请选择频道名称',
          trigger: 'change'
        },],
        field3: [{
          required: true,
          type: 'array',
          message: '请选择频道类型',
          trigger: 'change'
        }],
        field4: [{
          type: 'email',
          message: '请输入正确的邮箱地址',
          trigger: 'blur'
        }],
        field5: [{
          pattern: /^[1]{1}[3,4,5,8]{1}[0-9]{9}$/,
          message: '请输入正确的手机号',
          trigger: 'change'
        }]
      },
      imgUrl: "",
      //imgUrl: require('src/assets/avril.png'),
    }
  },
  methods: {
    getData (data) {
      console.log(data);
    },
    getSubmitData (data) {
      console.log(data);
    },
    openMessage () {
      this.$message({
        message: '恭喜你，这是一条成功消息',
        type: 'error',
        showClose: true
      });
    },
    openMessage1 () {
      this.$message.success('恭喜你，这是一条成功消息');
    },
    openMessage2 () {
      this.$message.warning('恭喜你，这是一条成功消息');
    },
    openMessage3 () {
      this.$message({
        message: '恭喜你，这是一条成功消息'
      });
    },
    classify () {
      this.$refs.baseClassify.dialogVisible = true;
    },
    region () {
      this.dialogVisible = true;
    },
    checkTime (date) {
      console.log(date)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    handleClick (row, event) {
      alert(`event.target${event.target.tagName}--序号${row.$index}`);
    },
    goto (num) {
      console.log('当前页码：' + num)
    },
    sure1 (num) {
      console.log('确定啊')
      this.hide1();
    },
    hide1 (num) {
      this.flag1 = false;
    },
    confirm1 () {
      this.flag1 = true;
    },
    selectChange (code) {
      console.log(code)
    },
    newSelectChange (val) {
      console.log(val);
      this.newvalue = val;
    }
  },
  mounted () {
    this.$refs.table.$on('row-click', (event, row, index) => {
      console.log(index)
    })

  }
}
</script>
