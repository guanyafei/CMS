import { formatDate } from 'utils/util';
export const diff = (str) => {
  if (!str) return ''
  var date = new Date(str)
  var time = new Date().getTime() - date.getTime() //现在的时间-传入的时间 = 相差的时间（单位 = 毫秒）
  if (time < 0) {
    return formatDate(date, 'MM.dd');
  } else if (time / 1000 <= 24 * 3600) {
    return '今天'
  } else {
    return formatDate(date, 'MM.dd');
  }
}

export const smallImage = (str, w = 120, h = 80) => {
  if (!str) return '';
  if (str.indexOf('?') == -1) {
    return `${str}?format=${w}w_0l`;
  }
  return `${str}&format=${w}w_0l`;
}
/**
 * 过9999 => 1w
 * @param {Number} val 
 */
export const overTenThousand = (val) => {
  if (!val) {
    return 0;
  }
  val = parseInt(val, 10);
  return val > 9999 ? (Math.floor(val / 1000) / 10) + 'w' : val;
}
/**
 * 敏感词标红
 * @param {String} content //未脱敏的原始文字内容
 * @param {Array} wordsList //敏感词数组
 */
export const findSensitive = (content, badWordsList) => {
  if (!content || !badWordsList || !badWordsList.length) {
    return content;
  }
  for (let i = 0; i < badWordsList.length; i++) {
    let temp = content.split(badWordsList[i]);
    let badWord = `<span style="color:red">${badWordsList[i]}</span>`;
    content = temp.join(badWord);
  }

  return content;
}
