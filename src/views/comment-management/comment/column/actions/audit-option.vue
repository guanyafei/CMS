<template>
    <!-- 审核 隐藏 操作 wuxa 605-->
    <div id="auditOption">
        <button class="mb-5" @click.stop="openDialog(row)">评论审核</button>
        <sn-confirm noflag v-if="showDialog" title="评论审核" @close="closed" @sure="doAudit">
            <div class="form-content">
                <sn-form :model="formData" ref="aduitForm" formWidth="480" label-width="80">
                    <sn-form-item label="评论内容" style="text-align:left;">
                        <div class="content" v-html="fmtComment(row,true)" :title="row.commContent" style="display:inline;"></div>
                        <div class="text-over" v-html="fmtComment(row)" :title="(row.replyComment && row.replyComment.commContent) || (row.parentComment && row.parentComment.commContent)" style="display:inline;"></div>
                    </sn-form-item>
                    <sn-form-item label="审核操作">
                        <sn-select width="360" v-model="formData.type" @change="chooseType">
                            <sn-option :key="1" :value="1" name="审核通过"></sn-option>
                            <sn-option :key="0" :value="0" name="隐藏评论"></sn-option>
                        </sn-select>
                    </sn-form-item>
                    <!-- 审核评论 -->
                    <div v-show="formData.type == 1">
                        <sn-form-item label="是否设为热门评论">
                            <sn-radio-group v-model="formData.isHot">
                                <sn-radio :label="1">是</sn-radio>
                                <sn-radio :label="0">否</sn-radio>
                            </sn-radio-group>
                        </sn-form-item>
                        <sn-form-item label="设置点赞数" prop="like">
                            <sn-input placeholder="请输入" v-model="formData.like" maxlength="8" inputType="number"></sn-input>
                        </sn-form-item>
                        <sn-form-item label="回复该评论" prop="reply">
                            <sn-input type="textarea" row="4" placeholder="请输入" v-model="formData.reply" showWord totalWords="500" maxlength="500"></sn-input>
                        </sn-form-item>
                    </div>
                    <!-- 隐藏评论-->
                    <div v-show="formData.type == 0">
                        <sn-form-item label="用户禁言">
                            <sn-radio-group v-model="formData.forbidden.type" @change="forbiddenChange">
                                <sn-radio label="0">禁言</sn-radio>
                                <sn-input inputType="number" v-model="formData.forbidden.days" 
                                @change="daysChange" 
                                @blur="validInput($event.target.value)"
                                @focus="validInputFoucus()"
                                :disabled="formData.forbidden.isDisable" 
                                width="60" maxlength="3"></sn-input><span class="days">天</span>
                                <span class="days-alert" v-if="formData.forbidden.error">{{formData.forbidden.error}}</span>
                                <p style="width:100%">
                                    <sn-radio label="40000" style="width:80px">永久禁言</sn-radio>
                                </p>
                            </sn-radio-group>
                        </sn-form-item>
                    </div>
                </sn-form>
            </div>
        </sn-confirm>
    </div>
