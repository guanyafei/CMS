<template>
  <div class="edit-container">
    <sn-form :model="examineInfo" ref="ruleForm" label-width="90px">
      <header class="edit-header">
        <h3 class="header__title">{{isBackFlag ? '已驳回' : '待审核'}}</h3>
        <h3 @click="goToBack" style="color:#0ABBFE; font-size:14px;">&lt;&nbsp;返回</h3>
      </header>
      <div class="edit-body">
        <div>
          <div v-if="auditHistory.length" calss="contentBox" style="margin: 0 0 20px 40px; padding-left: 40px;">
            <div>
              <p class="titleTips">驳回记录</p>
              <p class="titleLine"></p>
            </div>
            <ul v-for="item in auditHistory" :key="item.key">
              <li>
                <sn-form-item label="审核时间" prop="showType">
                  <span>{{item.auditTime}}</span>
                </sn-form-item>
              </li>
              <li>
                <sn-form-item label="驳回理由" prop="showType">
                  <span style="color: #F47B77">{{item.auditDes}}</span>
                </sn-form-item>
              </li>
            </ul>
          </div>
          <div title="基本信息" style="margin: 0 0 20px 40px; padding-left: 40px;">
            <div>
              <p class="titleTips">基本信息</p>
              <p class="titleLine"></p>
            </div>
            <sn-form-item label="媒体类型" prop="showType" style="margin-top: 10px;">
              <sn-input class="labelLeft" v-model="showType" width="640" disabled/>
            </sn-form-item>
            <sn-form-item label="用户昵称" prop="authorName">
              <sn-input class="labelLeft" v-model="examineInfo.authorName" width="640" disabled/>
            </sn-form-item>
            <sn-form-item label="简介" prop="introduction">
              <sn-input class="labelLeft" v-model="examineInfo.introduction" width="640" type="textarea" :rows="4" disabled/>
            </sn-form-item>
            <sn-form-item label="头像" prop="headPic">
              <img alt="" class="adv-img labelLeft" :src="examineInfo.headPic" width="120" height="120" />
            </sn-form-item>
            <sn-form-item v-if="isPerson" label="团体名称" prop="organizationName">
              <sn-input class="labelLeft" v-model="examineInfo.organizationName" width="640" disabled/>
            </sn-form-item>
            <sn-form-item v-if="isPerson" label="团体身份证明" prop="organizationPic" labelWidth="110">
              <img alt="" class="adv-img labelLeft" :src="examineInfo.organizationPic" width="120" height="120" />
            </sn-form-item>
            <sn-form-item label="运营者姓名" prop="realName">
              <sn-input class="labelLeft" v-model="examineInfo.realName" width="320" disabled/>
            </sn-form-item>
            <sn-form-item label="运营者身份证号" prop="idCard" labelWidth="110">
              <sn-input v-model="examineInfo.idCard" width="320" disabled/>
            </sn-form-item>
            <sn-form-item label="运营者身份证照" prop="idcardPicZ" labelWidth="110">
              <ul style="display: flex;color: #bbb">
                <li>
                  <span class="idCardStyle">身份证正面</span>
                  <img alt="" class="adv-img" :src="examineInfo.idcardPicZ" width="160" height="120" />
                  <div class="watchBtn" @click="watchLargePic(examineInfo.idcardPicZ)">查看原图</div>
                </li>
                <li class="idCardB">
                  <span class="idCardStyle">身份证背面</span>
                  <img alt="" class="adv-img" :src="examineInfo.idcardPicF" width="160" height="120" />
                  <div class="watchBtn" @click="watchLargePic(examineInfo.idcardPicF)">查看原图</div>
                </li>
                <li>
                  <span class="idCardStyle">手持身份证照片</span>
                  <img alt="" class="adv-img" :src="examineInfo.idcardPicS" width="160" height="120" />
                  <div class="watchBtn" @click="watchLargePic(examineInfo.idcardPicS)">查看原图</div>
                </li>
              </ul>
            </sn-form-item>
            <sn-form-item label="联系邮箱" prop="email">
              <sn-input class="labelLeft" v-model="examineInfo.email" width="640" disabled/>
            </sn-form-item>
            <sn-form-item label="手机号码" prop="mobile">
              <sn-input class="labelLeft" v-model="examineInfo.mobile" width="640" disabled/>
            </sn-form-item>
            <sn-form-item v-if="!isPerson" label="银行卡号" prop="bankCard">
              <sn-input class="labelLeft" v-model="examineInfo.bankCard" width="640" disabled/>
            </sn-form-item>
            <sn-form-item v-if="!isPerson" label="易付宝账号" prop="eppNo">
              <sn-input class="labelLeft" v-model="examineInfo.eppNo" width="640" disabled/>
            </sn-form-item>
            <sn-form-item label="微信" prop="wechat">
              <sn-input class="labelLeft" v-model="examineInfo.wechat" width="640" disabled/>
            </sn-form-item>
            <sn-form-item label="QQ" prop="qq">
              <sn-input class="labelLeft" v-model="examineInfo.qq" width="640" disabled/>
            </sn-form-item>
            <sn-form-item label="微博" prop="weibo">
              <sn-input class="labelLeft" v-model="examineInfo.weibo" width="640" disabled/>
            </sn-form-item>
          </div>
          <div title="驳回理由" v-if="!isBackFlag" style="margin: 0 0 20px 40px; padding-left: 40px;">
            <div>
              <p class="titleTips">驳回理由</p>
              <p class="titleLine"></p>
            </div>
            <span style="margin-left: 105px;font-size:16px;color:#333">如审核不通过，请选择驳回理由</span>
            <sn-checkbox-group v-model="checkdVal" style="display: flex;flex-direction: column;margin-top: 20px;margin-left: 90px">
              <sn-checkbox style="margin-left:16px" class="checkBoxGroup" label="简介请勿填写个人联系方式和反动、色情等违规信息" theme="radio">简介请勿填写个人联系方式和反动、色情等违规信息</sn-checkbox>
              <sn-checkbox v-if="isPerson" class="checkBoxGroup" label="团体名称与团体身份证明不匹配" theme="radio">团体名称与团体身份证明不匹配</sn-checkbox>
              <sn-checkbox class="checkBoxGroup" label="运营者姓名与身份证照片信息不匹配" theme="radio">运营者姓名与身份证照片信息不匹配</sn-checkbox>
              <sn-checkbox class="checkBoxGroup" label="运营者身份证照片不符合要求" theme="radio">运营者身份证照片不符合要求</sn-checkbox>
              <sn-input class="backReson" type="textarea" placeholder="如有其它原因，请描述(100个字以内)" v-model="otherReson" width="640" height="96" :rows="3" :maxlength="100"></sn-input>
            </sn-checkbox-group>
          </div>
          <div style="padding-left:90px; border-top: 1px solid #F0F1F5;">
            <sn-form-item class="btn-group" style="margin-top:20px;">
              <sn-button v-if="!isBackFlag" type="primary" @click="submitForm" class="mr-40" :disabled="getExamineStatusY ? true : false">审核通过</sn-button>
              <sn-button style="margin-left:40px;" @click="backToIndex" :disabled="getExamineStatusN" v-if="!isBackFlag">审核不通过</sn-button>
              <sn-button type="primary" @click="goToBack" v-if="isBackFlag">关闭</sn-button>
            </sn-form-item>
          </div>
        </div>
      </div>
    </sn-form>
    <div v-if="showLargePicFlag" class="largePicture">
      <div class="closeIcon" @click="closeLargePic"></div>
      <img :src="largePicSrc">
    </div>
  </div>
