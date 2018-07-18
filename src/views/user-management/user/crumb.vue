<template>
  <div class='crumb'>
    <div class="is-line line space-between">
      <div class='is-line cell'>
        <span class='label'>注册时间</span>
        <sn-timer v-model='startTime' ref='startTime' placeholder='起始时间' :maxDate='endTime'>
        </sn-timer>
        <span class='label'></span>
        <span class="mr-10">至</span>
        <sn-timer v-model='endTime' ref='endTime' placeholder='结束时间' :minDate='startTime'>
        </sn-timer>
      </div>
      <sn-button type='primary' @click='query'>查询</sn-button>
    </div>
    <div class="is-line line space-between">
      <div class='is-line'>
        <sn-input class="mr-30" v-model='pptvUserId' width='200' radius='16' placeholder='请输入用户ID' maxlength='100'> </sn-input>
        <sn-input v-model='userLabel' width='200' radius='16' placeholder='请输入兴趣标签' maxlength='20'> </sn-input>
      </div>
      <sn-button @click='reset'>重置</sn-button>
    </div>
    <div class="is-line line cell">
      <div class='is-line mr-30'>
        <span class='label'>用户来源</span>
        <sn-select ref='resource' v-model='resource' placeholder='请选择' radius='16' width='135' @change='handleSourceChange'>
          <sn-option key='all' name='全部' :value='-1'></sn-option>
          <sn-option v-for='item in sourceList' :key='item.key' :name='item.name' :value='item.value' :disabled='item.disabled'>
          </sn-option>
        </sn-select>
      </div>
      <div class='is-line'>
        <span class='label'>禁言状态</span>
        <sn-select ref='flag' v-model='flag' placeholder='请选择' radius='16' width='135' @change='handleBanChange'>
          <sn-option key='all' name='全部' :value='-1'></sn-option>
          <sn-option v-for='item in banList' :key='item.key' :name='item.name' :value='item.value' :disabled='item.disabled'>
          </sn-option>
        </sn-select>
      </div>
    </div>
  </div>
</template>

<script>
import * as Constant from 'js/constant'
export default {
  name: 'crumb',

  data() {
    return {
      banList: Constant.BANNED_OPTION_STATUS,
      sourceList: Constant.USER_SOURCE,
      resource: -1,
      flag: -1,
      checkAllFlag: false,
      ...this.getDefaultData()
    }
  },

  methods: {
    getDefaultData() {
      return {
        startTime: null,
        endTime: null,
        pptvUserId: '',
        userLabel: '',
      }
    },

    handleSourceChange(code) {
      this.resource = Number(code);
      this.$nextTick(()=>{
        this.query()
      }) 
    },

    handleBanChange(code) {
      this.flag = Number(code);
      this.$nextTick(()=>{
        this.query()
      }) 
    },

    boundTime(num) {
      let boundDate = (num) => {
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
      const tempmonth = (nowDate.getMonth() + 1) > 9 ? (nowDate.getMonth() + 1) : '0' + (nowDate.getMonth() + 1);
      const tempday = nowDate.getDate() > 9 ? nowDate.getDate() : '0' + nowDate.getDate();
      let nowFullDayTime = tempyear + '-' + tempmonth + '-' + tempday;
      return nowFullDayTime;
    },

    query() {
      this.clearDateErrMsg();
      if (!this.startTime&&this.endTime) {
        return this.$refs.startTime.showErr('请选择起始时间');
      }
      if (this.startTime&&!this.endTime) {
        return this.$refs.endTime.showErr('请选择结束时间');
      }
      this.$parent.queryList();
    },

    reset() {
      this.clearDateErrMsg();
      Object.assign(this, this.getDefaultData());
    },

    clearDateErrMsg() {
      this.$refs.startTime.hideErr();
      this.$refs.endTime.hideErr();
    }
  }
}
</script>

<style scoped>
.crumb {
  background-color: #FFFFFF;
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
</style>
