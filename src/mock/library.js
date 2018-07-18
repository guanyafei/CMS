export default {
  '/adminMgt/queryNewsList.do': option => {
    let newsList = []
    for (let i = 1; i < 5; i++) {
      newsList.push({
        id: i,
        isPush: i % 2,
        ccrList: [
          {
            channelName: '西甲',
            rejectReason: '错别字',
            status: '1'
          },
          {
            channelName: '英超',
            rejectReason: '错别字',
            status: '2'
          },
          {
            channelName: '推荐',
            rejectReason: '因含有敏感词汇，内容与发布频道不符',
            status: '3'
          },
          {
            channelName: '推荐',
            rejectReason: '错别字',
            status: '3'
          }
        ],
        newsType: i == 4 ? 8 : i,
        collectNum: '256',
        commentNum: '32',
        exposeNum: '390',
        likeNum: '203',
        readNum: '203',
        cover:
          'http://b.zol-img.com.cn/desk/bizhi/image/1/960x600/1348724812863.jpg',
        createTime: '2017-6-8 21:20',
        newsId: '12718',
        title: '西甲直播：梅西9球带领巴塞罗那狂胜皇马10球',
        level: i,
        nickName: 'aaaa',
        status: i,
        nlrList: [
          {
            labelName: 'sports'
          },
          {
            labelName: 'entertainments'
          }
        ]
      })
    }

    let result = {
      retCode: '0',
      data: {
        newsList,
        newsNum: 34
      }
    }

    option.success && option.success(result)
  },

  '/adminMgt/queryNewsChannel.do': option => {
    let soaList = [
      {
        channelId: 1,
        channelName: '意甲',
        channelType: '1'
      },
      {
        channelId: 2,
        channelName: '英超',
        channelType: '2'
      },
      {
        channelId: 3,
        channelName: '世界杯',
        channelType: '3'
      },
      {
        channelId: 4,
        channelName: '欧洲杯',
        channelType: '3'
      },
      {
        channelId: 5,
        channelName: '法甲',
        channelType: '3'
      },
      {
        channelId: 6,
        channelName: '德甲',
        channelType: '3'
      },
      {
        channelId: 7,
        channelName: '葡超',
        channelType: '3'
      },
      {
        channelId: 8,
        channelName: '荷甲',
        channelType: '3'
      },
      {
        channelId: 9,
        channelName: '英冠',
        channelType: '3'
      }
    ]

    let result = {
      retCode: '0',
      data: {
        soaList,
        newsChannelList: [
          {
            channelId: 1
          },
          {
            channelId: 3
          }
        ]
      }
    }

    option.success && option.success(result)
  },

  '/sporttype/list': option => {
    let data = {
      list: [
        {
          name: '足球',
          value: '301',
          key: 'football'
        },
        {
          name: '篮球',
          value: '302',
          key: 'basketball'
        }
      ]
    }

    let result = {
      retCode: '0',
      data
    }

    option.success && option.success.call(option.context, result)
  },

  '/adminMgt/queryNewsDetail.do': option => {
    let newsDetail = {
      //分类标签集合
      categoryLabelList: [
        {
          indexs: 2, //序值	number
          labelId: '101', //标签id	number
          labelName: '战报', //标签名称	string
          labelType: 1 //标签类型	number
        },
        {
          indexs: 1, //序值	number
          labelId: 102, //标签id	number
          labelName: '新闻', //标签名称	string
          labelType: 1 //标签类型	number
        }
      ],
      ccrList: [],
      collectNum: 3,
      columnLabelList: [
        {
          indexs: 1, //序值	number
          labelId: 201, //标签id	number
          labelName: '国际足球' //标签名称	string
        }
      ],
      url: 'http://wwww.baidu.com',
      cover:
        'http://b.zol-img.com.cn/desk/bizhi/image/1/960x600/1348724812863.jpg',
      commentNum: '',
      content: '[]',
      exposeNum: '',
      level: '',
      likeNum: '',
      newsId: '',
      nlrList: [
        {
          labelId: '101', //标签ID	number
          labelName: '战报', //标签名称	string
          labelType: 1 //标签类型	number
        },
        {
          labelId: '201',
          labelName: '国际足球',
          labelType: 2
        },
        {
          labelId: '301',
          labelName: '足球',
          labelType: 3
        },
        {
          labelId: '401',
          labelName: '英超',
          labelType: 4
        },
        {
          labelId: '501',
          labelName: '16-17赛季',
          labelType: 5
        },
        {
          labelId: '601',
          labelName: '38轮',
          labelType: 6
        },
        {
          labelId: '701',
          labelName: '曼联vs利物浦',
          labelType: 7
        },
        {
          labelId: 8,
          labelName: '苏宁',
          labelType: 8
        },
        {
          labelId: 9,
          labelName: '吴曦',
          labelType: 9
        }
      ],
      readNum: '',
      relNewsId: '3',
      relTitle: 'sdhuahuahu',
      status: '',
      title: 'okkk',
      vedioId: '',
      vedioSetId: '',
      newsType: 8
    }
    let result = {
      retCode: '0',
      data: {
        newsDetail
      }
    }

    option.success && option.success(result)
  },
  '/open/getCompetitionInfo.do': option => {
    let data = {
      list: [
        {
          competitionId: '401', //赛事id	number
          competitionLogo: '', //赛事logo	string
          competitionName: '英超' //赛事名称	string
        },
        {
          competitionId: '402', //赛事id	number
          competitionLogo: '', //赛事logo	string
          competitionName: '德甲' //赛事名称	string
        }
      ]
    }

    let result = {
      retCode: '0',
      data
    }

    option.success && option.success.call(option.context, result)
  },
  '/open/getSeasonInfo.do': option => {
    let data = {
      list: [
        {
          seasonId: '501', //赛事id	number
          seasonName: '16-17赛季' //赛事名称	string
        },
        {
          seasonId: '502', //赛事id	number
          seasonName: '17-18赛季' //赛事名称	string
        }
      ]
    }

    let result = {
      retCode: '0',
      data
    }

    option.success && option.success.call(option.context, result)
  },
  '/open/getStageInfo.do': option => {
    let data = {
      list: [
        {
          stageRoundId: '601', //赛事id	number
          stageRoundName: '38轮' //赛事名称	string
        },
        {
          stageRoundId: '602', //赛事id	number
          stageRoundName: '39轮' //赛事名称	string
        }
      ]
    }

    let result = {
      retCode: '0',
      data
    }

    option.success && option.success.call(option.context, result)
  },
  '/open/getMatchInfo.do': option => {
    let data = {
      list: [
        {
          guestTeamId: '利物浦', //客队球队id	number
          guestTeamName: '', //客队球队名称	string
          homeTeamId: '', //主队球队id	number
          homeTeamName: '曼联', //主队球队名称	string
          matchDateTime: '', //比赛时间	string
          matchId: '701', //比赛id	number
          matchNam: 'aaaa'
        },
        {
          guestTeamId: '阿森纳', //客队球队id	number
          guestTeamName: '', //客队球队名称	string
          homeTeamId: '', //主队球队id	number
          homeTeamName: '切尔西', //主队球队名称	string
          matchDateTime: '', //比赛时间	string
          matchId: '702', //比赛id	number
          matchNam: 'aaaa'
        }
      ]
    }

    let result = {
      retCode: '0',
      data
    }

    option.success && option.success.call(option.context, result)
  },
  '/open/getTeamInfo.do': option => {
    let data = {
      list: [
        {
          teamId: '801',
          teamName: '阿森纳'
        },
        {
          teamId: '802',
          teamName: '切尔西'
        }
      ]
    }

    let result = {
      retCode: '0',
      data
    }

    option.success && option.success.call(option.context, result)
  },
  '/open/getPlayerInfo.do': option => {
    let data = {
      list: [
        {
          playerId: '901',
          playerName: '梅西'
        },
        {
          playerId: '902',
          playerName: 'c罗'
        }
      ]
    }

    let result = {
      retCode: '0',
      data
    }

    option.success && option.success.call(option.context, result)
  },
  '/adminMgt/queryRelationNews.do': option => {
    let relList = []
    for (let i = 1; i < 10; i++) {
      relList.push({
        newsId: i,
        title: 'djajdaopjen alkcoieujwoqujodjasli'
      })
    }

    let result = {
      retCode: '0',
      data: {
        relList
      }
    }

    option.success && option.success.call(option.context, result)
  },
  '/adminMgt/getMatchItemList.do': option => {
    let matchList = [
      {
        matchitemShowId: 123123,
        matchitemShowName: '德甲第1轮 柏林赫塔vs弗赖堡',
        matchDes: '德甲联赛第1轮',
        startTime: '2016-08-28 21:15:00',
        endTime: '2016-08-28 23:40:00',
        homeTeam: '柏林赫塔',
        awayTeam: '弗赖堡',
        homeLogo:
          'http://sr1.pplive.com/cms/12/65/3e84ce8672411a9176eaea18f25865bf.png',
        awayLogo:
          'http://sr3.pplive.com/cms/42/75/24d935fa18dc88df67c4a49606087c53.png',
        matchLogo: 'http://img3.pplive.cn/images/2017/08/21/14160541256.png'
      },
      {
        matchitemShowId: 137811,
        matchitemShowName: '直播新接口切换测试',
        matchDes: '西甲',
        startTime: '2017-12-22 14:20:00',
        endTime: '2017-12-22 23:21:00',
        homeTeam: null,
        awayTeam: null,
        homeLogo: null,
        awayLogo: null,
        narrator: '直播新接口切换测试',
        homeTeamId: null,
        awayTeamId: null,
        matchLogo: 'http://img3.pplive.cn/images/2017/08/21/14153394595.png',
      }
    ]
    for (let i = 1; i < 10; i++) {
      matchList.push({
        matchDes: 'lalala' + i,
        matchitemShowId: i,
        matchitemShowName: 'A VS B' + i,
        startTime: '2018-01-01 10:20:28'
      })
    }

    let result = {
      retCode: '0',
      data: {
        matchList
      }
    }

    option.success && option.success.call(option.context, result)
  }
}
