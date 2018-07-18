<template>
  <div>
    <edit-item title="内容编辑">
      <info-title :ruleForm="ruleForm" ref="title" title="资讯标题"></info-title>
      <context-editor :ruleForm="ruleForm" ref="editor" title="资讯正文"></context-editor>
      <check-button @checkFields="checkFields" :errMsgList="ruleForm.sensitiveMsgList"></check-button>
      <info-cover :ruleForm="ruleForm" title="资讯封面" :nolibrary="false"></info-cover>
      <info-resource :ruleForm="ruleForm"></info-resource>
      <link-content :ruleForm="ruleForm"></link-content>
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
import InfoCover from 'widgets/infoCommon/infoEditDetails/elements/infoCover';
import LinkContent from 'widgets/infoCommon/infoEditDetails/elements/linkContent';
import CheckButton from 'widgets/infoCommon/infoEditDetails/elements/checkButton';
import InfoResource from 'widgets/infoCommon/infoEditDetails/elements/infoResource';
import ContextEditor from 'widgets/infoCommon/infoEditDetails/elements/contextEditor';
import ColumnTag from 'widgets/infoCommon/infoEditDetails/tags/info-column';
import BuTag from 'widgets/infoCommon/infoEditDetails/tags/buTag';

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
    ColumnTag,
    BuTag
  },
  props: ['ruleForm'],
  data () {
    return {
      linkContentList: [], // 查出关联内容列表
      relContentInput: '', // 关联内容input值
      selectedRelContentId: '' // 选中关联内容id
    }
  },
  methods: {
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
    },
  },
}
</script>
