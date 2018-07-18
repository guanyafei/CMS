<template>
  <div class="crumb">
    <div class="is-line line space-between">
      <div class="is-line cell">
        <span class="label">注册时间</span>
        <sn-timer v-model="startTime" ref="startTime" placeholder="起始时间" :maxDate="endTime"></sn-timer>
        <span class="label"></span>
        <span class="mr-10">至</span>
        <sn-timer v-model="endTime" ref="endTime" placeholder="结束时间" :minDate="startTime"></sn-timer>
      </div>
      <sn-button type="primary" @click="query">查询</sn-button>
    </div>
    <div class="is-line line space-between">
      <div class="is-line">
        <sn-input
          ref="authorId"
          class="mr-30"
          v-model="authorId"
          width="200"
          radius="16"
          placeholder="请输入作者ID"
          maxlength="30"
        ></sn-input>
        <sn-input
          ref="authorName"
          v-model="authorName"
          width="200"
          radius="16"
          placeholder="请输入作者名称"
          maxlength="10"
        ></sn-input>
      </div>
      <sn-button @click="reset">重置</sn-button>
    </div>
    <div class="is-line line cell space-between">
      <div class="is-line">
        <div class="is-line mr-30">
          <span class="label">作者类型</span>
          <sn-select ref="authorType" v-model="authorType" placeholder="请选择" radius="16" width="135" @change="handleAuthorChange">
            <sn-option key="all" name="全部" :value="-1"></sn-option>
            <sn-option v-for="item in authorList" :key="item.key" :name="item.name" :value="item.value" :disabled="item.disabled">
            </sn-option>
          </sn-select>
        </div>
        <div class="is-line mr-30">
          <span class="label">账号状态</span>
          <sn-select ref="status" v-model="status" placeholder="请选择" radius="16" width="135" @change="handleStatusChange">
            <sn-option key="all" name="全部" :value="-1"></sn-option>
            <sn-option v-for="item in statusList" :key="item.key" :name="item.name" :value="item.value" :disabled="item.disabled">
            </sn-option>
          </sn-select>
        </div>
        <div class="is-line mr-30" v-show="authorType == 1">
          <span class="label">角色类型</span>
          <sn-select ref="settleType" v-model="roleType" placeholder="请选择" radius="16" width="135" @change="handleRoleTypeChange">
            <sn-option key="all" name="全部" :value="-1"></sn-option>
            <sn-option v-for="item in roleList" :key="item.key" :name="item.name" :value="item.value">
            </sn-option>
          </sn-select>
        </div>
        <div class="is-line mr-30" v-show="outAuthorFlag">
          <span class="label">结算类型</span>
          <sn-select ref="settleType" v-model="settleType" placeholder="请选择" radius="16" width="135" @change="handleSettleTypeChange">
            <sn-option key="all" name="全部" :value="-1"></sn-option>
            <sn-option v-for="item in balanceList" :key="item.key" :name="item.name" :value="item.value" :disabled="item.disabled">
            </sn-option>
          </sn-select>
        </div>
        <div class="is-line" v-show="outAuthorFlag">
          <span class="label">展示类型</span>
          <sn-select ref="showType" v-model="showType" placeholder="请选择" radius="16" width="135" @change="handleShowTypeChange">
            <sn-option key="all" name="全部" :value="-1"></sn-option>
            <sn-option v-for="item in showList" :key="item.key" :name="item.name" :value="item.value" :disabled="item.disabled">
            </sn-option>
          </sn-select>
        </div>
      </div>
      <sn-button class="add-btn" type="outline" @click="handleAddClick">添加作者</sn-button>
    </div>
    <sn-confirm v-show="viewType=='confirm'" title="添加完成" txt noflag>
      <div class="confirm-body">
        恭喜你，已经添加完成！
      </div>
      <div slot="btn-group" class="btn-group">
        <sn-button size="mini" type="primary" @click="refreshPage">好的</sn-button>
      </div>
    </sn-confirm>

    <sn-confirm v-show="viewType=='addModal'" title="添加作者" :confirmButtonText="confirmBtnText" @close="close" @sure="sure" closeIcon noflag>
      <div class="modal-body">
        <div class="is-line input-group">
          <div class="is-line">
            <span class="label">添加作者ID</span>
            <!-- <sn-input
              ref="accountInput"
              v-model="accountInput"
              width="210"
              placeholder="请输入易购账号(手机)"
              :reg="/^1(3|4|5|7|8)\d{9}$/"
              hint="只支持手机号码填写"
              autoValid
            ></sn-input> -->
            <!-- <span class="space">and</span> -->
            <sn-input ref="usernameInput" v-model="usernameInput" width="210" placeholder="请输入username" autoValid></sn-input>
          </div>
          <sn-button type="primary" v-if="addBtnStatus==='able'" @click="addAccount">确认添加</sn-button>
          <sn-button type="info" disabled v-else-if="addBtnStatus==='disabled'">确认添加</sn-button>
        </div>
        <div class="table">
          <ul class="status" ref="status">
            <li v-for="(item, index) in toAddList" :key="index" :class="{failed:item.errFlag==='true',ok:item.successFlag==='true'&&ajaxed}">
            </li>
          </ul>
          <sn-table :data="toAddList" theme="dialog" ref="accountTable">
            <!-- <sn-table-column label="作者账号" prop="account" width="12%">
            </sn-table-column> -->
            <sn-table-column label="作者ID" prop="authorId" width="11%">
            </sn-table-column>
            <sn-table-column label="作者名称" prop="authorName" width="11%">
            </sn-table-column>
            <sn-table-column label="作者类型" prop="authorType" width="15%" sloted>
              <template slot-scope="row">
                <td-author-type :data="row" :typeFlag="authorList"></td-author-type>
              </template>
            </sn-table-column>
            <sn-table-column label="工号" prop="statffId" width="12%" sloted>
              <template slot-scope="row">
                <div class="number">
                  <sn-input v-model="row.statffId"
                    :ref="row.$index+1"
                    placeholder="请输入工号"
                    width="98"
                    :reg="/^[0-9]+$/"
                    align="center"
                    :disabled="getAuthorTypeItem(row.authorType).key==='outer'"
                    noBorder>
                  </sn-input>
                </div>
              </template>
            </sn-table-column>
            <!-- 内部作者-->
            <sn-table-column label="角色类型" prop="roleTypeParam" width="15%" align="center" sloted>
              <template slot-scope="row">
                <td-author-type v-if="row.authorType == 1" :types="roleTypeParam" :typeFlag="roleList" v-model="roleTypeParam"></td-author-type>
              </template>
            </sn-table-column>
            <sn-table-column label="结算类型" prop="settleTypeParam" width="12%" sloted>
              <template slot-scope="row">
                <td-author-type v-if="row.authorType == 2" :types="settleTypeParam" :typeFlag="balanceList" v-model="settleTypeParam"></td-author-type>
              </template>
            </sn-table-column>
            <sn-table-column label="展示类型" prop="showTypeParam" width="15%" sloted>
              <template slot-scope="row">
                <td-author-type v-if="row.authorType == 2" :types="showTypeParam" :typeFlag="showList" v-model="showTypeParam"></td-author-type>
              </template>
            </sn-table-column>
            <sn-table-column label="操作" sloted>
              <template slot-scope="row">
                <div class="td-btn">
                  <button @click.stop="delItem(row.$index)">删除</button>
                </div>
              </template>
            </sn-table-column>
            <div slot="empty" class="table-tips" v-if="toAddList.length===0">您当前可以添加5条数据</div>
            <div slot="tips" class="table-tips" v-else-if="toAddList.length<5">您当前可以添加{{5-toAddList.length}}条数据</div>
          </sn-table>
        </div>
      </div>
    </sn-confirm>
  </div>
