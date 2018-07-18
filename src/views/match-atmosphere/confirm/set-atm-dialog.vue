<template>
  <sn-confirm title="创建氛围" txt :flag="matchFlag">
    <sn-form ref="commonFloor" :model="editFloorInfo" :rules="floorRules" label-width="140px">
      <act-name :activityName.sync="activityName"></act-name>
      <time-range :startTime.sync="startTime" :endTime.sync="endTime"></time-range>
       <span class="errorTips" v-if="showError">{{ errorMsg }}</span>
      <div class="colorBox">
        <span class="setColorStyle">文字颜色（包含顶部icon）</span>
        <div class="setColor">
          <sn-form-item label="顶标题默认">
            <sn-color-picker v-model="fontColors.topTitle"></sn-color-picker>
          </sn-form-item>
          <sn-form-item label="顶标题选中">
            <sn-color-picker v-model="fontColors.topTitleChoose"></sn-color-picker>
          </sn-form-item>
        </div>
        <div class="setColor">
          <sn-form-item label="底标题默认">
            <sn-color-picker v-model="fontColors.botTitle"></sn-color-picker>
          </sn-form-item>
          <sn-form-item label="底标题选中">
            <sn-color-picker v-model="fontColors.botTitleChoose"></sn-color-picker>
          </sn-form-item>
        </div>
        <div class="setColor">
          <sn-form-item label="搜索框放大镜">
            <sn-color-picker v-model="fontColors.searchfont"></sn-color-picker>
          </sn-form-item>
          <sn-form-item label="搜索框内背景">
            <sn-color-picker v-model="fontColors.searchBg"></sn-color-picker>
          </sn-form-item>
          <sn-form-item label="搜索框默认字">
            <sn-color-picker v-model="fontColors.searchDefault"></sn-color-picker>
          </sn-form-item>
        </div>
      </div>
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
        <div>
          <div style="display: flex">
            <div>
              <ul v-if="labelShowBox">
                <li class="labelTips">默认</li>
                <li class="labelTips">选中</li>
              </ul>
            </div>
            <div>
              <ul style="display:flex">
                <li v-for="item in tabnArrayLast" :key="item">
                  <img :src="item" width="60px" height="60px">
                </li>
              </ul>
              <ul style="display:flex">
                <li v-for="item in tabsArrayLast" :key="item">
                  <img :src="item" width="60px" height="60px">
                </li>
              </ul>
              <ul style="display:flex" v-if="labelShowBox">
                <li class="labelShow">首页</li>
                <li class="labelShow">直播</li>
                <li class="labelShow">社区</li>
                <li class="labelShow">数据</li>
                <li class="labelShow">我的</li>
              </ul>
            </div>

          </div>
          <div style="display:flex" v-if="labelShowBox">
            <ul>
              <li style="height: 50px;line-height:50px;margin-right:5px;">顶部背景</li>
              <li style="height: 50px;line-height:50px;margin-right:5px;">底部背景</li>
            </ul>
            <ul v-if="labelShowBox">
              <li>
                <img :src="bgArrayLast[0]" width="300px" height="50px" />
              </li>
              <li>
                <img :src="bgArrayLast[1]" width="300px" height="50px" />
              </li>
            </ul>
          </div>
          <div style="display:flex" v-if="labelShowBox">
            <ul>
              <li style="height: 50px;line-height:50px;margin-right:5px;">搜索框背景</li>
            </ul>
            <ul v-if="labelShowBox">
              <li v-for="item in imgFabLast" :key="item">
                <img :src="item" width="300px" height="50px">
              </li>
            </ul>
          </div>
        </div>
      </sn-form-item>
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
import * as Constant from 'js/constant'
import JSZip from 'jszip'
import DI from 'interface'
import ActName from './form-items/act-name'
import TimeRange from './form-items/time-range'

