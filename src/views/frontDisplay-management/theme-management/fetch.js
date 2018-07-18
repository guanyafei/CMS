import DI from 'interface'
import Http from 'utils/http'
import Message from 'components/new-frame/message'

export const getThemeList = (vm, options) =>
  new Promise((resolve, reject) => {
    Http.ajax({
      url: DI.theme.getThemeList,
      data: JSON.stringify(options),
      loadingText: '正在查询列表信息，请稍候！',
      context: vm,
      success: res => {
        if (res.retCode == '0') {
          const data = res.data || {};
          resolve(data);
        } else {
          Message.error(res.retMsg);
        }
      },
      error: () => {
        console.log('error');
      }
    });
  });

export const shelveTheme = (vm, options) => 
  new Promise((resolve, reject) => {
    let str = options.status == 0 ? '下线' : '上线';
    Http.ajax({
      url: DI.theme.shelve,
      data: JSON.stringify(options),
      loadingText: `正在${str}，请稍候！`,
      context: vm,
      success: res => {
        if (res.retCode == '0') {
          const data = res.data || {};
          resolve(data);
        } else {
          Message.error(res.retMsg);
        }
      },
      error: () => {
        console.log('error');
      }
    });
  });

export const deleteTheme = (vm, options) =>
  new Promise((resolve, reject) => {
    Http.ajax({
      url: DI.theme.delete,
      data: JSON.stringify(options),
      loadingText: `正在删除，请稍候！`,
      context: vm,
      success: res => {
        if (res.retCode == '0') {
          const data = res.data || {};
          resolve(data);
        } else {
          Message.error(res.retMsg);
        }
      },
      error: () => {
        console.log('error');
      }
    });
  });

  export const getDetail = (vm, options) =>
    new Promise((resolve, reject) => {
      Http.ajax({
        url: DI.theme.getDetail,
        data: JSON.stringify(options),
        loadingText: `正在删除，请稍候！`,
        context: vm,
        success: res => {
          if (res.retCode == '0') {
            const data = res.data || {};
            resolve(data);
          } else {
            Message.error(res.retMsg);
          }
        },
        error: () => {
          console.log('error');
        }
      });
    });
