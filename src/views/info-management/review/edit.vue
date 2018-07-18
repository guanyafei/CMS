<template>
  <div class="edit">
    <sn-form :model="ruleForm" ref="ruleForm" label-width="80px">
      <fieldset>
        <div class="legend-content">内容编辑</div>
        <div class="content">
          <sn-form-item label="资讯标题" prop="contentTitle" :rules="[{
              required: true,
              type: 'string',
              message: '请输入资讯标题',
              trigger: 'blur'
            }, {
              min: 5,
              max,
              message: `长度在 5 到 ${max} 个字符`,
              trigger: 'blur'
            }]">
            <sn-input
              v-model="ruleForm.contentTitle"
              :placeholder="`请输入资讯标题，5-${max}个字`"
              :maxlength="max"
              :totalWords="max"
              width="650"
              showWord>
            </sn-input>
          </sn-form-item>
          <sn-form-item label="展示样式" prop="isBigImg" :rules="[{
              required: true,
              type: 'number',
              message: '请选择展示样式',
              trigger: 'change'
            }]">
            <sn-select ref="level" v-model="ruleForm.isBigImg" placeholder="请选择" width="360" @change="handleImgTypeChange">
              <sn-option
                v-for="(image, index) in imageTypeList"
                :key="index"
                :name="image.name"
                :value="image.value"
                :disabled="infoAllowImgTypeList.indexOf(image.value) === -1">
              </sn-option>
            </sn-select>
          </sn-form-item>
          <sn-form-item label="资讯封面" prop="contentCover" :rules="contentCoverRules">
            <sn-cropper-three
              v-if="imgItem.key==='tri'"
              :aspectRatio="imgItemAspectRatio"
              :newsId="data.contentId"
              :listGroup="totalImgList"
              :imgList="selectedImgObj"
              ref="cropper-three"
              label="封面"
              aspectWith="255"
              :aspectHeight="255*255/339+''"
              :nolibrary="data.contentType=='11'"
              width="200"
              :height="200*255/339+''"
              @img-group="imgGroupChange">
            </sn-cropper-three>
            <sn-cropper
              v-else
              v-model="ruleForm.contentCover"
              ref="cropper"
              label="封面"
              :aspectRatio="imgItemAspectRatio"
              :height="coverStyle.height"
              :width="coverStyle.width"
              isScoped>
            </sn-cropper>
          </sn-form-item>
        </div>
      </fieldset>
      <fieldset>
        <div class="legend-tag is-line">
          <span class="label">添加标签</span>
          <div class="space-line"></div>
        </div>
        <div class="tag">
          <sn-form-item label="展示标签" prop="showLabel" :rules="[{
              min: 2,
              max: 2,
              message: '长度固定为2个字符',
              trigger: 'blur'
            }]">
            <sn-input
              v-model="ruleForm.showLabel"
              placeholder="请输入展示标签，固定为2个字"
              width="300"
              :minlength="2"
              :maxlength="2"
            ></sn-input>
          </sn-form-item>
        </div>
      </fieldset>
      <sn-form-item class="btn-group">
        <div class="is-line">
          <div>
            <sn-button v-sensitive="{
                  getParams:getSensitiveParams,
                  nextStep:submitInfo,
                  prevStep:validForm,
                  context:_self
                }" type="primary" class="mr-40">保存并通过</sn-button>
            <sn-button @click="openRefuseConfirm" class="mr-40">驳回</sn-button>
          </div>
          <sn-button @click="backToIndex">取消</sn-button>
        </div>
      </sn-form-item>
    </sn-form>
    <refuse-confirm :viewType.sync="viewType"></refuse-confirm>
  </div>
</template>

