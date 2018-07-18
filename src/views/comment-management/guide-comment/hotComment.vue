<template>
  <div>
    <sn-datatable :data="hotCommentList" ref="table1" :border="true">
      <sn-datacolumn label="自定义" prop="checkbox" width="5%" :column-border="false">
        <sn-checkbox type="checkbox" v-model="checkAll" @change="handleCheckAllChange"></sn-checkbox>
      </sn-datacolumn>
      <sn-datacolumn label="排序" prop="index" width="5%" alignment="left"></sn-datacolumn>
      <sn-datacolumn label="评论ID" prop="commId" width="10%"></sn-datacolumn>
      <sn-datacolumn label="评论内容" prop="commContent" width="16%"></sn-datacolumn>
      <sn-datacolumn label="发表时间" prop="createTime" width="8%"></sn-datacolumn>
      <sn-datacolumn label="评论人" prop="userNickName" width="10%"></sn-datacolumn>
      <sn-datacolumn label="状态" prop="commStatus" width="5%"></sn-datacolumn>
      <sn-datacolumn label="评论来源" prop="commSource" width="5%"></sn-datacolumn>
      <sn-datacolumn label="回复数" prop="replyNum" width="8%"></sn-datacolumn>
      <sn-datacolumn label="点赞数" prop="likeNum" width="10%"></sn-datacolumn>
      <sn-datacolumn label="举报数" prop="reportNum" width="3%"></sn-datacolumn>
      <sn-datacolumn label="操作" prop="opt" width="15%"></sn-datacolumn>
      <template slot-scope="{row}" slot="checkbox">
        <sn-checkbox type="checkbox" v-model="curSelecteds" :label="row.commId"></sn-checkbox>
      </template>
      <template slot-scope="cell" slot="index">
        <span class="setTop" v-if="cell.row.hotFlg == 2"> {{ (pageIndex -1 )*pageSize + cell.index + 1}}置顶</span>
        <span v-else>{{ (pageIndex -1 )*pageSize + cell.index + 1}}</span>
      </template>
      <template slot-scope="{row}" slot="commContent">
        <div class="com-content">
          <img v-if="row.commImgList && row.commImgList[0] && row.commImgList[0].imgUrl" v-img="{src:row.commImgList[0].imgUrl}" width="120px" height="80px" class="logo-img" alt="" :src="row.commImgList[0].imgUrl" />
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
      <template slot-scope="{row}" slot="isHot">
        <span>热门评论</span>
        <span v-if="row.isHot == 0">普通评论</span>
      </template>
      <template slot-scope="{row}" slot="replyNum">
        <div style="display:flex;flex-direction:column">
          <a style="color: #1684C2; padding-bottom: 10px" @click="showReplay(row)">真实回复：{{row.realReplyNum}}</a>
          <a style="color: #1684C2;" @click="showReplay(row)">填充回复：{{row.guideReplyNum}}</a>

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
      <template slot-scope="{row}" slot="opt">
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
              <a v-if="showReplyWords(row)" href="javascript:;" class="operaBtns" @click="addComment(row)">回复</a>
               <span href="javascript:;" v-else>回复</span>
            </p>
            <p class="operaMore">
              <a v-if="showReplyWords(row)" href="javascript:;" class="operaBtns" @click="showWidGetReply(row)">批量回复</a>
               <span href="javascript:;" v-else>批量回复</span>
            </p>
            <p class="operaMore">
              <a v-if="row.hotFlg != 2" href="javascript:;" @click="handleSetTopClick(row)" class="operaBtns">置顶</a>
              <a v-else href="javascript:;" @click="handleSetTopClick(row)" class="operaBtns">取消置顶</a>
            </p>
            <p class="operaMore">
              <a v-if="row.hotFlg != 2" class="operaBtns" href="javascript:;" @click="handleCancelHot(row)">取消热门</a>
            </p>
          </div>
        </div>
      </template>
    </sn-datatable>
    <sn-pagination ref="hotPagination" :total="totalCount" :size="pageSize" @goto="hotCommentGoto" />
    <!--回复评论-->
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
    <!-- 隐藏和取消隐藏评论-->
    <sn-confirm v-if="hiddenConfirmFlag == 'hide'" title="隐藏评论" @close="closeHide" @sure="confirmHide" txt noflag>您确认将当前(选中)评论设置为隐藏状态吗？</sn-confirm>
    <sn-confirm v-if="hiddenConfirmFlag == 'cancelHide'" title='评论取消隐藏' @close="closeHide" @sure="confirmCancelHide" txt noflag>
      您确认取消当前评论隐藏状态吗？
    </sn-confirm>
    <!--用户禁言和解除弹框 -->
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
    <!--取消热门弹框-->
    <sn-confirm title="取消热门" txt :flag="cancelHotFlag" @sure="cancelHotSure" @close="cancelHotClose">确认将所选评论取消热门?</sn-confirm>
    <!--置顶弹框-->
    <sn-confirm :title="setTopTitle" txt :flag="setTopFlag" @sure="setTopSure" @close="setTopClose">确定要{{setTopTitle}}吗?</sn-confirm>
  </div>
