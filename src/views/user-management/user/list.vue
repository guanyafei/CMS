<template>
  <div>
    <sn-table :data="list" ref="table">
      <sn-table-column label="用户ID" prop="pptvUserId" width="10%">
      </sn-table-column>
      <sn-table-column label="用户信息" align="left" width="32%" sloted>
        <template slot-scope="row">
          <div class="info">
            <div class="info-img">
              <img :src="row.headPic|smallImage(80)" class="img-logo" alt="" v-show="(row.headPic||'')!=''">
            </div>
            <div class="info-title">
              <div>{{row.nickName}}</div>
              <div class="info-elements text-gray">
                <span v-for="elem in userElement" :key="elem.key" :class="[`elem-${elem.key}`,'elem-item']">
                  {{row[`${(elem.key)}Num`]}}
                </span>
              </div>
            </div>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label="兴趣标签" prop="userLabel" width="11%" sloted>
        <template slot-scope="row">
          <sn-td-ellipsis :str="getTagStr(row.userLabel)"></sn-td-ellipsis>
        </template>
      </sn-table-column>
      <sn-table-column label="注册来源" prop="resource" width="9%" sloted>
        <template slot-scope="row">
          {{getSourceItem(row.resource).name}}
        </template>
      </sn-table-column>
      <sn-table-column label="同步时间" prop="createTime" width="10%" sloted>
        <template slot-scope="row">
          <sn-td-date :time="row.createTime"></sn-td-date>
        </template>
      </sn-table-column>
      <sn-table-column label="最近登录时间" prop="lastLoginTime" width="10%" sloted>
        <template slot-scope="row">
          <sn-td-date :time="row.lastLoginTime"></sn-td-date>
        </template>
      </sn-table-column>
      <sn-table-column label="禁言状态" prop="flag" width="9%" sloted>
        <template slot-scope="row">
          <div>
            <sn-button type="warning" v-if="getBanItem(row.flag).key=='forever'">
              {{getBanItem(row.flag).name}}
            </sn-button>
            <span v-else>{{getBanItem(row.flag).name}}</span>
            <div class="day" v-show="getBanItem(row.flag).key!=='normal'&&getBanItem(row.flag).key!=='forever'">
              <sn-button type="warning" :gutter="5">
                {{`禁言剩余${row.blockDays}天`}}
              </sn-button>
            </div>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label="操作" sloted>
        <template slot-scope="row">
          <button @click.stop="showBanDialog(getBanItem(row.flag).key,row.pptvUserId)">
            {{getBanItem(row.flag).key==="normal"?"禁言":"解除禁言"}}
          </button>
        </template>
      </sn-table-column>
    </sn-table>
    <sn-confirm v-if="viewType=='ban'" title="禁言处理" @close="close" @sure="handleUser" noflag>
      <div class="modal-body">
        <div class="radio-group">
          <div class="is-line">
            <sn-radio label="short" v-model="banType">
              <span>禁言</span>
            </sn-radio>
            <div class="ban-ipt">
              <input ref="dayInput"
                :value="banDays"
                class="mini"
                type="text"
                :disabled="banType==='forever'"
                @blur="validInput($event.target.value)"
                @input="dayInputChange($event.target.value)">
              <span v-show="errMsg!==''" class="err-msg">{{errMsg}}</span>
            </div>
          </div>
          <sn-radio label="forever" v-model="banType" :style="{width:'80px'}">永久禁言</sn-radio>
        </div>
      </div>
    </sn-confirm>
    <sn-confirm v-if="viewType=='free'" title="解除禁言" @close="close" @sure="handleUser('free')" txt noflag>
      确认解除禁言吗？
    </sn-confirm>
  </div>
</template>

<script>
import DI from 'interface';
import * as Constant from 'js/constant';
const DEFAULT_SILENCE_DAYS = 1;

