<template>
  <sn-confirm v-if="viewType=='publish'"
    title='发布上架'
    @close="close"
    @sure="confirmPublish"
    confirmButtonText="发布"
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
import VideoProgram from 'widgets/video/form-items/video-program';
import VideoSet from 'widgets/video/form-items/video-set';

export default {
  name: 'ChannelModal',
  componentName: 'ChannelModal',
  components: {
    InfoColumn,
    InfoTopic,
    VideoProgram,
    VideoSet
  },
  props: {
    viewType: String,
    close: Function,
    selectedItem: Object
  },
  data() {
    return {
      ruleForm: {
        libraryType: 1,
        newsType: '',
        channelSet: [],
        columnAllList: [],
        topicAllList: [],
        subjectList: [],
        channelDisabledIds: []
      }
    };
  },
  watch: {
    viewType(newVal, oldVal) {
      if (newVal === 'publish') {
        this.$nextTick(() => {
          this.fetchChannelList();
        });
      }
    }
  },
  methods: {
    fetchChannelList() {
      if (!(this.selectedItem && this.selectedItem.newsId)) return;
      this.ruleForm.newsType = this.selectedItem.newsType;
      fetchChannelListAction(this, {
        params: {
          newsId: this.selectedItem.newsId
        }
      });
    },
    confirmPublish() {
      let channelIds = _.difference(this.ruleForm.channelSet, this.ruleForm.channelDisabledIds);
      if (channelIds.length == 0) return this.$message.warning('请至少选择一个！');
      this.ruleForm.subjectList = [];
      channelIds.filter(id => {
        this.ruleForm.columnAllList.filter(subject => {
          if (id == subject.infoFlowId) {
            this.ruleForm.subjectList.push({
              subjectId: id,
              subjectType: 1,
              infoFlowId: subject.infoFlowId,
              onSaleType: subject.onSaleType
            });
          }
        });
        this.ruleForm.topicAllList.filter(subject => {
          if (id == subject.infoFlowId) {
            this.ruleForm.subjectList.push({
              subjectId: id,
              subjectType: 3,
              infoFlowId: subject.infoFlowId,
              onSaleType: subject.onSaleType
            });
          }
        });
      });
      let { title, cover, newsId, imageWidths, content, vedioId, vedioSetId } = this.selectedItem;
      let ajaxData = {
        title,
        cover,
        newsId,
        newsType: this.ruleForm.newsType,
        imageWidths,
        content,
        vedioId,
        vedioSetId,
        subjectList: this.ruleForm.subjectList
      };

      this.$emit('update:viewType', null);
      doPulishToChannelAction(this, {
        params: ajaxData
      });
    }
  }
};
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
