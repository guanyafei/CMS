<template>
  <div>
    <edit-item title="基本信息">
      <info-title :ruleForm="ruleForm" ref="title" title="资讯标题" ></info-title>
      <context-editor :ruleForm="ruleForm" ref="editor" title="资讯正文" ></context-editor>
      <check-button @checkFields="checkFields" :errMsgList="ruleForm.sensitiveMsgList" ></check-button>
      <info-cover :ruleForm="ruleForm" title="资讯封面" :nolibrary="false"></info-cover>
      <info-resource :ruleForm="ruleForm" :min="2" :max="20"></info-resource>
      <link-content :ruleForm="ruleForm"></link-content>
      <!-- <info-author :ruleForm="ruleForm" v-model="ruleForm.authorId"></info-author> -->
      <info-user :ruleForm="ruleForm" :data="data" checkType></info-user>
    </edit-item>
    <edit-tag :ruleForm="ruleForm" ref="tag"></edit-tag>
    <!-- <edit-item title="资讯频道">
      <channel-list
        :channelAllList="ruleForm.channelList"
        :channelSelectedIds="channelSelectedIds"
        :channelDisabledIds="channelDisabledIds"
        @changeId = "changeId"
      ></channel-list>
    </edit-item> -->
  </div>
</template>

<script>
import DI from 'interface';
import ChannelList from 'widgets/channelList';
import EditTag from 'widgets/infoCommon/infoEditDetails/tags';
import EditItem from 'widgets/infoCommon/infoEditDetails/editItem';
import InfoTitle from 'widgets/infoCommon/infoEditDetails/elements/infoTitle';
import InfoCover from 'widgets/infoCommon/infoEditDetails/elements/infoCover';
import InfoAuthor from 'widgets/infoCommon/infoEditDetails/elements/infoAuthor';
import InfoUser from 'widgets/infoCommon/infoEditDetails/elements/infoUser';
import CheckButton from 'widgets/infoCommon/infoEditDetails/elements/checkButton';
import InfoResource from 'widgets/infoCommon/infoEditDetails/elements/reptileInfoResource';
import ContextEditor from 'widgets/infoCommon/infoEditDetails/elements/contextEditor';
import LinkContent from 'widgets/infoCommon/infoEditDetails/elements/crawlerLinkContent';

export default {
  name: 'TextContent',
  componentName: 'TextContent',
  components: {
    EditTag,
    EditItem,
    InfoTitle,
    InfoCover,
    CheckButton,
    ContextEditor,
    InfoResource,
    LinkContent,
    InfoAuthor,
    InfoUser,
    ChannelList
  },
  props: ['ruleForm', 'data'],
  data () {
    return {
      channelDisabledIds: [],
      channelSelectedIds: []
    }
  },
  methods: {
    changeId (list) {
       this.channelSelectedIds = [...list];
    },
    checkFields (hasLoadingText = false, sumitCallback) {
      let ruleForm = this.ruleForm;
      let validWords = true;
      let count = 0;
      const $editor = this.$refs.editor;
      const editorText = $editor.editor.getText();
      ruleForm.sensitiveMsgList = [];

      let checkQueue = [{
        loadingText: hasLoadingText ? '正在校验敏感词，请稍候！' : 'false',
        params: {
          content: ruleForm.title,
          name: '资讯标题'
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
          content: editorText,
          name: '正文'
        },
        callback: (res) => {
          if (res.retCode != "0") {
            validWords = false;
            ruleForm.sensitiveMsgList = _.union(ruleForm.sensitiveMsgList, this.getSensetiveList(res.retMsg));
            $editor.vaildTrigger(res.retMsg);
          } else {
            $editor.vaildTrigger();
          }
          if (typeof sumitCallback === 'function' && ++count === 2) {
            sumitCallback(validWords);
          }
        }
      }];

      this.$bus.sensitiveCheck(checkQueue);
    },
    getSensetiveList (str) {
      let result = [];
      let indexStart = str.indexOf("[") + 1;
      let indexEnd = str.indexOf("]");
      str = str.substring(indexStart, indexEnd).replace(/"/g, '');
      result = str.split(',');

      return result;
    },
  },
}
</script>

<style scoped>
.edit-item__content .shelf {
  margin-left: -155px;
  margin-top: 0;
}
</style>
