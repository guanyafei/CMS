<template>
  <div class="video-info__list mb-10">
    <div class="video-info__column video-info__index">
      <div class="video-info__item video-index__item">
        视频基本信息
      </div>
      <div class="video-info__item video-index__item">
        视频标题<strong class="is-required">*</strong>
      </div>
      <div class="video-info__item video-index__item">分集名</div>
      <div class="video-info__item video-index__item">
        视频简介<strong class="is-required">*</strong>
      </div>
      <div class="video-info__item video-index__item">
        视频封面<strong class="is-required">*</strong>
      </div>
      <div class="video-info__item video-index__item">定价推送</div>
    </div>

    <div class="video-info__details">
      <div class="video-info__column"
        v-for="(videoDetail, index) in ruleForm.batchVideoList"
        :key="videoDetail.id"
      >
        <div class="video-info__item">
          <div class="video-item__cell">
            <span>视频ID：</span>
            <span>{{videoDetail.id}}</span>
          </div>
          <div class="video-item__cell">
            <span>清晰度：</span>
            <span>{{videoDetail.definition}}</span>
          </div>
          <div class="video-item__cell">
            <span>时长：</span>
            <span>{{secoundToTime(videoDetail.duration)}}</span>
          </div>
        </div>
        <div class="video-info__item">
          <sn-form-item
            :prop="'batchVideoList.' + index + '.title'"
            :rules="videoTitleRules"
            label-width="0px"
            class="video-title__box"
          >
            <sn-input
              v-model="videoDetail.title"
              placeholder="请输入视频标题"
              maxlength="30"
              noBorder
            ></sn-input>
          </sn-form-item>
        </div>
        <div class="video-info__item">
          <sn-form-item
            :prop="'batchVideoList.' + index + '.epTitle'"
            :rules="epTitleRules"
            label-width="0px"
            class="video-title__box"
          >
            <sn-input
              v-model="videoDetail.epTitle"
              placeholder="请输入分集名称"
              maxlength="30"
              noBorder
            ></sn-input>
          </sn-form-item>

        </div>
        <div class="video-info__item">
          <sn-form-item
            :prop="'batchVideoList.' + index + '.description'"
            :rules="videoDescriptionRules"
            label-width="0px"
            class="video-title__box"
          >
            <sn-input
              v-model="videoDetail.description"
              placeholder="请输入100字符以内简介"
              maxlength="100"
              type="textarea"
              width="700"
              :showWord="true"
              :maxlength="100"
              :totalWords="100"
            ></sn-input>
          </sn-form-item>
        </div>
        <div class="video-info__item">
          <sn-form-item
            :prop="'batchVideoList.' + index + '.newsCover'"
            :rules="videoCoverRules"
            label-width="0px"
            class="video-title__box"
          >
            <sn-cropper
              v-model="videoDetail.newsCover"
              :hastip="false"
              width="192"
              :height="192*9 / 16 + ''"
              :supportPreview="true"
              :libImglist="videoDetail.coverLibList"
              :nolibrary="false"
              :ascyQueryImgLiblistFunc="queryAttchCoverList.bind(null, index)"
              :doCropperFunc="uploadVideoBase64Cover.bind(null, index)"
              isMediaLibCropper
            >
            </sn-cropper>
          </sn-form-item>
        </div>
        <div class="video-info__item">
          <sn-checkbox
            v-model="videoDetail.type"
            :trueLabel="1"
            :falseLabel="3"
          >推送到DDP定价</sn-checkbox>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import DI from 'interface';
import { secoundToTime } from 'utils/util';
import { fetchAttachImgListByVideoId, uploadVideoBase64Cover } from 'views/publish-management/video/add/fetch';

export default {
  props: ['ruleForm'],
  data() {
    return {
      imgList: []
    };
  },
  computed: {
    videoTitleRules() {
      return [
        {
          required: true,
          message: '视频标题不能为空',
          trigger: 'blur'
        }
      ];
    },
    epTitleRules() {
      const epTitleValidtor = (rule, value, callback) => {
        if (!value && this.ruleForm.selectedSetLabels.length > 0) {
          callback(new Error('已设置合集，请输入分集名.'));
        }
        callback();
      };
      return [
        {
          validator: epTitleValidtor,
          trigger: 'change'
        }
      ];
    },
    videoDescriptionRules() {
      return [
        {
          required: true,
          message: '视频简介不能为空',
          trigger: 'blur'
        }
      ];
    },
    videoCoverRules() {
      return [
        {
          required: true,
          message: '请设置视频封面',
          trigger: 'blur'
        }
      ];
    }
  },
  mounted() {
    this.secoundToTime = secoundToTime.bind(this);
  },
  methods: {
    handlePushToVipClick(index, value) {
      doMediaPushToVipAction(this, {
        params: {
          cid: this.ruleForm.batchVideoList[index].id,
          type: value
        }
      }).then(() => {
        this.ruleForm.batchVideoList[index].type = value;
      });
    },
    queryAttchCoverList(index) {
      return fetchAttachImgListByVideoId(this, {
        params: {
          channelId: this.ruleForm.batchVideoList[index].id
        }
      }).then(list => {
        // console.log(this.ruleForm.batchVideoList[index].coverLibList);
        this.ruleForm.batchVideoList[index].coverLibList = list;
      });
    },
    uploadVideoBase64Cover(index, options) {
      if (options.coverPic) {
        this.ruleForm.batchVideoList[index].coverPic = options.coverPic;
      } else {
        return uploadVideoBase64Cover(this, {
          params: {
            channelId: this.ruleForm.batchVideoList[index].id,
            ...options
          }
        }).then(imgObj => {
          this.ruleForm.batchVideoList[index].coverPic = imgObj.coverPic;
          return imgObj.newsCover;
        });
      }
    }
  }
};
</script>
<style>
/* 小屏幕（平板，大于等于 768px） */
@media (min-width: 768px) {
  .video-info__details {
    width: 600px;
  }
}

/* 中等屏幕（桌面显示器，大于等于 992px） */
@media (min-width: 992px) {
  .video-info__details {
    width: 800px;
  }
}

/* 大屏幕（大桌面显示器，大于等于 1200px） */
@media (min-width: 1200px) {
  .video-info__details {
    width: 1200px;
  }
}
.video-info__list {
  display: flex;
  border: 1px solid #eee;
  .video-index__item {
    justify-content: center;
  }
  .video-info__details {
    display: flex;
    flex: 1 1 100%;
    overflow-x: auto;
    overflow-y: hidden;
    .video-info__column {
      min-width: 425px;
    }
    .video-info__item:first-child {
      background-color: #ebebeb;
    }
  }
  .video-item__cell {
    + .video-item__cell {
      margin-left: 20px;
    }
  }
  .video-info__column {
    display: flex;
    flex-direction: column;
    flex: 1 1 100%;
    &.video-info__index {
      flex: 0 0 120px;
    }
    &:not(:last-child) {
      .video-info__item {
        border-right: 1px solid #eee;
      }
    }
    .video-info__item {
      display: flex;
      align-items: center;
      height: 41px;
      padding: 0 10px;
      font-size: 14px;
      color: #999999;
      line-height: 41px;
      text-align: center;
      + .video-info__item {
        border-top: 1px solid #eee;
      }
      &:nth-child(4) {
        height: 80px;
      }
      &:nth-child(5) {
        height: 140px;
      }
      .is-required {
        color: #09bbfe;
      }
      .video-title__box {
        margin-bottom: 0;
      }
    }
  }
}
</style>

