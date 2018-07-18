<template>
  <div class="star" :style="spanStyle">
    <span
      v-for="n in total"
      :key="n"
      @click="setStar(n)"
      :class="[{'active':isActive(n)},'item-star']"
    ></span>
  </div>
</template>

<script>
import emitter from 'mixins/emitter';
export default {
  name: 'rate',
  mixins: [emitter],
  props: {
    value: {
      type: [String,Number]
    },
    total: {
      type: Number,
      default: 3
    },
    align: {
      type: String,
      default: 'center'
    },
    validateEvent: {
      type: Boolean,
      default: true
    },
  },
  computed: {
    spanStyle () {
      if (this.align === 'center') {
        return {
          justifyContent: 'center'
        }
      }
      return null
    }
  },
  methods: {
    isActive(n) {
      return n < this.value || n == this.value;
    },
    setStar(num) {
      this.$emit('input', num);
      if (this.validateEvent) {
        this.dispatch('FormItem', 'form.change', [num]);
      }
    }
  }

}
</script>

<style scoped>
.star {
  display: flex;
}

.item-star {
  background: url(../../assets/icon-star-gray.png) no-repeat center;
  display: inline-block;
  width: 50px;
  height: 30px;
  &.active {
    background: url(../../assets/icon-stared.png) no-repeat center;
  }
}
</style>
