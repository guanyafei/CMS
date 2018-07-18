<template>
  <div class="container">
    <sn-topbar :title="showData.title" />
    <div class="content-edit">
      <span class="title">内容编辑</span>
      <section class="form-content">
        <sn-form :model="formData" ref="formData" label-width="140px">
          <sn-form-item :label="showData.contentTitle" prop="contentTitle" :rules="titleRules">
            <sn-input
              :placeholder="`请输入${showData.contentTitle}，5-30个字`"
              :maxlength="30"
              :totalWords="30"
              v-model="formData.contentTitle"
              width="640"
              :showWord="true"
            ></sn-input>
          </sn-form-item>
          <sn-form-item v-if="getStyle()" label="展示样式" prop="isBigImg" :rules="isBigImgRules">
            <sn-select
              v-model="formData.isBigImg"
              placeholder="请选择"
              radius="16"
              width="120"
              @change="handleStyle"
            >
              <sn-option v-for="item in styleList" :key="item.id" :name="item.name" :value="item.value"></sn-option>
            </sn-select>
          </sn-form-item>
          <template v-if="contentTypeItem.key!='set'&&contentTypeItem.key!='topic'">
            <sn-form-item v-if="formData.isBigImg!==2" :label="showData.contentCover" prop="contentCover"  :rules="coverRules">
              <sn-cropper
                v-model="formData.contentCover"
                :aspectRatio="aspectRatio"
                :height="aspectRatioHeight"
                width="500"
                ref="cropper"
                label="封面"
                :lib-imglist="formData.listGroup"
                :nolibrary="false"
                :isScoped="!showData.disValidCoverPixel"
              ></sn-cropper>
            </sn-form-item>
            <!-- 三图 -->
            <sn-form-item v-show="formData.isBigImg==2" label="资讯封面" ref="imgList" :rules="threeCoverRules">
              <sn-cropper-three
                :listGroup="formData.listGroup"
                :imgList="formData.imgList"
                :newsId="contentItem.contentId"
                @img-group="imgGroupChange"
                :aspectRatio="aspectRatio"
                aspectWith="255"
                :aspectHeight="255*148/226+''"
                width="200"
                :height="200*148/226+''"
                ref="cropper-three"
                label="封面"
                :nolibrary="contentItem.contentType=='11'"
              ></sn-cropper-three>
              <div class="form-item__error" v-if="imgGroupFlag">请上传图片</div>
            </sn-form-item>
          </template>
          <div>
            <span class="add-tag">添加标签</span>
          </div>
          <sn-form-item label="展示标签">
            <sn-input v-model="formData.showLabel" width="429" :maxlength="2" outputField="value"></sn-input>
          </sn-form-item>
          <sn-form-item
            label="引导语"
            v-if="contentItem.contentType=='6'"
            prop="contentAttachment"
            :rules="contentAttachmentRules"
          >
            <sn-input
              width="429"
              placeholder="请输入引导语"
              :maxlength="25"
              :totalWords="25"
              :showWord="true"
              v-model="formData.contentAttachment"
            ></sn-input>
          </sn-form-item>
        </sn-form>
      </section>
      <div class="btns">
        <sn-button type="primary" @click="addChannel('formData')">保存</sn-button>
        <sn-button @click="cancel">取消</sn-button>
      </div>
    </div>
    <sn-confirm
      title="提示"
      :flag="checkWordConfirm"
      @close="close"
      @sure="sure"
      confirmButtonText="继续保存"
      cancelButtonText="返回检查"
      close-icon
      noflag
    >
      <div class="modal-body">
        <sn-formtip warning>内容中检测出敏感词汇，请慎重检查~</sn-formtip>
        <div class="words">
          <span class="title">敏感词汇：</span>
          <span class="word" v-for="(word, index) in sensitiveMsgList" :key="index">{{word}}</span>
        </div>
      </div>
    </sn-confirm>
  </div>
</template>

<script>
import DI from 'interface';
import * as Constant from 'js/constant';
import { getImgPixelSize } from 'src/utils/image-operate';

