<template>
  <div class="sn-search__wrapper">
    <slot></slot>
    <div class="sn-search-item" v-for="(row, index) in list" :key="index">
      <div class="sn-search-item--inline">
        <search-cell
          v-for="(cell, cellIndex) in row.children"
          :key="cellIndex"
          :fields="fields"
          :cell="cell"
          :row="row"
          v-if="!cell.isRight">
        </search-cell>
      </div>
      <div class="sn-search-item--inline">
        <search-cell
          v-for="(cell, cellIndex) in row.children"
          :key="cellIndex"
          :fields="fields"
          :cell="cell"
          :row="row"
          :parents="$parent"
          v-if="cell.isRight">
        </search-cell>
      </div>
    </div>
  </div>
</template>

<script>
import SearchCell from './search-cell.vue'
export default {
  name: 'SearchBox',
  components: {
    SearchCell
  },
  props: ['fields'],
  data () {
    return {
      list: []
    }
  },
  methods: {
    addList (item) {
      const index = this.$slots.default.indexOf(item.$vnode);
      this.list.splice(index, 0, item);
    },
    removeList (item) {
      const list = this.list;
      const index = list.indexOf(item);
      if (index > -1) {
        list.splice(index, 1);
      }
    }
  }

}
</script>

<style scoped>
.sn-search__wrapper {
  padding: 20px 20px 0;
  margin-bottom: 10px;
  background: #fff;
}
.sn-search-item,
.sn-search-item--inline  {
  display: flex;
  align-items: center;
}
.sn-search-item {
  justify-content: space-between;
  padding-bottom: 20px;
}

</style>
