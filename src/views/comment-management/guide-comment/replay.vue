<template>
  <div class="container">
    <div class="navi-box">
      <p class="comList">回复列表</p>
      <a href="javascript:;" class="back" @click="goBackBtn">
      </a>
      <sn-topbar style="position: absolute;top: 10px;right: 0px;" labels="按发表时间,按点赞数,按回复数,按举报数" @tab="tabChange" :index="tabIndex"></sn-topbar>
    </div>
    <div>
      <section class="ibox between">
        <div class="search-box">
          <div class="search-box-top">
            <label class="labelTxt">评论ID：{{content.commId}}</label>
          </div>
          <div class="search-box-top">
            <span :title="content.commContent" class="ellipsis labelTxt">评论内容：{{content.commContent}}</span>
            <label>回复数：{{dataTotal}}</label>
          </div>
          <div class="selectBox">
            <span class="text">评论来源：</span>
            <sn-select v-model="formData.selectId" ref="select" placeholder="全部" radius="16" width="120" @change="handleFromList" class="jump-type">
              <sn-option name="全部" value=""></sn-option>
              <sn-option v-for="item in commentFromList" :name="item.name" :value="item.value" :key="item.key" :disabled="item.disabled">
              </sn-option>
            </sn-select>
          </div>
          <div class="search-box-bot">
            <sn-button type="success" @click="batchHandle">隐藏</sn-button>
          </div>
        </div>
        <div class="rightBtnBox">
          <div style="margin-bottom: 20px">
            <sn-button type="primary reset-button" @click="showWidGet">填充评论</sn-button>
          </div>
          <div>
            <sn-button type="outline reset-button" @click="addComment(1)">添加评论</sn-button>
          </div>
        </div>
      </section>
      <sn-datatable :data="commentList" ref="table3" :border="true">
        <sn-datacolumn label="自定义" prop="checkbox" width="5%" :column-border="false">
          <sn-checkbox type="checkbox" v-model="checkAll" @change="handleCheckAllChange"></sn-checkbox>
        </sn-datacolumn>
        <sn-datacolumn label="评论ID" prop="commId" width="15%"></sn-datacolumn>
        <sn-datacolumn label="评论内容" prop="commContent" width="16%"></sn-datacolumn>
        <sn-datacolumn label="发表时间" prop="createTime" width="8%"></sn-datacolumn>
        <sn-datacolumn label="评论人" prop="userNickName" width="10%"></sn-datacolumn>
        <sn-datacolumn label="状态" prop="commStatus" width="5%"></sn-datacolumn>
        <sn-datacolumn label="评论来源" prop="commSource" width="5%"></sn-datacolumn>
        <sn-datacolumn label="回复数" prop="replyNum" width="8%"></sn-datacolumn>
        <sn-datacolumn label="点赞数" prop="likeNum" width="10%"></sn-datacolumn>
        <sn-datacolumn label="举报数" prop="reportNum" width="3%"></sn-datacolumn>
        <sn-datacolumn label="操作" prop="vedioDisNum" width="15%"></sn-datacolumn>
        <template slot-scope="{row}" slot="checkbox">
          <sn-checkbox type="checkbox" v-model="curSelecteds" :label="row.commId"></sn-checkbox>
        </template>
        <template slot-scope="{row}" slot="commContent">
          <div class="com-content">
            <img v-img="{src:row.commImgList[0].imgUrl}" width="120px" height="80px" v-if="row.commImgList && row.commImgList[0] && row.commImgList[0].imgUrl" class="logo-img" alt="" :src="row.commImgList[0].imgUrl" />
            <div>
              <p class="contentDiv">{{row.commContent}}</p>
              <p class="mt-5 contentDiv" v-html="showcomComment(row)"></p>
            </div>
          </div>
        </template>
        <template slot-scope="{row}" slot="userNickName">
          <div style="flex-direction:column">
            <div style="padding-bottom: 10px">id：{{row.userId}}</div>
            <div style="padding-bottom: 10px">{{row.userNickName}}</div>
            <div class="day" v-show="row.forbiddenStatus!== 0 ">
              <sn-button type="warning">
                {{row.forbiddenStatus == 2 ? '永久禁言' : `禁言剩余${row.forbiddenDays}天`}}
              </sn-button>
            </div>
          </div>
        </template>
        <template slot-scope="{row}" slot="commStatus">
          {{row.commStatus == 1 ? "正常" : "隐藏"}}
        </template>
        <template slot-scope="{row}" slot="commSource">
          <span v-if="row.commSource == 1">前台</span>
          <span v-if="row.commSource == 2">引导</span>
          <span v-if="row.commSource == 3">灌水</span>
        </template>
        <template slot-scope="{row}" slot="replyNum">
          <div style="display:flex;flex-direction:column">
            <p style="padding-bottom: 10px">真实回复：{{row.realReplyNum}}</p>
            <p>填充回复：{{row.guideReplyNum}}</p>
          </div>
        </template>
        <template slot-scope="{row}" slot="likeNum">
          <div style="display:flex;flex-direction:column">
            <p style="padding-bottom: 10px">真实点赞：{{row.realLikeNum}}</p>
            <p>填充点赞：{{row.guideLikeNum}}</p>
          </div>
        </template>
        <template slot-scope="{row}" slot="reportNum">
          <div style="display:flex;flex-direction:column">
            <p>{{row.reportNum}}</p>
          </div>
        </template>
        <template slot-scope="{row}" slot="vedioDisNum">
          <div class="is-column">
            <div style="margin-bottom:10px">
              <p class="operaMore">
                <a v-if="row.commStatus == 1" href="javascript:;" class="operaBtns" @click="showHidConfirm(row)">隐藏</a>
                <a v-else href="javascript:;" class="operaBtns" @click="cancleHidConfirm(row)">取消隐藏</a>
              </p>
              <p class="operaMore">
                <a v-if="row.forbiddenStatus == 0" href="javascript:;" class="operaBtns" @click="showForbiConfirm(row,'ban')">用户禁言</a>
                <a v-else href="javascript:;" class="operaBtns" @click="showForbiConfirm(row,'free')">解除禁言</a>
              </p>
              <p class="operaMore">
                <a href="javascript:;" class="operaBtns" @click="showLikeConfirm(row)">修改点赞数</a>
              </p>
              <p class="operaMore">
                <a v-if="showReplyWords(row)" href="javascript:;" class="operaBtns" @click="addComment(2,row)">回复</a>
                <span href="javascript:;" v-else>回复</span>
              </p>
              <p class="operaMore">
                <a v-if="showReplyWords(row)" href="javascript:;" class="operaBtns" @click="showWidGetReply(row)">批量回复</a>
                <span href="javascript:;" v-else>批量回复</span>
              </p>
            </div>
          </div>
        </template>
      </sn-datatable>
      <sn-pagination ref="advPageTurn" :total="dataTotal" :size="pageSize" @goto="commentGoto" />
      <sn-confirm :title='confirmTitle' txt @sure="saveConBtn" @close="cancelConBtn" :flag="commentFlag" confirmButtonText="保存">
        <sn-form ref="commonFloor" :model="editFloorInfo" :rules="floorRules" label-width="100px" formWidth="500">
          <sn-form-item label="发布账号" prop="resource">
            <sn-select v-model="virtualUserId" radius="6" width="350" @change="handleProductVal">
              <sn-option value="-1" name="自动分配"></sn-option>
              <sn-option v-for="item in (virtualUserList || [])" :name="item.virtualUserName" :value="item.virtualUserId" :key="item.virtualUserId" :disabled="item.disabled"></sn-option>
            </sn-select>
          </sn-form-item>
          <sn-form-item :label="labelName" prop="topicId">
            <div style="width: 350px">
              <sn-input v-model="commContent" :placeholder="commentPlaceHolder" width="350" :showWord="true" type="textarea" :rows="4" :maxlength="500" :totalWords="500" @blur="displayError"></sn-input>
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
        </sn-form>
        <form enctype="multipart/form-data" ref="formfile">
          <input type="file" name="file" ref="fileInput" class="sn-upload__input" @change="fileInputChangeHandler($event)">
        </form>
      </sn-confirm>
      <sn-confirm v-if="hiddenConfirmFlag == 'hide'" title="隐藏评论" @close="closeHide" @sure="confirmHide" txt noflag>您确认将当前(选中)评论设置为隐藏状态吗？</sn-confirm>
      <sn-confirm v-if="hiddenConfirmFlag == 'cancleHide'" title='评论取消隐藏' @close="closeHide" @sure="confirmCancelHide" txt noflag>
        您确认取消当前评论隐藏状态吗？
      </sn-confirm>
      <sn-confirm v-if="viewType=='ban'" title="用户禁言" @close="closeForbidden" @sure="handleUser" noflag confirmButtonText="保存">
        <div class="modal-body">
          <div class="radio-group">

            <div class="is-line">
              <span style="margin-right:20px;">用户禁言</span>
              <sn-radio label="short" v-model="banType">
                <span>禁言</span>
              </sn-radio>
              <div class="ban-ipt">
                <input ref="dayInput" :value="banDays" class="mini" type="text" maxlength="3" :disabled="banType==='forever'" @blur="validInput($event.target.value)" @input="dayInputChange($event.target.value)">
                <p v-show="errMsg!==''" class="err-msg">{{errMsg}}</p>
              </div>
            </div>
            <sn-radio label="forever" v-model="banType" class="forever">永久禁言</sn-radio>
          </div>
        </div>
      </sn-confirm>
      <sn-confirm v-if="viewType=='free'" title="解除禁言" @close="closeForbidden" @sure="handleUser('free')" txt noflag>
        确认解除禁言吗？
      </sn-confirm>
      <!--修改点赞数-->
      <sn-confirm title="修改点赞数" txt @sure="saveLikeBtn" @close="cancelLikeBtn" :flag="likeFlag">
        <sn-form ref="commonFloor" :rules="floorRules" formWidth="350" label-width="80px">
          <sn-form-item label="点赞数" prop="topicId">
            <sn-input v-model="likeNumber" width="200" :maxlength="8" placeholder="请输入点赞数" inputType="number" />
            <span class="likeNumTips" v-if="likeNumErrFlag">输入的数字不能小于当前的真实点赞数</span>
          </sn-form-item>
        </sn-form>
      </sn-confirm>
    </div>
  </div>
