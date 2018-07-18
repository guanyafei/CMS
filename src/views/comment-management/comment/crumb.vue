<template>
<div id="commentMenu-bar">
  <sn-search-box :fields="fields">
    <sn-search-item :children="[{
        type: 'duration',
        prop: ['startTime','endTime']
      }, {
        type: 'button',
        buttonType: 'primary',
        text: '查询',
        triggerEvent: query,
        isRight: true
      }]">
    </sn-search-item>
    <sn-search-item :children="[{
        type: 'input',
        prop: 'contentTitleId',
        placeholder: '请输入内容ID'
      }, {
        type: 'input',
        prop: 'commContent',
        placeholder: '请输入内容评论',
        maxlength: 100
      }, {
        type: 'input',
        prop: 'contentTitle',
        placeholder: '请输入内容标题',
        maxlength: 100
      }, {
        type: 'input',
        prop: 'userId',
        placeholder: '请输入评论人ID'
      }, {
        type: 'button',
        text: '重置',
        triggerEvent: reset,
        isRight: true
      }]">
    </sn-search-item>
    <sn-search-item :children="[{
          type: 'select',
          label: '评论状态',
          prop: 'commStatus',
          list: commentList,
          triggerEvent: handleSelectChange
        }, {
          type: 'select',
          label: '评论来源',
          prop: 'commSource',
          list: sourceList,
          triggerEvent: handleSelectChange
        }, {
          type: 'select',
          label: '内容类型',
          prop: 'contentTitleType',
          list: contentList,
          triggerEvent: handleSelectChange
        }, {
          type: 'input',
          prop: 'soaUserId',
          placeholder: '请输入评论操作工号',
          }]">
    </sn-search-item>
    <sn-search-item :children="[{
      type: 'slot',
      prop:'audit'
    }, {
      type: 'slot',
      prop: 'hide'
    }]">
      <sn-button slot="audit" v-show="isAudit" type="primary" @click="auditHandle()">审核通过</sn-button>
      <sn-button slot="hide" type="primary" @click="hiddenHandle()">隐藏</sn-button>
    </sn-search-item>
  </sn-search-box>

  <!-- 审核执行弹窗 -->
    <sn-confirm :flag="auditModel.isShow"
      :title="auditModel.title"
      @close="auditModel.isShow = false"
      @sure="doHandle">
      <div style="padding:20px">
        <P class="mb-10" style="text-align:center">{{auditModel.content}}</P>
        <sn-radio-group v-if="auditModel.isAudit" v-model="auditModel.isHot">
          <label style="padding-right:10px;padding-left:10px;line-height:25px;">是否设为热门评论</label>
          <sn-radio :label="1">是</sn-radio>
          <sn-radio :label="0">否</sn-radio>
        </sn-radio-group>
      </div>
    </sn-confirm>

 </div> 
</template>

<script>
import DI from 'interface';
import * as Constant from 'js/constant';
export default {
  name: 'CommentCrumb',
  componentName: 'CommentCrumb',
  props: ['checkAll','tabIndex'],
  data() {
    return {
      fields: {
        commStatus: -1,
        commSource: -1,
        contentTitleType: -1,
        ...this.getDefaultData()
      },
      commentList: Constant.COMMENT_STATUS,
      sourceList: Constant.COMMENT_SOURCE_TYPE,
      contentList: Constant.COMMENT_CONTENT_TYPECOM,
      isAudit:true,//当前是否处于待审核tab
      auditModel:{//审核弹窗 626 wuxa
        isShow:false,
        isAudit:true,//是否是审核弹窗
        isHot:0,//默认是热门
        title:'',
        content:''
      },
      tabRefsList:['list','ruditList']//ref
    }
  },
  methods: {
    query () {
      let { clearDateErrMsg, fields } = this;
      clearDateErrMsg();
      if (!fields.startTime && fields.endTime) {
        this.$bus.$emit('start-error-info');
        return;
      }
      if (fields.startTime && !fields.endTime) {
        this.$bus.$emit('end-error-info');
        return;
      }
      this.$parent.queryList();
    },
    getDefaultData() {
      return {
        startTime: null,
        endTime: null,
        commContent: '',
        contentTitleId: '',
        contentTitle: '',
        userId: '',
        soaUserId: ''
      }
    },
    handleSelectChange(code, field) {
      this.fields[field] = code;
      this.$nextTick(()=>{
        this.query()
      })
    },
    reset() {
      this.clearDateErrMsg();
      Object.assign(this.fields, this.getDefaultData());
    },
    clearDateErrMsg() {
      this.$bus.$emit('clear-start-error');
      this.$bus.$emit('clear-end-error');
    },
    toggleCheckAll (type) {
      this.$bus.$emit('checkAllBtn-click', !type);
    },
    //打开批量隐藏弹窗
    hiddenHandle () {
    //当前处于哪个tab,获取当前tab也的选中个数
      let [tabRefs,$index] = [this.tabRefsList,this.tabIndex];
      let $borther = this.$parent.$refs[tabRefs[$index]];
      if ($borther.selecteds.length === 0) {
        this.$message.warning("请至少选中一条评论！");
        return;
      }
      //展示弹窗
      this.auditModel = {
        isShow:true,
        isAudit:false,
        title:'批量隐藏',
        content:'确认将所选评论设为隐藏？'
      }
    },
    //打开批量审核弹窗
    auditHandle(){//审核通过
      let [tabRefs,$index] = [this.tabRefsList,this.tabIndex];
      let $borther = this.$parent.$refs[tabRefs[$index]];
      if ($borther.selecteds.length === 0) {
        this.$message.warning("请至少选中一条评论！");
        return;
  }
      //展示弹窗
      this.auditModel = {
        isShow:true,
        isAudit:true,
        isHot:0,
        title:'批量审核',
        content:'确认将所选评论审核通过？'
}
    },
    //执行审核/隐藏操作
    batchHandle() {
      //当前处于哪个tab
      let [tabRefs,$index] = [this.tabRefsList,this.tabIndex];
      let $borther = this.$parent.$refs[tabRefs[$index]];
      //获取当前选中
      let commentList = $borther.curSelecteds.reduce((prevArr, elem) => {
        prevArr.push({
          commId: elem.commId,
          contentTitleId: elem.commTitleId,
          contentTitleType: elem.commTitleType
        });
        return prevArr;
      }, []);
      let urlParam = this.auditModel.isAudit ? DI.commentLibrary.batchAuditComment : DI.commentLibrary.batchHideComment;
      let params = { commentList };
      if(this.auditModel.isAudit){//审核
        params.hotFlg = this.auditModel.isHot;//热门
        params.auditFlg = 1;//审核操作
      }else{//隐藏
        params.hideFlag = true;
      }
      this.$ajax({
        url: urlParam,
        loadingText: '正在批量隐藏，请稍候！',
        context: this,
        delay: 1000,
        data: JSON.stringify(params),
        success: res => {
          if (res.retCode == '0') {
            this.$message.success('操作成功');
            this.$parent.queryList(this.$parent.pageIndex);
          } else {
            this.$message.error(res.retMsg);;
          }
        },
        error: () => {
          this.viewType = true;
          console.log('error');
        }
      });
    },
    doHandle(){//批量审核,隐藏操作
      if(this.auditModel.isAudit){//审核
        this.batchHandle();
      }else{//隐藏
        this.batchHandle();
    }
      this.auditModel.isShow = false;
    },
  }
}
</script>
<style>
#commentMenu-bar{
    .sn-popup .sn-popup-modal .sn-popup-title{
        font-weight: bolder;
    }
}
</style>
