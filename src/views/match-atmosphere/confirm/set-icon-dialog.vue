<template>
  <sn-confirm title="创建ICON" txt :flag="matchIconFlag">
    <sn-form ref="commonFloor" :model="editFloorInfo" :rules="floorRules" label-width="140px" formWidth="600">
      <act-name :activityName.sync="activityName"></act-name>
      <time-range :startTime.sync="startTime" :endTime.sync="endTime"></time-range>
      <span class="errorTips" v-if="showError">{{ errorMsg }}</span>
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
        <div class="imgShow">
          <div class="imgDefault">
            <span>默认</span>
            <ul>
              <li v-for="item in finalImgDefault" :key="item">
                <img :src="item" width="60px;" height="60px;">
              </li>
            </ul>
          </div>
          <div>
            <div>
              <span>选中</span>
              <ul>
                <li v-for="item in finalImgSelect" :key="item">
                  <img :src="item" width="60px;" height="60px;">
                </li>
              </ul>
            </div>
          </div>
        </div>
      </sn-form-item>
    </sn-form>
    <div slot='btn-group'>
      <div class="sn-popup-btns">
        <sn-button size="mini" type="primary" @click="saveIconBtn">发布</sn-button>
        <sn-button size="mini" @click="cancelIconBtn">取消</sn-button>
      </div>
    </div>
  </sn-confirm>
</template>

<script>
import * as Constant from 'js/constant';
import JSZip from 'jszip';
import DI from 'interface';
import ActName from './form-items/act-name';
import TimeRange from './form-items/time-range';

const iconList = [
  {
    tab1_s_3x: {
      width: 66,
      height: 66
    },

    tab1_n_3x: {
      width: 66,
      height: 66
    },
    tab1_s_2x: {
      width: 44,
      height: 44
    },

    tab1_n_2x: {
      width: 44,
      height: 44
    }
  },
  {
    tab2_s_3x: {
      width: 66,
      height: 66
    },

    tab2_n_3x: {
      width: 66,
      height: 66
    },
    tab2_s_2x: {
      width: 44,
      height: 44
    },

    tab2_n_2x: {
      width: 44,
      height: 44
    }
  },
  {
    tab3_s_3x: {
      width: 66,
      height: 66
    },

    tab3_n_3x: {
      width: 66,
      height: 66
    },
    tab3_s_2x: {
      width: 44,
      height: 44
    },

    tab3_n_2x: {
      width: 44,
      height: 44
    }
  },
  {
    tab4_s_3x: {
      width: 66,
      height: 66
    },

    tab4_n_3x: {
      width: 66,
      height: 66
    },
    tab4_s_2x: {
      width: 44,
      height: 44
    },

    tab4_n_2x: {
      width: 44,
      height: 44
    }
  },
  {
    tab5_s_3x: {
      width: 66,
      height: 66
    },

    tab5_n_3x: {
      width: 66,
      height: 66
    },
    tab5_s_2x: {
      width: 44,
      height: 44
    },

    tab5_n_2x: {
      width: 44,
      height: 44
    }
  }
];
const iconKeyList = [
  'tab1_s_3x',
  'tab1_n_3x',
  'tab2_s_3x',
  'tab2_n_3x',
  'tab3_s_3x',
  'tab3_n_3x',
  'tab4_s_3x',
  'tab4_n_3x',
  'tab5_s_3x',
  'tab5_n_3x',
  'tab1_s_2x',
  'tab1_n_2x',
  'tab2_s_2x',
  'tab2_n_2x',
  'tab3_s_2x',
  'tab3_n_2x',
  'tab4_s_2x',
  'tab4_n_2x',
  'tab5_s_2x',
  'tab5_n_2x'
];

