<template>
  <div>
    <edit-item title="内容编辑">
      <info-title :ruleForm="ruleForm" ref="title" title="资讯标题"></info-title>
      <info-resource :ruleForm="ruleForm"></info-resource>
    </edit-item>
    <edit-item title="上传图片">
      <upload-img :ruleForm="ruleForm" ref="img"></upload-img>
      <check-button
        @checkFields="checkFields"
        :errMsgList="ruleForm.sensitiveMsgList"
        class="edit-item__btn"
      ></check-button>
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
import UploadImg from 'widgets/infoCommon/infoEditDetails/elements/uploadImg';
import InfoTitle from 'widgets/infoCommon/infoEditDetails/elements/infoTitle';
import CheckButton from 'widgets/infoCommon/infoEditDetails/elements/checkButton';
import InfoResource from 'widgets/infoCommon/infoEditDetails/elements/infoResource';
import ColumnTag from 'widgets/infoCommon/infoEditDetails/tags/info-column';
import BuTag from 'widgets/infoCommon/infoEditDetails/tags/buTag';

export default {
  name: 'PictureContent',
  componentName: 'PictureContent',
  components: {
    EditTag,
    EditItem,
    InfoTitle,
    UploadImg,
    CheckButton,
    InfoResource,
    ColumnTag,
    BuTag
  },
  props: ['ruleForm'],
  data () {
    return {
    }
  },
  methods: {
    checkFields (hasLoadingText = false, sumitCallback) {
      let ruleForm = this.ruleForm;
      let $img = this.$refs.img;
      let list = $img.list;
      let count = 0;
      let validWords = true;
      let maxLimit = 1 + list.length;

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

          if (typeof sumitCallback === 'function' && ++count === maxLimit) {
            sumitCallback(validWords);
          }
        },
      }];
      ruleForm.sensitiveMsgList = [];

      for (let i = 0; i < list.length; i++) {

        if (list[i].state == 3 || !list[i].intro.trim()) {
          ++count
          continue;
        }

        checkQueue.push({
          loadingText: hasLoadingText ? '正在校验敏感词，请稍候！' : 'false',
          params: {
            content: list[i].intro,
            name: '图片说明'
          },
          callback: (res) => {
            if (res.retCode != "0") {
              validWords = false;
              list[i].introErr = true;
              list[i].errMsg = res.retMsg;
              $img.$set(list, i, list[i]);
              ruleForm.sensitiveMsgList = _.union(ruleForm.sensitiveMsgList, this.getSensetiveList(res.retMsg));
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
  }
}
</script>

<style scoped>
.edit-item__btn {
  margin-top: 20px;
  margin-left: -89px;
}
</style>

