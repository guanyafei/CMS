
<template>
  <div class="container">
    <sn-topbar title="频道展示管理-合集管理" labels="视频合集管理,赛事视频楼层维护" @tab="tabChange">
      <span slot="subtitle">频道名称: {{channel.channelName}} 频道ID: {{channelId}}</span>
    </sn-topbar>
    <div v-show="tabIndex == 0">
      <section class="ibox end">
        <sn-button type="primary" @click="submitVideoColShow(false)">添加视频合集</sn-button>
      </section>
      <sn-table :data='vCollList' ref='vColTable'>
        <sn-table-column label='顺序' width='130' sloted>
          <template slot-scope='row'>
            {{row.$index+1}}
          </template>
        </sn-table-column>
        <sn-table-column label='合集ID' prop='vedioSetId' width='130' align="center"></sn-table-column>
        <sn-table-column label='合集标题' prop='vedioTitle' width='350' align="center"></sn-table-column>
        <sn-table-column label='展示数量' prop='vedioDisNum' width="100" align="center"></sn-table-column>
        <sn-table-column label='展示样式' align="center" sloted>
          <template slot-scope="row">
            {{getVideoDisType(row.vedioDisType)}}
          </template>
        </sn-table-column>
        <sn-table-column label='操作' sloted width='160'>
          <template slot-scope='row'>
            <div class="is-column">
              <p class="operate-par">
                <a v-if="row.$index > 0" @click="moveVideoCol(-1,row.$index)" href="javascript:;">上移</a>
                <a v-if="(row.$index+1) < vColCount " @click="moveVideoCol(1,row.$index)" href="javascript:;">下移</a>
              </p>
              <p>
                <a href="javascript:;" @click="showDiverConfirm(row)">分集展示管理</a>
              </p>
              <p class="operate-par">
                <a href="javascript:;" @click="showDelConf(row.id)">删除</a>
                <a href="javascript:;" @click="submitVideoColShow(true,row)">编辑</a>
              </p>
            </div>
          </template>
        </sn-table-column>
      </sn-table>
    </div>
    <div v-show="tabIndex == 1">
      <section class="ibox end">
        <div class="btns">
          <sn-button type="primary" @click="showMatchVideoPop">添加赛事</sn-button>
        </div>
      </section>
      <sn-table :data='matchVideoList' ref='table1'>
        <sn-table-column label='顺序' width='150' sloted>
          <template slot-scope='row'>
            {{row.$index+1}}
          </template>
        </sn-table-column>
        <sn-table-column label='前端分类' prop='mipMatchId' width='150' align='center'></sn-table-column>
        <sn-table-column label='赛事ID' prop='matchId' width="190" align='center'></sn-table-column>
        <sn-table-column label='赛事logo' prop='matchLogo' width="220" sloted>
          <template slot-scope='row'>
            <img class="match-logo" alt="" :src="row.matchLogo" />
          </template>
        </sn-table-column>
        <sn-table-column label='赛事名称' prop='matchName' align='center'></sn-table-column>
        <sn-table-column label='操作' sloted width='160'>
          <template slot-scope='row'>
            <div class="is-column">
              <p class="operate-par">
                <a href="javascript:;" @click="showDelVideoConfirm(row.id)">删除</a>
              </p>
              <p class="operate-par">
                <a v-if="row.$index > 0" @click="moveMatchVideo(1,row.id)" href="javascript:;">上移</a>
                <a v-if="(row.$index+1) < mVideoCount " @click="moveMatchVideo(2,row.id)" href="javascript:;">下移</a>
              </p>
            </div>
          </template>
        </sn-table-column>
      </sn-table>
    </div>
    <!---视频合集删除确认框-->
    <sn-confirm txt ref="delColConf" :flag="delConfFlag" @sure="delVideoCol(delVideoColId)" @close="hideDelConf">
      确定要删除吗？
    </sn-confirm>
    <!---赛事视频楼层删除确认框-->
    <sn-confirm txt ref="delMVideoConf" :flag="delMVideoFlag" @sure="delMatchVideo(delMVideoId)" @close="hideDelVideoConfirm">
      确定要删除吗？
    </sn-confirm>
    <!---赛事视频楼层添加弹框-->
    <sn-confirm ref="addMatchVideoPop" title='添加赛事' txt @sure="submitMatchVideo" @close="HideMatchVideoPop" :flag="submitMatchPopFlag" confirmButtonText="添加">
      <sn-form :model="matchVideoData" ref="submitMVideoForm" :rules="submitMVideoRole" label-width="100px" formWidth="420">
        <sn-form-item label="前端分类" prop="mipMatchId">
          <sn-input placeholder="请输入前端分类" v-model="matchVideoData.mipMatchId" width="340" />
        </sn-form-item>
        <sn-form-item label="运动分类" prop="sportItemId">
          <sn-select v-model="matchVideoData.sportItemId" placeholder="请选择" radius="6" width="340" @change="getSportId">
            <sn-option
              v-for="item in mipMatchList"
              :name="item.sportItemName"
              :value="item.sportItemId"
              :key="item.sportItemId"
              :disabled="item.disabled">
            </sn-option>
          </sn-select>
        </sn-form-item>
        <sn-form-item label="赛事名称" prop="matchId">
          <sn-select v-model="matchVideoData.matchId" placeholder="请选择" radius="6" width="340" @change="getMatchInfo">
            <sn-option
              v-for="item in matchList"
              :name="item.competitionName"
              :value="item"
              :key="item.competitionName"
              :disabled="item.disabled">
            </sn-option>
          </sn-select>
        </sn-form-item>
        <sn-form-item label="赛事logo" prop="matchLogo">
          <sn-cropper v-model='matchVideoData.matchLogo' ref="cropper" label="封面" width="180" height="180" :aspectRatio="aspectRatio"></sn-cropper>
        </sn-form-item>
      </sn-form>
    </sn-confirm>
    <!---赛事合集添加弹框-->
    <sn-confirm ref="addVideoColPop" :title='submitVideoTitle' txt @sure="submitVideoCol" @close="submitVideoColHide" :flag="submitVideoPopFlag" confirmButtonText="保存">
      <sn-form :model="videoColData" ref="submitVideoForm" :rules="submitVideoRole" label-width="80px" formWidth="420">
        <sn-form-item label="合集ID" prop="vedioSetId">
          <sn-input placeholder="请输入合集ID" v-model="videoColData.vedioSetId" width="310" :disabled="this.submitVideoTitle==='编辑'" @blur="queryvedioset" />
        </sn-form-item>
        <sn-form-item label="合集标题" prop="vedioTitle">
          <sn-input placeholder="请输入合集标题" v-model="videoColData.vedioTitle" width="310" />
        </sn-form-item>
        <sn-form-item label="展示样式" prop="vedioDisType">
          <sn-select v-model="videoColData.vedioDisType" :disabled="submitVideoTitle == '编辑'" placeholder="请选择" radius="6" width="310" @change="handleDisType">
            <sn-option
              v-for="item in disTypeList"
              :name="item.name"
              :value="item.value"
              :key="item.value"
              :disabled="item.disabled">
            </sn-option>
          </sn-select>
        </sn-form-item>
        <sn-form-item v-show="vedioDisNumIsShow" label="展示数量" prop="vedioDisNum" ref="vedioDisNum">
          <sn-input placeholder="请输入展示数量" :disabled="submitVideoTitle == '编辑'" v-model="videoColData.vedioDisNum" width="310" @change='vedioDisNumChangeHandler' />
        </sn-form-item>
      </sn-form>
    </sn-confirm>
    <sn-confirm closeIcon ref="diverRef" title='' txt :flag="diverFlag" @close="closeDiver" :sureBtnIsShow="false" :hideCancelButton="true">
      <sn-form formWidth="1050">
        <div class="diverWrap" style="display:flex;">
          <div style="width:50%;">
            <div style="position: absolute;margin-top: -51px;margin-left: 235px;">
              合集分集列表
            </div>
            <div style="text-align: left;color:#1684C2;margin-bottom:10px;">
              合集ID：{{curVideoId}}
            </div>
            <sn-table :data='diverList' ref='diverList'>
              <sn-table-column label='序号' width='13%' sloted>
                <template slot-scope='row'>
                  {{(pageIndex?(pageIndex-1)*pageSize:0)+row.$index+1}}
                </template>
              </sn-table-column>
              <sn-table-column label='分集信息' align="left" width='50%' prop='info' sloted>
                <template slot-scope="row">
                  <div class="adv-info">
                    <div class="img-wrap">
                      <img class="adv-img" :src="row.sloturl+'?'+Math.random()" onerror="javascript:this.src='';" alt="pic" />
                      <p class="id-info">ID:{{row.vedioId}}</p>
                    </div>
                    <span class="adv-title">{{handleTitle(row.title)}}</span><br>
                  </div>
                </template>
              </sn-table-column>
              <sn-table-column label='是否展示' prop='pay' width="20%" align="center" sloted>
                <template slot-scope="row">
                  {{getStatus(row.vedioId)}}
                </template>
              </sn-table-column>
              <sn-table-column label='操作' sloted width='20%'>
                <template slot-scope='row'>
                  <div class="is-column">
                    <p class="operate-par">
                      <a v-if="!(getStatus(row.vedioId) == '是')" href="javascript:;" @click="setDisplay(row)">设为展示</a>
                    </p>
                  </div>
                </template>
              </sn-table-column>
              <sn-pagination :total="dataTotal" :size="pageSize" @goto="goto" />
            </sn-table>
          </div>
          <div style="width:50%;">
            <div style="position: absolute;margin-top: -51px;margin-left: 235px;">
              展示分集列表
            </div>
            <div style="text-align: left;color:#1684C2;margin-bottom:10px;margin-left: 20px;">
              展示数量：{{vedioDisNum}}
            </div>
            <sn-table :data='diverList2' ref='diverList2'  style="margin-left:20px;">
              <sn-table-column label='序号' width='13%' sloted>
                <template slot-scope='row'>
                  {{row.$index+1}}
                </template>
              </sn-table-column>
              <sn-table-column label='分集信息' align="left" width='60%' prop='info' sloted>
                <template slot-scope="row">
                  <div class="adv-info">
                    <div class="img-wrap">
                      <img class="adv-img" :src="row.sloturl+'?'+Math.random()" onerror="javascript:this.src='';" alt="pic" />
                      <p class="id-info">ID:{{row.vedioId}}</p>
                    </div>
                    <span class="adv-title">{{handleTitle(row.title)}}</span><br>
                  </div>
                </template>
              </sn-table-column>
              <sn-table-column label='操作' sloted width='30%'>
                <template slot-scope='row'>
                  <div class="is-column">
                    <a v-if="row.$index > 0" @click="moveDiverCol(-1,row.$index)" href="javascript:;">上移</a>
                    <a v-if="(row.$index+1) < diverList2.length " @click="moveDiverCol(1,row.$index)" href="javascript:;">下移</a>
                    <a href="javascript:;" @click="showEditImg(row)">编辑图片</a>
                    <a href="javascript:;" @click="showDelDiver(row)">删除</a>
                  </div>
                </template>
              </sn-table-column>
            </sn-table>
            <div class="btn-block" v-if="diverList2.length" style="margin-top:20px;margin-left:113px;">
              <sn-button size="mini" type="primary" @click="saveDiverList" style="margin-right:20px;">保存</sn-button>
              <sn-button size="mini" @click="cancel">取消</sn-button>
            </div>
          </div>
        </div>
      </sn-form>
    </sn-confirm>
    <!---展示分集删除确认框-->
    <sn-confirm txt :flag="delDiverFlag" @sure="delDiverCol()" @close="hideDiverConf">
      确定要删除吗？
    </sn-confirm>
    <!-- 编辑图片框 -->
    <sn-confirm txt :flag="editImgFlag" @sure="saveImgCol" @close="hideImgConf" title="编辑图片">
      <sn-form :model="ruleForm" :rules="imgRules" ref="ruleForm" label-width="80px" formWidth="444">
        <sn-form-item label="封面" prop="img">
          <sn-cropper :aspectRatio="16/9" v-model="ruleForm.img" ref="cropper" label="封面" width="175" height="131"></sn-cropper>
        </sn-form-item>
      </sn-form>
    </sn-confirm>
  </div>