</template>
<script>
import _ from 'lodash';
import DI from 'interface';
import * as Constant from 'js/constant';
import emitter from 'mixins/emitter';
import { getImgPixelSize } from 'src/utils/image-operate';
export default {
  mixins: [emitter],
  props: {
    content: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      curItem: '', //当前操作对象
      likeCount: '',
      imgVal: '',
      uploadImgFlag: true,
      showPicFlag: false,
      file: '',
      fileName: '',
      imgFileSize: '',
      imgContentType: '',
      tabIndex: 0,
      commentFlag: false,
      commentList: [],
      numberID: '',
      confirmTitle: '',
      labelName: '',
      likeFlag: false,
      likeNumber: '',
      likeNumberOld: 0,
      pageIndex: 0,
      pageSize: 20,
      dataTotal: 0,
      orderColumn: 0,
      order: 0,
      contentId: this.content.contentId,
      contentTitleType: this.content.contentType,
      contentTitle: this.content.title,
      commId: '',
      contentTypeTxt: '',
      virtualUserList: [], //用户列表
      virtualUserId: '-1',
      commContent: '', //评论内容
      updateCommentParam: {}, //添加评论&回复评论参数
      isReply: false, //是否是回复评论标志
      hiddenConfirmFlag: false,
      hideParam: {}, //批量隐藏入参参数
      selecteds: [],
      curSelecteds: [],
      checkAll: false,
      viewType: '', //禁言标志
      userId: '', //用户id
      banType: 'short',
      banDays: '10',
      errMsg: '',
      errTips: false,
      errContentTips: false,
      authId: '',
      commentPlaceHolder: '',
      pageIndexHide: 0,
      commentFromList: Constant.COMMENT_FROM,
      formData: {
        selectId: ''
      },
      queryCommId: this.content.commId,
      likeNumErrFlag: false
    };
  },
  watch: {
    banType(newVal) {
      if (newVal === 'forever') {
        this.errMsg = '';
      }
    },
    banDays(newVal) {
      if (newVal !== '') {
        this.errMsg = '';
      }
    },
    curSelecteds(newArr) {
      this.selecteds = newArr;
      if (this.commentList.length != 0 && newArr.length == this.commentList.length) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    }
  },
  mounted() {
    this.queryReplyCommentPage();
    this.queryUsers();
  },
  methods: {
     showReplyWords(row) {
      let nowTime = new Date().getTime();
      let lastTime = row.updateTime.replace(/\-/g,'/');
      let updateTime = new Date(lastTime).getTime();
      if (updateTime < nowTime) {
        return true;
      } else {
        return false;
      }
    },
    showcomComment(row) {
      let contentStr = '';
      if (row.replyComment) {
        let nickName = row.replyComment && row.replyComment.userNickName != null ? row.replyComment.userNickName : '匿名用户';
        let content = row.replyComment && row.replyComment.commContent != null ? row.replyComment.commContent : '空';
        contentStr = `<span style='color:#1684c2'>${nickName}</span>` + ':' + content;
      }
      return contentStr;
    },
    handleEditClick() {
      this.handleUploadBtnClick();
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
    handleCheckAllChange() {
      //全选和取消全选
      if (this.checkAll) {
        let selectedIds = this.commentList.reduce((preVal, item) => {
          preVal.push(item.commId);
          return preVal;
        }, []);
        this.curSelecteds = [...selectedIds];
      } else {
        this.curSelecteds = [];
      }
    },
    tabChange(i) {
      this.tabIndex = i;
      this.curSelecteds = [];
      if (i == 0) {
        this.orderColumn = 0;
        this.queryReplyCommentPage();
      }
      if (i == 1) {
        this.orderColumn = 1;
        this.queryReplyCommentPage();
      }
      if (i == 2) {
        this.orderColumn = 2;
        this.queryReplyCommentPage();
      }
      if (i == 3) {
        this.orderColumn = 3;
        this.queryReplyCommentPage();
      }
    },
    handleFromList(val) {
      this.formData.selectId = val;
      this.queryReplyCommentPage();
    },
    handleTitle(title) {
      return title && title.length > 57 ? title.substring(0, 57) + '...' : title;
    },
    batchHandle() {
      //批量隐藏
      let commentNewList = [];
      let commentList = this.selecteds.reduce((perVal, val) => {
        let item = {
          commId: val,
          contentTitleId: this.content.commTitleId,
          contentTitleType: this.content.commTitleType
        };
        commentNewList.push(item);
        return commentNewList;
      }, []);

      if (this.selecteds.length) {
        this.hideParam = {
          commentList,
          hideFlag: true
        };
        this.hiddenConfirmFlag = 'hide';
      } else {
        this.$message.warning('请至少选择一条评论！');
        return;
      }
    },
    showForbiConfirm(val, flag) {
      this.viewType = flag;
      this.userId = val.userId;
    },
    closeHide() {
      this.hiddenConfirmFlag = '';
      this.curSelecteds = [];
    },
    queryReplyCommentPage(pageNum) {
      if (pageNum == 0) {
        this.pageIndex = pageNum;
        this.$bus.$emit('syncCurPage', 1);
      }
      this.pageIndex = pageNum ? (pageNum - 1) * this.pageSize : 0;
      this.$ajax({
        url: DI.g_comment.queryReplyCommentPage,
        data: JSON.stringify({
          commSource: this.formData.selectId,
          order: this.order, //内容标题非必填
          orderColumn: this.orderColumn, //内容类型非必填
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          commId: this.queryCommId
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.commentList = res.data.commentList || [];
            this.dataTotal = res.data.totalCount || 0;
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    showHidConfirm(val) {
      this.hiddenConfirmFlag = 'hide';
      let batchParam = {
        hideFlag: true,
        commentList: [
          {
            commId: val.commId,
            contentTitleId: this.content.commTitleId,
            contentTitleType: this.content.commTitleType
          }
        ]
      };
      this.hideParam = batchParam;
    },
    confirmHide() {
      this.queryBatchHide(this.hideParam);
    },
    cancleHidConfirm(val) {
      this.hiddenConfirmFlag = 'cancleHide';
      let batchParam = {
        hideFlag: false,
        commentList: [
          {
            commId: val.commId,
            contentTitleId: this.content.commTitleId,
            contentTitleType: this.content.commTitleType
          }
        ]
      };
      this.hideParam = batchParam;
    },
    confirmCancelHide() {
      this.queryBatchHide(this.hideParam);
    },
    queryBatchHide(param) {
      this.hiddenConfirmFlag = '';
      let num = this.pageIndexHide;
      this.$ajax({
        url: DI.g_comment.batchHide,
        data: JSON.stringify(param),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.curSelecteds = [];
            setTimeout(() => {
              this.queryReplyCommentPage(num);
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
    queryUsers() {
      this.$ajax({
        url: DI.g_comment.queryUsers,
        data: JSON.stringify({}),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.virtualUserList = res.data.virtualUserList || [];
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    handleProductVal(val) {
      this.virtualUserId = val;
    },
    goBackBtn() {
      this.$emit('update:content', this.content.contentInfoNew);
      this.$emit('change-view', 'comment');
    },
    showWidGet() {
      let contentInfoNew = { ...this.content };
      this.content.contentInfoNew = contentInfoNew;
      this.content.$importTargetType = 'comment';
      this.$emit('update:content', this.content);
      this.$emit('change-view', 'importTask');
    },
    showWidGetReply(row) {
      let contentInfoNew = { ...this.content };
      row.contentInfoNew = contentInfoNew;
      row.$importTargetType = 'comment';
      this.$emit('update:content', row);
      this.$nextTick(() => {
        this.$emit('change-view', 'importTask');
      });
    },
    displayError() {
      this.errContentTips = false;
    },
    saveConBtn() {
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
      if (this.isReply) {
        //回复评论
        if (!this.curItem.parentCommId) {
          pms.parentCommId = this.parentCommId;
        } else {
          pms.parentCommId = this.curItem.parentCommId;
          pms.replyCommId = this.parentCommId;
          pms.replyUserId = this.curItem.userId;
        }
      } else {
        if (!this.content.parentCommId) {
          pms.parentCommId = this.content.commId;
        } else {
          pms.parentCommId = this.content.parentCommId;
          pms.replyCommId = this.content.commId;
          pms.replyUserId = this.content.userId;
        }
      }
      pms.likeCount = this.likeCount;
      pms.authId = this.authId;
      pms.contentId = this.content.commTitleId;
      pms.commContent = this.commContent;
      pms.contentTitle = this.content.commTitle;
      pms.contentType = this.content.commTitleType;
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
            this.cancelConBtn();
            setTimeout(() => {
              this.queryReplyCommentPage();
            }, 3000);
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    cancelConBtn() {
      this.isReply = false;
      this.file = '';
      this.commentFlag = false;
      this.likeCount = '';
      this.showPicFlag = false;
      this.uploadImgFlag = true;
      this.virtualUserId = '-1';
      this.commContent = '';
      this.errContentTips = false;
    },
    saveLikeBtn() {
      if (this.likeNumber < this.likeNumberOld) {
        this.likeNumErrFlag = true;
        return;
      }
      this.$ajax({
        url: DI.g_comment.updateLikeNum,
        data: JSON.stringify({
          commId: this.commId, //内容标题非必填
          contentTitleId: this.content.commTitleId, //内容类型非必填
          contentTitleType: this.content.commTitleType,
          likeNum: this.likeNumber
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.cancelLikeBtn();
            setTimeout(() => {
              this.queryReplyCommentPage();
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
    forbidden(flag) {
      const loadingText = flag === 'free' ? '正在解除禁言' : '禁言中';
      let days = this.banType === 'short' ? this.banDays : 40000;
      if (days === '' && flag === 'ban') {
        this.errMsg = '请输入1-365数字';
        this.$refs.dayInput && this.$refs.dayInput.focus();
        return;
      }
      if (this.errMsg !== '') {
        return;
      }
      if (this.banDays == '' && this.banType !== 'forever') {
        this.errMsg = '请输入1-365数字';
        return;
      }
      this.viewType = '';
      this.$ajax({
        url: DI.user.handleUser,
        data: JSON.stringify({
          blockDays: flag == 'free' ? 0 : days,
          pptvUserId: this.userId //
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            if (flag !== 'free') {
              this.banType = 'short';
              this.banDays = '10';
            }
            setTimeout(() => {
              this.queryReplyCommentPage();
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
    closeForbidden() {
      this.viewType = '';
      this.errMsg = '';
      this.banDays = '10';
    },
    handleUser(flag) {
      this.forbidden(flag);
    },
    cancelLikeBtn() {
      this.likeNumErrFlag = false;
      this.likeFlag = false;
    },
    showLikeConfirm(val) {
      this.likeFlag = true;
      this.likeNumber = val.likeNum;
      this.likeNumberOld = val.realLikeNum;
      this.commId = val.commId;
    },
    addComment(flag, row) {
      this.commContent = '';
      this.virtualUserId = '-1';
      //添加评论
      this.confirmTitle = '添加评论';
      this.labelName = '评论内容';
      this.commentPlaceHolder = '请输入500个字以内评论内容';

      if (flag == 2) {
        //回复评论
        this.authId = row.authId;
        this.curItem = row;
        this.confirmTitle = '回复评论';
        this.labelName = '回复内容';
        this.commentPlaceHolder = '回复' + row.userNickName + ':';
        this.isReply = true;
        this.parentCommId = row.commId;
      } else {
        this.authId = this.content.authId;
        this.parentCommId = this.content.commId;
      }
      this.commentFlag = true;
    },
    commentGoto(num) {
      this.pageIndexHide = num;
      this.pageIndex = num;
      this.queryReplyCommentPage(num);
      window.scrollTo(0, 0);
    },
    dayInputChange(val) {
      let formatValue = val.trim().slice(0, 3);

      if (!/^\d+$/.test(formatValue) && formatValue != '') {
        this.$refs.dayInput.value = this.banDays;
        return;
      }

      this.banDays = formatValue;
    },

    validInput(val) {
      let reg = /^([1-2][0-9]{2}|3[0-5][0-9]|36[0-5]|[1-9][0-9]|[1-9])$/;

      if (!reg.test(val)) {
        this.errMsg = '请输入1-365数字';
      }
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
    padding: 10px 20px 65px 20px;
    background: #fff;
    margin-bottom: 10px;
    &.end {
      justify-content: flex-end;
    }
    &.between {
      justify-content: space-between;
      position: relative;
    }
    &.p20 {
      padding-top: 20px;
      padding-bottom: 20px;
    }
    .search-box {
      .search-box-top {
        font-size: 15px;
        margin-bottom: 5px;
        margin-top: 10px;
        display: flex;
        .labelTxt {
          margin-right: 30px;
          max-width: 500px;
        }
      }
      .search-box-bot {
        position: relative;
        top: 32px;
        .clickBtn {
          display: inline-block;
          color: #fff;
          height: 30px;
          line-height: 30px;
          padding: 0 30px;
          font-size: 12px;
          border-radius: 16px;
        }
        .clickAll {
          background-color: #09bbfe;
          margin-right: 30px;
        }
        .clickNone {
          background-color: lightgreen;
        }
      }
      .input-box {
        margin-bottom: -10px;
      }
    }
    .rightBtnBox {
      position: relative;
      top: 20px;
    }
  }
}
.labelName {
  display: block;
  text-align: left;
  width: 100%;
  position: relative;
  top: 6px;
}
.navi-box {
  display: flex;
  justify-content: space-between;
  padding: 0 18px;
  height: 46px;
  border-bottom: 1px solid #e8e8e8;
  background: #fff;
  .comList {
    margin-left: 16px;
    display: inline-block;
    font-size: 16px;
    color: #333;
    line-height: 46px;
    font-weight: bold;
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
}
.operaMore {
  margin: 5px;
  .operaBtns {
    color: #1684c2;
  }
}
.modal-body {
  padding-bottom: 0px;
  width: 360px;
  .radio-group {
    display: flex;
    flex-direction: column;
    margin-left: 15px;
    .forever {
      width: 80px;
      margin-left: 85px !important;
    }
    .is-line {
      margin-bottom: 15px;
    }

    .radio {
      display: flex;
      align-items: center;
      margin-left: 0;
      margin-right: 0;
      padding-bottom: 0;
      & + .radio {
        margin-top: 10px;
      }
    }

    .ban-ipt {
      position: relative;

      &::before {
        content: '\5929';
        position: absolute;
        left: 41px;
        top: 3px;
        font-size: 11px;
        color: #666;
      }
      .mini {
        border: 1px solid #ccc;
        border-radius: 16px;
        color: #0abbfe;
        margin-left: 10px;
        width: 50px;
        padding-left: 7px;
        padding-right: 19px;
      }
      .err-msg {
        position: absolute;
        line-height: 30px;
        top: 16px;
        left: -50px;
        color: red;
        font-size: 14px;
      }
    }
  }
}
.errTips {
  color: red;
  font-size: 12px;
  position: relative;
  top: -10px;
  left: -100px;
}
.com-content {
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    flex: 1;
  }
  .contentDiv {
    line-height: 1.8;
    letter-spacing: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 3;
    /*! autoprefixer: off; */
    -webkit-box-orient: vertical;
    /* autoprefixer: on; */
    display: -webkit-box;
  }
}
.selectBox {
  display: flex;
  margin-top: 16px;
  .text {
    font-size: 15px;
    line-height: 30px;
    margin-right: 10px;
  }
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
