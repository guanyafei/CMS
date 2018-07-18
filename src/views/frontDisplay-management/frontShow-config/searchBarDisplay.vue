<template>
  <div id="list">
    <sn-datatable :data="searchBarList" :border="true">
      <sn-datacolumn label="排序" prop="index" width="10%"></sn-datacolumn>
      <sn-datacolumn label="位置名" prop="positionName" width="10%"></sn-datacolumn>
      <sn-datacolumn label="ICON" prop="icon" width="20%"></sn-datacolumn>
      <sn-datacolumn label="角标" prop="mark" width="10%"></sn-datacolumn>
      <sn-datacolumn label="跳转类型" prop="jumpType" width="10%" :formatter="handleJumpType"></sn-datacolumn>
      <sn-datacolumn label="地址" prop="jumpUrl" width="20%"></sn-datacolumn>
      <sn-datacolumn label="状态" prop="state" width="10%" :formatter="handleConvertStatus"></sn-datacolumn>
      <sn-datacolumn label="操作" prop="opt" width="10%"></sn-datacolumn>
      <template slot-scope="cell" slot="index">{{cell.index + 1}}</template>
      <template slot-scope="cell" slot="icon">
        <img :src="cell.row.icon|smallImage" alt="" width="80" />
      </template>
      <template slot-scope="cell" slot="opt">
        <sn-button type="text" @click="edit(cell.row)">编辑</sn-button>
      </template>
    </sn-datatable>
    <sn-confirm txt ref="searchBarConfirm" title="编辑" :flag="searchBarFlag" @sure="searchBarSure('formData')" @close="searchBarClose" closeIcon confirmButtonText="保存">
      <sn-form :model="formData" ref="formData" label-width="80px" formWidth="400">
        <sn-form-item label="状态" prop="state">
          <sn-radio-group v-model="formData.state">
            <sn-radio :label="1">开启</sn-radio>
            <sn-radio :label="0">关闭</sn-radio>
          </sn-radio-group>
        </sn-form-item>
        <sn-form-item>
          <div class="upload-section">
            <p>
              <span class="img-txt">ICON</span>
              <span class="img-tips">支持PNG格式图片上传,图片大小为1M以内</span>
            </p>
            <div class="form-upload">
              <form enctype="multipart/form-data" ref="formFile">
                <a href="javascript:;" class="file" v-if="uploadFlag">点击上传
                  <input type="file" id="uploadFile" ref="uploadFile" name="uploadFile" @change="handleUpload($event)">
                </a>
                <a :class="{'btn-disabled':isDisabled}" href="javascript:;" class="file" v-if="disableUploadFlag" onclick="return false;">点击上传
                  <input type="file" id="uploadFile" ref="uploadFile" name="uploadFile" @change="handleUpload($event)">
                </a>
                <a href="javascript:;" class="file" v-if="btnUpload">重新上传
                  <input type="file" id="uploadFile" ref="uploadFile" name="uploadFile" @change="handleBackImgChange($event)">
                </a>
                <a :class="{'btn-disabled':isDisabled}" href="javascript:;" onclick="return false;" class="file" v-if="disabledBtnUpload">重新上传
                  <input type="file" id="uploadFile" ref="uploadFile" name="uploadFile" @change="handleBackImgChange($event)">
                </a>

              </form>
              <div class="img-load" v-if="imgLoadFlag">
                <img :src="imgVal" alt="" ref="image" width="200" height="200" /><br />
              </div>
              <p class="formRemindTip" v-if="remindMsgFlag">请上传图片</p>
            </div>
          </div>
        </sn-form-item>
        <sn-form-item label="跳转类型" prop="jumpType">
          <sn-select :disabled="isDisabled" v-model="formData.jumpType" width="288" @change="handleJumpTypeChange">
            <sn-option v-for="item in jumpTypeList" :key="item.key" :name="item.name" :value="item.value"></sn-option>
          </sn-select>
        </sn-form-item>
        <sn-form-item :label="jumpUrlLabel" prop="jumpUrl">
          <sn-input :disabled="isDisabled" v-model="formData.jumpUrl" :placeholder="jumpPlaceHolder" width="288" :reg="regex" :hint="hint" autoValid></sn-input>
        </sn-form-item>
        <sn-form-item label="角标" prop="mark">
          <sn-input :disabled="isDisabled" v-model="formData.mark" placeholder="请输入角标" width="288" :maxlength="3"></sn-input>
        </sn-form-item>
      </sn-form>
    </sn-confirm>
  </div>
