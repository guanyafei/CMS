<template>
  <div>
    <sn-form-item
      :label='title'
      ref="editorItem"
      prop="content"
      :rules="editorRules">
      <quill-editor
        v-model='ruleForm.content'
        :height="500"
        ref="editor"
        @ready="onEditorReady($event)"
        @change="onEditorChange($event)">
        <div slot="description">
          <p>文本10-1000字；支持插入1段视频；</p>
          <p>支持插入1张图片，支持JPG、PNG、JPEG、GIF格式，GiF支持8M内，其他图片格式1M以内。</p>
        </div>
        <div id="toolbar" slot="toolbar">
          <!-- Add a bold button -->
          <span class="ql-formats">
            <button class="ql-image" title="插入图片"></button>
            <button class="ql-video" title="插入视频"></button>
          </span>
        </div>
      </quill-editor>
      <form class="editor-form__input"
        enctype="multipart/form-data"
        method="post">
        <input name="file"
          type="file"
          ref="fileInput"
          @change="handleFileInputChange"
          accept="image/png, image/gif, image/jpeg, image/x-icon">
      </form>
    </sn-form-item>
    <sn-confirm ref="tip"
      v-show="viewType==='tip'"
      :title="tipTitle"
      @sure="close"
      confirm-button-text="我知道了"
      hide-cancel-button
      txt
      noflag>
      {{tipMsg}}
    </sn-confirm>
    <video-dialog
      ref="videoDialog"
      :viewType="viewType"
      :size="ruleForm.fileSize"
      @sure="doInsertVideo"
      @close="close"
      :disableLocalVideo="true"
      @triggerUpload="handleUploadClick">
    </video-dialog>
  </div>
</template>

<script>
import DI from 'interface';
import editorToolbar from 'utils/editor-toolbar';
import QuillEditor from 'widgets/editor/quillEditor';
import VideoDialog from 'widgets/editor/videoDialog';
const MAX_IMGAES_NUM = 1;
const MAX_VIDEOS_NUM = 1;

export default {
  name: 'ContextEditor',
  componentName: 'ContextEditor',
  mixins: [editorToolbar('dailyContext')],
  components: {
    QuillEditor,
    VideoDialog
  },
  props: ['ruleForm', 'title'],
  data () {
    return {
      config: {
        editorType: 'dailyContext',
        maxImagesNum: MAX_IMGAES_NUM,
        maxVideosNum: MAX_VIDEOS_NUM,
      },
      viewType: null,
      tipMsg: '',
      retMsg: '',
      tipTitle: '',
      editorSelection: {
        index: 0,
        length: 0
      },
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
        if (text.length < 10) {
          callback(new Error(`${this.title}文字个数不能少于10`));
        } else if (text.length > 1000) {
          callback(new Error(`${this.title}文字个数不能大于1000`));
        }

        const imgListNodes = tempDom.querySelectorAll('img:not(.goods-img)');
        if (imgListNodes && imgListNodes.length > config.maxImagesNum) {
          callback(new Error(`日报概况最多只能上传${config.maxImagesNum}张图片`));
        }

        const reg = /\[MEMO[^\[]*\[\/MEMO\]/g;
        const videoResult = value.match(reg);
        if (videoResult && videoResult.length > config.maxVideosNum) {
          callback(new Error(`日报概况最多只能上传${config.maxVideosNum}个视频`));
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
      }]
    }
  },
  mounted () {
    let toolbar = this.editor.getModule('toolbar');
    toolbar.addHandler('image', this.handleImageButtonClick);
    toolbar.addHandler('video', this.handleVideoButtonClick);
  },
  methods: {
    resetData () {
    },
    close () {
      this.resetData();
      this.viewType = null;
    },
    vaildTrigger (errMsg) {
      this.$refs.editorItem.vaildTrigger(false, errMsg)
    },
    // 外部可调用方法
    getHtmlContents (cb) {
      let editor = $(this.editor.root);
      let imgs = editor.find('img:not(.goods-img)');
      let outsideImg = [];
      let count = 0;
      let ctt;

      for (let i = 0; i < imgs.length; i++) {
        let src = imgs[i].getAttribute("src");
        if (src.indexOf('imgW') == -1 && src.indexOf('imgH') == -1) {
          outsideImg.push({ img: imgs[i], src: src });
        }
      };

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
          ctt = editor.html().replace(/&amp;/g, '&');
          (ctt == '<p><br></p>') && (ctt = '')
          resolve(ctt);
        };
      })

    },
  }
}
</script>

<style scoped>
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
.cover-show__area {
  margin-top: 10px;
}
.video-cover__edit {
  color: #09BBFE;
  span {
    height: 16px;
    display: inline-block;
    margin-top: 3px;
    padding-left: 15px;
    cursor: pointer;
    background: url(../../../../../assets/icon-edit-small.png) no-repeat;
  }
}
</style>