export default {
  props: {
    contentItem: {
      type: [String, Object],
      default: function() {
        return {};
      }
    }
  },
  data() {
    let contentItem = this.contentItem;
    return {
      tagList: [],
      styleList: [
        {
          name: '小图',
          id: 0,
          value: 0
        },
        {
          name: '大图',
          id: 1,
          value: 1
        }
      ],
      showData: {
        title: '',
        contentTitle: '',
        contentCover: '',
        disValidCoverPixel: false
      },
      formData: {
        contentAttachment: contentItem.contentAttachment || '',
        contentTitle: '',
        contentCover: '',
        showLabel: '',
        isBigImg: 0,
        imgList: {
          img1: '',
          img2: '',
          img3: ''
        },
        listGroup: []
      },
      imgGroupFlag: false,
      sensitiveMsgList: [],
      checkWordConfirm: false, //敏感词提示弹框
      isChannelDes: true
    };
  },
  computed: {
    aspectRatio() {
      let picStyle = this.formData.isBigImg;
      if (picStyle == 1) {
        return 694 / 390;
      }
      return 226 / 148;
    },
    aspectRatioHeight() {
      return 500 / this.aspectRatio;
    },
    titleRules() {
      return [
        {
          required: true,
          message: `请输入${this.showData.contentTitle}`,
          trigger: 'change'
        },
        {
          min: 5,
          max: 30,
          message: '长度在 5 到 30 个字符',
          trigger: 'blur'
        }
      ];
    },
    coverRules() {
      let singleCoverValidator = (rule, value, callback) => {
        if (this.showData.disValidCoverPixel || this.isGifUrl(value)) {
          callback();
        } else {
          getImgPixelSize(value,false)
            .then(() => {
              callback();
            })
        }
      };
      return [
        {
          required: true,
          message: '请设置封面',
          trigger: 'change'
        },
        {
          validator: singleCoverValidator,
          trigger: 'submit'
        }
      ];
    },
    threeCoverRules() {
      return [
        {
          required: true,
          message: '请设置封面',
          trigger: 'change'
        }
      ];
    },
    isBigImgRules() {
      return [
        {
          required: true,
          type: 'number',
          message: '请选择展示样式',
          trigger: 'change'
        }
      ];
    },
    contentAttachmentRules() {
      return [
        {
          required: true,
          message: '请输入引导语',
          trigger: 'change'
        }
      ];
    },
    contentTypeItem() {
      return Constant.getItemByValue(Constant.CONTENT_CELL_TYPES, this.contentItem.contentType || '');
    }
  },
  mounted() {
    this.queryImgList();
    this.formData.isBigImg = this.contentItem.isBigImg || 0;
    this.formData.contentTitle = this.contentItem.contentTitle || '';
    this.formData.showLabel = this.contentItem.showLabel || '';
    this.init();

    // 频道有PP号 专题没有
    // 1.图文资讯 2.图集资讯 3.视频资讯 8.日报 9.PP号
    if (this.contentItem.isBigImg == 2) {
      this.styleList.push({
        name: '三图',
        id: 2,
        value: 2
      });
    } else {
      switch (this.contentItem.contentType) {
        case '1':
        case '2':
        case '8':
        case '9':
        case '11':
          this.styleList.push({
            name: '三图',
            id: 2,
            value: 2
          });
          break;
        default:
          break;
      }
    }

    if (this.formData.isBigImg == 2) {
      let coverNewArr = this.contentItem.contentCover ? this.contentItem.contentCover.split(';') : [];
      this.formData.imgList = {
        img1: coverNewArr[0] || '',
        img2: coverNewArr[1] || '',
        img3: coverNewArr[2] || ''
      };
    } else {
      this.formData.contentCover = this.contentItem.contentCover || '';
    }

    // 图集资讯没有大小图设置
    if (this.contentItem.newsType == '2') {
      this.styleList.splice(0, 2);
    }

    window.scrollTo(0, 0);
  },
  methods: {
    isGifUrl(url) {
      return /.*.gif(\?.*)?$/.test(url);
    },
    getStyle() {
      return !(this.contentItem.contentType == '5' || this.contentItem.contentType == '6' || this.contentItem.contentType == '7');
    },
    init() {
      const { contentTypeItem } = this;
      const curText = contentTypeItem.name;
      this.showData.title = curText + '编辑';
      this.showData.contentTitle = curText + '标题';
      this.showData.contentCover = curText + '封面';
      this.showData.disValidCoverPixel = contentTypeItem.disValidCoverPixel;
    },
    imgGroupChange(imgList) {
      if (imgList.img1 != '' && imgList.img2 != '' && imgList.img3 != '') {
        this.imgGroupFlag = false;
      }
    },
    handleStyle(val) {
      if (this.formData.isBigImg != val) {
        this.formData.isBigImg = val;
        let tempList = this.formData.listGroup;
        if (val == 2) {
          this.formData.imgList = {
            img1: tempList[0] || '',
            img2: tempList[1] || '',
            img3: tempList[2] || ''
          };
        } else {
          this.formData.contentCover = tempList[0] || '';
        }
      }
      this.imgGroupFlag = false;
    },
    addChannel(formData) {
      this.$refs[formData].validate(valid => {
        if (valid) {
          this.checkLimitWords(this.formData.contentTitle);
        } else {
          return false;
        }
      });
    },
    handleImgList(imgList) {
      return imgList.img1 + ';' + imgList.img2 + ';' + imgList.img3;
    },
    cancel() {
      this.$emit('change-view', 'contentList');
    },
    queryImgList() {
      if (this.contentItem.contentType && ['1', '2', '3', '8', '9', '10'].indexOf('' + this.contentItem.contentType) === -1) {
        return;
      }
      this.$ajax({
        url: DI.topic.getNewsInfo,
        data: JSON.stringify({
          newsId: this.contentItem.contentId
        }),
        context: this,
        success: res => {
          let result = res.data || {};
          if (res.retCode == '0') {
            this.formData.listGroup = result.imgList || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {}
      });
    },
    saveAjax() {
      const submitData = this.formData;
      if (
        this.formData.isBigImg == 2 &&
        (this.formData.imgList.img1 == '' || this.formData.imgList.img2 == '' || this.formData.imgList.img3 == '')
      ) {
        this.imgGroupFlag = true;
        return;
      }
      let params = {};
      let getImgWidthPromises = [];
      let coverList = this.formData.isBigImg == 2 ? this.handleImgList(this.formData.imgList) : submitData.contentCover;
      let coverArr = coverList.split(';') || [];
      coverArr.map(coverItem => {
        getImgWidthPromises.push(getImgPixelSize(coverItem, false));
      });
      Promise.all(getImgWidthPromises).then(arr => {
        let imageWidths = arr.reduce((str, item) => {
          if (str) {
            str += `;${item.width}`;
          } else {
            str = `${item.width}`;
          }
          return str;
        }, '');
        params.imageWidths = imageWidths;
        params.contentCover = coverList;
        params.contentTitle = submitData.contentTitle;
        params.id = this.contentItem.relationId;
        params.channelId = this.contentItem.channelId;
        params.isBigImg = submitData.isBigImg;
        params.showLabel = submitData.showLabel;
        // 专题类型
        if (this.contentItem.contentType == 6) {
          params.contentAttachment = submitData.contentAttachment;
        }
        params = this.$bus.deleteNullProperty(params);
        this.$ajax({
          url: DI.topic.modifyContent,
          data: JSON.stringify(params),
          context: this,
          success: res => {
            if (res.retCode == '0') {
              this.$message.success('保存成功');
              setTimeout(() => {
                this.cancel();
              }, 1000);
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.error('error');
          }
        });
      });
    },
    checkLimitWords(param) {
      let _this = this;
      let reg = /\[.*\]/g;
      this.$ajax({
        url: DI.common.checkLimitWords,
        data: JSON.stringify({
          content: param,
          name: ''
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            if (_this.formData.showLabel && _this.isChannelDes) {
              _this.isChannelDes = false;
              _this.checkLimitWords(_this.formData.showLabel);
            } else {
              this.saveAjax();
            }
          } else {
            let sensitiveMsg = reg.exec(res.retMsg)[0];
            this.sensitiveMsgList = JSON.parse(sensitiveMsg);
            this.checkWordConfirm = true;
            this.isChannelDes = true;
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    close() {
      this.checkWordConfirm = false;
    },
    sure() {
      this.saveAjax();
      this.checkWordConfirm = false;
    }
  }
};
</script>
<style scoped>
.container {
  background: #fff;
  .content-edit {
    padding: 10px 18px;
    .title {
      font-size: 14px;
      color: #666666;
      line-height: 20px;
    }
    .form-content {
      padding: 20px 0 30px;
      border-bottom: 1px solid #f0f1f5;
      .form-item {
        padding-left: 40px;
      }
      .add-tag {
        position: relative;
        display: block;
        font-size: 14px;
        color: #666666;
        line-height: 20px;
        margin-top: 20px;
        margin-bottom: 18px;
        &:after {
          content: '';
          position: absolute;
          top: 10px;
          left: 67px;
          right: 5px;
          display: inline-block;
          height: 1px;
          background: #f0f1f5;
        }
      }
      .btn {
        padding-left: 230px;
      }
      .form-item__error {
        color: #ff4949;
        font-size: 12px;
        line-height: 1;
        padding-top: 2px;
        position: absolute;
        top: 100%;
        left: 0;
      }
    }
    .btns {
      padding-left: 85px;
      padding-top: 30px;
      padding-bottom: 50px;
      button + button {
        margin-left: 40px;
      }
    }
  }
}
.modal-body {
  width: 480px;
  .words {
    height: 128px;
    overflow: auto;
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 30px;
    border-radius: 4px;
    font-size: 12px;
    background-color: #f4f6fb;
    .title {
      color: #6e7690;
      font-weight: bold;
    }
    .word {
      display: inline-block;
      padding-right: 15px;
      padding-bottom: 15px;
      color: #f47b77;
    }
  }
}
</style>
