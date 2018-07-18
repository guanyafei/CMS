<template>
  <div>
    <sn-form-item
      :label='title'
      ref="editorItem"
      prop="content"
      :rules="editorRules"
    >
      <quill-editor
        v-model='ruleForm.content'
        :height="500"
        ref="editor"
        @ready="onEditorReady($event)"
        @change="onEditorChange($event)">
        <p slot="description">
          {{`正文字数需大于10；最多可上传${config.maxImagesNum}张图片，支持JPG、PNG、JPEG、GIF，GIF限制大小为8M以下，其它为1M以下；最多可上传${config.maxVideosNum}个视频。`}}
        </p>
        <div slot="toolbar">
          <!-- Add a bold button -->
          <span class="ql-formats">
            <button class="ql-image" title="插入图片"></button>
            <button class="ql-video" title="插入视频"></button>
            <button class="ql-link" title="插入链接"></button>
            <button class="ql-goods" title="插入商品"></button>
            <button class="ql_vote" title="插入投票" @click="handleVoteButtonClick"></button>
          </span>
        </div>
        <div slot="vote" v-if="voteInfo">
          <div class="votebox">
            <div class="title">投票组件：{{voteInfo.title}}</div>
            <div class="operate">
              <a href="javascript:;" @click="editVote">编辑</a>
              <a href="javascript:;" @click="deleteVote">删除</a>
            </div>
          </div>
        </div>
      </quill-editor>
      <form class="editor-form__input" enctype="multipart/form-data"  method="post">
        <input
          name="file"
          type="file"
          ref="fileInput"
          @change="handleFileInputChange"
          accept="image/png, image/gif, image/jpeg, image/x-icon"
        >
      </form>
      <sn-video-uploader
        ref="videoUploader"
        @doInsertLocalVideo="doInsertLocalVideo"
        :size="ruleForm.fileSize"
      >
      </sn-video-uploader>
    </sn-form-item>

    <sn-confirm
      ref="tip"
      v-show="viewType==='tip'"
      :title="tipTitle"
      @sure="close"
      confirm-button-text="我知道了"
      hide-cancel-button
      txt
      noflag>
      {{ tipMsg }}
    </sn-confirm>
    <goods-dialog :viewType="viewType" @sure="insertGoods" @close="close"></goods-dialog>
    <video-dialog
      ref="videoDialog"
      :viewType.sync="viewType"
      :size="ruleForm.fileSize"
      @sure="doInsertVideo"
      @close="close"
      @triggerUpload="handleUploadClick">
    </video-dialog>
    <type-link-dialog :viewType="viewType" @sure="insertTypeLink" @close="close"></type-link-dialog>
    <vote-dialog ref="vote" :viewType="viewType" @sure="doAddVote" @close="close"></vote-dialog>
  </div>
</template>

<script>
import _ from 'lodash';
import DI from 'interface';
import editorToolbar from 'utils/editor-toolbar';
import GoodsDialog from 'widgets/editor/goodsDialog';
import VideoDialog from 'widgets/editor/videoDialog';
import VoteDialog from 'widgets/editor/voteDialog';
import TypeLinkDialog from 'widgets/editor/typeLinkDialog';
import QuillEditor from 'widgets/editor/quillEditor';
const MAX_IMGAES_NUM = 20;
const MAX_VIDEOS_NUM = 10;

