<template>
  <div class="edit-container">
    <sn-form :model="ruleForm" ref="ruleForm" label-width="110px">
      <header class="edit-header">
        <h3 class="header__title">视频编辑</h3>
      </header>
      <div class="edit-body">
        <edit-item title="基本信息" :labelWidth="0">
          <video-item-info :ruleForm="ruleForm"></video-item-info>
        </edit-item>
        <video-tag :ruleForm="ruleForm" ref="tag"></video-tag>
        <edit-item title="状态维护" :labelWidth="20">
          <block-item :ruleForm="ruleForm"></block-item>
          <video-status :ruleForm="ruleForm"></video-status>
          <front-end-classify :ruleForm="ruleForm"></front-end-classify>
        </edit-item>
        <edit-item title="上架信息" :labelWidth="20">
          <video-user :ruleForm="ruleForm" label="前台展示作者" label-width="110px"></video-user>
          <video-resource :ruleForm="ruleForm" label="视频来源" sourceType="video">
          </video-resource>
          <video-rate :ruleForm="ruleForm" title="设置星级"></video-rate>
        </edit-item>
        <edit-item title="内容归属">
          <column-tag :ruleForm="ruleForm"></column-tag>
          <bu-tag :ruleForm="ruleForm"></bu-tag>
        </edit-item>
        <edit-item title="视频流管理" :labelWidth="20">
          <video-file-list :ruleForm="ruleForm"></video-file-list>
        </edit-item>
      </div>
      <footer class="edit-footer">
        <edit-item>
          <sn-form-item class="btn-group" label-width="0">
            <sn-button type="primary" @click="handleEditBtnClick" class="mr-30" :disabled="doubleClick">保存</sn-button>
            <sn-button @click="cancelEdit">取消</sn-button>
          </sn-form-item>
        </edit-item>
      </footer>
    </sn-form>
  </div>
</template>
<script>
import cloneDeep from 'clone-deep';
import DI from 'interface';
import * as Constant from 'js/constant';
import { fetchVideoItemDetailsAction, editMediaVideo, doMediaPushToVipAction } from './fetch';
import { getImgPixelSize } from 'utils/image-operate';
import initEditData from './init-edit-data';

import BlockItem from 'widgets/video/form-items/block-item';
import EditItem from 'widgets/infoCommon/infoEditDetails/editItem';
import FrontEndClassify from 'widgets/video/form-items/front-end-classify';
import VideoItemInfo from 'widgets/video/form-items/video-item-info';
import VideoFileList from 'widgets/video/form-items/video-file-list';
import VideoRate from 'widgets/infoCommon/infoEditDetails/elements/infoRate';
import VideoResource from 'widgets/infoCommon/infoEditDetails/elements/infoResource';
import VideoSet from 'widgets/video/form-items/video-set';
import VideoStatus from 'widgets/video/form-items/video-status';
import VideoTag from 'widgets/video/form-items/tags';
import VideoUser from 'widgets/infoCommon/infoEditDetails/elements/infoUser';
import ColumnTag from 'widgets/infoCommon/infoEditDetails/tags/info-column';
import BuTag from 'widgets/infoCommon/infoEditDetails/tags/buTag';

