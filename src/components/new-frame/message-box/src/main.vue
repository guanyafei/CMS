<template>
  <transition name="msgbox-fade">
    <div class="sn-message-box__wrapper" :class="[mask ? 'sn-message__mask' : '']" tabindex="-1" v-show="visible" @click.self="handleWrapperClick">
      <div class="sn-message-box" :class="[customClass, center && 'sn-message-box--center']">
        <div class="sn-message-box__header" v-if="title !== undefined">
          <div class="sn-message-box__title">{{ title || t('el.messagebox.title') }}</div>
          <button type="button" class="sn-message-box__headerbtn" aria-label="Close" v-if="showClose" @click="handleAction('cancel')">
            <i class="sn-message-box__close sn-icon-close"></i>
          </button>
        </div>
        <div class="sn-message-box__content" v-if="message !== ''">
          <!-- <div class="sn-message-box__status" :class="[ typeClass ]"></div> -->
          <div class="sn-message-box__message">
            <slot>
              <p>{{ message }}</p>
            </slot>
          </div>
        </div>
        <div class="sn-message-box__btns">
          <sn-button
            :loading="cancelButtonLoading"
            :class="[ cancelButtonClasses ]"
            v-show="showCancelButton"
            @click.native="handleAction('cancel')"
          >
            {{ cancelButtonText || '取消'}}
          </sn-button>
          <sn-button
            type="primary"
            :loading="confirmButtonLoading"
            ref="confirm"
            :class="[ confirmButtonClasses ]"
            v-show="showConfirmButton"
            @click.native="handleAction('confirm')"
            :disabled="confirmButtonDisabled"
          >
            {{ confirmButtonText || '确认'}}
          </sn-button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/babel">
import Popup from 'utils/popup';
import { addClass, removeClass } from 'utils/dom';
/**
 * message-box
 * @module src/component/message-box
 * @desc   用于提醒或确认的弹窗，比如：删除确认操作
 */
let typeMap = {
  success: 'success',
  info: 'info',
  warning: 'warning',
  error: 'danger'
};

export default {
  mixins: [Popup],

  props: {
    modal: {
      default: true
    },
    lockScroll: {
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      default: true
    },
    closeOnPressEscape: {
      default: true
    },
    center: {
      default: true,
      type: Boolean
    }
  },

  computed: {
    typeClass() {
      return this.type && typeMap[this.type] ? `sn-icon-${typeMap[this.type]}` : '';
    },

    confirmButtonClasses() {
      return `sn-button--primary ${this.confirmButtonClass}`;
    },
    cancelButtonClasses() {
      return `${this.cancelButtonClass}`;
    }
  },

  methods: {
    getSafeClose() {
      const currentId = this.uid;
      return () => {
        this.$nextTick(() => {
          if (currentId === this.uid) this.doClose();
        });
      };
    },
    doClose() {
      if (!this.visible) return;
      this.visible = false;
      this._closing = true;

      this.onClose && this.onClose();

      if (this.lockScroll) {
        setTimeout(() => {
          if (this.modal && this.bodyOverflow !== 'hidden') {
            document.body.style.overflow = this.bodyOverflow;
            document.body.style.paddingRight = this.bodyPaddingRight;
          }
          this.bodyOverflow = null;
          this.bodyPaddingRight = null;
        }, 200);
      }
      this.opened = false;

      if (!this.transition) {
        this.doAfterClose();
      }
      if (this.action) this.callback(this.action, this);
    },

    handleWrapperClick() {
      if (this.closeOnClickModal) {
        this.handleAction('cancel');
      }
    },

    handleAction(action) {
      if (this.$type === 'prompt' && action === 'confirm' && !this.validate()) {
        return;
      }
      this.action = action;
      if (typeof this.beforeClose === 'function') {
        this.close = this.getSafeClose();
        this.beforeClose(action, this, this.close);
      } else {
        this.doClose();
      }
    },

    validate() {
      if (this.$type === 'prompt') {
        var inputPattern = this.inputPattern;
        if (inputPattern && !inputPattern.test(this.inputValue || '')) {
          this.editorErrorMessage = this.inputErrorMessage;
          addClass(this.$refs.input.$el.querySelector('input'), 'invalid');
          return false;
        }
        var inputValidator = this.inputValidator;
        if (typeof inputValidator === 'function') {
          var validateResult = inputValidator(this.inputValue);
          if (validateResult === false) {
            this.editorErrorMessage = this.inputErrorMessage;
            addClass(this.$refs.input.$el.querySelector('input'), 'invalid');
            return false;
          }
          if (typeof validateResult === 'string') {
            this.editorErrorMessage = validateResult;
            return false;
          }
        }
      }
      this.editorErrorMessage = '';
      removeClass(this.$refs.input.$el.querySelector('input'), 'invalid');
      return true;
    }
  },

  watch: {
    inputValue: {
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          if (this.$type === 'prompt' && val !== null) {
            this.validate();
          }
        });
      }
    },

    visible(val) {
      if (val) this.uid++;
      if (this.$type === 'alert' || this.$type === 'confirm') {
        this.$nextTick(() => {
          this.$refs.confirm.$el.focus();
        });
      }
      if (this.$type !== 'prompt') return;
      if (val) {
        setTimeout(() => {
          if (this.$refs.input && this.$refs.input.$el) {
            this.$refs.input.$el.querySelector('input').focus();
          }
        }, 500);
      } else {
        this.editorErrorMessage = '';
        removeClass(this.$refs.input.$el.querySelector('input'), 'invalid');
      }
    }
  },

  data() {
    return {
      uid: 1,
      title: undefined,
      message: '',
      type: '',
      customClass: '',
      inputValue: null,
      inputPlaceholder: '',
      inputPattern: null,
      inputValidator: null,
      inputErrorMessage: '',
      showConfirmButton: true,
      showCancelButton: false,
      action: '',
      confirmButtonText: '',
      cancelButtonText: '',
      confirmButtonLoading: false,
      cancelButtonLoading: false,
      confirmButtonClass: '',
      confirmButtonDisabled: false,
      cancelButtonClass: '',
      editorErrorMessage: null,
      callback: null
    };
  }
};
</script>
<style>
:root {
  --sn-message-box-color_1: #20a0ff;
  --sn-message-box-color_2: #13ce66;
  --sn-message-box-color_3: #f7ba2a;
  --sn-message-box-color_4: #ff4949;
  --sn-message-box-color_5: #50bfff;
  --sn-message-box-color_6: #999;
  --sn-message-box-color_7: #48576a;
  --sn-message-box-color_8: #333;
  --sn-message-box-background: #fff;
  --sn-message-box-border_color: #ff4949;
  --border_right_color_1: rgba(255, 255, 255, 0.5);
  --border_left_color_1: rgba(255, 255, 255, 0.5);
}
.sn-message-box {
  &.sn-message-box--center {
    text-align: center;
  }
  text-align: left;
  display: inline-block;
  vertical-align: middle;
  background-color: var(--sn-message-box-background);
  width: 420px;
  border-radius: 3px;
  font-size: 16px;
  overflow: hidden;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.sn-message-box__wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  &::after {
    content: '';
    display: inline-block;
    height: 100%;
    width: 0;
    vertical-align: middle;
  }
}
.sn-message__mask{
  background: rgba(0, 0, 0, 0.4);
}
.sn-message-box__header {
  position: relative;
  padding: 20px 20px 0;
}

