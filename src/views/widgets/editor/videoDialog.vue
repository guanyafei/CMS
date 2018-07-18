<template>
  <sn-confirm
    title="插入视频"
    v-if="viewType==='video'"
    close-icon
    @close="close"
    noflag>
    <div class="modal-video__container">
      <div class="modal-video__header" v-if="!disableLocalVideo&&mipInfo.step!=2">
        <sn-form-item label="视频类型：">
          <sn-radio-group v-model="videoType">
            <sn-radio label="mip">MIP视频</sn-radio>
            <sn-radio label="local">本地上传</sn-radio>
          </sn-radio-group>
        </sn-form-item>
      </div>
      <div class="modal-video__content">
        <template v-if="videoType==='mip'">
          <template v-if="mipInfo.step==1">
            <sn-input
              v-model="mipInfo.searchInput"
              ref="searchInput"
              width="100%"
              :height="34"
              :maxlength="searchTypeItem.maxlength"
              :placeholder="searchTypeItem.placeholder"
              class="link__search"
            >
              <sn-select
                slot="prepend"
                v-model="mipInfo.searchType"
                width="105"
                placeholder="请选择"
                @change="handleFilterTypeChange">
                <sn-option
                  v-for="item in mipInfo.searchTypes"
                  :key="item.key"
                  :name="item.name"
                  :value="item.value"
                >
                </sn-option>
              </sn-select>
              <sn-button
                slot="append"
                type="primary"
                :circle="false"
                @click="search"
                class="link-search__button"
              >搜索</sn-button>
            </sn-input>
            <sn-table :data="mipInfo.mipVideoList" theme="dialog" height="225">
              <sn-table-column width="10%" sloted wall="false">
                <template slot-scope="row">
                  <sn-radio
                    :label="row.vid"
                    :value="mipInfo.selectedVideoId"
                    @input="handleSelectedVideoChange"
                  ></sn-radio>
                </template>
              </sn-table-column>
              <sn-table-column label="视频ID" prop="vid" width="20%">
              </sn-table-column>
              <sn-table-column label="视频标题" prop="title" width="30%">
              </sn-table-column>
              <sn-table-column label="视频时长" prop="durationSecond" width="20%" sloted>
                <template slot-scope="row">
                  {{secoundToTime(row.durationSecond)}}
                </template>
              </sn-table-column>
              <sn-table-column label="完成入库时间" prop="onlinetime" sloted>
                <template slot-scope="row">
                  <sn-td-date :time="row.createTime||row.onlinetime"></sn-td-date>
                </template>
              </sn-table-column>
            </sn-table>
          </template>
          <template v-if="mipInfo.step==2">
            <div class="modal-video__meta">
              <sn-button type="text" icon="arrow-prev" @click="prevStep">重新选择视频</sn-button>
              <div class="modal-video__inner">
                <div class="modal-video__left">
                  <sn-cropper
                    v-model="mipInfo.selectedItem.sloturl"
                    width="192"
                    height="108"
                    ref="cropper"
                    label="封面"
                    :aspectRatio="16 / 9"
                    isScoped
                  >
                    <div class="cover-show__area">
                      <img :src="mipInfo.selectedItem.sloturl" width="144" height="81">
                      <div class="video-cover__edit">
                        <span @click="doCropperMipCover">编辑封面</span>
                      </div>
                    </div>
                  </sn-cropper>
                </div>
                <div class="modal-video__right">
                  <div class="modal-video__line">
                    <span class="modal-video__label">视频ID：</span>
                    <div class="modal-video__txt">
                      {{ mipInfo.selectedItem.vid }}
                    </div>
                  </div>
                  <div class="modal-video__line">
                    <span class="modal-video__label">视频标题：</span>
                    <div class="modal-video__txt">
                      {{ mipInfo.selectedItem.title }}
                    </div>
                  </div>
                  <div class="modal-video__line">
                    <span class="modal-video__label">视频时长：</span>
                    <div class="modal-video__txt">
                      {{ secoundToTime(mipInfo.selectedItem.durationSecond)}}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
        <div v-else class="modal-video__local">
          <img src="../../../assets/icon-add-video.png" alt="" width="60" height="60">
          <span class="modal-video__txt">
            为了获得更高的推荐量和点击率，建议上传720P（1280X720）或更高分辨率的视频，大小不超过{{size}}M</span>
        </div>
      </div>
    </div>
    <div slot="btn-group" class="sn-popup-btns">
      <template v-if="videoType==='mip'">
        <sn-button
          size="mini"
          type="primary"
          @click="nextStep"
          v-if="mipInfo.step==1"
          :disabled="!mipInfo.selectedVideoId"
        >下一步</sn-button>
        <sn-button size="mini" type="primary" @click="doInsert" v-if="mipInfo.step==2">插入</sn-button>
        <sn-button size="mini" type="primary" @click="close">取消</sn-button>
      </template>
      <sn-button size="mini" type="primary" @click="handleUploadVideoBtnClick" v-else>上传视频</sn-button>
    </div>
  </sn-confirm>
