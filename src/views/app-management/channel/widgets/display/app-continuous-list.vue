<template>
    <!-- app 连版-->
    <div id="appList">
        <section class="ibox between">
            <div class="search-box">
            <div class="time-box">
                <span class="time-text">生效时间</span>
                <sn-timer width="180" ref="filterTimeS" :maxDate="query.endTime" v-model="query.startTime" showTimepicker/>
                <span class="split">至</span>
                <sn-timer width="180" ref="filterTimeE" :minDate="query.startTime" v-model="query.endTime" showTimepicker/>
            </div>
            <div class="input-box">
                <span class="text text-title">广告标题</span>
                <sn-input class="adv-title" width="178" radius="16" v-model="query.advTitle" placeholder="请输入广告标题" :maxlength="30"></sn-input>
            </div>
            <div class="select-box">
                <span class="text">跳转类型</span>
                <sn-select v-model="query.advJumpType" ref="select" placeholder="请选择" radius="16" width="120" @change="handleJumpType" class="jump-type">
                <sn-option name="全部" value="''"></sn-option>
                <sn-option v-for="item in advJumpList" :name="item.name" :value="item.value" :key="item.value" :disabled="item.disabled">
                </sn-option>
                </sn-select>
            </div>
            </div>
            <div class="btns">
            <sn-button type="primary" @click="searchAdvCon">查询</sn-button>
            <sn-button type="outline reset-button" @click="reset">重置</sn-button>
            <sn-button type="outline" @click="showAdvPopup(true)">添加广告</sn-button>
            </div>
        </section>
        <sn-table :data="appList" ref="appListTable">
            <sn-table-column label="顺序" width="4%" sloted>
                <template slot-scope="row">
                    {{(page.index - 1)* page.size + row.$index+1}}
                </template>
            </sn-table-column>
            <sn-table-column label="标题" width="12.2%" sloted>
                <template slot-scope="row">
                    <div class="ta-left">
                    <p class="id-info">ID：{{row.advId}}</p>
                    <p class="adv-title">{{row.advTitle}}</p>
                    </div>
                </template>
            </sn-table-column>
            <sn-table-column label="封面" width="10%" align="center" sloted>
                <template slot-scope="row">
                    <img :alt="row.advTitle" class="adv-img" :src="row.advImgUrl|smallImage(150)" width="120px" height="80px" />
                </template>
            </sn-table-column>
            <sn-table-column label="跳转类型" width="6%" sloted>
                <template slot-scope="row">
                    {{row.advJumpType | getJumpType}}
                </template>
            </sn-table-column>
            <sn-table-column label="跳转链接" width="9%" prop="advJumpUrl"></sn-table-column>
            <sn-table-column label="展示标签" width="6%" prop="showLabel"></sn-table-column>
            <!-- <sn-table-column label="展示标签" width="6%" prop="showLabel" v-show="tabIndex == 2"></sn-table-column> -->
            <sn-table-column label="生效时间" width="6.6%" prop="startTime" v-show="tabIndex == 2"></sn-table-column>
            <sn-table-column label="失效时间" width="6.6%" prop="endTime" v-show="tabIndex == 2"></sn-table-column>
            <sn-table-column label="广告状态" width="5%" align="center" prop="advStatus" sloted v-show="tabIndex == 0">
                <template slot-scope="row">
                    {{row.advStatus |　getAdvStatus}}
                </template>
            </sn-table-column>
            <sn-table-column label="操作" width="6%" align="center" sloted>
                <template slot-scope="row">
                    <div class="is-column">
                        <div style="margin-bottom:10px">
                            <a href="javascript:;" @click="delAppAdv(row)">删除</a>
                            <a href="javascript:;" @click="showAdvPopup(false, row)">设置</a>
                        </div>
                        <div>
                            <a v-if="row.$index > 0 || page.index !==1" @click="moveVideoCol(1,row.$index,row)" href="javascript:;">上移</a>
                            <a v-if="(row.$index+1+(page.index - 1)*page.size) < page.total " @click="moveVideoCol(2,row.$index,row)" href="javascript:;">下移</a>
                        </div>
                    </div>
                </template>
            </sn-table-column>
        </sn-table>
      <sn-pagination ref="appPageTurn" :total="page.total" :size="page.size" @goto="advGoto" />

        <!-- 添加广告&设置广告 -->
        <sn-confirm ref="advPopup" :title="advDialog.title" txt @sure="submitAdvFun" @close="advDialog.isShow = false" :flag="advDialog.isShow">
            <sn-form :model="advData" ref="addAdvForm" :rules="addAdvRules" label-width="80px" formWidth="400">
                <sn-form-item label="广告标题" prop="advTitle">
                <sn-input placeholder="请输入广告标题" v-model="advData.advTitle" width="310" :maxlength="30" />
                </sn-form-item>
                <sn-form-item label="封面" prop="advImgUrl" ref="advImgUrl">
                    <sn-cropper :aspectRatio="694/360" v-model="advData.advImgUrl" ref="cropper" label="封面" width="250" height="140" isScoped></sn-cropper>
                </sn-form-item>
                <sn-form-item label="跳转类型" prop="advJumpType" id="pcAdvImg-p">
                <sn-select v-model="advData.advJumpType" placeholder="请选择" radius="4" width="310" @change="changeFormAdvJumpType">
                    <sn-option v-for="item in jumpTypeList" :name="item.name" :value="item.value" :key="item.value" :disabled="editFlag">
                    </sn-option>
                </sn-select>
                </sn-form-item>
                <sn-form-item :label="jumpLabel" prop="advJumpUrl">
                    <sn-input :placeholder="jumpPlaceholder" v-model="advData.advJumpUrl" width="306" @blur="queryVedioSet" :disabled="editFlag" />
                </sn-form-item>
                <sn-form-item label="合集ID" prop="vedioSet" v-show="vedioSetIsShow">
                <sn-select v-model="advData.vedioSetId" ref="vedioselect" placeholder="请选择" width="306" @change="vedioSetChangeHandler">
                    <sn-option name='请选择' value=''></sn-option>
                    <sn-option v-for="item in vedioList" :key="item.setId" :title="item.setId+':'+item.setTitle" :name="handleCidTitle(item)" :value="item.setId" :disabled="item.disabled"></sn-option>
                </sn-select>
                </sn-form-item>
                <sn-form-item label="展示标签" prop="showLabel">
                    <sn-input placeholder="请输入展示标签" v-model="advData.showLabel" width="310" :maxlength="4" />
                </sn-form-item>
                <div class="time-field">
                    <sn-form-item label="生效时间" prop="startTime" class="start-time" ref="startTime">
                        <sn-timer width="138" radius="4" v-model="advData.startTime" :maxDate="advData.endTime" showTimepicker @change="startTimeChange"></sn-timer>
                    </sn-form-item>
                    <sn-form-item label="至" prop="endTime" class="end-time" ref="endTime">
                        <sn-timer width="138" radius="4" v-model="advData.endTime" :minDate="advData.startTime" showTimepicker @change="endTimeChange"></sn-timer>
                    </sn-form-item>
                </div>
            </sn-form>
        </sn-confirm>
    </div>