</template>
<script>
import DI from 'interface';
import * as Constant from 'js/constant';
export default {
  props: {
    channel: {
      //获取频道列表页面传过来的row
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      channelId: this.channel.channelId,
      tabIndex: 0,
      vCollList: [], //视频合集列表
      vColCount: 0, //视频合集总数
      delConfFlag: false, //合集删除确认框开关
      delVideoColId: '', //删除视频合集ID
      submitVideoPopFlag: false, //合集添加弹框开关
      disTypeList: Constant.VIDEO_DIS_TYPE, //合集展示样式列表
      submitVideoTitle: '', //视频合集弹框标题
      vedioList: [], // 视频合集查询出来的数据
      videoColData: {
        //合集数据(添加合集)
        vedioSetId: '', //ID
        vedioTitle: '', //标题
        vedioDisType: '', //展示样式
        vedioDisNum: '' //展示数量
      },
      submitVideoRole: {
        //添加合集规则
        vedioSetId: [
          {
            required: true,
            message: '请输入合集Id',
            trigger: 'change'
          }
        ],
        vedioTitle: [
          {
            required: true,
            min: 2,
            max: 20,
            message: '请输入合集标题，长度为[2,20]个字符',
            trigger: 'change'
          }
        ],
        vedioDisType: [
          {
            required: true,
            message: '请选择合集样式',
            trigger: 'change'
          }
        ],
        vedioDisNum: [
          {
            required: false,
            message: '请输入展示数量，只能为不大于10的偶数',
            trigger: 'change'
          }
        ]
      },
      submitMVideoRole: {
        //添加赛事视频规则
        mipMatchId: [
          {
            required: true,
            message: '请选择前端分类',
            trigger: 'change'
          }
        ],
        matchId: [
          {
            required: true,
            type: 'number',
            message: '请选择比赛名称',
            trigger: 'change'
          }
        ],
        sportItemId: [
          {
            required: true,
            type: 'number',
            message: '请选择项目',
            trigger: 'change'
          }
        ],
        matchLogo: [
          {
            required: true,
            message: '请上传赛事logo',
            trigger: 'change'
          }
        ]
      },
      matchVideoList: [], //赛事视频列表
      mVideoCount: 0, //赛事视频数据总数
      delMVideoFlag: false, //赛事视频删除确认弹框
      delMVideoId: '', //删除赛事视频Id
      submitMatchPopFlag: false, //添加比赛弹框开关
      matchVideoData: {
        //添加赛事视频数据
        channelId: '',
        matchId: '',
        matchLogo: '',
        matchName: '',
        mipMatchId: '',
        sportItemId: ''
      },
      mipMatchList: [], //添加赛事视频--前端分类列表
      matchList: [], //添加赛事视频--赛事列表
      isEven: true, // 展示数量是否为偶数
      aspectRatio: 1 / 1,
      diverList: [],
      diverList2: [],
      diverFlag: false,
      pageIndex: 0, //默认是0
      pageSize: 12, //默认是20
      dataTotal: 2, //查询出来的数据条数
      curDiverId: '',
      curVideoId: '',
      vedioDisNum: '',
      delDiverFlag: false,
      editImgFlag: false,
      ruleForm: {
        img: ''
      },
      imgRules: {
        img: [
          {
            required: true,
            message: '请上传图片',
            trigger: 'change'
          }
        ]
      },
      curContent: {},
      sourceData: {}
    };
  },
  mounted() {
    this.queryColList(); //视频合集列表查询
    this.tabChange(this.tabIndex);
  },
  computed: {
    // 展示样式为轮播的时候不显示展示数量输入框，栏目的时候显示，默认显示
    vedioDisNumIsShow() {
      return this.videoColData.vedioDisType !== '1';
    }
  },
  watch: {
    diverFlag(val) {
      $('body, html').css('overflow', val ? 'hidden' : 'visible');
    }
  },
  methods: {
    setDisplay(row) {
      if (this.diverList2.length >= this.sourceData.vedioDisNum2 && this.sourceData.vedioDisType == 2) {
        this.diverList2.pop();
        this.curIds.pop();
      } else {
        if (this.vedioDisNum >= 12) {
          this.diverList2.pop();
          this.curIds.pop();
        } else {
          this.sourceData.vedioDisType == 1 && this.vedioDisNum++;
        }
      }
      this.diverList2.unshift(row);
      this.curIds.unshift(row.vedioId);
    },
    moveDiverCol(flag, index) {
      // -1上移 1下移
      let temp = this.diverList2[index];
      if (flag == -1) {
        this.diverList2.splice(index, 1);
        this.diverList2.splice(index - 1, 0, temp);
      } else {
        this.diverList2.splice(index, 1);
        this.diverList2.splice(index + 1, 0, temp);
      }
    },
    showEditImg(row) {
      this.editImgFlag = true;
      this.ruleForm.img = row.sloturl || '';
      this.curContent = row;
    },
    hideImgConf() {
      this.editImgFlag = false;
    },
    saveImgCol() {
      this.editImgFlag = false;
      this.diverList2[this.curContent.$index].sloturl = this.ruleForm.img.replace(/\&/g, '%26');
    },
    showDelDiver(row) {
      this.curContent = row;
      this.delDiverFlag = true;
    },
    hideDiverConf() {
      this.delDiverFlag = false;
    },
    delDiverCol() {
      this.delDiverFlag = false;
      this.diverList2.splice(this.curContent.$index, 1);
      this.curIds.splice(this.curContent.$index, 1);
      this.sourceData.vedioDisType == 1 && this.vedioDisNum--;
    },
    handleTitle(title) {
      return title && title.length > 32 ? title.substring(0, 30) + '...' : title;
    },
    goto(num) {
      this.pageIndex = num;
      this.queryVideoSetList();
      $('.sn-popup-content').scrollTop(0);
    },
    showDiverConfirm(row) {
      this.sourceData = row;
      this.diverFlag = true;
      this.curVideoId = row.vedioSetId;
      this.curDiverId = row.id;
      this.curIds = this.getIds(row.contentAttachment);
      this.diverList2 = $.parseJSON(row.contentAttachment);
      this.vedioDisNum = row.vedioDisNum || this.diverList2.length;
      this.sourceData.vedioDisNum2 = this.vedioDisNum;
      this.queryVideoSetList();
    },
    getIds(data) {
      let tempJson = $.parseJSON(data);
      let ids = [];
      tempJson.filter(item => {
        ids.push(item.vedioId);
      });
      return ids;
    },
    getStatus(id) {
      let flag = '';
      this.curIds.filter(item => {
        if (id == item) {
          flag = '是';
          return false;
        }
      });
      return flag;
    },
    saveDiverList() {
      if (this.diverList2.length != this.sourceData.vedioDisNum2 && this.sourceData.vedioDisType == 2) {
        //1 轮播 2 栏目
        this.$message.warning('视频展示数量不正确！');
        return;
      }

      this.$ajax({
        url: DI.channelDisplay.saveAttachment,
        data: {
          id: this.curDiverId,
          contentAttachment: JSON.stringify(this.diverList2)
        },
        context: this,
        contentType: 'application/x-www-form-urlencoded',
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('保存成功！');
            this.closeDiver();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    filterData(list) {
      list.filter(item => {
        item.sloturl = item.sloturl.replace(/\&/g, '%26');
        item.sloturl = item.sloturl.replace(/\+/g, '%2B');
        item.title = item.title.replace(/\&/g, '%26');
        item.title = item.title.replace(/\+/g, '%2B');
      });
      return list;
    },
    cancel() {
      this.closeDiver();
      // this.curVideoId = this.sourceData.vedioSetId;
      // this.curDiverId = this.sourceData.id;
      // this.curIds = this.getIds(this.sourceData.contentAttachment);
      // this.diverList2 = $.parseJSON(this.sourceData.contentAttachment);
      // this.vedioDisNum = this.sourceData.vedioDisNum2 || this.diverList2.length;
    },
    queryVideoSetList(id) {
      let params = '?pageNo=' + this.pageIndex + '&pageSize=' + this.pageSize + '&videoSetId=' + this.curVideoId;
      this.$ajax({
        url: DI.channelDisplay.pageQueryVideoSet + params,
        data: {},
        context: this,
        type: 'GET',
        success: res => {
          if (res.retCode == '0') {
            this.diverList = res.data.videoArray || [];
            this.dataTotal = parseInt(res.data.num) || 0;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    closeDiver() {
      this.diverFlag = false;
      this.pageIndex = 0;
      this.diverList = [];
      this.dataTotal = 0;
      this.diverList2 = [];
      this.curIds = [];
      this.$bus.$emit('syncCurPage', 1);
      $('.sn-popup-content').scrollTop(0);
      this.queryColList();
    },
    getVideoDisType(val) {
      //获取视频展示类型(根据类型ID)
      return Constant.getItemByValue(Constant.VIDEO_DIS_TYPE, val).name;
    },
    // 展示数量校验规则，只能不大于10的偶数
    vedioDisNumChangeHandler() {
      let regexp = /^[2468]$|^10$/;
      let result = regexp.test(this.videoColData.vedioDisNum);
      if (!result) {
        this.isEven = false;
        this.$refs.vedioDisNum.vaildTrigger(false, '请输入不大于10的偶数');
      } else {
        this.isEven = true;
      }
    },
    queryColList() {
      //视频合集列表查询
      let _self = this;
      this.$ajax({
        url: DI.channelDisplay.queryColList,
        data: {
          channelId: _self.channelId || 1 //频道Id
        },
        context: this,
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || [];
            _self.vCollList = resData; //视频合集列表
            let videoList = _self.vCollList;
            _self.vColCount = videoList.length; //获取视频合集总数
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    moveVideoCol(flag, index) {
      //视频合集上移下移
      let _self = this,
        moveFlag = parseInt(flag); //上下移标志
      let curVideoCol = _self.vCollList[index]; //获取当前操作行
      let curId = curVideoCol.id;
      let anoVideoCol = _self.vCollList[index + moveFlag]; //获取移动目标行
      let anotherId = anoVideoCol.id;
      this.$ajax({
        url: DI.channelDisplay.moveVideoCol,
        data: {
          id: anotherId, //移动后Id
          idEx: curId //移动Id
        },
        context: this,
        type: 'GET',
        success: res => {
          if (res.retCode == '0') {
            _self.queryColList();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    showDelConf(id) {
      //删除视频合集确认框显示
      this.delConfFlag = true;
      this.delVideoColId = id;
    },
    hideDelConf() {
      //删除视频合集确认框隐藏
      this.delConfFlag = false;
    },
    delVideoCol(DelId) {
      //视频合集删除
      let _self = this;
      _self.delConfFlag = false;
      this.$ajax({
        url: DI.channelDisplay.delVideoCol,
        data: {
          id: DelId //删除合集Id
        },
        context: this,
        type: 'GET',
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('删除成功！');
            _self.queryColList();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    submitVideoColShow(isEdit, rowItem) {
      //添加视频合集弹框显示
      this.submitVideoPopFlag = true;
      let videoColData = this.videoColData;
      if (isEdit) {
        this.submitVideoTitle = '编辑';
        videoColData.vedioSetId = String(rowItem.vedioSetId);
        videoColData.vedioTitle = rowItem.vedioTitle;
        this.handleDisType(rowItem.vedioDisType);
        videoColData.vedioDisNum = rowItem.vedioDisNum ? rowItem.vedioDisNum + '' : '';
        this.vedioDisNumChangeHandler();
        videoColData.id = rowItem.id;
      } else {
        this.submitVideoTitle = '添加视频合集';
      }
    },
    submitVideoColHide() {
      //添加视频合集弹框隐藏
      let videoColData = this.videoColData;
      videoColData.vedioSetId = '';
      videoColData.vedioTitle = '';
      videoColData.vedioDisType = '';
      videoColData.vedioDisNum = '';
      this.$refs.submitVideoForm.resetFields();
      this.submitVideoPopFlag = false;
    },
    handleDisType(val) {
      //获取合集展示样式类型
      this.videoColData.vedioDisType = val + '';
      this.videoColData.vedioDisNum = '';
    },
    // 选择合集的change事件
    vedioSetChangeHandler(val) {
      this.videoColData.vedioSetId = val + '';
    },
    // 输入合集ID的时候，失焦的时候会查询，带出合集ID
    queryvedioset() {
      let vedioSetId = this.videoColData.vedioSetId;
      let videoColData = this.videoColData;
      videoColData.vedioTitle = '';
      videoColData.vedioDisType = '';
      videoColData.vedioDisNum = '';
      let postBody = {
        videoId: vedioSetId
      };
      this.$ajax({
        url: DI.channel.queryVideoDetail,
        data: postBody,
        contentType: 'application/x-www-form-urlencoded',
        context: this,
        success: res => {
          if (res.retCode == '0') {
            if (res.data.vt === '22') {
              this.$message.success('查询成功');
              this.videoColData.vedioTitle = res.data.title;
            } else {
              this.$message.warning('此ID不是合集ID！！');
              this.videoColData.vedioSetId = '';
            }
          } else {
            this.$message.error(res.retMsg);
            this.videoColData.vedioSetId = '';
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    submitVideoCol() {
      //提交合集数据(新增&编辑)
      let _self = this,
        videoColData = _self.videoColData,
        videoDisNum = videoColData.vedioDisNum;
      let postBody = {
        id: videoColData.id,
        vedioSetId: videoColData.vedioSetId,
        vedioTitle: videoColData.vedioTitle, //合集标题
        vedioDisType: videoColData.vedioDisType, //展示类型
        vedioDisNum: videoColData.vedioDisNum //展示数量
      };
      if (postBody.vedioDisType == 1) {
        delete postBody.vedioDisNum;
        this.isEven = true;
      }
      this.$refs.submitVideoForm.validate(valid => {
        if (valid && this.isEven && (!this.vedioDisNumIsShow || this.videoColData.vedioDisNum)) {
          this.$ajax({
            url: DI.channelDisplay.saveVideoCol,
            data: postBody,
            context: this,
            contentType: 'application/x-www-form-urlencoded',
            success: res => {
              if (res.retCode == '0') {
                _self.submitVideoColHide();
                this.$message.success('提交成功！');
                this.queryColList();
              } else {
                this.$message.error(res.retMsg);
              }
            },
            error: () => {
              console.error('error');
            }
          });
        } else {
          if (!this.isEven || !this.videoColData.vedioDisNum) {
            this.$refs.vedioDisNum.vaildTrigger(false, '请输入不大于10的偶数');
          }
          console.log('submit err');
          return false;
        }
      });
    },
    queryMVideoList() {
      //查询赛事视频楼层列表
      let _self = this;
      this.$ajax({
        url: DI.channelDisplay.matchVideoList,
        data: {
          channelId: _self.channelId || 1 //频道Id
        },
        context: this,
        type: 'GET',
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            _self.matchVideoList = resData.categoryMatchList || []; //视频合集列表
            let mVideoList = _self.matchVideoList;
            _self.mVideoCount = mVideoList.length; //获取赛事视频楼层总数
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    tabChange(index) {
      //tab切换方法
      this.tabIndex = index;
      if (index == 0) {
        this.queryColList();
      }
      if (index == 1) {
        this.queryMVideoList();
      }
    },
    showDelVideoConfirm(id) {
      //删除赛事视频楼层显示
      this.delMVideoFlag = true;
      this.delMVideoId = id;
    },
    hideDelVideoConfirm() {
      //删除赛事视频楼层隐藏
      this.delMVideoFlag = false;
    },
    delMatchVideo(DelId) {
      //赛事视频楼层删除
      let _self = this;
      _self.delMVideoFlag = false;
      this.$ajax({
        url: DI.channelDisplay.delMatchVideo + '?channelId=' + (_self.channelId || 1) + '&id=' + DelId,
        type: 'GET',
        context: this,
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('删除成功！');
            _self.queryMVideoList();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    showMatchVideoPop() {
      //赛事视频添加弹框显示
      this.submitMatchPopFlag = true;
      this.queryProjectInfo();
    },
    HideMatchVideoPop() {
      //赛事视频添加弹框隐藏
      this.matchVideoData.mipMatchId = '';
      this.matchList = [];
      this.matchVideoData.matchId = '';
      this.matchVideoData.matchLogo = '';
      this.matchVideoData.matchName = '';
      this.matchVideoData.sportItemId = '';
      this.$refs.submitMVideoForm.resetFields();
      this.submitMatchPopFlag = false;
    },
    submitMatchVideo() {
      //赛事视频添加
      let _self = this;
      let mVideoData = _self.matchVideoData;
      let postBody = {
        channelId: _self.channelId || 1, //频道ID
        matchId: mVideoData.matchId, //赛事id
        matchLogo: mVideoData.matchLogo, //赛事logo
        matchName: mVideoData.matchName, //赛事名称
        mipMatchId: mVideoData.mipMatchId //前端分类
      };
      // 提交表单的空值校验
      this.$refs.submitMVideoForm.validate(valid => {
        if (valid) {
          this.$ajax({
            url: DI.channelDisplay.addMVideoList,
            data: JSON.stringify(postBody),
            context: this,
            success: res => {
              if (res.retCode == '0') {
                _self.HideMatchVideoPop();
                _self.queryMVideoList();
                this.$message.success('提交成功！');
              } else {
                this.$message.error(res.retMsg);
              }
            },
            error: () => {
              console.error('error');
            }
          });
        } else {
          console.log('submit err');
        }
      });
    },
    getSportId(val) {
      //根据赛事获取赛事logo
      this.matchVideoData.sportItemId = val;
      this.matchVideoData.matchId = '';
      this.matchVideoData.matchLogo = '';
      this.queryMatchList(val);
    },
    getMatchInfo(item) {
      let matchData = this.matchVideoData;
      matchData.matchId = item.competitionId;
      matchData.matchName = item.competitionName;
      matchData.matchLogo = item.competitionLogo;
    },
    queryProjectInfo() {
      //添加赛事视频--获取前端类型列表
      let _self = this;
      this.$ajax({
        url: DI.channelDisplay.getProjectInfo,
        data: {},
        context: this,
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            _self.mipMatchList = resData.list || []; //赛事类型列表
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    queryMatchList(typeVal) {
      //添加赛事视频--获取赛事列表
      let _self = this;
      this.$ajax({
        url: DI.channelDisplay.getMatchList + '?sportItemId=' + typeVal,
        context: this,
        type: 'GET',
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            _self.matchList = resData.list || []; //赛事列表
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    moveMatchVideo(flag, id) {
      //比赛视频楼层上移下移
      let _self = this,
        moveFlag = parseInt(flag); //上下移标志
      this.$ajax({
        url: DI.channelDisplay.moveMatchVideo,
        data: {
          channelId: _self.channelId || 1,
          id: id, //移动Id
          movingState: moveFlag
        },
        context: this,
        contentType: 'application/x-www-form-urlencoded',
        success: res => {
          if (res.retCode == '0') {
            _self.queryMVideoList();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    }
  }
};
</script>

<style scoped>
.container {
  .ibox {
    display: flex;
    align-items: center;
    height: auto;
    min-height: 72px;
    padding: 0 20px;
    background: #fff;
    margin-bottom: 10px;
    &.end {
      justify-content: flex-end;
    }
    &.between {
      justify-content: space-between;
    }
    .search-box {
      .time-box {
        display: flex;
        align-items: center;
        height: 30px;
        font-size: 12px;
        color: #999999;
        margin-bottom: 20px;
        margin-top: 20px;
        .time-text {
          margin-right: 10px;
        }
        .split {
          margin: 0 8px;
        }
      }
      .input-box {
        margin-bottom: 20px;
      }
      .select-box {
        display: flex;
        height: 30px;
        align-items: center;
        margin-bottom: 20px;
        color: #999;
        .text {
          margin-right: 10px;
        }
      }
    }
    .btns {
      display: flex;
      flex-direction: column;
      button {
        & + button {
          margin-top: 20px;
        }
      }
    }
  }
  .ibox-empty {
    margin-bottom: 10px;
  }
  a {
    color: #1684c2;
    margin-bottom: 2px;
    & + a {
      margin-left: 0;
    }
    &:hover {
      text-decoration: underline;
    }
  }
  .header {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 40px;
    background: #eee;
    color: #666;
  }
  .operate-par {
    padding: 5px 0;
  }
  .remind-par {
    display: none;
    margin-top: -13px;
    padding-left: 80px;
    color: #f00;
    font-size: 12px;
  }
  .match-logo {
    width: 160px;
    height: 160px;
  }
  .adv-info {
    display: flex;
    align-items: center;
    height: 100%;
    .img-wrap {
      position: relative;
      height: 100%;
      .id-info {
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 0;
        width: 100%;
        height: 22px;
        line-height: 22px;
        color: #fff;
        background: rgba(0, 0, 0, 0.6);
      }
      .adv-img {
        display: inline-block;
        width: 113px;
        height: 80px;
      }
    }
    .adv-title {
      padding-left: 8px;
      line-height: 1.3;
      text-align: left;
    }
  }
}
</style>
