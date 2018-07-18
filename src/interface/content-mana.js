export default {
  // 资讯库
  infoLibrary: {
    list: '/adminMgt/queryNewsList.do', // 资讯库列表
    channelList: '/adminMgt/queryNewsChannel.do', // 资讯频道列表
    editExpireTime: '/adminMgt/newsExpireTimeEdite.do', // 修改时效时间
    getSportsType: '/sporttype/list',
    itemDetails: '/adminMgt/queryNewsDetail.do',
    getGameList: '/adminMgt/getCompetitionInfo.do',
    getSeasonList: '/adminMgt/getSeasonInfo.do',
    getRoundList: '/adminMgt/getStageInfo.do',
    getScheduleList: '/adminMgt/getMatchInfo.do',
    getGroupList: '/adminMgt/getGroupInfo.do',
    getTeamList: '/adminMgt/getTeamInfo.do',
    getPlayerList: '/adminMgt/getPlayerInfo.do',
    getContentList: '/adminMgt/queryRelationNews.do',
    statusAndLevel: '/adminMgt/newsBatchStatus.do',
    publishChannel: '/adminMgt/newsPublishChannel.do',
    editLibraryInfo: '/adminMgt/newsEdite.do', // 编辑资源库内容
    delEitLibraryCache: '/adminMgt/cancelNewsFlag.do', // 解除编辑锁定
    fetchAllMatchesInDailyEdit: '/adminMgt/getMatchItemList.do',
    fetchMatchInfoInDailyEdit: '/adminMgt/specialChannel/findChannelRecmdMatch.do', // 根据节目ID查询赛事信息
    fetchInfoByPages: '/adminMgt/findNewsList.do', // 日报富文本查询资讯列表
    fetchMatchLabelsByTitle: '/adminMgt/label/getMatchDataLabel.do', // 按照赛事标题分页查询赛事标签
    fetchCustomLabelsByTitle: '/adminMgt/label/getCustomizeLableList.do', // 按照标题分页查询自定义标签
    addCustomLabel: '/adminMgt/label/saveCustomizeLabel.do', // 新增自定义标签
    queryAuthorInfoByAccount: '/adminMgt/queryAuthorDetailbyPhone.do',
    exportExcel: '/adminMgt/exportExcel.do'  //导出资讯库列表为excel
  },
  // 自媒体资源池
  media: {
    list: '/adminMgt/queryMediaNewsList.do', // 自媒体资源池列表
    channelList: '/adminMgt/queryMediaNewsChannel.do', // 资讯频道列表
    mediaItemOperate: '/adminMgt/updateMediaNewsStatus.do', // 资讯操作
    mediaListBatchOperate: '/adminMgt/mediaNewsBatchStatus.do', // 资讯批量操作
    publishChannel: '/adminMgt/mediaNewsPublishChannel.do'
  },
  //资讯审核
  infoReview: {
    list: '/adminMgt/examineNewsList.do', // 资讯库列表
    approve: '/adminMgt/batchExamine.do', // 资讯审批
    availChannelList: '/adminMgt/permissionChannelList.do', // 获取用户权限的频道列表
    editItem: '/adminMgt/examineNewsEdite.do', // 编辑内容
    delEitReviewCache: '/adminMgt/cancelNewsExamineFlag.do' // 解除编辑锁定
  },
  // 资讯标签
  label: {
    typelist: '/adminMgt/categoryLabel/queryCategoryLabelList.do', // 资讯分类列表
    columnLabellist: '/adminMgt/columnLabel/queryColumnLabelList.do', // 资讯栏目列表
    matchlist: '/adminMgt/recommendMatch/queryMatchLabelList.do', // 资讯赛事列表
    matchTeamlist: '/adminMgt/recommendMatch/queryMatchTeam.do', // 资讯赛事球队列表
    teamlist: '/adminMgt/recommendTeam/queryRecommendTeamList.do', // 资讯球队列表
    playerlist: '/adminMgt/recommendPlayer/queryRecommendPlayerList.do', // 资讯球队列表
    addLabel: '/adminMgt/categoryLabel/addCategoryLabel.do', // 新增分类标签
    labelList: '/adminMgt/categoryLabel/queryLabelsOfCategory.do', // 查询标签列表按资讯类型
    moveLabel: '/adminMgt/categoryLabel/moveCategoryLabel.do', // 移动标签
    delLabel: '/adminMgt/categoryLabel/removeCategoryLabel.do', // 删除标签
    addColumnLabel: '/adminMgt/columnLabel/addColumnLabel.do', // 新增栏目标签
    editColumnLabel: '/adminMgt/columnLabel/editColumnLabel.do', // 编辑栏目标签
    moveTeamInMatch: '/adminMgt/recommendMatch/moveMatchTeam.do',
    syncPlayerList: '/adminMgt/recommendMatch/updateMatchTeam.do',
    addMatch: '/adminMgt/recommendMatch/saveMatchLabel.do',
    moveMatch: '/adminMgt/recommendMatch/moveMatchLabel.do',
    getMatchTypeList: '/adminMgt/recommendMatch/getProjectInfo.do',
    getMatchListByType: '/adminMgt/channelCategoryMatch/findCategoryMatchList.do',
    delMatch: '/adminMgt/recommendMatch/removeMatchLabel.do',
    moveColumn: '/adminMgt/columnLabel/moveColumnLabel.do',
    delColumn: '/adminMgt/columnLabel/removeColumnLabel.do',
    delPlayer: '/adminMgt/recommendPlayer/removeRecommendPlayer.do',
    movePlayer: '/adminMgt/recommendPlayer/moveRecommendPlayer.do',
    addPlayer: '/adminMgt/recommendPlayer/saveRecommendPlayer.do',
    getFilterPlayerList: '/adminMgt/recommendPlayer/addRecommendPlayer.do',
    getFilterTeamList: '/adminMgt/recommendTeam/addRecommendTeam.do',
    addTeam: '/adminMgt/recommendTeam/saveRecommendTeam.do',
    moveTeam: '/adminMgt/recommendTeam/moveRecommendTeam.do',
    delTeam: '/adminMgt/recommendTeam/removeRecommendTeam.do'
  },
  // 推荐池管理
  recommend: {
    list: '/adminMgt/recommendContent/queryContentList.do',
    delContent: '/adminMgt/recommendContent/deleteRecContent.do'
  }
};
