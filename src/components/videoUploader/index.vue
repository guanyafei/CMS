<template>
  <div class="uploadList-wrapper">
    <div class="video-local__upload" ref="upload"></div>
    <ul class="local-video__list">
      <li class="local-video__item" v-for="(item, index) in uploadList" :key="item.idx">
        <div class="video-item--finished" v-if="item.status==='finished'">
          <sn-cropper
            v-model="item.coverImage"
            width="192"
            height="108"
            ref="cropper"
            label="封面"
            :aspectRatio="16 / 9"
          >
            <div slot="tip"></div>
          </sn-cropper>
          <div class="video-item__meta">
            <div class="video-item__title">{{ item.title }}</div>
            <div class="video-item__add">
              <sn-button type="outline" :disabled="!item.coverImage" @click="handleAddBtnClick(item, item.idx, index)">添加到正文</sn-button>
            </div>
            <div class="video-item__footer">
              <span class="video-item__delete--txt" @click="handleDelBtnClick(item.idx, index)">删除</span>
              <div v-if="!item.coverImage" class="video-img__caption--null">请先上传视频封面再添加到正文</div>
            </div>
          </div>
        </div>
        <div class="video-item--unfinish" v-else>
          <div class="is-line">
            <div class="video-item__title">{{ item.title }}</div>
            <span class="video-item__reUpload" v-if="item.status === 'failed'" @click="reStart(item.idx, index)">重新上传</span>
          </div>
          <div class="is-line">
            <div class="progress">
              <div :class="['indicator', {'is-failed':item.status === 'failed'}]" :style="{width: item.indicatorWidth}"></div>
            </div>
            <span class="video-item__delete" @click="handleCancelBtnClick(item.idx, index)"></span>
          </div>
          <div class="is-line">
            <span class="video-ready__txt" v-if="item.status === 'ready'">准备中。。。</span>
            <template v-else-if="item.status === 'loading'">
              <div class="progressRate">
                <span class="field__label">已上传：</span>
                <span class="loaded">{{ item.loaded }}</span>
                /
                <span class="total">{{ item.size}}</span>
              </div>
              <div class="speed">
                <span class="field__label">上传速度：</span>
                <span class="speed__num">{{ item.speed }}</span>
              </div>
            </template>
            <span class="video-error__txt" v-else>视频上传失败</span>
          </div>
        </div>
      </li>
    </ul>
    <sn-confirm
      v-if="confirmOption.viewType"
      :title="confirmOption.title"
      @sure="confirmOption.sure"
      @close="confirmOption.close"
      :type="confirmOption.type"
      noflag>
      <template slot="confirm-txt">
       {{confirmOption.txt}}
      </template>
    </sn-confirm>
  </div>
</template>

<script>
const TIME_OUT = 60 * 1000;

