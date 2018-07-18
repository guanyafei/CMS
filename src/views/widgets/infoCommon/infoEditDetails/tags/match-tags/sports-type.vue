<template>
  <sn-form-item label="运动分类" labelWidth="180px">
    <sn-select
      v-model="value"
      width="440"
      placeholder="请选择运动"
      @change="typeSelectChange"
    >
      <template v-if="sportsSuggestions&&sportsSuggestions.length!==0">
        <sn-option value="" name="请选择"></sn-option>
        <sn-option
          v-for="item in sportsSuggestions"
          :key="item.sportItemId"
          :name="item.sportItemName"
          :value="''+item.sportItemId"
          :disabled="item.disabled">
        </sn-option>
      </template>
      <div v-else class="text-center">暂无数据</div>
    </sn-select>
  </sn-form-item>
</template>
<script>
import emitter from 'mixins/emitter';
import * as Constant from 'js/constant';

export default {
  name: 'SportsTypeTag',
  componentName: 'SportsTypeTag',
  mixins: [emitter],
  props: {
    value: [String, Number],
    sportsSuggestions: [Array]
  },
  created() {
    this.$on('clearSelfSelectedState', this.clear);
  },
  methods: {
    typeSelectChange(val) {
      this.$emit('input', val);
      this.dispatch('SelectArea', 'clearNextAllSelectedLabels', 'MatchTypeTag');
      this.dispatch('MatchTag', 'changeLabelsContainer', [this.getSelectedItemById(val), 'SportsTypeTag']);
    },
    getSelectedItemById(val) {
      return this.sportsSuggestions.find(sports => {
        return val === '' + sports.sportItemId;
      });
    },
    clear() {
      this.$emit('input', '');
    }
  }
};
</script>
