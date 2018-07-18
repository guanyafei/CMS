<template>
  <sn-confirm v-if="viewType=='publish'"
    title='发布上架'
    @close="selfClose"
    @sure="confirmPublish"
    confirmButtonText="发布"
    noflag>
    <div class="modal-body modal-lg">
      <sn-form :model="ruleForm" ref="ruleForm" label-width="90px">
        <sn-form-item
          label='所属BU'
          labelWidth="80px"
          prop='infoBuVal'
          :rules="[{
            required: true,
            message: '请选择所属BU',
            trigger: 'change'
          }]">
          <sn-radio-group v-model='ruleForm.infoBuVal'>
            <sn-radio class='radio-group__item'
              v-for='item in buLabelList'
              :key='item.labelId'
              :label='""+item.labelId'>
              {{item.labelName}}
            </sn-radio>
          </sn-radio-group>
        </sn-form-item>
        <div style="margin-left: -27px;">
          <info-column :ruleForm="ruleForm"></info-column>
          <info-topic v-if="selectedItem.newsType != 8" :ruleForm="ruleForm"></info-topic>
        </div>
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
    type: String,
    viewType: String,
    close: Function,
    selectedItem: Object
  },
  data() {
    return {
      ruleForm: {
        libraryType: 1,
        newsType: '',
        infoBuVal: '',
        channelSet: [],
        columnAllList: [],
        topicAllList: [],
        subjectList: [],
        channelDisabledIds: []
      },
      buLabelList: []
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
    selfClose() {
      this.ruleForm.infoBuVal = '';
      this.close();
    },
    confirmPublish() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let buLabel = (this.buLabelList || []).find(item => '' + item.labelId === this.ruleForm.infoBuVal);
          this.ruleForm.subjectList = [];
          let channelIds = _.difference(this.ruleForm.channelSet, this.ruleForm.channelDisabledIds);
          if (channelIds.length == 0) return this.$message.warning('请至少选择一个！');
          channelIds.filter(id => {
            this.ruleForm.columnAllList.filter(subject => {
              if (id == subject.infoFlowId) {
                this.ruleForm.subjectList.push({
                  subjectId: id,
                  subjectType: 1,
                  infoFlowId: subject.infoFlowId,
                  onSaleType: subject.onSaleType,
                  resource: subject.resource
                });
              }
            });
            this.ruleForm.topicAllList.filter(subject => {
              if (id == subject.infoFlowId) {
                this.ruleForm.subjectList.push({
                  subjectId: id,
                  subjectType: 3,
                  infoFlowId: subject.infoFlowId,
                  onSaleType: subject.onSaleType,
                  resource: subject.resource
                });
              }
            });
          });

          let { cover, newsId, title, imageWidths, content, vedioId, vedioSetId} = this.selectedItem;
          let ajaxData = {
            title,
            cover,
            newsId,
            newsType: this.ruleForm.newsType,
            imageWidths,
            content,
            vedioId,
            vedioSetId,
            nlrList: [buLabel],
            subjectList: this.ruleForm.subjectList
          };

          this.$parent.viewType = null;
          doPulishToChannelAction(this, {
            params: ajaxData
          });
        }
      });
    },
    changeId(list) {
      this.channelSelectedIds = [...list];
    }
  }
};
</script>

<style scoped>
.modal-body {
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
