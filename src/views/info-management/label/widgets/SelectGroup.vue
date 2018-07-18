<template>
  <div>
    <div class="is-line">
      <span class="label">运动类型</span>
      <select-match-type v-model='gameId'>
      </select-match-type>
    </div>
    <div class="is-line">
      <span class="label">赛事名称</span>
      <select-match v-model='matchObj' :gameId='gameId' @input='matchChange'>
      </select-match>
    </div>
  </div>
</template>

<script>
import emitter from 'mixins/emitter';
import SelectMatchType from './SelectMatchType'
import SelectMatch from './SelectMatch'
export default {
  name: 'SelectGroup',

  componentName: 'SelectGroup',

  mixins: [emitter],

  components: {
    SelectMatchType,
    SelectMatch
  },

  props: ['value'],

  data() {
    return {
      gameId: '',
      matchObj: null
    }
  },

  watch: {
    gameId(newVal) {
      this.broadcast('SelectMatch', 'typeChange', this)
    }
  },

  methods: {
    matchChange(val) {
      this.$emit('input', val);
    }
  }
}
</script>

<style scoped>
  .label {
    margin-right: 10px;
  }

  .is-line+.is-line{
    margin-top: 10px;
  }
</style>

