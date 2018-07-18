<template>
  <div>
    <sn-form-item
      label="日报正文"
      class="form-editor-item"
      ref="dailyEditorItem"
      :prop="'dailyColumnList.' + columnIndex + '.content' + '.ctt'"
      :rules="dailyEditorRules"
    >
      <quill-editor v-model="content" :height="500" ref="editor" @ready="onEditorReady" @change="onEditorChange">
        <div slot="description">
          <p class="quill-title">{{`文本10-3000字；支持插入${config.maxVideosNum}段视频；支持插入${config.maxMatchesNum}场比赛；`}}</p>
          <p class="quill-title">{{`支持插入${config.maxImagesNum}张图片，支持JPG、PNG、JPEG、GIF格式，GIF支持8M 内，其他图片格式1M以内；`}}</p>
        </div>
        <div slot="toolbar">
          <span class="ql-formats">
            <button class="ql-image" title="插入图片"></button>
            <button class="ql-video" title="插入视频"></button>
            <button class="editor__button editor__button--link" title="插入资讯链接" @click="handleInfoLinkButtonClick"></button>
            <button class="editor__button editor__button--match" title="插入比赛" @click="handleMatchButtonClick"></button>
            <button class="ql-link" title="插入链接"></button>
          </span>
        </div>
      </quill-editor>
    </sn-form-item>
    <form class="editor-form__input" enctype="multipart/form-data" method="post">
      <input name="file" type="file" ref="fileInput" @change="handleFileInputChange" accept="image/png, image/gif, image/jpeg, image/x-icon">
    </form>
    <sn-confirm ref="tip" v-show="viewType==='tip'" :title="tipTitle" @sure="close" confirm-button-text="我知道了" hide-cancel-button txt noflag>
      {{tipMsg}}
    </sn-confirm>
    <sn-confirm
      ref="link"
      title="插入资讯链接"
      @sure="doAddInfoLink"
      @close="close"
      close-icon
      v-show="viewType==='infoLink'"
      confirmButtonText="插入"
      noflag>
      <div class="modal-body">
        <sn-input
          placeholder="请输入关联内容ID或标题"
          ref="searchLinkInput"
          v-model="searchLinkInput"
          required
          autoValid
          width="520"
        >
          <sn-button
            slot="append"
            type="primary"
            :circle="false"
            @click="fetchLinkNewsByFilter"
            class="link-search__button"
          >搜索</sn-button>
        </sn-input>
        <sn-table
          :data="linkContentList"
          theme="dialog"
          :scroll-loading="true"
          height="350"
          @tbody-scroll="onLinkTableScroll">
          <sn-table-column width="60" sloted wall="false">
            <template slot-scope="row">
              <sn-radio :label="row.newsId" v-model="selectedRelContentId"></sn-radio>
            </template>
          </sn-table-column>
          <sn-table-column label="资讯ID" prop="newsId" width="20%">
          </sn-table-column>
          <sn-table-column label="资讯标题" prop="title">
          </sn-table-column>
        </sn-table>
      </div>
    </sn-confirm>
    <sn-confirm
      ref="match"
      title="添加比赛"
      @sure="doAddMatch"
      @close="close"
      close-icon
      v-show="viewType==='match'"
      confirmButtonText="插入"
      noflag
    >
      <div class="modal-body">
        <sn-input placeholder="请输入节目ID" ref="matchInput" v-model="searchMatchInput" width="520">
          <sn-button
            slot="append"
            type="primary"
            :circle="false"
            @click="fetchMatchInfoById"
            class="link-search__button"
          >搜索</sn-button>
        </sn-input>
        <div class="modal-match__info">
          <div v-if="allMatchList.length===matchList.length">今明两天共有{{allMatchList.length}}赛事</div>
          <div v-else>
            <span class="modal-match__btn--back" @click="backToAllMatches">返回</span>
            <span>搜索：{{`\"${searchResultMatchId}\"`}}</span>
          </div>
          <div>
            您还可以添加{{maxMatchesNum - selectedMatchListIds.length}}场赛事，已选择：
            <div :class="['selected-matches__box', {
                  'is-show': isSelectedMatchListShow
                }]"
                v-clickoutside="hideSelectedMatchList"
            >
              <span class="selected-matches__info" @click="toggleSelectedMatchList">
                {{selectedMatchListIds.length}}场赛事
              </span>
              <transition name="fade" mode="out-in">
                <div class="selected-matches__list">
                  <sn-table :data="selectedMatchList" theme="dialog" height="252" :table-header="false">
                    <sn-table-column label="节目ID" prop="matchitemShowId" width="20%">
                    </sn-table-column>
                    <sn-table-column label="赛事信息" prop="matchDes" width="20%">
                    </sn-table-column>
                    <sn-table-column label="节目名称" prop="matchitemShowName" width="30%">
                    </sn-table-column>
                    <sn-table-column label="赛事时间" prop="startTime" width="20%" tdPaddingRight="5" sloted>
                      <template slot-scope="row">
                        <sn-td-date :time="row.startTime"></sn-td-date>
                      </template>
                    </sn-table-column>
                    <sn-table-column wall="false" label="" tdPaddingLeft="5" sloted>
                      <template slot-scope="row">
                        <em class="modal-match__btn--del" @click="doDelSelectedMatchItem(row)">
                        </em>
                      </template>
                    </sn-table-column>
                  </sn-table>
                </div>
              </transition>
            </div>
          </div>
        </div>
        <sn-table :data="matchList" theme="dialog" height="252">
          <sn-table-column width="40" wall="false" tdPaddingRight="5" sloted>
            <template slot-scope="row">
              <sn-checkbox
                v-model="selectedMatchListIds"
                :label="''+row.matchitemShowId"
                :disabled="disabledMatchListIds.indexOf(''+row.matchitemShowId)!==-1"
                @change="onSelectedMatchListIdsChange"
              ></sn-checkbox>
            </template>
          </sn-table-column>
          <sn-table-column label="节目ID" prop="matchitemShowId" width="20%">
          </sn-table-column>
          <sn-table-column label="赛事信息" prop="matchDes" width="20%">
          </sn-table-column>
          <sn-table-column label="节目名称" prop="matchitemShowName">
          </sn-table-column>
          <sn-table-column label="赛事时间" prop="startTime" width="25%">
          </sn-table-column>
        </sn-table>
      </div>
    </sn-confirm>
    <video-dialog
      ref="videoDialog"
      :viewType="viewType"
      :size="ruleForm.fileSize"
      @sure="doInsertVideo"
      @close="close"
      :disableLocalVideo="true"
      @triggerUpload="handleUploadClick"
    >
    </video-dialog>
    <type-link-dialog :viewType="viewType" @sure="insertTypeLink" @close="close"></type-link-dialog>
  </div>