export default {
  name: 'UserList',
  componentName: 'UserList',
  props: {
    list: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data: () => ({
    userElement: Constant.USER_ELEMENT,
    selectedId: '',
    banType: 'short',
    banDays: DEFAULT_SILENCE_DAYS,
    errMsg: '',
    viewType: null
  }),
  watch: {
    banType(newVal) {
      if (newVal === 'forever') {
        this.errMsg = '';
      }
    },
    banDays(newVal) {
      if (newVal !== '') {
        this.errMsg = '';
      }
    }
  },
  methods: {
    getTagStr(str) {
      if (str) {
        return str.split(',').join(' / ');
      }
      return '';
    },
    getSourceItem(val) {
      return Constant.getItemByValue(Constant.USER_SOURCE, val);
    },
    getBanItem(val) {
      return Constant.getItemByValue(Constant.BANNED_STATUS, val);
    },
    dayInputChange(val) {
      let formatValue = val.trim().slice(0, 3);

      if (!/^\d+$/.test(formatValue) && formatValue != '') {
        this.$refs.dayInput.value = this.banDays;
        return;
      }

      this.banDays = formatValue;
    },
    validInput(val) {
      let reg = /^([1-2][0-9]{2}|3[0-5][0-9]|36[0-5]|[1-9][0-9]|[1-9])$/;

      if (!reg.test(val)) {
        this.errMsg = '请输入1-365数字';
      }
    },
    showBanDialog(type, id) {
      this.viewType = type === 'normal' ? 'ban' : 'free';
      this.selectedId = id;
    },
    handleUser(flag) {
      const loadingText = flag === 'free' ? '正在解除禁言' : '禁言中';
      let days = this.banType === 'short' ? this.banDays : 40000;

      if (days === '' && flag === 'ban') {
        this.errMsg = '请输入1-365数字';
        this.$refs.dayInput && this.$refs.dayInput.focus();
        return;
      }
      if (this.errMsg !== '') {
        return;
      }
      this.viewType = null;

      this.$ajax({
        url: DI.user.handleUser,
        context: this,
        loadingText,
        data: JSON.stringify({
          blockDays: flag == 'free' ? 0 : days,
          pptvUserId: this.selectedId
        }),
        success: res => {
          if (res.retCode == '0') {
            if (flag !== 'free') {
              this.banType = 'short';
              this.banDays = DEFAULT_SILENCE_DAYS;
            }

            this.$parent.queryList();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },

    close() {
      this.banType = 'short';
      this.banDays = DEFAULT_SILENCE_DAYS;
      this.viewType = null;
    }
  }
};
</script>

<style scoped>
button {
  color: #0abbfe;
}

.btn-group {
  height: 50px;
}

.modal-body {
  padding-bottom: 0px;
  width: 300px;
}

.day {
  margin-top: 10px;
}

.sn-button {
  height: 24px;
  padding: 0 10px;
}

.info {
  display: flex;
  align-items: center;
  height: 80px;
  .info-img,
  .img-logo {
    width: 80px;
    height: 80px;
    border: 1px solid #eee;
    border-radius: 80px;
  }
  .info-title {
    margin-left: 20px;
    color: #333333;
    font-size: 18px;
  }
}

.info-elements {
  display: flex;
  justify-content: space-between;
  padding-top: 8px;
  .elem-item {
    padding-left: 20px;
    background-repeat: no-repeat;
    background-size: 16px 16px;
    font-size: 16px;
    margin-right: 16px;
    &.elem-like {
      background-image: url(../../../assets/icon-like.png);
    }
    &.elem-follow {
      background-image: url(../../../assets/icon-follow.png);
    }
    &.elem-comment {
      background-image: url(../../../assets/icon-comment.png);
    }
  }
}

.radio-group {
  display: flex;
  flex-direction: column;
  margin-left: 15px;

  .is-line {
    margin-bottom: 15px;
  }

  .radio {
    display: flex;
    align-items: center;
    margin-left: 0;
    margin-right: 0;
    padding-bottom: 0;
    & + .radio {
      margin-top: 10px;
    }
  }

  .ban-ipt {
    position: relative;

    &::before {
      content: '\5929';
      position: absolute;
      left: 41px;
      top: 3px;
      font-size: 11px;
      color: #666;
    }

    .mini {
      border: 1px solid #ccc;
      border-radius: 16px;
      color: #0abbfe;
      margin-left: 10px;
      width: 50px;
      padding-left: 7px;
      padding-right: 19px;
    }

    .err-msg {
      color: red;
      font-size: 14px;
    }
  }
}

.text-gray {
  color: #666;
}
</style>
