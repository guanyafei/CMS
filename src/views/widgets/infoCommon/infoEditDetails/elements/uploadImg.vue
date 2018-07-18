<template>
  <div class="container">
    <p class="tips">图集支持JPG、JPEG、PNG、GIF图片格式，GIF大小不超过8M，其它格式不超过1M；</p>
    <p class="tips">支持6-30张图片展示；</p>
    <p class="tips">涉及政治敏感、黄色暴力、血腥恐怖等图集，违反将暂停发布资格；</p>
    <div class="uploader-list">
      <template v-if="list && list.length">
        <section class="uploader-item" v-for="(item, index) in list" :key="index">
          <div class="uploader-img" :class="{'success': item.success}">
            <!-- // 0=准备上传 1=上传中 2=上传成功 3=上传失败 -->
            <img v-if="item.state == 2" :src="item.url" :style="item.style">
            <img v-if="item.state == 3" :src="errUploadUrl" width="100%">
            <img v-if="item.state == 0 || item.state == 1" :src="progressUploadUrl" width="100%">
            <span class="cover" v-if="item.isCover && index <= 2">封面</span>
            <div class="progress" v-if="item.state == 1">
              <div class="progress-bar" :style="{ width: item.percent + '%' }"></div>
            </div>
            <p class="errtxt" v-if="item.state == 3">{{item.errtxt}}</p>
          </div>
          <div class="uploader-input">
            <span class="image-name">{{item.name}}</span>
            <span class="intro-err" v-if="item.introErr">{{item.errMsg}}</span>
            <sn-input :class="{'is-error': item.introErr}"
              type="textarea"
              maxlength="100"
              width="560"
              height="90"
              showWord
              :totalWords="100"
              counter-position="top"
              placeholder="请输入图片说明"
              v-model="item.intro"
              align-word="top"
              @input="item.introErr=false">
            </sn-input>
            <div v-if="item.proName" class="img-goods__meta">
              <span class="img-goods__label">商品名称：</span>
              <span class="img-goods__title ellipsis">{{ item.proName }}</span>
              <span class="img-goods_close" @click="handleDelGoodsBtnClick(index)"></span>
            </div>
            <sn-button type="text" :disabled="item.state!=null&&item.state!==2" v-else>
              <span :class="['goods-btn__txt', {
                'is-disabled': item.state!=null && item.state!==2
              }]" @click="handleAddGoodsBtnClick(index, item.state!=null && item.state!==2)">
                添加商品链接
              </span>
            </sn-button>
          </div>
          <div class="uploader-btns">
            <button class="delete-btn is-line" @click="remove(index)">
              <i class="icon-delete"></i>
              <span class="delete-text">删除</span>
            </button>
            <sn-button v-show="item.state==2" @click="move(-1, item, index)" :disabled="index == 0">上移</sn-button>
            <sn-button v-show="item.state==2" @click="move(1, item, index)" :disabled="index == list.length - 1">下移</sn-button>
          </div>
        </section>
      </template>
    </div>
    <div class="upload-box" @click="handleInput" :class="{'disabled': list.length == 30}">
      <i class="upload-add-img"></i>
      <p class="upload-text">点击上传图片</p>
      <p class="upload-text" v-if="list.length == 30">您已经达到图片上传上限，无法继续上传了哦～</p>
    </div>
    <input type="file" ref='fileInput' class="upload-input" @change='fileInputChangeHandler($event)' multiple>
    <goods-dialog :viewType="viewType" @sure="doAddGoodsMeta" @close="doCloseDialog" disImg></goods-dialog>
    <sn-confirm
      v-if="viewType=='confirmGoodsDel'"
      title="提示"
      @sure="doDelGoods"
      @close="doCloseDialog"
      type="del"
      noflag>
      <template slot="confirm-txt">
        确认删除该商品链接？
      </template>
    </sn-confirm>
  </div>
</template>
<script>
const errUploadUrl = require('assets/erro_upload.png');
const progressUploadUrl = require('assets/progress_upload.png');

