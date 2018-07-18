<template>
  <div class="edit-container">
    <sn-form :model="ruleForm" ref="ruleForm" label-width="110px">
      <header class="edit-header">
        <h3 class="header__title">视频发布</h3>
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
        <edit-item title="展示维护" :labelWidth="20">
          <video-column :ruleForm="ruleForm"></video-column>
          <video-topic :ruleForm="ruleForm"></video-topic>
          <video-program v-if="showFlag" :ruleForm="ruleForm"></video-program>
          <video-set :ruleForm="ruleForm"></video-set>
        </edit-item>
        <edit-item title="内容归属">
          <column-tag label="所属栏目" :ruleForm="ruleForm"></column-tag>
          <bu-tag :ruleForm="ruleForm"></bu-tag>
        </edit-item>
      </div>
      <footer class="edit-footer">
        <edit-item>
          <sn-form-item class="btn-group" label-width="0">
            <sn-button type="primary" @click="handlePublishBtnClick" class="mr-30" :disabled="doubleClick">发布</sn-button>
            <sn-button @click="cancelEdit">取消</sn-button>
          </sn-form-item>
        </edit-item>
      </footer>
    </sn-form>
  </div>
</template>
<script>
import cloneDeep from 'clone-deep';
import * as Constant from 'js/constant';
import { fetchVideoItemDetailsAction, batchSaveMediaVideo, doMediaPushToVipAction } from './fetch';
import { getImgPixelSize } from 'utils/image-operate';
import initAddData from './init-add-data';

import BlockItem from 'widgets/video/form-items/block-item';
import EditItem from 'widgets/infoCommon/infoEditDetails/editItem';
import FrontEndClassify from 'widgets/video/form-items/front-end-classify';
import VideoColumn from 'widgets/infoCommon/infoEditDetails/elements/infoColumn';
import VideoItemInfo from 'widgets/video/form-items/video-item-info';
import VideoRate from 'widgets/infoCommon/infoEditDetails/elements/infoRate';
import VideoResource from 'widgets/infoCommon/infoEditDetails/elements/infoResource';
import VideoSet from 'widgets/video/form-items/video-set';
import VideoStatus from 'widgets/video/form-items/video-status';
import VideoTag from 'widgets/video/form-items/tags';
import VideoTopic from 'widgets/infoCommon/infoEditDetails/elements/infoTopic';
import VideoUser from 'widgets/infoCommon/infoEditDetails/elements/infoUser';
import VideoProgram from 'widgets/video/form-items/video-program';
import BuTag from 'widgets/infoCommon/infoEditDetails/tags/buTag';
import ColumnTag from 'widgets/infoCommon/infoEditDetails/tags/info-column';

export default {
  name: 'publishVideo',
  mixins: [initAddData],
  components: {
    BlockItem,
    EditItem,
    FrontEndClassify,
    VideoColumn,
    VideoItemInfo,
    VideoRate,
    VideoResource,
    VideoSet,
    VideoStatus,
    VideoTag,
    VideoTopic,
    VideoUser,
    VideoProgram,
    BuTag,
    ColumnTag
  },
  data() {
    return {
      showFlag: false,
      doubleClick: false
    };
  },
  beforeRouteEnter(to, from, next) {
    if (to.query.ids) {
      let ids = (to.query.ids + '').split(',');
      let videoDetailsAllPromises = ids.reduce((allPromises, id) => {
        if (id) {
          allPromises.push(
            fetchVideoItemDetailsAction(null, {
              params: {
                channelId: id
              }
            })
          );
        }
        return allPromises;
      }, []);
      Promise.all(videoDetailsAllPromises).then(detailsList => {
        next(vm => {
          vm.ruleForm = vm.getInitPublishData(detailsList);
        });
      });
    }
  },
  watch: {
    'ruleForm.videoSelectedLabels': function(newVal, oldVal) {
      if (newVal.length) {
        let flag = false;
        newVal.filter(id => {
          for (let i = 0; i < this.ruleForm.videoLabelList.length; i++) {
            if (id == this.ruleForm.videoLabelList[i].value && this.ruleForm.videoLabelList[i].cName == '自制节目') {
              flag = true;
            }
          }
        });
        if (flag) {
          // 自制节目
          this.showFlag = true;
        } else {
          this.showFlag = false;
          this.ruleForm.program = {};
        }
      } else {
        this.showFlag = false;
        this.ruleForm.program = {};
      }
    }
  },
  methods: {
    handlePublishBtnClick() {
      this.doubleClick = true;
      this.validForm();
    },
    validForm() {
      let { batchVideoList } = this.ruleForm;
      if (this.showFlag && !this.ruleForm.program) {
        this.doubleClick = false;
        this.$message.warning('请加入节目信息！');
        return;
      } else if (this.showFlag && this.ruleForm.program && !this.ruleForm.program.term) {
        this.doubleClick = false;
        this.$message.warning('请填写节目期数！');
        return;
      }
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
            })
            .catch(() => {
              this.doubleClick = false;
            });
        } else {
          this.doubleClick = false;
        }
      });
    },
    submitForm() {
      const submitData = this.getSubmitData();
      if (JSON.stringify(submitData.terminal) == '{}') {
        this.doubleClick = false;
        this.$message.warning('请设置地域屏蔽数据');
        return;
      }
      // console.log(submitData);
      batchSaveMediaVideo(this, {
        params: submitData
      })
        .then(() => {
          this.doubleClick = false;
          this.replaceHistoryData(submitData);
          this.$router.push({ path: '/videoLib' });
        })
        .catch(() => {
          this.doubleClick = false;
        });
    },
    cancelEdit() {
      this.$confirm('确认取消发布?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$router.push({ path: '/videoLib' });
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
        channelSet,
        source,
        sourceDetailType,
        terminal,
        program
      } = ruleForm;
      let tempMap = {};

      tempMap.batchVideoList = batchVideoList.reduce((arr, video) => {
        arr.push({
          id: video.id,
          title: video.title,
          coverPic: video.coverPic,
          newsCover: video.newsCover,
          imageWidths: video.imageWidths,
          duration: video.duration,
          description: video.description,
          setList: setSetLabelListTitle(selectedSetLabels, video.epTitle)
        });
        return arr;
      }, []);

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
      tempMap.infoIdSet = channelSet.join(',');
      tempMap.program = program;

      // 处理视频分类
      let videlLabels = videoSelectedLabels.reduce((arr, id) => {
        this.ruleForm.videoLabelList.filter(item => {
          if (id == item.value) {
            arr.push({
              labelId: item.value,
              labelName: item.cName,
              labelType: 1
            });
          }
        });
        return arr;
      }, []);
      tempMap.nlrList = tempMap.nlrList.concat(videlLabels);

      Constant.CHANNEL_LIST.map(channel => {
        if (terminal[channel.key]) {
          terminal[channel.key].status = status;
          terminal[channel.key].cataId = frontClassifySelectedLabels.reduce((str, label) => {
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
            setId: item.setId,
            rank: item.rank//6261 wuxa权重值
          });
          return arr;
        }, []);
      }
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

