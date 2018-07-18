<template>
  <div class="img-cropper">
    <slot>
      <slot name="tip" v-if="hastip">
        <p class="cropper-tip">{{ caption }}</p>
      </slot>
      <template v-if="!value">
        <div class="no-img" v-if="!disabled">
          <div class="sn-upload sn-upload--text" :style="getUploadStyle" @click="handleNewUploadBtnClick">
            <span class="btn-text" v-if="+height>115">点击上传图片</span>
            <i class="sn-icon-plus avatar-uploader-icon"></i>
          </div>
        </div>
        <div class="no-img" v-else>
          <div class="sn-upload sn-upload--text" :style="getUploadStyle">
            <i class="sn-icon-plus avatar-uploader-icon nobg"></i>
          </div>
        </div>
      </template>
      <div class="img-existed" :style="getUploadStyle" @mouseenter="mouseenter" @mouseleave="mouseleave" v-else>
        <img :src="value" ref="originImg" :style="getUploadStyle">
        <div :class="getHoverClass" :style="getEditStyle"></div>
        <button class="btn edit-btn" @click="handleEditUploadBtnClick" :style="getEditStyle">
          <em></em>
          <slot name="btn-title">
            <span>编辑图片</span>
          </slot>
        </button>
      </div>
    </slot>
    <sn-confirm v-show="showModal === 'cropperModal'" ref="confirm" :title="`上传${label}`" @close="close" noflag>
      <div class="modal__msg">
        <sn-formtip warning v-if="imgPixelSizeErrMsg">{{imgPixelSizeErrMsg}}</sn-formtip>
      </div>
      <div class="container">
        <div>
          <div class="img-load" :style="getCropperStyle">
            <img ref="image" :src="imgVal">
          </div>
          <div class="btn-group">
            <div class="btn-group__img">
              <a class="zoom-plus" href="#" @click.prevent="zoomIn($event)"></a>
              <a class="zoom-minus" href="#" @click.prevent="zoomOut($event)"></a>
              <a class="img-rotate-right" href="#" @click.prevent="rotate"></a>
              <a class="img-rotate-left" href="#" @click.prevent="rotate(false)"></a>
              <a class="img-reset" href="#" @click.prevent="reset"></a>
            </div>
            <a @click.prevent="addClickHandler">重新上传</a>
          </div>
        </div>
        <div v-if="supportPreview" class="preview-area">
          <div class="preview-item">
            <div class="cover-preview preview-16"></div>
            <p class="preview-text">16:9预览</p>
          </div>
          <div class="preview-item">
            <div class="cover-preview preview-4"></div>
            <p class="preview-text">4:3预览</p>
          </div>
        </div>
      </div>
      <div class="sn-popup-btns" slot="btn-group">
        <sn-button size="mini" type="primary" @click="doCropper" :disabled="!ableCropper">确认</sn-button>
        <sn-button size="mini" @click="close">取消</sn-button>
      </div>
    </sn-confirm>
    <sn-confirm :sureBtnIsShow="false" @close="close" title="图片库" v-if="!nolibrary && showModal==='libModal'" noflag>
      <div class="lib-modal__body">
        <div class="no-img">
          <div class="sn-upload sn-upload--text">
            <span class="btn-text">点击上传图片</span>
            <i class="sn-icon-plus avatar-uploader-icon" @click="addClickHandler"></i>
          </div>
        </div>
        <div class="lib-img__list">
          <div class="img-item" v-for="(imgUrl, index) in libImglist" :key="index" @click="chooseImg(index)">
            <img :src="imgUrl" alt="图片错误" />
          </div>
        </div>
      </div>
    </sn-confirm>
    <form enctype="multipart/form-data" ref="formfile">
      <input type="file" name="file" ref="fileInput" class="sn-upload__input" @change="fileInputChangeHandler($event)">
    </form>
  </div>
</template>
<script>
require('src/css/cropper.min.css');
import Cropper from 'cropperjs';
import DI from 'interface';
import emitter from 'mixins/emitter';
import debounce from 'utils/debounce';
import { getImgPixelSize, getImgStyle } from 'src/utils/image-operate';
const CROPPER_WIDTH = '360';
const CROPPER_HEIGHT = '320';

