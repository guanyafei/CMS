import DI from 'interface'
import Http from 'utils/http'
import Message from 'components/new-frame/message'

export const getAuthorList = (vm, options) =>
  new Promise((resolve, reject) => {
    Http.ajax({
      url: DI.authorRecommend.list,
      data: JSON.stringify(options),
      loadingText: '正在查询列表信息，请稍候···',
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

export const getAuthorTypeList = (vm, options) =>
  new Promise((resolve, reject) => {
    Http.ajax({
      url: DI.authorRecommend.typeList,
      data: JSON.stringify(options),
      loadingText: '正在查询列表信息，请稍候···',
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

export const recommendHot = (vm, options) => 
  new Promise((resolve, reject) => {
    Http.ajax({
      url: DI.authorRecommend.recommendHot,
      data: JSON.stringify(options),
      loadingText: `正在加载，请稍候···`,
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

export const exchangeAuthor = (vm, options) =>
  new Promise((resolve, reject) => {
    Http.ajax({
      url: DI.authorRecommend.exchangeAuthor,
      data: JSON.stringify(options),
      loadingText: `正在加载，请稍候···`,
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

export const exchangeClassify = (vm, options) =>
  new Promise((resolve, reject) => {
    Http.ajax({
      url: DI.authorRecommend.exchangeClassify,
      data: JSON.stringify(options),
      loadingText: `正在加载，请稍候···`,
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

  export const doInsertIndex = (vm, options) =>
    new Promise((resolve, reject) => {
      Http.ajax({
        url: DI.authorRecommend.insertIndex,
        data: JSON.stringify(options),
        loadingText: `正在加载，请稍候···`,
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

  export const editClassify = (vm, options) =>
    new Promise((resolve, reject) => {
      Http.ajax({
        url: DI.authorRecommend.editClassify,
        data: JSON.stringify(options),
        loadingText: `正在加载，请稍候···`,
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

  export const doOnOff = (vm, options) =>
    new Promise((resolve, reject) => {
      Http.ajax({
        url: DI.authorRecommend.doOnOff,
        data: JSON.stringify(options),
        loadingText: `正在加载，请稍候···`,
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