</template>
<script>
import DI from 'interface'
import { findSensitive } from 'js/filters'
import CommentContent from '../column-content';
import { setTimeout } from 'timers';
export default {
  name: 'AuditOption',
  components: { CommentContent },
  props: ['row'],
  data() {
    return {
      showDialog: false,//对话框
      formData: {//表单数据
        type: 1,//审核操作
        isHot: 0,//热门
        like: '',//赞
        reply: '',//回复内容
        forbidden: {//禁言
          type: '',
          days: '',
          isDisable: false,
          error:''
        }
      }
    };
  },
  methods: {
    openDialog(row){
        if(row.commContent){//主评论
            this.checkLimitWords(row.commContent);
        }
        if(row.replyComment){//引用
            this.checkLimitWords(row.replyComment.commContent,'replyComment');
        }
        if(row.parentComment){//回复
            this.checkLimitWords(row.parentComment.commContent,'parentComment');
        }
        setTimeout(()=>{
            this.showDialog = true;
        },500);
    },
    //格式化评论,分类父级与引用
    fmtComment(row,main){
        if(main){//主评论
            return `${row.commImgList && row.commImgList.length ? '[图片]':''}${findSensitive(row.commContent,row.sensitiveList)}`;
        }
        if(row.replyComment){//引用
            return  `//<span style="color:#0abbfe">${row.replyComment.userNickName || '匿名用户'}: </span>${row.replyComment.commImgList && row.replyComment.commImgList.length ? '[图片]':''}${findSensitive(row.replyComment.commContent,row.replyComment.sensitiveList)}`;
        }
        if(row.parentComment){//回复的父级
            return  `//<span style="color:#0abbfe">${row.parentComment.userNickName || '匿名用户'}: </span>${row.parentComment.commImgList && row.parentComment.commImgList.length ? '[图片]':''}${findSensitive(row.parentComment.commContent,row.parentComment.sensitiveList)}`;
        }
        return '';
    },
    checkLimitWords(content,key) {
      let _this = this;
      let reg = /\[.*\]/g;
      this.$ajax({
        url: DI.common.checkLimitWords,
        data: JSON.stringify({
          content: content,
          name: ''
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
          } else {
            let sensitiveMsg = reg.exec(res.retMsg)[0];
            if(key){
                this.row[key].sensitiveList = JSON.parse(sensitiveMsg);
            }else{
                this.row.sensitiveList = JSON.parse(sensitiveMsg);
            }
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    closed() {
        this.reset();
    },
    reset(){
      this.showDialog = false;
      this.formData.isHot = 0;
      this.formData.type = 1;
      this.$refs.aduitForm.resetFields();
    },
    validInput(val){
      let reg = /^([1-2][0-9]{2}|3[0-5][0-9]|36[0-5]|[1-9][0-9]|[1-9])$/;
      if (!reg.test(val)) {
        this.formData.forbidden.error = "请输入1-365数字";
        return false;
      }
      return true;
    },
    validInputFoucus(){
        this.formData.forbidden.type = 0;
    },
    //用户禁言
    forbiddenChange(val) {
        if (val == ''){return}
      if (val == 0) {
        //禁言选项打卡输入框
        this.formData.forbidden.isDisable = false;
        this.formData.forbidden.days = 1;
      } else {
        //非禁言锁定输入框
        this.formData.forbidden.days = '';
        this.formData.forbidden.error ='';
        this.formData.forbidden.isDisable = true;
      }
    },
    daysChange(val){
       this.formData.forbidden.error ='';
    },
    //审核操作选择
    chooseType(value){
        this.formData.type = value;
        this.formData.forbidden.type = '';
        this.formData.forbidden.days = '';
        this.formData.forbidden.isDisable = false;
        this.$refs.aduitForm.resetFields();
    },
    doAudit() {
        let params = {}, { commId, commTitle, commTitleType, commTitleId, authId, userId} = this.row;  
        params = { commId, contentTitle:commTitle, contentTitleType:commTitleType, contentTitleId:commTitleId };
        params.auditFlg = this.formData.type;
        if(this.formData.type == 1){//审核
            params.hotFlg = this.formData.isHot;
            if(this.formData.reply){
            params.commContent = this.formData.reply;
            }
            if(this.formData.like !== ''){
                params.likeNum = parseInt(this.formData.like,10);
            }
            if(this.row.parentCommId){//父评论id有值时带参,回复id为评论id
                params.replyCommId = commId;
            }
            //父评论空时用评论id
            params.parentCommId = this.row.parentCommId == undefined ? commId : this.row.parentCommId;
        }else{//隐藏
            if(this.formData.forbidden.type !== ''){
                if(this.formData.forbidden.type > 0){//永久禁言
                    params.blockDays = parseInt(this.formData.forbidden.type,10);
                }else{//指定禁言天数
                    if(this.formData.forbidden.days == ''){
                        this.formData.forbidden.error = '请输入禁言天数'; 
                        return;
                    }
                    if(!this.validInput(this.formData.forbidden.days)){
                        return
                    }
                    params.blockDays = parseInt(this.formData.forbidden.days,10);
                }
            }
            params.userId = userId;
        }
        this.$ajax({
            url: DI.commentLibrary.auditComment,
            context: this,
            loadingText: '正在处理，请稍候！',
            data: JSON.stringify(params),
            success: (res) => {
                if (res.retCode == "0") {
                    this.$message.success('操作成功');
                    this.reset();
                    setTimeout(()=>{
                        this.$bus.$emit("reload");
                    },1000);
                } else {
                    this.$message.error(res.retMsg);;
                }
            },
            error: () => {
                console.log("error");
            }
        });
    }
  }
};
</script>
<style scoped>
#auditOption {
    button {
        color: #0abbfe;
    }
  .form-content {
    padding: 10px 10px 10px 30px;
  }
  .days {
    padding-left: 10px;
    line-height: 30px;
  }
  .days-alert{
    padding-left: 10px;
    line-height: 30px;
    color: #FF5954;
  }
  .content{
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp:4;
      max-height: 145px;
      padding:5px 10px 0px 0px;
      text-align: left;
      line-height: 16px;
      cursor: default;
  }
  .mb-5{
      margin-bottom: 5px;
  }
}
</style>
<style>
#auditOption{
    .sn-popup{
        overflow:auto;
    }
    .sn-popup .sn-popup-modal .sn-popup-title{
        font-weight: bolder;
    }
    .text-over{
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        overflow: hidden;
        text-align: left;
        line-height: 16px;
        padding-right:5px;
        cursor: default;
    }
    .container-box .input-box .input__inner{
        padding-right:10px;
    }
    .form-item .form-item__content{
        line-height:16px;
    }
}
</style>
