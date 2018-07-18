<template>
  <div>
    <edit-item title="内容编辑">
      <sn-form-item
        label="视频ID"
        ref="idItem"
        prop="vedioId"
        :rules="[{
          required: true,
          message: '请输入视频ID',
          trigger: 'change'
        }]"
      >
        <sn-input
          ref="idInput"
          v-model="ruleForm.vedioId"
          placeholder="请输入视频ID"
          width="640"
          disabled
        ></sn-input>
      </sn-form-item>
      <info-title :ruleForm="ruleForm" ref="title" title="视频标题" :max="50"></info-title>
      <video-set :ruleForm="ruleForm" ref="set"></video-set>
      <video-remark :ruleForm="ruleForm" ref="remark"></video-remark>
      <check-button @checkFields="checkFields" :errMsgList="ruleForm.sensitiveMsgList"></check-button>
      <info-cover :ruleForm="ruleForm" title="资讯封面" nolibrary></info-cover>
    </edit-item>
    <edit-tag :ruleForm="ruleForm" ref="tag"></edit-tag>
    <edit-item title="内容归属">
      <column-tag :ruleForm="ruleForm"></column-tag>
      <bu-tag :ruleForm="ruleForm"></bu-tag>
    </edit-item>
  </div>
</template>

<script>
import EditTag from 'widgets/infoCommon/infoEditDetails/tags';
import EditItem from 'widgets/infoCommon/infoEditDetails/editItem';
import VideoSet from 'widgets/infoCommon/infoEditDetails/elements/videoSet'
import InfoTitle from 'widgets/infoCommon/infoEditDetails/elements/infoTitle';
import InfoCover from 'widgets/infoCommon/infoEditDetails/elements/infoCover';
import VideoRemark from 'widgets/infoCommon/infoEditDetails/elements/videoRemark';
import CheckButton from 'widgets/infoCommon/infoEditDetails/elements/checkButton';
import ColumnTag from 'widgets/infoCommon/infoEditDetails/tags/info-column';
import BuTag from 'widgets/infoCommon/infoEditDetails/tags/buTag';

export default {
  name: 'VideoContent',
  componentName: 'VideoContent',
  components: {
    EditTag,
    EditItem,
    InfoTitle,
    VideoSet,
    VideoRemark,
    InfoCover,
    CheckButton,
    ColumnTag,
    BuTag
  },
  props: ['ruleForm'],
  methods: {
    checkFields (hasLoadingText = false, sumitCallback) {
      let ruleForm = this.ruleForm;
      let count = 0;
      let doneCount = 0;
      let validWords = true;
      ruleForm.sensitiveMsgList = [];

      let checkQueue = [{
        loadingText: hasLoadingText ? '正在校验敏感词，请稍候！' : 'false',
        params: {
          content: ruleForm.title,
          name: '视频标题'
        },
        callback: (res) => {
          if (res.retCode != "0") {
            validWords = false;
            ruleForm.sensitiveMsgList = _.union(ruleForm.sensitiveMsgList, this.getSensetiveList(res.retMsg));
            this.$refs.title.vaildTrigger(res.retMsg);
          }

          if (typeof sumitCallback === 'function' && ++count === 2) {
            sumitCallback(validWords);
          }
        },
      }, {
        loadingText: hasLoadingText ? '正在校验敏感词，请稍候！' : 'false',
        params: {
          content: ruleForm.content,
          name: '视频描述'
        },
        callback: (res) => {
          if (res.retCode != "0") {
            validWords = false;
            ruleForm.sensitiveMsgList = _.union(ruleForm.sensitiveMsgList, this.getSensetiveList(res.retMsg));
            this.$refs.remark.vaildTrigger(res.retMsg);
          }

          if (typeof sumitCallback === 'function' && ++count === 2) {
            sumitCallback(validWords);
          }
        }
      }];

      this.$bus.sensitiveCheck.call(this, checkQueue);
    },
    getSensetiveList (str) {
      let result = [];
      let indexStart = str.indexOf("[") + 1;
      let indexEnd = str.indexOf("]");
      str = str.substring(indexStart, indexEnd).replace(/"/g, '');
      result = str.split(',');

      return result;
    }
  }
}
</script>