</template>
<script>
import DI from 'interface';
import emitter from 'mixins/emitter';
import { getImgPixelSize } from 'src/utils/image-operate';
export default {
  mixins: [emitter],
  props: {
    hotCommentList: {
      type: Array,
      default: function() {
        return [];
      }
    },
    totalCount: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    content: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  watch: {
    curSelecteds(val) {
      this.selecteds = val;
      if (this.hotCommentList.length != 0 && val.length == this.hotCommentList.length) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    }
  },
  data() {
    const content = this.content;
    return {
      likeCount: '',
      imgVal: '',
      uploadImgFlag: true,
      showPicFlag: false,
      file: '',
      fileName: '',
      imgFileSize: '',
      imgContentType: '',
      curItem: {}, //当前操作的对象
      comPic: '',
      likeCount: '',
      setTopTitle: '', //置顶弹框标题显示
      setTopFlag: false,
      selecteds: [], //选中的评论id
      curSelecteds: [],
      checkAll: false,
      commentPlaceHolder: '',
      confirmTitle: '',
      commentFlag: false,
      virtualUserId: '-1',
      labelName: '',
      commContent: '',
      errContentTips: false,
      likeNumber: '',
      likeNumberOld: 0,
      likeFlag: false,
      likeNumErrFlag: false,
      pageIndex: 1,
      pageSize: 20,
      contentId: content.contentId,
      contentTitle: content.title,
      contentTitleType: content.contentType,
      cancelHotFlag: false,
      hiddenConfirmFlag: '',
      pageIndexHide: 0,
      hideParam: {},
      viewType: '', //禁言标志
      userId: '', //用户id
      banType: 'short',
      banDays: '10',
      errMsg: '',
      errTip: '',
      authId: '',
      commId: '',
      selectedCommIds: [],
      // virtualUserList: [],
      isReply: false, //是否是回复评论标志
      updateCommentParam: {} //添加或回复评论入参参数
    };
  },
  mounted() {
    if (this.content.contentType == 1) {
      this.authId = this.content.authId;
    }
    if (this.content.contentType == 2) {
      this.authId = '';
    }
    if (this.content.contentType == 3) {
      this.authId = '';
    }
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
      } else if (row.parentComment) {
        let nickName = row.parentComment && row.parentComment.userNickName != null ? row.parentComment.userNickName : '匿名用户';
        let content = row.parentComment && row.parentComment.commContent != null ? row.parentComment.commContent : '空';
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
    handleSetTopClick(item) {
      item.hotFlg == 2 ? (this.setTopTitle = '取消置顶') : (this.setTopTitle = '置顶');
      this.setTopFlag = true;
      this.curItem = item;
    },
    setTopSure() {
      //置顶与取消操作(2---置顶)
      let params = {
        hotFlg: this.curItem.hotFlg == 2 ? 1 : 2,
        commentList: [
          {
            commId: this.curItem.commId,
            contentTitleId: this.content.contentId,
            contentTitleType: parseInt(this.content.contentType)
          }
        ]
      };
      this.$ajax({
        url: DI.g_comment.hotComment,
        data: JSON.stringify(params),
        loadingText: '正在处理，请稍候...',
        success: res => {
          if (res.retCode == '0') {
            this.setTopFlag = false;
            setTimeout(() => {
              this.$parent.queryCommentPage(this.pageIndex);
            }, 1300);
          } else {
            this.$message.warning(res.retMsg);
          }
        },
        error: err => {
          console.log(err);
        }
      });
    },
    setTopClose() {
      this.setTopFlag = false;
    },
    showReplay(contentInfo) {
      //跳转到回复列表
      this.$parent.showReplay(contentInfo);
    },
    handleCheckAllChange(e) {
      if (e.target.checked) {
        let selectedIds = this.hotCommentList.reduce((preVal, item) => {
          preVal.push(item.commId);
          return preVal;
        }, []);
        this.curSelecteds = [...selectedIds];
      } else {
        this.curSelecteds = [];
      }
    },
    showWidGetReply(row) {
      //回复灌水
      this.$parent.showWidGetReply(row);
    },
    displayError() {
      this.errContentTips = false;
    },
    handleProductVal(val) {
      this.virtualUserId = val;
    },
    saveConBtn() {
      //确认发布
      if (this.commContent == '') {
        this.errContentTips = true;
        return;
      } else {
        this.errContentTips = false;
      }
      let pms = {};
      if (this.isReply) {
        //回复评论
        if (!this.curItem.parentCommId) {
          pms.parentCommId = this.parentCommId;
        } else {
          pms.parentCommId = this.curItem.parentCommId;
          pms.replyCommId = this.parentCommId;
          pms.replyUserId = this.curItem.userId;
        }
      }
      //添加评论
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
      pms.contentType = parseInt(this.contentTitleType);
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
              this.$parent.queryCommentPage(this.pageIndex);
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
      this.curItem = {};
      this.isReply = false;
      this.file = '';
      this.likeCount = '';
      this.showPicFlag = false;
      this.uploadImgFlag = true;
      this.commentFlag = false;
      this.virtualUserId = '-1';
      this.commContent = '';
      this.errContentTips = false;
    },
    addComment(row) {
      this.virtualUserList = [...this.$parent.virtualUserList];
      this.confirmTitle = '回复评论';
      this.labelName = '回复内容';
      this.commentPlaceHolder = '回复' + row.userNickName + ':';
      this.isReply = true;
      this.commContent = '';
      this.virtualUserId = '-1';
      this.curItem = row;
      this.parentCommId = row.commId;
      this.likeCount = '';
      this.uploadImgFlag = true;
      this.showPicFlag = false;
      this.commentFlag = true;
    },
    saveLikeBtn() {
      //确认修改点赞数
      if (this.likeNumber < this.likeNumberOld) {
        this.likeNumErrFlag = true;
        return;
      }
      this.$ajax({
        url: DI.g_comment.updateLikeNum,
        data: JSON.stringify({
          commId: this.commId,
          contentTitleId: this.contentId,
          contentTitleType: this.contentTitleType,
          likeNum: this.likeNumber
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.cancelLikeBtn();
            setTimeout(() => {
              this.$parent.queryCommentPage(this.pageIndex);
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
    showLikeConfirm(row) {
      this.likeFlag = true;
      this.likeNumber = row.likeNum;
      this.likeNumberOld = row.realLikeNum;
      this.commId = row.commId;
    },
    cancelLikeBtn() {
      this.likeNumErrFlag = false;
      this.likeFlag = false;
    },
    closeForbidden() {
      this.viewType = '';
      this.errMsg = '';
      this.banDays = '10';
    },
    handleUser(flag) {
      //用户禁言和解除确认
      this.forbidden(flag);
    },
    forbidden(flag) {
      const loadingText = flag === 'ban' ? '禁言中' : '正在解除禁言';
      let day = this.banType === 'short' ? this.banDays : 40000;
      if (day == '' && flag == 'ban') {
        this.errMsg = '请输入1-365数字';
        this.$refs.dayInput && this.$refs.dayInput.focus();
        return;
      }
      if (this.errMsg !== '') {
        return;
      }
      if (this.banDays == '' && this.banType == 'forever') {
        this.errMsg = '请输入1-365数字';
        return;
      }
      this.viewType = '';
      this.$ajax({
        url: DI.user.handleUser,
        data: JSON.stringify({
          blockDays: flag == 'free' ? 0 : day,
          pptvUserId: this.userId
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
              this.$parent.queryCommentPage();
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
    showForbiConfirm(row, flag) {
      //用户禁言
      (this.userId = row.userId), (this.viewType = flag);
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
      } else {
        this.errMsg = '';
      }
    },
    hotCommentGoto(pageNum) {
      this.pageIndex = pageNum;
      this.pageIndexHide = pageNum;
      this.$parent.queryCommentPage(pageNum);
      window.scrollTo(0, 0);
    },
    confirmCancelHide() {
      //确认取消隐藏
      this.queryBatchHide(this.hideParam);
    },
    confirmHide() {
      //确认隐藏
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
            setTimeout(() => {
              this.$parent.queryCommentPage(num);
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
    closeHide() {
      this.hiddenConfirmFlag = '';
    },
    cancleHidConfirm(row) {
      //取消隐藏
      this.hiddenConfirmFlag = 'cancelHide';
      let batchParam = {
        hideFlag: false,
        commentList: [
          {
            commId: row.commId,
            contentTitleId: this.contentId,
            contentTitleType: this.contentTitleType
          }
        ]
      };
      this.hideParam = batchParam;
    },
    showHidConfirm(row) {
      //隐藏
      this.hiddenConfirmFlag = 'hide';
      let batchParam = {
        hideFlag: true,
        commentList: [
          {
            commId: row.commId,
            contentTitleId: this.contentId,
            contentTitleType: this.contentTitleType
          }
        ]
      };
      this.hideParam = batchParam;
    },
    cancelHotSure() {
      //取消热门
      let param = {
        hotFlg: 0,
        commentList: [
          {
            commId: this.commId,
            contentTitleId: this.contentId,
            contentTitleType: this.contentTitleType
          }
        ]
      };
      this.$ajax({
        url: DI.g_comment.hotComment,
        data: JSON.stringify(param),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('成功取消热门!');
            this.cancelHotFlag = false;
            setTimeout(() => {
              this.$parent.queryCommentPage(this.pageIndex);
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
    cancelHotClose() {
      this.cancelHotFlag = false;
    },
    handleCancelHot(row) {
      this.commId = row.commId;
      if (row.hotFlg == 2) {
        this.$message.warning('请先取消置顶,再取消热门!');
        return;
      }
      this.cancelHotFlag = true;
    }
  }
};
</script>
<style scoped>
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
    /* ! autoprefixer: off;*/
    -webkit-box-orient: vertical;
    /* autoprefixer: on; */
    display: -webkit-box;
  }
}
.setTop {
  text-align: center;
  min-width: 78px;
  box-sizing: border-box;
  padding: 9px 16px;
  color: #fff;
  background: #ffa488;
  border-radius: 15px;
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

