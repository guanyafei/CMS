<template>
  <div class="edit-container">
    <sn-form :model="ruleForm" ref="ruleForm" label-width="110px">
      <header class="edit-header">
        <h3 class="header__title">{{`编辑${newsTypeItem.name}资讯`}}</h3>
      </header>
      <div class="edit-body">
        <component :is="`edit-${newsTypeKey}`" :ruleForm="ruleForm" ref="content"></component>
      </div>
      <footer class="edit-footer">
        <edit-item>
          <sn-form-item class="btn-group" label-width="0">
            <sn-button type="primary" @click="sumitBtnClickHandler" class="mr-30" :disabled="doubleClick">保存</sn-button>
            <sn-button @click="cancelEdit">取消</sn-button>
          </sn-form-item>
        </edit-item>
      </footer>
    </sn-form>
    <sn-confirm
      title="提示"
      v-show="viewType==='tip'"
      close-icon
      @close="close"
      @sure="sure"
      confirmButtonText="继续保存"
      cancelButtonText="返回检查"
      noflag
    >
      <div class="modal-body">
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
import getInfoInitData from 'mixins/info-data';
import { getImgPixelSize } from 'src/utils/image-operate';
import { VIDEOSET_URL } from 'src/utils/envUrl';
import { fetchInfoItemDetailsAction } from 'views/info-management/library/fetch';

import EditText from './infoType/text';
import EditVideo from './infoType/video';
import EditDaily from './infoType/daily';
import EditPicture from './infoType/picture';
import EditShortV from './infoType/shortV';
import EditItem from '../infoEditDetails/editItem';

