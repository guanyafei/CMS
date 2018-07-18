<template>
  <sn-confirm v-if="viewType=='publish'"
    title='发布上架'
    @close="close"
    @sure="confirmPublish"
    confirmButtonText="发布"
    closeIcon= true
    noflag>
    <div class="modal-body modal-lg">
      <sn-form :model="ruleForm" ref="ruleForm" label-width="110px">
        <info-column :ruleForm="ruleForm"></info-column>
        <info-topic v-if="selectedItem.newsType != 8" :ruleForm="ruleForm"></info-topic>
      </sn-form>
    </div>
  </sn-confirm>
</template>

<script>
import _ from 'lodash';
import { fetchChannelListAction, doPulishToChannelAction } from '../fetch';
import InfoColumn from 'widgets/infoCommon/infoEditDetails/elements/infoColumn';
import InfoTopic from 'widgets/infoCommon/infoEditDetails/elements/infoTopic';

export default {
  name: 'ChannelModal',
  componentName: 'ChannelModal',
  components: {
    InfoColumn,
    InfoTopic
  },
  props: {
    'viewType': String,
    'close': Function,
    'selectedItem': Object
  },
  data () {
    return {
      ruleForm: {
        newsType: '',
        channelSet: [],
        columnAllList: [],
        topicAllList: [],
        subjectList: [],
        channelDisabledIds: []
      }
    }
  },
  watch: {
    viewType (newVal, oldVal) {
      if (newVal === 'publish') {
        this.$nextTick(() => {
          this.fetchChannelList();
        });
      }
    }
  },
  methods: {
    fetchChannelList () {
      if (!(this.selectedItem && this.selectedItem.newsId)) {
        return;
      }
      fetchChannelListAction(this, {
        params: {
          newsId: this.selectedItem.newsId,
          newsType: this.selectedItem.newsType
        }
      });
    },
    confirmPublish () {
      let channelIds = _.difference(this.ruleForm.channelSet, this.ruleForm.channelDisabledIds);

      if (channelIds.length == 0) return this.$message.warning('请至少选择一个！');

      let { cover, newsId, newsType, title, authorId, imageWidths } = this.selectedItem;
      let ajaxData = {
        title,
        cover,
        newsId,
        newsType: this.ruleForm.newsType,
        authorId,
        imageWidths,
        channelArrayJson: channelIds
      };
      this.$emit('update:viewType', null);
      doPulishToChannelAction(this, {
        params: ajaxData
      });
    },
    changeId (list) {
      this.channelSelectedIds = [...list];
    }
  }
}
</script>

<style scoped>
.modal-body {
  max-height: 400px;
  overflow: auto;
  &.modal-lg {
    width: 640px;
    padding-bottom: 0;
  }
  .tip {
    background-image: url(../../../../assets/icon-warning.png);
    background-repeat: no-repeat;
    padding-left: 23px;
    background-position-y: 3px;
  }
}
</style>
