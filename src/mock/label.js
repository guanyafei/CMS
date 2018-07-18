export default {
  '/open/comment/query.do': (option) => {
    let data = {
      'totalCount': 23,
      'commList': [{
        commContent: 'adada', //评论内容	string	
        commId: '12289', //评论id	string	
        commStatus: '1', //评论状态 1:正常 2:隐藏	string	
        commTitle: 'adaa', //资讯标题	string	
        commTitleId: 's182010', //资讯id	string	
        createTime: '2017-08-09 20:27:28', //评论时间 yyyy-MM-dd HH:mm:ss	string	
        forbiddenDays: '12', //剩余禁言天数	number	
        forbiddenStatus: '2', //禁言状态 0 未禁言 1 禁言中 2 永久禁言	string	
        likeNum: '23', //举报数	string	
        parentCommId: '1213', //父评论id	string	
        replyNum: '2', //回复数	string	
        reportNum: '21', //举报数	string	
        userId: '121', //用户id	string	
        userNickName: 'rice' //评论用户姓名	string
      }]
    };

    let result = {
      retCode: '0',
      data
    };

    option.success && option.success(result);
  },

  '/adminMgt/categoryLabel/queryCategoryLabelList.do': (option) => {
    let list = [{
      id: '12939',
      labelType: '图文',
      categoryLabels: [{
        labelName: '回放'
      }, {
        labelName: '集锦'
      }]
    }];

    let result = {
      retCode: '0',
      data: {
        list
      }
    };

    option.success && option.success(result);
  },

  '/adminMgt/categoryLabel/queryLabelsOfCategory.do': (option) => {
    let categoryLabelList = [{
        indexs:'12',	//序值	number	
        labelId:'10',	//	标签id	number	
        labelName:'ada',	//	标签名称	string	
        labelType:'2'
    }];

    let result = {
      retCode: '0',
      data: {
        categoryLabelList
      }
    };

    option.success && option.success(result);
  },
  
  '/adminMgt/columnLabel/queryColumnLabelList.do': (option) => {
    let list = [{
      indexs: '1',
      labelId: '12939',
      labelName: '图文',
    }];

    let result = {
      retCode: '0',
      data: {
        list
      }
    };

    option.success && option.success(result);
  },

  '/adminMgt/recommendMatch/queryMatchLabelList.do': (option) => {
    let list = [{
      indexs: option.data.pageIndex,
      matchId: '12939',
      matchName: '图文',
      matchType: 'aaa'
    }];

    let result = {
      retCode: '0',
      data: {
        list,
        matchListCount: 23
      }
    };

    option.success && option.success(result);
  },

  '/adminMgt/recommendMatch/queryMatchTeam.do': (option) => {
    let matchTeamList = [{
      indexs: '1',
      id: '1',
      teamId: '12939',
      teamName: '尤文图斯'
    }, {
      indexs: '2',
      id: '2',
      teamId: '3802890',
      teamName: '皇家马德里'
    }, {
      indexs: '3',
      id: '3',
      teamId: '28988',
      teamName: '曼切斯特联队'
    }, ];

    let result = {
      retCode: '0',
      data: {
        matchTeamList
      }
    };

    option.success && option.success(result);
  },

  '/adminMgt/recommendTeam/addRecommendTeam.do': (option) => {
    let list = [{
      indexs: '1',
      teamLogo: '1',
      teamId: '12939',
      teamName: '尤文图斯'
    }, {
      indexs: '2',
      teamLogo: '2',
      teamId: '3802890',
      teamName: '皇家马德里'
    }, {
      indexs: '3',
      teamLogo: '3',
      teamId: '28988',
      teamName: '曼切斯特联队'
    }, ];

    let result = {
      retCode: '0',
      data: {
        list
      }
    };

    option.success && option.success(result);
  },
  
  '/adminMgt/recommendTeam/queryRecommendTeamList.do': (option) => {
    let teamList = [{
      indexs: '1',
      teamId: '12939',
      teamLogo: 'http://p1.qhmsg.com/dmsmty/337_337_/t01b675f7d662992b8c.png',
      teamName: '尤文图斯'
    }, {
      indexs: '2',
      teamId: '3802890',
      teamLogo: 'http://p1.qhmsg.com/dmsmty/337_337_/t01b675f7d662992b8c.png',
      teamName: '皇家马德里'
    }, {
      indexs: '3',
      teamId: '28988',
      teamLogo: 'http://p1.qhmsg.com/dmsmty/337_337_/t01b675f7d662992b8c.png',
      teamName: '曼切斯特联队'
    }, ];

    let result = {
      retCode: '0',
      data: {
        teamList,
        teamListCount: 34
      }
    };

    option.success && option.success(result);
  },

  '/adminMgt/recommendPlayer/queryRecommendPlayerList.do': (option) => {
    let playerList = [{
      indexs: '1',
      playerId: '12939',
      playerLogo: 'http://p1.qhmsg.com/dmsmty/337_337_/t01b675f7d662992b8c.png',
      playerName: '吸螺'
    }, {
      indexs: '2',
      playerId: '3802890',
      playerLogo: 'http://p1.qhmsg.com/dmsmty/337_337_/t01b675f7d662992b8c.png',
      playerName: '没吸'
    }, {
      indexs: '3',
      playerId: '28988',
      playerLogo: 'http://p1.qhmsg.com/dmsmty/337_337_/t01b675f7d662992b8c.png',
      playerName: '他娘'
    }, ];

    let result = {
      retCode: '0',
      data: {
        playerList,
        playerListCount: 34
      }
    };

    option.success && option.success(result);
  }
}
