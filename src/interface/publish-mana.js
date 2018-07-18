export default {
  // 发布详情和草稿  start
  news: {
    newsList: '/adminMgt/newsPublic/queryMyNewsList.do', //查询资讯发布列表
    draftNewsList: '/adminMgt/newsPublic/queryMyDraftNewsList.do', //查询草稿列表
    deleteNews: '/adminMgt/newsPublic/deleteNews.do', //删除资讯
    deleteNewsDraft: '/adminMgt/newsPublic/deleteNewsDraft.do', //删除草稿资讯
    saveAuthorPublishChannel: '/adminMgt/newsPublic/saveAuthorPublishChannel.do', //保存追加发布频道
    queryAuthorPublishChannel: '/adminMgt/newsPublic/queryAuthorPublishChannel.do' //追加发布，查询频道列表
  },

  // 发布详情和草稿  end
  publish: {
    initPublishData: '/adminMgt/newsPublic/initPublishData.do',
    publishNews: '/adminMgt/newsPublic/saveNews.do',
    queryTopicListByName: '/adminMgt/newsPublic/querySpecial.do',
    querySpecial: '/adminMgt/querySpecial.do',//资讯库 自媒体搜索专题接口
    queryDraftDetails: '/adminMgt/newsPublic/queryNewsDraftDetail.do',
    saveToDraftContainer: '/adminMgt/newsPublic/saveNewsDraft.do',
    getReadyList: '/adminMgt/MediaInfo/getReadyList.do',
    getMediaList: '/adminMgt/MediaInfo/getMediaList.do',
    getVideoDetail: '/adminMgt/MediaInfo/getVideoDetail.do'
  },
  publishVideo: {
    fetchVideoDetailsById: '/adminMgt/MediaInfo/getVideoDetail.do',
    fetchAttachImgListByVideoId: '/adminMgt/MediaInfo/coverPicList.do',
    uploadFileBase64OfvideoCover: '/adminMgt/MediaInfo/uploadMediaImage.do',
    mediaPushToVip: '/adminMgt/MediaInfo/mediaPushToVip.do',
    queryMediaSetSuggestionListByName: '/adminMgt/MediaInfo/querySetList.do',
    batchSaveMediaVideo: '/adminMgt/MediaInfo/batchSaveMediaVideo.do',
    editMediaVideo: '/adminMgt/MediaInfo/editMediaVideo.do',
    toggleVideoFileStatus: '/adminMgt/MediaInfo/deleteStream.do',
    queryProgram: '/adminMgt/MediaInfo/queryProgram.do'
  }
};
