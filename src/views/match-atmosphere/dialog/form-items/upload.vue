<template>
  <sn-form-item label="上传素材" prop="skinDownloadUrl" rules="">
    <div style="width: 350px;text-align:left">
      <form enctype="multipart/form-data" ref="formfile">
        <a href="javascript:;" class="file">
          选择文件
          <input type="file" id="file" ref="fileInput" name="file" multiple @change="handleFileChange">
        </a>
        <span style="position: relative;top: -10px;">{{ruleForm.fileName}}</span>
      </form>
    </div>
  </sn-form-item>
</template>
<script>
import JSZip from 'jszip';

export default {
  name: 'Uplaod',
  props: ['ruleForm'],
  data() {
    return {
      tabsArray: ['tab1_s', 'tab2_s', 'tab3_s', 'tab4_s', 'tab5_s'],
      tabnArray: ['tab1_n', 'tab2_n', 'tab3_n', 'tab4_n', 'tab5_n'],
      tabsImgSize: {
        width: 160,
        height: 160
      },
      tab3sImgSize: {
        width: 288,
        height: 126
      },
      tab3nImgSize: {
        width: 222,
        height: 96
      },
      tabnImgSize: {
        width: 84,
        height: 84
      },
      bgTitleImgSize: {
        width: 1125,
        height: 264
      },
      bgTabImgSize: {
        width: 1125,
        height: 249
      },
      fabImgSize: {
        width: 1125,
        height: 111
      },
      imgDataCb: '',
      imgList: [],
      tabsArrayLast: [],
      tabnArrayLast: [],
      bgArrayLast: [], //最终的数据与默认文案位置相反了，用索引取值
      imgFabLast: [],
      fileShowName: '',
      bgArray: ['bg_titlebar', 'bg_tabbar'],
      imgFab: ['bg_search']
    };
  },
  methods: {
    handleFileChange(e) {
      let files = eve.target.files;
      let f = files[0];
      if (f) {
        let _this = this;
        let filesType = f.type;
        let fileTypeName = f.name;
        let reg = /(\w+).(png|jpg|jpeg|gif)/;
        let regName = /.*\.zip$/;
        _this.fileShowName = fileTypeName;
        if (filesType != 'application/zip' && !regName.test(fileTypeName)) {
          _this.picErrorTip = true;
          _this.cancelImg();
          _this.labelShowBox = false;
          _this.cancelImg();
          _this.$refs.fileInput.value = '';
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
      }
    },
    groupArray(checkArray, imgObjList, cb) {
      let checkArrayLen = checkArray.length;
      let checkFlag = false;
      let tabsArray = this.tabsArray;
      let tabnArray = this.tabnArray;
      let bgArray = this.bgArray;
      let imgFab = this.imgFab;
      let array = this.tabsArray.concat(tabnArray, bgArray).sort();
      let groupArrObj = {};
      if (checkArrayLen === 12) {
        checkFlag = array.sort().toString() === checkArray.sort().toString();
      } else if (checkArrayLen === 13) {
        checkFlag =
          array
            .concat(imgFab)
            .sort()
            .toString() === checkArray.sort().toString();
      } else {
        checkFlag = false;
      }
      if (checkFlag) {
        groupArrObj = checkArrayLen === 12 ? { tabsArray, tabnArray, bgArray } : { tabsArray, tabnArray, bgArray, imgFab };
        this.checkImgSize(imgObjList)
          .then(function(flag) {
            if (flag) {
              typeof cb === 'function' && cb(groupArrObj);
            }
          })
          .catch(function(flag) {
            typeof cb === 'function' && cb(false);
          });
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
        _this.picErrorTip = false;
        _this.cancelImg();
        let groupList = tips;
        if (groupList.bgArray) {
          groupList.bgArray.forEach(function(tItem) {
            Object.keys(imgData).forEach(function(item) {
              if (item.indexOf(tItem) >= 0) {
                _this.bgArrayLast.push(imgData[item]);
              }
            });
          });
        }
        if (groupList.tabsArray) {
          groupList.tabsArray.forEach(function(tItem) {
            Object.keys(imgData).forEach(function(item) {
              if (item.indexOf(tItem) >= 0) {
                _this.tabsArrayLast.push(imgData[item]);
              }
            });
          });
        }
        if (groupList.tabnArray) {
          groupList.tabnArray.forEach(function(tItem) {
            Object.keys(imgData).forEach(function(item) {
              if (item.indexOf(tItem) >= 0) {
                _this.tabnArrayLast.push(imgData[item]);
              }
            });
          });
        }
        if (groupList.imgFab) {
          groupList.imgFab.forEach(function(tItem) {
            Object.keys(imgData).forEach(function(item) {
              if (item.indexOf(tItem) >= 0) {
                _this.imgFabLast.push(imgData[item]);
              }
            });
          });
        }
        _this.labelShowBox = true;
        _this.uploadFileZip();
      }
    },
    checkZipClass(picList) {
      for (let i in picList) {
        if (i.indexOf('/') >= 0) {
          return false;
        }
      }
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
        if (/tab\d_s/.test(key)) {
          checkSize = key.indexOf('3') < 0 ? _this.tabsImgSize : _this.tab3sImgSize;
        } else if (/tab\d_n/.test(key)) {
          checkSize = key.indexOf('3') < 0 ? _this.tabnImgSize : _this.tab3nImgSize;
        } else if (key.indexOf('bg_titlebar') >= 0) {
          checkSize = _this.bgTitleImgSize;
        } else if (key.indexOf('bg_tabbar') >= 0) {
          checkSize = _this.bgTabImgSize;
        } else if (key.indexOf('bg_search') >= 0) {
          checkSize = _this.fabImgSize;
        }
        return checkSize;
      }
    },
    cancelBtn() {
      this.$refs.fileInput.value = '';
      this.$emit('update:matchFlag', false);
      this.imgList = [];
      this.tabsArrayLast = [];
      this.tabnArrayLast = [];
      this.bgArrayLast = [];
      this.imgFabLast = [];
      this.activityName = '';
      this.startTime = '';
      this.endTime = '';
      this.labelShowBox = false;
      this.fileShowName = '';
      this.picErrorTip = false;
      this.showPicFlag = false;
      this.fontColors = {
        topTitle: '',
        topTitleChoose: '',
        botTitle: '',
        botTitleChoose: '',
        searchfont: '',
        searchBg: '',
        searchDefault: ''
      };
    },
    cancelImg() {
      this.tabsArrayLast = [];
      this.tabnArrayLast = [];
      this.bgArrayLast = [];
      this.imgFabLast = [];
      this.labelShowBox = false;
      this.skinDownloadUrl = '';
    }
  }
};
</script>
