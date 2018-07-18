export default {
  "/adminMgt/channel/querylist.do": (option) => { //查询频道列表
    let data = {
      "channelNum": 30,
      "channelList": [{
        'channelId':10001,
        'channelLogo':'https://www.baidu.com/img/bd_logo1.png',
        'channelName':'体育频道',
        'channelType':2,
        "freeFlag":0,
        "labelNames":'体育、频道',
        "mark":'https://www.baidu.com/img/bd_logo1.png',
        "onSaleType":1,
        "resource":2,
        "shelvesNum":'上架内容',
        "status":1,
        "waitShelvesNum":""
      }]
    };

    let result = {
      retCode: 0,
      data
    };
    option.success && option.success(result);
    
  },
  
  "/adminMgt/continuesAdvQuery.do": (option) => { //连版广告列表
    let data = {
      "listNum": 30,
      "list": [{
        'advId':1000001059,
        'advImgUrl':'https://www.baidu.com/img/bd_logo1.png',
        'advJumpType':2,
        "advJumpUrl":'http://www.baidu.com',
        "advStatus":1,
        "advTitle":'第三期苏宁少儿足球夏令营开始招生了！',
        "endTime":'2017-6-20',
        "indexs":1,
        "showLabel":'活动',
        "startTime":"2017-6-01",
        "vedioSetId":"4213234341"
      }]
    };

    let result = {
      retCode: 0,
      data
    };
    option.success && option.success(result);
    
  },
  
  "/adminMgt/queryChannelRecomMatches.do": (option) => { //推荐比赛列表
    let data = {
      "matchNum": 30,
      "matchList": [{
        'advImgUrl':'https://www.baidu.com/img/bd_logo1.png',
        'channelId':10001,
        'id':1000001059,
        'isPushAdv':0,
        'isTop':0,
        "matchDes":'苏宁足球德比',
        "matchitemId":302,
        "matchitemShowId":10032,
        "matchitemShowName":'苏宁足球节目',
        "startTime":'2017-01-02',
      }]
    };

    let result = {
      retCode: 0,
      data
    };
    option.success && option.success(result);
    
  },
  
  "/adminMgt/videoChannel/queryCollectionList.do": (option) => { //视频频道查询合集列表
    let data = {
      "videoList": [{
          vedioSetId: 11354,
          vedioTitle: '江苏苏宁易购',
          vedioDisNum: 12,
          vedioDisType: 1,
          updateTime: '2017-03-12',
          createTime: '2017-03-01',
          channelId: '1111',
          id:'111'
      },{
          vedioSetId: 11354,
          vedioTitle: '江苏苏宁易购',
          vedioDisNum: 12,
          vedioDisType: 2,
          updateTime: '2017-03-12',
          createTime: '2017-03-01',
          channelId: '1111',
          id:'111'
      },
      {
          vedioSetId: 11354,
          vedioTitle: '江苏苏宁易购',
          vedioDisNum: 12,
          vedioDisType: 1,
          updateTime: '2017-03-12',
          createTime: '2017-03-01',
          channelId: '1111',
          id:'111'
      }]
    };

    let result = {
      retCode: 0,
      data
    };
    option.success && option.success(result);
    
  },

  "/adminMgt/channelCategoryMatch/queryCategoryMatchList.do": (option) => { //赛事视频楼层列表
    let data = {
      "categoryMatchList": [{
          channelId: 1111,
          createTime: '2017-06-12',
          id: 1010,
          matchId: 123,
          matchLogo: 'https://www.baidu.com/img/bd_logo1.png',
          matchName: '江苏苏宁易购',
          updateTime: '2017-06-20',
          mipMatchId: '1234'
      },
      {
          channelId: 1111,
          createTime: '2017-06-12',
          id: 111,
          matchId: 123,
          matchLogo: 'https://www.baidu.com/img/bd_logo1.png',
          matchName: '江苏苏宁易购',
          updateTime: '2017-06-20',
          mipMatchId: '1234'
      },
      {
          channelId: 1111,
          createTime: '2017-06-12',
          id: 111,
          matchId: 123,
          matchLogo: 'https://www.baidu.com/img/bd_logo1.png',
          matchName: '江苏苏宁易购',
          updateTime: '2017-06-20',
          mipMatchId: '1234'
      }]
    };

    let result = {
      retCode: 0,
      data
    };
    option.success && option.success(result);
  },
  
  "/adminMgt/recommendMatch/getProjectInfo.do": (option) => { //数据中台推荐赛事类型列表
    let data = {
        "list": [{
          sportItemId: '001',
          sportItemName: '足球'
        },
        {
          sportItemId: '002',
          sportItemName: '排球'
        }      
      ]
    };

    let result = {
      retCode: 0,
      data
    };
    option.success && option.success(result);
  },
  
  "/adminMgt/channelCategoryMatch/findCategoryMatchList.do": (option) => { //数据中台推荐赛事列表
    let data = {
        "list": [{
          competitionId: '001',
          competitionName: '英超',
          competitionLogo: 'https://www.baidu.com/img/bd_logo1.png'
        },
        {
          competitionId: '002',
          competitionName: '西甲',
          competitionLogo: 'https://www.baidu.com/img/bd_logo1.png'
        }   
      ]
    };

    let result = {
      retCode: 0,
      data
    };
    option.success && option.success(result);
  },
  
  "/adminMgt/queryChannelFixedFloorList.do": (option) => { //固定楼层列表
    let data = {
        "list": [{
          advImgUrl: 'https://www.baidu.com/img/bd_logo1.png',
          advJumpType: 3,
          advJumpUrl: 'http://www.baidu.com/',
          authorId: '0001',
          channelId: '1001',
          enableFlag: '2',
          fixedFloorId: '2001',
          floorContentId: '3001',
          floorType:'2',
          news1Id:'100111',
          news2Id:'100222',
          news3Id:'100333',
          vedioSetId: '300111'
        },
        {
          advImgUrl: 'https://www.baidu.com/img/bd_logo1.png',
          advJumpType: 3,
          advJumpUrl: 'http://www.baidu.com/',
          authorId: '0001',
          channelId: '1001',
          enableFlag: '1',
          fixedFloorId: '2001',
          floorContentId: '3001',
          floorType:'1',
          news1Id:'100111',
          news2Id:'100222',
          news3Id:'100333',
          vedioSetId: '300111'
        }   
      ]
    };

    let result = {
      retCode: 0,
      data
    };
    option.success && option.success(result);
  },
}