</template>

<script>
import DI from 'interface';
import * as Constant from 'js/constant';
import Clickoutside from 'directives/clickoutside';
import editorToolbar from 'utils/editor-toolbar';
import TypeLinkDialog from 'widgets/editor/typeLinkDialog';
import VideoDialog from 'widgets/editor/videoDialog';
import QuillEditor from 'widgets/editor/quillEditor';
import { getInfoLinkUrl } from 'utils/envUrl';
import { formatDate } from 'utils/util';
const MAX_IMGAES_NUM = 10;
const MAX_VIDEOS_NUM = 10;
const MAX_MACTCHES_NUM = 10;

export default {
  name: 'DailyEditor',
  componentName: 'DailyEditor',
  mixins: [editorToolbar('daily')],
  directives: { Clickoutside },
  props: ['value', 'columnIndex', 'ruleForm'],
  components: {
    TypeLinkDialog,
    QuillEditor,
    VideoDialog
  },
  data() {
    return {
      config: {
        editorType: 'daily',
        maxImagesNum: MAX_IMGAES_NUM,
        maxVideosNum: MAX_VIDEOS_NUM,
        maxMatchesNum: MAX_MACTCHES_NUM
      },
      viewType: null,
      tipMsg: '',
      retMsg: '',
      tipTitle: '',
      editorSelection: {
        index: 0,
        length: 0
      },
      total: 0,
      searchLinkInput: '',
      selectedRelContentId: '',
      linkContentList: [],
      linkPageIndex: 0,
      searchMatchInput: '',
      searchResultMatchId: '',
      allMatchList: [],
      disabledMatchListIds: [],
      selectedMatchList: [],
      selectedMatchListIds: [],
      isSelectedMatchListShow: false,
      maxMatchesNum: MAX_MACTCHES_NUM,
      matchList: []
    };
  },
  computed: {
    editor() {
      return this.$refs.editor.quill;
    },
    content() {
      return this.value;
    },
    dailyEditorRules() {
      let dailyContextValidation = (rule, value, callback) => {
        let tempDom = document.createElement('div');
        tempDom.innerHTML = value;
        let text = this.editor
          .getText()
          .trim()
          .replace(/\n/g, '')
          .replace(/\[MEMO[^\[]*\[\/MEMO\]/g, '')
          .replace(/\[MATCH[^\[]*\[\/MATCH\]/g, '');
        if (text.length < 10) {
          callback(new Error('日报正文文字个数不能少于10'));
        } else if (text.length > 3000) {
          callback(new Error('日报正文文字个数不能大于3000'));
        }

        const imgListNodes = tempDom.querySelectorAll('img:not(.goods-img)');
        if (imgListNodes && imgListNodes.length > 10) {
          callback(new Error('日报正文最多只能上传10张图片'));
        }

        const reg = /\[MEMO[^\[]*\[\/MEMO\]/g;
        const videoResult = value.match(reg);
        if (videoResult && videoResult.length > 10) {
          callback(new Error('日报正文最多只能上传10个视频'));
        }
        // 校验视频个数 end

        //校验比赛个数 start
        const matchReg = /\[MATCH[^\[]*\[\/MATCH\]/g;
        const matchResult = value.match(matchReg);
        if (matchResult && matchResult.length > 10) {
          callback(new Error('日报正文最多只能添加10个比赛'));
        }

        callback();
      };
      return [
        {
          required: true,
          message: `请输入栏目正文`,
          trigger: 'blur'
        },
        {
          validator: dailyContextValidation,
          trigger: 'change'
        }
      ];
    }
  },
  mounted() {
    let toolbar = this.editor.getModule('toolbar');
    toolbar.addHandler('image', this.handleImageButtonClick);
    toolbar.addHandler('video', this.handleVideoButtonClick);
    toolbar.addHandler('link', this.handleTypeLinkButtonClick);
  },
  methods: {
    handleInfoLinkButtonClick() {
      this.getEditorSelectionIndex();
      this.viewType = 'infoLink';
    },
    insertInfoLink(str, url) {
      const { editor, editorSelection, addEditorSelectionIndex } = this;
      editor.deleteText(editorSelection.index, editorSelection.length);
      editor.insertText(editorSelection.index, str, { link: { 'data-router': url } });
      addEditorSelectionIndex(str.length);
    },
    getNewsType(value) {
      return Constant.getItemByValue(Constant.ARTICLE_TYPE, value).key;
    },
    getLinkUrl(selectedItem) {
      let selectedNewsType = this.getNewsType(selectedItem.newsType);
      return getInfoLinkUrl(selectedItem, selectedNewsType);
    },
    doAddInfoLink() {
      if (this.selectedRelContentId) {
        let selectedItem = this.linkContentList.find(item => {
          return item.newsId === this.selectedRelContentId;
        });
        this.insertInfoLink(selectedItem.title, this.getLinkUrl(selectedItem));
        this.selectedRelContentId = '';
        this.linkContentList = [];
        this.clearLinkInputMsg();
        this.viewType = null;
      } else {
        this.$message.error('请选择一条资讯插入');
      }
    },
    onLinkTableScroll() {
      this.linkNewsDataLoading = true;
      this.linkPageIndex += 10;

      this.$ajax({
        url: DI.infoLibrary.fetchInfoByPages,
        context: this,
        type: 'get',
        data: {
          newsSearch: this.searchLinkInput,
          pageIndex: this.linkPageIndex,
          pageSize: 10
        },
        success: res => {
          if (res.retCode == '0') {
            const data = res.data;
            this.linkContentList.push(...(data.newsList || []));
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    fetchLinkNewsByFilter() {
      if (!this.searchLinkInput) {
        this.$refs.searchLinkInput.check();
        return;
      }
      this.linkPageIndex = 0;

      this.$ajax({
        url: DI.infoLibrary.fetchInfoByPages,
        context: this,
        type: 'get',
        data: {
          newsSearch: this.searchLinkInput,
          pageIndex: this.linkPageIndex,
          pageSize: 10
        },
        success: res => {
          if (res.retCode == '0') {
            const data = res.data;
            this.linkContentList = data.newsList;
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    clearLinkInputMsg() {
      this.searchLinkInput = '';
      this.$nextTick(() => {
        this.$refs.searchLinkInput && this.$refs.searchLinkInput.setMsg();
      });
    },
    handleMatchButtonClick() {
      this.getEditorSelectionIndex();
      const content = this.editor.root.innerHTML;
      const reg = /\[MATCH[^\[]*\[\/MATCH\]/g;
      const temp = content.match(reg);
      if (temp && temp.length > 9) {
        this.tipTitle = '提示';
        this.tipMsg = '最多只能上传10场比赛';
        this.viewType = 'tip';
        return;
      }
      this.disabledMatchListIds = this.getDisabledMatchListIds();
      this.viewType = 'match';
      if (this.allMatchList.length === 0) {
        this.queryAllMatchList().then(list => {
          this.selectedMatchListIds = [...this.disabledMatchListIds];
        });
      }
    },
    queryAllMatchList() {
      return new Promise((resolve, reject) => {
        this.$ajax({
          url: DI.infoLibrary.fetchAllMatchesInDailyEdit,
          loadingText: '正在加载比赛列表，请稍候！',
          context: this,
          mock: true,
          success: res => {
            if (res.retCode == '0') {
              const data = res.data || {};
              this.allMatchList = data.matchList || [];
              this.matchList = this.allMatchList;
              resolve(data.matchList || []);
            } else {
              this.$message.error(res.retMsg);;
            }
          },
          error: () => {
            console.log('error');
          }
        });
      });
      this.$ajax({
        url: DI.infoLibrary.fetchAllMatchesInDailyEdit,
        loadingText: '正在加载比赛列表，请稍候！',
        context: this,
        mock: true,
        success: res => {
          if (res.retCode == '0') {
            const data = res.data || {};
            this.allMatchList = data.matchList || [];
            this.matchList = this.allMatchList;
            this.selectedMatchListIds = [...this.disabledMatchListIds];
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    onSelectedMatchListIdsChange(e) {
      let id = '' + e.target.value;
      let { selectedMatchListIds, matchList, selectedMatchList } = this;
      if (selectedMatchListIds.length > 10) {
        const changeIdIndex = selectedMatchListIds.indexOf(id);
        if (changeIdIndex !== -1) {
          selectedMatchListIds.splice(changeIdIndex, 1);
        }
        this.$message.warning('最多添加10场赛事');
        return;
      }
      let matchIdindex = selectedMatchListIds.indexOf(id);
      if (matchIdindex !== -1) {
        for (let i = 0; i < matchList.length; i++) {
          const match = matchList[i];
          if (match.matchitemShowId == id) {
            selectedMatchList.push(match);
            break;
          }
        }
      } else {
        for (let i = 0; i < selectedMatchList.length; i++) {
          const match = selectedMatchList[i];
          if (match.matchitemShowId == id) {
            selectedMatchList.splice(i, 1);
            break;
          }
        }
      }
    },
    backToAllMatches() {
      if (this.allMatchList.length === 0) {
        this.queryAllMatchList().then(() => {
          this.clearMatchInputMsg();
        });
      } else {
        this.matchList = this.allMatchList;
        this.clearMatchInputMsg();
      }
    },
    doDelSelectedMatchItem(item) {
      let { selectedMatchList, selectedMatchListIds } = this;
      const delSelectedItemIndex = selectedMatchList.indexOf(item);
      if (delSelectedItemIndex === -1) {
        return;
      }
      const delArr = selectedMatchList.splice(delSelectedItemIndex, 1);
      const delSelectedIdIndex = selectedMatchListIds.indexOf('' + delArr[0].matchitemShowId);
      if (delSelectedIdIndex !== -1) {
        selectedMatchListIds.splice(delSelectedIdIndex, 1);
      }
    },
    toggleSelectedMatchList() {
      this.isSelectedMatchListShow = !this.isSelectedMatchListShow;
    },
    hideSelectedMatchList() {
      this.isSelectedMatchListShow = false;
    },
    getDisabledMatchListIds() {
      let newDisabledMatchListIds = [];
      let oldDisabledMatchListIds = [];

      let $editor = $(this.$el).find('.ql-editor');
      let dom = $editor.html().replace(/&amp;/g, '&');
      const oldReg = /\[MATCH[^\[]*\[\/MATCH\]/g;
      const $oldMatches = dom.match(oldReg);
      ($oldMatches || []).reduce((list, curMatch) => {
        list.push(curMatch.matchitemShowId);
        return list;
      }, oldDisabledMatchListIds);

      let $newMatches = $editor.find('.match');
      ([].slice.call($newMatches) || []).reduce((list, curMatch) => {
        let router = curMatch.getAttribute('data-router');
        let matchitemShowId = router.split('section_id=')[1];
        list.push(matchitemShowId);
        return list;
      }, newDisabledMatchListIds);

      return _.union(newDisabledMatchListIds, oldDisabledMatchListIds);
    },
    doAddMatch() {
      const { editor, addEditorSelectionIndex, editorSelection, selectedMatchList } = this;
      if (selectedMatchList.length === 0) {
        this.$message.warning('请至少选中一场赛事');
        return;
      }
      for (let i = 0; i < selectedMatchList.length; i++) {
        const match = selectedMatchList[i];
        editor.insertEmbed(editorSelection.index, 'match', match);
        addEditorSelectionIndex();
      }

      this.close();
    },
    getMatchDom(match) {
      if (match.awayTeam) {
        return `<div class="match" data-router="pptvsports://page/live/detail/?section_id=${
          match.matchitemShowId
        }"><div class="match-info"><div class="match-time"><p class="time">${formatDate(
          match.startTime,
          'MM月dd日hh:mm'
        )}</p><span class="round">${
          match.matchDes
        }</span></div><div class="match-teams"><div class="home-team"><span class="logo home" style="background-image: url(${
          match.homeLogo
        });"></span><span class="text">${
          match.homeTeam
        }</span></div><div class="guest-team"><span class="logo guest" style="background-image: url(${
          match.awayLogo
        });"></span><span class="text">${match.awayTeam}</span></div></div></div><div class="match-link"></div></div>`;
      } else {
        return `<div class="match" data-router="pptvsports://page/live/detail/?section_id=${
          match.matchitemShowId
        }"><div class="match-info"><div class="match-time"><p class="time">${formatDate(
          match.startTime,
          'MM月dd日hh:mm'
        )}</p><span class="round">${
          match.matchDes
        }</span></div><div class="match-teams"><div class="clash"><span class="logo" style="background-image: url(${
          match.matchLogo
        });"></span><span class="clash-text">${match.matchitemShowName}</span></div></div></div><div class="match-link"></div></div>`;
      }
    },
    clearMatchInputMsg() {
      this.$refs.matchInput && this.$refs.matchInput.setMsg();
      this.searchMatchInput = '';
    },
    fetchMatchInfoById() {
      if (!this.searchMatchInput) {
        this.$message.error('请输入查询条件');
        return;
      }
      this.matchList = [];
      this.$ajax({
        url: DI.infoLibrary.fetchMatchInfoInDailyEdit,
        context: this,
        type: 'get',
        data: {
          matchitemShowId: this.searchMatchInput
        },
        success: res => {
          if (res.retCode == '0') {
            const data = res.data;
            this.searchResultMatchId = this.searchMatchInput;
            if (data) {
              this.matchList.push(data);
            }
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    close() {
      this.resetData();
      this.viewType = null;
    },
    resetData() {
      this.linkPageIndex = 0;
      this.linkContentList = [];
      this.disabledMatchListIds = [];
      this.matchList = [];
      this.allMatchList = [];
      this.selectedMatchList = [];
      this.selectedMatchListIds = [];
      this.clearLinkInputMsg();
      this.clearMatchInputMsg();
    },
    getformatterMatchInContent() {
      // 检查比赛信息
      let $editor = $(this.$el).find('.ql-editor');
      let dom = $editor.html().replace(/&amp;/g, '&');
      const reg = /\[MATCH[^\[]*\[\/MATCH\]/g;
      const matches = dom.match(reg);
      let matchInfo = [];

      if (matches && matches.length) {
        let column = this.ruleForm.dailyColumnList[this.columnIndex];
        let oldDomStr = column.content.dom;
        let oldMatchDomList = oldDomStr.match(/<div class=\"match\".*?(link\"><\/div><\/div>)/g);

        let len = matches.length;
        for (let i = len - 1; i > -1; i--) {
          let temp = matches[i];
          let id = temp.substring(7, temp.indexOf('[/MATCH]'));

          if (oldMatchDomList && oldMatchDomList.length) {
            let matchLen = oldMatchDomList.length;

            for (let m = matchLen - 1; m > -1; m--) {
              let oldMatchItem = oldMatchDomList[m];

              if (oldMatchItem.indexOf(`?section_id=${id}`) > -1) {
                dom = dom.replace('[MATCH]' + id + '[/MATCH]', oldMatchItem);
                break;
              }
            }
          }
        }
      }

      return dom;
    },
    // 外部可调用方法
    getHtmlContents(cb) {
      const self = this;
      let $editor = $(this.$el).find('.ql-editor');
      let $imgs = $editor.find('img:not(.goods-img)');
      let outsideImg = [];
      let count = 0;
      let dailyColumnItemTitle = this.ruleForm.dailyColumnList[this.columnIndex].title;
      let ctt;

      for (let i = 0; i < $imgs.length; i++) {
        let $imgItem = $imgs[i];
        let src = $imgItem.getAttribute('src');
        if (src.indexOf('imgW') == -1 && src.indexOf('imgH') == -1) {
          outsideImg.push({ img: $imgItem, src: src });
        }
      }

      return new Promise(function(resolve, reject) {
        if (outsideImg.length) {
          outsideImg.forEach(function(item) {
            let img = new Image();

            img.onload = function() {
              const symbol = item.src.indexOf('?') > -1 ? '&' : '?';
              item.src += symbol + 'imgW=' + img.width + '&imgH=' + img.height;
              $(item.img).attr('src', item.src);

              if (++count === outsideImg.length) {
                ctt = $editor.html().replace(/&amp;/g, '&');
                ctt == '<p><br></p>' && (ctt = '');
                resolve({ ctt: ctt, dom: self.getformatterMatchInContent(), title: dailyColumnItemTitle });
              }

              reject();
            };

            img.src = item.src;
          });
        } else {
          ctt = $editor.html().replace(/&amp;/g, '&');
          ctt == '<p><br></p>' && (ctt = '');
          resolve({ ctt: ctt, dom: self.getformatterMatchInContent(), title: dailyColumnItemTitle });
        }
      });
    }
  }
};
</script>

<style scoped>
.editor-form__input {
  display: none;
}

.quill-editor {
  margin-top: 6px;
}

.ql-snow.ql-toolbar {
  display: flex;
  align-items: center;
}

.step-first {
  position: relative;
  padding: 20px 30px 100px 30px;
  text-align: center;
  div {
    &.sn-formtip {
      margin-bottom: 26px;
    }
  }
  .err-tip {
    position: absolute;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 20px;
    font-size: 12px;
    color: #f47b77;
  }
  .err-tip-video {
    position: absolute;
    font-size: 12px;
    left: 50%;
    transform: translateX(-50%);
    color: #f68885;
    bottom: 70px;
  }
}

.step-second {
  padding: 30px 40px;
  .text {
    display: flex;
    justify-content: flex-start;
    font-size: 14px;
    color: #727a92;
    line-height: 20px;
    .container {
      padding-top: 4px;
    }
    &.pl {
      padding-left: 1em;
    }
  }
}
.cover-show__area {
  margin-top: 10px;
}
.video-cover__edit {
  color: #09bbfe;
  span {
    height: 16px;
    display: inline-block;
    margin-top: 3px;
    padding-left: 15px;
    cursor: pointer;
    background: url(../../../../../assets/icon-edit-small.png) no-repeat;
  }
}
.modal-body {
  .container-box {
    margin-bottom: 20px;
    .input__inner {
      border-color: #cccccc;
    }
  }
}
.modal-match__info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  .modal-match__btn--back,
  .selected-match__details {
    color: #09bbfe;
    cursor: pointer;
  }
  .modal-match__btn--back {
    padding-left: 18px;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      top: 7px;
      left: 5px;
      width: 8px;
      height: 8px;
      border-bottom: 2px solid #09bbfe;
      border-left: 2px solid #09bbfe;
      transform: rotate(45deg);
      margin-right: 20px;
    }
  }
  .modal-match__btn--del {
    display: inline-block;
    width: 12px;
    height: 12px;
    background: url(../../../../../assets/icon-close-orange.png) no-repeat;
    cursor: pointer;
  }
  .selected-matches__box {
    display: inline-block;
    padding-right: 16px;
    position: relative;
    .selected-matches__info {
      position: relative;
      color: #09bbfe;
      cursor: pointer;
      &:after {
        content: '';
        position: absolute;
        top: 10px;
        right: -33px;
        width: 6px;
        height: 6px;
        border-top: 1px solid #ccc;
        border-right: 1px solid #ccc;
        transform: rotate(-45deg);
        margin-right: 20px;
      }
    }
    &.is-show {
      .selected-matches__info {
        &:after {
          transform: rotate(135deg);
          top: 5px;
        }
      }
      .selected-matches__list {
        display: block;
      }
    }

    .selected-matches__list {
      &:before {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        right: 33px;
        top: -8px;
        border-width: 0 10px 8px;
        border-style: solid;
        border-color: transparent transparent #ccc;
      }
      &:after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        right: 33px;
        top: -7px;
        border-width: 0 10px 10px;
        border-style: solid;
        border-color: transparent transparent #fff;
      }

      position: absolute;
      right: 0px;
      width: 593px;
      top: 26px;
      display: none;
      z-index: 9999;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-shadow: 0 4px 10px 0 rgba(110, 118, 143, 0.35);
      background-color: #fff;
    }
  }
}
</style>
