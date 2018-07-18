<template>
  <sn-table :data="list" ref="table">
    <sn-table-column label="任务编号" width="12%"  prop="commImportTaskId"></sn-table-column>
    <sn-table-column label="目标" width="24%" sloted>
      <template slot-scope="row">
        <column-target :row="row"></column-target>
      </template>
    </sn-table-column>
    <sn-table-column label="灌水内容" width="12%" sloted>
      <template slot-scope="row">
        <column-detail :row="row"></column-detail>
      </template>
    </sn-table-column>
    <sn-table-column label="时间范围" width="15%" sloted>
      <template slot-scope="row">
        <column-duration :row="row"></column-duration>
      </template>
    </sn-table-column>
    <sn-table-column label="执行时间" prop="executeTime" width="12%" sloted>
      <template slot-scope="row">
        <sn-td-date :time="row.executeTime"></sn-td-date>
      </template>
    </sn-table-column>
    <sn-table-column label="当前状态" prop="taskStatus" width="12%"  sloted>
      <template slot-scope="row">
        <column-status :row="row"></column-status>
      </template>
    </sn-table-column>
    <sn-table-column label="操作"sloted>
      <template slot-scope="row">
        <column-rerun :row="row" :key="row.commImportTaskId"></column-rerun>
      </template>
    </sn-table-column>
  </sn-table>
</template>

<script>
  import columnTarget from './column/column-target'
  import columnDetail from './column/column-action/column-detail'
  import columnDuration from './column/column-duration'
  import columnStatus from './column/column-status'
  import columnRerun from './column/column-action/column-rerun'

  export default {
    name: 'List',
    props: ['list'],
    components: {
      columnTarget,
      columnDetail,
      columnDuration,
      columnStatus,
      columnRerun
    }
  }
</script>

<style scoped>
</style>
