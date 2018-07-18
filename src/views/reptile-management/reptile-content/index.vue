<template>
  <div>
    <List
      v-if="viewType == 'list'"
      @change-view="change"
      ref='channelList'
      v-model="id"
    />
    <Edit
      v-if="viewType == 'edit'"
      @change-view="change"
      ref='edit'
      :data="editItem"
      :rules="id.ruleForm"
    />
    <sn-toptip></sn-toptip>
  </div>
</template>
<script>
import DI from 'interface';
import List from './list';
import Edit from './edit';

export default {
  data() {
    return {
      viewType: 'list',
      id: '',
      editItem: null
    };
  },
  components: {
    List,
    Edit
  },
  methods: {
    change(value) {
      if (value === 'edit') {
        this.$ajax({
          url: DI.reptile.queryInfoDetail,
          data: JSON.stringify({
            id: this.id.id
          }),
          loadingText: '正在查询当前资讯详情，请稍候！',
          context: this,
          success: res => {
            if (res.retCode == '0') {
              this.viewType = value;
              const data = res.data;
              this.editItem = data.wormNewsDetail;
              this.editItem.fileSize = data.fileSize;
              this.editItem.newsType = 1; // 爬虫编辑固定只有图文资讯，后台未传字段
              this.editItem.authorId = data.authorId;
            } else {
              this.$message.error(res.retMsg);;
            }
          },
          error: () => {
            console.log('error');
          }
        });
      } else {
        this.viewType = value;
        this.$nextTick(() => {
          // this.$refs.channelList.queryAllList();
        });
      }
    }
  }
};
</script>
