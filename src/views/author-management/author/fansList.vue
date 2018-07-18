<style scoped>
.container {
  .ibox {
    display: flex;
    align-items: center;
    min-height: 72px;
    padding: 0 20px;
    background: #fff;
    margin-bottom: 0;
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
      }
      .input-box {
        display: flex;
        align-items: center;
        color: #999;
        div {
          & + div {
            margin-left: 10px;
          }
        }
        span {
          margin-right: 10px;
        }
        span:nth-child(3) {
          margin-left: 10px;
        }
      }
      .select-box {
        display: flex;
        height: 30px;
        align-items: center;
        margin-bottom: 0;
        margin-right: 20px;
        float: left;
        color: #999;
        .text {
          margin-right: 10px;
        }
      }
    }
    .btns {
      /*display: flex;
        flex-direction: column;*/
      text-align: right;
      margin: 5px 0;
      button {
        & + button {
          margin-top: 20px;
          margin-left: 5px;
        }
      }
    }
  }
  .btn-group {
    padding: 10px 0;
    display: flex;
    align-items: center;
    background: #fff;
    button {
      width: 108px;
      & + button {
        margin-left: 20px;
      }
    }
    .btn-b {
      flex: 1;
      text-align: right;
      margin-right: 20px;
      button {
        margin-right: 10px;
      }
      span {
        color: #09bbfe;
      }
    }
  }

  .ibox-empty {
    margin-bottom: 10px;
  }
  a {
    color: #1684c2;
    & + a {
      margin-left: 10px;
    }
    &:hover {
      text-decoration: underline;
    }
  }
  .author-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    .wrap-info {
      display: flex;
      align-items: center;
      margin-top: 5px;
      .avator {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 5px;
      }
    }
  }
  .remind-par {
    display: none;
    padding-top: 5px;
    color: #f00;
    font-size: 12px;
    &.error {
      display: block;
      position: relative;
      top: -15px;
    }
  }
  .resource-wrap {
    display: flex;
    flex-direction: column;
    p {
      line-height: 1.3;
    }
  }

  .detail-info {
    margin-top: -15px;
    display: flex;
    .detail-author {
      flex: 1;
      text-align: left;
      font-size: 14px;
      p {
        margin-bottom: 5px;
      }
    }
  }
}
.topBarBox {
  position: relative;
  .goBackBtn {
    position: absolute;
    right: 20px;
    top: 14px;
    font-size: 16px;
    color: #09bbfe;
  }
}
.errorTips {
  color: red;
  font-size: 12px;
  position: relative;
  top: -10px;
  left: -40px;
}
</style>
<template>
  <div class="container">
    <div class="topBarBox">
      <sn-topbar title="粉丝列表" />
      <a class="goBackBtn" href="javascript:;" @click="goBackList">返回</a>
    </div>
    <section class="ibox between">
      <div class="search-box">
        <div class="input-box">
          <span class="text">粉丝数：{{fansCount}}</span>
          <span class="text">前台关注：{{followCount}}</span>
          <span class="text">粉丝灌水：{{fansWaterCount}}</span>
        </div>
      </div>
      <div class="btns">
        <sn-button type="primary" @click="fansWater">粉丝灌水</sn-button>
      </div>
    </section>
    <sn-table :data="list" ref="table1">
      <sn-table-column label="用户ID" prop="pptvUserId" width="30%" align="center"></sn-table-column>
      <sn-table-column label="用户信息" prop="info" width="30%" align="center" sloted>
        <template slot-scope="row">
          <div class="author-info">
            <!-- <p>{{row.pptvUserId}}</p> -->
            <div class="wrap-info">
              <img class="avator" :src="row.headPic" />
              <p>{{row.nickname}}</p>
            </div>
          </div>
        </template>
      </sn-table-column>
      <sn-table-column label="关注时间" prop="createTime" width="25%" align="center"></sn-table-column>
    </sn-table>
    <sn-pagination :total="dataTotal" :size="pageSize" @goto="goto"/>
    <!-- 已编辑提示框 -->
    <sn-confirm title="粉丝灌水" txt @sure="saveConBtn" @close="cancelConBtn" :flag="addFansNumberFlag" confirmButtonText="确定">
      <sn-form class="errorTipsBox" ref="formData" :model="fansAccount" :rules="rules" label-width="100px" formWidth="400">
        <sn-form-item label="输入数量" prop="inputNumber">
          <sn-input inputType="number" :maxlength="5" v-model="fansAccount.inputNumber" width="250" placeholder="请输入灌水数值"/>
        </sn-form-item>
        <span v-if="fansFlag" class="errorTips">单次数值不能超过1万</span>
      </sn-form>
    </sn-confirm>
  </div>
