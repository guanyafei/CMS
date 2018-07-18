const origin = location.origin;
const isDevEnv = origin.indexOf('dev') > -1 || origin.indexOf('sit') > -1;
const isPstEnv = origin.indexOf('pst') > -1;
const isPreEnv = origin.indexOf('pre') > -1;
const isNewSystem = origin.indexOf('ppsports') > -1;

export const staticDefaultCover = isDevEnv ? 'http://snsisopsit.cnsuning.com/static/cover-default.png' : 'http://snsisop.suning.com/static/cover-default.png'; // 必须保持和公众平台一致

export const getPassportUrl = () => {
  let url = '';
  if (isDevEnv) {
    let passportStr = isNewSystem ? encodeURIComponent('http://ppsportssit.cnsuning.com/sportfed-admin-web/auth') : 'http://snsissit.admin.cnsuning.com/snsis-admin-web/auth';
    url = 'https://ssosit.cnsuning.com/ids/login?service=' + passportStr + '?targetUrl=';
  } else if (isPstEnv) {
    let passportStr = isNewSystem ? encodeURIComponent('http://ppsportspst.cnsuning.com/sportfed-admin-web/auth') : 'http://snsispst.admin.cnsuning.com/snsis-admin-web/auth';
    url = 'https://ssopst.cnsuning.com/ids/login?service=' + passportStr + '?targetUrl=';
  } else if (isPreEnv) {
    let passportStr = isNewSystem ? encodeURIComponent('http://ppsportspre.cnsuning.com/sportfed-admin-web/auth') : 'http://snsispre.admin.cnsuning.com/snsis-admin-web/auth';
    url = 'https://ssopre.cnsuning.com/ids/login?service=' + passportStr + '?targetUrl=';
  } else {
    let passportStr = isNewSystem ? encodeURIComponent('http://ppsports.cnsuning.com/sportfed-admin-web/auth') : 'http://snsis.admin.cnsuning.com/snsis-admin-web/auth';
    url = 'https://sso.cnsuning.com/ids/login?service=' + passportStr + '?targetUrl=';
  }
  return url;
};

// "http://mipapi.misc.ppqa.com";//线下
export const VIDEOSET_URL = isDevEnv ? 'http://10.200.24.235:8080' : 'http://mipmisc.api.pptv.com' ;
// export const VIDEOSET_URL = isDevEnv ? 'http://mipapi.misc.ppqa.com' : 'http://mipmisc.api.pptv.com' ;

export const getProductPriceUrl = (bizCode, cmmdtyCode) => {
  let url = '';
  if (isDevEnv) {
    url = `http://icpssit.cnsuning.com/icps-web/getVarnishAllPrice014/${
      cmmdtyCode
    }_025__${bizCode}_2_callback.vhtm`;
  } else if (isPreEnv) {
    url = `http://icpspre.cnsuning.com/icps-web/getVarnishAllPrice014/${
      cmmdtyCode
    }_025__${bizCode}_2_callback.vhtm`;
  } else {
    url = `http://icps.suning.com/icps-web/getVarnishAllPrice014/${
      cmmdtyCode
    }_025__${bizCode}_2_callback.vhtm`;
  }

  return url;
};
export const getProductImgsUrl = (bizCode, cmmdtyCode) => {
  return `http://image.suning.cn/uimg/b2c/newcatentries/${bizCode}-${
    cmmdtyCode
  }`;
};

export const getInfoPreviewUrl = options => {
  let infoType = options.type;
  let prefix = '';
  let url = '';
  const pageTypeMap = {
    text: 'news',
    picture: 'images',
    video: 'videonews'
  };

  switch (infoType) {
    case 'text':
    case 'picture':
    case 'video':
      if (isDevEnv) {
        prefix = 'http://mspssit.suning.com';
      } else {
        prefix = 'http://m.ty.pptv.com';
      }
      url = `${prefix}/?pageType=${pageTypeMap[infoType]}&contentId=${
        options.newsId
      }`;
      break;

    case 'daily':
      if (isDevEnv) {
        url = `http://snsisopsit.cnsuning.com/daily_share/index.html?contentId=${
          options.newsId
        }`;
      } else {
        url = `http://snsisop.suning.com/daily_share/index.html?contentId=${
          options.newsId
        }`;
      }
      break;

    case 'shortV':
      if (isDevEnv) {
        url = `http://mspssit.suning.com/shortvideonews/${options.newsId}`;
      } else {
        url = `http://pplive.suning.com/shortvideonews/${options.newsId}`;
      }
      break;

    default:
      break;
  }

  return url;
};
export const getInfoLinkUrl = (info, infoType) => {
  let router = 'pptvsports://page/news';

  switch (infoType) {
    case 'text':
      router += `/detail/?content_id=${info.newsId}&contenttype=1`;
      break;
    case 'picture':
      router += `/atlas/?image_id=${info.newsId}`;
      break;
    case 'video':
      router += `/detail/?content_id=${info.newsId}&channel_id=${
        info.vedioSetId
      }&contenttype=3`;
      break;
    case 'daily':
      router += `/detail/?content_id=${info.newsId}&contenttype=6`;
      break;
    case 'shortV':
      router += `/video/?content_id=${info.newsId}`;
      break;
  }

  return router;
};

export const getMultiportSite = (info, infoType) => {
  let router = {};

  switch (infoType) {
    case 'text':
      router = {
        inter: `pptvsports://page/news/detail/?content_id=${info.newsId}&contenttype=1`,
        app: `http://pplive.suning.com/news/${info.newsId}.html`,
        pc: `http://sports.pptv.com/article/pg_detail?aid=${info.newsId}&type=article`
      };
      break;
    case 'picture':
      router = {
        inter: `pptvsports://page/news/atlas/?image_id=${info.newsId}`,
        app: `http://pplive.suning.com/images/${info.newsId}.html`,
        pc: `http://sports.pptv.com/article/pg_detail?aid=${info.newsId}&type=photos`
      };
      break;
    case 'video':
      router = {
        inter: `pptvsports://page/news/detail/?content_id=${info.newsId}&channel_id=${info.videoSetId}&contenttype=3`,
        app: `http://pplive.suning.com/videonews/${info.newsId}.html`
      };
      break;
    case 'daily':
      router = {
        inter: `pptvsports://page/news/detail/?content_id=${info.newsId}&contenttype=6`,
        app: `http://snsisop.suning.com/daily_share/index.html?contentId=${info.newsId}`
      };
      break;
    case 'shortV':
      router = {
        inter: `pptvsports://page/news/video/?content_id=${info.newsId}`,
        app: `http://pplive.suning.com/shortvideonews/${info.newsId}.html`
      };
      break;
  }

  return router;
};
