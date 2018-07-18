export default {
  "/adminMgt/authorListQuery.do": (option) => {
    let data = {
      "authorListNum": 23,
      "authorList": [{
        createTime: "2017-06-13 09:22",	//用户注册时间	string	
        lastLoginTime: "2017-07-13 09:22",	//最近登录时间	string	
        commentNum: 23,	//	用户评论数	number	
        followNum: 12,	//	用户关注数	number	
        flag: 1,	//	用户禁言状态	number	1:禁言中 2:没禁言
        blockDays: 20,
        pptvUserId: 12,	//	用户id	number	
        headPic: "http://p1.qhmsg.com/dmsmty/337_337_/t01b675f7d662992b8c.png",	//用户头像	string	
        userLabel: "sss",	//用户兴趣标签	string	
        likeNum: 121,	//用户点赞数	number	
        nickName: "ssss",	//	用户昵称	string	
        resource: "ssss"//
      },{
        createTime: "2017-06-13 09:22",	//用户注册时间	string	
        lastLoginTime: "2017-07-13 09:22",	//最近登录时间	string	
        commentNum: 23,	//	用户评论数	number	
        followNum: 12,	//	用户关注数	number	
        flag: 0,	//	用户禁言状态	number	1:禁言中 2:没禁言
        blockDays: 20,
        pptvUserId: 12,	//	用户id	number	
        headPic: "http://p1.qhmsg.com/dmsmty/337_337_/t01b675f7d662992b8c.png",	//用户头像	string	
        userLabel: "sss",	//用户兴趣标签	string	
        likeNum: 121,	//用户点赞数	number	
        nickName: "ssss",	//	用户昵称	string	
        resource: "ssss"//
      }]
    };

    let result = {
      retCode: "0",
      data
    };

    option.success && option.success(result);
  }
}
