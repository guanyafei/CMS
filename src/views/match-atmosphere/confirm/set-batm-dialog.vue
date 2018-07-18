<template>
  <sn-confirm title="创建B面氛围" txt :flag="matchFaceBFlag">
    <sn-form ref="commonFloor" label-width="140px">
      <act-name :activityName.sync="activityName"></act-name>
      <time-range :startTime.sync="startTime" :endTime.sync="endTime"></time-range>
      <span class="errorTips" v-if="showError">{{ errorMsg }}</span>
      <div class="colorBox">
        <span class="setColorStyle">文字颜色配置</span>
        <div class="setColor">
          <sn-form-item label="顶标题文字默认">
            <sn-color-picker v-model="fontColors.topTitle"></sn-color-picker>
          </sn-form-item>
          <sn-form-item label="顶标题文字选中">
            <sn-color-picker v-model="fontColors.topTitleChoose"></sn-color-picker>
          </sn-form-item>
        </div>
        <div class="setColor bg-search">
          <sn-form-item label="搜索框背景">
            <sn-color-picker v-model="fontColors.searchBg"></sn-color-picker>
          </sn-form-item>
          <sn-form-item label="搜索框图标">
            <sn-color-picker v-model="fontColors.searchIcon"></sn-color-picker>
          </sn-form-item>
          <sn-form-item label="搜索框默认文字">
            <sn-color-picker v-model="fontColors.searchDefault"></sn-color-picker>
          </sn-form-item>
        </div>
        <div class="setColor bg-recomm">
          <sn-form-item label="推荐比赛背景">
            <sn-color-picker v-model="fontColors.remMatchBg"></sn-color-picker>
          </sn-form-item>
          <sn-form-item label="推荐比赛文字大">
            <sn-color-picker v-model="fontColors.remMatchTxtBig"></sn-color-picker>
          </sn-form-item>
          <sn-form-item label="推荐比赛文字小">
            <sn-color-picker v-model="fontColors.remMatchTxtSmall"></sn-color-picker>
          </sn-form-item>
        </div>
        <div class="setColor bg-loading">
          <sn-form-item label="loading文字">
            <sn-color-picker v-model="fontColors.txtLoading"></sn-color-picker>
          </sn-form-item>
        </div>
      </div>
      <div class="upload">
        <sn-form-item label="上传素材">
          <div style="width: 350px;text-align:left">
            <form enctype="multipart/form-data" ref="formfile">
              <a href="javascript:;" class="file">选择文件
                <input type="file" id="file" ref="fileInput" name="file" multiple @change="uploadZip">
              </a>
              <span style="position: relative;top: -10px;">{{fileShowName}}</span>
            </form>
          </div>
        </sn-form-item>
        <span class="errorTips" v-if="picErrorTip">上传格式不正确</span>
        <sn-form-item v-if="showPicFlag" label="素材预览">
          <div v-if="labelShowBox" class="bg-preview">
            <div v-if="labelShowBox" class="show_Pic_Section">
              <label style="margin:0px 6px;">顶部背景</label>
              <img :src="bgArrayLast[1]" width="300" height="50" />
            </div>
            <div v-if="labelShowBox" class="show_Pic_Section">
              <label style="margin:0px 6px;">首屏背景</label>
              <img :src="bgArrayLast[0]" width="300" height="50" />
            </div>
            <div v-if="labelShowBox" class="show_Pic_Section">
              <label style="margin:0px 6px;">下载加载前景图</label>
              <img :src="qjArrayLast" width="122" height="60" />
            </div>
          </div>
        </sn-form-item>
      </div>
    </sn-form>
    <div slot='btn-group'>
      <div class="sn-popup-btns">
        <sn-button size="mini" type="primary" @click="saveBtn">发布</sn-button>
        <sn-button size="mini" @click="cancelBtn">取消</sn-button>
      </div>
    </div>
  </sn-confirm>
