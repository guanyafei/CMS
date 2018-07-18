<style scoped>
.input__append {
  .sn-button {
    border-radius: 0;
  }
}
.sn-button {
  min-width: 100px;
  border-radius: 4px;
  padding: 9px 10px;
  line-height: 1;
  font-size: 12px;
  color: #fff;
  &.is-circle {
    border-radius: 16px;
  }
  &.is-loading {
    pointer-events: none;
    position: relative;
    &:before {
      display: block;
    }
  }
  &.sn-button--mini {
    min-width: 90px;
  }
  &.sn-button--default {
    color: #666;
    border: 1px solid #ccc;
    background-color: #fff;
  }
  &.sn-button--primary {
    background-color: #09bbfe;
    &.is-disabled {
      background-color: #a0cfff;
      border-color: #a0cfff;
    }
    &.is-plain {
      border: 1px solid #09bbfe;
      color: #09bbfe;
      background-color: #fff;
    }
  }
  &.sn-button--success {
    background-color: #a9d86e;
    &.is-disabled{
      color: #a4da89;
      background-color: #f0f9eb;
      border-color: #e1f3d8;
    }
    &.is-plain {
      border: 1px solid #a9d86e;
      color: #a9d86e;
      background-color: #fff;
    }
  }
  &.sn-button--warning {
    background-color: #f7ba2a;
    &.is-plain {
      border: 1px solid #f7ba2a;
      color: #f7ba2a;
      background-color: #fff;
    }
  }
  &.sn-button--extra1 {
    background-color: #8074c8;
    &.is-plain {
      border: 1px solid #8074c8;
      color: #8074c8;
      background-color: #fff;
    }
  }
  &.sn-button--extra2 {
    background-color: #f88a6f;
    &.is-plain {
      border: 1px solid #f88a6f;
      color: #f88a6f;
      background-color: #fff;
    }
  }
  &.sn-button--outline {
    border: 1px solid #09bbfe;
    color: #09bbfe;
    background-color: #fff;
  }
  &.sn-button--text {
    &.is-disabled {
      color: #999999;
      background-color: transparent;
      cursor: not-allowed;
    }
    &.sn-button--mini {
      padding: 2px 10px;
    }
    min-width: auto;
    padding: 0;
    border-radius: 0;
    color: #09bbfe;
  }
  &.is-disabled,
  &.is-plain&.is-disabled {
    border: 0;
    color: #ffffff;
    background-color: #ccc;
    cursor: not-allowed;
  }
}
</style>

<template>
  <button
    :disabled="disabled"
    @click.stop="handleClick"
    :class="[
      'sn-button',
      type ? 'sn-button--' + type : '',
      size ? 'sn-button--' + size : '',
      {
        'is-plain': plain,
        'is-circle': circle,
        'is-loading': loading,
        'is-disabled': disabled
      }
    ]"
    :style="btnStyle"
  >
    <i class="sn-icon-loading-a sn-load-loop" v-if="loading"></i>
    <i :class="'sn-icon-' + icon" v-if="icon && !loading"></i>
    <slot></slot>
  </button>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      default: 'small'
    },
    type: {
      type: String,
      default: 'default'
    },
    disabled: Boolean,
    plain: Boolean,
    circle: {
      type: Boolean,
      default: true
    },
    loading: Boolean,
    icon: {
      type: String,
      default: ''
    },
    gutter: {
      type: Number,
      default: 30
    }
  },
  data() {
    return {};
  },
  computed: {
    btnStyle() {
      if (this.type === 'text') {
        return null;
      }
      return {
        paddingRight: `${this.gutter}px`,
        paddingLeft: `${this.gutter}px`
      };
    }
  },
  methods: {
    handleClick() {
      !this.disabled && this.$emit('click');
    }
  }
};
</script>
