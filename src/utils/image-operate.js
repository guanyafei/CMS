import { COVER_WIDTH_SCOPE } from 'js/constant'

export function getImgPixelSize(imgFile, isValid = true, pixelScope = {}) {
  pixelScope = Object.assign(COVER_WIDTH_SCOPE, pixelScope);
  return new Promise((resolve, reject) => {
    let url;
    let fileType = typeof imgFile;
    if (fileType === 'object') {
      url = window.URL.createObjectURL(imgFile);
    }
    if (fileType === 'string') {
      url = imgFile;
    }
    // 创建预览图片
    let img = new Image()
    img.onload = function() {
      let { width, height } = this;
      let { max, min } = pixelScope;
      if (isValid) {
        if ((max && width > max) || (min && width < min)) {
          reject({ width, max: max, min: min });
        } else {
          resolve({ width, height });
        }
      } else {
        resolve({ width, height })
      }
    }
    img.onerror = function (err) {
      reject({ msg: '封面图片无法加载.' });
    }
    img.src = url
  })
}

export function getImgStyle(src) {
  let width, height;
  const widthRegResult = src.match(/imgW=(\d*)/);
  const heightRegResult = src.match(/imgH=(\d*)/);
  if (widthRegResult) {
    width = widthRegResult[1];
  }
  if (heightRegResult) {
    height = heightRegResult[1];
  }
  return {
    width,
    height
  };
}