export default {
  name: 'video-uploader',
  props: {
    size: {
      type: Number,
      default: 200
    }
  },
  data() {
    return {
      viewType: null,
      uploadList: [],
      confirmOption: {
        title: '',
        viewType: null,
        txt: '',
        type: '',
        sure: () => {},
        close: () => {}
      }
    };
  },
  mounted() {
    let _this = this;
    this.$bus.$on('triggerLocalVideoUpload', this.triggerUpload.bind(this));
    this.$bus.$on('triggerDelInsertLocalVideo', this.doDelUploadItem.bind(this));
    this.uploader = new PDIKit.Upload({
      uploadDom: this.$refs.upload,
      isNotPPtype: false,
      maxFileLength: 100,
      multiple: false,
      singleFileMaxLimit: _this.size * 1024 * 1024,
      tokenURL: '/snsis-admin-web/adminMgt/ppYun/uploadVideo.do',
      checkTypeMessage: function(f, type) {
        _this.$message.error('视频类型不符合要求！');
      },
      checkSizeMessage: function(f, size) {
        _this.$message.error(`视频大小超过${_this.size}M，请重新上传！`);
      },
      validate: function(f) {
        return true;
      },
      onAfterChangeFiles: function(f) {
        _this.$bus.$emit('localVideoFilesChange');
        let item = {
          title: f.channelname,
          status: 'ready',
          loaded: '0.00',
          size: f.changeSize,
          idx: f.index,
          indicatorWidth: 0,
          speed: '0.00KB/S',
          coverImage: f.coverImage
        };
        _this.uploadList.push(item);

        f.uploadVideo = item;
        this.startUpload(f.index);
      },
      onProgress: function(finished, fileSize, datarange, timespan) {
        console.log(
          'finished--->' +
            finished +
            ', fileSize--->' +
            fileSize +
            ', datarange--->' +
            datarange +
            ', timespan--->' +
            timespan +
            ', speed--->' +
            this.changeBytes(datarange / timespan * 1000) +
            '/S'
        );
        this.uploadVideo.status = 'loading';
        this.uploadVideo.coverImage = this.coverImage;
        this.uploadVideo.loaded = this.changeBytes(finished);
        this.uploadVideo.indicatorWidth = Math.round(finished / fileSize * 100) + '%';
        this.uploadVideo.speed = this.changeBytes(datarange / timespan * 1000) + '/S';
      },
      afterEachFinished: function(f, webid) {
        this.$message.success('上传完成');
        setTimeout(function() {
          f.uploadVideo.status = 'finished';
          f.uploadVideo.webid = webid;
        }, 300);
      }.bind(this),
      onUpdateStatus: function(status) {
        let self = this;
        setTimeout(() => {
          if (self.uploadVideo.status === 'ready' && status == 2) {
            _this.$message.error('网络连接超时.');
            self.uploadVideo.status = 'failed';
            self.status = 5;
          }
        }, TIME_OUT);
      },
      onUploadError: function(errorCode, msg) {
        this.uploadVideo.status = 'failed';
      }
    });
    this.uploader.init(function() {});
  },
  methods: {
    triggerUpload() {
      this.$refs.upload && this.$refs.upload.click();
    },
    reStart(loaderIndex, listIndex) {
      let uploaderItem = this.getUploaderItem(loaderIndex);
      if (uploaderItem) {
        uploaderItem.status = 0;
        uploaderItem.uploadVideo.status = 'ready';
        this.uploader.startUpload(listIndex);
      }
    },
    handleDelBtnClick(loaderIndex, listIndex) {
      this.delLoaderIndex = loaderIndex;
      this.delListIndex = listIndex;
      this.confirmOption = {
        title: '删除视频',
        txt: ' 您确认删除已上传的视频吗~',
        type: 'del',
        viewType: 'delete',
        sure: this.doDelUploadItem,
        close: this.close
      };
    },
    handleCancelBtnClick(loaderIndex, listIndex) {
      this.delLoaderIndex = loaderIndex;
      this.delListIndex = listIndex;
      this.confirmOption = {
        title: '取消上传',
        txt: ' 您确认取消上传吗~',
        type: 'del',
        viewType: 'cancel',
        sure: this.doDelUploadItem,
        close: this.close
      };
    },
    handleAddBtnClick(item, loaderIndex, listIndex) {
      if (!item.coverImage) {
        return;
      }
      this.delLoaderIndex = loaderIndex;
      this.delListIndex = listIndex;
      this.$emit('doInsertLocalVideo', item);
    },
    doDelUploadItem() {
      this.uploader.deleteFile(this.delLoaderIndex);
      this.uploadList.splice(this.delListIndex, 1);
      this.close();
    },
    getUploaderItem(idx) {
      let filesList = this.uploader.files;
      for (let i = 0; i < filesList.length; i++) {
        let file = filesList[i];
        if (file && file.index === idx) {
          return file;
        }
      }
      return null;
    },
    close() {
      this.confirmOption.viewType = null;
    }
  }
};
</script>

<style scoped>
.uploadList-wrapper {
  width: 772px;
  margin-top: 20px;
  .local-video__item {
    &:not(:last-of-type) {
      margin-bottom: 20px;
    }
    border: 1px solid #c9d0e1;
    border-radius: 4px;
    .video-item--finished {
      display: flex;
      padding: 10px;
      .img-cropper {
        margin-top: 4px;
      }
      .video-img__caption--null {
        color: #cccccc;
        font-size: 12px;
      }
      .video-item__meta {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 10px;
        .video-item__delete--txt {
          cursor: pointer;
          color: #f47b77;
        }
        .video-item__add {
          display: flex;
          justify-content: flex-end;
        }
        .video-item__footer {
          display: flex;
          justify-content: space-between;
        }
      }
    }
    .video-item--unfinish {
      padding: 15px 20px;
    }
    .video-item__title {
      line-height: 19px;
      font-size: 14px;
      color: #545660;
    }
    .video-item__reUpload {
      margin-left: 40px;
      color: #76a7e1;
      cursor: pointer;
    }
    .video-item__delete {
      display: inline-block;
      width: 16px;
      height: 16px;
      position: relative;
      margin-top: -2px;
      cursor: pointer;
      &::before,
      &::after {
        position: absolute;
        width: 100%;
        height: 2px;
        content: '';
        top: 50%;
        left: 0;
        background: #f47b77;
      }
      &::before {
        transform: rotate(45deg);
      }
      &::after {
        transform: rotate(-45deg);
      }
    }
    .progress {
      width: 660px;
      height: 16px;
      margin-right: 40px;
      background: #f3f3f3;
      border-radius: 2px;
      .indicator {
        &.is-failed {
          background: #ccc;
        }
        width: 0;
        height: 16px;
        background: #0abbfe;
        border-radius: 2px;
      }
    }
    .progressRate {
      margin-right: 20px;
    }
    .field__label {
      color: #a8adbc;
    }
    .is-line:not(:first-child) {
      margin-top: 15px;
    }
    .video-ready__txt {
      color: #09bbfe;
    }
    .video-error__txt {
      color: #f47b77;
    }
  }
}
</style>
