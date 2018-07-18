<template>
  <div id="list">
    <sn-table :data="list" ref="table">
      <sn-table-column label="作者ID" prop="authorId" width="9%"></sn-table-column>
      <sn-table-column label="作者信息" align="left" width="26%" sloted>
        <template slot-scope="row">
          <div class="info">
            <div class="info-img"
              @click="openAuthorInfoConfirm(row)">
              <img :src="row.headPic|smallImage(80)" class="img-logo" v-show="(row.headPic||'')!=''">
            </div>
            <div class="info-title">
              <div>{{row.authorName}}</div>
              <div class="info-intro" :title="row.introduction">{{row.introduction}}</div>
            </div>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label="作者类型"
        prop="recentLoginTime"
        width="9%"
        sloted>
        <template slot-scope="row">
          <div class="authorTypeBox">
            <span class="authorSpan">{{getAuthorItem(row.authorType).name}}</span>
            <span class="authorSpan" v-if="row.authorType == 2">{{getSettleItem(row)}}</span>
            <span v-if="row.authorType == 2">{{getShowItem(row.showType).name}}</span>
            <!-- 内部作者-->
            <span v-if="row.authorType == 1" class="authorSpan">{{row.statffId}}</span>
            <span v-if="row.authorType == 1">{{getShowItem(row.showType,true).name || '内部编辑'}}</span>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label="认证信息" prop="remark" width="9%"></sn-table-column>
      <sn-table-column label="发布资讯数" prop="publishNum" width="12%">
      </sn-table-column>
      <sn-table-column label="粉丝数" prop="fansNum" width="9%" sloted>
        <template slot-scope="row">
          <div class="is-column">
            <button @click.stop="gotoFansList(row)">{{row.fansNum}}</button>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label="账号状态" prop="userForbiddenStatus" width="9%" sloted>
        <template slot-scope="row">
          {{getStatusItem(row.status).name}}
        </template>
      </sn-table-column>
      <sn-table-column label="注册时间" prop="createTime" width="9%" sloted>
        <template slot-scope="row">
          <sn-td-date :time="row.createTime"></sn-td-date>
        </template>
      </sn-table-column>
      <sn-table-column label="操作" sloted>
        <template slot-scope="row">
          <div class="is-column">
            <button @click.stop="openAccountConfirm(row)">{{getStatusItem(row.status).key==="deaded"?"账号启用":"账号停用"}}</button>
            <button class="mt-5" @click.stop="editConfirm(row)">编辑</button>
          </div>
        </template>
      </sn-table-column>
    </sn-table>
    <sn-confirm v-if="viewType=='info'"
      title="作者简介"
      @close="close"
      close-icon
      noflag>
      <div class="modal-body author-info">
        <div class="content">
          <div class="img-div">
            <img :src="authorInfo.headPic|smallImage(80)" class="head-img" v-show="(authorInfo.headPic||'')!=''">
          </div>
          <div class="info-item">
            <span class="author-info__name ellipsis" :title="authorInfo.authorName">
              {{authorInfo.authorName}}
            </span>
          </div>
          <div class="info-item text-gray">
            <span>{{ getAuthorItem(authorInfo.authorType).name }}</span>
            <span v-if="getAuthorItem(authorInfo.authorType).key === 'inter'" class="account-edit">
              <span>（工号：</span>
              <sn-input
                v-if="editMode"
                v-model="authorInfo.statffId"
                ref="userAccount"
                type="number"
                width="100"
                :minlength="6"
                :maxlength="12"
                required
                autoValid></sn-input>
              <span v-if="!editMode">
                {{ `${authorInfo.statffId || ''}`}}
              </span>
              <sn-button
                v-if="editMode"
                class="account-edit__button"
                @click="doEditUserAccount">保存</sn-button>
              <span
                class="account-edit__icon"
                v-else
                @click="handleClickEditAccount"></span>
            </span>
            <span v-else>
              {{`（工号：${authorInfo.statffId || ''}`}}
            </span>
            <span>）</span>
          </div>
          <div class="info-item text-gray">
            <div class="author-id">
              ID
              <span>{{authorInfo.authorId}}</span>
            </div>
            <span class="author-space">|</span>
            <span class="author-tag">{{authorInfo.remark}}</span>
          </div>
          <div class="info-item intro">
            <label>个人简介</label>
            <sn-input type="textarea" v-model="authorInfo.introduction" disabled></sn-input>
          </div>
          <div class="info-item" v-if="isOutFitOwn && isOutFlag">
            <label class="required">团体名称</label>
            <sn-input v-model="authorInfo.organizationName" disabled></sn-input>
          </div>
          <div class="info-item" v-if="isOutFitOwn && isOutFlag">
            <label class="required" style="width: 125px;position: relative;left:-133px;">团体身份证照片</label>
            <div>
              <img style="position:relative; left:-130px;" :src="authorInfo.organizationPic" width="120" height="90">
              <div class="watchBtn" @click="showBigPic(authorInfo.organizationPic)" style="left: -111px">查看原图</div>
            </div>
          </div>
          <div class="info-item" v-if="isOutFlag">
            <label class="required">运营者姓名</label>
            <sn-input v-model="authorInfo.realName" disabled></sn-input>
          </div>
          <div class="info-item" v-if="isOutFlag">
            <label class="required">身份证号码</label>
            <sn-input v-model="authorInfo.idCard" disabled></sn-input>
          </div>
          <div class="info-item" v-if="isOutFlag">
            <label class="required">身份证照片</label>
            <div style="margin-top: 8px">
              <ul style="display: flex; margin-top: 10px;">
                <li>
                  <img :src="idShowOne" width="120" height="90">
                  <div class="watchBtn" @click="showBigPic(idShowOne)">查看原图</div>
                </li>
                <li style="margin: 0 10px">
                  <img :src="idShowTwo" width="120" height="90">
                  <div class="watchBtn" @click="showBigPic(idShowTwo)">查看原图</div>
                </li>
                <li>
                  <img :src="idShowThree" width="120" height="90">
                  <div class="watchBtn" @click="showBigPic(idShowThree)">查看原图</div>
                </li>
              </ul>
            </div>
          </div>
          <div class="info-item">
            <label class="required">邮箱</label>
            <sn-input v-model="authorInfo.email" disabled></sn-input>
          </div>
          <div class="info-item">
            <label for=""
              class="required">手机</label>
            <sn-input v-model="authorInfo.mobile" disabled></sn-input>
          </div>
          <div class="info-item" v-if="isOutFlag && !isOutFitOwn">
            <label for=""
              class="required">银行卡号</label>
            <sn-input v-model="authorInfo.bankCard" disabled></sn-input>
          </div>
          <div class="info-item" v-if="isOutFlag && !isOutFitOwn">
            <label for=""
              class="required">易付宝账号</label>
            <sn-input v-model="authorInfo.eppNo" disabled></sn-input>
          </div>
          <div class="info-item">
            <label for="">微博</label>
            <sn-input v-model="authorInfo.weibo" disabled></sn-input>
          </div>
          <div class="info-item">
            <label for="">微信</label>
            <sn-input v-model="authorInfo.wechat" disabled></sn-input>
          </div>
          <div class="info-item">
            <label for="">QQ</label>
            <sn-input v-model="authorInfo.qq" disabled></sn-input>
          </div>
        </div>
      </div>
      <div slot="btn-group"></div>
    </sn-confirm>

    <sn-confirm txt v-if="viewType=='editFlag'" title="编辑" @close="close" @sure="setEdit" noflag>
      <sn-form :model="selectedItem" :rules="rules" ref="selectedItem" formWidth="666">
        <sn-form-item label="认证信息" prop="content" labelWidth="85">
          <sn-input
            ref="labelInput"
            v-model="selectedItem.remark"
            width="502"
            placeholder="请输入认证信息，2-16个字"
            :maxlength="16"
            :minlength="2"
            hint="不能输入特殊字符"
            autoValid
            :reg="/^[\u4e00-\u9fa5a-\w]+$/"
          />
        </sn-form-item>
        <sn-form-item v-if="!authorTypeFlag" label="角色类型" prop="roleType" labelWidth="85">
          <sn-select v-model="roleType" @change="roleTypeChange" radius="6" width="502">
            <sn-option :key="role.value" :value="role.value" :name="role.name" v-for="role in roleList"></sn-option>
          </sn-select>
        </sn-form-item>
        <sn-form-item label="个人简介" prop="type" labelWidth="85">
          <sn-input class="labelLeft" v-model="introduction" width="502" type="textarea" :rows="4" :maxlength="100" :totalWords="100" showWord/>
        </sn-form-item>
        <sn-form-item label="结算类型" prop="type" v-if="authorTypeFlag" labelWidth="85">
          <div>
            <sn-select ref="typeSelect" v-model="selectedItem.settleType" placeholder="请选择" radius="6" width="502" @change="handleSelectType">
              <sn-option v-for="item in balanceList" :key="item.key" :name="item.name" :value="item.value" :disabled="item.disabled"></sn-option>
            </sn-select>
          </div>
        </sn-form-item>
        <sn-form-item label="展示类型" prop="show" v-if="authorTypeFlag" labelWidth="85">
          <div>
            <sn-select v-model="selectedItem.showType" placeholder="请选择" radius="6" width="502" @change="handleSelectAccount">
              <sn-option v-for="item in showList" :key="item.key" :name="item.name" :value="item.value" :disabled="item.disabled"></sn-option>
            </sn-select>
          </div>
        </sn-form-item>
        <sn-form-item label="团队名称" prop="type" v-if="authorTypeFlag && isOutfit" labelWidth="85">
          <sn-input class="labelLeft" :maxlength="20" :minlength="2" v-model="organizationName" width="502"/>
        </sn-form-item>
        <sn-form-item label="团队身份证" prop="organizationPic" v-if="authorTypeFlag && isOutfit" labelWidth="85" inputType="number">
          <span style="position: relative; left: -174px; color: #bbb;">身份证上信息清晰可见，大小不超过5M</span>
          <sn-cropper :aspectRatio="1" :hastip="false" v-model='organizationPic' ref="cropper" label="封面" size="5M" noCropper width="160" height="120" noGif/>
        </sn-form-item>
        <sn-form-item label="运营者姓名" prop="type" v-if="authorTypeFlag" labelWidth="85">
          <sn-input class="labelLeft" placeholder="请输入运营者姓名，1-6个字" :minlength="1" :maxlength="6" v-model="realName" width="502"/>
        </sn-form-item>
        <sn-form-item label="身份证号码" prop="type" v-if="authorTypeFlag" labelWidth="85">
          <sn-input class="labelLeft" :maxlength="18" v-model="idCard" width="502" inputType="number"/>
        </sn-form-item>
        <sn-form-item label="身份证照片" prop="type" v-if="authorTypeFlag" labelWidth="90">
          <div style="margin-top: 8px">
            <span style="position: relative; left: -174px; color: #bbb;">身份证上信息清晰可见，大小不超过5M</span>
            <ul style="display: flex; margin-top: 10px;">
              <li>
                <span class="idCardS">身份证正面</span>
                <sn-cropper :aspectRatio="1" size="5M" :hastip="false" v-model='idcardPicOne' noCropper ref="cropper" label="封面" width="160" height="120" noGif/>
              </li>
              <li style="margin: 0 10px">
                <span class="idCardS">身份证反面</span>
                <sn-cropper :aspectRatio="1" size="5M" :hastip="false" v-model='idcardPicTwo' noCropper ref="cropper" label="封面" width="160" height="120" noGif/>
              </li>
              <li>
                <span class="idCardS">手持身份证照片</span>
                <sn-cropper :aspectRatio="1" size="5M" :hastip="false" v-model='idcardPicThree' noCropper ref="cropper" label="封面" width="160" height="120" noGif/>
              </li>
            </ul>
          </div>
        </sn-form-item>
      </sn-form>
    </sn-confirm>
    <sn-confirm v-if="viewType=='start'"
      title="账号启用"
      @close="close"
      @sure="doStart"
      txt
      noflag>
      确认启用账号吗？
    </sn-confirm>
    <sn-confirm v-if="viewType=='dead'"
      title="账号停用"
      @close="close"
      @sure="doDead"
      txt
      noflag>
      确认停用账号吗？
    </sn-confirm>
    <sn-confirm
      title="提示"
      :flag="checkWordConfirm"
      close-icon
      @close="closeCheck"
      @sure="sureCheck"
      confirmButtonText="继续保存"
      cancelButtonText="返回检查"
      noflag>
      <div class="modal-body">
        <sn-formtip warning>内容中检测出敏感词汇，请慎重检查~</sn-formtip>
        <div class="words">
          <span class="title">敏感词汇：</span>
          <span class="word" v-for="(word, index) in sensitiveMsgList" :key="index">{{word}}</span>
        </div>
      </div>
    </sn-confirm>
    <div v-if="bigSrcFlag" class="largePicture">
      <div class="closeIcon" @click="closeLargePic"></div>
      <img :src="bigSrc">
    </div>
  </div>
