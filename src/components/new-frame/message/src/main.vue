<template>
  <transition name="sn-message-fade">
    <div
      :class="['sn-message',
        type && !iconClass ? `sn-message--${ type }` : '',
        center ? 'is-center' : '',
      ]"
      v-show="visible"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <div class="sn-message__group" :class="{ 'is-with-icon': iconClass }">
        <p>
          <i class="sn-message__icon" :class="iconClass" v-if="iconClass"></i>
          <i class="sn-message__icon" :class="typeClass" v-if="type"></i>
          {{ message }}
        </p>
        <div v-if="showClose" class="sn-message__closeBtn sn-icon-close" @click="close"></div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
let typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'error'
};
export default {
  data() {
    return {
      visible: false,
      message: '',
      duration: 3000,
      type: 'info',
      iconClass: '',
      customClass: '',
      onClose: null,
      showClose: false,
      closed: false,
      center: false,
      timer: null
    };
  },
  watch: {
    closed(newVal) {
      if (newVal) {
        this.visible = false;
        this.$el.addEventListener('transitionend', this.destroyElement);
      }
    }
  },
  computed: {
    typeClass() {
      return this.type && !this.iconClass ? `sn-message__icon sn-icon-${typeMap[this.type]}` : '';
    }
  },
  methods: {
    destroyElement() {
      this.$el.removeEventListener('transitionend', this.destroyElement);
      this.$destroy(true);
      this.$el.parentNode.removeChild(this.$el);
    },
    close() {
      this.closed = true;
      if (typeof this.onClose === 'function') {
        this.onClose(this);
      }
    },
    clearTimer() {
      clearTimeout(this.timer);
    },
    startTimer() {
      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          if (!this.closed) {
            this.close();
          }
        }, this.duration);
      }
    }
  },
  mounted() {
    this.startTimer();
  }
};
</script>
<style>
:root {
  --sn-message-bgcolor--success: #a9d86e;
  --sn-message-bgcolor--error: #f56c6c;
  --sn-message-bgcolor--warning: #f7ba2a;
  --sn-message-bgcolor--info: #909399;
}

.sn-message {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  min-width: 300px;
  padding: 10px 12px;
  box-sizing: border-box;
  border-radius: 2px;
  position: fixed;
  left: 50%;
  top: 20px;
  -ms-transform: translateX(-50%);
  transform: translateX(-50%);
  transition: opacity 0.3s, transform 0.4s;
  overflow: hidden;
  color: #ffffff;
  &.sn-message--success {
    background-color: var(--sn-message-bgcolor--success);
  }
  &.sn-message--error {
    background-color: var(--sn-message-bgcolor--error);
  }
  &.sn-message--info {
    background-color: var(--sn-message-bgcolor--info);
  }
  &.sn-message--warning {
    background-color: var(--sn-message-bgcolor--warning);
  }
}
.sn-message__closeBtn {
  cursor: pointer;
}
.sn-message__group {
  margin-left: 38px;
  position: relative;
  height: 20px;
  line-height: 20px;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  p {
    font-size: 14px;
    margin: 0 34px 0 0;
    white-space: nowrap;
    text-align: justify;
  }
}

.sn-message-fade-enter {
  opacity: 0;
  -ms-transform: translate(-50%, -100%);
  transform: translate(-50%, -100%);
}

.sn-message-fade-leave-active {
  opacity: 0;
  -ms-transform: translate(-50%, -100%);
  transform: translate(-50%, -100%);
}
</style>