<script>
import DI from 'interface';
import * as Constant from 'js/constant';
import RefuseConfirm from './refuseConfirm';
import { getImgPixelSize } from 'utils/image-operate';
export default {
  name: 'ReviewEdit',
  componentName: 'ReviewEdit',
  components: {
    RefuseConfirm
  },
  props: ['data'],
  data () {
    const data = this.data;
    let imageTypeList = Constant.INFO_IMAGE_TYPE;
    let allowImgTypeList = Constant.getItemByValue(Constant.ARTICLE_TYPE, this.data.contentType).allowImgTypeList;
    let isBigImg = data.isBigImg;

    if (allowImgTypeList.indexOf(data.isBigImg) === -1) {
      isBigImg = allowImgTypeList[0];
    }
    return {
      viewType: null,
      imageTypeList,
      totalImgList: [],
      ruleForm: {
        id: data.id,
        status: data.status,
        isBigImg,
        showLabel: data.showLabel,
        channelId: data.channelId,
        contentTitle: data.contentTitle,
        contentCover: data.contentCover,
      }
    }
  },
  computed: {
    coverArr() {
      const { contentCover } = this.ruleForm;
      return contentCover ? contentCover.split(';') : [];
    },
    infoItem() {
      return Constant.getItemByValue(Constant.ARTICLE_TYPE, this.data.contentType);
    },
    infoType () {
      return this.infoItem.key;
    },
    infoAllowImgTypeList () {
      return this.infoItem.allowImgTypeList;
    },
    isAllowTriImgs () {
      let triVal = Constant.getItemByKey(this.imageTypeList, 'tri').value;
      return this.infoAllowImgTypeList.indexOf(triVal) > -1;
    },
    imgItem () {
      return Constant.getItemByValue(this.imageTypeList, this.ruleForm.isBigImg);
    },
    imgItemAspectRatio () {
      return this.imgItem.aspectRatio;
    },
    max () {
      if (this.infoType === 'video' || this.infoType === 'shortV') {
        return 50;
      } else {
        return 30;
      }
    },
    coverStyle () {
      if (this.imgItem.key === 'big') {
        return {
          width: '351',
          height: '180'
        }
      }
      if (this.imgItem.key === 'small') {
        return {
          width: '360',
          height: '270'
        }
      }
      return null;
    },
    contentCoverRules () {
      let imgTypeKey = this.imgItem.key;
      const contentTriCoverValidation = (rule, value, callback) => {
        let isValid = false;
        if (imgTypeKey === 'tri') {
          if (value) {
            let tempArr = ('' + value).split(';');
            for (let i = 0, len = tempArr.length; i < len; i++) {
              const item = tempArr[i];
              if (!item) {
                break;
              }
              if (i === 2) {
                isValid = true;
              }
            }
          }
        } else {
          if (value) {
            isValid = true;
          }
        }
        if (isValid) {
          callback();
        } else {
          callback(new Error("请完成封面设置"));
        }
      };
      return [{
        required: true,
        message: '请完成封面设置',
        trigger: 'change'
      }, {
        validator: contentTriCoverValidation,
        trigger: 'change'
      }];
    },
    selectedImgObj: {
      get () {
        let contentCover = this.ruleForm.contentCover;
        if (contentCover) {
          let selectedImgList = contentCover.split(';');
          return {
            img1: selectedImgList[0] || '',
            img2: selectedImgList[1] || '',
            img3: selectedImgList[2] || ''
          };
        } else {
          return {
            img1: '',
            img2: '',
            img3: ''
          };
        }
      },
      set (newObj) {
        let tempStr = [newObj.img1 || '', newObj.img2 || '', newObj.img3 || ''].join(';');
        this.ruleForm.contentCover = tempStr;
        this.$refs['cropper-three'] && this.$refs['cropper-three'].dispatch('FormItem', 'form.change', tempStr);
      }
    }
  },
  mounted () {
    if (this.isAllowTriImgs) {
      this.queryImgList();
    }
  },
  methods: {
    handleImgTypeChange (val) {
      this.ruleForm.isBigImg = val;
      this.$nextTick(() => {
        if (this.imgItem.key === 'tri') {
          if (this.totalImgList.length > 0) {
            this.ruleForm.contentCover = this.totalImgList.slice(0, 3).join(';');
          } else {
            this.ruleForm.contentCover = '';
          }
        } else {
          this.ruleForm.contentCover = '';
        }
        this.$refs['cropper-three'] && this.$refs['cropper-three'].dispatch('FormItem', 'form.change', this.ruleForm.contentCover);
        this.$refs['cropper'] && this.$refs['cropper'].dispatch('FormItem', 'form.change', this.ruleForm.contentCover);
      })
    },
    imgGroupChange (imgObj) {
      this.selectedImgObj = { ...imgObj };
    },
    queryImgList () {
      this.$ajax({
        url: DI.channel.getNewsInfo,
        data: JSON.stringify({
          newsId: this.data.contentId
        }),
        laodingText: '正在查询图片库集合，请稍候！',
        context: this,
        success: (res) => {
          let result = res.data || {};
          if (res.retCode == '0') {
            this.totalImgList = result.imgList || [];
            if (this.totalImgList.length > 0 && !this.ruleForm.contentCover) {
              this.ruleForm.contentCover = this.totalImgList.slice(0, 3).join(';');
            }
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => { }
      });
    },
    backToIndex () {
      this.$ajax({
        url: DI.infoReview.delEitReviewCache,
        context: this,
        loadingText: '正在解除编辑锁定，请稍候！',
        data: JSON.stringify({
          id: this.data.id
        }),
        success: (res) => {
          if (res.retCode == "0") {
            this.$message.success('解除成功！');
            this.$bus.$emit('goBack');
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    openRefuseConfirm () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.viewType = 'refuse';
        }
      })
    },
    confirmRefuse (rejectReason) {
      this.ruleForm.rejectReason = rejectReason;
      this.ruleForm.status = Constant.getItemByKey(Constant.APPROVE_ACTION, 'refuse').value;
      this.submitForm();
    },
    validForm () {
      this.ruleForm.status = Constant.getItemByKey(Constant.APPROVE_ACTION, 'access').value;
      return new Promise((resolve, reject) => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      })
    },
    getSensitiveParams () {
      let ruleForm = this.ruleForm;
      return {
        content: `${ruleForm.contentTitle || ''}${ruleForm.showLabel || ''}`,
        name: ''
      }
    },
    submitInfo() {
      let getImgWidthPromises = [];
      let { coverArr } = this;
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

        // 大图 500限制
        if (this.ruleForm.isBigImg == 1 && parseInt(imageWidths) < 500) {
          this.$message.error(`图片分辨率宽度小于500, 请重新选择！`);
          return;
        }

        let pms = {
          ...this.ruleForm,
          imageWidths: imageWidths
        };
        this.$ajax({
          url: DI.infoReview.editItem,
          data: JSON.stringify(pms),
          context: this,
          loadingText: '正在保存编辑内容，请稍候！',
          success: res => {
            if (res.retCode == '0') {
              this.$bus.$emit('goBack', { refresh: true });
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.log('error');
          }
        });
      });
    }
  }
};
</script>

<style scoped>
.edit {
  background-color: #ffffff;
  .sub-title {
    padding: 15px 19px;
    font-size: 14px;
  }

  .img-text {
    width: 360px;
    height: 270px;
    margin-top: 9px;
    border: 1px solid #eeeeee;
    box-sizing: content-box;
  }

  .content,
  .tag {
    padding: 20px 0px 10px 90px;
    width: 80%;
  }

  .legend-content {
    padding: 24px 0px 10px 24px;
    font-size: 14px;
  }

  .fixed-height {
    height: 30px;
  }

  .legend-tag {
    .label {
      font-size: 14px;
      padding-left: 22px;
      padding-right: 12px;
    }

    .space-line {
      border-top: 1px solid #eeeeee;
      flex-grow: 47;
    }
  }

  .mr-40 {
    margin-right: 40px;
  }

  .btn-group {
    border-top: 1px solid #eeeeee;
    margin-right: 40px;
    margin-left: 70px;
    padding: 27px 0px 30px 20px;
    .is-line {
      justify-content: space-between;
    }
  }
}
</style>

