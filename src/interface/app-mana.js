export default {
  // 资讯频道管理 start
  channel: {
    insertAppointIndex: '/adminMgt/channelContent/insertAppointIndex.do', // 频道指定序值插入接口
    queryList: '/adminMgt/channel/querylist.do', // 查询频道列表,
    add: '/adminMgt/channel/save.do', // 频道添加接口
    del: '/adminMgt/channel/delete.do', // 频道删除接口
    edit: '/adminMgt/channel/edit.do', // 频道编辑接口
    setOnOff: '/adminMgt/channel/shelveOnOffSet.do', // 频道设置上下架
    exchange: '/adminMgt/channel/exchangeChannel.do', // 频道上移下移
    setTop: '/adminMgt/channel/stickySet.do', // 定制频道置顶
    markSet: '/adminMgt/channel/markSet.do', // 频道设置角标
    saveFreeTrial: '/adminMgt/channel/freetrial/saveFreeTrial.do', // 频道免审名单添加
    queryFreeTrial: '/adminMgt/channel/freetrial/queryFreeTrial.do', // 频道免审名单查询
    delFreeTrial: '/adminMgt/channel/freetrial/deleteFreeTrial.do', // 频道免审名单删除
    queryContentList: '/adminMgt/channelContent/queryContentList.do', // 内容列表查询
    deleteChannelContentRel: '/adminMgt/channelContent/deleteChannelContentRel.do', // 删除频道内容
    updateIndex: '/adminMgt/channelContent/updateIndex.do', // 内容上/下移接口
    changeTop: '/adminMgt/channelContent/changeTop.do', // 内容（取消）置顶接口
    modifyContent: '/adminMgt/channelContent/modifyContent.do', // 编辑内容
    addContent: '/adminMgt/channelContent/addContent.do', // 插入内容
    queryVideoDetail: '/adminMgt/queryVideoDetail.do', // 查询mip视频详情
    queryNewsDetail: '/adminMgt/queryNewsDetail.do', // 查询资讯详情
    getTopicInfo: '/adminMgt/channelContent/getTopicInfo.do', // 获取帖子基本信息
    querySpecialById: '/adminMgt/special/querySpecialById.do', // 通过id查询专题名
    queryColumnList: '/adminMgt/channel/querycolumnLabel.do', // 栏目标签查询接口
    queryChannelInfo: '/adminMgt/channel/queryRecord.do', // 查询频道纪录接口
    getChannelDataFloorList: '/adminMgt/dataFloor/getChannelDataFloorList.do', // 内容列表的资讯详情（插入时调用）
    getNewsInfo: '/adminMgt/channelContent/getNewsInfo.do', // 内容列表的资讯详情（插入时调用）
    addChannelFloorData: '/adminMgt/dataFloor/addDataFloor.do', // 添加数据楼层
    deleteDataFloorItem: '/adminMgt/dataFloor/deleteDataFloor.do',
    changeFloorItemOrder: '/adminMgt/dataFloor/changeOrder.do'
  },
  // 资讯频道管理 end

  // 专题管理 start
  topic: {
    /*内容列表start--*/
    queryContentList: '/adminMgt/specialChannelContent/queryContentList.do', // 内容列表查询
    deleteChannelContentRel: '/adminMgt/specialChannelContent/deleteChannelContentRel.do', // 删除频道内容
    updateIndex: '/adminMgt/specialChannelContent/updateIndex.do', // 内容上/下移接口
    changeTop: '/adminMgt/specialChannelContent/changeTop.do', // 内容（取消）置顶接口
    modifyContent: '/adminMgt/specialChannelContent/modifyContent.do', // 编辑内容
    addContent: '/adminMgt/specialChannelContent/addContent.do', // 插入内容
    insertToColumn: '/adminMgt/specialChannelContent/insertToColumn.do', //添加到栏目
    removeToColumn: '/adminMgt/specialChannelContent/removeToColumn.do', //撤销栏目
    getTopicInfo: '/adminMgt/channelContent/getTopicInfo.do', // 获取帖子基本信息
    queryVideoDetail: '/adminMgt/queryVideoDetail.do', // 查询mip视频详情
    getNewsInfo: '/adminMgt/channelContent/getNewsInfo.do', // 内容列表的资讯详情（插入时调用）
    /*--内容列表end*/
    querySpecial: '/adminMgt/special/querySpecial.do', // 专题查询
    querySpecialById: '/adminMgt/special/querySpecialById.do', // 通过id查询专题名
    upOrdownShelvesSpecial: '/adminMgt/special/upOrdownShelvesSpecial.do', // 专题上下架
    deleteSpecial: '/adminMgt/special/deleteSpecial.do', // 专题删除
    queryEditSpecialById: '/adminMgt/special/queryEditSpecialById.do', // 编辑前查询专题记录接口
    moveChannelRecmdMatch: '/adminMgt/specialChannel/moveChannelRecmdMatch.do', // 专题页上移下移推荐比赛序值
    queryChannelFixedFloorList: '/adminMgt/queryChannelFixedFloorList.do', // 查询固定楼层列表
    saveSpecial: '/adminMgt/special/saveSpecial.do', // 专题更新
    queryRecmdMatchitem: '/adminMgt/specialChannel/queryRecmdMatchitem.do', // 主题页推荐比赛列表
    addChannelRecmdMatch: '/adminMgt/specialChannel/addChannelRecmdMatch.do', // 新增主题页推荐比赛
    saveChannelRecmdMatch: '/adminMgt/specialChannel/saveChannelRecmdMatch.do', // 保存主题页推荐比赛
    removeChannelRecmdMatch: '/adminMgt/specialChannel/removeChannelRecmdMatch.do', // 删除主题页推荐比赛
    updateChannelRecmdMatch: '/adminMgt/specialChannel/updateChannelRecmdMatch.do', // 更新主题页推荐比赛
    insertAppointIndex: '/adminMgt/specialChannelContent/insertAppointIndex.do', // 专题指定序值插入接口
    querySpecialChannelColumn: '/adminMgt/specialChannel/querySpecialChannelColumn.do', //栏目查询
    addSpecialChannelColumn: '/adminMgt/specialChannel/addSpecialChannelColumn.do', //栏目新增
    editSpecialChannelColumn: '/adminMgt/specialChannel/editSpecialChannelColumn.do', //栏目编辑
    deleteSpecialChannelColumn: '/adminMgt/specialChannel/deleteSpecialChannelColumn.do', //栏目删除
    moveSpecialChannelColumn: '/adminMgt/specialChannel/moveSpecialChannelColumn.do', //栏目上下移
    queryNavigationList: '/adminMgt/specialChannelNavigetion/queryNavigationList.do', //底部导航查询
    addNavigation: '/adminMgt/specialChannelNavigetion/addNavigation.do', //底部导航新增
    editNavigation: '/adminMgt/specialChannelNavigetion/editNavigation.do', //底部导航编辑
    removeNavigation: '/adminMgt/specialChannelNavigetion/removeNavigation.do', //底部导航删除
    moveNavigation: '/adminMgt/specialChannelNavigetion/moveNavigation.do' //底部导航上下移
  },
  appAdvment: {
    queryCommonAdv: '/adminMgt/commonAdv/queryCommonAdv.do', // 查询通用广告列表
    removeCommonAdv: '/adminMgt/commonAdv/removeCommonAdv.do', // 删除通用广告位
    editCommonAdv: '/adminMgt/commonAdv/editCommonAdv.do', // 修改通用广告属性
    addCommonAdv: '/adminMgt/commonAdv/addCommonAdv.do' // 新增通用广告属性
  },
  // 频道展示管理 start
  channelDisplay: {
    queryRecomMatches: '/adminMgt/queryChannelRecomMatches.do', // 推荐比赛查询
    pushTopAdv: '/adminMgt/pushIsTopAdv.do', // 是否推荐比赛到连版、是否置顶比赛
    queryColList: '/adminMgt/videoChannel/queryCollectionList.do', // 视频频道查询合集列表(视频频道)
    delVideoCol: '/adminMgt/videoChannel/delCollection.do', // 视频合集删除(视频频道)
    moveVideoCol: '/adminMgt/videoChannel/changeIndex.do', // 视频频道合集上移下移(视频频道)
    saveVideoCol: '/adminMgt/videoChannel/saveCollection.do', // 视频频道保存合集信息(视频频道)
    matchVideoList: '/adminMgt/channelCategoryMatch/queryCategoryMatchList.do', // 赛事视频楼层(视频频道)
    addMVideoList: '/adminMgt/channelCategoryMatch/addCategoryMatch.do', // 新增赛事视频楼层分类(视频频道)
    delMatchVideo: '/adminMgt/channelCategoryMatch/removeChannelCategoryMatch.do', // 赛事视频楼层删除(视频频道)
    moveMatchVideo: '/adminMgt/channelCategoryMatch/moveChannelCategoryMatch.do', // 移动赛事视频楼层顺序(视频频道)
    getMatchList: '/adminMgt/channelCategoryMatch/findCategoryMatchList.do', // 返回数据中台所有推荐赛事列表
    getProjectInfo: '/adminMgt/recommendMatch/getProjectInfo.do', // 获取数据中台所有推荐赛事类型
    syncMatchData: '/adminMgt/syncChannelRecomMatches.do', // 推荐比赛同步接口
    updateMatch: '/adminMgt/updateMatchDes.do', // 赛事信息修改
    delRecmdMatch: '/adminMgt/delChannelRecmdMatchitem.do', // 删除推荐比赛
    addMatchItem: '/adminMgt/addChannelRecmdMatchitem.do', // 添加频道推荐比赛[按节目]
    specialChannelAddMatchItem: '/adminMgt/specialChannel/addRecmdMatch.do', // 添加专题推荐比赛[按节目]
    addMatchItemById: '/adminMgt/addChannelRecmdMatchitemById.do', // 添加频道推荐比赛[按比赛]
    specialChannelAddMatchItemById: '/adminMgt/specialChannel/addChannelRecmdMatchitemById.do', // 添加专题推荐比赛[按比赛]
    queryMatchItem: '/adminMgt/quyeryMatchitemByMatchShowId.do', // 根据节目ID查询节目详情
    pageQueryVideoSet: '/adminMgt/pageQueryVideoSet.do', // 分页查询合集下的分集列表
    saveAttachment: '/adminMgt/videoChannel/saveAttachment.do', // 视频频道保存分集信息
    queryTopRecomMatches: '/adminMgt/topManager/queryTopChannelRecomMatches.do', // 置顶管理查询接口
    updateIndex: '/adminMgt/topManager/updateIndex.do' // 置顶管理上移下移
  },

  // 频道连版广告管理 start
  continueAdv: {
    queryList: '/adminMgt/continuesAdvQuery.do', // 连版广告列表查询,
    advDel: '/adminMgt/continuesAdvDelete.do', // 连版广告删除
    advAdd: '/adminMgt/continuesAdvAdd.do', // 连版广告增加
    advUpdate: '/adminMgt/continuesAdvUpdate.do', // 连版广告更改
    advMove: '/adminMgt/updateIndex.do' // 连版广告上移下移
  },
  // 固定坑位管理 start
  floorMan: {
    queryList: '/adminMgt/queryChannelFixedFloorList.do', // 查询固定楼层列表
    enableFloor: '/adminMgt/fixedFloorEnableFlagEdit.do', // 启用停用固定楼层标记
    editFloor: '/adminMgt/fixedFloorAdAuthorEdit.do', // 编辑坑位
    deleteChannelFixedFloor: '/adminMgt/deleteChannelFixedFloor.do' // 删除坑位
  },
  // PC二级导航维护
  subNav: {
    queryList: '/adminMgt/pcNavigation/queryList.do', // pc导航列表查询
    delete: '/adminMgt/pcNavigation/del.do', // pc导航删除
    save: '/adminMgt/pcNavigation/update.do', // pc导航 编辑/新增
    move: '/adminMgt/pcNavigation/pcNavigationMove.do', // pc导航上下移动
  },
  // 频道背景管理
  channelBg: {
    queryList: '/adminMgt/queryPcBcakgroud.do', // PC频道背景查询
    delete: '/adminMgt/deletePcBcakgroud.do', // PC频道背景删除
    save: '/adminMgt/savePcBcakgroud.do', // PC频道背景保存/编辑
  },
};
