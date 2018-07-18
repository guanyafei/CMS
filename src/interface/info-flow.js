export default {
  //信息流管理
  infoFlow:{
    //信息流管理
    queryList: '/adminMgt/infoFlow/queryInfoFlowList.do', 　　//信息流查询
    add: '/adminMgt/infoFlow/addInfoFlow.do', 　　//信息流新增
    del: '/adminMgt/infoFlow/modifyInfoFlow.do',  //信息流删除
    edit:  '/adminMgt/infoFlow/modifyInfoFlow.do', // 信息流编辑接口
    queryInfoFlowDetail: '/adminMgt/infoFlow/queryInfoFlowDetail.do',   //获取单条信息流详情
    setOnOff: '/adminMgt/infoFlow/updateStatus.do',  //信息流设置上下线



    exchange: '/adminMgt/channel/exchangeChannel.do', // 信息流上移下移
    setTop: '/adminMgt/channel/stickySet.do', // 定制信息流置顶
    saveFreeTrial: '/adminMgt/channel/freetrial/saveFreeTrial.do', // 信息流免审名单添加
    queryFreeTrial: '/adminMgt/channel/freetrial/queryFreeTrial.do', // 信息流免审名单查询
    delFreeTrial: '/adminMgt/channel/freetrial/deleteFreeTrial.do', // 信息流免审名单删除

    //信息流内容管理
    queryContentList: '/adminMgt/channelContent/queryContentList.do', // 内容列表查询
    addContent: '/adminMgt/channelContent/addContent.do', // 插入内容
    batchDelContent: '/adminMgt/channelContent/batchDeleteRel.do',  //批量删除内容
    updateIndex: '/adminMgt/channelContent/updateIndex.do', // 内容上/下移接口
    insertAppointIndex: '/adminMgt/channelContent/insertAppointIndex.do', // 信息流指定序值插入接口
    queryColumnSubject: '/adminMgt/infoFlow/queryColumnSubject.do',
    getGroupInfo: '/adminMgt/getGroupInfo.do',  //查询赛事下的小组
    getGroupMatchInfo: '/adminMgt/getGroupMatchInfo.do', //查询小组下的比赛


    deleteChannelContentRel: '/adminMgt/channelContent/deleteChannelContentRel.do', // 删除内容
    changeTop: '/adminMgt/channelContent/changeTop.do', // 内容（取消）置顶接口
    modifyContent: '/adminMgt/channelContent/modifyContent.do', // 编辑内容

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
};
