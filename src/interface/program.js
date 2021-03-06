export default {
  //节目管理
  programMana:{
    queryProgramList:"/adminMgt/program/queryProgramList.do",//查询节目管理列表
    addProgram:"/adminMgt/program/addProgram.do",//新建节目
    editProgram:"/adminMgt/program/editProgram.do",//修改节目
    deleteProgram:"/adminMgt/program/deleteProgram.do",//删除节目
    updateProgramState:"/adminMgt/program/updateProgramState.do",//节目上/下架
    initProgramLable:"/adminMgt/program/initProgramLable.do",//初始化节目标签
    competionId:"/adminMgt/getCompetitionInfo.do"//查询关联赛事
  },
  //节目内容列表
  programList:{
    queryProgramContentList:"/adminMgt/program/queryProgramContentList.do",//查询节目内容列表
    addProgramContent:"/adminMgt/program/addProgramContent.do",//添加节目内容
    editProgramContent:"/adminMgt/program/editProgramContent.do",//修改节目内容
    deleteProgramContent:"/adminMgt/program/deleteProgramContent.do",//删除节目内容
    moveProgramContent:"/adminMgt/program/moveProgramContent.do",//节目内容上/下移
    getVideoList:"/adminMgt/program/getVideoList.do"//获取视频列表
  }
}