export default {
  name: 'editVideo',
  mixins: [initEditData],
  components: {
    BlockItem,
    EditItem,
    FrontEndClassify,
    VideoItemInfo,
    VideoFileList,
    VideoRate,
    VideoResource,
    VideoSet,
    VideoStatus,
    VideoTag,
    VideoUser,
    ColumnTag,
    BuTag
  },
  data() {
    return {
      doubleClick: false
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.query.id) {
      fetchVideoItemDetailsAction(null, {
        params: {
          channelId: to.query.id
        }
      }).then(details => {
        next(vm => {
          vm.ruleForm = vm.getInitPublishData(details);
          vm.ruleForm.isEdit = true;
        });
      });
    }
  },
  methods: {
    handleEditBtnClick() {
      this.doubleClick = true;
      this.validForm();
    },
    validForm() {
      let { batchVideoList } = this.ruleForm;
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          Promise.all(this.setImgsPixelWidthPromises())
            .then(pixelImgArr => {
              let pushToVipPromises = [];
              batchVideoList.map((video, index) => {
                video.imageWidths = pixelImgArr[index].width;
                if (video.type !== video.prevType) {
                  pushToVipPromises.push(
                    doMediaPushToVipAction(this, {
                      params: {
                        cid: video.id,
                        type: video.type
                      }
                    })
                  );
                }
              });
              console.log(this.ruleForm);
              return pushToVipPromises;
            })
            .then(pushToVipPromises => {
              Promise.all(pushToVipPromises)
                .then(() => {
                  this.submitForm();
                })
                .catch(() => {
                  this.submitForm();
                });
            }).catch(() => {
              this.doubleClick = false;
            });
        } else {
          this.doubleClick = false;
        }
      });
    },
    setImgsPixelWidthPromises() {
      let { batchVideoList } = this.ruleForm;
      let allPromises = batchVideoList.reduce((promises, video) => {
        promises.push(getImgPixelSize(video.newsCover, false));
        return promises;
      }, []);
      return allPromises;
    },
    getSubmitData() {
      let { ruleForm } = this;
      let {
        operator,
        authorId,
        batchVideoList,
        selectedSetLabels,
        status,
        baseClassifySelectedItem,
        frontClassifySelectedLabels,
        rate,
        videoSelectedLabels,
        source,
        sourceDetailType,
        terminal,
        filelist
      } = ruleForm;
      let tempMap = {};

      let videoInfo = batchVideoList.reduce((arr, video) => {
        arr.push({
          id: video.id,
          title: video.title,
          coverPic: video.coverPic,
          newsCover: video.newsCover,
          duration: video.duration,
          description: video.description,
          imageWidths: video.imageWidths,
          setList: setSetLabelListTitle(selectedSetLabels, video.epTitle)
        });
        return arr;
      }, [])[0];
      tempMap = { ...videoInfo };

      tempMap.bppStatus = status;
      tempMap.cataId = baseClassifySelectedItem.id;
      tempMap.level = rate;

      let labels = [...ruleForm.matchLabels, ...ruleForm.teamLabels, ...ruleForm.playerLabels, ...ruleForm.customLabels];

      // 标签集合
      let columnLabel = ruleForm.columnLabelList.find(item => '' + item.labelId === ruleForm.infoColumnVal);
      let buLabel = ruleForm.buLabelList.find(item => '' + item.labelId === ruleForm.infoBuVal);

      if (columnLabel) {
        labels.push({
          labelId: columnLabel.labelId,
          labelType: Constant.getItemByKey(Constant.INFO_TAB_TYPE, 'column').value,
          labelName: columnLabel.labelName
        });
      }

      if (buLabel) {
        labels.push({
          labelId: buLabel.labelId,
          labelType: Constant.getItemByKey(Constant.INFO_TAB_TYPE, 'bu').value,
          labelName: buLabel.labelName
        });
      }
      tempMap.nlrList = labels;

      tempMap.operator = operator;
      tempMap.authorId = authorId;
      tempMap.programType = videoSelectedLabels.join(',');
      tempMap.source = source;
      tempMap.sourceDetailType = sourceDetailType;

      Constant.CHANNEL_LIST.map(channel => {
        if (terminal[channel.key]) {
          terminal[channel.key].status = status;
          terminal[channel.key].cataId = terminal[channel.key].cataId = frontClassifySelectedLabels.reduce((str, label) => {
            if (str) {
              str += `,${label.id}`;
            } else {
              str = '' + label.id;
            }
            return str;
          }, '');
        }
      });
      tempMap.terminal = terminal;

      return tempMap;
      function setSetLabelListTitle(list, title) {
        return list.reduce((arr, item) => {
          arr.push({
            epTitle: title,
            setTitle: item.setTitle,
            setId: item.setId
          });
          return arr;
        }, []);
      }
    },
    submitForm() {
      const submitData = this.getSubmitData();
      console.log(submitData);
      editMediaVideo(this, {
        params: submitData
      }).then(()=>{
        this.doubleClick = false;
        this.replaceHistoryData(submitData);
        this.$router.push({ path: '/' });
      });
    },
    cancelEdit() {
      this.$confirm('确认取消编辑?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({ path: '/' });
      });
    }
  }
};
</script>
<style>
.edit-container {
  padding: 10px 20px;
  background: #fff;
  font-size: 14px;

  .edit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header__title {
      font-size: 16px;
      color: #333;
    }
  }
  .edit-body {
    margin-top: 20px;
  }
}
</style>

