<template>
  <section class="container" :style="getContainerStyle">
    <div
      :class="['inputs-box',{active:dropDown}]"
      :style="getInnerStyle"
      @click.stop="toggledropDown"
      v-clickoutside="handleClose"
    >
      <sn-input
        v-model="currentName"
        :placeholder="placeholder"
        :width="width"
        :height="height"
        :radius="radius"
        :disabled="disabled"
        readOnly></sn-input>
      <span class="arrow-icon" :class="{'active': dropDown}"></span>
    </div>
    <transition name="fade" mode="out-in">
      <ul
        class="dropdown-list"
        v-show="dropDown"
        :style="getRadiusStyle"
      >
        <slot></slot>
      </ul>
    </transition>
  </section>
</template>
<script>
import emitter from 'mixins/emitter';
import Clickoutside from 'directives/clickoutside';
export default {
  mixins: [emitter],

  name: 'SnSelect',

  componentName: 'SnSelect',

  directives: { Clickoutside },

  props: {
    value: {
      required: true
    },

    name: {
      type: [String]
    },

    placeholder: {
      type: String,
      default: '请选择'
    },

    width: {
      type: String,
      default: '200'
    },

    height: {
      type: String,
      default: '32'
    },

    radius: {
      type: String,
      default: '4'
    },

    async: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    position: {
      type: String,
      default: 'relative'
    }
  },

  data () {
    return {
      dropDown: false,
      currentName: ''
    };
  },

  computed: {
    getContainerStyle () {
      return `width:${this.width}px;position:${this.position}`
    },
    getInnerStyle () {
      return `width:${this.width}px;`
    },
    getRadiusStyle () {
      return `border-radius:${this.radius}px;`
    }
  },

  watch: {
    value (newVal) {
      if (newVal === '') {
        this.currentName = '';
        this.broadcast('SnOption', 'clearSelectedItem', this);
      } else {
        this.$nextTick(() => {
          if (this.name && this.currentName != this.name) {
            this.currentName = this.name;
          }
        })
      }
    }
  },

  updated () {
    if (this.value !== '') {
      this.init();
    }
  },

  created () {
    this.currentName = this.name || '';
    this.$on('initCurrentName', this.initCurrentName);
    this.$on('handleOptionClick', this.handleOptionSelect);
  },

  methods: {
    init () {
      this.broadcast('SnOption', 'defaultSelected', this);
    },

    initCurrentName (option) {
      this.currentName = option.name;
    },

    handleOptionSelect (option) {
      this.currentName = option.name || '';
      this.$emit('change', option.value, option, this);
      this.$nextTick(() => {
        this.broadcast('SnOption', 'selectedItem', this);
      })
      this.dropDown = false;
    },

    toggledropDown () {
      if (this.disabled) return;
      if (!this.dropDown && this.async) {
        this.$emit('getList');
      }
      this.dropDown = !this.dropDown;
    },

    handleClose () {
      this.dropDown = false;
    },
  }
}
</script>

<style scoped>
.container {
  position: relative;
  .inputs-box {
    position: relative;
  }
}

.container .arrow-icon {
  position: absolute;
  display: inline-block;
  width: 12px;
  height: 12px;
  top: 50%;
  margin-top: -6px;
  right: 12px;
  background: url(../../assets/bg_drop_down.png) no-repeat;
  background-size: 100% 100%;
}

.container .arrow-icon.active {
  transform: rotate(180deg);
}

.container .dropdown-list {
  position: absolute;
  top: 35px;
  left: 0;
  z-index: 99999;
  min-width: 100%;
  max-height: 200px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px 0;
  overflow-y: auto;
  background: #fff;
}

.content {
  position: relative;
}
</style>