export default {
  name: 'img-cropper',
  mixins: [emitter],
  props: {
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: '图片'
    },
    width: {
      type: String,
      default: '360'
    },
    height: {
      type: String,
      default: '235'
    },
    libImglist: {
      type: Array,
      default: function() {
        return [];
      }
    },
    size: {
      type: String,
      default: '1M'
    },
    gifSize: {
      type: String,
      default: '8M'
    },
    noGif: {
      type: Boolean,
      default: false
    },
    aspectRatio: {
      type: Number,
      default: 16 / 9
    },
    hasEdit: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    pixelScope: {
      type: Object,
      default() {
        return {
          max: null,
          min: null
        };
      }
    },
    isScoped: {
      type: Boolean,
      default: false
    },
    hastip: {
      type: Boolean,
      default: true
    },
    noCropper: {
      type: Boolean,
      default: false
    },
    nolibrary: {
      type: Boolean,
      default: true
    },
    supportPreview: {
      type: Boolean,
      default: false
    },
    ascyQueryImgLiblistFunc: {
      type: Function
    },
    doCropperFunc: {
      type: Function
    }
  },
  data() {
    return {
      showModal: null,
      cropper: null,
      cropperable: false,
      fileName: '',
      contentType: '',
      isHover: false,
      imgPixelSizeErrMsg: '',
      ableCropper: true,
      cropped:{}
    };
  },
  computed: {
    getUploadStyle() {
      return `width:${this.width}px;height:${this.height}px;`;
    },
    getCropperStyle() {
      return `width:${CROPPER_WIDTH}px;height:${CROPPER_HEIGHT}px`;
    },
    getEditStyle() {
      if (!this.hasEdit) {
        return {
          display: 'none'
        };
      }
      return null;
    },
    getHoverClass() {
      if (this.isHover) {
        return 'mask is-hovered';
      } else {
        return 'mask';
      }
    },
    caption() {
      if (this.noGif) {
        return `图片格式支持JPG、JPEG、PNG，限制大小为${this.size.toUpperCase()}以下.`;
      }
      return `图片格式支持JPG、JPEG、PNG、GIF，GIF限制大小为${this.gifSize.toUpperCase()}以下，其它格式为${this.size.toUpperCase()}以下.`;
    },
    testImgReg() {
      return this.noGif ? /^image\/(jpe?g|png)+/ : /^image\/(jpe?g|gif|png)+/;
    },
    tesGifReg() {
      return /^image\/gif+/;
    },
    inValidFormatMsg() {
      return this.noGif ? '上传失败，只支持png、jpg、jpeg格式图片.' : '上传失败，只支持png、jpg、jpeg、gif格式图片.';
    }
  },
  methods: {
    close() {
      this.$refs.fileInput.value = '';
      this.imgPixelSizeErrMsg = '';
      this.ableCropper = true;
      this.showModal = null;
      this.fileName = null;
      this.contentType = null;
      this.imgFileSize = null;
      this.file = null;
      this.$nextTick(() => {
        this.cropper && this.cropper.destroy && this.cropper.destroy();
        this.cropper = null;
      });
    },
    chooseImg(index) {
      this.imgVal = this.libImglist[index];
      this.isCrossOriginURL(this.imgVal)
        .then(() => {
          this.imgModalFlag = false;
          this.setEditImgCropperType(this.imgVal);
          if (this.cropper) {
            this.cropper.reset().replace(this.imgVal);
          } else {
            this.showCropperModal();
          }
        })
        .catch(err => {
          if (this.isScoped && !this.isGifUrl(this.imgVal)) {
            let imgStyle = getImgStyle(this.imgVal);
            let outScopeErrMsg;
            const { max, min } = this.pixelScope;
            if (imgStyle.width) {
              if (max && max < imgStyle.width) {
                outScopeErrMsg = `当前图片像素宽度${imgStyle.width},超过${max}px`;
              }
              if (min && min > imgStyle.width) {
                outScopeErrMsg = `当前图片像素宽度${imgStyle.width},小于${min}px`;
              }
            }
            if (outScopeErrMsg) {
              this.$message.error(outScopeErrMsg);
              return;
            }
          }
          this.$emit('input', this.imgVal);
          this.showModal = null;
        });
    },
    setEditImgCropperType(url) {
      let results = url.match(/.*.(jpe?g|png)(\?.*)?$/);

      if (results) {
        this.contentType = `image/${results[1]}`;
        this.fileName = `${Date.now()}.${results[1]}`;
      }
    },
    isGifUrl(url) {
      return /.*.gif(\?.*)?$/.test(url);
    },
    isCrossOriginURL(url) {
      return new Promise((resolve, reject) => {
        if (this.isGifUrl(url)) {
          reject('图片无法裁剪.');
        } else {
          let img = new Image();
          img.onload = function() {
            resolve();
          };
          img.onerror = function() {
            reject('图片无法裁剪.');
          };
          img.crossOrigin = 'anonymous';
          img.src = this.addTimestamp(url); // 外域url
        }
      });
    },
    addTimestamp(url) {
      var timestamp = 'timestamp=' + new Date().getTime();

      return url + (url.indexOf('?') === -1 ? '?' : '&') + timestamp;
    },
    //获取裁剪后的值
    getCropped(cropped){
      return this.cropped = cropped == undefined ? this.cropped : cropped;
    },
    doCropper() {
      if (this.isScoped && !this.ableCropper) {
        return;
      }
      !this.contentType && (this.contentType = 'image/jpeg');
      let cropped = this.cropper.getCroppedCanvas();
      this.getCropped(cropped);
      let imgDataUrl = cropped.toDataURL(this.contentType || 'image/jpeg');
      if (this.doCropperFunc) {
        if (this.file) {
          this.doCropperFunc({
            base64File: imgDataUrl.substr(13 + this.contentType.length),
            fileName: this.fileName.replace(/\s/g, ''),
            contentType: this.contentType,
            size: this.imgFileSize,
            file: this.file
          }).then(url => {
            this.$emit('input', url);
            this.dispatch('FormItem', 'form.change', [url]);
            this.close();
          });
        } else {
          this.uploadBase64Action(imgDataUrl, () => {
            this.doCropperFunc({
              coverPic: this.imgVal
            });
          });
        }
      } else {
        this.uploadBase64Action(imgDataUrl);
      }
    },
    uploadBase64Action(imgDataUrl, successCallback) {
      this.$ajax({
        url: DI.common.uploadFileBase64,
        context: this,
        loadingText: '正在上传图片，请稍候！',
        data: JSON.stringify({
          base64File: imgDataUrl.substr(13 + this.contentType.length),
          fileName: this.fileName.replace(/\s/g, ''),
          contentType: this.contentType
        }),
        success: function(res) {
          if (res.retCode == '0') {
            successCallback && successCallback();
            this.$emit('input', res.data);
            this.dispatch('FormItem', 'form.change', [res.data]);
          } else {
            this.$message.error(res.retMsg);
          }
          this.close();
        },
        error: function() {
          this.$refs.fileInput.value = '';
          this.$message.error('网络异常，请联系运维人员！');
        }
      });
    },
    calSize(str) {
      let num = parseInt(str.replace(/[^0-9]/gi, ''), 10);
      let lowStr = str.toLowerCase();
      if (lowStr.indexOf('m') !== -1) {
        return num * 1024 * 1024;
      }

      return num * 1024;
    },
    handleNewUploadBtnClick() {
      if (this.nolibrary) {
        this.$refs.fileInput.click();
      } else {
        if (this.ascyQueryImgLiblistFunc) {
          this.ascyQueryImgLiblistFunc().then(() => {
            this.showModal = 'libModal';
          });
        } else {
          this.showModal = 'libModal';
        }
      }
    },
    handleEditUploadBtnClick() {
      this.handleNewUploadBtnClick();
    },
    addClickHandler() {
      this.$refs.fileInput.click();
    },
    editClickHandler() {
      this.$refs.fileInput.click();
    },
    fileInputChangeHandler(event) {
      const files = event.target.files;
      let FR = new FileReader();
      let imgFilePromiseChain = new Promise((resolve, reject) => {
        if (files && files.length) {
          resolve(files[0]);
        }
      })
        .then(file => {
          console.log(this.testImgReg.test(file.type.toLowerCase()));
          if (this.testImgReg.test(file.type.toLowerCase())) {
            return file;
          } else {
            return Promise.reject(this.inValidFormatMsg);
          }
        })
        .then(file => {
          const isGif = this.tesGifReg.test(file.type.toLowerCase());
          let imgFileSize = file.size;
          let curSizeStr = isGif ? this.gifSize : this.size;
          let maxImgSize = this.calSize(curSizeStr);
          let exceedSizeMsg = `图片大小超过${curSizeStr.toUpperCase()}`;
          if (maxImgSize > imgFileSize) {
            file.isGif = isGif;
            this.fileName = file.name;
            this.contentType = file.type;
            this.imgFileSize = file.size;
            this.file = file;
            return file;
          } else {
            return Promise.reject(`上传失败，${exceedSizeMsg}！`);
          }
        })
        .then(file => {
          if (file.isGif || this.noCropper) {
            this.showModal = null;
            if (this.cropper) {
              this.cropper.destroy && this.cropper.destroy();
              this.cropper = null;
            }
            this.uploadGif(file);
          } else {
            let { min } = this.pixelScope;
            getImgPixelSize(file, false).then(value => {
              if (this.isScoped && min && value.width < min) {
                this.$refs.fileInput.value = '';
                this.$message.warning(`图片分辨率宽度小于${min},请重新选择！`);
              } else {
                FR.addEventListener(
                  'load',
                  function(e) {
                    this.imgVal = FR.result;
                    if (this.cropper) {
                      !this.showModal && (this.showModal = 'cropperModal');
                      this.cropper.reset().replace(this.imgVal);
                    } else {
                      this.showCropperModal();
                    }
                  }.bind(this)
                );

                FR.readAsDataURL(file);
              }
            });
          }
        })
        .catch(errMsg => {
          this.$refs.fileInput.value = '';
          this.$message.error(errMsg);
        });
    },
    uploadGif() {
      this.$ajax({
        url: DI.common.uploadFile,
        context: this,
        loadingText: '正在上传图片，请稍候！',
        processData: false,
        contentType: false,
        data: new FormData(this.$refs.formfile),
        success: function(res) {
          if (res.retCode == '0') {
            this.$refs.fileInput.value = '';
            this.$emit('input', res.data);
            this.dispatch('FormItem', 'form.change', [res.data]);
          } else {
            this.$refs.fileInput.value = '';
            this.$message.error(res.retMsg);
          }
        },
        error: function() {
          this.$refs.fileInput.value = '';
          this.$message.error('网络异常，请联系运维人员！');
        }
      });
    },
    showCropperModal() {
      const _this = this;

      this.showModal = 'cropperModal';
      let cropFunc = null;
      if (this.isScoped) {
        cropFunc = debounce(function(val) {
          let imgSrc = _this.cropper.getCroppedCanvas().toDataURL(_this.contentType);
          _this.ableCropper = false;
          _this.imgPixelSizeErrMsg = '';
          _this.getCropperBoundSizePromise = new Promise((resolve, reject) => {
            const { max, min } = _this.pixelScope;
            let img = new Image();
            img.src = imgSrc;
            img.onload = function() {
              let { width } = this;
              if (max && width > max) {
                reject(`当前截图像素宽度为${width},大于${max}`);
              }
              if (min && width < min) {
                reject(`当前截图像素宽度为${width},小于${min}`);
              } else {
                resolve(width);
              }
            };
          });
          _this.getCropperBoundSizePromise
            .then(value => {
              _this.ableCropper = true;
            })
            .catch(errMsg => {
              _this.ableCropper = false;
              _this.imgPixelSizeErrMsg = errMsg;
            });
        }, 500);
      }
      this.$nextTick(() => {
        this.cropper = new Cropper(this.$refs.image, {
          aspectRatio: this.aspectRatio,
          viewMode: 1,
          dragMode: 'move',
          movable: true,
          zoomable: true,
          rotatable: true,
          scalable: true,
          preview: '.cover-preview',
          ready() {
            _this.cropperable = true;
            $('.preview-16 img').css({ 'min-width': '235px' });
          },
          crop: cropFunc
        });
      });
    },
    mouseenter() {
      this.isHover = true;
    },
    mouseleave() {
      this.isHover = false;
    },
    zoomIn(event) {
      if (!this.cropperable) return;
      this.cropper.zoom(0.1);
    },
    zoomOut(event) {
      if (!this.cropperable) return;
      this.cropper.zoom(-0.1);
    },
    rotate(right = true) {
      if (!this.cropperable) return;
      this.cropper.rotate(right ? 90 : -90);
    },
    reset() {
      if (!this.cropperable) return;
      this.cropper.reset();
    }
  }
};
</script>
<style scoped>
.img-cropper {
  margin-top: -5px;
}
.modal__msg {
  height: 34px;
  padding: 10px 0;
}
.container {
  display: flex;
  padding: 0 20px;
  .preview-area {
    width: 210px;
    padding-left: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .preview-item:nth-child(1) {
      margin-bottom: 10px;
    }
    .preview-16 {
      width: 188px !important;
      height: 106px !important;
      overflow: hidden;
      position: relative;
      img {
        width: 100%;
      }
    }
    .preview-4 {
      width: 188px !important;
      height: 141px !important;
      overflow: hidden;
      position: relative;
      img {
        width: 100%;
      }
    }
    .preview-text {
      margin-top: 10px;
      text-align: right;
      font-family: MicrosoftYaHei;
      font-size: 12px;
      color: #a8adbc;
    }
  }
}

