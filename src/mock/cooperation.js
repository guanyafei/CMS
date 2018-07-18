export default {
  '/adminMgt/push/queryNewsList.do': (option) => {
    let newsList = []
    for (let i = 1; i < 5; i++) {
      newsList.push({
        id: i,
        isPush: i%2,
        ccrList: [{
          channelName: '西甲',
          rejectReason: '错别字',
          status: '1'
        }, {
          channelName: '英超',
          rejectReason: '错别字',
          status: '2'
        }, {
          channelName: '推荐',
          rejectReason: '因含有敏感词汇，内容与发布频道不符',
          status: '3'
        }, {
          channelName: '推荐',
          rejectReason: '错别字',
          status: '3'
        }],
        newsType: i,
        collectNum: '256',
        commentNum: '32',
        exposeNum: '390',
        likeNum: '203',
        readNum: '203',
        cover: 'http://b.zol-img.com.cn/desk/bizhi/image/1/960x600/1348724812863.jpg',
        createTime: '2017-6-8 21:20',
        newsId: '12718',
        title: '西甲直播：梅西9球带领巴塞罗那狂胜皇马10球',
        level: i,
        nickName: 'aaaa',
        status: i,
        nlrList: [{
          labelName: 'sports'
        }, {
          labelName: 'entertainments'
        }]
      })
    }

    let result = {
      retCode: '0',
      data: {
        newsList,
        newsNum: 34
      }
    };
    option.success && option.success(result);
  },
}
