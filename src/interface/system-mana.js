export default {
  // 阈值管理start
  sysDictmgt: {
    querySysDict: '/adminMgt/sysDict/querySysDict.do', // 阈值管理查询
    addSysDict: '/adminMgt/sysDict/addSysDict.do', // 新增阈值查询
    delSysDict: '/adminMgt/sysDict/removeSysDict.do', // 删除阈值
    editSysDict: '/adminMgt/sysDict/editSysDict.do' // 设置阈值
  },
  authoritymgt: {
    // queryChannelAuthority: '/adminMgt/soaUserChannelRel/queryChannelList.do', // 频道权限查询
    // queryTopicAuthority: '/adminMgt/soaUserChannelRel/querySpecialChannelList.do', // 专题权限查询
    // querySoaUser: '/adminMgt/soaUserChannelRel/queryUserOfChannel.do', // 根据频道id查询会员账户
    querySubjectList: '/adminMgt/soaUserChannelRel/querySubjectList.do', // 查询主题分类下主题列表
    queryUserOfSubject: '/adminMgt/soaUserChannelRel/queryUserOfSubject.do', // 查询主题权限下soa会员列表
    saveSubjectPermissionStatus: '/adminMgt/soaUserChannelRel/saveSubjectPermissionStatus.do', // 主题保存权限
    addSoaUser: '/adminMgt/soaUserChannelRel/addSoaUserChannelRel.do', // 新增频道下soa用户权限
    deleteSoaUser: '/adminMgt/soaUserChannelRel/removeSoaUserChannelRel.do', // 根据频道id删除会员账户
  }
};
