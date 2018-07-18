<template>
  <sn-dialog title="入口配置" :width="500" :visible.sync="curDialogVisible" :before-close="handleClose">
    <sn-form ref="formData">
      <sn-form-item label-width="20px">
        <p>
          <span class="img-txt">B面入口图片:</span>
          <span class="img-tips">支持PNG格式图片上传,图片大小为1M以内</span>
        </p>
        <div class="form-upload">
          <form enctype="multipart/form-data" ref="formFile">
            <a href="javascript:;" class="file" v-if="uploadFlag">点击上传
              <input type="file" id="entranceFormFile" ref="entranceFormFile" name="entranceFormFile" @change="handleEntranceImgChange($event)">
            </a>
            <a href="javascript:;" class="file" v-else>重新上传
              <input type="file" id="entranceFormFile" ref="entranceFormFile" name="entranceFormFile" @change="handleEntranceImgChange($event)">
            </a>
          </form>
          <div class="img-load" v-if="imgLoadEntranceFlag">
            <img :src="imgVal|smallImage" alt="" ref="image"/>
          </div>
        </div>
      </sn-form-item>

      <sn-form-item label-width="20px">
        <p>
          <span class="img-txt">返回入口图片:</span>
          <span class="img-tips">支持PNG格式图片上传,图片大小为1M以内</span>
        </p>
        <div class="form-upload">
          <form enctype="multipart/form-data" ref="formFile">
            <a href="javascript:;" class="file" v-if="backUploadFlag">点击上传
              <input type="file" id="backFormFile" ref="backFormFile" name="backFormFile" @change="handleBackImgChange($event)">
            </a>

            <a href="javascript:;" class="file" v-else>重新上传
              <input type="file" id="backFormFile" ref="backFormFile" name="backFormFile" @change="handleBackImgChange($event)">
            </a>
          </form>
          <div class="img-load" v-if="imgLoadBackFlag">
            <img :src="backImgVal|smallImage" alt="" ref="image"/>
          </div>
        </div>
      </sn-form-item>
    </sn-form>
    <span slot="footer" class="dialog-footer">
      <sn-button type="primary" @click="submit" :disabled="!imgVal || !backImgVal">保 存</sn-button>
      <sn-button @click="cancel">取 消</sn-button>
    </span>
  </sn-dialog>
</template>
<script>
import DI from 'interface';
import Http from 'utils/http';
import emitter from 'mixins/emitter';
import Message from 'components/new-frame/message';
export default {
  mixins: [emitter],
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      rules: {
        imgVal: [
          {
            required: true,
            message: '请上传图片',
            trigger: 'change'
          }
        ]
      },
      imgLoadEntranceFlag: false,
      imgLoadBackFlag: false,
      backUploadFlag: false,
      uploadFlag: false,
      isFlag: '',
      file: '',
      fileName: '',
      backFileName: '',
      contentType: '',
      imgFileSize: '',
      imgVal: '',
      backImgVal: ''
    };
  },
  watch: {
    dialogVisible(newVal) {
      if (newVal) {
        this.queryLogoConfig();
      }
    },
    imgVal(newVal) {
      if (newVal) {
        this.uploadFlag = false;
        this.imgLoadEntranceFlag = true;
      } else {
        this.uploadFlag = true;
        this.imgLoadEntranceFlag = false;
      }
    },
    backImgVal(newVal) {
      if (newVal) {
        this.backUploadFlag = false;
        this.imgLoadBackFlag = true;
      } else {
        this.backUploadFlag = true;
        this.imgLoadEntranceFlag = false;
      }
    }
  },
  computed: {
    curDialogVisible: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit('update:dialogVisible', val);
      }
    }
  },
  methods: {
    queryLogoConfig() {
      //查询B面入口图
      Http.ajax({
        url: DI.channelConfig.queryLogoConfig,
        data: JSON.stringify({}),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.imgVal = res.data.inLogo;
            this.backImgVal = res.data.outLogo;
          } else {
            this.$message.warning(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    submit() {
      //入口配置;
      let pms = {
        inLogo: this.imgVal,
        outLogo: this.backImgVal
      };
      Http.ajax({
        url: DI.channelConfig.logoConfiguration,
        data: JSON.stringify(pms),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            Message.success('配置成功!');
            this.handleClose();
          } else {
            Message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    handleEntranceImgChange(event) {
      this.isFlag = 1;
      //上传图片
      const files = event.target.files;
      let _self = this;
      let imgFilePromiseChain = new Promise((resolve, reject) => {
        if (files && files.length) {
          resolve(files[0]);
        }
      })
        .then(file => {
          //格式校验
          if (/^image\/png+/.test(file.type.toLowerCase())) {
            return file;
          } else {
            return Promise.reject('上传失败，只支持png格式图片.');
          }
        })
        .then(file => {
          const isGif = /^image\/gif+/.test(file.type.toLowerCase());
          let imgFileSize = file.size;
          let curSizeStr = isGif ? '8M' : '1M';
          let maxImgSize = this.calSize(curSizeStr);
          let exceedSizeMsg = `图片大小超过${curSizeStr.toUpperCase()}`;
          if (maxImgSize > imgFileSize) {
            file.isGif = isGif;
            if (_self.isFlag == 1) {
              _self.fileName = file.name;
            } else {
              _self.backFileName = file.name;
            }
            _self.contentType = file.type;
            _self.imgFileSize = file.size;
            _self.file = file;
            return file;
          } else {
            return Promise.reject(`上传失败，${exceedSizeMsg}！`);
          }
        })
        .then(file => {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.addEventListener('load', function() {
            _self.uploadImg(reader.result);
          });
        })
        .catch(errMsg => {
          _self.$refs.entranceFormFile.value = '';
          _self.$refs.backFormFile.value = '';
          _self.$message.error(errMsg);
        });
    },
    handleBackImgChange(event) {
      this.handleEntranceImgChange(event);
      this.isFlag = 2;
    },
    uploadImg(imgDataUrl) {
      let name = this.isFlag == 1 ? this.fileName : this.backFileName;
      Http.ajax({
        url: DI.common.uploadFileBase64,
        context: this,
        loadingText: '正在上传图片，请稍候！',
        data: JSON.stringify({
          base64File: imgDataUrl.substr(13 + this.contentType.length),
          fileName: name.replace(/\s/g, ''),
          contentType: this.contentType
        }),
        success: res => {
          if (res.retCode == '0') {
            if (this.isFlag == 1) {
              this.imgVal = res.data;
            } else {
              this.backImgVal = res.data;
            }
            this.dispatch('FormItem', 'form.change', [res.data]);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: error => {
          this.$refs.entranceFormFile.value = '';
          this.$refs.backFormFile.value = '';
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
    handleClose() {
      this.curDialogVisible = false;
    },
    cancel() {
      this.curDialogVisible = false;
      this.imgVal = '';
      this.backImgVal = '';
    }
  }
};
</script>
<style scoped>
.form-upload {
  margin-top: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .img-load {
    width: 400px;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    /* border: 1px solid #d1d1d1; */
    align-items: center;
    img{
      max-width: 60px;
      min-width: 20px;
    }
  }
  .img-load p {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.img-txt {
  color: #999;
  font-size: 14px;
}
.img-tips {
  color: #c1c1c1;
  font-size: 12px;
}
.file {
  background: #09bbfe;
  position: relative;
  display: inline-block;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  padding: 4px 12px;
  overflow: hidden;
  color: #fff;
  text-decoration: none;
  text-indent: 0;
  line-height: 20px;
}
.file input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
}
.dialog-footer {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  button {
    margin-right: 40px;
  }
}
</style>

