<template>
  <div class="sn-color-picker" v-clickoutside="handleClose">
    <div class="sn-color-picker__container" @click="showPicker">
      <div class="sn-color-picker__inner" :style="containerStyle"></div>
    </div>
    <sketch-picker v-model="colors" v-if="showPopper"></sketch-picker>
  </div>
</template>
<script>
import emitter from 'mixins/emitter';
import colorMixin from './mixins/color';
import Clickoutside from 'directives/clickoutside';
import Sketch from './components/sketch.vue'

export default {
  mixins: [emitter, colorMixin],
  directives: { Clickoutside },
  name: 'SnColorPicker',
  componentName: 'SnColorPicker',
  components: {
    'sketch-picker': Sketch
  },
  data () {
    return {
      showPopper: false
    }
  },
  created () {
    this.$on('closePickerPropper', ()=>{
      this.showPopper = false;
    })
  },
  computed: {
    containerStyle () {
      const { r, g, b, a } = this.colors.rgba;
      return {
        background: `rgba(${r}, ${g}, ${b}, ${a})`
      }
    },
    colors: {
      get() {
        return this.val;
      },
      set(newVal) {
        this.val = newVal;
        this.$emit('input', newVal);
        this.dispatch('FormItem', 'form.change', [newVal]);
      }
    }
  },
  methods: {
    handleClose () {
      this.showPopper = false;
    },
    showPicker () {
      this.showPopper = true;
    }
  },
}
</script>
<style scoped>
.sn-color-picker {
  width: 46px;
  height: 24px;
  .sn-color-picker__container {
    padding: 5px;
    background: rgb(255, 255, 255);
    border-radius: 1px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 0px 1px;
    display: inline-block;
    cursor: pointer;
    .sn-color-picker__inner {
      width: 36px;
      height: 14px;
      border-radius: 2px;
    }
  }
}
</style>


