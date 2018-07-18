<template>
  <sn-datatable :data="ruleForm.fileList" columnHeight="40" :border="true">
    <sn-datacolumn label="ft" prop="ft" :width="60" alignment="left">
    </sn-datacolumn>
    <sn-datacolumn label="属性" prop="vip" :width="60" alignment="left">
      <template slot-scope="{value}" slot="vip">
        {{value==1?'VIP':''}}
      </template>
    </sn-datacolumn>
    <sn-datacolumn label="码流" prop="bitrate" :width="70" alignment="left">
    </sn-datacolumn>
    <sn-datacolumn label="文件名" prop="fileName" alignment="left">
    </sn-datacolumn>
    <sn-datacolumn label="时长" prop="duration" :width="100" :formatter="secoundToZHTime" alignment="left">
    </sn-datacolumn>
    <sn-datacolumn label="高度*宽度" :width="100" prop="height" alignment="left">
      <template slot-scope="{row}" slot="height">
        {{`${row.weight}*${row.height}`}}
      </template>
    </sn-datacolumn>
    <sn-datacolumn label="文件大小" prop="fileSize" :width="100" :formatter="transToMbUnit" alignment="left">
    </sn-datacolumn>
    <sn-datacolumn label="时间" prop="createTime" :width="200" :formatter="formatDate" alignment="left">
    </sn-datacolumn>
    <sn-datacolumn label="操作" prop="action" :width="90" alignment="left">
      <template slot="action" slot-scope="{row, index}">
        <sn-button type="text" @click="toggleFileItemStatus(row, index)">删除</sn-button>
      </template>
    </sn-datacolumn>
  </sn-datatable>
</template>
<script>
import { secoundToZHTime, formatDate } from 'utils/util';
import { toggleVideoFileStatus } from 'views/info-management/video-mana/edit/fetch';

export default {
  props: ['ruleForm'],
  created() {
    this.secoundToZHTime = secoundToZHTime;
  },
  methods: {
    transToMbUnit(value) {
      return (value / 1024 / 1024).toFixed(2, 10) + 'MB';
    },
    formatDate(value) {
      return formatDate(+value * 1000, 'yyyy-MM-dd hh:mm:ss');
    },
    toggleFileItemStatus(row, index) {
      this.$confirm('确认删除此码流?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        toggleVideoFileStatus(this, {
          params: {
            channelId: this.ruleForm.batchVideoList[0].id,
            id: row.fileId,
            isDelete: 1
          }
        }).then(() => {
          this.ruleForm.fileList.splice(index, 1)
        });
      }).catch(()=>{

      });
    }
  }
};
</script>
