<template>
  <transition name="sn-loading-fade" @after-leave="handleAfterLeave">
    <div v-show="visible" class="sn-loading-mask" :class="[customClass, { 'is-fullscreen': fullscreen }]">
      <div class="sn-loading-spinner">
        <svg class="circular" viewBox="25 25 50 50">
          <circle class="path" cx="50" cy="50" r="20" fill="none" />
        </svg>
        <p v-if="text" class="sn-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      text: null,
      fullscreen: true,
      visible: false,
      customClass: ''
    };
  },

  methods: {
    handleAfterLeave() {
      this.$emit('after-leave');
    },
    setText(text) {
      this.text = text;
    }
  }
};
</script>
<style>
.sn-loading-mask {
  position: absolute;
  z-index: 10000;
  background-color: rgba(0, 0, 0, 0.4);
  margin: 0;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transition: opacity 0.3s;
}

.sn-loading-mask.is-fullscreen {
  position: fixed;
  .sn-loading-spinner {
    margin-top: -25px;
    .circular {
      width: 50px;
      height: 50px;
    }
  }
}

.sn-loading-spinner {
  top: 30%;
  left: 50%;
  height: 120px;
  position: absolute;
  min-width: 200px;
  margin-top: -21px;
  padding: 20px 65px;
  transform: translateX(-50%);
  border-radius: 4px;
  background: #444;
  text-align: center;
  .sn-loading-text {
    color: #fff;
    margin: 3px 0;
    font-size: 14px;
  }
  .circular {
    width: 42px;
    height: 42px;
    animation: loading-rotate 2s linear infinite;
  }
  .path {
    animation: loading-dash 1.5s ease-in-out infinite;
    stroke-dasharray: 90, 150;
    stroke-dashoffset: 0;
    stroke-width: 2;
    stroke: #fff;
    stroke-linecap: round;
  }
}

.sn-loading-fade-enter {
  opacity: 0;
}

.sn-loading-fade-leave-active {
  opacity: 0;
}

@keyframes loading-rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes loading-dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -40px;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -120px;
  }
}
</style>

