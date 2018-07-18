<template>
  <transition>
    <span
      class="sn-tag"
      :style="{backgroundColor: color}">
      <slot></slot>
      <i class="sn-tag__close sn-icon-close"
        @click.stop="handleClose"></i>
    </span>
  </transition>
</template>
<script>
export default {
  name: 'SnTag',
  props: {
    type: String,
    hit: Boolean,
    disableTransitions: Boolean,
    color: String,
    size: String
  },
  methods: {
    handleClose(event) {
      this.$emit('close', event);
    }
  }
};
</script>
<style>
.sn-tag {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  height: 28px;
  line-height: 28px;
  min-width: 64px;
  border: 1px solid #09bbfe;
  color: #666;
  vertical-align: top;
  padding: 0 22px 0 10px;
  border-radius: 16px;
  margin-right: 12px;
  margin-bottom: 10px;
}
</style>

