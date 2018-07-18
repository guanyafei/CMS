<template>
  <div class="edit-container">
    <sn-form :model="ruleForm" ref="ruleForm" label-width="90px">
      <header class="edit-header">
        <h3 class="header__title">内容编辑</h3>
      </header>
      <div class="edit-body">
        <edit-text :data="data" :ruleForm="ruleForm" ref="content"></edit-text>
      </div>
      <footer class="edit-footer">
        <edit-item>
          <sn-form-item class="btn-group" label-width="0">
            <sn-button type="primary" @click="onSubmitBtnClick" class="mr-30">保存</sn-button>
            <sn-button @click="backToIndex">取消</sn-button>
          </sn-form-item>
        </edit-item>
      </footer>
    </sn-form>
    <sn-confirm txt
      ref="editConfirm"
      title="编辑提醒"
      @sure="sureSubmit"
      @close="close"
      v-if="viewType === 'confirmSubmit'"
      noflag>
      该资讯已被其他人员采用，确认继续发布？
    </sn-confirm>
    <sn-confirm
      title="提示"
      v-show="viewType==='tip'"
      close-icon
      @close="close"
      @sure="sure"
      confirmButtonText="继续保存"
      cancelButtonText="返回检查"
      noflag>
      <div class="modal-body check-modal">
        <sn-formtip warning>内容中检测出敏感词汇，请慎重检查~</sn-formtip>
        <div class="words">
          <span class="title">敏感词汇：</span>
          <span class="word" v-for="(word, index) in ruleForm.sensitiveMsgList" :key="index">{{word}}</span>
        </div>
      </div>
    </sn-confirm>
  </div>
</template>

<script>
import _ from 'lodash';
import DI from 'interface';
import * as Constant from 'js/constant';
import getInfoInitData from './info-data';

import EditText from './editType/text';
import EditItem from 'widgets/infoCommon/infoEditDetails/editItem';
import { getImgPixelSize } from 'src/utils/image-operate';