</template>
<script>
import DI from 'interface';
import * as Constant from 'js/constant';
export default {
  props: {
    choseInfo: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      addFansNumberFlag: false,
      pageIndex: 0, //默认是0
      pageSize: 20, //默认是20
      dataTotal: 0, //查询出来的数据条数
      authorId: this.choseInfo.authorId, //作者ID
      fansAccount: {
        inputNumber: ''
      },
      list: [],
      fansCount: '',
      followCount: '',
      fansWaterCount: '',
      rules: {
        inputNumber: [
          {
            required: true,
            message: '请输入灌水数值',
            trigger: 'change'
          }
        ]
      },
      publishDetail: {},
      excelData: {
        startTime: '',
        endTime: '',
        commTitle: '',
        commContent: '',
        source: ''
      },
      fansFlag: false
    };
  },
  watch: {
    fansAccount: {
      handler(newValue, oldValue) {
        if (newValue.inputNumber > 10000) {
          this.fansFlag = true;
        } else {
          this.fansFlag = false;
        }
      },
      deep: true
    }
  },
  mounted() {
    this.queryList(0);
  },
  methods: {
    goto(num) {
      this.pageIndex = num;
      this.queryList(num);
      window.scrollTo(0, 0);
    },
    saveConBtn() {
      if (this.fansFlag) {
        return;
      }
      this.$refs.formData.validate(valid => {
        if (valid) {
          this.$ajax({
            url: DI.authorLibrary.authorFansIncreaseFalsity,
            data: JSON.stringify({
              authorId: this.authorId,
              fansCountFalsity: this.fansAccount.inputNumber
            }),
            context: this,
            loadingText: '正在查询，请稍候！',
            success: res => {
              if (res.retCode == '0') {
                setTimeout(() => {
                  this.queryList();
                }, 1000);
                this.$refs.formData && this.$refs.formData.resetFields();
                this.addFansNumberFlag = false;
              } else {
                this.$message.error(res.retMsg);
              }
            },
            error: () => {
              console.error('error');
            }
          });
        }
      });
    },
    cancelConBtn() {
      this.fansAccount.inputNumber = '';
      this.addFansNumberFlag = false;
      this.fansFlag = false;
      this.$refs.formData && this.$refs.formData.resetFields();
    },
    goBackList() {
      this.$emit('change-view', 'list');
    },
    fansWater() {
      this.addFansNumberFlag = true;
    },
    queryList(pageNum) {
      if (pageNum === 0) {
        this.pageIndex = pageNum;
        this.$bus.$emit('syncCurPage', 1);
      }
      let params = {};
      params.authorId = this.authorId;
      params.pageIndex = pageNum ? (pageNum - 1) * this.pageSize : 0;
      params.pageSize = this.pageSize;
      this.$ajax({
        url: DI.authorLibrary.authorFansListQuery,
        data: JSON.stringify(params),
        context: this,
        loadingText: '正在查询，请稍候！',
        success: res => {
          if (res.retCode == '0') {
            this.list = res.data.authorFansList || [];
            this.dataTotal = res.data.authorFansNum || 0;
            this.fansCount = res.data.fansCount;
            this.followCount = res.data.fansCountReality;
            this.fansWaterCount = res.data.fansCountFalsity;
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
