<template>
  <!-- 用户禁言-->
  <div id="forbidden-option">
    <button class="mt-5" @click.stop='viewType=true'>
      {{ txt.title }}
    </button>
    <sn-confirm v-if="viewType" :title="txt.title" @close="close" @sure="submit" noflag :txt="!isForbiddenAction">
      <div class="modal-body" v-if="isForbiddenAction">
        <label class="labels">用户禁言</label>
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
                maxlength="3"
                :disabled="banType==='forever'"
                @blur="validInput($event.target.value)"
                @input="dayInputChange($event.target.value)">
              <span v-show="errMsg!==''" class="err-msg">{{ errMsg }}</span>
            </div>
          </div>
          <sn-radio label="forever" v-model="banType" :style="{width:'80px'}">永久禁言</sn-radio>
        </div>
        <p class="tips">是否隐藏该用户历史评论（最近一个月）</p>
        <sn-radio-group v-model="clearHistory" class="forTips">
          <sn-radio :label="1">是</sn-radio>
          <sn-radio :label="0">否</sn-radio>
        </sn-radio-group>
      </div>
      <template v-else>
        确认解除禁言吗？
      </template>
    </sn-confirm>
  </div>
</template>

<script>
import * as Constant from "js/constant";
import DI from "interface";
import { setTimeout } from 'timers';
const DEFAULT_SILENCE_DAYS = 1;

export default {
  name: "ToggleForbidden",
  props: ["row"],
  data() {
    return {
      banType: "short",
      banDays: DEFAULT_SILENCE_DAYS,
      errMsg: "",
      viewType: null,
      clearHistory:0//是否隐藏评论一个月
    };
  },
  watch: {
    banType(newVal) {
      if (newVal === "forever") {
        this.errMsg = "";
      }
    },
    banDays(newVal) {
      if (newVal !== "") {
        this.errMsg = "";
      }
    },
    viewType (newVal) {
      if (!newVal && this.isForbiddenAction) {
        this.reset();
      }
    }
  },
  computed: {
    forbiddenStatusObj() {
      return Constant.getItemByValue(
        Constant.BANNED_STATUS,
        this.row.forbiddenStatus
      );
    },
    isForbiddenAction() {
      return this.forbiddenStatusObj.key === "normal";
    },
    txt() {
      if (this.isForbiddenAction) {
        return {
          title: "用户禁言",
          loadingText: "正在解除禁言，请稍候！"
        };
      } else {
        return {
          title: "解除禁言",
          loadingText: "禁言中，请稍候！"
        };
      }
    }
  },
  methods: {
    dayInputChange(val) {
      let formatValue = val.trim().slice(0, 3);

      if (!/^\d+$/.test(formatValue) && formatValue != "") {
        this.$refs.dayInput.value = this.banDays;
        return;
      }

      this.banDays = formatValue;
    },
    validInput(val) {
      let reg = /^([1-2][0-9]{2}|3[0-5][0-9]|36[0-5]|[1-9][0-9]|[1-9])$/;

      if (!reg.test(val)) {
        this.errMsg = "请输入1-365数字";
      }
    },
    close() {
      this.viewType = null;
    },
    reset() {
      this.errMsg = "";
      this.banDays = DEFAULT_SILENCE_DAYS;
      this.clearHistory = 0;
      this.banType = "short";
    },
    submit() {
      let days = this.banType === "short" ? this.banDays : 40000;

      if (days === "" && this.isForbiddenAction) {
        this.errMsg = "请输入1-365数字";
        this.$refs.dayInput && this.$refs.dayInput.focus();
        return;
      }
      if (this.errMsg !== "") {
        return;
      }
      this.viewType = null;
      this.$ajax({
        url: DI.commentLibrary.forbiddenComment,//626 wuxa 清除一个月历史
        context: this,
        loadingText: this.txt.loadingText,
        data: JSON.stringify({
          blockDays: this.isForbiddenAction ? days : 0,
          isHidden: this.clearHistory,
          pptvUserId: this.row.userId
        }),
        success: res => {
          if (res.retCode == "0") {
            setTimeout(()=>{
            this.$bus.$emit("reload");
            },1000)
          } else {
            this.viewType = true;
            this.$message.warning(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    }
  }
};
</script>

<style scoped>
button {
  color: #0abbfe;
}
.modal-body {
  padding-bottom: 0px;
  width: 375px;
}

.day {
  margin-top: 5px;
  .sn-button {
    height: 24px;
    padding: 0 10px;
  }
}
.labels{
  float: left;
  width:80px;
  font-size: 14px; 
  line-height: 22px;
  text-align: left;
}
p.tips{
  padding-top:15px;
  padding-bottom:15px;
  font-size: 14px;
  text-align: left;
}
.forTips{
  margin-left: 80px !important;
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
    margin-top: 0;
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
      content: "\5929";
      position: absolute;
      left: 53px;
      font-size: 11px;
      line-height:25px;
      color: #666;
    }

    .mini {
      border: 1px solid #ccc;
      border-radius: 4px;
      color: #0abbfe;
      margin-left: 10px;
      width: 60px;
      height: 25px;
      padding-left: 7px;
      padding-right: 19px;
    }

    .err-msg {
      color: red;
      font-size: 14px;
    }
  }
}
</style>
<style>
#forbidden-option{
    .sn-popup .sn-popup-modal .sn-popup-title{
        font-weight: bolder;
    }
}
</style>
