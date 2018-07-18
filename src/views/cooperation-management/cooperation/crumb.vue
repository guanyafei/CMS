<template>
  <div class="crumb">
    <div class="is-line line space-between">
      <div class="is-line">
        <div class="is-line cell">
          <span class="label">发表时间</span>
          <sn-timer v-model="startTime" ref="startTime" placeholder="起始时间" :maxDate="endTime"></sn-timer>
          <span class="label"></span>
          <span class="mr-10">至</span>
        </div>
        <sn-timer v-model="endTime" ref="endTime" placeholder="结束时间" :minDate="startTime"></sn-timer>
      </div>
      <sn-button type="primary" @click="query">查询</sn-button>
    </div>
    <div class="is-line line space-between">
      <div class="is-line">
        <sn-input ref="newsId" class="mr-30" v-model="newsId" width="200" radius="16" placeholder="请输入资讯ID" inputType="number" maxlength=20></sn-input>
        <sn-input class="mr-30" v-model="title" width="200" radius="16" placeholder="请输入资讯标题" maxlength=30></sn-input>
        <sn-input class="mr-30" v-model="authorId" width="200" radius="16" placeholder="请输入作者ID"></sn-input>
        <sn-input class="mr-30" v-model="labelName" width="200" radius="16" placeholder="请输入标签" maxlength=20></sn-input>
      </div>
      <sn-button @click="reset">重置</sn-button>
    </div>
    <div class="is-line line">
      <div class="is-line cell mr-30">
        <span class="label">文章类型</span>
        <sn-select ref="newsType" v-model="newsType" placeholder="请选择" radius="16" width="135" @change="handleTypeChange">
          <sn-option key='all' name='全部' :value='-1'></sn-option>
          <sn-option v-for="item in typeList" :key="item.key" :name="item.name" :value="item.value" :disabled="item.disCooper">
          </sn-option>
        </sn-select>
      </div>
      <div class="is-line cell mr-30">
        <span class="label">发布状态</span>
        <sn-select ref="status" v-model="status" placeholder="请选择" radius="16" width="135" @change="handleStausChange">
          <sn-option key='all' name='全部' :value='-1'></sn-option>
          <sn-option v-for="item in statusList" :key="item.key" :name="item.name" :value="item.value" :disabled="item.disabled">
          </sn-option>
        </sn-select>
      </div>
      <div class="is-line cell mr-30">
        <span class="label">发布到渠道状态</span>
        <sn-select ref="level" v-model="pushStatus" placeholder="请选择" radius="16" width="135" @change="handlePushStatusChange">
          <sn-option key='all' name='全部' :value='-1'></sn-option>
          <sn-option v-for="item in pushStatusList" :key="item.key" :name="item.name" :value="item.value" :disabled="item.disabled">
          </sn-option>
        </sn-select>
      </div>
    </div>
    <div class="is-line btn-group">
      <sn-button type="primary" @click="uncheckAll" v-if="checkAllFlag">取消全选</sn-button>
      <sn-button type="primary" @click="checkAll" v-else>全选</sn-button>
      <sn-button type="success" @click="batchHandle('batchPushToNews')">推送至今日头条</sn-button>
      <sn-button type="extra2" @click="batchHandle('batchPushToEasyBuy')">推送至易购</sn-button>
      <sn-button type="warning" @click="batchHandle('batchCancelPush')">取消推送</sn-button>
    </div>
  </div>
</template>

<script>
import DI from 'interface';
import * as Constant from 'js/constant';
export default {
  name: 'crumb',

  data() {
    return {
      typeList: Constant.ARTICLE_TYPE,
      statusList: Constant.INFOR_STATUS, //发布状态
      pushStatusList: Constant.INFOR_PUSHSTATUS,
      checkAllFlag: false,
      newsType: -1, // 文章类型非必填
      status: Constant.getItemByKey(Constant.INFOR_STATUS, 'published').value, // 发布状态:默认已发布
      pushStatus: -1, // 推送状态,
      ...this.getDefaultData()
    };
  },

  created() {
    this.$bus.$on('cooperation-checkAllStatus', flag => {
      this.checkAllFlag = flag;
    });
  },

  methods: {
    getDefaultData() {
      return {
        startTime: null,
        endTime: null,
        newsId: '', // 文章ID非必填
        title: '', // 文章标题非必填
        authorId: '', // 作者名称非必填
        labelName: '' // 标签名称非必填
      };
    },

    handleTypeChange(code) {
      this.newsType = code;
      this.$nextTick(() => {
        this.query();
      });
    },

    handleStausChange(code) {
      this.status = code;
      this.$nextTick(() => {
        this.query();
      });
    },

    handlePushStatusChange(code) {
      this.pushStatus = code;
      this.$nextTick(() => {
        this.query();
      });
    },

    boundTime(num) {
      let boundDate = num => {
        let now = new Date();
        now = now.setDate(now.getDate() + num);
        return now;
      };

      return this.getNowTime(boundDate(num));
    },

    getNowTime(date) {
      var tempDate = date ? date : '';
      let nowDate = '';
      if (tempDate == '') {
        nowDate = new Date();
      } else {
        nowDate = new Date(tempDate);
      }
      const tempyear = nowDate.getFullYear();
      const tempmonth = nowDate.getMonth() + 1 > 9 ? nowDate.getMonth() + 1 : '0' + (nowDate.getMonth() + 1);
      const tempday = nowDate.getDate() > 9 ? nowDate.getDate() : '0' + nowDate.getDate();
      let nowFullDayTime = tempyear + '-' + tempmonth + '-' + tempday;
      return nowFullDayTime;
    },

    query() {
      this.clearDateErrMsg();
      if (!this.startTime && this.endTime) {
        return this.$refs.startTime.showErr('请选择起始时间');
      }
      if (this.startTime && !this.endTime) {
        return this.$refs.endTime.showErr('请选择结束时间');
      }
      if (!this.$refs.newsId.check()) {
        return;
      }

      this.$parent.queryList(1);
    },

    reset() {
      this.clearDateErrMsg();
      this.$refs.newsId.setMsg('');
      Object.assign(this, this.getDefaultData());
    },

    checkAll() {
      this.$bus.$emit('cooperation-checkAll');
    },

    uncheckAll() {
      this.checkAllFlag = false;
      this.$bus.$emit('cooperation-uncheckAll');
    },

    batchHandle(type) {
      let $brother = this.$parent.$refs.list;
      if ($brother.selecteds.length === 0) {
        this.$message.warning('请至少选中一条资讯！');
        return;
      }

      $brother.batchHandle(type);
    },

    clearDateErrMsg() {
      this.$refs.startTime.hideErr();
      this.$refs.endTime.hideErr();
    }
  }
};
</script>

<style scoped>
.crumb {
  background-color: #ffffff;
}

.cell {
  padding: 20px 0;
  .label {
    padding-right: 10px;
  }
}

.line {
  padding-left: 20px;
  padding-right: 20px;
}

.btn-group {
  padding-left: 20px;
  padding-bottom: 20px;
  button {
    &:first-of-type {
      width: 108px;
    }
    & + button {
      margin-left: 30px;
    }
  }
}
</style>