export default {
  name: 'SetAtmDialog',
  props: ['matchFlag'],
  components: {
    ActName,
    TimeRange,
  },
  data () {
    return {
      showError: false,
      errorMsg: '',
      fontColors: {
        topTitle: '',
        topTitleChoose: '',
        botTitle: '',
        botTitleChoose: '',
        searchfont: '',
        searchBg: '',
        searchDefault: ''
      },
      picErrorTip: false,
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
      activityName: '',
      imgList: [],
      tabsArrayLast: [],
      tabnArrayLast: [],
      bgArrayLast: [],//最终的数据与默认文案位置相反了，用索引取值
      imgFabLast: [],
      fileShowName: '',
      bgArray: ['bg_titlebar', 'bg_tabbar'],
      imgFab: ['bg_search'],
      startTime: '',
      endTime: '',
      labelShowBox: false,
      showPicFlag: false
    }
  },
  computed: {

  },
  methods: {
    uploadZip (eve) {
      let files = eve.target.files;
      this.handleFile(files[0]);
      if (!this.showPicFlag) {
        this.showPicFlag = true;
      }
    },
    uploadFileZip () {
      this.$ajax({
        url: DI.atmosphere.uploadFileZip,
        processData: false,
        contentType: false,
        data: new FormData(this.$refs.formfile),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: (res) => {
          if (res.retCode == '0') {
            this.skinDownloadUrl = res.data.urlPic || '';

          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      })
    },
    handleFile (f) {
      if (f) {
        let _this = this;
        let filesType = f.type;
        let fileTypeName = f.name;
        let reg = /(\w+).(png|jpg|jpeg|gif)/;
        let regName = /.*\.zip$/;
        _this.fileShowName = fileTypeName;
        if (filesType != "application/zip" && !regName.test(fileTypeName)) {
          _this.picErrorTip = true;
          _this.cancelImg();
          _this.labelShowBox = false;
          _this.cancelImg();
          _this.$refs.fileInput.value = '';
          return;
        }
        JSZip.loadAsync(f).then(function (zip) {
          let re = /(.jpg|.png|.gif|.ps|.jpeg)$/;
          let promises = Object.keys(zip.files).filter(function (fileName) {
            return re.test(fileName.toLowerCase());
          }).map(function (fileName) {
            let file = zip.files[fileName];
            return file.async("blob").then(function (blob) {
              return [
                fileName,
                URL.createObjectURL(blob)
              ];
            });
          });
          return Promise.all(promises);
        }).then(function (result) {
          return result.reduce(function (acc, val) {
            acc[val[0]] = val[1];
            return acc;
          }, {});
        }).then(function (imgData) {
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

        })
      }
    },
    checkUrl () {
      let reg = /^https?:\/\/\w+\.\w+/;
      if (!reg.test(this.jumpUrl)) {
        this.$message.warning( 'URL地址不正确');
        return;
      }
    },
    groupArray (checkArray, imgObjList, cb) {
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
        checkFlag = array.concat(imgFab).sort().toString() === checkArray.sort().toString();
      } else {
        checkFlag = false;
      }
      if (checkFlag) {
        groupArrObj = checkArrayLen === 12 ? { tabsArray, tabnArray, bgArray } : { tabsArray, tabnArray, bgArray, imgFab };
        this.checkImgSize(imgObjList).then(function (flag) {
          if (flag) {
            typeof cb === 'function' && cb(groupArrObj);
          }
        }).catch(function (flag) {
          typeof cb === 'function' && cb(false);
        });
      } else {
        typeof cb === 'function' && cb(false);
      }
    },
    cb (tips) {
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
          groupList.bgArray.forEach(function (tItem) {
            Object.keys(imgData).forEach(function (item) {
              if (item.indexOf(tItem) >= 0) {
                _this.bgArrayLast.push(imgData[item])
              }
            })
          })
        }
        if (groupList.tabsArray) {
          groupList.tabsArray.forEach(function (tItem) {
            Object.keys(imgData).forEach(function (item) {
              if (item.indexOf(tItem) >= 0) {
                _this.tabsArrayLast.push(imgData[item])
              }
            })
          })
        }
        if (groupList.tabnArray) {
          groupList.tabnArray.forEach(function (tItem) {
            Object.keys(imgData).forEach(function (item) {
              if (item.indexOf(tItem) >= 0) {
                _this.tabnArrayLast.push(imgData[item])
              }
            })
          })
        }
        if (groupList.imgFab) {
          groupList.imgFab.forEach(function (tItem) {
            Object.keys(imgData).forEach(function (item) {
              if (item.indexOf(tItem) >= 0) {
                _this.imgFabLast.push(imgData[item])
              }
            })
          })
        }
        _this.labelShowBox = true;
        _this.uploadFileZip();
      }
    },
    checkZipClass (picList) {
      for (let i in picList) {
        if (i.indexOf('/') >= 0) {
          return false;
        }
      }
    },
    checkImgSize (imgObjList = {}) {
      let _this = this;
      let promises = [];

      Object.keys(imgObjList).map((key, index) => {
        promises.push(new Promise((resolve, reject) => {
          let image = new Image();
          let checkSize = getImgWidth(key);
          image.onload = function () {
            let { width, height } = this;
            if (width != checkSize.width || height != checkSize.height) {
              reject(key);
            } else {
              resolve(key);
            }
          }
          image.src = imgObjList[key]
        }))
      });
      return Promise.all(promises);

      function getImgWidth (key) {
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
    cancelBtn () {
      this.$refs.fileInput.value = '';
      this.$emit('update:matchFlag', false);
      this.imgList = [];
      this.tabsArrayLast = [];
      this.tabnArrayLast = [];
      this.bgArrayLast = [];
      this.imgFabLast = [];
      this.activityName = '';
      this.errorMsg = '';
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
      }
    },
    cancelImg () {
      this.tabsArrayLast = [];
      this.tabnArrayLast = [];
      this.bgArrayLast = [];
      this.imgFabLast = [];
      this.labelShowBox = false;
      this.skinDownloadUrl = '';
    },
    saveBtn() {
      this.errorMsg = '';
      const { fontColors }  = this;
      if (!this.activityName) {
        this.$message.warning( '请输入活动名称');
        return;
      }
      if (!this.startTime || !this.endTime) {
        this.$message.warning( '请选择氛围时间');
        return;
      }
      if (this.startTime === this.endTime) {
        this.$message.warning( '开始时间与结束时间不可一致');
        return;
      }
      if(this.startTime > this.endTime){
        this.showError = true;
        this.errorMsg = '氛围结束时间必须大于开始时间';
        return;
      }
      if (!fontColors.topTitle) {
        this.$message.warning('请设置顶标题默认颜色');
        return;
      }
      if (!fontColors.topTitleChoose) {
        this.$message.warning('请设置顶标题选中颜色');
        return;
      }
      if (!fontColors.botTitle) {
        this.$message.warning('请设置底标题默认颜色');
        return;
      }
      if (!fontColors.botTitleChoose) {
        this.$message.warning('请设置底标题选中颜色');
        return;
      }
      if (!fontColors.searchfont) {
        this.$message.warning('请设置搜索框放大镜颜色');
        return;
      }
      if (!fontColors.searchBg) {
        this.$message.warning('请设置搜索框内背景颜色');
        return;
      }
      if (!fontColors.searchDefault) {
        this.$message.warning('请设置搜索框默认字颜色');
        return;
      }
      if (!this.skinDownloadUrl) {
        this.$message.warning('请上传正确的zip包');
        return;
      }
      this.matchFlag = false;
      this.$ajax({
        url: DI.atmosphere.publish,
        data: JSON.stringify({
          activityName: this.activityName,
          activityType: 1,
          endTime: this.endTime,
          skinDownloadUrl: this.skinDownloadUrl,
          startTime: this.startTime,
          searchBarColor: '{"magnifier":'+JSON.stringify(this.fontColors.searchfont.hex)+',"background":'+JSON.stringify(this.fontColors.searchBg.hex)+',"defaultChar":'+JSON.stringify(this.fontColors.searchDefault.hex)+'}',
          bottomTitleColor: '{"selectedColor":'+JSON.stringify(this.fontColors.botTitleChoose.hex)+',"unselectColor":'+JSON.stringify(this.fontColors.botTitle.hex)+'}',
          topTitleColor: '{"selectedColor":'+JSON.stringify(this.fontColors.topTitleChoose.hex)+',"unselectColor":'+JSON.stringify(this.fontColors.topTitle.hex)+'}'
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        delay: 1000,
        success: (res) => {
          if (res.retCode == '0') {
            this.matchFlag = false;
            this.$parent.queryList();
            this.cancelBtn();
          } else {
            this.$message.error(res.retMsg);
            this.matchFlag = true;
          }
        },
        error: () => {
          console.log("error");
        }
      })
    },
  },
};
</script>

<style scoped>
.setColorStyle {
  color: #999;
  font-size: 14px;
  display: flex;
  padding: 0 0 8px 58px;
}
.setColor {
  display: flex;
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
.errorTips {
  color: red;
  font-size: 12px;
  position: relative;
  top: -15px;
  left: -74px;
}
.labelTips {
  height: 62px;
  line-height: 62px;
}
.labelShow {
  width: 60px;
}
.form-item{
  margin-bottom: 10px!important;
}
.colorBox{
  position: relative;
  top: -10px;
}
</style>

