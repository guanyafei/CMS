export default {
  examine: {
    authorAuditList: '/adminMgt/authorAudit/authorAuditList.do',
    authorAuditPass: '/adminMgt/authorAudit/authorAuditPass.do',
    authorAuditBack: '/adminMgt/authorAudit/authorAuditBack.do',
    authorAuditDetail: '/adminMgt/authorAudit/authorAuditDetail.do'
  },
  // 作者库
  authorLibrary: {
    list: '/adminMgt/authorListQuery.do',
    addAuthor: '/adminMgt/addAuthor.do',
    handleAccount: '/adminMgt/updateAuthor.do',
    accountInfo: '/adminMgt/getAuthorDetailInfoFromYG.do',
    queryAuthorInfo: '/adminMgt/queryAuthorDetail.do',
    authorFansListQuery: '/adminMgt/authorActualFansListQuery.do',
    authorFansIncreaseFalsity: '/adminMgt/authorFansIncreaseFalsity.do'
  },
  // 推荐作者
  authorRecommend: {
    list: '/adminMgt/authorListByClassifiedQuery.do', // 根据分类查询作者列表
    typeList: '/adminMgt/authorClassifiedListQuery.do', //查询作者分类列表
    recommendHot: '/adminMgt/updateHotAuthor.do', // 添加/取消热门推荐
    exchangeAuthor: '/adminMgt/movingAuther.do', // 上/下移极品作者
    exchangeClassify: '/adminMgt/movingAuthorClassified.do', // 上/下移作者分类
    insertIndex: '/adminMgt/insertAutherIndex.do', // 作者插入到对应序值
    doOnOff: '/adminMgt/updateAuthorClassifiedStatus.do', // 启用/停用作者分类
    editClassify: '/adminMgt/updateAuthorClassified.do' // 编辑作者分类
  }
};
