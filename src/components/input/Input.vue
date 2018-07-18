<template>
  <div class="container-box" :class="[{'is-error': errMsg!==''}]">
    <div :class="['input-box',{
              'is-disabled': disabled,
              'no-border': noBorder,
              'is-append': $slots.append,
              'is-prepend': $slots.prepend
            }]"
      v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="input__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input
        class="input__inner"
        :class="[{'is-error': errMsg!==''}, circleClass]"
        v-bind="$props"
        :value="currentValue"
        :maxlength="maxLimitLength"
        :placeholder="placeholder"
        :inputType="inputType"
        ref="input"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        :style="getStyle"
        :disabled="disabled"
        :readOnly="readOnly"
      />
      <!-- 后置元素 -->
      <div class="input__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
      <span v-if="showWord" class="words" :style="getWordStyle">
        {{($props.value||'').trim().length}}/{{totalWords}}
      </span>
      <span class="err-tip" v-show='errMsg!==""' :style="errorTipStyle">{{errMsg}}</span>
    </div>
    <div :class="['textarea-box',{'is-disabled':disabled,'no-border': noBorder},alignWord]" v-else>
      <div class="textarea__group" :style="getStyle">
        <textarea
          class="textarea__inner"
          :value="currentValue"
          :maxlength="maxLimitLength"
          @input="handleInput"
          ref="textarea"
          v-bind="$props"
          @focus="handleFocus"
          @blur="handleBlur"
          :rows="rows">
        </textarea>
        <span
          v-if="showWord"
          class="words"
          :style="getWordTextStyle"
        >{{($props.value||'').trim().length}}/{{totalWords}}</span>
      </div>
      <span class="err-tip" v-show='errMsg!==""' :style="errorTipStyle">{{ errMsg }}</span>
    </div>
  </div>
</template>
<script>
import emitter from 'mixins/emitter';

