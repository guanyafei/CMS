<template>
  <div class="vc-editable-input">
    <span class="vc-input__label">{{label}}</span>
    <input class="vc-input__input"
      v-model="val"
      @keydown="handleKeyDown"
      @input="update"
      ref="input">
    <span class="vc-input__desc">{{desc}}</span>
  </div>
</template>

<script>
export default {
  name: 'editableInput',
  props: {
    label: String,
    desc: String,
    value: [String, Number],
    max: Number,
    min: Number,
    arrowOffset: {
      type: Number,
      default: 1
    }
  },
  computed: {
    val: {
      get () {
        return this.value
      },
      set (v) {
        // TODO: min
        if (!(this.max === undefined) && +v > this.max) {
          this.$refs.input.value = this.max
        } else {
          return v
        }
      }
    }
  },
  methods: {
    update (e) {
      this.handleChange(e.target.value)
    },
    handleChange (newVal) {
      let data = {}
      data[this.label] = newVal
      if (data.hex === undefined && data['#'] === undefined) {
        this.$emit('change', data)
      } else if (newVal.length > 5) {
        this.$emit('change', data)
      }
    },
    handleBlur (e) {
      console.log(e)
    },
    handleKeyDown (e) {
      let val = this.val
      let number = Number(val)

      if (number) {
        let amount = this.arrowOffset || 1

        // Up
        if (e.keyCode === 38) {
          val = number + amount
          this.handleChange(val)
          e.preventDefault()
        }

        // Down
        if (e.keyCode === 40) {
          val = number - amount
          this.handleChange(val)
          e.preventDefault()
        }
      }
    },
    handleDrag (e) {
      console.log(e)
    },
    handleMouseDown (e) {
      console.log(e)
    }
  }
}
</script>

<style>
.vc-editable-input {
  display: flex;
  margin-bottom: 9px;
  position: relative;
}
.vc-input__input {
  padding: 0;
  border: 0;
  outline: none;
}
.vc-input__label {
  text-transform: capitalize;
  width: 45px;
}
</style>
