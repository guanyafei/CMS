<template>
  <div class="content" v-if="data">
    <div>
      <div class="videoPlay" id="pptv_playpage_box"></div>
      <ul class="detailContent">
        <li class="range">视频ID：{{data.id}}</li>
        <li class="range">视频标题：{{data.title}}</li>
        <li class="range">分集名：
          <span v-for="(item, index) in data.setList" :key="index">{{item.epTitle}}，</span>
        </li>
        <li>视频简介：{{data.description}}</li>
      </ul>
    </div>
    <div class="titleRange">
      <div class="titleContent" @click="videoInfoShow">
        <span class="lineHeight">视频基本信息</span>
        <i :class="['lineHeight fonts',{'sn-icon-triangle-down':videoInfoFlag,'sn-icon-triangle-up':!videoInfoFlag}]"></i>
      </div>
      <div class="detailContent" v-if="videoInfoFlag">
        <div class="range">
          <span>内容类型：{{contentType}}</span>
          <span>视频类型：{{videoTypeShow}}</span>
          <span>视频状态：{{videoStatus}}</span>
          <span>清晰度：{{data.definition}}</span>
        </div>
        <div>
          <span>视频时长：{{secoundToZHTime(data.duration)}}</span>
          <span>视频语言：{{videoLanguage}}</span>
          <span>字幕语言：{{caption}}</span>
        </div>
      </div>
    </div>
    <div class="titleRange">
      <div class="titleContent" @click="collectionShow">
        <span class="lineHeight">合集信息</span>
        <i :class="['lineHeight fonts',{'sn-icon-triangle-down':collectionFlag,'sn-icon-triangle-up':!collectionFlag}]"></i>
      </div>
      <div class="collectionBox" v-if="collectionFlag">
        <div class="range" v-for="(item, index) in data.setList" :key="index">
          <span>{{item.setId}}：{{item.setTitle}}</span>
          <span>权重：{{item.rank}}</span>
        </div>
      </div>
    </div>
    <div class="titleRange">
      <div class="titleContent" @click="labelShow">
        <span class="lineHeight">分类和标签信息</span>
        <i :class="['lineHeight fonts',{'sn-icon-triangle-down':labelFlag,'sn-icon-triangle-up':!labelFlag}]"></i>
      </div>
      <div class="detailContent" v-if="labelFlag">
        <ul>
          <li class="range">基础分类：{{data.bppCata.bppCataTitle}}</li>
          <li class="range">所属BU：
             <span v-for="(item, index) in data.nlrList" :key="index" v-if="item.labelType == 10">
              {{item.labelName}}
            </span>
          </li>
          <li class="range">所属栏目：
            <span v-for="(item, index) in data.nlrList" :key="index" v-if="item.labelType == 4">
              {{item.labelName}}
            </span>
          </li>
          <li class="range">赛事标签：
            <span v-for="(item, index) in data.nlrList" :key="index" v-if="item.labelType == 4">
              {{item.labelName}}
            </span>
          </li>
          <li class="range">球队球员标签：
            <span v-for="(item, index) in data.nlrList" :key="index" v-if="item.labelType == 8 || item.labelType == 9">
              {{item.labelName}}、
            </span>
          </li>
          <li>自定义标签：
            <span v-for="(item, index) in data.nlrList" :key="index" v-if="item.labelType == 11">
              {{item.labelName}}
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div class="titleRange">
      <div class="titleContent" @click="statusShow">
        <span class="lineHeight">状态</span>
        <i :class="['lineHeight fonts',{'sn-icon-triangle-down':statusFlag,'sn-icon-triangle-up':!statusFlag}]"></i>
      </div>
      <div class="detailContent" v-if="statusFlag">
        <ul>
          <li class="range">
            分端状态：<span v-for="(item, index) in terminal" :key="index">{{item.key}} {{item.name}}；</span>
          </li>
          <li class="range region-block">
            地域屏蔽：
           <region-block ref="regionBlock" :dialogVisible.sync="dialogVisible" :regionMap.sync="regionMap">
               <sn-button type="primary" @click="openBlockCitySet">查看详情</sn-button>
            </region-block>
          </li>
          <li v-if="data.terminal">前端分类：{{showFrontClassifyData()}}</li>
        </ul>
      </div>
    </div>
    <div class="titleRange">
      <div class="titleContent" @click="onshelfShow">
        <span class="lineHeight">上架状态</span>
        <i :class="['lineHeight fonts',{'sn-icon-triangle-down':onshelfFlag,'sn-icon-triangle-up':!onshelfFlag}]"></i>
      </div>
      <div class="detailContent" v-if="onshelfFlag">
        <ul v-if="ccrList">
          <li class="range" v-for="(item, index) in ccrList" :key="index">{{item.subjectType}}：{{item.subjectName}}（{{item.status}}）</li>
        </ul>
      </div>
    </div>
    <div class="titleRange">
      <div class="titleContent" @click="videoFlowShow">
        <span class="lineHeight">视频流管理</span>
        <i :class="['lineHeight fonts',{'sn-icon-triangle-down':videoFlowFlag,'sn-icon-triangle-up':!videoFlowFlag}]"></i>
      </div>
      <div class="videoBox" v-if="videoFlowFlag">
        <sn-datatable :data="data.fileList" :border="true">
          <sn-datacolumn label="FT" prop="ft" :width="44">
          </sn-datacolumn>
          <sn-datacolumn label="属性" prop="vt" :width="60">
          </sn-datacolumn>
          <sn-datacolumn label="码流" prop="bitrate" :width="60">
          </sn-datacolumn>
          <sn-datacolumn label="文件名" prop="fileName" :width="284">
          </sn-datacolumn>
          <sn-datacolumn label="时长" prop="duration" :width="73" :formatter="secoundToZHTime">
          </sn-datacolumn>
          <sn-datacolumn label="高度*宽度" prop="height" :width="74">
          </sn-datacolumn>
          <sn-datacolumn label="文件大小" prop="fileSize" :width="71" :formatter="transToMbUnit">
          </sn-datacolumn>
          <sn-datacolumn label="时间" prop="createTime" :formatter="getCreateTime">
          </sn-datacolumn>
          <template slot-scope="{row}" slot="height">
            <span>{{row.height}}*{{row.weight}}</span>
          </template>
        </sn-datatable>
      </div>
    </div>
    <div>
      <div class="titleContent" @click="operaShow">
        <span class="lineHeight">操作记录</span>
        <i :class="['lineHeight fonts',{'sn-icon-triangle-down':operaFlag,'sn-icon-triangle-up':!operaFlag}]"></i>
      </div>
      <div class="detailContent" v-if="operaFlag">
        <div v-for="(item, index) in data.opLog" :key="index" v-if="item">
          {{item}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Constant from 'js/constant';
import { CHANNEL_LIST } from 'js/constant';
import RegionBlock from 'widgets/video//region-block';
import { secoundToZHTime, formatDate } from 'utils/util';
import DI from 'interface';

export default {
  components: {
    RegionBlock
  },
  name: 'detail-confirm',
  props: {
    channelId: {
      type: Number
    }
  },

  data() {
    return {
      dialogVisible: false,
      videoInfoFlag: false,
      collectionFlag: false,
      labelFlag: false,
      statusFlag: false,
      onshelfFlag: false,
      videoFlowFlag: false,
      operaFlag: false,
      playList: [],
      data: {},
    };
  },
  computed: {
    regionMap: {
      get() {
        let terminal = this.data.terminal || {};
        return CHANNEL_LIST.reduce((obj, channel) => {
          if (channel.key !== 'all') {
            let temp = terminal[channel.key] || {};
            obj[channel.key] = {
              city: temp.forbidden ? temp.forbidden.split(',') : [],
              blockReason: temp.forbiddenReason || 1,
              blockStrength: temp.forceForbidden ? 1 : 2,
              securityPolicy: temp.ottSafe || '10'
            };
          }
          return obj;
        }, {});
      }
    },
    contentType() {
      switch (this.data.contentType) {
        case 0:
          return '正片';
          break;
        case 1:
          return '预告';
          break;
        case 2:
          return '花絮';
          break;
        case 3:
          return '其它非正片';
          break;
        case 4:
          return '看点';
          break;
        case 5:
          return '音频';
          break;
        case 6:
          return '音乐';
          break;
      }
    },
    videoTypeShow() {
      return Constant.getItemByValue(Constant.VIDEO_TYPE, this.data.vt).name;
    },
    videoStatus() {
      return Constant.getItemByValue(Constant.VIDEO_STATUS, this.data.status).name;
    },
    videoLanguage() {
      return Constant.getItemByValue(Constant.VIDEO_LANGUAGE, this.data.videoLanguage).name;
    },
    caption() {
      return Constant.getItemByValue(Constant.VIDEO_CAPTION, this.data.caption).name;
    },
    terminal() {
      if (this.data && this.data.terminal) {
        let terminalList = this.data.terminal;
        let newTerminalList = [];
        for (const key in terminalList) {
          let terminalObj = {};
          terminalObj.key = Constant.getItemByValue(Constant.TERMINAL_NAME, key).name;
          terminalObj.name = Constant.getItemByValue(Constant.TERMINAL_STATUS, terminalList[key].status).name;
          newTerminalList.push(terminalObj);
        }
        return newTerminalList;
      }
    },
    ccrList() {
      if (this.data && this.data.ccrList && this.data.ccrList.length) {
        let ccrList = this.data.ccrList;
        let ccrListNew = [];
        for (let index = 0; index < ccrList.length; index++) {
          let ccrObj = {};
          ccrObj.subjectType = Constant.getItemByValue(Constant.INFO_NEW_CHANNEL_TYPE, ccrList[index].subjectType).name;
          ccrObj.subjectName = ccrList[index].subjectName;
          ccrObj.status = Constant.getItemByValue(Constant.ONSHELF_STATUS, ccrList[index].status).name;
          ccrListNew.push(ccrObj);
        }
        return ccrListNew;
      } else {
        return [];
      }
    }
  },
  mounted() {
    this.getVideoDetail(this.channelId);
  },
  created() {
    this.secoundToZHTime = secoundToZHTime;
  },
  methods: {
    showFrontClassifyData() {
      let cataArr = this.data.terminal.ikan.epgCata;
      return cataArr.reduce((cataStr, item) => {
        if (!cataStr) {
          cataStr = item.epgCataTitle;
        } else {
          cataStr += `,${item.epgCataTitle}`;
        }
        return cataStr;
      }, '');
    },
    openBlockCitySet() {
      this.$refs.regionBlock.hiddenBtn();
      this.dialogVisible = true;
    },
    transToMbUnit(value) {
      return (value / 1024 / 1024).toFixed(2, 10) + 'MB';
    },
    getVideoDetail(param) {
      let ajaxData = {
        channelId: param
      };
      this.$ajax({
        url: DI.publish.getVideoDetail,
        data: JSON.stringify(ajaxData),
        loadingText: '正在查询当前信息，请稍候！',
        context: this,
        success: res => {
          if (res.retCode == '0') {
            const data = res.data || {};
            if (Object.keys(data) && Object.keys(data).length) {
              this.data = data;
              this.data.opLog = data.opLog ? data.opLog.split('/n') : [];
              // this.getPlayList();
              this.setConfigInfo();
            }
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    videoInfoShow() {
      this.videoInfoFlag = !this.videoInfoFlag;
    },
    collectionShow() {
      this.collectionFlag = !this.collectionFlag;
    },
    labelShow() {
      this.labelFlag = !this.labelFlag;
    },
    statusShow() {
      this.statusFlag = !this.statusFlag;
      this.dialogVisible = false;
    },
    onshelfShow() {
      this.onshelfFlag = !this.onshelfFlag;
    },
    videoFlowShow() {
      this.videoFlowFlag = !this.videoFlowFlag;
    },
    operaShow() {
      this.operaFlag = !this.operaFlag;
    },
    getCreateTime(time) {
      let publishTimeShow = '';
      let formatTime = '';
      if (time) {
        formatTime = Number(time.toString().padEnd(13, '0'));
      }
      publishTimeShow = formatDate(formatTime, 'yyyy-MM-dd hh:mm:ss');
      return publishTimeShow;
    },
    getPlayList() {//占时用不到的请求
      this.$ajax({
        url: 'http://api2.v.pptv.com/api/openapi/channel.js?id=' + this.channelId,
        // url: 'http://api2.v.pptv.com/api/openapi/channel.js?id=' + 26721737,
        noBaseUrl: true,
        loadingText: '正在查询，请稍候！',
        dataType: 'jsonp',
        jsonp: 'cb',
        type: 'GET',
        context: this,
        success: res => {
          if (res.err == '0') {
            const data = res.data || [];
            // this.playList = data;
            // this.setConfigInfo();
          } else {
            this.$message.error(res.msg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    setConfigInfo() {
      window.webcfg = {
        isSports: 0,
        player: {
          createConfig: {
            playerConfig: { setting: { wn: 1 } },
            ctx: this.data.param,
            playList: [{ id: this.channelId, mn: 9999, rid: true }],
            playerType: this.data.vt == 0 || this.data.vt == 4 ? 'live' : 'vod',
            // flashvars: { pay: 0, ap: false }
          }
        },
        plugin: {
          force: 3,
          properties: { videotype: 1 },
          tips: { interval: 30000, times: 1, display: 10000 },
          blacklist: [
            'hao123ku',
            'v.360.cn',
            'movie.hao123.com',
            'tv.hao123.com',
            'v.tao123.com',
            '21c9b038e5b1b4868c40b7bd614ed33c',
            '123.sogou.com'
          ],
          type: 1,
          forceVersion: '1.0.0.53',
          update: true
        },
        recommend_type: 1,
        recommend_config: ['huaxu', ['actor', 'director', 'type', 'series'], 'vip', 'love']
      };
      console.log(this.data.vt, 'aaaaaaaaaaa');
      let pptvbox = document.getElementById('pptv_playpage_box');
      webcfg.player.createConfig['playerbox'] = pptvbox;
      let player = new PPTVPlayer(webcfg.player.createConfig);
      if (!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
        player.playVideo({ cid: this.channelId });
      }
    }
  }
};
</script>

<style >
.v-modal {
  z-index: 99 !important;
}
.content {
  width: 830px;
  /* overflow: auto;
  max-height: 600px; */
  .titleRange {
    padding-bottom: 2px;
  }
  .titleContent {
    height: 32px;
    background-color: #f2f2f2;
    display: flex;
    justify-content: space-between;
    padding: 0 40px;
    .lineHeight {
      line-height: 32px;
      font-size: 16px;
      color: #333333;
    }
    .fonts {
      font-size: 35px;
      color: #cccccc;
    }
  }
  .detailContent {
    padding: 14px 0 14px 40px;
    font-size: 14px;
  }
  .videoBox {
    padding: 14px 0 14px 0;
    width: 780px;
    margin: 0 auto;
  }
  .range {
    padding-bottom: 12px;
  }
  .region-block {
    display: flex;
    justify-content: flex-start;
  }
  .collectionBox {
    padding: 14px 0 2px 40px;
    font-size: 14px;
  }
  .videoPlay {
    width: 750px;
    height: 420px;
    margin: 0 auto;
  }
}
</style>
