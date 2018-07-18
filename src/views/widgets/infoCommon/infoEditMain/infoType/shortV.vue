<template>
  <div>
    <div class="video-name">
      <a :href="`http://v.pptvyun.com/show/${ruleForm.vedioId}.html`" target="_blank">
        {{ ruleForm.vedioName || '暂无标题' }}
      </a>
    </div>
    <edit-item title="内容编辑">
      <info-title :ruleForm="ruleForm" ref="title" title="视频标题" :max="50"></info-title>
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
import InfoTitle from 'widgets/infoCommon/infoEditDetails/elements/infoTitle';
import VideoSet from 'widgets/infoCommon/infoEditDetails/elements/videoSet'
import VideoRemark from 'widgets/infoCommon/infoEditDetails/elements/videoRemark';
import InfoCover from 'widgets/infoCommon/infoEditDetails/elements/infoCover';
import CheckButton from 'widgets/infoCommon/infoEditDetails/elements/checkButton';
import ColumnTag from 'widgets/infoCommon/infoEditDetails/tags/info-column';
import BuTag from 'widgets/infoCommon/infoEditDetails/tags/buTag';

export default {
  name: 'ShortVInfo',
  componentName: 'ShortVInfo',
  props: ['ruleForm'],
  components: {
    EditTag,
    EditItem,
    VideoSet,
    InfoTitle,
    InfoCover,
    VideoRemark,
    CheckButton,
    ColumnTag,
    BuTag
  },
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

<style scoped>
.video-name {
  width: 100%;
  margin-top: 10px;
  padding-top: 40px;
  padding-bottom: 50px;
  border-top: 1px solid #eee;
  text-align: center;
  a {
    color: #0ABBFE;
  }
}
</style>