</template>
<script>
import DI from 'interface';
import * as Constant from 'js/constant';
import EditItem from 'widgets/infoCommon/infoEditDetails/editItem';
export default {
  props: {
    examineInfo: {
      //获取频道列表页面传过来的row
      type: Object,
      default: {}
    }
  },

  data() {
    return {
      showType: this.examineInfo.showType == 2 ? '机构用户' : '个人作者',
      otherReson: '',
      isPerson: this.examineInfo.showType == 2 ? true : false,
      authorId: this.examineInfo.authorId,
      auditHistory: this.examineInfo.auditHistory,
      checkdVal: [],
      isHaveBackRes: this.examineInfo.auditHistory && this.examineInfo.auditHistory.length ? true : false,
      isBackFlag: this.examineInfo.status == 4 ? true : false,
      largePicSrc: '',
      showLargePicFlag: false
    };
  },
  mounted() {},
  computed: {
    getExamineStatusN() {
      return !(this.checkdVal.length || this.otherReson);
    },
    getExamineStatusY() {
      return this.checkdVal.length || this.otherReson;
    }
  },
  methods: {
    backToIndex() {
      let auditDes = '';
      let checkdVal = this.checkdVal;
      if (checkdVal.length) {
        for (var i = 0; i < checkdVal.length; i++) {
          auditDes += checkdVal[i];
          auditDes += ';';
        }
      }
      if (this.otherReson) {
        auditDes += this.otherReson;
      }
      this.$ajax({
        url: DI.examine.authorAuditBack,
        data: JSON.stringify({
          authorId: this.authorId,
          auditDes: auditDes
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.goToBack();
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    goToBack() {
      this.$emit('change-view', 'list');
    },
    submitForm() {
      this.$ajax({
        url: DI.examine.authorAuditPass,
        data: JSON.stringify({
          authorId: this.authorId
        }),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.goToBack();
          } else {
            this.$message.warning(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    },
    watchLargePic(param) {
      this.largePicSrc = param;
      if (param) {
        this.showLargePicFlag = true;
      } else {
        this.showLargePicFlag = false;
      }
    },
    closeLargePic() {
      this.showLargePicFlag = false;
    }
  }
};
</script>
<style scoped>
.edit-container {
  padding: 10px 20px;
  background: #fff;
  font-size: 14px;

  .edit-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 12px;
    .header__title {
      font-size: 16px;
      color: #333;
    }
  }
}
.idCardStyle {
  display: block;
  margin-bottom: 11px;
}
.idCardB {
  margin: 0 30px;
}
.labelLeft {
  margin-left: 20px;
}
.backReson {
  margin-left: 15px;
  margin-bottom: 10px;
}
.watchBtn {
  width: 88px;
  height: 28px;
  border-radius: 16px;
  border: 1px solid #e8e8e8;
  text-align: center;
  line-height: 28px;
  position: relative;
  left: 30px;
  top: 6px;
}
.largePicture {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 66666;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
}
.closeIcon {
  right: 88px;
  top: 88px;
  position: absolute;
  width: 50px;
  height: 50px;
  cursor: pointer;
  background-repeat: no-repeat;
  background-size: 59%;
  background-position: center;
  background-image: url(../../../assets/icon-close.png);
  background-color: #000;
  border-radius: 50%;
  opacity: 0.5;
}
.titleTips {
  color: #666;
  font-size: 14px;
  position: relative;
  left: -40px;
  margin-top: 20px;
  margin-bottom: 9px;
}
.titleLine {
  border-bottom: 1px solid #f0f1f5;
  margin-left: 30px;
  position: relative;
  top: -16px;
}
.checkBoxGroup {
  margin-bottom: 16px;
}
</style>