import DI from 'interface';
import GoodsDialog from 'widgets/editor/goodsDialog';
const DEFAULTS = {
  proName: null,
  proPrice: null,
  proUrl: null,
  bizCode: null,
  cmmdtyCode: null
};
export default {
  name: 'UploadImg',
  props: ['ruleForm'],
  components: {
    GoodsDialog
  },
  data() {
    return {
      val: '',
      selectedIndex: null,
      viewType: null,
      list: [],
      ratio: 1.33,
      uploadCount: 0,
      errUploadUrl,
      progressUploadUrl
    };
  },
  watch: {
    'ruleForm.content'(val, oldVal){
        const temp = this.setImgListData(val) || [];
        this.list = temp;
    },
    uploadCount(val, oldVal) {
      const temp1 = this.test() || [];
      if (val == 0) {
        let list = this.list;
        this.$refs.fileInput.value = '';
        for (let i = 0; i < list.length; i++) {
          if (this.coverCount == 3) break;
          let item = list[i];
          if (item.url && !item.isCover) {
            item.isCover = true;
            this.coverCount++;
          }
        }
      }
    }
  },
  methods: {
    test() {
      return [2]
    },
    handleInput() {
      if (this.list.length == 30) return;
      this.$refs.fileInput.click();
    },
    remove(index) {
      let self = this.list[index];
      if (self.state != 3) {
        if (self.isCover && this.list.length > 3) {
          let up = this.list[index - 1];
          let down = this.list[index + 1];
          for (let i = 0; i < this.list.length; i++) {
            //从头开始遍历，把第一个能成为封面且不是封面的项目置成有封面的
            if (this.list[i].url && !this.list[i].isCover) {
              this.list[i].isCover = true;
              break;
            }
          }
        } else if (this.list.length <= 3) {
          this.coverCount--;
        }
      }
      this.list.splice(index, 1);
    },
    move(shift, item, index) {
      if (shift == -1) {
        // 上移
        let upped = this.list[index - 1];
        if (!item.isCover && upped.isCover) {
          upped.isCover = false;
          item.isCover = true;
        }
      } else {
        // 下移
        let upped = this.list[index + 1];
        if (item.isCover) {
          if (!upped.isCover && upped.url) {
            item.isCover = false;
            upped.isCover = true;
          }
        }
      }
      this.list.splice(index, 1);
      this.list.splice(index + shift, 0, item);
      this.handleCover();
    },
    handleAddGoodsBtnClick(index, disabled) {
      if (disabled) return;
      this.selectedIndex = index;
      this.viewType = 'goods';
    },
    doAddGoodsMeta(option) {
      this.list[this.selectedIndex] = { ...this.list[this.selectedIndex], ...option };
    },
    doCloseDialog() {
      this.viewType = null;
    },
    handleDelGoodsBtnClick(index) {
      this.selectedIndex = index;
      this.viewType = 'confirmGoodsDel';
    },
    doDelGoods() {
      this.list[this.selectedIndex] = { ...this.list[this.selectedIndex], ...DEFAULTS };
      this.viewType = null;
    },
    fileInputChangeHandler(e) {
      let files = e.target.files;
      let total = this.list.length;
      let maxFileSize = void 0;
      let message = void 0;
      if (total + files.length > 30) {
        this.$refs.fileInput.value = '';
        this.$message.error('最多上传30张图片');
        return;
      }

      for (var i = 0, len = files.length; i < len; ++i) {
        let file = files[i],
          image = new Image(),
          item = {
            file: file,
            url: '',
            style: {},
            name: file.name,
            intro: '',
            percent: 0,
            state: 0, // 0=准备上传 1=上传中 2=上传成功 3=上传失败,
            isCover: false, //是否显示封面
            errtxt: '',
            introErr: false,
            errMsg: ''
          };
        if (!/^image\/(jpe?g|gif|png)+/.test(file.type)) {
          //不是图片
          item.errtxt = '图片格式不正确';
          item.state = 3;
        }

        if (/^image\/gif+/.test(file.type)) {
          //不是图片
          maxFileSize = 8;
          message = 'gif图片大小超出8M';
        } else {
          maxFileSize = 1;
          message = '图片大小超出1M';
        }
        if (file.size > 1024 * 1024 * maxFileSize) {
          item.errtxt = message;
          item.state = 3;
        }

        this.list.push(item);
        if (item.state != 3) {
          this.uploadCount++;
          this.upload(item);
        }
      }
    },
    upload(item) {
      let formData = new FormData();
      item.file.name.replace(/\s/g, '');
      formData.append('file', item.file);
      let _self = this;
      let xhrOnProgress = function(fun) {
        xhrOnProgress.onprogress = fun;
        return function() {
          var xhr = $.ajaxSettings.xhr();
          if (typeof xhrOnProgress.onprogress !== 'function') return xhr;
          if (xhrOnProgress.onprogress && xhr.upload) {
            xhr.upload.onprogress = xhrOnProgress.onprogress;
          }
          return xhr;
        };
      };
      this.$ajax({
        url: DI.common.uploadFile,
        data: formData,
        loadingText: '正在上传图片，请稍候！',
        context: this,
        processData: false,
        contentType: false,
        xhr: xhrOnProgress(e => {
          item.state = 1;
          item.percent = Math.round(e.loaded / e.total) * 100;
        }),
        success: function(res) {
          if (res.retCode == '0' && res.data) {
            this.uploadCount--;
            this.$message.success(`图片上传成功`);
            item.url = res.data;
            item.state = 2;
            let image = new Image();
            if (res.data) image.src = res.data;
            image.onload = () => {
              if (image.width / image.height >= this.ratio) {
                item.style = {
                  width: '100%'
                };
              } else {
                item.style = {
                  height: '100%'
                };
              }
            };
            this.handleCover();
          } else {
            this.$message.error(res.retMsg);
            item.state = 3;
            item.errtxt = '上传失败';
            this.uploadCount--;
          }
        },
        error: function(res) {
          this.uploadCount--;
          item.state = 3;
          item.errtxt = '上传失败';
        }
      });
    },
    handleCover() {
      if (this.list && this.list[0] && this.list[1] && this.list[2]) {
        this.ruleForm.cover = this.list[0].url + ';' + this.list[1].url + ';' + this.list[2].url;
      } else {
        this.ruleForm.cover = '';
      }
      let listGroup = this.list.reduce((perVal, item) => {
        perVal.push(item.url);
        return perVal;
      }, []);
      this.$bus.$emit('picture-cover-change', listGroup);
    },
    // 暴露的方法
    doValidate() {
      let count = 0;
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].state == 2) {
          // 上传成功的数量
          count++;
        }
      }
      if (count > 30) {
        this.$message.error('上传图片超过30张');
        return false;
      } else if (count >= 6) {
        return true;
      } else {
        this.$message.error('至少上传6张图片');
        return false;
      }
    },
    getData() {
      let content = [];
      let list = this.list;

      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        if (item.state == 3) continue;
        let pushItem = {
          picUrl: item.url,
          gifFlag: item.file.type == 'image/gif' ? 1 : 2,
          picDes: item.intro,
          extra: {
            style: item.style,
            name: item.name,
            file: item.file
          },
          proName: item.proName,
          proPrice: item.proPrice,
          proUrl: item.proUrl,
          bizCode: item.bizCode,
          cmmdtyCode: item.cmmdtyCode
        };
        pushItem = this.deleteNullGoodsLinkFields(pushItem);
        content.push(pushItem);
      }

      // 设置封面
      if (this.list && this.list[0]) {
        this.ruleForm.cover = this.list[0].url + ';' + this.list[1].url + ';' + this.list[2].url;
      } else {
        this.ruleForm.cover = '';
      }

      return JSON.stringify(content);
    },
    setImgListData(data) {
      this.coverCount = 0;
      let tempDom = document.createElement('div');
      tempDom.innerHTML = data;
      let content = JSON.parse(tempDom.innerText || '[]');
      let list = [];
      for (let i = 0; i < content.length; i++) {
        i < 3 && ++this.coverCount;
        let item = content[i];
        let pushItem = {
          url: item.picUrl,
          intro: item.picDes,
          isCover: i < 3,
          state: 2,
          name: item.extra.name,
          style: item.extra.style,
          file: item.extra.file,
          proName: item.proName,
          proPrice: item.proPrice,
          proUrl: item.proUrl,
          bizCode: item.bizCode,
          cmmdtyCode: item.cmmdtyCode
        };
        pushItem = this.deleteNullGoodsLinkFields(pushItem);
        list.push(pushItem);
      }
      return list;
    },
    deleteNullGoodsLinkFields(item) {
      let goodsFields = ['proName', 'proPrice', 'proUrl', 'bizCode', 'cmmdtyCode'];
      goodsFields.map(field => {
        if ({}.hasOwnProperty.call(item, field) && !item[field]) {
          delete item[field];
        }
      });
      return item;
    },
    clearData() {
      this.list = [];
    }
  }
};
</script>

