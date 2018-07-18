<template>
  <div class="container">
    <sn-topbar title="内容列表" labels="评论引导,评论账号维护" @tab="tabChange" :index="tabIndex">
    </sn-topbar>
    <div v-show="tabIndex == 0">
      <section class="ibox between">
        <div class="search-box">
          <div class="contentBox">
            <sn-input class="adv-title" width="178" radius="16" v-model="formData.contentInput" placeholder="请输入内容ID" :maxlength="32" style="margin-right: 30px"></sn-input>
          </div>
          <div class="time-box">
            <span class="text">内容类型</span>
            <sn-select v-model="formData.contentType" ref="select" placeholder="全部" radius="16" width="120" @change="handleContentType" class="jump-type">
              <sn-option v-for="item in contentTypeList" :name="item.name" :value="item.value" :key="item.value" :disabled="item.disabled">
              </sn-option>
            </sn-select>
            <span class="text">上架频道</span>
            <sn-select v-model="formData.channelId" ref="select" placeholder="全部" radius="16" width="120" @change="handleChannelList" class="jump-type">
              <sn-option name="全部" value=""></sn-option>
              <sn-option v-for="item in (channelList || [])" :name="item.subjectName" :value="item.infoFlowId" :key="item.infoFlowId" :disabled="item.disabled">
              </sn-option>
            </sn-select>
          </div>
        </div>
        <div>
          <div style="margin-bottom: 20px">
            <sn-button type="primary" @click="searchCommentCon">查询</sn-button>
          </div>
          <div>
            <sn-button type="outline reset-button" @click="reset">重置</sn-button>
          </div>
        </div>
      </section>
      <sn-table :data="contentList" ref="table2">
        <sn-table-column label="内容信息" prop="contentId" width="150" sloted>
          <template slot-scope="row">
            <div style="flex-direction:column">
              <div style="padding-bottom: 10px">
                <p v-if="row.showType == 1">图文:{{row.contentId}}</p>
                <p v-if="row.showType == 2">图集:{{row.contentId}}</p>
                <p v-if="row.showType == 3">视频:{{row.contentId}}</p>
                <p v-if="row.showType == 4">MIP视频:{{row.contentId}}</p>
                <p v-if="row.showType == 8">日报:{{row.contentId}}</p>
                <p v-if="row.showType == 5">节目:{{row.contentId}}</p>
                <p v-if="row.showType == 9">PP类型:{{row.contentId}}</p>
                <p v-if="row.showType == 10">PGC视频:{{row.contentId}}</p>
              </div>
              <div>
                <p>{{row.title}}</p>
              </div>
            </div>
          </template>
        </sn-table-column>
        <sn-table-column label="上架频道" prop="subjectName" width="200" align="center"></sn-table-column>
        <sn-table-column label="上架更新时间" prop="updateTime" width="250" align="center">
        </sn-table-column>
        <sn-table-column label="评论数" prop="commentNum" width="100" align="center" sloted>
          <template slot-scope="row">
            <div class="commentBox">
              <a href="javascript:;" style="color: #1684C2; margin-bottom: 8px" @click="showComment(row)">真实评论：{{row.realCommentNum}}</a>
              <a href="javascript:;" style="color: #1684C2" @click="showComment(row)">填充评论：{{row.guideCommentNum}}</a>
            </div>
          </template>
        </sn-table-column>
        <sn-table-column label="点赞数" prop="likeNum" width="100" align="center" sloted>
          <template slot-scope="row">
            <div class="commentBox">
              <span style="margin-bottom: 8px">真实点赞：{{row.realLikeNum}}</span>
              <span>填充点赞：{{row.guideLikeNum}}</span>
            </div>
          </template>
        </sn-table-column>
        <sn-table-column label="操作" prop="likeNum" width="100" align="center" sloted>
          <template slot-scope="row">
            <div class="is-column">
              <div style="margin-bottom:10px">
                <p class="operaMore">
                  <a href="javascript:;" class="operaBtns" @click="showAddConfirm(row)">添加评论</a>
                </p>
                <p class="operaMore">
                  <a href="javascript:;" class="operaBtns" @click="showWidGet(row)">填充评论</a>
                </p>
                <p class="operaMore">
                  <a href="javascript:;" class="operaBtns" @click="showLikeNum(row)">修改点赞数</a>
                </p>
              </div>
            </div>
          </template>
        </sn-table-column>
      </sn-table>
      <sn-pagination ref="advPageTurn" :total="dataTotal" :size="pageSize" @goto="contentGoto" />
      <sn-confirm title="添加评论" txt @sure="saveCommentBtn" @close="cancelCommentBtn" :flag="commentFlag" confirmButtonText="保存">
        <sn-form ref="commonFloor" :model="editFloorInfo" :rules="floorRules" label-width="100px" formWidth="500">
          <sn-form-item label="发布账号" prop="resource">
            <sn-select v-model="virtualUserId" radius="6" width="350" @change="handleProductVal">
              <sn-option value="-1" name="自动分配"></sn-option>
              <sn-option v-for="item in (virtualUserList || [])" :name="item.virtualUserName" :value="item.virtualUserId" :key="item.virtualUserId" :disabled="item.disabled"></sn-option>
            </sn-select>
          </sn-form-item>
          <sn-form-item label="评论内容">
            <div style="width: 350px">
              <sn-input v-model="commContent" placeholder="请输入500个字以内评论内容" width="350" :showWord="true" type="textarea" :rows="4" :maxlength="500" :totalWords="500" @blur="displayError"></sn-input>
            </div>
          </sn-form-item>
          <div class="errTips" v-if="errContentTips">评论内容不可为空</div>
          <div class="form-upload">
            <p class="form-item_label">
              <span class="form-item_imgTxt">评论图片</span>
              <span class="img-tips">支持png、jpg、jpeg、gif格式,静态图片大小不大于1m,gif图片大小不大于8m</span>
            </p>
            <div class="sn-upload" @click="handleUploadBtnClick" v-if="uploadImgFlag">
              <span class="btn-text">点击上传图片</span>
              <i class="sn-icon-plus avatar-uploader-icon"></i>
            </div>
            <div class="form-item_img" v-if="showPicFlag">
              <img :src="imgVal" alt="" width="160" />
            </div>
            <p v-if="showPicFlag">
              <button class="btn edit-btn" @click="handleEditClick">
                <em></em>
                <slot name="btn-title">
                  <span>编辑图片</span>
                </slot>
              </button>
            </p>
          </div>
          <sn-form-item label="设置点赞数" prop="likeCount">
            <sn-input v-model="likeCount" width="350" placeholder="请输入" :maxlength="8"></sn-input>
          </sn-form-item>
          <form enctype="multipart/form-data" ref="formfile">
            <input type="file" name="file" ref="fileInput" class="sn-upload__input" @change="fileInputChangeHandler($event)">
          </form>
        </sn-form>
      </sn-confirm>
      <sn-confirm title="修改点赞数" txt @sure="saveLikeBtn" @close="cancelLikeBtn" :flag="likeFlag">
        <sn-form ref="commonFloor" :model="editFloorInfo" :rules="floorRules" formWidth="350" labelWidth="80px">
          <sn-form-item label="点赞数">
            <sn-input v-model="likeNumber" width="200" placeholder="请输入点赞数" :maxlength="8" inputType="number" />
            <span class="likeNumTips" v-if="likeNumErrFlag">输入的数字不能小于当前的真实点赞数</span>
          </sn-form-item>
        </sn-form>

      </sn-confirm>
    </div>
    <div v-show="tabIndex == 1">
      <section class="ibox end">
        <sn-button type="primary" @click="addNumberConfirm" :disabled="unClick">添加账号</sn-button>
      </section>
      <sn-table :data="(virtualUserList || [])" ref="table2">
        <sn-table-column label="用户ID" prop="virtualUserId" width="130" align="center"></sn-table-column>
        <sn-table-column label="昵称" prop="virtualUserName" width="350" align="center"></sn-table-column>
        <sn-table-column label="操作" prop="vedioDisNum" width="100" align="center" sloted>
          <template slot-scope="row">
            <div class="is-column">
              <div style="margin-bottom:10px;">
                <a href="javascript:;" style="color: #1684C2" @click="delComment(row)">删除</a>
              </div>
            </div>
          </template>
        </sn-table-column>
      </sn-table>
      <sn-confirm title="添加账号" txt @sure="saveConBtn" @close="cancelConBtn" :flag="addNumberFlag" confirmButtonText="保存">
        <sn-form ref="formData" :model="accountData" :rules="rules" label-width="100px" formWidth="400">
          <sn-form-item label="账号ID" prop="numberID">
            <sn-input v-model="accountData.numberID" width="250" placeholder="请输入账号ID" />
          </sn-form-item>
          <sn-form-item label="昵称" prop="labelUserName">
            <sn-input v-model="accountData.labelUserName" width="250" disabled/>
          </sn-form-item>
        </sn-form>
      </sn-confirm>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import emitter from 'mixins/emitter';
