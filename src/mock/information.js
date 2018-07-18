export default {
  '/adminMgt/permissionChannelList.do': (option) => {
    let result = {
      retCode: '0',
      data: {
        clist: [{
          channelId: 1,
          channelName: '中超'
        }, {
          channelId: 2,
          channelName: '英超'
        }]
      }
    };
    option.success && option.success(result);
  },

  '/adminMgt/examineNewsList.do': (option) => {
    let channelContentList = [{
      newsId: '1',
      contentCover: 'http://b.zol-img.com.cn/desk/bizhi/image/1/960x600/1348724812863.jpg',
      contentCreateTime: '2017-6-8 21:20',
      contentId: '12718',
      contentTitle: '西甲直播：梅西9球带领巴塞罗那狂胜皇马10球',
      level: '2',
      newsCreateTime: '2017-6-8 21:20',
      authorName: 'aaaa',
      source: '雅虎',
      contentType: '3',
      nlrList: [{
        labelName: 'sports'
      }, {
        labelName: 'entertainments'
      }]
    }, {
      newsId: '2',
      contentCover: 'http://b.zol-img.com.cn/desk/bizhi/image/1/960x600/1348724812863.jpg',
      contentCreateTime: '2017-6-8 21:20',
      contentId: '12738',
      contentTitle: '西甲直播：梅西9球带领巴塞罗那狂胜皇马10球',
      level: '1',
      newsCreateTime: '2017-6-8 21:20',
      authorName: 'aaaa',
      source: '雅虎',
      contentType: '3',
      nlrList: [{
        labelName: 'sports'
      }, {
        labelName: 'entertainments'
      }]
    }];

    let result = {
      retCode: '0',
      data: {
        channelContentList,
        channelContentNum: 34
      }
    };

    option.success && option.success(result);
  }

}
