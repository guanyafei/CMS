const hasOwnProperty = Object.prototype.hasOwnProperty;

export function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
export const getIntersectionArr = (a, b) => a.filter(v => b.includes(v));
export const getUnionArr = (a, b) => [...new Set([...a, ...b])];
export const getDiffereceArrInPrevArr = (a, b) => a.concat(b).filter(v => !b.includes(v));

export function formatDate(input, fmt) {
  if (!input) return;
  fmt = fmt || 'hh:mm:ss';
  var dateObj = new Date(input);
  var o = {
    'M+': dateObj.getMonth() + 1, //月份
    'd+': dateObj.getDate(), //日
    'h+': dateObj.getHours(), //小时
    'm+': dateObj.getMinutes(), //分
    's+': dateObj.getSeconds(), //秒
    'q+': Math.floor((dateObj.getMonth() + 3) / 3), //季度
    S: dateObj.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (dateObj.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
  return fmt;
}
export function secoundToTime(s) {
  var t;
  if (s > -1) {
    var hour = Math.floor(s / 3600);
    var min = Math.floor(s / 60) % 60;
    var sec = s % 60;
    if (hour < 10) {
      t = '0' + hour + ':';
    } else {
      t = hour + ':';
    }

    if (min < 10) {
      t += '0';
    }
    t += min + ':';
    if (sec < 10) {
      t += '0';
    }
    t += sec.toFixed(0);
  }
  return t;
}
export function secoundToZHTime(s) {
  var t;
  if (s > -1) {
    var hour = Math.floor(s / 3600);
    var min = Math.floor(s / 60) % 60;
    var sec = s % 60;
    if (hour === 0) {
      t = '';
    } else if (hour < 10) {
      t = '0' + hour + '小时';
    } else {
      t = hour + '小时';
    }

    if (min < 10) {
      t += '0';
    }
    t += min + '分';
    if (sec < 10) {
      t += '0';
    }
    t += sec.toFixed(0) + '秒';
  }
  return t;
}

export function getHistoryMapData(key) {
  let historyStr = localStorage.getItem(key);
  let result = {};
  if (historyStr && historyStr.indexOf('{') === 0) {
    result = JSON.parse(historyStr);
  }
  return result;
}
export function setHistoryMapData(key, obj) {
  localStorage.setItem(key, JSON.stringify(obj))
}
export function getHistoryArrData(key) {
  let historyStr = localStorage.getItem(key);
  let results = [];

  if (historyStr && historyStr.indexOf('[') === 0) {
    let historyArr = JSON.parse(historyStr);
    let len = historyArr.length;
    let i = 0;
    let isMultiIndentifiers = false;

    if (len > 0) {
      const firstItem = historyArr[0];
      const keys = Object.keys(firstItem);
      if (keys.length === 1 && typeof firstItem[keys[0]] === 'object') {
        isMultiIndentifiers = true;
      }
    }

    for (; i < len; i++) {
      const historyItem = historyArr[i];
      if (isMultiIndentifiers) {
        let indentifier = Object.keys(historyItem)[0];
        results.push(historyItem[indentifier]);
      } else {
        results.push(historyItem);
      }
    }
  }
  return results;
}

export function setHistoryArrData(key, list, indentifiers) {
  if (!key || !Array.isArray(list) || (list.length === 0 && !indentifiers)) {
    return;
  }

  let historyArr = JSON.parse(localStorage.getItem(key)) || [];
  const isStringIndentifier = typeof indentifiers === 'string';
  let curIndentifier;

  if (isStringIndentifier) {
    curIndentifier = indentifiers;
  } else {
    for (let i = 0; i < indentifiers.length; i++) {
      const indentifier = indentifiers[i];
      if (indentifier && list[0][indentifier]) {
        curIndentifier = indentifier;
        break;
      }
    }
  }

  for (let i = 0; i < list.length; i++) {
    const addItem = list[i];

    for (let j = 0; j < historyArr.length; j++) {
      const historyItem = historyArr[j];
      let indentifierId;

      if (isStringIndentifier) {
        indentifierId = historyItem[curIndentifier];
      } else {
        historyItem[curIndentifier] && (indentifierId = historyItem[curIndentifier][curIndentifier]);
      }
      if (indentifierId === addItem[curIndentifier]) {
        historyArr.splice(j, 1);
        break;
      }
    }
  }

  for (let i = 0; i < list.length; i++) {
    const addItem = list[i];
    if (isStringIndentifier) {
      historyArr.unshift(addItem);
    } else {
      historyArr.unshift({ [curIndentifier]: addItem });
    }
  }

  historyArr = historyArr.slice(0, 6);

  localStorage.setItem(key, JSON.stringify(historyArr));
}

export function removeHistoryData(key) {
  if (key) {
    localStorage.removeItem(key);
  } else {
    localStorage.clear();
  }
}
