import DI from 'interface';
import Http from 'src/utils/http';

export const fetchInfoItemDetailsAction = (vm, options) =>
  new Promise((resolve, reject) => {
    Http.ajax({
      url: DI.infoLibrary.itemDetails,
      data: JSON.stringify(options.params),
      loadingText: '正在查询当前资讯信息，请稍候！',
      context: vm,
      success: res => {
        if (res.retCode == '0') {
          const data = res.data || {};
          if (data.newsDetail) {
            data.newsDetail.fileSize = data.fileSize;
          }
          resolve(data.newsDetail);
        } else {
          vm.$message.error(res.retMsg);
        }
      },
      error: () => {
        console.log('error');
      }
    });
  });

export const fetchMediaListAction = (vm, options) => {
  vm.$ajax({
    url: DI.media.list,
    data: JSON.stringify(options.params),
    context: vm,
    loadingText: '正在加载资讯库列表，请稍候！',
    success: res => {
      if (res.retCode == '0') {
        const data = res.data;
        vm.list = data.newsList || [];
        vm.pageInfo.total = data.newsNum || 0;
        vm.selecteds = [];
      } else {
        vm.$message.error(res.retMsg);
      }
    },
    error: () => {
      console.log('error');
    }
  });
};

export const doItemOperateAction = (vm, options) => {
  vm.$ajax({
    url: DI.media.mediaItemOperate,
    context: vm,
    loadingText: options.loadingText,
    data: JSON.stringify(options.params),
    success: res => {
      if (res.retCode == '0') {
        vm.starVal = 1; // 重置星级为一级
        vm.$refs.refuseConfirm && (vm.$refs.refuseConfirm.reasonKey = '');
        vm.$refs.refuseConfirm && (vm.$refs.refuseConfirm.reason = '');
        vm.$bus.$emit('reload'); // 刷新当前页面
      } else {
        vm.$message.error(res.retMsg);
      }
    },
    error: () => {
      console.log('error');
    }
  });
};

export const doItemBatchOperateAction = (vm, options) => {
  vm.$ajax({
    url: DI.media.mediaListBatchOperate,
    context: vm,
    loadingText: options.loadingText,
    data: JSON.stringify(options.params),
    success: res => {
      if (res.retCode == '0') {
        vm.starVal = 1; // 重置星级为一级
        vm.$bus.$emit('reload'); // 刷新当前页面
      } else {
        vm.$message.error(res.retMsg);
      }
    },
    error: () => {
      console.log('error');
    }
  });
};

export const fetchChannelListAction = (vm, options) => {
  vm.$ajax({
    url: DI.media.channelList,
    context: vm,
    loadingText: '正在查询资讯上架频道，请稍候',
    data: JSON.stringify(options.params),
    success: res => {
      if (res.retCode == '0') {
        const data = res.data;
        vm.ruleForm.columnAllList = (data.subjectList || []).filter(subject => { return subject.subjectType == 1});
        vm.ruleForm.topicAllList = (data.subjectList || []).filter(subject => { return subject.subjectType == 3});
        vm.ruleForm.selectedSetLabels = data.setList || [];
        vm.ruleForm.program = data.program || {};
        vm.ruleForm.channelSet = [];
        (data.newsSubjectList || []).filter(subject => { vm.ruleForm.channelSet.push(subject.infoFlowId)});
        vm.buLabelList = data.buLabelList || [];
        if (data.nlrList.length > 0) {
          let labelList = vm.buLabelList.filter(item => {
            return data.nlrList[0].labelId == item.labelId;
          });
          vm.ruleForm.infoBuVal = labelList.length ? labelList[0].labelId : '';
        }

        let selectTopicList = (data.newsSubjectList || []).filter(subject => { return subject.subjectType == 3; });
        let totalSubjectList = [...selectTopicList, ...vm.ruleForm.topicAllList];
        let subjectObject = {};
        for (let index = 0, len = totalSubjectList.length; index < len; index++) {
          const subject = totalSubjectList[index];
          if (!subjectObject[subject.subjectId]) {
            subjectObject[subject.subjectId] = subject;
          }
        }
        vm.ruleForm.topicAllList = Object.values(subjectObject).reverse();
        vm.ruleForm.channelDisabledIds = (data.newsSubjectList || []).reduce((perVal, val) => {
          perVal.push(val.infoFlowId);
          return perVal;
        }, []);
      } else {
        vm.$message.error(res.retMsg);
      }
    },
    error: () => {
      console.log('error');
    }
  });
};

export const doPulishToChannelAction = (vm, options) => {
  vm.$ajax({
    url: DI.media.publishChannel,
    context: vm,
    loadingText: '正在发布频道，请稍候！',
    data: JSON.stringify(options.params),
    success: res => {
      if (res.retCode == '0') {
        vm.selecteds = [];
        vm.ruleForm.infoBuVal = '';
        vm.$bus.$emit('reload');
      } else {
        vm.$parent.viewType = 'publish';
        vm.$message.error(res.retMsg);
      }
    },
    error: () => {
      console.log('error');
    }
  });
};