<style scoped>
.container {
  .tips {
    font-size: 12px;
    color: #a8adbc;
    line-height: 16px;
  }
  .uploader-list {
    margin-top: 30px;
    .uploader-item {
      display: flex;
      padding-bottom: 16px;
      width: 100%;
      & + .uploader-item {
        padding-top: 16px;
        border-top: 2px dashed #c9d0e1;
      }
      .img-goods__meta {
        position: relative;
        margin-top: 5px;
        padding: 5px 15px 5px;
        border: 1px solid #09bbfe;
        border-radius: 4px;
        font-size: 12px;
        background: #f0fbff;
        .img-goods__title {
          width: 450px;
        }
        .img-goods_close {
          position: absolute;
          right: 11px;
          width: 12px;
          height: 12px;
          cursor: pointer;
          background-image: url(../../../../../assets/icon-close-orange.png);
          background-repeat: no-repeat;
        }
      }
      .goods-btn__txt {
        &.is-disabled {
          background-image: url(../../../../../assets/icon-add-gray.png);
        }
        padding-left: 20px;
        background-image: url(../../../../../assets/icon-add-mini.png);
        background-position: 0px 2px;
        background-repeat: no-repeat;
      }
      .uploader-img {
        position: relative;
        width: 160px;
        height: 120px;
        overflow: hidden;
        margin-right: 16px;
        text-align: center;
        border: 1px solid rgba(201, 208, 255, 0.33);
        img {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        .cover {
          position: absolute;
          left: 10px;
          top: 10px;
          width: 36px;
          height: 18px;
          line-height: 18px;
          text-align: center;
          color: #fff;
          background: #f3ab57;
          border-radius: 2px;
        }
        .progress {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          bottom: 24px;
          width: 70px;
          height: 4px;
          background: #dde2f0;
          border-radius: 2px;
          .progress-bar {
            height: 100%;
            width: 80%;
            background: #5fcac6;
          }
        }
        .errtxt {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          white-space: nowrap;
          bottom: 18px;
          font-size: 12px;
          color: #f47b77;
        }
      }
      .uploader-input {
        margin-right: 22px;
        .image-name {
          max-width:560px;
          word-wrap:break-word;
          display: inline-block;
          font-size: 14px;
          color: #54565f;
          margin-bottom: 13px;
        }
        .intro-err {
          font-size: 12px;
          color: #f68885;
          margin-left: 10px;
        }
      }
      .uploader-btns {
        display: flex;
        height:160px;
        justify-content: space-between;
        flex-direction: column;
        padding-bottom: 32px;
        button {
          &:nth-child(1) {
            min-width: 88px;
          }
          &:nth-child(2) {
            margin-bottom: 8px;
          }
        }
        .delete-btn {
          justify-content: center;
          margin-bottom: 10px;
          .icon-delete {
            display: inline-block;
            width: 14px;
            height: 14px;
            vertical-align: bottom;
            background: url(../../../../../assets/icon-del-small.png) no-repeat;
            background-size: 100% 100%;
          }
          .delete-text {
            display: inline-block;
            margin-left: 5px;
            padding-top: 2px;
            vertical-align: middle;
          }
        }
      }
    }
  }
  .upload-box {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #c9d0e1;
    height: 100px;
    width: 100%;
    border-radius: 4px;
    &.disabled {
      background: #f4f6fb;
      &:hover {
        cursor: not-allowed;
        border: 1px dashed #c9d0e1;
      }
    }
    &:hover {
      cursor: pointer;
      border: 1px dashed #a1a1a1;
    }
    .upload-add-img {
      display: inline-block;
      width: 40px;
      height: 32px;
      background: url(../../../../../assets/icon-plus-big.png) no-repeat;
      background-size: 100% 100%;
    }
    .upload-text {
      font-size: 16px;
      color: #6e7690;
      margin-left: 15px;
    }
  }
  .upload-input {
    display: none;
  }
  .vali-btn {
    margin-top: 32px;
  }
}

.intro-textarea-err {
  border: 1px solid #f47b77;
}
</style>