export default {
  name: 'ContextEditor',
  componentName: 'ContextEditor',
  mixins: [editorToolbar('context')],
  components: {
    GoodsDialog,
    VideoDialog,
    TypeLinkDialog,
    QuillEditor,
    VoteDialog
  },
  props: ['ruleForm', 'title'],
  data () {
    return {
      config: {
        editorType: 'context',
        maxImagesNum: MAX_IMGAES_NUM,
        maxVideosNum: MAX_VIDEOS_NUM,
      },
      alignment: '',
      viewType: null,
      tipMsg: '',
      tipTitle: '',
      editorSelection: {
        index: 0,
        length: 0
      },
      voteInfo: null
    }
  },
  computed: {
    editor () {
      return this.$refs.editor.quill
    },
    editorRules () {
      const config = this.config;
      let editorValidation = (rule, value, callback) => {
        let tempDom = document.createElement('div');
        tempDom.innerHTML = value;
        let text = this.editor.getText().trim()
          .replace(/\n/g, '')
          .replace(/\[MEMO[^\[]*\[\/MEMO\]/g, '');
        let textLen = text.length;
        if (textLen < 10) {
          callback(new Error(`${this.title}文字个数不能少于10`));
        } else if (textLen > 10000) {
          callback(new Error(`${this.title}文字个数不能大于10000`));
        }

        const imgListNodes = tempDom.querySelectorAll('img:not(.goods-img)');
        if (imgListNodes && imgListNodes.length > config.maxImagesNum) {
          callback(new Error(`资讯正文最多只能上传${config.maxImagesNum}张图片`));
        }

        const reg = /\[MEMO[^\[]*\[\/MEMO\]/g;
        const videoResult = value.match(reg);
        if (videoResult && videoResult.length > config.maxVideosNum) {
          callback(new Error(`资讯正文最多只能上传${config.maxVideosNum}个视频`));
        }

        callback();
      };
      return [{
        required: true,
        type: 'string',
        message: `请输入${this.title}`,
        trigger: 'change'
      }, {
        validator: editorValidation,
        trigger: 'change'
      }];
    }
  },
  mounted () {
    let toolbar = this.editor.getModule('toolbar');
    toolbar.addHandler('link', this.handleTypeLinkButtonClick);
    toolbar.addHandler('goods', this.handleGoodsButtonclick);
    toolbar.addHandler('image', this.handleImageButtonClick);
    toolbar.addHandler('video', this.handleVideoButtonClick);
  },
  methods: {
    editVote() {
      this.viewType = 'vote';
      this.$refs.vote.ruleForm = _.cloneDeep(this.voteInfo);
    },
    deleteVote() {
      this.voteInfo = null;
    },
    handleVoteButtonClick() {
      if(this.voteInfo) return this.$message.warning('您已经插入一个投票，无法插入投票～');
      this.$refs.vote.reset();
      this.viewType = 'vote';
    },
    handleGoodsButtonclick () {
      this.getEditorSelectionIndex();
      this.viewType = 'goods';
    },
    insertGoods (option) {
      const { editor, addEditorSelectionIndex, editorSelection } = this;
      editor.insertEmbed(editorSelection.index, 'goods', {
        url: option.url,
        src: option.src,
        title: option.title,
        price: option.price
      });
      addEditorSelectionIndex();
    },
    doAddVote(data) {
      this.voteInfo = data;
    },
    close () {
      this.viewType = null;
    },
    // 供父模块调用
    vaildTrigger (errMsg) {
      this.$refs.editorItem.vaildTrigger(false, errMsg)
    },
    // 外部可调用方法
    getHtmlContents (cb) {
      let count = 0;
      let outsideImg = [];
      let editor = $(this.editor.root);

      let imgs = editor.find('img:not(.goods-img)');
      let ctt;

      for (let i = 0; i < imgs.length; i++) {
        let src = imgs[i].getAttribute("src");
        if (src.indexOf('imgW') == -1 && src.indexOf('imgH') == -1) {
          outsideImg.push({ img: imgs[i], src: src });
        }
      };

      ctt = editor.html().replace(/&amp;/g, '&');

      return new Promise(function (resolve, reject) {
        if (outsideImg.length) {
          outsideImg.forEach(function (item) {
            let img = new Image();
            img.onload = function () {
              const symbol = item.src.indexOf('?') > -1 ? '&' : '?';
              item.src += symbol + 'imgW=' + img.width + '&imgH=' + img.height;
              $(item.img).attr("src", item.src);
              if (++count === outsideImg.length) {
                ctt = editor.html().replace(/&amp;/g, '&');
                (ctt == '<p><br></p>') && (ctt = '');
                resolve(ctt)
              }

              reject();
            };
            img.onerror = function (e) {
              console.log('img failed when submit', e);
            };
            img.src = item.src;
          })
        } else {
          (ctt == '<p><br></p>') && (ctt = '')
          resolve(ctt);
        };
      })
    },
  }
}
</script>

<style scoped>
.votebox {
  margin-top: 16px;
  height: 63px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  .title {
    margin-left: 24px;
    color: #666666;
  }
  .operate {
    margin-right: 36px;
  }
}

a {
  color: #09bbfe;
  & + a {
    margin-left: 10px;
  }
  &:hover {
    text-decoration: underline;
  }
}

.editor-form__input {
  display: none;
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
</style>