export default {
  name: 'SetIconDialog',
  props: ['matchIconFlag'],
  components: {
    ActName,
    TimeRange
  },
  data() {
    return {
      showError: false,
      errorMsg: '',
      activityName: '',
      picErrorTip: false,
      showPicFlag: false,
      picShowList: [],
      finalImgList: [],
      endTime: '',
      startTime: '',
      finalImgDefault: [],
      finalImgSelect: []
    };
  },
  computed: {},
  methods: {
    saveIconBtn() {
      this.errorMsg = '';
      let _this = this;
      if (!this.activityName) {
        this.$message.warning('请输入活动名称');
        return;
      }
      if (!this.startTime || !this.endTime) {
        this.$message.warning('请选择氛围时间');
        return;
      }
      if (this.startTime === this.endTime) {
        this.$message.warning('开始时间与结束时间不可一致');
        return;
      }
      if (this.startTime > this.endTime) {
        this.showError = true;
        this.errorMsg = '氛围结束时间必须大于开始时间';
        return;
      }
      if (!this.skinDownloadUrl) {
        this.$message.warning('请上传正确的zip包');
        return;
      }
      this.matchLiveFlagEdit = false;
      this.$ajax({
        url: DI.atmosphere.publish,
        data: JSON.stringify({
          activityName: this.activityName,
          activityType: 3,
          endTime: this.endTime,
          skinDownloadUrl: this.skinDownloadUrl,
          startTime: this.startTime
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        delay: 1000,
        success: res => {
          if (res.retCode == '0') {
            this.matchLiveFlagEdit = false;
            this.$parent.queryList();
            _this.cancelIconBtn();
          } else {
            this.$message.error(res.retMsg);;
            // _this.cancelIconBtn();
            _this.matchIconFlag = true;
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    cancelIconBtn() {
      this.$refs.fileInput.value = '';
      this.$emit('update:matchIconFlag', false);
      this.activityName = '';
      this.startTime = '';
      this.endTime = '';
      this.fileShowName = '';
      this.picErrorTip = false;
      this.showPicFlag = false;
      this.finalImgList = [];
    },
    uploadZip(eve) {
      let files = eve.target.files;
      this.handleFile(files[0]);
      if (!this.showPicFlag) {
        this.showPicFlag = true;
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
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    handleFile(f) {
      if (f) {
        let _this = this;
        let filesType = f.type;
        let fileTypeName = f.name;
        let reg = /(\w+).(png|jpg|jpeg|gif)/;
        let regName = /.*\.zip$/;
        _this.fileShowName = fileTypeName;
        if (filesType != 'application/zip' && !regName.test(fileTypeName)) {
          _this.picErrorTip = true;
          _this.labelShowBox = false;
          _this.$refs.fileInput.value = '';
          _this.finalImgList = [];
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
            if (_this.checkZipClass(imgData) === false) {
              _this.picErrorTip = true;
              _this.showPicFlag = false;
              _this.finalImgList = [];
              throw new Error('error');
            }
            if (imgData) {
              let zipPicLength = Object.keys(imgData).length;
              let zipPicEven = zipPicLength % 4;
              let reg = /.png|jpe?g|gif/;
              let imgDataNew = {};
              if (!zipPicLength) {
                _this.picErrorTip = true;
                _this.showPicFlag = false;
                throw new Error('error');
              }
              if (zipPicEven) {
                _this.picErrorTip = true;
                _this.showPicFlag = false;
                throw new Error('error');
              }
              Object.keys(imgData).forEach(function(item) {
                let keyName = item.replace(reg, '');
                imgDataNew[keyName] = imgData[item];
              });
              let containerList = [];
              const zipImgNames = Object.keys(imgDataNew);
              let zipWaitingHandleImgsNum = zipImgNames.length;

              // 校验zip包名称
              for (let i = 0; i < zipImgNames.length; i++) {
                if (iconKeyList.indexOf(zipImgNames[i]) == -1) {
                  _this.picErrorTip = true;
                  _this.showPicFlag = false;
                  throw new Error('zip包名称不正确');
                }
              }

              for (let i = 0; i < iconList.length; i++) {
                if (zipWaitingHandleImgsNum ===0 ) {
                  break;
                }
                let iconItem = iconList[i];
                const pairKeyArr = Object.keys(iconItem);
                let count = 0;

                for (let index = 0, len = pairKeyArr.length; index < len; index++) {
                  const picName = pairKeyArr[index];

                  if (zipImgNames.indexOf(picName) > -1) {
                    iconItem[picName].url = imgDataNew[picName];
                    count++;
                  }
                }
                if (count === 4) {
                  containerList.push({
                    ...iconItem
                  });
                } else if(count !== 0) {
                  _this.picErrorTip = true;
                  _this.showPicFlag = false;
                  throw new Error('error');
                }
                zipWaitingHandleImgsNum -= count;
              }

              _this
                .checkImgSize(containerList)
                .then(value => {
                  let finalImgDefault = [];
                  let finalImgSelect = [];
                  _this.finalImgList = [..._this.finalImgList];
                  if (_this.finalImgList.length) {
                    let finalImgListNew = _this.finalImgList;
                    for (let index = 0; index < finalImgListNew.length; index++) {
                      for (let key in finalImgListNew[index]) {
                        if (key.indexOf('_s_') > -1) {
                          finalImgSelect.push(finalImgListNew[index][key].url);
                        } else {
                          finalImgDefault.push(finalImgListNew[index][key].url);
                        }
                      }
                    }
                  }
                  _this.finalImgDefault = finalImgDefault;
                  _this.finalImgSelect = finalImgSelect;
                  _this.picShowList = value;
                  _this.showPicFlag = true;
                  _this.picErrorTip = false;
                  _this.uploadFileZip();
                })
                .catch(error => {
                  console.log(error, 'error');
                });
            }
          })
          .catch(error => {
            console.log(error, 'error');
          });
      }
    },
    checkZipClass(picList) {
      for (let i in picList) {
        if (i.indexOf('/') >= 0) {
          return false;
        }
      }
    },
    checkImgSize(imgObjList) {
      let _this = this;
      let imgListShow = [];
      _this.finalImgList = [];
      imgObjList.map((imgObj, index) => {
        for (let key in imgObj) {
          imgListShow.push(
            new Promise((resolve, reject) => {
              let image = new Image();
              image.onload = function() {
                let { width, height } = this;
                if (width != imgObj[key].width || height != imgObj[key].height) {
                  _this.picErrorTip = true;
                  _this.showPicFlag = false;
                  reject('error');
                } else {
                  if (_this.finalImgList[index]) {
                    _this.finalImgList[index][key] = imgObj[key];
                  } else {
                    _this.finalImgList[index] = {};
                    _this.finalImgList[index][key] = imgObj[key];
                  }
                  resolve();
                }
              };
              image.src = imgObj[key].url;
            })
          );
        }
      });

      return Promise.all(imgListShow);
    }
  }
};
</script>

<style scoped>
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
.errorTips {
  color: red;
  font-size: 12px;
  position: relative;
  top: -15px;
  left: -74px;
}
.imgShow {
  display: flex;
}
.imgDefault {
  margin-right: 20px;
}
</style>