.sn-message-box__headerbtn {
  position: absolute;
  top: 19px;
  right: 20px;
  background: 0 0;
  border: none;
  outline: 0;
  padding: 0;
  cursor: pointer;
  .sn-message-box__close {
    color: var(--sn-message-box-color_6);
  }
  &:focus {
    .sn-message-box__close {
      color: var(--sn-message-box-color_1);
    }
  }
  &:hover {
    .sn-message-box__close {
      color: var(--sn-message-box-color_1);
    }
  }
}

.sn-message-box__content {
  padding: 30px 20px;
  color: var(--sn-message-box-color_7);
  font-size: 14px;
  position: relative;
}

.sn-message-box__input {
  padding-top: 15px;
  input.invalid {
    border-color: var(--sn-message-box-border_color);
    &:focus {
      border-color: var(--sn-message-box-border_color);
    }
  }
}

.sn-message-box__errormsg {
  color: var(--sn-message-box-color_4);
  font-size: 12px;
  min-height: 18px;
  margin-top: 2px;
}

.sn-message-box__title {
  padding-left: 0;
  margin-bottom: 0;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  height: 18px;
  color: var(--sn-message-box-color_8);
}

.sn-message-box__message {
  margin: 0;
  p {
    margin: 0;
    line-height: 1.4;
  }
}

.sn-message-box__btns {
  padding: 10px 20px 15px;
  text-align: right;
  display: flex;
  justify-content: center;
  button {
    &:nth-child(2) {
      margin-left: 10px;
    }
  }
}

.sn-message-box__btns-reverse {
  -ms-flex-direction: row-reverse;
  flex-direction: row-reverse;
}

.sn-message-box__status {
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 36px !important;
}

.msgbox-fade-enter-active {
  animation: msgbox-fade-in 0.3s;
}

.msgbox-fade-leave-active {
  animation: msgbox-fade-out 0.3s;
}

@keyframes msgbox-fade-in {
  0% {
    transform: translate3d(0, -20px, 0);
    opacity: 0;
  }
  100% {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}

@keyframes msgbox-fade-out {
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