import { getImgPixelSize } from 'src/utils/image-operate';
import DI from 'interface';
import * as Constant from 'js/constant';

export default {
  mixins: [emitter],
  data() {
    return {
      likeCount: '',
      imgVal: '',
      uploadImgFlag: true,
      showPicFlag: false,
      file: '',
      fileName: '',
      imgFileSize: '',
      imgContentType: '',
      tabIndex: 0,
      addNumberFlag: false,
      contentList: [],
      commentFlag: false,
      virtualUserList: null,
      formData: {
        contentInput: '', //查询内容id
        contentType: '',
        channelId: ''
      },
      accountData: {
        numberID: '', //前台用户ID
        labelUserName: '' //昵称（添加账号）
      },
      pageIndex: 0, //默认是1
      pageSize: 20, //默认是20
      dataTotal: 0, //查询出来的数据条数
      contentTypeList: Constant.COMMENT_TYPE,
      channelList: null, //频道类型
      likeFlag: false,
      likeNumber: 0,
      likeNumberOld: 0,
      contentId: '',
      virtualUserId: '-1',
      authId: '', //内容类型为 1:资讯 时必填
      contentId: '',
      commContent: '',
      contentTitle: '',
      contentType: '',
      parentCommId: '',
      showType: '',
      rules: {
        numberID: [
          {
            required: true,
            message: '请输入账号ID',
            trigger: 'change'
          }
        ]
      },
      errContentTips: false,
      unClick: null,
      likeNumErrFlag: false
    };
  },
  mounted() {
    this.tabChange(this.tabIndex);
    this.queryChannel();
  },
  watch: {
    accountData: {
      handler(newValue, oldValue) {
        if (newValue.numberID.trim() === '') return;
        this.queryListByFilter(newValue);
      },
      deep: true
    }
  },
  methods: {
    handleEditClick() {
      this.$refs.fileInput.click();
    },
    handleUploadBtnClick() {
      this.$refs.fileInput.click();
    },
    fileInputChangeHandler(event) {
      const files = event.target.files;
      let _self = this;
      let imgFilePromiseChain = new Promise((resolve, reject) => {
        if (files && files.length) {
          resolve(files[0]);
        }
      })
        .then(file => {
          //格式校验
          if (/^image\/(jpe?g|gif|png)+/.test(file.type.toLowerCase())) {
            return file;
          } else {
            return Promise.reject('上传失败，只支持JPG、JPEG、PNG、GIF格式图片.');
          }
        })
        .then(file => {
          const isGif = /^image\/gif+/.test(file.type.toLowerCase());
          let imgFileSize = file.size;
          let curSizeStr = isGif ? '8M' : '1M';
          let maxImgSize = this.calSize(curSizeStr);
          let exceedSizeMsg = `图片大小超过${curSizeStr.toUpperCase()}`;
          if (maxImgSize > imgFileSize) {
            file.isGif = isGif;
            _self.fileName = file.name;
            _self.imgContentType = file.type;
            _self.imgFileSize = file.size;
            _self.file = file;
            return file;
          } else {
            return Promise.reject(`上传失败，${exceedSizeMsg}！`);
          }
        })
        .then(file => {
          let reader = new FileReader();
          reader.readAsDataURL(file);
          reader.addEventListener('load', function() {
            _self.uploadImg(reader.result);
          });
        })
        .catch(errMsg => {
          _self.$refs.fileInput.innerText = '';
          this.$message.error(errMsg);
        });
    },
    calSize(str) {
      let num = parseInt(str.replace(/[^0-9]/gi, ''), 10);
      let lowStr = str.toLowerCase();
      if (lowStr.indexOf('m') !== -1) {
        return num * 1024 * 1024;
      }

      return num * 1024;
    },
    uploadImg(url) {
      let name = this.fileName;
      this.$ajax({
        url: DI.common.uploadFileBase64,
        context: this,
        loadingText: '正在上传图片，请稍候！',
        data: JSON.stringify({
          base64File: url.substr(13 + this.imgContentType.length),
          fileName: name.replace(/\s/g, ''),
          contentType: this.imgContentType
        }),
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('上传成功!');
            this.imgVal = res.data;
            this.uploadImgFlag = false;
            this.showPicFlag = true;
            this.dispatch('FormItem', 'form.change', [res.data]);
          } else {
            this.$message.warning(res.retMsg);
          }
        },
        error: error => {
          this.$refs.fileInput.innerText = '';
          this.$message.error('网络异常，请联系运维人员！');
        }
      });
    },
    queryListByFilter: _.debounce(function(val) {
      this.insertNumber(val);
    }, 1000),
    tabChange(i) {
      this.tabIndex = i;
    },
    queryChannel() {
      this.$ajax({
        url: DI.g_comment.queryChannel,
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            const data = res.data || {};
            this.channelList = data.channelList || [];
            if (this.channelList.length === 0) {
              this.$message.warning('暂无频道列表数据信息.');
            } else {
              this.formData.channelId = this.channelList[0].infoFlowId;
              this.queryContentPage();
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
    insertNumber(param) {
      this.$ajax({
        url: DI.g_comment.queryUser,
        data: JSON.stringify({
          virtualUserId: param.numberID //前台用户id
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.accountData.labelUserName = res.data.virtualUserName || '';
            if (!res.data.virtualUserName) {
              this.$message.warning('您输入的账号id不存在');
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
    addNumberConfirm() {
      this.addNumberFlag = true;
      this.accountData.labelUserName = '';
      this.accountData.numberID = '';
    },
    showLikeNum(val) {
      this.likeFlag = true;
      this.likeNumber = val.likeNum;
      this.likeNumberOld = val.realLikeNum;
      this.contentType = val.contentType;
      this.contentId = val.contentId;
      this.showType = val.showType;
    },
    showAddConfirm(val) {
      this.commentFlag = true;
      this.contentId = val.contentId;
      this.contentTitle = val.title;
      this.contentType = val.contentType;
      if (val.contentType == 1) {
        this.authId = val.authId;
      } else {
        this.authId = '';
      }
    },
    cancelLikeBtn() {
      this.likeNumErrFlag = false;
      this.likeFlag = false;
    },
    saveLikeBtn() {
      if (this.likeNumber < this.likeNumberOld) {
        this.likeNumErrFlag = true;
        return;
      }
      this.$ajax({
        url: DI.g_comment.updateLikeNumNew,
        data: JSON.stringify({
          likeNum: this.likeNumber,
          contentType: this.showType,
          contentId: this.contentId
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
           this.cancelLikeBtn();
            setTimeout(() => {
              this.queryContentPage();
            }, 1000);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    handleContentType(val) {
      this.formData.contentType = val;
      this.queryContentPage();
    },
    handleChannelList(val) {
      this.formData.channelId = val;
      this.queryContentPage();
    },
    handleProductVal(val) {
      this.virtualUserId = val;
    },
    contentGoto(num) {
      this.pageIndex = num;
      this.queryContentPage(num);
      window.scrollTo(0, 0);
    },
    saveConBtn() {
      this.$ajax({
        url: DI.g_comment.addUser,
        data: JSON.stringify({
          virtualUserId: this.accountData.numberID //前台用户id
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.addNumberFlag = false;
            this.queryUsers();
            this.$refs.formData && this.$refs.formData.resetFields();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    displayError() {
      this.errContentTips = false;
    },
    saveCommentBtn() {
      if (this.commContent == '') {
        this.errContentTips = true;
        return;
      } else {
        this.errContentTips = false;
      }
      let pms = {};
      if (this.virtualUserId == -1) {
        pms.releaseType = 2;
      } else {
        pms.releaseType = 1;
        pms.virtualUserId = this.virtualUserId;
      }
      pms.likeNum = this.likeCount;
      pms.authId = this.authId;
      pms.contentId = this.contentId;
      pms.commContent = this.commContent;
      pms.contentTitle = this.contentTitle;
      pms.contentType = parseInt(this.contentType);
      if (!this.file) {
        this.handleSubmitData(pms);
      } else {
        getImgPixelSize(this.file, false).then(imgObj => {
          pms.commImgList = [
            {
              imgWidth: imgObj.width,
              imgHeight: imgObj.height,
              imgUrl: this.imgVal
            }
          ];
          this.handleSubmitData(pms);
        });
      }
    },
    handleSubmitData(params) {
      this.$ajax({
        url: DI.g_comment.publish,
        data: JSON.stringify(params),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.cancelCommentBtn();
            setTimeout(() => {
              this.queryContentPage();
            }, 1300);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    cancelCommentBtn() {
      this.file = '';
      this.likeCount = '';
      this.showPicFlag = false;
      this.uploadImgFlag = true;
      this.addCommentFlag = false;
      this.virtualUserId = '-1';
      this.commContent = '';
      this.errContentTips = false;
    },
    cancelConBtn() {
      this.addNumberFlag = false;
      this.accountData.labelUserName = '';
      this.accountData.numberID = '';
      this.$refs.formData && this.$refs.formData.resetFields();
    },
    cancelCommentBtn() {
      this.commentFlag = false;
      this.virtualUserId = '-1';
      this.commContent = '';
      this.errContentTips = false;
    },
    queryUsers() {
      this.$ajax({
        url: DI.g_comment.queryUsers,
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.virtualUserList = res.data.virtualUserList || [];
            if (this.virtualUserList.length > 9) {
              this.unClick = 'disabled';
            } else {
              this.unClick = null;
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
    queryContentPage(pageNum) {
      if (pageNum == 0) {
        this.pageIndex = pageNum;
        this.$bus.$emit('syncCurPage', 1);
      }
      this.pageIndex = pageNum ? (pageNum - 1) * this.pageSize : 0;
      this.$ajax({
        url: DI.g_comment.queryContentPage,
        data: JSON.stringify({
          channelId: this.formData.channelId,
          contentType: this.formData.contentType,
          pageIndex: this.pageIndex, //内容id非必填
          pageSize: this.pageSize //内容标题非必填
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.contentList = res.data.contentList || [];
            this.dataTotal = res.data.totalNum || 0;
            if (!this.virtualUserList) {
              this.queryUsers();
            }
            if (!this.channelList) {
              this.queryChannel();
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
    searchCommentCon() {
      this.$ajax({
        url: DI.g_comment.querySingleContent,
        data: JSON.stringify({
          contentId: this.formData.contentInput,
          contentType: this.formData.contentType
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.contentList = res.data.contentList || [];
            this.dataTotal = 0;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    reset() {
      this.formData.contentInput = '';
    },
    showWidGet(row) {
      row.$importTargetType = Constant.getItemByValue(Constant.COMMENT_CONTENT_TYPE, row.contentType).key;
      this.$emit('input', row);
      this.$emit('change-view', 'importTask');
    },
    delComment(val) {
      this.$ajax({
        url: DI.g_comment.delUser,
        data: JSON.stringify({
          virtualUserId: val.virtualUserId || '' //前台用户id
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.queryUsers();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    showComment(contentInfo) {
      //实现页面跳转
      this.$emit('input', contentInfo);
      this.$emit('change-view', 'comment');
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
        .text {
          margin-right: 10px;
        }
        .jump-type {
          margin-right: 20px;
        }
      }
      .input-box {
        margin-bottom: -10px;
      }
      .contentBox {
        display: flex;
        align-items: center;
        height: 30px;
        font-size: 12px;
        color: #999999;
        margin: 20px 0 10px 0;
      }
    }
  }
}
.labelName {
  display: block;
  text-align: left;
  width: 250px;
  height: 32px;
  line-height: 32px;
  background: lightgrey;
  border-radius: 4px;
  padding-left: 10px;
}
.operaMore {
  margin: 5px;
  .operaBtns {
    color: #1684c2;
  }
}
.errTips {
  color: red;
  font-size: 12px;
  position: relative;
  top: -10px;
  left: -100px;
}
.commentBox {
  display: flex;
  flex-direction: column;
}
.likeNumTips {
  color: red;
  font-size: 12px;
  margin-left: -60px;
}
.sn-upload {
  margin: 16px 0px;
  width: 160px;
  height: 160px;
  border: 1px dashed #a1a1a1;
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.btn-text {
  position: absolute;
  bottom: 50%;
  transform: translateY(53px);
  width: 100%;
  text-align: center;
  font-size: 14px;
}
.sn-icon-plus {
  background-image: url(../../../assets/icon-plus.png);
  display: inline-block;
  width: 100%;
  height: 100%;
  background-position-x: 50%;
  background-position-y: 50%;
  background-size: 80px 80px;
  background-repeat: no-repeat;
}
.sn-upload__input {
  display: none;
}
.img-tips {
  margin-left: 24px;
  display: inline-block;
  max-width: 313px;
  color: #c1c1c1;
  font-size: 12px;
}
.form-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  .form-item_label {
    display: flex;
    justify-content: flex-start;
    margin-left: -40px;
  }
  .form-item_imgTxt {
    font-size: 14px;
    color: #999;
  }
  .form-item_img {
    margin: 10px 0px;
    max-height: 200px;
    overflow: hidden;
  }
}
.btn {
  display: flex;
  align-items: center;
  margin: 0 auto;
  position: relative;
  top: -60px;
  em {
    width: 16px;
    height: 16px;
    margin-right: 5px;
    background-image: url(../../../assets/refresh.png);
    background-repeat: no-repeat;
    background-size: 16px 16px;
  }
}
.edit-btn {
  color: #ffffff;
  border: 1px solid #ffffff;
  padding: 5px 7px;
  border-radius: 16px;
}
.back {
  position: absolute;
  top: 23px;
  left: 18px;
  width: 20px;
  height: 20px;
  display: inline-block;
  background: url(../../../assets/back.png) no-repeat;
  background-size: cover;
}
</style>
