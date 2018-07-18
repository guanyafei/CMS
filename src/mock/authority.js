export default {
  "/adminMgt/soaUserChannelRel/queryChannelList.do": (option) => { // 频道权限查询
    let data = {
      "listNum": 30,
      "channelList": [{
        'channelId': 10001,
        "channelName": '频道权限1',
      },{
        'channelId': 10002,
        "channelName": '频道权限2',
      },{
        'channelId': 10003,
        "channelName": '频道权限3',
      }]
    };

    let result = {
      retCode: 0,
      data : data
    };
    option.success && option.success(result);

  },"/adminMgt/soaUserChannelRel/querySpecialChannelList.do": (option) => { // 频道权限查询
    let data = {
      "listNum": 30,
      "channelList": [{
        'channelId': 100021212,
        "channelName": '主题权限1',
      },{
        'channelId': 100021213,
        "channelName": '主题权限2',
      },{
        'channelId': 100021214,
        "channelName": '主题权限3',
      }]
    };

    let result = {
      retCode: 0,
      data : data
    };
    option.success && option.success(result);

  },"/adminMgt/soaUserChannelRel/queryUserOfChannel.do": (option) => { // 根据频道id查询会员
    let data = {
      "listNum": 30,
      "soaUserList": [{
        'channelId': 100021212,
        "id": '001',
        "soaUserId": '会员账户1',
      },{
        'channelId': 100021213,
        "id": '001',
        "soaUserId": '会员账户2',
      },{
        'channelId': 100021214,
        "id": '001',
        "soaUserId": '会员账户3',
      }]
    };

    let result = {
      retCode: 0,
      data : data
    };
    option.success && option.success(result);

  }

}