</template>

<script>
import DI from 'interface'
import * as Constant from 'js/constant'
export default {
  name: 'authorList',
  props: {
    list: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      editMode: false,
      authorId: '',
      selectedItem: {
        remark: '',
        settleType: '',
        showType: ''
      },
      selectedItemBefore: null,
      authorInfo: null,
      viewType: null,
      authorTypeFlag: false,
      balanceList: Constant.ACC_BALANCE,
      showList: Constant.ACC_SHOW,
      roleList:Constant.ROLE_TYPE,//角色类型
      roleType:5,//外部作者角色默认
      formData: {
        type: '',
        content: '',
        show: ''
      },
      rules: {
        showType: [{
          required: true,
          message: '请选择展示类型',
          trigger: 'change',
          type: 'number'
        }],
        settleType: [{
          required: true,
          message: '请选择结算类型',
          trigger: 'change',
          type: 'number'
        }]
      },
      introduction: '',
      advImgUrl: '',
      organizationPic: '',
      organizationName: '',
      realName: '',
      idcardPicOne: '',
      idcardPicTwo: '',
      idcardPicThree: '',
      idCard: '',
      isOutfit: false,//是否是机构用户
      sensitiveMsgList: [],
      checkWordConfirm: false,//敏感词提示弹框
      idShowOne: '',
      idShowTwo: '',
      idShowThree: '',
      bigSrc: '',
      bigSrcFlag: false,
    }
  },
  methods: {
    roleTypeChange(val){
      this.roleType = val;
    },
    gotoFansList (val) {
      this.$emit('input', val);
      this.$emit('change-view', 'fansList');
    },
    getAuthorItem (val) {
      return Constant.getItemByValue(Constant.LIBRARY_AUTHOR_TYPE, val);
    },
    getSettleItem (val) {
      return Constant.getItemByValue(Constant.ACC_BALANCE, val.settleType).name;
    },
    getShowItem (val,isInside) {
      if(isInside){//内部作者则显示角色类型
        return Constant.getItemByValue(Constant.ROLE_TYPE, val);
      }else{
      return Constant.getItemByValue(Constant.ACC_SHOW, val);
      }
    },
    getStatusItem (val) {
      return Constant.getItemByValue(Constant.ACC_STATUS, val);
    },
    handleSelectType (val) {
      this.selectedItem.settleType = val;
    },
    handleSelectAccount (val) {
      this.selectedItem.showType = val;
      if (val == 4) {//普通作者
        this.isOrdinary = true;
      }
      if (val == 2) {//机构号
        this.isOrdinary = false;
        this.isOutfit = true;
      } else {
        this.isOutfit = false;
      }
    },
    showBigPic (src) {
      this.bigSrc = src;
      this.bigSrcFlag = true;
    },
    openAccountConfirm (row) {
      const itemKey = this.getStatusItem(row.status).key;
      this.selectedItem = row;
      if (itemKey === 'deaded') {
        this.viewType = 'start';
      } else {
        this.viewType = 'dead';
      }
    },
    editConfirm (row) {
      if (row.authorType == 2) {//外部作者
        this.authorTypeFlag = true;
        if (row.showType == 2) {
          this.isOutfit = true;
        } else {
          this.isOutfit = false;
        }
      } else {//内部作者
        this.authorTypeFlag = false;
        this.roleType = row.showType == undefined ? 5 : row.showType;//展示内部编辑/作者
      }
      this.selectedItem = {
        remark: row.remark,
        settleType: row.settleType ? row.settleType : 3,
        showType: row.showType ? row.showType : 4,
        authorId: row.authorId,
        custNo: row.custNo,
        status: row.status
      };
      this.introduction = row.introduction;
      this.organizationName = row.organizationName;
      this.organizationPic = row.organizationPic;
      // this.organizationPic = '';
      this.realName = row.realName;
      this.idCard = row.idCard;
      this.idcardPic = row.idcardPic;
      this.viewType = 'editFlag';
      let idcardPicArr = [];
      if (row.idcardPic) {
        idcardPicArr = row.idcardPic.split(';');
        if (idcardPicArr.length > 1) {
          this.idcardPicOne = idcardPicArr[0];
          this.idcardPicTwo = idcardPicArr[1];
          this.idcardPicThree = idcardPicArr[2];
        } else {
          this.clearPic();
        }
      } else {
        this.clearPic();
      }
    },
    clearPic () {
      this.idcardPicOne = '';
      this.idcardPicTwo = '';
      this.idcardPicThree = '';
    },
    openAuthorInfoConfirm (row) {
      let idcardPicShow = [];
      if (!row) return;
      this.selectedItem = row;
      this.$ajax({
        url: DI.authorLibrary.queryAuthorInfo,
        loadingText: '正在加载作者信息，请稍候！',
        data: JSON.stringify({
          authorId: row.authorId
        }),
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            this.authorInfo = res.data;
            this.viewType = 'info';
            this.isOutFitOwn = res.data && res.data.showType == 2 ? true : false;
            this.isOutFlag = res.data && res.data.authorType == 2 ? true : false;
            if (res.data.idcardPic) {
              idcardPicShow = res.data.idcardPic.split(';');
              if (idcardPicShow.length > 1) {
                this.idShowOne = idcardPicShow[0];
                this.idShowTwo = idcardPicShow[1];
                this.idShowThree = idcardPicShow[2];
              }
            }
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    setEdit () {
      let isValid = this.$refs.labelInput.check();
      if (isValid) {
        this.checkLimitWords();
      }
    },
    checkLimitWords() {
      let reg = /\[.*\]/g;
      this.$ajax({
        url: DI.common.checkLimitWords,
        data: JSON.stringify({
          content: this.selectedItem.remark,
          name: ""
        }),
        loadingText: "正在敏感词检验，请稍候",
        context: this,
        success: (res) => {
          if(res.retCode == '0') {
            this.handleAccount({ remark: this.selectedItem.remark }, this.viewType);
          } else {
            let sensitiveMsg = reg.exec(res.retMsg)[0];
            this.sensitiveMsgList = JSON.parse(sensitiveMsg);
            this.checkWordConfirm = true;
          }
        },
        error: () => {
          console.error('error');
        }
      });
    },
    closeCheck() {
      this.checkWordConfirm = false;
    },
    sureCheck() {
      this.handleAccount({ remark: this.selectedItem.remark }, this.viewType);
      this.checkWordConfirm = false;
    },
    doStart () {
      this.handleAccount({ status: 2 }, this.viewType)
    },
    doDead () {
      this.handleAccount({ status: 3 }, this.viewType)
    },
    handleAccount (option, viewType) {
      let idCardPic = '';
      if (this.idcardPicOne) {
        idCardPic += this.idcardPicOne;
        idCardPic += ';';
      }
      if (this.idcardPicOne) {
        idCardPic += this.idcardPicTwo;
        idCardPic += ';';
      }
      if (this.idcardPicOne) {
        idCardPic += this.idcardPicThree;
      }
      this.viewType = null
      let params = {
          authorId: this.selectedItem.authorId,
          custNo: this.selectedItem.custNo,
          idCard: this.idCard,//身份证号码
          idcardPic: idCardPic,//身份证照片
          introduction: this.introduction,//个人简介
          organizationName: this.organizationName,//团队名称
          organizationPic: this.organizationPic,//团队身份证照片
          realName: this.realName,//运营者姓名
          settleType: this.selectedItem.settleType,
          showType: this.selectedItem.showType,
          statffId: this.selectedItem.statffId,
          status: this.selectedItem.status,
          ...option
      }
      if(!this.authorTypeFlag){//内部作者
          params.showType = this.roleType;
      }
       
      this.$ajax({
        url: DI.authorLibrary.handleAccount,
        data: JSON.stringify(params),
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            this.$parent.queryList();
          } else {
            this.viewType = viewType;
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          this.viewType = viewType;
          console.log("error");
        }
      });
    },
    handleClickEditAccount () {
      this.editMode = true;
    },
    closeLargePic () {
      this.bigSrcFlag = false;
    },
    doEditUserAccount () {
      let { authorInfo } = this;
      if (!this.$refs.userAccount.check()) {
        return;
      }
      this.$ajax({
        url: DI.authorLibrary.handleAccount,
        data: JSON.stringify({
          authorId: authorInfo.authorId,
          custNo: authorInfo.custNo,
          statffId: authorInfo.statffId
        }),
        context: this,
        success: (res) => {
          if (res.retCode == "0") {
            this.editMode = false;
            this.selectedItem.statffId = authorInfo.statffId;
            this.$message.success("修改成功！");
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          this.viewType = viewType;
          console.log("error");
        }
      });
    },
    close () {
      this.viewType = null;
      this.editMode = false;
    }
  },
};
</script>

<style scoped>
button {
  color: #0abbfe;
}

.btn-group {
  height: 50px;
}

.modal-body {
  padding-bottom: 0px;
  width: 450px;
  .content {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .label {
    margin-left: 10px;
  }
  .is-line > .label {
    margin-right: 10px;
  }
  &.author-info {
    width: 727px;
    .img-div,
    .head-img {
      width: 80px;
      height: 80px;
      cursor: pointer;
      border: 1px solid #eeeeee;
      border-radius: 80px;
    }
    .author-tag {
      width: 45%;
      height: 26px;
      padding-left: 24px;
      line-height: 26px;
      background-size: 17px;
      background-position-y: 6px;
      background-repeat: no-repeat;
      background-image: url(../../../assets/icon-tag.png);
    }
    .author-space {
      width: 10%;
      color: #ccc;
      text-align: center;
    }

    .author-id {
      text-align: right;
      width: 45%;
    }
    .info-item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 0;
      width: 100%;
      &.intro {
        align-items: start;
      }
      label {
        &.required {
          &::before {
            content: '';
            display: inline-block;
            width: 6px;
            height: 6px;
            background: #09bbfe;
            border-radius: 50%;
            margin-right: 5px;
            vertical-align: middle;
          }
        }
        width: 100px;
        text-align: right;
        margin-right: 20px;
      }
      .author-info__name {
        max-width: 200px;
      }
      .account-edit {
        display: flex;
        align-items: center;
      }
      .account-edit__icon {
        width: 20px;
        height: 20px;
        cursor: pointer;
        background-image: url(../../../assets/icon-edit-gray.png);
        background-size: 20px 20px;
        background-repeat: no-repeat;
      }
      .account-edit__button {
        margin-left: 20px;
        min-width: 50px;
        padding: 6px 10px;
      }
    }
  }
}

.text-gray {
  color: #999999;
}

.info {
  display: flex;
  align-items: center;
  height: 80px;
  .info-img,
  .img-logo {
    width: 80px;
    height: 80px;
    cursor: pointer;
    border-radius: 80px;
    border: 1px solid #eeeeee;
  }
  .info-title {
    max-width: 300px;
    margin-left: 10px;
    color: #333333;
    font-size: 18px;
  }
}

.is-disabled {
  color: #a1a1a1;
  cursor: not-allowed;
}

.info-intro {
  margin-top: 5px;
  color: #a1a1a1;
  font-size: 14px;
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.authorTypeBox {
  display: flex;
  flex-direction: column;
  .authorSpan {
    margin-bottom: 5px;
  }
}
.modal-body {
  width: 480px;
  .words {
    height: 128px;
    overflow: auto;
    padding-top: 15px;
    padding-left: 15px;
    padding-right: 15px;
    margin-top: 30px;
    border-radius: 4px;
    font-size: 12px;
    background-color: #F4F6FB;
    .title {
      color: #6E7690;
      font-weight: bold;
    }
    .word {
      display: inline-block;
      padding-right: 15px;
      padding-bottom: 15px;
      color: #F47B77;
    }
  }
}
.idCardS {
  display: block;
  margin-bottom: 10px;
  text-align: left;
  color: #999;
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
.closeIcon{
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
.watchBtn {
  width: 88px;
  height: 28px;
  border-radius: 16px;
  border: 1px solid #E8E8E8;
  text-align: center;
  line-height: 28px;
  position: relative;
  left: 17px;
  top: 6px;
  font-size: 14px;
}
</style>