export default {
  name: 'Input',
  componentName: 'Input',
  mixins: [emitter],
  props: {
    value: [String, Number],
    placeholder: String,
    disabled: Boolean,
    align: {
      type: String,
      default: 'left'
    },
    width: {
      type: String,
      default: '360'
    },
    height: [String, Number],
    radius: {
      type: String,
      default: '4'
    },
    type: {
      type: String,
      default: 'text'
    },
    showWord: {
      type: Boolean,
      default: false
    },
    alignWord: {
      type: String,
      default: 'bottom'
    },
    inputType: {
      type: String,
      default: 'String'
    },
    name: String,
    rows: {
      type: Number,
      default: 2
    },
    maxlength: [Number, String],
    minlength: [Number, String],
    validateEvent: {
      type: Boolean,
      default: true
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    totalWords: {
      type: Number,
      default: 30
    },
    noBorder: {
      type: Boolean,
      default: false
    },
    reg: {
      type: RegExp
    },
    hint: {
      type: String //提示
    },
    autoValid: {
      type: Boolean
    },
    required: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    inputHeight() {
      let defaultHeight = '32';
      if (this.type === 'textarea') {
        defaultHeight = '75';
      }

      return this.height || defaultHeight;
    },
    errorTipStyle() {
      return `top:${this.inputHeight}px`;
    },
    circleClass() {
      if (this.radius == 16) {
        return 'is-circle';
      }

      return '';
    },
    getStyle() {
      if (this.width.indexOf('%') != -1) {
        return `width:${this.width};
                height:${this.inputHeight}px;
                text-align:${this.align};`;
      }

      return `width:${this.width}px;
              height:${this.inputHeight}px;
              text-align:${this.align};`;
    },
    getWordStyle() {
      return `left: ${this.width - 45}px`;
    },
    getWordTextStyle() {
      return `right: 10px`;
    },
    maxLimitLength() {
      if (this.showWord) {
        return this.maxlength || this.totalWords;
      }
      return this.maxlength;
    }
  },
  data() {
    return {
      currentValue: this.value,
      errMsg: ''
    };
  },
  watch: {
    value(val, oldValue) {
      let value = '' + val;
      if (value && this.inputType === 'number') {
        value = value.replace(/[^\d]/g, '');
      }
      this.setCurrentValue(value);
      if (!value && this.autoValid) {
        this.check();
      }
    }
  },
  created() {
    this.$on('inputSelect', this.inputSelect);
  },
  beforeDestroy() {
    this.errMsg = '';
  },
  methods: {
    check(writeValue) {
      if (writeValue == null) {
        writeValue = this.value;
      }
      let val = ((writeValue || '') + '').trim();
      this.errMsg = '';
      if (val === '') {
        if (this.required) {
          this.errMsg = '不能为空';
          return;
        }
      } else {
        if (this.minlength) {
          if (val.length < this.minlength) {
            this.errMsg = `字符长度不能小于${this.minlength}`;
            return;
          }
        }

        if (this.maxLimitLength) {
          if (val.length > this.maxLimitLength) {
            this.errMsg = `字符长度不能大于${this.maxLimitLength}`;
            return;
          }
        }

        if (this.reg) {
          if (!this.reg.test(val)) {
            this.errMsg = this.hint || '格式不正确';
            return;
          }
        }
      }

      return true;
    },
    focus() {
      this.$refs.input.focus();
    },
    setMsg(val) {
      val = val ? val : '';
      this.errMsg = val;
    },
    handleFocus(event) {
      this.$emit('focus', event);
    },
    handleBlur(event) {
      let checkVal = true;
      if (this.autoValid) {
        checkVal = this.check();
      }
      this.$emit('blur', event, checkVal);
      if (this.validateEvent) {
        this.dispatch('FormItem', 'form.blur', [this.currentValue]);
      }
    },
    handleInput(event) {
      let value = event.target.value.trim();
      if (this.autoValid) {
        this.check(value);
      }
      if (value && this.inputType === 'number') {
        value = value.replace(/[^\d]/g, '');
        this.$refs.input.value = value;
      }

      this.$emit('input', value);
      this.setCurrentValue(value);
      this.$emit('change', value);
    },
    handleBtn() {
      this.$emit('click', this.currentValue);
    },
    setCurrentValue(value) {
      if (value === this.currentValue) return;
      this.currentValue = value;
      if (this.validateEvent) {
        this.dispatch('FormItem', 'form.change', [value]);
      }
    }
  }
};
</script>
<style scoped>
.form-item.is-error .input-box .input__inner,
.form-item.is-error .textarea-box .textarea__group {
  border: 1px solid #f47b77;
}
.err-tip {
  position: absolute;
  left: 0;
  color: #ff4949;
  font-size: 12px;
}
.container-box {
  &.is-error .textarea-box .textarea__inner {
    border: 1px solid #f47b77;
  }
  &.lg {
    .input__inner {
      height: 40px;
    }
  }
  .input-box {
    position: relative;
    &.no-border {
      .input__inner {
        border: none;
      }
    }
    &.is-disabled {
      .input__inner {
        cursor: not-allowed;
        background-color: #eef1f6;
        border-color: #d1dbe5;
        color: #bbb;
      }
    }
    &.is-append {
      display: flex;
      > .input__inner {
        flex: 1;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
    }
    &.is-prepend {
      display: flex;
      > .input__inner {
        flex: 1;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
    .input__inner {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background-color: #fff;
      background-image: none;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      color: #666;
      display: block;
      font-size: 12px;
      height: 32px;
      line-height: 1;
      outline: none;
      padding: 3px 26px 3px 10px;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      width: 100%;
      &.is-error {
        border-color: #ff4949;
      }
      &:focus:not(.is-error) {
        border-color: #20a0ff;
      }
      &.is-circle {
        border-radius: 16px;
      }
    }
    .input__prepend,
    .input__append {
      background-color: rgb(251, 253, 255);
      color: rgb(151, 168, 190);
      vertical-align: middle;
      display: table-cell;
      position: relative;
      border: 1px solid rgb(191, 203, 217);
      border-radius: 4px;
      white-space: nowrap;
      .input__inner {
        border: 0;
      }
    }
    .input__append {
      border-left: 0;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
    .input__prepend {
      border-right: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    .words {
      position: absolute;
      top: 10px;
      color: #bbb;
      right: 10px;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
    }
  }
  .textarea-box {
    position: relative;
    &.no-border {
      .textarea__group {
        border: none;
      }
    }
    &.top {
      .words {
        top: -22px;
        right: 10px;
      }
    }
    &.is-disabled {
      .textarea__group,
      .textarea__inner {
        cursor: not-allowed;
        background-color: #eef1f6;
        border-color: #d1dbe5;
        color: #bbb;
      }
    }
    .textarea__group {
      position: relative;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      border: 1px solid #ccc;
      border-radius: 4px;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
    .textarea__inner {
      display: block;
      width: 100%;
      flex: 1 1 auto;
      overflow: auto;
      padding: 5px 7px;
      box-sizing: border-box;
      color: #666;
      line-height: 1.5;
      font-size: 14px;
      resize: none;
      background-image: none;
      background-color: #fff;
    }
    .words {
      align-self: flex-end;
      margin-right: 5px;
      margin-bottom: 5px;
      color: #bbb;
    }
  }
}
</style>