.sn-upload {
  border: 1px dashed #a1a1a1;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.btn {
  display: flex;
  align-items: center;
  margin: 0 auto;
  position: relative;
  top: -60px;
  em {
    width: 16px;
    height: 16px;
    margin-right: 5px;
    background-image: url(../../assets/refresh.png);
    background-repeat: no-repeat;
    background-size: 16px 16px;
  }
}

.btn-group {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  color: #999999;
  a {
    display: inline-block;
    line-height: 22px;
  }
  .btn-group__img {
    a {
      width: 17px;
      height: 17px;
      margin-right: 3px;
      background-size: 17px 17px;
      background-repeat: no-repeat;
      &.zoom-plus {
        background-image: url(../../assets/icon-plus-circle.png);
      }
      &.zoom-minus {
        background-image: url(../../assets/icon-minus-circle.png);
      }
      &.img-rotate-right {
        width: 22px;
        height: 22px;
        background-size: 22px 22px;
        background-position-y: 3px;
        background-image: url(../../assets/icon-rotate-right.png);
      }
      &.img-rotate-left {
        width: 22px;
        height: 22px;
        background-size: 22px 22px;
        background-position-y: 3px;
        background-image: url(../../assets/icon-rotate-left.png);
      }
      &.img-reset {
        background-size: 20px 20px;
        background-position-y: -2px;
        background-image: url(../../assets/icon-autorenew.png);
      }
    }
  }
}
.edit-btn {
  color: #ffffff;
  border: 1px solid #ffffff;
  padding: 5px 7px;
  border-radius: 16px;
}

