<template>
  <sn-form-item
    :label="title"
    prop="cover"
    :rules="contentCoverRules"
  >
    <sn-cropper
      v-if="editorImgList.length<3 && curSelectedCoverArrLength<3"
      v-model="ruleForm.cover"
      :lib-imglist="totalImgList"
      ref="cropper"
      label="封面"
      width="360"
      :height="360*148 / 226 + ''"
      :aspectRatio="226 / 148"
      :nolibrary="nolibrary"
      :supportPreview="true"
    >
    </sn-cropper>
    <sn-cropper-three
      v-else
      :listGroup="totalImgList"
      :imgList="selectedImgObj"
      @img-group="imgGroupChange"
      :aspectRatio="226 / 148"
      :newsId="ruleForm.newsId"
      ref="cropper-three"
      label="封面"
      :aspectHeight="(255* 148 / 226)+''"
      :height="(200* 148 / 226)+''"
      aspectWith="255"
      width="200"
      :supportPreview="true"
    >
    </sn-cropper-three>
  </sn-form-item>
</template>

<script>
import { staticDefaultCover } from 'utils/envUrl';
const MAX_SINGLE_COVER_PICTURE_NUM = 2;

export default {
  name: 'InfoCover',
  componentName: 'InfoCover',
  props: ['ruleForm', 'title', 'nolibrary'],
  data() {
    let defaultImgList = [];
    if (!this.nolibrary) {
      defaultImgList = [staticDefaultCover];
      if (!this.ruleForm.cover) {
        this.ruleForm.cover = defaultImgList[0];
      }
    }
    return {
      editorImgList: [],
      defaultImgList
    };
  },
  mounted() {
    this.eventsListener = {
      'cover-imgList-change': imgObj => {
        let editorImgList = [];
        for (let key in imgObj) {
          if ({}.hasOwnProperty.call(imgObj, key) && imgObj[key]) {
            let newArr = imgObj[key];
            editorImgList = [...editorImgList, ...newArr];
          }
        }
        this.editorImgList = editorImgList;
      }
    };
    this.$bus.$on('cover-imgList-change', this.eventsListener['cover-imgList-change']);
    this.$bus.$on('picture-cover-change', listGroup => {
      this.editorImgList = listGroup;
    });
  },
  beforeDestroy() {
    for (let key in this.eventsListener) {
      if (this.eventsListener[key]) {
        this.$bus.$off(key, this.eventsListener[key]);
      }
    }
  },
  computed: {
    curSelectedCoverArrLength() {
      let { cover } = this.ruleForm;
      return cover ? cover.split(';').length : 0;
    },
    totalImgList() {
      return [...this.editorImgList, ...this.defaultImgList];
    },
    contentCoverRules() {
      const { editorImgList } = this;
      const contentTriCoverValidation = (rule, value, callback) => {
        if (value) {
          let tempArr = ('' + value).split(';');
          for (let i = 0, len = tempArr.length; i < len; i++) {
            const imgUrl = tempArr[i];
            if (!/.*.(jpe?g|gif|png)(\?.*)?$/.test(imgUrl.toLowerCase())) {
              callback(new Error('封面地址不是图片格式.'));
            }
          }
        }

        let isValid = false;
        if (editorImgList.length > MAX_SINGLE_COVER_PICTURE_NUM) {
          if (value) {
            let tempArr = ('' + value).split(';');
            for (let i = 0, len = tempArr.length; i < len; i++) {
              const item = tempArr[i];
              if (!item) {
                break;
              }
              if (i === MAX_SINGLE_COVER_PICTURE_NUM) {
                isValid = true;
              }
            }
          }
        } else {
          if (value) {
            isValid = true;
          }
        }
        if (!isValid) {
          callback(new Error('请完成封面设置'));
        }
        callback();
      };
      return [
        {
          required: true,
          message: '请完成封面设置',
          trigger: 'change'
        },
        {
          validator: contentTriCoverValidation,
          trigger: 'change'
        }
      ];
    },
    selectedImgObj: {
      get() {
        let cover = this.ruleForm.cover;
        if (cover) {
          let selectedImgList = cover.split(';');
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
      set(newObj) {
        let tempStr = [newObj.img1 || '', newObj.img2 || '', newObj.img3 || ''].join(';');
        this.ruleForm.cover = tempStr;
        this.$refs['cropper-three'] && this.$refs['cropper-three'].dispatch('FormItem', 'form.change', tempStr);
      }
    }
  },
  watch: {
    editorImgList(newList, oldList) {
      const { defaultImgList, ruleForm } = this;
      let cover = ruleForm.cover;
      let selecteds = cover ? cover.split(';') : [];

      if (oldList.length > 2 && newList.length < 3) {
        ruleForm.cover = (ruleForm.cover || '').split(';')[0];
      }

      if (newList.length > 2 && selecteds.length < 3) {
        let imgsContainer = [...newList];
        for (let i = 0; i < selecteds.length; i++) {
          const selectedUrl = selecteds[i];
          const imgIndex = imgsContainer.indexOf(selectedUrl);
          if (imgIndex > -1) {
            imgsContainer.splice(imgIndex, 1);
          }
        }
        selecteds = [...selecteds, ...imgsContainer.slice(0, 3 - selecteds.length)];
        this.ruleForm.cover = selecteds.join(';');
      }

      if (newList.length === 1 && defaultImgList.indexOf(ruleForm.cover) > -1) {
        ruleForm.cover = newList[0];
      }
      if (newList.length === 0 && oldList.indexOf(ruleForm.cover) > -1) {
        ruleForm.cover = defaultImgList[0];
      }
    }
  },
  methods: {
    imgGroupChange(imgObj) {
      this.selectedImgObj = { ...imgObj };
    }
  }
};
</script>
