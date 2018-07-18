<template>
  <div class="edit-container">
    <sn-form :model="ruleForm" ref="ruleForm" label-width="110px">
      <header class="edit-header">
        <h3 class="header__title">{{`发布${newsTypeItem.name}资讯`}}</h3>
      </header>
      <div class="edit-body">
        <component :is="`Publish-${newsTypeKey}`" :ruleForm="ruleForm" ref="content"></component>
      </div>
      <footer class="edit-footer">
        <edit-item>
          <sn-form-item class="btn-group" label-width="0">
            <sn-button type="primary" @click="sumitBtnClickHandler" class="mr-30" :disabled="doubleClick">发布</sn-button>
            <sn-button @click="handleClickSaveDraft" :disabled="doubleClick">保存草稿箱</sn-button>
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
import DI from 'interface';
import * as Constant from 'js/constant';
import getInfoDraftInitData from 'mixins/draft-data';
import { getImgPixelSize } from 'utils/image-operate';
import { VIDEOSET_URL } from 'utils/envUrl';
import { formatDate } from 'utils/util';
import debounce from 'utils/debounce';
import { fetchInfoInitDataAction, fetchDraftDetailsAction } from './fetch';

import EditItem from 'widgets/infoCommon/infoEditDetails/editItem';
import PublishText from './infoType/text';
import PublishDaily from './infoType/daily';
import PublishPicture from './infoType/picture';

const AUTO_SAVE_INTERVAL = 5 * 60 * 1000;

