export default {
  // 赛事TAB管理 start
  matchTab: {
    matchTabInfoListGet: '/matchTab/matchTabInfoListGet.do', // 获取赛事tab列表
    getSeasonListByMatchId: '/adminMgt/getSeasonInfo.do', //通过赛事id获取赛季列表数据
    getUnlinkedTabMatchId: '/matchTab/getUnlinkedTabMatchId.do', // 获取未关联赛事id列表
    matchTabCreate: '/matchTab/matchTabCreate.do', // 增加赛事tab
    matchTabEditInfo: '/matchTab/matchTabEditInfo.do', // 赛事tab上下架，角标，赛事logo，赛事描述编辑
    matchTabUpdateNameAndCompetitionId: '/matchTab/matchTabUpdateNameAndCompetitionId.do', // 编辑赛事tab名字和id
    matchLeagueDataNumGet: '/matchTab/matchLeagueDataNumGet.do', // 获取联赛积分榜的排名数量
    matchTabUpdateIndex: '/matchTab/matchTabUpdateIndex.do', // 上移下移赛事tab
    matchTabSetIndex: '/matchTab/matchTabSetIndex.do', // 设置赛事tab的序值
    matchTabDelete: '/matchTab/matchTabDelete.do', // 删除赛事tab
    queryProjectList: '/matchTab/getProjectInfo.do', // 查询关联项目
    getUnlinkedTabSeasonId: '/matchTab/getUnlinkedTabSeasonId.do', //获取未关联赛季id列表
    matchTabEditColor: '/matchTab/matchTabEditColorBatch.do' // 编辑赛事tab颜色
  }
};
