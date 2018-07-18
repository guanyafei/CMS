<template>
  <th :style="columnStyles" :class="thClass">
    <div class="tn-table__cell" :style="cellStyles">
      <slot>{{ label }}</slot>
    </div>
  </th>
</template>

<script>
const alignments = [
  'left',
  'center',
  'right',
  'auto'
];

export default {
  name: 'TnTableColumn',
  props: {
    prop: String,
    label: String,
    width: [String, Number],
    alignment: {
      type: String,
      default: 'center',
      validator: value => {
        return alignments.indexOf(value) > -1;
      }
    },
    columnBorder: {
      type: [Boolean, String],
      default: 'noset'
    },
    minWidth: Number,
    formatter: Function
  },
  computed: {
    columnWidth () {
      if (!this.width) {
        return;
      }

      let suffix = isNaN(this.width) ? '' : 'px';

      return this.width + suffix;
    },
    columnStyles () {
      let alignment = this.alignment === 'left' ? null : this.alignment;
      return {
        width: this.columnWidth,
        textAlign: alignment
      };
    },
    cellStyles () {
      let { gutter } = this.$parent;
      return {
        paddingLeft: `${gutter}px`,
        paddingRight: `${gutter}px`
      };
    },
    template () {
      return this.$parent.$scopedSlots[this.prop] || this.$scopedSlots[this.prop];
    },
    thClass () {
      return {
        'is-border': this.$parent.border
      };
    }
  },
  mounted () {
    this.$parent.addColumn(this);
  },
  beforeDestroy () {
    this.$parent.removeColumn(this);
  }
};
</script>
