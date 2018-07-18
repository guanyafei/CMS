export default {
  // 编辑器查询接口
  editor: {
    queryVideoDetail: '/adminMgt/queryVideoDetail.do', // 查询mip视频详情
    queryMipVideoListByTitle: '/adminMgt/fuzzyQueryVideos.do', // 根据标题查询mip视频列表
    queryDefaultVideoList: '/adminMgt/getVideoList.do' // 根据标题查询mip视频列表
  },
  // 媒资视频管理  start
  componentsMediaClassify: {
    queryBaseClassifySuggestionList: '/adminMgt/MediaInfo/getBppcatalog.do', // 基础分类
    queryFrontClassifySuggestionList: '/adminMgt/MediaInfo/getEpgcatalog.do' // 前端分类
  }
};
