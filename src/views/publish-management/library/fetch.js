import DI from 'interface';
import Http from 'src/utils/http';
//查询草稿列表
export const fetchDraftListAction = (vm, options) => {
  vm.$ajax({
    url: DI.news.draftNewsList,
    data: JSON.stringify(options.params),
    context: vm,
    loadingText: '正在加载草稿列表，请稍候！',
    success: res => {
      if (res.retCode == '0') {
        const data = res.data;
        vm.draftList = data.draftNewsList || [];
        vm.draftPageInfo.total = data.draftNewsNum || 0;
      } else {
        vm.$message.error(res.retMsg);
      }
    },
    error: () => {
      console.log('error');
    }
  });
};
//查询资讯列表
export const fetchNewsListAction = (vm, options) => {
  vm.$ajax({
    url: DI.news.newsList,
    data: JSON.stringify(options.params),
    context: vm,
    loadingText: '正在加载资讯库列表，请稍候！',
    success: res => {
      if (res.retCode == '0') {
        const data = res.data;
        vm.list = data.newsList || [];
        vm.pageInfo.total = data.newsNum || 0;
      } else {
        vm.$message.error(res.retMsg);
      }
    },
    error: () => {
      console.log('error');
    }
  });
};

//查询发布的频道
export const fetchChannelListAction = (vm, options) => {
  vm.$ajax({
    url: DI.news.queryAuthorPublishChannel,
    context: vm,
    loadingText: '正在查询资讯发布频道，请稍候',
    data: JSON.stringify(options.params),
    success: res => {
      if (res.retCode == '0') {
        const data = res.data;
        vm.ruleForm.newsType = data.newsType;
        vm.ruleForm.columnAllList = (data.subjectList || []).filter(subject => { return subject.subjectType == 1});
        vm.ruleForm.topicAllList = (data.subjectList || []).filter(subject => { return subject.subjectType == 3});
        vm.ruleForm.channelSet = [];
        (data.newsSubjectList || []).filter(subject => { vm.ruleForm.channelSet.push(subject.infoFlowId)});

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
//发布频道
export const doPulishToChannelAction = (vm, options) => {
  vm.$ajax({
    url: DI.news.saveAuthorPublishChannel,
    context: vm,
    loadingText: '正在发布频道，请稍候！',
    data: JSON.stringify(options.params),
    success: res => {
      if (res.retCode == '0') {
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
