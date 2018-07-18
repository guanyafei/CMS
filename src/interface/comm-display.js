export default {
    //通用展示位管理
    display: {
        displayList: '/adminMgt/queryDisplayLocation.do', //查询接口
        displayDel: '/adminMgt/deleteDisplayLocation.do', //删除接口
        displayAdd: '/adminMgt/addDisplayLocation.do', //添加接口
        displayEdit: '/adminMgt/editDisplayLocation.do' //编辑接口
    },
    //通用展示位内容管理
    displayContent: {
        displayContentList: '/adminMgt/queryDisplayLocationContent.do', //内容查询接口
        displayContentDel: '/adminMgt/deleteDisplayLocationContent.do', //内容删除接口
        displayContentAdd: '/adminMgt/addDisplayLocationContent.do', //内容添加接口
        displayContentEdit: '/adminMgt/editDisplayLocationContent.do', //内容编辑接口
        displayContentExchange: '/adminMgt/displayLocationContentUpdateIndex.do', //内容展示位上下移动接口
        displayTargetQuery: '/adminMgt/pcTagSet/tagSearch.do', //目标模糊查询
        displayTargetQueryById: '/adminMgt/pcTagSet/tagSearchById.do' //目标模糊查询by Id
    }
};