</template>
<script>
import * as Constant from 'js/constant';
import DI from 'interface';
import Message from 'components/new-frame/message';
import Http from 'utils/http';
import emitter from 'mixins/emitter';
export default {
  mixins: [emitter],
  data() {
    return {
      disableUploadFlag: false,
      btnUpload: false,
      disabledBtnUpload: false,
      curItem: {},
      isDisabled: false,
      remindMsgFlag: false,
      imgLoadFlag: false,
      imgVal: '',
      contentType: '',
      imgFileSize: '',
      file: '',
      fileName: '',
      uploadFlag: true,
      regex: '',
      hint: '',
      jumpUrlLabel: '',
      jumpPlaceHolder: '',
      jumpTypeList: Constant.JUMP_TYPE_LIST,
      searchBarFlag: false,
      searchBarList: [],
      formData: {
        state: '',
        jumpType: '',
        jumpUrl: '',
        mark: ''
      }
    };
  },
  watch: {
    'formData.jumpType'(newVal, oldVal) {
      if (newVal) {
        const jumpItem = Constant.getItemByValue(this.jumpTypeList, newVal);
        this.jumpUrlLabel = jumpItem.name;
        this.jumpPlaceHolder = jumpItem.placeholder;
        this.regex = jumpItem.reg;
        this.hint = jumpItem.errMsg;
      }
    },
    'formData.state'(newVal) {
      if (newVal == 1) {
        //开启
        if (this.imgVal) {
          this.btnUpload = true;
          this.disabledBtnUpload = false;
        } else {
          this.uploadFlag = true;
          this.disableUploadFlag = false;
        }
        this.isDisabled = false;
      } else {
        if (this.imgVal) {
          this.btnUpload = false;
          this.disabledBtnUpload = true;
        } else {
          this.uploadFlag = false;
          this.disableUploadFlag = true;
        }
        this.remindMsgFlag = false;
        this.isDisabled = true;
      }
    }
  },
  mounted() {
    this.queryList();
  },
  methods: {
    handleBackImgChange(event) {
      this.handleUpload(event);
    },
    handleUpload(event) {
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
          let curSizeStr = isGif ? '2M' : '1M';
          let maxImgSize = this.calSize(curSizeStr);
          let exceedSizeMsg = `图片大小超过${curSizeStr.toUpperCase()}`;
          if (maxImgSize > imgFileSize) {
            file.isGif = isGif;
            _self.fileName = file.name;
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
          _self.$refs.uploadFile.innerText = '';
          Message.error(errMsg);
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
    uploadImg(url) {
      let name = this.fileName;
      Http.ajax({
        url: DI.common.uploadFileBase64,
        context: this,
        loadingText: '正在上传图片，请稍候！',
        data: JSON.stringify({
          base64File: url.substr(13 + this.contentType.length),
          fileName: name.replace(/\s/g, ''),
          contentType: this.contentType
        }),
        success: res => {
          if (res.retCode == '0') {
            Message.success('上传成功!');
            if (this.formData.state) {
              this.btnUpload = true;
              this.disabledBtnUpload = false;
            } else {
              this.disabledBtnUpload = true;
              this.btnUpload = false;
            }
            this.remindMsgFlag = false;
            this.imgLoadFlag = true;
            this.uploadFlag = false;
            this.imgVal = res.data;
            this.dispatch('FormItem', 'form.change', [res.data]);
          } else {
            Message.error(res.retMsg);
          }
        },
        error: error => {
          this.$refs.uploadFile.innerText = '';
          Message.error('网络异常，请联系运维人员！');
        }
      });
    },
    queryList() {
      Http.ajax({
        url: DI.searchBarConfig.queryList,
        data: JSON.stringify({}),
        context: this,
        loadingText: '正在查询搜索栏配置信息,请稍候!',
        success: res => {
          if (res.retCode == '0') {
            this.searchBarList = res.data.list || [];
          } else {
            Message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    handleJumpTypeChange(val) {
      this.formData.jumpType = val;
      this.formData.jumpUrl = '';
    },
    edit(row) {
      if (!row.icon) {
        //无图
        if (!this.formData.state) {
          this.disableUploadFlag = true;
          this.uploadFlag = false;
        } else {
          this.uploadFlag = true;
        }
        this.btnUpload = false;
        this.imgLoadFlag = false;
      } else {
        if (!this.formData.state) {
          // 有图 关闭
          this.btnUpload = false;
          this.disabledBtnUpload = true;
        } else {
          //有图 开启
          this.btnUpload = true;
        }
        this.uploadFlag = false;
        this.imgLoadFlag = true;
      }
      this.curItem = row;
      this.searchBarFlag = true;
      this.formData.mark = row.mark || '';
      this.formData.state = row.state;
      this.imgVal = row.icon;
      this.formData.jumpType = row.jumpType;
      if (!row.jumpUrl) {
        this.jumpPlaceHolder = '请输入url';
        this.jumpUrlLabel = 'url';
      } else {
        this.formData.jumpUrl = row.jumpUrl;
      }
    },
    handleSubmitData() {
      let pms = {
        id: this.curItem.id,
        icon: this.imgVal,
        mark: this.formData.mark || '',
        state: this.formData.state,
        jumpType: this.formData.jumpType,
        jumpUrl: this.formData.jumpUrl
      };
      Http.ajax({
        url: DI.searchBarConfig.save,
        data: JSON.stringify(pms),
        context: this,
        loadingText: '正在保存搜索栏配置信息,请稍候!',
        success: res => {
          if (res.retCode == '0') {
            Message.success('保存成功!');
            this.resetData();
            this.queryList(this.pageIndex);
          } else {
            Message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    searchBarSure(formName) {
      //编辑保存
      if (this.formData.state) {
        //开启
        if (this.imgVal == '') {
          this.remindMsgFlag = true;
          return;
        }
        if (!this.formData.jumpType) {
          this.$message.warning('请选择跳转类型');
          return;
        }
        if (!this.formData.jumpUrl) {
          this.$message.warning('请输入url');
          return;
        }
        this.handleSubmitData();
      } else {
        this.handleSubmitData();
      }
    },
    resetData() {
      //表单重置
      this.formData.jumpUrl = '';
      this.formData.jumpType = '';
      this.formData.mark = '';
      this.uploadFlag = false;
      this.btnUpload = false;
      this.disableUploadFlag = false;
      this.disabledBtnUpload = false;
      this.remindMsgFlag = false;
      this.imgLoadFlag = false;
      this.searchBarFlag = false;
    },
    searchBarClose() {
      this.resetData();
      this.searchBarFlag = false;
    },
    handleJumpType(val) {
      let name = '';
      switch (val) {
        case 1:
          name = '内部页面';
          break;
        case 2:
          name = '内链';
          break;
        case 3:
          name = '外链';
          break;
        default:
          break;
      }
      return name;
    },
    handleConvertStatus(val) {
      return val == 1 ? '开启' : '关闭';
    }
  }
};
</script>
<style scoped>
.form-item {
  margin-bottom: 16px;
}
.upload-section {
  margin-left: -83px;
}
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
  }
  .formRemindTip {
    color: #f00;
    font-size: 12px;
  }
  .img-load p {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.img-txt {
  margin-left: -72px;
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
.btn-disabled {
  cursor: not-allowed;
  color: #333;
  background-color: #f1f1f1;
}
.file input {
  position: absolute;
  font-size: 100px;
  right: 0;
  top: 0;
  opacity: 0;
}
</style>