export default {
  name: 'InfoPublish',
  componentName: 'InfoPublish',
  mixins: [getInfoDraftInitData],
  components: {
    EditItem,
    PublishText,
    PublishDaily,
    PublishPicture
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
      ruleForm: this.getInfoDraftInitData(this.data)
    };
  },
  beforeRouteEnter(to, from, next) {
    const initDataPromise = fetchInfoInitDataAction(this, {
      params: {
        newsType: to.name
      }
    });
    if (to.query.id) {
      const draftDetailPromise = fetchDraftDetailsAction(this, {
        params: {
          draftId: to.query.id
        }
      });
      Promise.all([initDataPromise, draftDetailPromise]).then(([initData, draftDetail]) => {
        next(vm => {
          draftDetail.newsId = draftDetail.draftId;
          draftDetail.channelSet = JSON.parse(draftDetail.channelSet);

          initData.topicAllList = vm.filterSubjectListList(initData, draftDetail, 'topic');
          initData.columnAllList = vm.filterSubjectListList(initData, draftDetail, 'column');
          vm.data = Object.assign(vm.data, draftDetail);
          vm.data = Object.assign(vm.data, initData);
          vm.ruleForm = vm.getInfoDraftInitData(vm.data);
        });
      });
    } else {
      initDataPromise.then(initData => {
        next(vm => {
          initData.topicAllList = vm.filterSubjectListList(initData, [], 'topic');
          initData.columnAllList = vm.filterSubjectListList(initData, [], 'column');
          vm.data = Object.assign(vm.data, initData);
          vm.ruleForm = vm.getInfoDraftInitData(vm.data);
        });
      });
    }
  },
  // 路由改变前，组件就已经渲染完了
  // 逻辑稍稍不同
  beforeRouteUpdate(to, from, next) {
    /* getPost(to.params.id, (err, post) => {
      this.setData(err, post)
      next()
    }) */
  },
  computed: {
    coverArr() {
      const { cover } = this.ruleForm;
      return cover ? cover.split(';') : [];
    }
  },
  created() {
    if (this.newsTypeKey === 'video') {
      this.initVedioSetList();
    }
  },
  mounted() {
    window.scrollTo(0, 0);
    const { ruleForm } = this;
    this.eventListeners = {
      'editor-imgList-change': (imgList, editorId) => {
        ruleForm.editorImgsContainer[editorId] = [...imgList];
        this.$bus.$emit('cover-imgList-change', ruleForm.editorImgsContainer);
      }
    };
    this.$bus.$on('editor-imgList-change', this.eventListeners['editor-imgList-change']);

    this.autoSaveDraft = debounce(() => {
      this.handleClickSaveDraft(true);
    }, AUTO_SAVE_INTERVAL);
    this.autoSaveDraft();
  },
  beforeDestroy() {
    this.autoSaveDraft.clear();
    this.$bus.$off('editor-imgList-change');
  },
  methods: {
    filterSubjectListList(initData, draftDetail, type) {
      let draftSubjectList = (draftDetail.subjectList || []).filter(subject => {
        return type == 'column' ? subject.subjectType == 1 : subject.subjectType == 3;
      });
      let defaultSubjectList = (initData.subjectList || []).filter(subject => {
        return type == 'column' ? subject.subjectType == 1 : subject.subjectType == 3;
      });
      let totalSubjectList = [...draftSubjectList, ...defaultSubjectList];
      let subjectObject = {};
      for (let index = 0, len = totalSubjectList.length; index < len; index++) {
        const subject = totalSubjectList[index];
        if (!subjectObject[subject.subjectId]) {
          subjectObject[subject.subjectId] = subject;
        }
      }
      return type == 'column' ? Object.values(subjectObject) : Object.values(subjectObject).reverse();
    },
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
    backToLibraryPage() {
      if (window.top === window) {
        this.$router.push('/');
      } else {
        let $first_menu = $($('.nav-box .nav', parent.document).find('.nav-list__parent')[0]);
        let $tar_menu = $($first_menu.find('li')[0]);
        $tar_menu.click();
      }
    },
    backToLibraryPage() {
      if (window.top === window) {
        this.$router.push('/');
      } else {
        let $system_nav = $('.nav-box .nav', parent.document);
        let isOldSystem = $($system_nav.find('.nav-list__parent')).length > 0;
        if (isOldSystem) {
          let $first_menu = $($system_nav.find('.nav-list__parent')[0]);
          let $tar_menu = $($first_menu.find('li')[0]);
          $tar_menu.click();
        } else {
          const $list = window.top.document.getElementsByClassName('nav');
          $list[$list.length - 1]
            .getElementsByClassName('nav-list')[0]
            .getElementsByTagName('li')[0]
            .getElementsByTagName('a')[0]
            .click();
        }
      }
    },
    close() {
      this.doubleClick = false;
      this.viewType = null;
    },
    sure() {
      this.viewType = null;
      this.doubleClick = true;
      this.validForm();
    },
    sumitBtnClickHandler() {
      this.doubleClick = true;
      let self = this;
      const newsTypeKey = this.newsTypeKey; //资讯类型
      let ruleForm = this.ruleForm;
      let $content = this.$refs.content;
      // console.log('voteInfo=====', $content.$refs.editor.voteInfo); 、、 图文类型投票
      switch (newsTypeKey) {
        case 'text':
          $content.$refs.editor
            .getHtmlContents()
            .then(quillContent => {
              ruleForm.content = quillContent;
              self.checkSensitiveWords();
            })
            .catch(error => {
              this.doubleClick = false;
              this.$message.warning(`图片正在加载中，请稍候！`);
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
            .then(function(results) {
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
              }).catch(err => {
                self.doubleClick = false;
                self.$message.warning(err.msg);
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

      let ajaxData = {
        news: {}
      };
      let labels = [];
      ajaxData.news.content = ruleForm.content;

      switch (newsTypeKey) {
        case 'picture':
          ajaxData.news.content = $content.$refs.img.getData();
          break;
        case 'video':
          ajaxData.news.vedioId = ruleForm.vedioId;
          ajaxData.news.vedioSetId = ruleForm.vedioSetId;
          break;
        case 'daily':
          ajaxData.news.content = this.dailySubmitContent;
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
      if (newsTypeKey == 'picture') {
        let imageWidths = '';
        getImgPixelSize(ruleForm.cover.split(';')[0], false).then(value => {
          imageWidths += value.width + ';';
          getImgPixelSize(ruleForm.cover.split(';')[1], false).then(value => {
            imageWidths += value.width + ';';
          });
          getImgPixelSize(ruleForm.cover.split(';')[2], false).then(value => {
            imageWidths += value.width;
            ajaxData.news.imageWidths = imageWidths;
            this.publish(ajaxData, ruleForm, labels);
          });
        });
      } else {
        let getImgWidthPromises = [];
        let { coverArr } = this;
        coverArr.map(coverItem => {
          getImgWidthPromises.push(getImgPixelSize(coverItem, false));
        });

        Promise.all(getImgWidthPromises).then(arr => {
          let imageWidths = arr.reduce((str, item) => {
            if (str) {
              str += `;${item.width}`;
            } else {
              str = `${item.width}`;
            }
            return str;
          }, '');
          ajaxData.news.imageWidths = imageWidths;
          this.publish(ajaxData, ruleForm, labels);
        });
      }
    },
    publish(ajaxData, ruleForm, labels) {
      ajaxData.bCheckFlag = 0; // 敏感词接口不校验
      ajaxData.author = ruleForm.author;
      ajaxData.labelArrayJson = labels;
      ajaxData.channelArrayJson = ruleForm.channelSet;
      ajaxData.news.title = ruleForm.title;
      ajaxData.news.cover = ruleForm.cover;
      ajaxData.news.level = ruleForm.rate;
      ajaxData.news.relNewsId = ruleForm.relNewsId;
      ajaxData.news.relNewsName = ruleForm.relNewsName;
      ajaxData.news.sourceDetailType = ruleForm.sourceDetailType;
      ajaxData.news.source = ruleForm.source;
      ajaxData.news.newsId = ruleForm.newsId;
      ajaxData.news.newsType = ruleForm.newsType;

      ajaxData.labelArrayJson = JSON.stringify(ajaxData.labelArrayJson);
      ajaxData.channelArrayJson = JSON.stringify(ajaxData.channelArrayJson);

      this.$ajax({
        url: DI.publish.publishNews,
        context: this,
        loadingText: '正在发布资讯，请稍候！',
        data: JSON.stringify(ajaxData),
        success: res => {
          if (res.retCode == '0') {
            this.backToLibraryPage();
          } else {
            this.$message.error(res.retMsg);
          }
          this.doubleClick = false;
        },
        error: () => {
          console.log('error');
        }
      });
    },
    handleClickSaveDraft(auto) {
      this.doubleClick = true;
      const self = this;
      const newsTypeKey = this.newsTypeKey; //资讯类型
      let ruleForm = this.ruleForm;
      let $content = this.$refs.content;

      switch (newsTypeKey) {
        case 'text':
          $content.$refs.editor
            .getHtmlContents()
            .then(quillContent => {
              ruleForm.content = quillContent;
              self.submitDraft(auto);
            })
            .catch(error => {
              self.$message.warning(`图片正在加载中，请稍候！`);
            });

          break;
        case 'picture':
          self.submitDraft(auto);

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
              this.dailySubmitContent = submitContent;
              self.submitDraft(auto);
            })
            .catch(function(reason) {
              self.$message.warning(`图片正在加载中，请稍候！`);
            });

          break;
        default:
          self.submitDraft(auto);
      }
    },
    submitDraft(auto) {
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
          ajaxData.content = JSON.stringify(this.dailySubmitContent);
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

      ajaxData.bCheckFlag = 0; // 敏感词接口不校验
      ajaxData.authorId = ruleForm.authorId;
      ajaxData.authorName = ruleForm.authorName;
      ajaxData.labelSet = labels;
      ajaxData.channelSet = ruleForm.channelSet;
      ajaxData.title = ruleForm.title;
      ajaxData.cover = ruleForm.cover;
      ajaxData.level = ruleForm.rate;
      ajaxData.relNewsId = ruleForm.relNewsId;
      ajaxData.relNewsName = ruleForm.relNewsName;
      ajaxData.sourceDetailType = ruleForm.sourceDetailType;
      ajaxData.source = ruleForm.source;
      ajaxData.draftId = ruleForm.newsId;
      ajaxData.newsType = ruleForm.newsType;
      // console.log('voteInfo=====', $content.$refs.editor.voteInfo); // 图文类型投票

      ajaxData.labelSet = JSON.stringify(ajaxData.labelSet);
      ajaxData.channelSet = JSON.stringify(ajaxData.channelSet);

      this.$ajax({
        url: DI.publish.saveToDraftContainer,
        context: this,
        loadingText: '正在保存草稿箱，请稍候！',
        data: JSON.stringify(ajaxData),
        success: res => {
          if (res.retCode == '0') {
            const now = formatDate(new Date(), 'hh:mm');
            const msg = `${now} ${auto ? '自动保存成功' : '保存至草稿箱成功'}`;
            this.$message.success(msg);
            this.autoSaveDraft();
          } else {
            this.$message.error(res.retMsg);
          }
          this.doubleClick = false;
        },
        error: () => {
          this.autoSaveTimer = null;
          clearInterval(this.autoSaveTimer);
          console.log('error');
        }
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