export default {
  name: 'InfoEdit',
  componentName: 'InfoEdit',
  mixins: [getInfoInitData],
  components: {
    EditText,
    EditItem
  },
  props: ['data', 'rules'],
  data() {
    const data = this.data;
    return {
      confirmSubmit: false,
      viewType: null,
      ruleForm: this.getInitData(this.data)
    };
  },
  computed: {
    coverArr() {
      return this.ruleForm.cover ? this.ruleForm.cover.split(';') : [];
    }
  },
  created() {
    this.eventListeners = {
      'editor-imgList-change': (imgList, editorId) => {
        this.ruleForm.editorImgsContainer[editorId] = [...imgList];
        this.$bus.$emit('cover-imgList-change', this.ruleForm.editorImgsContainer);
      }
    };
    this.$bus.$on('editor-imgList-change', this.eventListeners['editor-imgList-change']);
  },
  mounted() {
    if (this.data.newsId) {
      this.$message.success('该资讯已被其他人员采用，确认是否继续编辑？');
    }

    window.scrollTo(0, 0);
  },
  methods: {
    getImageList(content) {
      if (('' + content).indexof('<p>') > -1) {
        let startIndex = content.indexof('[');
        let endIndex = content.indexof(']');
        content = content.substring(startIndex, endIndex + 1);
      }

      return JSON.parse(content);
    },
    close() {
      this.viewType = null;
    },
    sure() {
      this.viewType = null;
      this.confirmSubmit = true;
      this.validForm();
    },
    backToIndex() {
      this.$ajax({
        url: DI.reptile.unlockEitInfoCache,
        context: this,
        loadingText: '正在解除编辑锁定，请稍候！',
        data: JSON.stringify({
          id: this.data.id
        }),
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('解除成功！');
            this.$emit('change-view', 'list');
            this.$bus.ruleForm = this.rules;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    onSubmitBtnClick() {
      if (this.data.newsId && !this.confirmSubmit) {
        this.viewType = 'confirmSubmit';
        return;
      }
      if (!this.data.newsId) {
        this.confirmSubmit = true;
      }
      this.firstStepOfSubmit();
    },
    sureSubmit() {
      this.confirmSubmit = true;
      this.firstStepOfSubmit();
    },
    firstStepOfSubmit() {
      const self = this;
      let ruleForm = this.ruleForm;
      let $content = this.$refs.content;
      this.viewType = null;

      $content.$refs.editor
        .getHtmlContents()
        .then(quillContent => {
          // 对html转义字符替换，会引起后台校验报错；
          quillContent = quillContent.replace(/&lt;/g, '<');
          quillContent = quillContent.replace(/&gt;/g, '>');

          ruleForm.content = quillContent;
          this.checkWords();
        })
        .catch(error => {
          self.$message.warning(`图片正在加载中，请稍候！`);
        });
    },
    checkCoverPixelSize() {
      let testUrl = this.coverArr[0];
      return getImgPixelSize(testUrl, false);
    },
    isGifUrl(url) {
      return /.*.gif(\?.*)?$/.test(url);
    },
    checkWords() {
      let $content = this.$refs.content;
      // 敏感词校验成功保存编辑
      $content.checkFields(true, validWords => {
        if (validWords) {
          this.validForm();
        } else {
          this.viewType = 'tip';
        }
      });
    },
    validForm() {
      let self = this;
      if (!this.confirmSubmit) return;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // 图文和日报手动校验第一张封面的像素宽度
          self
            .checkCoverPixelSize()
            .then(() => {
              self.submitForm();
            })
            .catch(err => {
              let errMsg = '';
              let errName = '封面';
              if (self.isGifUrl(self.coverArr[0])) {
                self.submitForm();
              } else {
                if (self.coverArr.length > 2) {
                  errName = '第一张封面';
                }
                if (err.width > err.max) {
                  errMsg = `当前资讯${errName}的像素宽度${err.width}px,超过${err.max}px`;
                } else {
                  errMsg = `当前资讯${errName}的像素宽度${err.width}px,小于${err.min}px`;
                }
                self.$message.warning(errMsg);
              }
            });
        } else {
          console.log('校验失败，请检查表单字段');
        }
      });
    },
    submitForm() {
      // this.getImgPixelSize(ruleForm.cover, false).then(value => {
      //   console.log(value);
      // });
      let ajaxData = {};
      const { data, ruleForm } = this;
      let $content = this.$refs.content;

      // 标签集合
      let infoLabel = ruleForm.categoryLabelList.find(item => '' + item.labelId === ruleForm.infoTypeVal);
      let columnLabel = ruleForm.columnLabelList.find(item => '' + item.labelId === ruleForm.infoColumnVal);
      let buLabel = ruleForm.buLabelList.find(item => '' + item.labelId === ruleForm.infoBuVal);
      let labels = [];

      labels = [...ruleForm.matchLabels, ...ruleForm.teamLabels, ...ruleForm.playerLabels, ...ruleForm.customLabels];
      if (infoLabel) {
        let tagItem = {
          labelId: infoLabel.labelId,
          labelType: Constant.getItemByKey(Constant.INFO_TAB_TYPE, 'type').value,
          labelName: infoLabel.labelName
        };
        labels.push(tagItem);
      }

      if (columnLabel) {
        let tagItem = {
          labelId: columnLabel.labelId,
          labelType: Constant.getItemByKey(Constant.INFO_TAB_TYPE, 'column').value,
          labelName: columnLabel.labelName
        };
        labels.push(tagItem);
      }

      if (buLabel) {
        let tagItem = {
          labelId: buLabel.labelId,
          labelType: Constant.getItemByKey(Constant.INFO_TAB_TYPE, 'bu').value,
          labelName: buLabel.labelName
        };
        labels.push(tagItem);
      }
      let getImgWidthPromises = [];
      let { coverArr } = this;
      coverArr.map(coverItem => {
        getImgWidthPromises.push(getImgPixelSize(coverItem, false));
      });

      Promise.all(getImgWidthPromises).then(arr => {
        ajaxData.imageWidths = arr.reduce((str, item) => {
          if (str) {
            str += `;${item.width}`;
          } else {
            str = `${item.width}`;
          }
          return str;
        }, '');
        ajaxData.bCheckFlag = 0; // 敏感词接口不校验
        ajaxData.id = data.id;
        ajaxData.authorId = ruleForm.authorId;
        ajaxData.content = ruleForm.content;
        ajaxData.nlrList = labels;
        ajaxData.title = ruleForm.title;
        ajaxData.cover = ruleForm.cover;
        ajaxData.level = ruleForm.rate;
        ajaxData.relNewsId = ruleForm.relNewsId || '';
        ajaxData.relNewsName = ruleForm.relNewsName;
        ajaxData.source = ruleForm.sourceWebsite; // 后台保存用source字段
        ajaxData.sourceWebsite = ruleForm.sourceWebsite;
        ajaxData.sourceDetailType = ruleForm.sourceWebsite ? 2 : 1;
        ajaxData.channelList = $content.channelSelectedIds;

        this.$ajax({
          url: DI.reptile.saveInfoDetail,
          context: this,
          loadingText: '正在保存编辑信息，请稍候！',
          data: JSON.stringify(ajaxData),
          success: res => {
            if (res.retCode == '0') {
              this.$emit('change-view', 'list');
              this.$bus.ruleForm = self.rules;
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.log('error');
          }
        });
      });
    }
  }
};
</script>

<style scoped>
.edit-container {
  padding: 10px 20px;
  background: #fff;

  .edit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header__title {
      font-size: 16px;
      color: #333;
    }
  }
  .edit-body {
    margin-top: 20px;
  }
}
.modal-body.check-modal {
  width: 480px;
  .words {
    height: 128px;
    overflow: auto;
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 30px;
    border-radius: 4px;
    font-size: 12px;
    background-color: #f4f6fb;
    .title {
      color: #6e7690;
      font-weight: bold;
    }
    .word {
      display: inline-block;
      padding-right: 15px;
      padding-bottom: 15px;
      color: #f47b77;
    }
  }
}
</style>

