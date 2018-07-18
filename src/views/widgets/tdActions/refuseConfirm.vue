<template>
  <sn-confirm v-show="viewType=='refuse'||viewType=='batchRefuse'" title='资讯驳回' @close="close" @sure="confirmRefuse" noflag>
    <div class="modal-body">
      <sn-radio-group v-model="reasonKey">
        <sn-radio :label="item.key" :key="item.key" v-for="item in refuseReasons">{{item.name}}</sn-radio>
      </sn-radio-group>
      <sn-input 
        v-model="reason" 
        type="textarea" 
        width="440"
        height="75" 
        showWord 
        :totalWords=20 
        :disabled="reasonKey!=='others'" 
        placeholder="请输入驳回理由（20个文字以内）"
      >
      </sn-input>
    </div>
    <div class="err-tips" v-show="errMsg!==''">{{errMsg}}</div>
  </sn-confirm>
</template>

<script>
import * as Constant from 'js/constant'

export default {
  name: 'RefuseConfirm',
  componentName: 'RefuseConfirm',
  props: ['viewType'],
  data() {
    return {
      reasonKey: "",
      reason: "",
      errMsg: "",
      refuseReasons: Constant.REFUSE_REASONS,
    }
  },
  watch: {
    reason(newVal, oldVal) {
      if (newVal.trim() !== "") {
        this.errMsg = '';
      }
    },
    rejectReason(newVal, oldVal) {
      if (newVal.trim() !== "") {
        this.errMsg = '';
      }
    },
    reasonKey(newVal, oldVal) {
      if (newVal.trim() !== "") {
        this.errMsg = '';
      }
      
      if (oldVal === "others") {
        this.reason = '';
      }
    }
  },
  methods: {
    confirmRefuse() {
      let rejectReason = null;

      if (this.reasonKey === "") {
        this.errMsg = "请选择驳回理由!";
        return;
      } else if (this.reasonKey === "others") {
        rejectReason = this.reason;
      } else {
        rejectReason = Constant.getItemByKey(Constant.REFUSE_REASONS, this.reasonKey).name;
      }

      if (rejectReason === '') {
        this.errMsg = "请填写驳回理由!";
        return;
      }
      this.$parent.confirmRefuse(rejectReason)
    },
    close() {
      this.reasonKey = '',
      this.reason = '';
      this.errMsg = '';
      this.$parent.close()
    },
  },
};
</script>

<style scoped>
.modal-body {
  width: 517px;
  .radio-group {
    display: flex;
    flex-wrap: wrap;
    .radio {
      margin-left: 0px;
      display: flex;
      align-items: center;
    }
    label {
      display: inline-block;
      width: 125px;
    }
  }
}
.err-tips {
  color: red;
  margin-left: 28px;
}
</style>
