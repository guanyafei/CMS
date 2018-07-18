<template>
  <div class="crumb">
    <div class="is-line line space-between">
      <div class="is-line">
        <!-- <sn-select class="mr-30"
          ref="channel"
          v-model="infoFlowId"
          placeholder="请选择"
          radius="16"
          width="200"
          @change="handleChannelChange">
          <sn-option v-for="item in channelList"
            :key="item.infoFlowId"
            :name="item.subjectName"
            :value="item.infoFlowId">
          </sn-option>
        </sn-select> -->
        <sn-input class="mr-30" ref="chanel" v-model="subjectName" radius='16' width='200' :disabled='true'></sn-input>
        <div class="is-line cell">
          <span class="label">发表时间</span>
          <sn-timer v-model="startTime"
            ref="startTime"
            placeholder="起始时间"
            :maxDate="endTime"></sn-timer>
          <span class="label"></span>
          <span class="mr-10">至</span>
        </div>
        <sn-timer v-model="endTime"
          ref="endTime"
          placeholder="结束时间"
          :minDate="startTime"></sn-timer>
      </div>
      <sn-button type="primary"
        @click="query">查询</sn-button>
    </div>
    <div class="is-line line space-between">
      <div class="is-line">
        <sn-input ref="contentId"
          inputType="number"
          class="mr-30"
          v-model="contentId"
          width="200"
          radius="16"
          placeholder="请输入资讯ID"
          maxlength=20></sn-input>
        <sn-input class="mr-30"
          v-model="contentTitle"
          width="200"
          radius="16"
          placeholder="请输入资讯标题"
          maxlength=30></sn-input>
        <sn-input class="mr-30"
          v-model="authorId"
          width="200"
          radius="16"
          placeholder="请输入作者ID"></sn-input>
      </div>
      <sn-button @click="reset">重置</sn-button>
    </div>
    <div class="is-line line">
      <div class="is-line cell mr-30">
        <span class="label">文章类型</span>
        <sn-select ref="newsType"
          v-model="newsType"
          placeholder="请选择"
          radius="16"
          width="135"
          @change="handleTypeChange">
          <sn-option key='all'
            name='全部'
            :value='-1'></sn-option>
          <sn-option v-for="item in typeList"
            :key="item.key"
            :name="item.name"
            :value="item.value"
            :disabled="item.disabled">
          </sn-option>
        </sn-select>
      </div>
      <div class="is-line cell mr-30">
        <span class="label">文章来源</span>
        <sn-select ref="sourceType"
          v-model="sourceType"
          placeholder="请选择"
          radius="16"
          width="135"
          @change="handleSourceChange">
          <sn-option key='all'
            name='全部'
            :value='-1'></sn-option>
          <sn-option v-for="item in sourceList"
            :key="item.key"
            :name="item.name"
            :value="item.value"
            :disabled="item.disabled">
          </sn-option>
        </sn-select>
      </div>
      <div class="is-line cell mr-30">
        <span class="label">星级选择</span>
        <sn-select ref="level"
          v-model="level"
          placeholder="请选择"
          radius="16"
          width="135"
          @change="handleStarChange">
          <sn-option key='all'
            name='全部'
            :value='-1'></sn-option>
          <sn-option v-for="item in starList"
            :key="item.key"
            :name="item.name"
            :value="item.value"
            :disabled="item.disabled">
          </sn-option>
        </sn-select>
      </div>
      <div class="is-line cell mr-30">
        <span class="label">作者类型</span>
        <sn-select ref="authorType"
          v-model="authorType"
          placeholder="请选择"
          radius="16"
          width="135"
          @change="handleAuthorChange">
          <sn-option
            key='all'
            name='全部'
            :value='-1'>
          </sn-option>
          <sn-option
            v-for="item in authorList"
            :key="item.key"
            :name="item.name"
            :value="item.value">
          </sn-option>
        </sn-select>
      </div>
    </div>
    <div class="is-line btn-group">
      <sn-button type="primary"
        @click="uncheckAll"
        v-if="checkAllFlag">取消全选</sn-button>
      <sn-button type="primary"
        @click="checkAll"
        v-else>全选</sn-button>
      <sn-button type="success"
        @click="batchHandle('batchRefuse')">驳回</sn-button>
      <sn-button type="warning"
        @click="batchHandle('batchAccess')">审核通过</sn-button>
    </div>
  </div>
</template>