export default {
  name: 'InfoEdit',
  componentName: 'InfoEdit',
  mixins: [getInfoInitData],
  components: {
    EditText,
    EditVideo,
    EditDaily,
    EditPicture,
    EditShortV,
    EditItem
  },
  props: ['newsType'],
  data() {
    this.data = {
      newsType: this.newsType
    };

    return {
      dailySubmitContent: '',
      viewType: null,
      doubleClick: false,
      ruleForm: this.getInitData(this.data)
    };
  },
  computed: {
    coverArr() {
      const { cover } = this.ruleForm;
      return cover ? cover.split(';') : [];
    }
  },
  beforeRouteEnter(to, from, next) {
    fetchInfoItemDetailsAction(this, {
      params: {
        newsId: to.query.id
      }
    }).then(res => {
      next(vm => {
        vm.data = Object.assign(vm.data, res);
        vm.ruleForm = vm.getInitData(vm.data);
      });
    });
  },
  beforeRouteUpdate(to, from, next) {
    console.log('beforeRouteUpdate');
    /* getPost(to.params.id, (err, post) => {
      this.setData(err, post)
      next()
    }) */
  },
  created() {
    const { ruleForm } = this;
    if (this.newsTypeKey === 'video') {
      this.initVedioSetList();
    }
    this.eventListeners = {
      'editor-imgList-change': (imgList, editorId) => {
        ruleForm.editorImgsContainer[editorId] = [...imgList];

        this.$bus.$emit('cover-imgList-change', ruleForm.editorImgsContainer);
      }
    };
    this.$bus.$on('editor-imgList-change', this.eventListeners['editor-imgList-change']);
  },
  mounted() {
    window.scrollTo(0, 0);
    let self = this;
    window.beforeLeave = function() {//跟layout左边栏方法交互解锁
      $.ajax({
        url: '/snsis-admin-web/adminMgt/cancelNewsFlag.do',
        type: 'post',
        contentType: 'application/json',
        data: JSON.stringify({
          newsId: self.data.newsId
        }),
        success: res => {
          if (res.retCode == '0') {
            self.$message.success('解除成功！');
          } else {
            self.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    };
  },
  beforeDestroy() {
    this.$bus.$off('editor-imgList-change');
  },
  methods: {
    initVedioSetList() {
      let ruleForm = this.ruleForm;
      this.$ajax({
        url: `${VIDEOSET_URL}/bppchannel.api?id=${ruleForm.vedioId}&showset=1&format=jsonp`,
        noBaseUrl: true,
        noFilter: true,
        type: 'GET',
        dataType: 'jsonp',
        loadingText: '正在加载视频合集列表，请稍候！',
        timeout: 5000,
        context: this,
        success(data) {
          ruleForm.vedioSetList = (data.channels && data.channels[0] && data.channels[0].setRelates) || [];
        },
        error(err) {
          console.log(err);
        }
      });
    },
    getImageList(content) {
      if (('' + content).indexof('<p>') > -1) {
        let startIndex = content.indexof('[');
        let endIndex = content.indexof(']');
        content = content.substring(startIndex, endIndex + 1);
      }

      return JSON.parse(content);
    },
    cancelEdit() {
      this.$ajax({
        url: DI.infoLibrary.delEitLibraryCache,
        context: this,
        loadingText: '正在解除编辑锁定，请稍候！',
        data: JSON.stringify({
          newsId: this.data.newsId
        }),
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('解除成功！');
            this.backTo();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    backTo() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
    },
    close() {
      this.doubleClick = false;
      this.viewType = null;
    },
    sure() {
      this.doubleClick = true;
      this.viewType = null;
      this.validForm();
    },
    sumitBtnClickHandler() {
      this.doubleClick = true;
      let self = this;
      const newsTypeKey = this.newsTypeKey; //资讯类型
      let ruleForm = this.ruleForm;
      let $content = this.$refs.content;

      switch (newsTypeKey) {
        case 'text':
          $content.$refs.editor
            .getHtmlContents()
            .then(quillContent => {
              const videoReg = /\[MEMO\]\w*\d*\[\/MEMO\]/g;
              const imgReg = /(?!<img[^>]*goods-img[^>]*>)<img[^>]*>/g;
              let videoSet = quillContent.match(videoReg);
              let imgSet = quillContent.match(imgReg);
              ruleForm.content = quillContent;

              if (videoSet && videoSet.length > 5) {
                self.doubleClick = false;
                self.$message.warning(`已上传${imgSet.length}个，最多上传5个视频`);
                return;
              }

              if (imgSet && imgSet.length > 20) {
                self.doubleClick = false;
                self.$message.warning(`已上传${imgSet.length}张，最多上传20张图片`);
                return;
              }

              self.checkSensitiveWords();
            })
            .catch(error => {
              self.doubleClick = false;
              self.$message.warning(`图片正在加载中，请稍候！`);
            });

          break;
        case 'picture':
          let $img = $content.$refs.img;
          if (!$img.doValidate()) {
            this.doubleClick = false;
            return;
          }
          self.checkSensitiveWords();

          break;
        case 'daily':
          let submitContent = { textContent: '', columnList: [], dom: '' };
          let promises = [$content.$refs.editor.getHtmlContents()];

          ruleForm.dailyColumnList.map((columm, index) => {
            let $dailyEditor = $content.$refs.dailyColumnList.$refs[`columnItem${index}`][0].$refs.dailyEditor;
            promises.push($dailyEditor.getHtmlContents());
          });

          Promise.all(promises)
            .then(results => {
              submitContent.textContent = results[0];
              results.splice(0, 1);
              results.map(result => {
                submitContent.dom +=
                  `<div class="column"><div class="title">${result.title}</div><div class="column-content">` + result.dom + `</div></div>`;
                submitContent.columnList.push({
                  title: result.title,
                  content: {
                    ctt: result.ctt,
                    dom: result.dom
                  }
                });
              });
              self.checkSensitiveWords(JSON.stringify(submitContent));
            })
            .catch(function(reason) {
              self.doubleClick = false;
              self.$message.warning(`图片正在加载中，请稍候！`);
            });

          break;
        default:
          self.checkSensitiveWords();
      }
    },
    checkCoverPixelSize(valid) {
      let testUrl = this.coverArr[0];
      return getImgPixelSize(testUrl, valid, { max: null, min: null });
    },
    isGifUrl(url) {
      return /.*.gif(\?.*)?$/.test(url);
    },
    checkSensitiveWords(submitContentStr) {
      let $content = this.$refs.content;
      submitContentStr && (this.dailySubmitContent = submitContentStr);
      // 敏感词校验成功保存编辑
      $content.checkFields(true, validWords => {
        if (validWords) {
          this.doubleClick = true;
          this.validForm();
        } else {
          this.doubleClick = false;
          this.viewType = 'tip';
        }
      });
    },
    validForm() {
      let self = this;
      const newsTypeKey = this.newsTypeKey; //资讯类型
      const isThreeCover = this.coverArr.length > 2;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if (newsTypeKey === 'picture') {
            self.submitForm();
          } else {
            self
              .checkCoverPixelSize(!isThreeCover)
              .then(() => {
                self.submitForm();
              })
              .catch(err => {
                let errMsg = err.msg || '';
                let errName = '封面';
                if (self.isGifUrl(self.coverArr[0])) {
                  self.submitForm();
                } else {
                  if (isThreeCover) {
                    errName = '第一张封面';
                  }
                  if (err.max && err.width > err.max) {
                    errMsg = `当前资讯${errName}的像素宽度${err.width}px,超过${err.max}px`;
                  }
                  if (err.min && err.width < err.min) {
                    errMsg = `当前资讯${errName}的像素宽度${err.width}px,小于${err.min}px`;
                  }
                  self.doubleClick = false;
                  self.$message.warning(errMsg);
                }
              });
          }
        } else {
          this.doubleClick = false;
          console.log('存在未校验表单字段.');
        }
      });
    },
    submitForm() {
      const { newsTypeKey, ruleForm } = this;

      let $content = this.$refs.content;
      let ajaxData = {};

      let labels = [];
      ajaxData.content = ruleForm.content;
      switch (newsTypeKey) {
        case 'picture':
          ajaxData.content = $content.$refs.img.getData();
          break;
        case 'video':
          ajaxData.vedioId = ruleForm.vedioId;
          ajaxData.vedioSetId = ruleForm.vedioSetId;
          break;
        case 'daily':
          ajaxData.content = this.dailySubmitContent;
          break;
        default:
          break;
      }

      labels = [...ruleForm.matchLabels, ...ruleForm.teamLabels, ...ruleForm.playerLabels, ...ruleForm.customLabels];

      // 标签集合
      let infoLabel = ruleForm.categoryLabelList.find(item => '' + item.labelId === ruleForm.infoTypeVal);
      let columnLabel = ruleForm.columnLabelList.find(item => '' + item.labelId === ruleForm.infoColumnVal);
      let buLabel = ruleForm.buLabelList.find(item => '' + item.labelId === ruleForm.infoBuVal);

      if (infoLabel) {
        labels.push({
          labelId: infoLabel.labelId,
          labelType: Constant.getItemByKey(Constant.INFO_TAB_TYPE, 'type').value,
          labelName: infoLabel.labelName
        });
      }

      if (columnLabel) {
        labels.push({
          labelId: columnLabel.labelId,
          labelType: Constant.getItemByKey(Constant.INFO_TAB_TYPE, 'column').value,
          labelName: columnLabel.labelName
        });
      }

      if (buLabel) {
        labels.push({
          labelId: buLabel.labelId,
          labelType: Constant.getItemByKey(Constant.INFO_TAB_TYPE, 'bu').value,
          labelName: buLabel.labelName
        });
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
        ajaxData.nlrList = labels;
        ajaxData.title = ruleForm.title;
        ajaxData.cover = ruleForm.cover;
        ajaxData.level = ruleForm.rate;
        ajaxData.relNewsId = ruleForm.relNewsId;
        ajaxData.relNewsName = ruleForm.relNewsName;
        ajaxData.sourceDetailType = ruleForm.sourceDetailType;
        ajaxData.source = ruleForm.source;
        ajaxData.originAuthorId = ruleForm.authorId;
        ajaxData.newsId = ruleForm.newsId;
        ajaxData.newsType = ruleForm.newsType;

        this.$ajax({
          url: DI.infoLibrary.editLibraryInfo,
          context: this,
          loadingText: '正在保存编辑信息，请稍候！',
          data: JSON.stringify(ajaxData),
          success: res => {
            if (res.retCode == '0') {
              this.backTo();
            } else {
              this.$message.error(res.retMsg);
            }
            this.doubleClick = false;
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
  font-size: 14px;

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
.modal-body {
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