</template>

<script>
import _ from 'lodash';
import DI from 'interface';
import * as Constant from 'js/constant';
import TdAuthorType from './td-widgets/type';
export default {
  name: 'crumb',
  components: {
    TdAuthorType
  },
  data() {
    return {
      authorList: Constant.LIBRARY_AUTHOR_TYPE,
      statusList: Constant.ACC_STATUS,
      balanceList: Constant.ACC_BALANCE,
      showList: Constant.ACC_SHOW,
      roleList:Constant.ROLE_TYPE,//角色类型基础
      // types: 1,
      showTypeParam: 1,
      settleTypeParam: 1,
      roleTypeParam:5,
      roleType:-1,//角色类型
      viewType: null,
      outAuthorFlag: false,
      confirmBtnText: '保存',
      toAddList: [],
      settleType: -1,
      showType: -1,
      accountInput: '',
      usernameInput: '',
      authorType: -1,
      status: -1,
      count: 0,
      ...this.getDefaultData()
    };
  },
  watch: {
    toAddList() {
      this.$nextTick(() => {
        let $table = this.$refs.accountTable.$el;
        let $tody = $table.querySelector('tbody');
        let $trs = $tody.getElementsByTagName('tr');
        let $lis = this.$refs.status.getElementsByTagName('li');

        [].slice.call($trs).map(($tr, index) => {
          $lis[index].style.height = `${$tr.offsetHeight}px`;
        });
      });
    },
    count(newVal) {
      if (newVal === 0 && this.ajaxed === true) {
        this.toAddList = [];
        this.viewType = 'confirm';
      }
    }
  },
  computed: {
    addBtnStatus() {
      if (this.usernameInput.trim() === '' || this.toAddList.length === 5) {
        return 'disabled';
      }

      return 'able';
    }
  },
  methods: {
    getAuthorTypeItem(val) {
      return Constant.getItemByValue(Constant.LIBRARY_AUTHOR_TYPE, val);
    },
    getDefaultData() {
      return {
        startTime: null,
        endTime: null,
        authorId: '',
        authorName: ''
      };
    },
    //角色下拉
    handleRoleTypeChange(val){
      this.$parent.pageNum = 1;
      this.roleType = val;
      this.showType = val;
      this.$nextTick(() => {
        this.query();
      });
    },
    //作者类型
    handleAuthorChange(code) {
      this.$parent.pageNum = 1;
      this.authorType = code;
      //重置下拉默认状态
      this.showType = -1;
      this.roleType = -1;
      this.settleType = -1;
      this.status = -1;
      if (code == 2) {//外部
        this.outAuthorFlag = true;
      } else {//内部
        this.outAuthorFlag = false;
      }
      this.$nextTick(() => {
        this.query();
      });
    },
    handleStatusChange(code) {
      this.$parent.pageNum = 1;
      this.status = code;
      this.$nextTick(() => {
        this.query();
      });
    },
    handleSettleTypeChange(val) {
      this.$parent.pageNum = 1;
      this.settleType = val;
      this.$nextTick(() => {
        this.query();
      });
    },
    handleShowTypeChange(val) {
      this.$parent.pageNum = 1;
      this.showType = val;
      this.$nextTick(() => {
        this.query();
      });
    },
    boundTime(num) {
      let boundDate = num => {
        let now = new Date();
        now = now.setDate(now.getDate() + num);
        return now;
      };

      return this.getNowTime(boundDate(num));
    },
    getNowTime(date) {
      var tempDate = date ? date : '';
      let nowDate = '';
      if (tempDate == '') {
        nowDate = new Date();
      } else {
        nowDate = new Date(tempDate);
      }
      const tempyear = nowDate.getFullYear();
      const tempmonth = nowDate.getMonth() + 1 > 9 ? nowDate.getMonth() + 1 : '0' + (nowDate.getMonth() + 1);
      const tempday = nowDate.getDate() > 9 ? nowDate.getDate() : '0' + nowDate.getDate();
      let nowFullDayTime = tempyear + '-' + tempmonth + '-' + tempday;
      return nowFullDayTime;
    },
    query() {
      this.clearDateErrMsg();
      if (!this.startTime && this.endTime) {
        return this.$refs.startTime.showErr('请选择起始时间');
      }
      if (this.startTime && !this.endTime) {
        return this.$refs.endTime.showErr('请选择结束时间');
      }
      this.$parent.$refs.pagination.reset();
      this.$parent.pageNum = 1;
      this.$parent.queryList();
    },
    reset() {
      this.clearDateErrMsg();
      Object.assign(this, this.getDefaultData());
    },
    handleAddClick() {
      this.viewType = 'addModal';
    },
    addAccount() {
      this.$ajax({
        url: DI.authorLibrary.accountInfo,
        data: JSON.stringify({
          // ygId: this.accountInput,
          pptvUserId: this.usernameInput
        }),
        context: this,
        success: res => {
          if (res.retCode == '0') {
            const data = res.data;
            data.statffId = '';

            if (data.authorId && !data.authorType) {
              data.authorType = Constant.LIBRARY_AUTHOR_TYPE[0].value;
            }
            ++this.count;
            this.toAddList.unshift(data);
            this.ajaxed = false;
            // this.accountInput = '';
            this.usernameInput = '';

            if (this.toAddList.length === 5) {
              this.addBtnStatus = 'disabled';
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
    delItem(index) {
      this.ajaxed = false;
      this.toAddList.splice(index, 1);
    },
    close() {
      // this.$refs.accountInput && this.$refs.accountInput.setMsg('');
      this.$refs.usernameInput && this.$refs.usernameInput.setMsg('');
      this.ajaxed = false;
      // this.accountInput = '';
      this.usernameInput = '';
      this.toAddList = [];
      this.viewType = null;
      this.$parent.pageNum = 1;
      this.$parent.queryList();
    },
    sure() {
      let _self = this;

      if (!this.settleTypeParam) {
        this.$message.warning('请选择结算类型');
        return;
      }

      if (!this.showTypeParam) {
        this.$message.warning('请选择展示类型');
        return;
      }

      if (this.toAddList.length === 0) {
        this.$message.warning('请添加作者账号');
        return;
      }

      this.ajaxed = true;
      for (let i = 0, len = this.toAddList.length; i < len; i++) {
        let item = this.toAddList[i];

        if (this.validAccount(item) == null) {
          return;
        }
      }

      for (let i = 0, len = this.toAddList.length; i < len; i++) {
        let item = this.toAddList[i];
        if (item.successFlag === 'true') continue;

        let ajaxData = {
          custNo: item.custNo,
          account: item.account,
          authorId: item.authorId,
          authorType: item.authorType,
          authorName: item.authorName,
          statffId: item.statffId,
          userType: 1,
          status: 2
        };
        ajaxData = this.$bus.deleteNullProperty(ajaxData);
        ajaxData.settleType = this.settleTypeParam;
        ajaxData.showType = item.authorType == 1 ? this.roleTypeParam : this.showTypeParam;
        this.$ajax({
          url: DI.authorLibrary.addAuthor,
          data: JSON.stringify(ajaxData),
          context: this,
          success: res => {
            if (res.retCode == '0') {
              _self.count--;
              item.successFlag = 'true';
              item.errFlag = 'false';
            } else {
              item.successFlag = 'false';
              item.errFlag = 'true';
              item.errMsg = res.retMsg;
              _self.$set(_self.toAddList, i, item);
              this.$message.error(res.retMsg);
            }
          },
          error: () => {
            console.log('error');
          }
        });
      }
    },
    validAccount(row) {
      if (this.getAuthorTypeItem(row.authorType).key === 'inter' && !row.statffId) {
        this.$message.warning('内部作者，请输入工号');
        this.$refs[row.$index + 1] && this.$refs[row.$index + 1].focus();
        return;
      }
      return true;
    },
    refreshPage() {
      this.viewType = null;
      this.$parent.queryList();
    },
    clearDateErrMsg() {
      this.$refs.startTime.hideErr();
      this.$refs.endTime.hideErr();
    }
  }
};
</script>

<style scoped>
.crumb {
  background-color: #ffffff;
}

.cell {
  padding: 20px 0;
  .label {
    padding-right: 10px;
  }
}

.space {
  padding-left: 6px;
  padding-right: 6px;
}

.line {
  padding-left: 20px;
  padding-right: 20px;
}

.add-btn {
  padding-left: 15px;
  padding-right: 15px;
}

.td-btn button {
  color: #0abbfe;
}

.modal-body {
  width: 900px;
  padding: 20px 15px 0;
  .input-group {
    justify-content: center;
    margin-bottom: 25px;
    .container-box {
      margin-left: 15px;
      margin-right: 15px;
    }
  }
}

.btn-div-add button {
  padding: 0 25px;
}

.confirm-body {
  width: 400px;
  text-align: center;
  padding-bottom: 20px;
}

.btn-group {
  text-align: center;
}

.table {
  padding: 0 15px;
  position: relative;
  .status {
    position: absolute;
    left: -15px;
    top: 41px;
    li {
      width: 30px;
      background-position: center;
      background-repeat: no-repeat;
      background-size: 72%;
      &.failed {
        background-image: url(../../../assets/icon-error.png);
      }
      &.ok {
        background-image: url(../../../assets/icon-ok.png);
      }
    }
  }
}
</style>
