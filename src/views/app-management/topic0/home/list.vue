<template>
  <sn-datatable :data="list">
    <sn-datacolumn label="专题基本信息" prop="info" width="36%" alignment="left"></sn-datacolumn>
    <sn-datacolumn label="内容来源" prop="resource" width="11%" alignment="left"></sn-datacolumn>
    <sn-datacolumn label="上架方式" prop="onSaleType" width="11%" alignment="left" :formatter="getShelfTypeName"></sn-datacolumn>
    <sn-datacolumn label="待上架内容" prop="waitShelvesNum" width="11%"></sn-datacolumn>
    <sn-datacolumn label="已上架内容" prop="shelvesNum" width="11%"></sn-datacolumn>
    <sn-datacolumn label="状态" prop="status" width="11%" :formatter="getShelfStatusName"></sn-datacolumn>
    <sn-datacolumn label="操作" prop="actions"></sn-datacolumn>
    <template slot-scope="cell" slot="info">
      <cell-info :row="cell.row"></cell-info>
    </template>
    <template slot-scope="cell" slot="resource">
      <cell-resource :row="cell.row"></cell-resource>
    </template>
    <template slot-scope="cell" slot="waitShelvesNum">
      <sn-button type="text" @click="jumpTo(cell.row)">{{cell.value}}</sn-button>
    </template>
    <template slot-scope="cell" slot="shelvesNum">
      <sn-button type="text" @click="jumpTo(cell.row)">{{cell.value}}</sn-button>
    </template>
    <template slot-scope="cell" slot="actions">
      <cell-actions :row="cell.row" :selectedRow.sync="selectedRow"></cell-actions>
    </template>
  </sn-datatable>
</template>
<script>
import * as Constant from 'js/constant';
import CellInfo from './table-cell/info';
import CellResource from './table-cell/resource';
import CellActions from './table-cell/actions';

export default {
  name: 'TopicHomeList',
  componentName: 'TopicHomeList',
  components: {
    CellInfo,
    CellResource,
    CellActions
  },
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {

    }
  },
  methods: {
    getShelfTypeName (value) {
      return Constant.getItemByValue(Constant.TOPIC_SHELF_TYPES, value).name;
    },
    getShelfStatusName (value) {
      return Constant.getItemByValue(Constant.TOPIC_PUBLISH_STATUS_TYPES, value).name;
    },
    jumpTo () {

    }
  },
}
</script>
<style scoped>
.topic-list__actions {

}
</style>

