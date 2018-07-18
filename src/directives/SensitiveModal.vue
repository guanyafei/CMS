<template>
  <transition appear name="v-sensitive-fade">
    <div v-if="!closed" class="fullscreen-v-sensitive" @click.self="close">
      <div class="v-sensitive__modal">
        <div class="v-sensitive-modal__header">
          敏感词提示
        </div>
        <div class="v-sensitive-modal__body">
          <div class="v-sensitive-modal__tip">
            <img src="../assets/warning.png"> 内容中检测出敏感词汇，请慎重检查~
          </div>
          <div class="words">
            <span class="title">敏感词汇：</span>
            <span class="word" v-for="(word, index) in sensitiveMsgList" :key="index">{{word}}</span>
          </div>
        </div>
        <div class="v-sensitive-modal__footer">
          <sn-button size="mini" type="primary" @click="nextStep">继续保存</sn-button>
          <sn-button size="mini" @click="close">返回检查</sn-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'v-sensitive',
  data () {
    return {
      closed: true,
      sensitiveMsgList: [],
      handlers: {}
    }
  },
  methods: {
    close () {
      this.closed = true;
    },
    nextStep () {
      this.closed = true;
      this.handlers.ok();
    }
  }
}
</script>
<style scoped>
.fullscreen-v-sensitive {
  z-index: 9999;
  height: 100%;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.7);
  -ms-touch-action: none;
  touch-action: none;
}
.v-sensitive__modal {
  position: relative;
  top: 150px;
  width: 480px;
  max-height: 680px;
  padding-bottom: 20px;
  margin: 0 auto;
  border-radius: 4px;
  overflow-y: visible;
  font-size: 16px;
  background-color: #fff;
  .v-sensitive-modal__header {
    height: 50px;
    border-bottom: 1px solid #f0f1f5;
    text-align: center;
    font-size: 16px;
    line-height: 50px;
    color: #4a515b;
  }
  .v-sensitive-modal__body {
    padding: 20px 30px 0;
  }
  .v-sensitive-modal__tip {
    display: flex;
    justify-content: center;
    font-size: 12px;
    text-align: center;
    img {
      display: inline-block;
      vertical-align: text-bottom;
      width: 16px;
      height: auto;
      margin-right: 6px;
    }
  }
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
  .v-sensitive-modal__footer {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    button {
      margin: 0 20px;
    }
  }
  .v-sensitive-fade-enter,
  .v-sensitive-fade-leave-to {
    opacity: 0;
  }
  .v-sensitive-fade-enter-active,
  .v-sensitive-fade-leave-active {
    -webkit-transition: opacity 0.3s ease-in-out;
    transition: opacity 0.3s ease-in-out;
  }
}
</style>

