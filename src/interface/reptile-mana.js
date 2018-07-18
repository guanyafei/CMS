export default {
  // 爬虫管理 start
  reptile: {
    queryContentList: '/adminMgt/worm/queryWormList.do', // 爬虫网站列表查询
    queryClassifyList: '/adminMgt/worm/categ/queryList.do', // 爬虫展示分类列表接口
    addClassify: '/adminMgt/worm/categ/save.do', // 爬虫展示分类添加接口
    delClassify: '/adminMgt/worm/categ/del.do', // 爬虫展示分类编辑接口
    editClassify: '/adminMgt/worm/categ/edit.do', // 爬虫展示分类删除接口
    queryWebsiteList: '/adminMgt/worm/website/queryList.do', // 爬虫网站列表查询
    addWebsite: '/adminMgt/worm/website/save.do', // 爬虫网站添加接口
    delWebsite: '/adminMgt/worm/website/del.do', // 爬虫网站删除接口
    editWebsite: '/adminMgt/worm/website/edit.do', // 爬虫网站编辑接口
    queryRelationshipList: '/adminMgt/worm/rel/queryList.do', // 爬虫关系列表接口
    addRelationship: '/adminMgt/worm/rel/save.do', // 爬虫关系添加接口
    delRelationship: '/adminMgt/worm/rel/del.do', // 爬虫关系删除接口
    editRelationship: '/adminMgt/worm/rel/edit.do', // 爬虫关系编辑接口
    queryRecordRelationship: '/adminMgt/worm/rel/queryRecord.do', // 爬虫关系详情接口
    queryAllList: '/adminMgt/worm/rel/queryWebSiteCategFull.do', // 爬虫网站和展示分类列表接口
    queryInfoDetail: '/adminMgt/worm/queryWormNewsDetail.do', // 爬虫资讯详情查询接口
    saveInfoDetail: '/adminMgt/worm/save.do', // 爬虫资讯详情提交接口
    unlockEitInfoCache: '/adminMgt/worm/cancelWormNewsFlag.do', // 解除编辑锁定
    fetchLinkContentList: '/adminMgt/worm/queryRelationNews.do' // 解除编辑锁定
  }
};
