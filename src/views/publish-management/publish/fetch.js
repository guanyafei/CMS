import DI from 'interface';
import Http from 'utils/http';

export const fetchInfoInitDataAction = (vm, options) =>
  new Promise((resolve, reject) => {
    Http.ajax({
      url: DI.publish.initPublishData,
      data: JSON.stringify(options.params),
      loadingText: '正在查询初始化数据，请稍候！',
      context: vm,
      success: res => {
        if (res.retCode == '0') {
          const data = res.data || {};
          resolve(data);
        } else {
          reject('failed');
          vm.$message.error(res.retMsg);
        }
      },
      error: () => {
        reject('error');
        console.log('error');
      }
    });
  });

export const fetchDraftDetailsAction = (vm, options) =>
  new Promise((resolve, reject) => {
    Http.ajax({
      url: DI.publish.queryDraftDetails,
      data: JSON.stringify(options.params),
      loadingText: '正在查询当前草稿箱信息，请稍候！',
      context: vm,
      success: res => {
        if (res.retCode == '0') {
          const data = res.data || {};
          resolve(data);
        } else {
          reject('failed');
          vm.$message.error(res.retMsg);
        }
      },
      error: () => {
        reject('error');
        console.log('error');
      }
    });
  });

export const saveToDraftContainer = (vm, options) =>
  new Promise((resolve, reject) => {
    Http.ajax({
      url: DI.publish.saveToDraftContainer,
      data: JSON.stringify(options.params),
      loadingText: '正在保存草稿箱，请稍候！',
      context: vm,
      success: res => {
        if (res.retCode == '0') {
          const data = res.data || {};
          resolve(data);
        } else {
          reject('failed');
          vm.$message.error(res.retMsg);
        }
      },
      error: () => {
        reject('error');
        console.log('error');
      }
    });
  });

//查询草稿列表
