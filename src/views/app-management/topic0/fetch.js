import DI from 'interface';
import Http from 'src/utils/http';

export const fetchTopicHomeListAction = (vm, options) => {
  vm.$ajax({
    url: DI.topic.querySpecial,
    data: JSON.stringify(options.params),
    context: vm,
    loadingText: '正在加载专题列表，请稍候！',
    success: res => {
      if (res.retCode == '0') {
        const data = res.data || {};
        vm.list = data.specialList || [];
        vm.pageInfo.total = data.specialNum || 0;
      } else {
        vm.$message.error(res.retMsg);
      }
    },
    error: () => {
      console.log('error');
    }
  });
};
