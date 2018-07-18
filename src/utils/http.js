import { getPassportUrl } from './envUrl';
import Loading from 'components/new-frame/loading';
const BASE_URL = '/snsis-admin-web';
const MIN_DELAY = 500;

const ajaxFuc = function(options) {
  const now = new Date().valueOf();
  const loadingSymbol = Symbol("loadingSymbol");  //用Symbol以防止多个请求的now相同
  let opt = {
    beforeSend: function() {
      if (options.loadingText !== 'false') {
        if (!window.loadingInstance) {
          window.loadingInstance = {};
        }
        window.loadingInstance[loadingSymbol] = Loading.service({
          fullscreen: true,
          text: options.loadingText || '正在加载中，请稍候。。。'
        });
        // console.log(window.loadingInstance, now, options.data);
      }
    },
    complete: function() {
      const completeTime = new Date().valueOf();
      const delay = options.delay || MIN_DELAY;
      const diff = completeTime - now;

      if (options.loadingText !== 'false') {
        if (diff < delay) {
          setTimeout(() => {
            window.loadingInstance[loadingSymbol] && window.loadingInstance[loadingSymbol].close();
            // console.log(window.loadingInstance, now, options.data, 'complete');
            delete window.loadingInstance[loadingSymbol];
          }, delay - diff);
        } else {
          window.loadingInstance[loadingSymbol] && window.loadingInstance[loadingSymbol].close();
          // console.log(window.loadingInstance, now, options.data, 'complete');
          delete window.loadingInstance[loadingSymbol];
        }
      }
    },
    type: 'POST',
    contentType: 'application/json'
  };

  Object.assign(opt, options);

  if (options.delay) {
    opt.success = (function(delay) {
      return function() {
        const completeTime = new Date().valueOf();
        const diff = completeTime - now;
        if (diff < delay) {
          setTimeout(options.success.bind(options.context, ...arguments), delay - diff);
        } else {
          options.success.apply(options.context, arguments);
        }
      };
    })(options.delay);
  }

  //本地调试
  /* if (options.debugger) {
    const debugger_mode = require('../mock').default;

    console.log(opt.url);
    console.log(opt.data);
    opt.beforeSend && opt.beforeSend.call(opt.context);
    setTimeout(() => {
      opt.complete && opt.complete.call(opt.context);
      if (debugger_mode[opt.url]) {
        debugger_mode[opt.url](opt);
      } else {
        opt.success && opt.success.call(opt.context, { retCode: '0' });
      }
    }, 500);

    return;
  } */
  //拼接基础路径
  if (!opt.noBaseUrl) {
    opt.url = BASE_URL + opt.url;
  }
  probeAuthStatus(
    function() {
      $.ajax(opt);
    },
    function() {
      const href = location.href;
      let passport = getPassportUrl();
      location.href = passport + encodeURIComponent(href);
    }
  );
};

export default {
  ajax: ajaxFuc
};
