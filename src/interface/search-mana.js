export default {
    // 热门搜索词管理模块 start
    searchWord: {
        queryList: '/adminMgt/search/queryKeywordList.do', //列表查询
        addWord: '/adminMgt/search/addKeyword.do', //新增热词
        editWord: '/adminMgt/search/updateKeyword.do', //编辑热词
        move: '/adminMgt/search/moveKeyword.do', //上下移
        delWord: '/adminMgt/search/batchDeleteKeyword.do' //删除热词
    },
    // 热门搜索词管理模块 end
    //固定关键词管理模块  start
    fixedContent: {
        queryKeywordList: '/adminMgt/fixedKeyword/queryKeywordList.do', //列表查询
        addKeywordList: '/adminMgt/fixedKeyword/addKeywordList.do', //新增固定关键词
        updateKeywordList: '/adminMgt/fixedKeyword/updateKeywordList.do', //编辑固定关键词
        batchDeleteKeywordList: '/adminMgt/fixedKeyword/batchDeleteKeywordList.do' ////删除(批量删除)固定关键词
    }
    //固定关键词管理模块  end
};