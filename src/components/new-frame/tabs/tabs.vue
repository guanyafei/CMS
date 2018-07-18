<template>
  <div class="sn-tabs clearfix">
    <div :class="['sn-tabs__header', {
      'flex-between': $slots.prepend || $slots.append,
      'flex-right': !$slots.prepend && align==='right',
      'flex-left': !$slots.prepend && align==='left'
      }]">
      <div v-if="$slots.prepend" class="sn-tabs__prepend">
        <slot name="prepend"></slot>
      </div>
      <div :class="['sn-tabs__nav']">
        <div v-for="(pane, index) in panes"
          :ref="`tab${index}`"
          :key="index"
          :class="['sn-tabs__item',{
            'is-active': pane.active
          }]"
          @click.stop="handleTabClick(pane, pane.name)"
        >
          {{ pane.$slots.label || pane.label }}
        </div>
      </div>
      <div v-if="$slots.append" class="sn-tabs__append">
        <slot name="append"></slot>
      </div>
    </div>
    <div class="sn-tabs__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
/**
 * button
 * @author 17050542 2017/9/5
 * @desc 标签
 */

export default {
  name: 'sn-tabs',
  props: {
    value: [String, Number],
    align: {
      type: String,
      default: 'right'
    }
  },
  data () {
    return {
      currentName: this.value,
      panes: []
    };
  },
  watch: {
    value (value) {
      this.setCurrentName(value);
    }
  },
  methods: {
    handleTabClick (tab, tabName, event) {
      if (tab.disabled) return;
      this.setCurrentName(tabName);
      this.$emit('tab-click', tab, event);
    },
    setCurrentName (value) {
      this.currentName = value;
      this.$emit('input', value);
    },
    addPanes (item) {
      const index = this.$slots.default.indexOf(item.$vnode);
      this.panes.splice(index, 0, item);
    },
    removePanes (item) {
      const panes = this.panes;
      const index = panes.indexOf(item);
      if (index > -1) {
        panes.splice(index, 1);
      }
    }
  }
};
</script>

<style>
.sn-tabs {
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  color: #657180;
  &__header {
    position: relative;
    display: flex;
    padding: 0;
    margin: 0 0 15px;
    border-bottom: 1px solid #d7dde4;
    &.flex-right {
      justify-content: flex-end;
    }
    &.flex-between {
      justify-content: space-between;
    }
  }
  &__prepend, &__append {
    align-self: center;
  }
  &__item {
    display: inline-block;
    height: 100%;
    padding: 8px 7px;
    margin-bottom: -1px;
    box-sizing: border-box;
    cursor: pointer;
    text-decoration: none;
    position: relative;
    transition: color .3s ease-in-out;
    &.is-active {
      color: #09BBFE;
      border-bottom: 3px solid #09BBFE;
    }
  }
}
</style>

