export default {
  atmosphere: {
    queryList: '/adminMgt/atmosphere/queryList.do', //赛事氛围列表查询
    quyeryMatchitem: '/adminMgt/quyeryMatchitemByMatchShowId.do', //根据节目ID查询节目详情接口
    publish: '/adminMgt/atmosphere/publishV2.do', //赛事氛围编辑/保存接口
    queryDetail: '/adminMgt/atmosphere/queryDetailV2.do', //赛事氛围详情接口
    uploadFileZip: '/adminMgt/uploadFileZip.do', //赛事氛围表情包ZIP上传接口
    revoke: '/adminMgt/atmosphere/revoke.do', //撤回接口
    faceBRevoke:'/adminMgt/atmosphereB/revoke.do',//B面撤回接口
    faceBPublish:'/adminMgt/atmosphereB/publish.do',//B面氛围编辑/保存接口
    faceBQueryList:'/adminMgt/atmosphereB/queryList.do'//A面B面列表查询
  }
};
