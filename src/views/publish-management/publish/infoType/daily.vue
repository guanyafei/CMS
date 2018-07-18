<template>
  <div>
    <edit-item title="日报概要">
      <info-title :ruleForm="ruleForm" ref="title" title="日报标题"></info-title>
      <context-editor :ruleForm="ruleForm" ref="editor" title="日报概况"></context-editor>
      <info-cover :ruleForm="ruleForm" title="日报封面" :nolibrary="false"></info-cover>
    </edit-item>
    <edit-item :title="columnTitle" :labelWidth="0">
      <div class="columns">
        <column-list ref="dailyColumnList" :list="ruleForm.dailyColumnList" :ruleForm="ruleForm"></column-list>
      </div>
      <div :class="['edit-daily__btn',{'is-disabled':ruleForm.dailyColumnList.length === 8}]" @click.stop="handleAddDailyColumn">
        <span class="daily-btn__text">
          {{ruleForm.dailyColumnList.length === 8 ?'您已经达到栏目添加上限，无法继续添加了哦~':'新增日报栏目'}}
        </span>
      </div>
      <check-button
        @checkFields="checkFields"
        class="edit-btn--check"
        :errMsgList="ruleForm.sensitiveMsgList"
      >
      </check-button>
      <info-user :ruleForm="ruleForm" label-width="205px"></info-user>
    </edit-item>
    <daily-tag :ruleForm="ruleForm" ref="tag"></daily-tag>
    <edit-item title="展示维护">
      <info-column :ruleForm="ruleForm"></info-column>
    </edit-item>
    <edit-item title="内容归属">
      <bu-tag :data="data" :ruleForm="ruleForm"></bu-tag>
    </edit-item>
    <!-- <edit-item title="评论引导">
      <comment-guide :ruleForm="ruleForm" ref="commentGuide"></comment-guide>
    </edit-item> -->
  </div>
</template>

<script>
import EditItem from 'widgets/infoCommon/infoEditDetails/editItem';
import InfoTitle from 'widgets/infoCommon/infoEditDetails/elements/infoTitle';
import ContextEditor from 'widgets/infoCommon/infoEditDetails/elements/dailyContextEditor';
import InfoCover from 'widgets/infoCommon/infoEditDetails/elements/infoCover';
import infoUser from 'widgets/infoCommon/infoEditDetails/elements/infoUser';
import InfoColumn from 'widgets/infoCommon/infoEditDetails/elements/infoColumn';
import ColumnList from 'widgets/infoCommon/infoEditDetails/elements/dailyColumnList';
import CheckButton from 'widgets/infoCommon/infoEditDetails/elements/checkButton';
import DailyTag from 'widgets/infoCommon/infoEditDetails/daily-tags';
import BuTag from 'widgets/infoCommon/infoEditDetails/tags/buTag';
// import CommentGuide from 'widgets/infoCommon/infoEditDetails/tags/comment-guide'//评论引导

export default {
  name: 'EditDaily',
  componentName: 'EditDaily',
  components: {
    DailyTag,
    EditItem,
    InfoTitle,
    ContextEditor,
    InfoCover,
    ColumnList,
    CheckButton,
    InfoColumn,
    infoUser,
    BuTag,
    // CommentGuide
  },
  props: ['ruleForm'],
  computed: {
    columnTitle () {
      return `日报栏目（${this.ruleForm.dailyColumnList.length}/8）`;
    },
  },
  beforeDestroy () {
    this.$off('column-move');
  },
  methods: {
    editorKey () {
      return Date.now();
    },
    // 新增一条日报栏目
    handleAddDailyColumn () {
      if (this.ruleForm.dailyColumnList.length === 8) {
        return;
      }
      this.ruleForm.dailyColumnList.push(
        {
          key: Date.now(),
          title: '',
          content: {
            ctt: '',
            dom: ''
          }
        }
      )
    },
    checkFields (hasLoadingText = false, sumitCallback) {
      let ruleForm = this.ruleForm;
      let validWords = true;
      let count = 0;
      const $editor = this.$refs.editor;
      const editorText = $editor.editor.getText();
      const self = this;
      const maxLimit = 2 + ruleForm.dailyColumnList.length * 2;
      ruleForm.sensitiveMsgList = [];

      let checkQueue = [{
        loadingText: hasLoadingText ? '正在校验敏感词，请稍候！' : 'false',
        params: {
          content: ruleForm.title,
          name: '日报标题'
        },
        callback: (res) => {
          if (res.retCode != "0") {
            validWords = false;
            ruleForm.sensitiveMsgList = _.union(ruleForm.sensitiveMsgList, this.getSensetiveList(res.retMsg));
            this.$refs.title.vaildTrigger(res.retMsg);
          }

          if (typeof sumitCallback === 'function' && ++count === maxLimit) {
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
          if (typeof sumitCallback === 'function' && ++count === maxLimit) {
            sumitCallback(validWords);
          }
        }
      }];

      for (let i = 0; i < ruleForm.dailyColumnList.length; i++) {
        let dailyColumnListItem = ruleForm.dailyColumnList[i];

        checkQueue.push({
          loadingText: hasLoadingText ? '正在校验敏感词，请稍候！' : 'false',
          params: {
            content: dailyColumnListItem.title,
            name: '栏目标题'
          },
          callback: (res) => {
            if (res.retCode != "0") {
              validWords = false;
              self.$refs.dailyColumnList
                .$refs[`columnItem${i}`][0].vaildTitleTrigger(res.retMsg);
              ruleForm.sensitiveMsgList = _.union(ruleForm.sensitiveMsgList, this.getSensetiveList(res.retMsg));
            }

            if (typeof sumitCallback === 'function' && ++count === maxLimit) {
              sumitCallback(validWords);
            }
          }
        });

        checkQueue.push({
          loadingText: hasLoadingText ? '正在校验敏感词，请稍候！' : 'false',
          params: {
            content: dailyColumnListItem.content.ctt,
            name: '日报正文'
          },
          callback: (res) => {
            if (res.retCode != "0") {
              validWords = false;
              self.$refs.dailyColumnList.$refs[`columnItem${i}`][0].vaildEditorTrigger(res.retMsg);
              ruleForm.sensitiveMsgList = _.union(ruleForm.sensitiveMsgList, this.getSensetiveList(res.retMsg));
            } else {
              self.$refs.dailyColumnList
              .$refs[`columnItem${i}`][0].vaildEditorTrigger();
            }

            if (typeof sumitCallback === 'function' && ++count === maxLimit) {
              sumitCallback(validWords);
            }
          }
        });
      }

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

<style scoped>
.edit-item__content .shelf {
  margin-top: 0;
  margin-left: -155px;
}

.edit-btn--check {
  margin-top: 20px;
  margin-left: 119px;
}

.edit-daily__btn {
  width: 772px;
  margin-left: 209px;
  border: 1px dashed #ccc;
  border-radius: 6px;
  text-align: center;
  cursor: pointer;
  &.is-disabled {
    cursor: not-allowed;
    background-color: rgba(0, 0, 0, 0.05);
    .daily-btn__text {
      color: #a1a1a1;
    }
  }
  .daily-btn__text {
    display: inline-block;
    padding: 30px 0 30px 45px;
    color: #777;
    font-size: 20px;
    background: url(../../../../assets/icon-add-text.png) no-repeat;
    background-position-y: 23px;
  }
}
</style>


