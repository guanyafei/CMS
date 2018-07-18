<template>
  <sn-confirm title="创建直播浮层" txt :flag="matchLiveFlag">
    <sn-form ref="commonFloor" :model="editFloorInfo" :rules="floorRules" label-width="140px" formWidth="600">
      <act-name :activityName.sync="activityName"></act-name>
      <sn-form-item label="跳转类型" prop="resource">
        <sn-select v-model="jumpType" radius="6" width="410" @change="handleProductVal">
          <sn-option name="请选择" :value="0">请选择</sn-option>
          <sn-option v-for="item in gotoUrlList" :name="item.name" :value="item.value" :key="item.value" :disabled="item.disabled"></sn-option>
        </sn-select>
      </sn-form-item>
      <sn-form-item v-if="programShow" label="节目ID" prop="resource">
        <sn-input v-model="matchitemShowId" placeholder="请输入节目ID" inputType="number" width="410" @blur="quyeryMatchitem"></sn-input>
      </sn-form-item>
      <sn-form-item v-if="jumpUrlShow" label="URL地址" prop="resource">
        <sn-input v-model="jumpUrl" placeholder="请输入URL地址" width="410" @blur="checkUrl"></sn-input>
      </sn-form-item>
      <sn-form-item v-if="programShow" label="节目信息">
        <sn-input width="410" v-model="matchItemInfo.matchDes" disabled></sn-input>
      </sn-form-item>
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
        <div>
          <div style="display:flex" v-if="labelShowBox">
            <ul>
              <li style="height: 50px;line-height:50px;margin-right:5px;">直播列表浮层</li>
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
        <sn-button size="mini" type="primary" @click="saveLiveBtn">发布</sn-button>
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
  name: 'SetLiveDialog',
  props: ['matchLiveFlag'],
  components: {
    ActName,
    TimeRange,
  },
  data () {
    return {
      showError:false,
      errorMsg:'',
      activityName: '',
      startTime: '',
      endTime: '',
      gotoUrlList: [{
        key: 'act',
        value: 1,
        name: '节目ID'
      },
      {
        key: 'address',
        value: 2,
        name: '内链'
      },
      {
        key: 'outline',
        value: 3,
        name: '外链'
      },
      {
        key: 'router',
        value: 4,
        name: '路由地址'
      }],
      programShow: false,
      jumpUrlShow: false,
      jumpType: 0,
      jumpUrl: '',
      matchItemInfo: {
        matchDes: '',
        matchTime: ''
      },
      fabImgSize: {
        width: 900,
        height: 210
      },
      imgFab: ['img_fab'],
      imgFabLast: [],
      labelShowBox: false,
      skinDownloadUrl: '',
      showPicFlag: false,
      fileShowName: '',
      picErrorTip: false,
      matchitemShowId: ''
    }
  },
  computed: {

  },
  methods: {
    cancelBtn () {
      this.jumpType = 0;
      this.$nextTick().then(() => {
        this.$refs.fileInput.value = '';
        this.programShow = false;
        this.jumpUrlShow = false;
        this.showPicFlag = false;
        this.picErrorTip = false;
        this.activityName = '';
        this.startTime = '';
        this.endTime = '';
        this.fileShowName = '';
        this.jumpUrl = '';
        this.matchitemShowId = '';
        this.matchItemInfo = {
          matchDes: '',
          matchTime: ''
        };
        this.$emit('update:matchLiveFlag', false);
      })
    },
    saveLiveBtn () {
      this.errorMsg = '';
      let _this = this;
      let reg = /^https?:\/\/\w+\.\w+/;
      let regRouter = /^pptvsports:\/\/[^\s]+$/;
      if (!this.activityName) {
        this.$message.warning('请输入活动名称');
        return;
      }
      if(!this.jumpType) {
        this.$message.warning('请选择跳转类型');
        return;
      }
      if (this.jumpType != 1) {
        this.matchitemShowId = null;
      }
      if (this.programShow) {
        if (!this.matchitemShowId) {
          this.$message.warning('节目ID不可为空');
          return;
        }
      }
      if (this.jumpUrlShow) {
        if (!this.jumpUrl) {
          this.$message.warning('URL地址不可为空');
          return;
        } else {
          if (this.jumpType == 4) {
            if (!regRouter.test(this.jumpUrl)) {
              this.$message.warning('URL地址不正确');
              return;
            }
          } else if (!reg.test(this.jumpUrl)) {
            this.$message.warning('URL地址不正确');
            return;
          }
        }
      }
      if (!this.startTime || !this.endTime) {
        this.$message.warning('请选择氛围时间');
        return;
      }
      if (this.startTime === this.endTime) {
        this.$message.warning('开始时间与结束时间不可一致');
        return;
      }
      if(this.startTime > this.endTime){
        this.showError = true;
        this.errorMsg = '氛围结束时间必须大于开始时间';
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
          activityType: 2,
          endTime: this.endTime,
          jumpType: this.jumpType,
          jumpUrl: this.jumpUrl,
          matchInfo: this.matchItemInfo.matchDes,
          matchTime: this.matchItemInfo.matchTime,
          programId: this.matchitemShowId,
          skinDownloadUrl: this.skinDownloadUrl,
          startTime: this.startTime,
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        delay: 1000,
        success: (res) => {
          if (res.retCode == '0') {
            this.matchFlag = false;
            this.$parent.queryList();
            _this.cancelBtn();
          } else {
            this.$message.error(res.retMsg);;
            // _this.cancelBtn();
             _this.matchLiveFlag = true;
          }
        },
        error: () => {
          console.log("error");
        }
      })
    },
    handleProductVal (code) {
      this.jumpType = code;
      if (code == 0) {
        this.programShow = false;
        this.jumpUrlShow = false;
      }else if (code == 1) {
        this.programShow = true;
        this.jumpUrlShow = false;
        this.jumpUrl = '';
      } else {
        this.matchItemInfo.matchDes = '';
        this.matchItemInfo.matchTime = '';
        this.matchitemShowId = '';
        this.jumpUrlShow = true;
        this.programShow = false;
        this.jumpUrl = '';
      }
    },
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
    groupArray (checkArray, imgObjList) {
      let _this = this;
      let checkArrayLen = checkArray.length;
      let checkFlag = false;
      let groupArrObj = {};
      let imgData = _this.imgDataCb;
      if (checkArrayLen == 1) {
        groupArrObj = this.imgFab;
        this.checkImgSize(imgObjList).then(function (flag) {
          if (flag) {
            _this.picErrorTip = false;
            _this.cancelImg();
            if (groupArrObj) {
              groupArrObj.forEach(function (tItem) {
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
        }).catch(function (flag) {
          _this.picErrorTip = true;
          _this.cancelImg();
        });
      } else {
        _this.picErrorTip = true;
        _this.cancelImg();
      }
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
          _this.groupArray(imgNameNew, imgData);

        })
      }
    },
    checkUrl () {
      let reg = /^https?:\/\/\w+\.\w+/;
      let regRouter = /^pptvsports:\/\/[^\s]+$/;
      if (this.jumpType == 4) {
        if (!regRouter.test(this.jumpUrl)) {
          this.$message.warning('URL地址不正确');
          return;
        }
      } else {
        if (!reg.test(this.jumpUrl)) {
          this.$message.warning('URL地址不正确');
          return;
        }

      }    },
    cancelImg () {
      this.imgFabLast = [];
      this.labelShowBox = false;
      this.skinDownloadUrl = '';
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
          let checkSize = _this.fabImgSize;
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
    },
    quyeryMatchitem () {
      this.$ajax({
        url: DI.atmosphere.quyeryMatchitem,
        data: JSON.stringify({
          matchitemShowId: this.matchitemShowId
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: (res) => {
          if (res.retCode == '0') {
            this.matchItemInfo.matchDes = res.data.matchitemShowName;
            this.matchItemInfo.matchTime = res.data.startTime;
          } else {
            if (!this.matchitemShowId) {
              this.$message.warning('节目ID不能为空')
            } else {
              this.$message.error(res.retMsg);
            }
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
</style>

