import DI from 'interface';
import { getImgPixelSize } from 'src/utils/image-operate';

const imgHandlerFunc = {
  handleImageButtonClick() {
    this.getEditorSelectionIndex();
    let editor = $(this.editor.root);
    let imgs = editor.find('img:not(.goods-img)');
    if (imgs.length >= this.config.maxImagesNum) {
      this.tipTitle = '插入图片';
      this.tipMsg = `您已经上传了${this.config.maxImagesNum}张图片，无法继续插入图片～`;
      this.viewType = 'tip';
    } else {
      this.$refs.fileInput.click();
    }
  },
  handleFileInputChange(event) {
    this.getEditorSelectionIndex();
    const imgFile = event.target.files[0];
    let maxFilesSize = 1024 * 1024 * 1;
    let maxText = '1M';
    let $fileInput = this.$refs.fileInput;
    let isGif = false;

    if (!imgFile) return;

    if (!/^image\/(jpeg|gif|png|jpg)+/.test(imgFile.type)) {
      $fileInput.value = '';
      this.$message.error('图片格式不正确');
      return;
    }

    if (/^image\/gif+/.test(imgFile.type)) {
      isGif = true;
      maxFilesSize = 1024 * 1024 * 8;
      maxText = '8M';
    }
    if (imgFile.size < maxFilesSize) {
      getImgPixelSize(imgFile, false)
        .then(options => {
          return getfileUploadPromise(options);
        })
        .then(value => {
          $fileInput.value = '';
          this.insertImage(value);
        })
        .catch(errMsg => {
          $fileInput.value = '';
          this.$message.error(errMsg);
        });

      let getfileUploadPromise = options => {
        return new Promise((resolve, reject) => {
          let formData = new FormData();
          formData.append('file', imgFile);
          this.$ajax({
            url: DI.common.uploadFile,
            data: formData,
            context: this,
            loadingText: '正在上传图片，请稍候！',
            processData: false,
            contentType: false,
            success(data) {
              if (data.retCode == '0') {
                let imgSrc = data.data;
                const symbol = imgSrc.indexOf('?') > -1 ? '&' : '?';
                imgSrc += symbol + 'imgW=' + options.width + '&imgH=' + options.height;
                resolve(imgSrc);
              } else {
                reject(data.retMsg);
              }
            },
            error() {
              reject('上传图片失败!');
            }
          });
        });
      };
    } else {
      $fileInput.value = '';
      this.$message.error(`上传图片最大为：${maxText}`);
    }
  },
  insertImage(url) {
    const { editor, addEditorSelectionIndex } = this;
    editor.deleteText(this.editorSelection.index, this.editorSelection.length);
    this.getEditorSelectionIndex();
    editor.insertEmbed(this.editorSelection.index, 'img-with-caption', url);
    addEditorSelectionIndex(2);
  }
};
const videoHandlerFunc = type => {
  switch (type) {
    case 'dailyContext':
    case 'daily':
    case 'context':
      return {
        handleVideoButtonClick() {
          this.getEditorSelectionIndex();
          this.viewType = 'video';
        },
        doInsertVideo(option) {
          if (this.isExceedVideoMaxNum()) {
            return;
          }
          this.insertContext('[MEMO url="' + option.sloturl + '"]' + option.vid + '[/MEMO]');
          this.viewType = null;
        },
        doInsertLocalVideo(option) {
          if (this.isExceedVideoMaxNum()) {
            return;
          }
          this.$bus.$emit('triggerDelInsertLocalVideo');
          this.getEditorSelectionIndex();
          this.insertContext('[MEMO url="' + option.coverImage + '"]' + option.webid + '[/MEMO]');
        },
        handleUploadClick() {
          this.$bus.$emit('triggerLocalVideoUpload');
        },
        isExceedVideoMaxNum() {
          const content = this.editor.root.innerHTML;
          const { maxVideosNum } = this.config;
          const reg = /\[MEMO[^\[]*\[\/MEMO\]/g;
          const temp = content.match(reg);
          if (temp && temp.length >= maxVideosNum) {
            this.tipTitle = '插入视频';
            this.tipMsg = `您已经上传了${maxVideosNum}段视频，无法插入视频～`;
            this.viewType = 'tip';
            return true;
          }
          return false;
        }
      };
      break;

    default:
      return {};
      break;
  }
};

const typeLinkHandlerFunc = type => {
  switch (type) {
    case 'context':
    case 'daily':
      return {
        handleTypeLinkButtonClick() {
          this.getEditorSelectionIndex();
          this.viewType = 'typeLink';
        },
        insertTypeLink(str, url) {
          const { editor, editorSelection, addEditorSelectionIndex } = this;
          editor.deleteText(editorSelection.index, editorSelection.length);
          editor.insertText(editorSelection.index, str, {
            link: { 'data-url': url }
          });
          addEditorSelectionIndex(str.length);
        }
      };
      break;

    case 'dailyContext':
      return {};
      break;

    default:
      return {};
      break;
  }
};

export default editorType => {
  return {
    methods: {
      onEditorReady(editor) {},
      onEditorChange(option) {
        this.$emit('input', option.html);
        let captionNodes = this.editor.root.querySelectorAll('.pgc-img-caption');
        [].slice.call(captionNodes, 0).map(el => {
          let elClassName = el.className;
          if (el.innerText.trim()) {
            el.className = 'pgc-img-caption has-caption';
          } else {
            el.className = 'pgc-img-caption';
          }
        });
        let imgContainerNodes = this.editor.root.querySelectorAll('.layoutRow');
        [].slice.call(imgContainerNodes, 0).map(imgContainer => {
          let itemSrc = imgContainer.querySelector('img').getAttribute('src');
          if (itemSrc === 'true') {
            imgContainer.parentNode.removeChild(imgContainer);
            this.$message.error('不支持图片复制或回退!');
          }
        });
      },
      getEditorSelectionIndex() {
        let editorSelection = this.editor.getSelection();
        if (editorSelection) {
          this.editorSelection = editorSelection;
        }
        this.editor.focus();
      },
      addEditorSelectionIndex(num = 1) {
        this.editorSelection.index += num;
        this.editor.setSelection(this.editorSelection.index);
      },
      insertContext(str) {
        const { editor, editorSelection, addEditorSelectionIndex } = this;
        editor.deleteText(editorSelection.index, editorSelection.length);
        editor.insertText(editorSelection.index, str);
        editor.removeFormat(editorSelection.index, str.length);
        addEditorSelectionIndex(str.length);
      },
      ...imgHandlerFunc,
      ...videoHandlerFunc(editorType),
      ...typeLinkHandlerFunc(editorType)
    }
  };
};