</template>
<script>
import DI from 'interface';
import * as Constant from 'js/constant';
import { secoundToTime } from 'utils/util';

export default {
  name: 'VideoDialog',
  props: {
    viewType: [String, Object],
    size: [String, Number],
    disableLocalVideo: Boolean
  },
  data() {
    return {
      videoType: 'mip',
      mipInfo: {
        step: 1,
        queryResult: 'void',
        selectedItem: null,
        selectedVideoId: '',
        searchInput: '',
        searchType: 1,
        searchTypes: Constant.MIP_VIDEO_QUERYS,
        mipVideoList: []
      }
    };
  },
  computed: {
    searchTypeItem() {
      return Constant.getItemByValue(this.mipInfo.searchTypes, this.mipInfo.searchType);
    }
  },
  watch: {
    videoType(newValue) {
      if (newValue === 'local') {
        this.clearMipPrevDataByVideoType();
      } else {
        this.viewType == 'video' && this.queryDefaultVideoList();
      }
    },
    viewType(newValue) {
      if (newValue == 'video') {
        this.videoType == 'mip' && this.queryDefaultVideoList();
      }
    },
    'mipInfo.searchType'(newValue) {
      if (newValue == 1) {
        this.queryDefaultVideoList();
      }
    }
  },
  created() {
    this.$bus.$on('localVideoFilesChange', () => {
      if (this.videoType == 'local') {
        this.$emit('update:viewType', null);
        this.$nextTick().then(() => {
          this.reset();
        });
      }
    });
  },
  methods: {
    secoundToTime(s) {
      return secoundToTime(s);
    },
    handleSelectedVideoChange(id) {
      const video = this.getValidVideoById(id);
      if (video) {
        this.mipInfo.selectedVideoId = id;
        this.mipInfo.selectedItem = { ...video };
      }
    },
    handleFilterTypeChange(val) {
      this.mipInfo.searchType = val;
      this.clearMipPrevDataBySearchType();
    },
    search() {
      if (this.mipInfo.searchType === 1) {
        //根据标题查询
        this.queryMipVideoListByTitle();
      } else {
        //根据id查询
        this.querySpecificMipVideoById();
      }
    },
    nextStep() {
      this.mipInfo.step = 2;
    },
    prevStep() {
      this.mipInfo.step = 1;
    },
    getValidVideoById(id) {
      const { mipVideoList } = this.mipInfo;
      const filterItem = mipVideoList.find(item => item.vid == id);

      if (filterItem.pay == 1) {
        this.$message.warning('该视频是付费视频！');
        return null;
      }
      return filterItem;
    },
    queryDefaultVideoList() {
      this.$ajax({
        //根据视频ID查询视频
        url: DI.editor.queryDefaultVideoList,
        context: this,
        type: 'GET',
        success(res) {
          if (res.retCode == 0) {
            const data = res.data;
            let videoList = data.list || [];
            this.mipInfo.mipVideoList = videoList;
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error() {
          console.log('error');
        }
      });
    },
    queryMipVideoListByTitle() {
      this.clearMipPrevDataBySearchBtn();
      if (!this.mipInfo.searchInput || !this.$refs.searchInput.check()) {
        return;
      }

      this.$ajax({
        //根据视频标题查询视频
        url: DI.editor.queryMipVideoListByTitle,
        context: this,
        data: {
          name: this.mipInfo.searchInput
        },
        type: 'GET',
        success(res) {
          if (res.retCode == 0) {
            const data = res.data;
            let videoList = data.list || [];
            this.mipInfo.mipVideoList = videoList;
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error() {
          console.log('error');
        }
      });
    },
    querySpecificMipVideoById() {
      this.clearMipPrevDataBySearchBtn();
      if (!this.mipInfo.searchInput || !this.$refs.searchInput.check()) {
        return;
      }
      this.$ajax({
        //根据视频ID查询视频
        url: DI.editor.queryVideoDetail,
        context: this,
        data: {
          videoId: this.mipInfo.searchInput
        },
        type: 'GET',
        success(res) {
          if (res.retCode == 0) {
            let video = res.data;
            if (video.vt == 3) {
              this.mipInfo.mipVideoList = [{ ...video }];
            }
          } else {
            this.$message.error(res.retMsg);;
          }
        }
      });
    },
    doInsert() {
      this.$emit('sure', this.mipInfo.selectedItem);
      this.reset();
    },
    doCropperMipCover() {
      this.$refs.cropper.editClickHandler();
    },
    handleUploadVideoBtnClick() {
      this.$emit('triggerUpload');
    },
    close() {
      this.reset();
      this.$emit('close');
    },
    clearMipPrevDataBySearchType() {
      this.mipInfo = Object.assign(this.mipInfo, {
        selectedItem: null,
        selectedVideoId: '',
        searchInput: '',
        mipVideoList: []
      });
    },
    clearMipPrevDataBySearchBtn() {
      this.mipInfo = Object.assign(this.mipInfo, {
        selectedItem: null,
        selectedVideoId: '',
        mipVideoList: []
      });
    },
    clearMipPrevDataByVideoType() {
      this.mipInfo = Object.assign(this.mipInfo, {
        step: 1,
        selectedItem: null,
        selectedVideoId: '',
        searchInput: '',
        searchType: 1,
        mipVideoList: []
      });
    },
    reset() {
      this.videoType = 'mip';
      this.mipInfo = Object.assign(this.mipInfo, {
        step: 1,
        selectedItem: null,
        selectedVideoId: '',
        searchInput: '',
        searchType: 1,
        mipVideoList: []
      });
      this.$nextTick(() => {
        this.$refs.searchInput && this.$refs.searchInput.setMsg();
      });
    }
  }
};
</script>

<style scoped>
.video-cover__edit {
  color: #09bbfe;
  span {
    height: 16px;
    display: inline-block;
    margin-top: 3px;
    padding-left: 15px;
    cursor: pointer;
    background: url(../../../assets/icon-edit-small.png) no-repeat;
  }
}
.modal-video__container {
  width: 600px;
  padding: 10px;
  color: #999999;
  font-size: 12px;
  .link__search {
    margin-bottom: 20px;
  }
  .link-search__button {
    height: 32px;
  }

  .modal-video__meta {
    min-height: 100px;
    margin-top: 10px;
    .modal-video--error {
      padding: 50px 0;
      text-align: center;
      color: #f68885;
    }
    .modal-video--null {
      display: flex;
      width: 100%;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .modal-video__inner--null {
        width: 100px;
        height: 90px;
        margin-bottom: 3px;
      }
      .modal-video__txt--null {
        color: #999999;
      }
    }
    .modal-video__inner {
      display: flex;
      padding: 10px;
      background: #f6fcff;
      border-radius: 4px;
      img {
        margin-right: 10px;
      }
      .modal-video__line {
        display: flex;
        margin-bottom: 5px;
        .modal-video__label {
          flex: 0 0 auto;
          line-height: 16px;
        }
        .modal-video__txt {
          line-height: 16px;
        }
      }
    }
  }
  .modal-video__local {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    .modal-video__txt {
      line-height: 16px;
      padding-top: 20px;
      padding-left: 49px;
      padding-right: 49px;
    }
  }
}
</style>