<script>
import DI from 'interface'
import * as Constant from 'js/constant'
export default {
  name: 'crumb',
  props: {
    selectedChannelId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      infoFlowId: this.selectedChannelId || '',
      subjectName:'',//热门频道名字
      channelList: [],
      typeList: Constant.ARTICLE_TYPE,
      sourceList: Constant.SOURCE_TYPE,
      starList: Constant.STAR_LEVEL,
      authorList: Constant.AUTHOR_TYPE,
      checkAllFlag: false,
      newsType: -1,//文章类型非必填
      sourceType: -1, //文章来源
      level: -1,//星级
      ...this.getDefaultData()
    }
  },
  created () {
    this.$bus.$on("review-checkAllStatus", (flag) => {
      this.checkAllFlag = flag;
    })
    this.queryChannelList();
  },
  methods: {
    queryChannelList () {
      this.$ajax({
        url: DI.infoReview.availChannelList,
        context: this,
        loadingText: '正在查询频道列表，请稍候！',
        success: (res) => {
          if (res.retCode == "0") {
            const data = res.data || {};
            this.channelList = data.clist || [];

            if (this.channelList.length > 0 && this.infoFlowId === '') {
              this.infoFlowId = this.channelList[0].infoFlowId;
            }
            if(this.channelList.length > 0){
              for (let index = 0; index < this.channelList.length; index++) {
                if(this.selectedChannelId == this.channelList[index].infoFlowId){
                  this.subjectName = this.channelList[index].subjectName;
                }
                
              }
            }
            this.$nextTick(() => {
              this.query();
            })
          } else {
            this.$message.error(res.retMsg);
          }
        },
        error: () => {
          console.log("error");
        }
      });
    },
    getDefaultData () {
      return {
        startTime: null,
        endTime: null,
        contentId: "",//文章ID非必填
        contentTitle: "",//文章标题非必填
        authorId: ""//作者名称非必填
      }
    },
    handleChannelChange (code) {
      this.infoFlowId = code;
      this.$nextTick(() => {
        this.query()
      })
    },
    handleTypeChange (code) {
      this.newsType = code;
      this.$nextTick(() => {
        this.query()
      })
    },
    handleSourceChange (code) {
      this.sourceType = code;
      this.$nextTick(() => {
        this.query()
      })
    },
    handleStarChange (code) {
      this.level = code;
      this.$nextTick(() => {
        this.query()
      })
    },
    handleAuthorChange (code) {
      this.authorType = code;
      this.$nextTick(() => {
        this.query()
      })
    },
    boundTime (num) {
      let boundDate = (num) => {
        let now = new Date();
        now = now.setDate(now.getDate() + num);
        return now;
      };

      return this.getNowTime(boundDate(num));
    },
    getNowTime (date) {
      var tempDate = date ? date : "";
      let nowDate = '';
      if (tempDate == "") {
        nowDate = new Date();
      } else {
        nowDate = new Date(tempDate);
      }
      const tempyear = nowDate.getFullYear();
      const tempmonth = (nowDate.getMonth() + 1) > 9 ? (nowDate.getMonth() + 1) : "0" + (nowDate.getMonth() + 1);
      const tempday = nowDate.getDate() > 9 ? nowDate.getDate() : "0" + nowDate.getDate();
      let nowFullDayTime = tempyear + "-" + tempmonth + "-" + tempday;
      return nowFullDayTime;
    },
    query () {
      this.clearDateErrMsg();
      if (!this.startTime && this.endTime) {
        return this.$refs.startTime.showErr('请选择起始时间');
      }
      if (this.startTime && !this.endTime) {
        return this.$refs.endTime.showErr('请选择结束时间');
      }
      if (!this.$refs.contentId.check()) {
        return;
      }
      this.$parent.queryList(1);
    },
    reset () {
      this.clearDateErrMsg();
      Object.assign(this, this.getDefaultData());
    },
    checkAll () {
      this.$bus.$emit("review-checkAll");
    },
    uncheckAll () {
      this.checkAllFlag = false;
      this.$bus.$emit("review-uncheckAll");
    },
    batchHandle (type) {
      let $borther = this.$parent.$refs.list;
      if ($borther.selecteds.length === 0) {
        this.$message.warning("请至少选中一条资讯！");

        return;
      }

      $borther.batchHandle(type);
    },
    clearDateErrMsg () {
      this.$refs.startTime.hideErr();
      this.$refs.endTime.hideErr();
    }
  }
}
</script>

<style scoped>
.crumb {
  background-color: #FFFFFF;
}

.cell {
  padding: 20px 0;
  .label {
    padding-right: 10px;
  }
}

.line {
  padding-left: 20px;
  padding-right: 20px;
}

.btn-group {
  padding-left: 20px;
  padding-bottom: 20px;
  button {
    width: 108px;
    &+button {
      margin-left: 30px;
    }
  }
}
</style>
