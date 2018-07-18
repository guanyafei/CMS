export default {
	// 主题
	theme: {
		getThemeList: '/adminMgt/subject/querylist.do', // 查询主题列表
		shelve: '/adminMgt/subject/shelveOnOffSet.do', // 主题设置上下架
		add: '/adminMgt/subject/save.do', // 主题新增
		edit: '/adminMgt/subject/edit.do', // 主题编辑
		delete: '/adminMgt/subject/delete.do', // 主题删除
		getDetail: '/adminMgt/subject/queryRecord.do', // 主题查询
		videoList: '/adminMgt/categoryLabel/queryVideoCategoryLabelList.do' // 分类标签，视频
	},
	// 主题展示位管理
	themeShow:{
		getPcTagList:'/adminMgt/pcTagSet/queryList.do', // 查询pc标签列表
		addgetPcTag:'/adminMgt/pcTagSet/update.do',//pc标签新增/查询
		getPcTagSearch:'/adminMgt/pcTagSet/tagSearch.do', //pc标签集 添加 -内容类型 查询
		getPcTagDetail:'/adminMgt/pcTagSet/queryById.do',//pc标签详情查询
		movePcRec:'/adminMgt/pcTagSet/pcTagSetMove.do',//pc标签上下移动
		delPcTag:'/adminMgt/pcTagSet/del.do',//pc标签删除
		getFunList:'/adminMgt/dataFloor/getChannelDataFloorList.do',// 查询功能位管理列表
		addFunManage:'/adminMgt/dataFloor/addDataFloor.do',//添加管理位
		editFunManage:'/adminMgt/dataFloor/editDataFloor.do',//编辑展示位
		delFunManage:'/adminMgt/dataFloor/deleteDataFloor.do',//删除展示位
		moveFunManage:'/adminMgt/dataFloor/changeOrder.do',//功能位上下移动
		funcPosition:'/adminMgt/dataFloor/updateFuncPositionFlag.do',//功能位 自定义显示
	}
}