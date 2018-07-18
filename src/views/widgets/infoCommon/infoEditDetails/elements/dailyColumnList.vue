<template>
  <div class="columns">
    <column-item
      v-for="(column, index) in list"
      :len="list.length"
      :ref="'columnItem'+index"
      :key="column.key"
      :columnIndex="index"
      :data="column"
      :ruleForm="ruleForm"
      :deleteItemFunc="deleteDailyColumnItem"
    ></column-item>
  </div>
</template>

<script>
import ColumnItem from './dailyColumnItem'
export default {
  name: 'DailyColumnList',
  components: {
    ColumnItem
  },
  props: ['ruleForm', 'list'],
  methods: {
    // 删除一条日报栏目
    deleteDailyColumnItem (index) {
      this.ruleForm.dailyColumnList.splice(index, 1);
    }
  }
}
</script>

