export default {
    // 评论库
    commentLibrary: {
        list: '/adminMgt/comment/query.do', // 查询评论库列表
        handleCommentVisible: '/adminMgt/comment/hide.do',
    batchHideComment: '/adminMgt/comment/batchHide.do',//批量隐藏操作
    batchAuditComment: '/adminMgt/comment/batchAudit.do',//批量审核操作
    editLikeNum: '/adminMgt/comment/updateLikeNum.do',
    auditComment: '/adminMgt/comment/audit.do',//评论审核操作
    forbiddenComment: '/adminMgt/comment/forbiddenUser.do',//评论禁言(隐藏一个月)操作
    },
    // 评论灌水
    commentImport: {
        list: '/adminMgt/commentImport/queryTask.do', // 查询评论灌水列表
        rerun: '/adminMgt/commentImport/createTaskAgain.do', // 任务失败重新发布任务
        queryImportDetail: '/adminMgt/commentImport/taskDetail.do', // 评论灌水任务详情页
        queryCrawlerList: '/adminMgt/wormComment/queryWormComment.do', // 查询爬虫库评论列表
        uploadExcel: '/adminMgt/commentImport/importCommEx.do', // 评论灌水导入表格文件
        createTask: '/adminMgt/commentImport/createTask.do' // 新建灌水任务
    },
    // g-comment 评论引导
    g_comment: {
        delUser: '/adminMgt/commentGuide/delUser.do', //删除前台用户
        publish: '/adminMgt/commentGuide/publish.do', //添加或回复评论
        queryUser: '/adminMgt/commentGuide/queryUser.do', //查询前台用户
        queryCommentPage: '/adminMgt/commentGuide/queryCommentPage.do', //查询评论列表(热门和非热门评论)
        queryContentPage: '/adminMgt/commentGuide/queryContentPage.do', //查询内容列表
        queryReplyCommentPage: '/adminMgt/commentGuide/queryReplyCommentPage.do', //查询评论回复列表
        queryUsers: '/adminMgt/commentGuide/queryUsers.do', //查询前台用户列表
        addUser: '/adminMgt/commentGuide//addUser.do', //添加前台用户
        querySingleContent: '/adminMgt/commentGuide/querySingleContent.do',
        updateLikeNum: '/adminMgt/comment/updateLikeNum.do', //修改评论点赞数(评论列表)
        updateLikeNumNew: '/adminMgt/content/updateLikeNum.do', //修改内容点赞数
        batchHide: '/adminMgt/comment/batchHide.do', //批量隐藏评论接口
        queryChannel: '/adminMgt/commentGuide/queryChannel.do',
        hotComment: '/adminMgt/commentGuide/hotComment.do' //加入，取消热门以及置顶,取消置顶
    },
    // 爬虫评论管理
    reptileCommentManagement: {
        commentPublish: '/adminMgt/wormComment/commentPublish.do', // 单条评论发布
        queryProgramInfo: '/adminMgt/quyeryMatchitemByMatchShowId.do', // 查询节目ID信息
        queryUsers: '/adminMgt/commentGuide/queryUsers.do', // 查询前台用户列表
        queryAllSource: '/adminMgt/wormComment/queryAllSource.do', // 查询所有来源
        queryWormComment: '/adminMgt/wormComment/queryWormComment.do', // 查询爬虫评论列表
        exportExcel: '/snsis-admin-web/adminMgt/wormComment/exportExcel.do', // 导出excel
        queryCommentById: '/adminMgt/commentGuide/queryCommentById.do' //查询单个评论详情
    }
};