.cropper-tip {
  padding: 12px 0;
  text-align: left;
  font-size: 12px;
  color: #c1c1c1;
}

.no-img {
  margin-top: -4px;
}

.btn-text {
  position: absolute;
  bottom: 50%;
  transform: translateY(53px);
  width: 100%;
  text-align: center;
  font-size: 14px;
}

.img-existed {
  position: relative;
  text-align: center;
  box-sizing: content-box;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.mask {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  &.is-hovered {
    background-color: rgba(0, 0, 0, 0.4);
  }
}

.img-load {
  img {
    width: 100%;
    /* This rule is very important, please do not ignore this! */
  }
}

.sn-upload__input {
  display: none;
}

.sn-icon-plus {
  background-image: url(../../assets/icon-plus.png);
  display: inline-block;
  width: 100%;
  height: 100%;
  background-position-x: 50%;
  background-position-y: 50%;
  background-size: 80px 80px;
  background-repeat: no-repeat;
}
.nobg {
  cursor: auto;
}
.lib-modal__body {
  width: 700px;
  padding: 20px 80px 0 80px;
  .lib-img__list {
    display: flex;
    flex-wrap: wrap;
  }
  .sn-upload {
    width: 160px;
    height: 120px;
    margin: 10px;
  }
  .img-item {
    width: 160px;
    height: 120px;
    position: relative;
    display: inline-block;
    border: 1px solid #e8e8e8;
    margin: 5px 10px;
    cursor: pointer;
    img {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      max-width: 100%;
      max-height: 100%;
      margin: auto;
    }
  }
}
</style>
