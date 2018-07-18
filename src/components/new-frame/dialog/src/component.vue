<template>
  <transition name="dialog-fade">
    <div class="sn-dialog__wrapper" v-show="visible" @click.self="handleWrapperClick">
      <div class="sn-dialog" :class="[sizeClass, customClass]" ref="dialog" :style="style">
        <div class="sn-dialog__header">
          <slot name="title">
            <span class="sn-dialog__title">{{title}}</span>
          </slot>
          <button type="button" class="sn-dialog__headerbtn" aria-label="Close" v-if="showClose" @click="handleClose">
            <i class="sn-dialog__close sn-icon sn-icon-close"></i>
          </button>
        </div>
        <div class="sn-dialog__body" v-if="rendered">
          <slot></slot>
        </div>
        <div class="sn-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Popup from 'utils/popup';
import emitter from 'mixins/emitter';

export default {
  name: 'SnDialog',
  mixins: [Popup, emitter],
  props: {
    title: {
      type: String,
      default: ''
    },
    modal: {
      type: Boolean,
      default: true
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    lockScroll: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: false
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'small'
    },
    customClass: {
      type: String,
      default: ''
    },
    width: {
      type: Number
    },
    top: {
      type: String,
      default: '15%'
    },
    beforeClose: Function
  },
  watch: {
    visible(val) {
      this.$emit('update:visible', val);
      if (val) {
        this.$emit('open');
        this.$el.addEventListener('scroll', this.updatePopper);
        this.$nextTick(() => {
          this.$refs.dialog.scrollTop = 0;
        });
      } else {
        this.$el.removeEventListener('scroll', this.updatePopper);
        this.$emit('close');
      }
    }
  },
  computed: {
    sizeClass() {
      return `sn-dialog--${this.size}`;
    },
    style() {
      return this.size === 'full' ? {} : { top: this.top, width: this.width + 'px' };
    }
  },
  methods: {
    handleWrapperClick() {
      if (!this.closeOnClickModal) return;
      this.handleClose();
    },
    handleClose() {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide);
      } else {
        this.hide();
      }
    },
    hide(cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false);
        this.$emit('visible-change', false);
      }
    },
    updatePopper() {
      this.broadcast('ElSelectDropdown', 'updatePopper');
      this.broadcast('ElDropdownMenu', 'updatePopper');
    }
  },
  mounted() {
    if (this.visible) {
      this.rendered = true;
      this.open();
    }
  }
};
</script>
<style>
.v-modal-enter {
  animation: v-modal-in 0.2s ease;
}

.v-modal-leave {
  animation: v-modal-out 0.2s ease forwards;
}

@keyframes v-modal-in {
  0% {
    opacity: 0;
  }
}

@keyframes v-modal-out {
  100% {
    opacity: 0;
  }
}

.v-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  background: #000;
}

.sn-dialog {
  position: absolute;
  left: 50%;
  -ms-transform: translateX(-50%);
  transform: translateX(-50%);
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  box-sizing: border-box;
  margin-bottom: 50px;
  min-width: 380px;
}

.sn-dialog--tiny {
  width: 30%;
}

.sn-dialog--small {
  width: 50%;
}

.sn-dialog--large {
  width: 90%;
}

.sn-dialog--full {
  width: 100%;
  top: 0;
  margin-bottom: 0;
  height: 100%;
  overflow: auto;
}

.sn-dialog__wrapper {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  position: fixed;
  overflow: auto;
  margin: 0;
}

.sn-dialog__header {
  padding: 20px;
  border-bottom: 1px solid #f0f1f5;
  text-align: center;
}

.sn-dialog__headerbtn {
  float: right;
  background: 0 0;
  border: none;
  outline: 0;
  padding: 0;
  cursor: pointer;
  .sn-dialog__close {
    color: #999;
  }
  &:focus {
    .sn-dialog__close {
      color: #20a0ff;
    }
  }
  &:hover {
    .sn-dialog__close {
      color: #20a0ff;
    }
  }
}

.sn-dialog__title {
  line-height: 1;
  font-size: 16px;
  font-weight: 700;
  color: #000;
}

.sn-dialog__body {
  padding: 20px 20px 30px 20px;
  color: #48576a;
  font-size: 14px;
}

.sn-dialog__footer {
  padding: 10px 20px 15px;
  text-align: right;
  box-sizing: border-box;
  & > div {
    display: flex;
    justify-content: center;
  }
}

.dialog-fade-enter-active {
  animation: dialog-fade-in 0.3s;
}

.dialog-fade-leave-active {
  animation: dialog-fade-out 0.3s;
}

@keyframes dialog-fade-in {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes dialog-fade-out {
  0% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  100% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
}
</style>

