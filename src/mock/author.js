export default {
  '/queryAuthorList.do': (option) => {
    let data = {
      'count': 23,
      'list': [{
        createTime: '2017-06-13 09:22',	//用户注册时间	string	
        recentLoginTime: '2017-07-13 09:22',	//最近登录时间	string	
        fansNum: 23,
        publishNum: 12,
        status: 1,
        authorType: 2,
        userType: 2,
        authorId: 12,	//	用户id	number	
        authorImg: 'http://p1.qhmsg.com/dmsmty/337_337_/t01b675f7d662992b8c.png',	//用户头像	string	
        remark: 'sss',	//用户兴趣标签	string	
        nickName: 'ssss',	//	用户昵称	string	
        introduction: 'ssss'//
      }, {
        createTime: '2017-06-13 09:22',	//用户注册时间	string	
        recentLoginTime: '2017-07-13 09:22',	//最近登录时间	string	
        fansNum: 23,
        publishNum: 12,
        status: 2,
        authorType: 1,
        userType: 2,
        authorId: 12,	//	用户id	number	
        authorImg: 'http://p1.qhmsg.com/dmsmty/337_337_/t01b675f7d662992b8c.png',	//用户头像	string	
        remark: 'sss',	//用户兴趣标签	string	
        nickName: 'ssss',	//	用户昵称	string	
        introduction: 'ssss'//
      }]
    };

    let result = {
      retCode: '0',
      data
    };

    option.success && option.success(result);
  },
  '/adminMgt/getAuthorDetailInfoFromYG.do': (option) => {
    let data = {
      authorId: '110aadnoaoalmcijwojos',
      account: 'qjqojofa201iqpdamc;aalmcijwojos',
      authorType: 1,
      statffId: '17050542',
      nickName: '帅b'
    };

    let result = {
      retCode: '0',
      data
    };

    option.success && option.success(result);
  },
  '/adminMgt/addAuthor.do': (option) => {
    let randomNum = Math.floor(Math.random()*10);
    let result = {
      retCode: randomNum>5?'110':'0'
    };

    option.success && option.success(result);
  },
  '/adminMgt/queryAuthorDetail.do': (option) => {
    let data = {
      account: '110',
      authorId: 1,
      authorName: '帅b',
      authorType: '1',
      createTime: '2012-10-11',
      email: '188@suning,com',
      fansNum: '666',
      headPic: 'http://p1.qhmsg.com/dmsmty/337_337_/t01b675f7d662992b8c.png',
      introduction: 'test',
      mobile: '17050542',
      otherContact: '1291090',
      publishNum: '170',
      qq: '17050542',
      remark: '资深砖家',
      statffId: '17050542',
      status: '1',
      updateTime: '2017-10-12',
      userType: '1',
      wechat: '嘿嘿嘿',
      weibo: '嘿嘿嘿_111'
    };

    let result = {
      retCode: '0',
      data
    };

    option.success && option.success(result);
  },
}