</template>
<script>
import DI from 'interface';
import * as Constant from 'js/constant';
import { VIDEOSET_URL } from 'utils/envUrl';
export default {
  name: 'AppList',
  props: ['tabIndex', 'channel'],
  data() {
    return {
      appList: [],
      advJumpList: Constant.JUMP_TYPE, //查询跳转类型列表,
      jumpTypeList: Constant.JUMP_TYPE, //添加,设置广告跳转类型列表
      vedioSetIsShow: false, // 跳转类型选择视频的时候，根据选择的视频查询，如果对应的视频有合集，显示组件，默认不显示
      jumpLabel: '跳转地址',
      editFlag: false,
      vedioList: [],
      query: {
        startTime: '',
        endTime: '',
        advTitle: '',
        advJumpType: ''
      },
      page: {
        index: 1,
        size: 20,
        total: 0
      },
      //广告表单提交数据(添加&设置共用)
      advData: {
        advId: '', //设置广告时使用
        channelId: '', //设置广告时使用
        advTitle: '',
        advImgUrl: '', //广告图片
        advJumpType: '', //跳转类型
        advJumpUrl: '', //跳转地址
        videoId: '', //视频ID(跳转类型为MIP视频)
        vedioSetId: '', //合集ID(跳转为视频时)
        showLabel: '', //展示标签
        startTime: '',
        endTime: ''
      },
      addAdvRules: {
        //添加广告表单规则
        advTitle: [
          { required: true, message: '请输入广告标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'change' }
        ],
        advImgUrl: [{ required: true, message: '请上传广告封面', trigger: 'blur' }],
        advJumpType: [{ required: true, type: 'number', message: '请选择跳转类型', trigger: 'change' }],
        advJumpUrl: [{ required: true, type: 'string', message: '请输入跳转地址', trigger: 'blur' }],
        videoId: [{ required: true, type: 'string', message: '请输入视频ID', trigger: 'blur' }],
        showLabel: [{ required: false, min: 2, max: 4, message: '请输入展示标签，长度为2-4个字符', trigger: 'change' }],
        startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
        endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
      },
      advDialog: {
        isShow: false,
        title: ''
      }
    };
  },
  filters: {
    //获取跳转类型(根据类型ID)
    getJumpType(val) {
      return Constant.getItemByValue(Constant.LIST_JUMP_TYPE, val).name;
    },
    //获取广告状态(根据状态ID)
    getAdvStatus(val) {
      return Constant.getItemByValue(Constant.ADV_STATUS, val).name;
    }
  },
  methods: {
    //重置
    reset() {
      for (let key in this.query) {
        this.query[key] = '';
      }
      this.page.index = 1;
      this.page.size = 20;
    },
    //翻页
    advGoto(val) {
      this.queryConList(val);
      this.page.index = val;
    },
    //跳转类型
    handleJumpType(val) {
      if (val == "''") {
        val = '';
      }
      this.query.advJumpType = val;
      this.page.index = 1;
      this.queryConList();
      this.$refs.appPageTurn.reset();
    },
    //格式化视频名称
    handleCidTitle(item) {
      return item.setId + ':' + (item.setTitle && item.setTitle.length > 15 ? item.setTitle.slice(0, 15) + '...' : item.setTitle);
    },
    //跳转类型选择
    changeFormAdvJumpType(val) {
      this.advData.advJumpType = val;
      this.vedioSetIsShow = false;
      this.advData.advJumpUrl = '';
      this.jumpLabel = Constant.ADVMENT_LABEL[val - 1].label;
      this.jumpPlaceholder = Constant.ADVMENT_LABEL[val - 1].placeholder;
    },
    // 选择合集的change事件
    vedioSetChangeHandler(val) {
      this.advData.vedioSetId = val + '';
      this.$parent.editFloorInfo.vedioSetId = val + '';
    },
    // 如果选择的跳转类型是视频，输入视频ID的时候需要查询是否有合集ID，若有显示合集ID的输入框
    queryVedioSet() {
      if (this.jumpLabel === '视频ID') {
        let vedioId = this.advData.advJumpUrl;
        if (!vedioId && !this.vedioSetIsShow) return;
        $.ajax({
          url: `${VIDEOSET_URL}/bppchannel.api?id=${parseInt(vedioId)}&showset=1&format=jsonp`,
          dataFilter: function(data) {
            return data;
          },
          dataType: 'jsonp',
          type: 'GET',
          context: this,
          loadingText: '正在查询，请稍候。。。',
          success: res => {
            if (res.channels && res.channels.length) {
              this.vedioSetIsShow = true;
              this.vedioList = res.channels[0].setRelates;
            } else {
              this.vedioSetIsShow = false;
            }
          },
          error: () => {
            console.error('error');
            this.vedioSetIsShow = false;
          }
        });
      } else {
        return false;
      }
    },
    //接收查询参数
    searchAdvCon() {
      let getStartTime = parseInt(new Date(this.query.startTime).getTime(), 10),
        getEndTime = parseInt(new Date(this.query.endTime).getTime(), 10);
      if (getStartTime >= getEndTime) {
        this.$message.warning('开始时间不能大于或等于结束时间');
        return false;
      }
      this.page.index = 1;
      this.queryConList();
      this.$refs.appPageTurn.reset();
    },
    //查询
    queryConList(pageIndex) {
      //连版广告列表查询
      let startTime = this.query.startTime,
        endTime = this.query.endTime;
      pageIndex = pageIndex == undefined ? this.page.index : pageIndex;
      // 更改了结束时间或者开始时间，页面上会改变现实，但是没有触发时间，真实时间从dom中取
      if (startTime) {
        startTime = this.$refs.filterTimeS.$refs.input.value + ':00';
      }
      if (endTime) {
        endTime = this.$refs.filterTimeE.$refs.input.value + ':00';
      }
      this.$ajax({
        url: DI.continueAdv.queryList,
        data: JSON.stringify({
          advJumpType: this.query.advJumpType, //跳转类型
          advTitle: this.query.advTitle,
          channleId: this.channel.subjectId, //频道Id
          pageIndex: (pageIndex - 1) * this.page.size,
          pageSize: this.page.size,
          startTime: startTime,
          endTime: endTime,
          terminalType: 1 //app连版
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            let resData = res.data || {};
            this.appList = resData.list || []; //广告列表
            this.page.total = resData.listNum || 0; //数据总条数
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    showAdvPopup(isNew, row) {
      this.editFlag = !isNew;
      if (isNew) {
        //新增
        this.advDialog.title = '添加广告';
        this.advData.advImgUrl = '';
        this.$refs.addAdvForm.resetFields();
      } else {
        //设置
        this.advDialog.title = '设置广告';
        if (row) {
          this.advData = { ...row };
          // 截取时间去掉秒 显示在编辑框中
          this.advData.startTime = row.startTime.substring(0, 16);
          this.advData.endTime = row.endTime.substring(0, 16);
          // 视频贴还原为帖子类型
          if (row.advJumpType == 10) {
            this.advData.advJumpType = 3;
          }
        }
        this.jumpLabel = Constant.ADVMENT_LABEL[this.advData.advJumpType - 1].label;
        this.advJumpUrl = row.advJumpUrl;
      }
      this.advDialog.isShow = true;
    },
    // 提交广告(添加广告&设置广告)
    submitAdvFun() {
      let interfaceStr = '',
        advData = this.advData,
        editFlag = this.editFlag,
        getStartTime = parseInt(new Date(advData.startTime).getTime(), 10),
        getEndTime = parseInt(new Date(advData.endTime).getTime(), 10),
        channelId = '';
      if (getStartTime >= getEndTime) {
        this.$message.warning('开始时间不能大于或等于结束时间');
        return false;
      }
      if (editFlag) {
        //设置
        //判断是否是设置广告,提交接口、channelId不一样
        interfaceStr = DI.continueAdv.advUpdate;
        channelId = advData.channleId;
      } else {
        //添加
        interfaceStr = DI.continueAdv.advAdd;
        channelId = this.channel.subjectId;
      }
      let advJumpType = advData.advJumpType;
      // 查询帖子信息是否为视频贴
      if (advJumpType == 3) {
        this.$ajax({
          url: DI.channel.getTopicInfo,
          data: JSON.stringify({
            topicId: advData.advJumpUrl
          }),
          context: this,
          loadingText: '正在校验帖子信息，请稍候！',
          success: res => {
            if (res.retCode == '0') {
              let data = res.data || {};
              if (data.isVideoTopic) {
                advJumpType = 10; // 设置为视频贴
              }
              submitNextStep.call(this, advJumpType);
            } else {
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.error('error');
          }
        });
      } else {
        submitNextStep.call(this, advJumpType);
      }
      function submitNextStep(advJumpType) {
        this.$refs.addAdvForm.validate(valid => {
          if (valid) {
            this.$ajax({
              url: interfaceStr,
              data: JSON.stringify({
                advId: advData.advId, //设置广告使用
                advImgUrl: advData.advImgUrl, //广告图片
                advJumpType: advJumpType, //跳转类型
                advJumpUrl: advData.advJumpUrl || advData.videoId, //跳转链接
                advTitle: advData.advTitle,
                channleId: channelId,
                endTime: advData.endTime + ':00', //添加秒
                showLabel: advData.showLabel,
                startTime: advData.startTime + ':00', //添加秒
                vedioSetId: advData.vedioSetId, //合集ID(跳转类型为视频时)
                terminalType: 1 //app连版
              }),
              context: this,
              loadingText: '正在保存，请稍候！',
              success: res => {
                if (res.retCode == '0') {
                  // 如果是编辑刷新当前页 如果是创建重置为首页
                  if (editFlag) {
                    this.queryConList();
                  } else {
                    this.queryConList(1);
                  }
                  this.advDialog.isShow = false;
                  setTimeout(() => {
                    if (editFlag) {
                      this.$message.success('编辑成功！');
                    } else {
                      this.$message.success('添加成功！');
                    }
                  }, 800);
                } else {
                  this.$message.error(res.retMsg);
                }
              },
              error: () => {
                console.error('error');
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    },
    //上下移动
    moveVideoCol(flag, index, row) {
      let moveFlag = parseInt(flag); //上下移标志
      let postBody = {
        advId: row.advId, //广告id
        channleId: this.channel.subjectId, // 频道id
        moveLogo: moveFlag, // 移动标识，1上移，2下移
        terminalType: 1 //app连版
      };
      this.$ajax({
        url: DI.continueAdv.advMove,
        data: JSON.stringify(postBody),
        context: this,
        loadingText: '正在加载，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.queryConList();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    //删除
    delAppAdv(row) {
      this.$confirm('您确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        mask: true
      })
        .then(() => {
          this.$ajax({
            url: DI.continueAdv.advDel,
            data: JSON.stringify({
              advId: row.advId, //广告Id
              channleId: this.channel.subjectId //频道Id
            }),
            context: this,
            loadingText: '正在删除，请稍候！',
            success: res => {
              if (res.retCode == '0') {
                this.queryConList();
                this.$message.success('删除成功！');
              } else {
                this.$message.error(res.retMsg);
              }
            },
            error: () => {
              // console.log('error');
            }
          });
        })
        .catch(er => {});
    },
    // 开始时间的监听事件
    startTimeChange(val) {
      val && this.$refs.startTime.resetField();
      this.advData.startTime = val;
    },
    // 结束时间的监听事件
    endTimeChange(val) {
      val && this.$refs.endTime.resetField();
      this.advData.endTime = val;
    },
  },
  mounted() {
    this.queryConList();
  }
};
</script>
<style scoped>
#appList {
  .ibox {
    display: flex;
    align-items: center;
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
    &.p20 {
      padding-top: 20px;
      padding-bottom: 20px;
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
        .dropdown-list {
          top: -10px;
        }
      }
      .text-title {
        display: inline-block;
        float: left;
        margin-right: 10px;
        line-height: 25px;
        color: #999;
      }
      .input-box {
        margin-bottom: 8px;
      }
      .select-box {
        display: flex;
        height: 30px;
        align-items: center;
        margin-bottom: 10px;
        padding-top: 25px;
        padding-bottom: 20px;
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
  .is-column a {
    color: #1684c2;
  }
  .time-field {
    display: flex;
    .start-time {
      position: relative;
      background-color: #fff;
    }
    .end-time {
      margin-left: -50px;
    }
  }
  .reset-button {
    border-color: #ccc;
    color: #666;
  }
}
</style>
<style>
  .form-item .form-item__content .form-item__error{
    position: relative !important;
    text-align:left !important;
  }
</style>


