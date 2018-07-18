<template>
  <label :class="['checkbox',`checkbox__${theme}`]">
    <span :class="['checkbox-input',{'checked': isChecked, 'disabled': disabled,'partial-checked':isPartCheckStatus}]">
      <span class="checkbox-inner"></span>
      <input
        ref="checkbox"
        type="checkbox"
        class="checkbox-original"
        @change="handleChange"
        :name="name"
        v-model="model"
        :true-value="trueLabel"
        :false-value="falseLabel"
        :value="label"
      >
    </span>
    <span class="checkbox-label" v-if="$slots.default || label">
      <slot></slot>
    </span>
  </label>
</template>
<script>
import Emitter from 'mixins/emitter';

export default {
  name: 'Checkbox',
  props: {
    value: {},
    label: {},
    disabled: Boolean,
    checked: Boolean,
    name: String,
    trueLabel: {
      type:[String, Number, Boolean],
      default: true
    },
    falseLabel: {
      type:[String, Number, Boolean],
      default: false
    },
    isPartCheckStatus: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'default'
    }
  },
  mixins: [Emitter],
  computed: {
    model: {
      get() {
        return this.isGroup ? this.store : this.value !== undefined ? this.value : this.selfModel;
      },
      set(val) {
        if (this.disabled) {
          return;
        }
        if (this.isGroup) {
          //多个checkbox
          let isLimitExceeded = false;
          this._checkboxGroup.min !== undefined && val.length < this._checkboxGroup.min && (isLimitExceeded = true);

          this._checkboxGroup.max !== undefined && val.length > this._checkboxGroup.max && (isLimitExceeded = true);

          isLimitExceeded === false && this.dispatch('CheckboxGroup', 'input', [val]);
        } else if (this.value !== undefined) {
          //单个checkbox
          this.$emit('input', val);
        } else {
          this.selfModel = val;
        }
      }
    },
    isGroup() {
      let parent = this.$parent;
      while (parent) {
        if (parent.$options.componentName !== 'CheckboxGroup') {
          parent = parent.$parent;
        } else {
          this._checkboxGroup = parent;
          return true;
        }
      }
      return false;
    },
    isChecked() {
      if ({}.toString.call(this.model) === '[object Boolean]') {
        return this.model;
      } else if (Array.isArray(this.model)) {
        return this.model.indexOf(this.label) > -1;
      } else if (this.model !== null && this.model !== undefined) {
        return this.model === this.trueLabel;
      }
    },
    store() {
      return this._checkboxGroup ? this._checkboxGroup.value : this.value;
    }
  },
  created() {
    this.checked && this.addToStore();
  },
  methods: {
    addToStore() {
      if (Array.isArray(this.model) && this.model.indexOf(this.label) === -1) {
        this.model.push(this.label);
      } else {
        this.model = this.trueLabel || true;
      }
    },
    handleChange(ev) {
      if (this.disabled) {
        return;
      }
      this.$emit('change', ev);
      if (this.isGroup) {
        this.$nextTick(_ => {
          this.dispatch('CheckboxGroup', 'change', [this._checkboxGroup.value]);
        });
      }
    }
  }
};
</script>
<style scoped>
.checkbox {
  color: #1f2d3d;
  position: relative;
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  -webkit-user-select: none;

  .checkbox-label {
    font-size: 14px;
    color: #666;
    padding-left: 4px;
  }
  & + .checkbox {
    margin-left: 15px;
  }
  .checkbox-input {
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: top;
    .checkbox-inner {
      display: inline-block;
      position: relative;
      border: 1px solid #cccccc;
      box-sizing: border-box;
      width: 16px;
      height: 16px;
      z-index: 1;
      color: #666;
      background-color: #fff;
    }
  }
  .checkbox-original {
    opacity: 0;
    outline: none;
    position: absolute;
    margin: 0;
    width: 0;
    height: 0;
    left: -999px;
  }
}

.checkbox__default {
  .checkbox-input {
    &.checked .checkbox-inner {
      border: 1px solid #09bbfe;
      background-color: #09bbfe;
      &:after {
        transform: rotate(45deg) scaleY(1);
      }
    }
    &.partial-checked .checkbox-inner {
      border: 1px solid #09bbfe;
      background-color: #09bbfe;
      &:after {
        border-bottom: 0;
        transform: rotate(90deg) scaleY(1);
      }
    }
    &.disabled .checkbox-inner {
      background-color: #d1dbe5;
      border-color: #d1dbe5;
      cursor: not-allowed;
    }
    &.disabled + .checkbox-label {
      color: #bbb;
      cursor: not-allowed;
    }
    &.checked.disabled .checkbox-inner {
      &:after {
        border-color: #fff;
      }
    }
    .checkbox-inner {
      border-radius: 2px;
      transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46), background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
      &:after {
        box-sizing: content-box;
        content: '';
        border: 2px solid #ffffff;
        border-left: 0;
        border-top: 0;
        height: 8px;
        left: 4px;
        position: absolute;
        top: 0px;
        transform: rotate(45deg) scaleY(0);
        width: 5px;
        transition: transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6) 0.05s;
        transform-origin: center;
      }
    }
  }
}

.checkbox__radio {
  .checkbox-input {
    &.checked .checkbox-inner {
      &:after {
        transform: translate(-50%, -50%) scale(1);
      }
    }
    .checkbox-inner {
      border-radius: 50%;
      &:after {
        content: '';
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #09bbfe;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(0);
        transition: transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6);
      }
    }
  }
}
</style>