</template>
<script>
import DI from 'interface';
import JSZip from 'jszip';
import ActName from './form-items/act-name';
import TimeRange from './form-items/time-range';
export default {
  components: {
    ActName,
    TimeRange
  },
  name: 'EditbAtmDialog',
  props: ['matchFaceBFlag'],
  data() {
    return {
      imgDataCb: '',
      labelShowBox: false,
      showPicFlag: false,
      skinDownloadUrl: '',
      errorMsg: '',
      fileShowName: '',
      activityName: '',
      picErrorTip: false,
      showError: false,
      startTime: null,
      endTime: null,
      fontColors: {
        topTitle: '',
        topTitleChoose: '',
        searchBg: '',
        searchIcon: '',
        searchDefault: '',
        remMatchBg: '',
        remMatchTxtBig: '',
        remMatchTxtSmall: '',
        txtLoading: ''
      },
      bgContentImgSize: {
        width: 1125,
        height: 1350
      },
      bgTitleBarImgSize: {
        width: 1125,
        height: 264
      },
      qjLoadingImgSize: {
        width: 366,
        height: 180
      },
      bgArray: ['bg_content', 'bg_titlebar'],
      qjArray: ['qj_loading'],
      bgArrayLast: [], //背景
      qjArrayLast: [] //前景
    };
  },
  methods: {
    uploadZip(e) {
      let files = e.target.files;
      if (files && files.length > 0) {
        this.handleFile(files[0]);
      }
      if (!this.showPicFlag) {
        this.showPicFlag = true;
      }
    },
    handleFile(f) {
      let _this = this;
      this.fileShowName = f.name;
      let fileType = f.type;
      let reg = /(\w+).(png|jpg|jpeg|gif)/;
      let regName = /.*\.zip$/;
      if (fileType != 'application/zip' && !regName.test(f.name)) {
        _this.$refs.fileInput.value = '';
        _this.cancelImg();
        _this.labelShowBox = false;
        _this.picErrorTip = true;
        return;
      }
      JSZip.loadAsync(f)
        .then(function(zip) {
          let re = /(.jpg|.png|.gif|.ps|.jpeg)$/;
          let promises = Object.keys(zip.files)
            .filter(function(fileName) {
              return re.test(fileName.toLowerCase());
            })
            .map(function(fileName) {
              let file = zip.files[fileName];
              return file.async('blob').then(function(blob) {
                return [fileName, URL.createObjectURL(blob)];
              });
            });
          return Promise.all(promises);
        })
        .then(function(result) {
          return result.reduce(function(acc, val) {
            acc[val[0]] = val[1];
            return acc;
          }, {});
        })
        .then(function(imgData) {
          _this.imgDataCb = imgData;
          if (_this.checkZipClass(imgData) === false) {
            _this.picErrorTip = true;
            _this.cancelImg();
            return;
          }
          let imgObj = [];
          let imgName = [];
          let imgNameNew = [];
          for (let key in imgData) {
            if ({}.hasOwnProperty.call(imgData, key) && imgData[key]) {
              imgObj.push(imgData[key]);
              imgName.push(key);
            }
          }
          for (let i = 0; i < imgName.length; i++) {
            imgNameNew.push(reg.exec(imgName[i])[1]);
          }
          _this.groupArray(imgNameNew, imgData, _this.cb);
        });
    },
    groupArray(checkArray, imgObjList, cb) {
      let checkFlag = false;
      let groupArrObj = {};
      let bgArray = this.bgArray;
      let qjArray = this.qjArray;
      let checkArrayLen = checkArray.length;
      if (checkArrayLen == 3) {
        checkFlag = true;
      } else {
        checkFlag = false;
      }
      if (checkFlag) {
        groupArrObj = { bgArray, qjArray };
        typeof cb === 'function' && cb(groupArrObj);
        // this.checkImgSize(imgObjList)
        //   .then(function(flag) {
        //     if (flag) {
        //       typeof cb === 'function' && cb(groupArrObj);
        //     }
        //   })
        //   .catch(function(flag) {
        //     typeof cb === 'function' && cb(false);
        //   });
      } else {
        typeof cb === 'function' && cb(false);
      }
    },
    cb(tips) {
      let _this = this;
      let imgData = _this.imgDataCb;
      if (tips === false) {
        _this.picErrorTip = true;
        _this.cancelImg();
      } else {
        let groupList = tips;
        _this.cancelImg();
        _this.picErrorTip = false;
        if (groupList.bgArray) {
          groupList.bgArray.forEach(function(bItem) {
            Object.keys(imgData).forEach(function(item) {
              if (item.indexOf(bItem) >= 0) {
                _this.bgArrayLast.push(imgData[item]);
              }
            });
          });
        }
        if (groupList.qjArray) {
          groupList.qjArray.forEach(function(qItem) {
            Object.keys(imgData).forEach(function(item) {
              if (item.indexOf(qItem) >= 0) {
                _this.qjArrayLast.push(imgData[item]);
              }
            });
          });
        }
        _this.labelShowBox = true;
        _this.uploadFileZip();
      }
    },
    uploadFileZip() {
      this.$ajax({
        url: DI.atmosphere.uploadFileZip,
        processData: false,
        contentType: false,
        data: new FormData(this.$refs.formfile),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.skinDownloadUrl = res.data.urlPic || '';
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    checkImgSize(imgObjList = {}) {
      let _this = this;
      let promises = [];
      Object.keys(imgObjList).map((key, index) => {
        promises.push(
          new Promise((resolve, reject) => {
            let image = new Image();
            let checkSize = getImgWidth(key);
            image.onload = function() {
              let { width, height } = this;
              if (width != checkSize.width || height != checkSize.height) {
                reject(key);
              } else {
                resolve(key);
              }
            };
            image.src = imgObjList[key];
          })
        );
      });
      return Promise.all(promises);
      function getImgWidth(key) {
        let checkSize = {};
        if (key.indexOf('bg_content') >= 0) {
          checkSize = _this.bgContentImgSize;
        } else if (key.indexOf('bg_titlebar') >= 0) {
          checkSize = _this.bgTitleBarImgSize;
        } else if (key.indexOf('qj_loading') >= 0) {
          checkSize = _this.qjLoadingImgSize;
        }
        return checkSize;
      }
    },
    checkZipClass(picList) {
      for (let i in picList) {
        if (i.indexOf('/') >= 0) {
          return false;
        }
      }
    },
    saveBtn() {
      //发布
      this.errorMsg = '';
      const { fontColors } = this;
      if (!this.activityName) {
        this.$message.warning('请输入活动名称');
        return;
      }
      if (!this.startTime || !this.endTime) {
        this.$message.warning('请选择氛围时间');
        return;
      }
      if (this.startTime == this.endTime) {
        this.$message.warning('开始时间与结束时间不可一致');
        return;
      }
      if (this.startTime > this.endTime) {
        this.showError = true;
        this.errorMsg = '氛围结束时间必须大于开始时间';
        return;
      }
      if (!this.fontColors.topTitle) {
        this.$message.warning('请设置顶标题文字默认颜色');
        return;
      }
      if (!this.fontColors.topTitleChoose) {
        this.$message.warning('请设置顶标题文字选中颜色');
        return;
      }
      if (!this.fontColors.searchBg) {
        this.$message.warning('请设置搜索框背景颜色');
        return;
      }
      if (!this.fontColors.searchIcon) {
        this.$message.warning('请设置搜索框图标颜色');
        return;
      }
      if (!this.fontColors.searchDefault) {
        this.$message.warning('请设置搜索框默认文字颜色');
        return;
      }
      if (!this.fontColors.remMatchBg) {
        this.$message.warning('请设置推荐比赛背景颜色');
        return;
      }
      if (!this.fontColors.remMatchTxtBig) {
        this.$message.warning('请设置推荐比赛文字大颜色');
        return;
      }
      if (!this.fontColors.remMatchTxtSmall) {
        this.$message.warning('请设置推荐比赛文字小颜色');
        return;
      }
      if (!this.fontColors.txtLoading) {
        this.$message.warning('请设置文字loading颜色');
        return;
      }
      if (!this.skinDownloadUrl) {
        this.$message.warning('请上传正确的zip包');
        return;
      }
      this.matchFaceBFlag = false;
      this.$ajax({
        url: DI.atmosphere.faceBPublish,
        data: JSON.stringify({
          activityName: this.activityName,
          activityType: 1,
          startTime: this.startTime,
          endTime: this.endTime,
          skinDownloadUrl: this.skinDownloadUrl,
          skinType: 2,
          recommendedMatchColor:
            '{"background":' +
            JSON.stringify(this.fontColors.remMatchBg.hex) +
            ',"bigText":' +
            JSON.stringify(this.fontColors.remMatchTxtBig.hex) +
            ',"smallText":' +
            JSON.stringify(this.fontColors.remMatchTxtSmall.hex) +
            ',"loading":' +
            JSON.stringify(this.fontColors.txtLoading.hex) +
            '}',
          searchBarColor:
            '{"background":' +
            JSON.stringify(this.fontColors.searchBg.hex) +
            ',"defaultChar":' +
            JSON.stringify(this.fontColors.searchDefault.hex) +
            ',"searchIcon":' +
            JSON.stringify(this.fontColors.searchIcon.hex) +
            '}',
          topTitleColor:
            '{"selectedColor":' +
            JSON.stringify(this.fontColors.topTitleChoose.hex) +
            ',"unselectColor":' +
            JSON.stringify(this.fontColors.topTitle.hex) +
            '}'
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.matchFaceBFlag = false;
            this.$parent.queryList();
            this.cancelBtn();
          } else {
            this.$message.error(res.retMsg);
            this.matchFaceBFlag = true;
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    cancelImg() {
      this.bgArrayLast = [];
      this.qjArrayLast = [];
      this.loadingArrayLast = [];
      this.labelShowBox = false;
      this.skinDownloadUrl = '';
    },
    cancelBtn() {
      this.$refs.fileInput.value = '';
      this.$emit('update:matchFaceBFlag', false);
      this.activityName = '';
      this.startTime = null;
      this.endTime = null;
      this.labelShowBox = false;
      this.fileShowName = '';
      this.picErrorTip = false;
      this.showPicFlag = false;
      this.fontColors = {
        topTitle: '',
        topTitleChoose: '',
        searchBg: '',
        searchIcon: '',
        searchDefault: '',
        remMatchBg: '',
        remMatchTxtBig: '',
        remMatchTxtSmall: '',
        txtLoading: ''
      };
    }
  }
};
</script>
<style scoped>
.errorTips {
  color: red;
  font-size: 12px;
  position: relative;
  top: -15px;
  left: -74px;
}
.bg-preview {
  margin: 40px 0px 0px -72px;
}
.colorBox {
  position: relative;
  top: -10px;
  .setColorStyle {
    color: #999;
    font-size: 14px;
    display: flex;
    padding: 18px 0 18px 30px;
  }
  .setColor {
    display: flex;
  }

  .bg-search {
    margin-left: -27px;
  }
  .bg-recomm {
    margin-left: -12px;
  }
  .bg-loading {
    margin-left: -17px;
  }
}
.upload {
  margin-left: -41px;
}
.file {
  position: relative;
  display: inline-block;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  padding: 4px 12px;
  overflow: hidden;
  color: #666;
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
.show_Pic_Section {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
</style>

