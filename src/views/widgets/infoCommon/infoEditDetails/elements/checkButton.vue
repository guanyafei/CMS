<template>
  <sn-form-item>
    <sn-button type="primary" @click="doCheck">敏感词检查</sn-button>
    <span class="msg" v-show="checkDone">
      <span v-if="errMsgList.length!==0">
        检测出以下敏感词：
        <span class="words">{{sensitiveWords}}</span>
      </span>
      <span v-else>未检查到敏感词汇</span>
    </span>
  </sn-form-item>
</template>

<script>
  export default {
    name: 'CheckButton',
    props: ['errMsgList'],
    data() {
      return {
        checkDone: false,
      }
    },
    computed: {
      sensitiveWords() {
        return this.errMsgList.join(";");
      }
    },
    methods: {
      doCheck() {
        this.$emit('checkFields');
        this.$nextTick(()=>{
          this.checkDone = true;
        })
      }
    }
  };
</script>

<style scoped>
.words {
  color: red;
}
</style>

