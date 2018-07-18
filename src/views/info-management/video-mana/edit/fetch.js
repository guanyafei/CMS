import DI from 'interface';
import Http from 'utils/http';
import Message from 'components/new-frame/message';

export const fetchVideoItemDetailsAction = (vm, options) =>
  new Promise((resolve, reject) => {
    Http.ajax({
      url: DI.publishVideo.fetchVideoDetailsById,
      data: JSON.stringify(options.params),
      loadingText: '正在查询视频信息，请稍候！',
      context: vm,
      success: res => {
        if (res.retCode == '0') {
          const data = res.data || {};

          resolve(data);
        } else {
          reject('failed');
          Message.error(res.retMsg);
        }
      },
      error: () => {
        reject('error');
        console.log('error');
      }
    });
  });

export const fetchAttachImgListByVideoId = (vm, options) =>
  new Promise((resolve, reject) => {
    Http.ajax({
      url: DI.publishVideo.fetchAttachImgListByVideoId,
      data: JSON.stringify(options.params),
      loadingText: '正在查询当前图片库列表，请稍候！',
      context: vm,
      success: res => {
        if (res.retCode == '0') {
          const data = res.data || [];

          resolve(data);
        } else {
          reject('failed');
          Message.error(res.retMsg);
        }
      },
      error: () => {
        reject('error');
        console.log('error');
      }
    });
  });

export const uploadVideoBase64Cover = (vm, options) => {
  let { params } = options;
  let formData = new FormData();

  formData.append('channelId', params.channelId);
  formData.append('base64File', params.base64File);
  formData.append('fileName', params.fileName);
  formData.append('contentType', params.contentType);
  formData.append('size', params.size);
  formData.append('image', params.file);

  return new Promise((resolve, reject) => {
    Http.ajax({
      url: DI.publishVideo.uploadFileBase64OfvideoCover,
      processData: false,
      contentType: false,
      data: formData,
      loadingText: '正在上传图片，请稍候！',
      context: vm,
      success: res => {
        if (res.retCode == '0') {
          const data = res.data || [];
          resolve(data);
        } else {
          reject('failed');
          Message.error(res.retMsg);
        }
      },
      error: () => {
        reject('error');
        console.log('error');
      }
    });
  });
};

export const doMediaPushToVipAction = (vm, options) =>
  new Promise((resolve, reject) => {
    Http.ajax({
      url: DI.publishVideo.mediaPushToVip,
      data: JSON.stringify(options.params),
      loadingText: `正在${options.params.type == 3 ? '取消' : ''}推送，请稍候！`,
      context: vm,
      success: res => {
        if (res.retCode == '0') {
          const data = res.data || [];
          resolve(data);
        } else {
          reject('failed');
          Message.error(res.retMsg);
        }
      },
      error: () => {
        reject('error');
        console.log('error');
      }
    });
  });

export const editMediaVideo = (vm, options) =>
  new Promise((resolve, reject) => {
    Http.ajax({
      url: DI.publishVideo.editMediaVideo,
      data: JSON.stringify(options.params),
      loadingText: '正在发布视频，请稍候！',
      context: vm,
      success: res => {
        if (res.retCode == '0') {
          resolve();
        } else {
          reject('failed');
          Message.error(res.retMsg);
        }
      },
      error: () => {
        reject('error');
        console.log('error');
      }
    });
  });

export const toggleVideoFileStatus = (vm, options) =>
  new Promise((resolve, reject) => {
    Http.ajax({
      url: DI.publishVideo.toggleVideoFileStatus,
      data: JSON.stringify(options.params),
      loadingText: '正在删除此码流，请稍候！',
      context: vm,
      success: res => {
        if (res.retCode == '0') {
          resolve();
        } else {
          reject('failed');
          Message.error(res.retMsg);
        }
      },
      error: () => {
        reject('error');
        console.log('error');
      }
    });
  });
