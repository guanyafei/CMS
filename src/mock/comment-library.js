export default {
  "/adminMgt/comment/query.do": (option) => {
    let data = {
      "totalCount": 23,
      "commentList": [{
        "commImgList": [
          {
            imgUrl: "http://sdosspre1.cnsuning.com/snsis/channel_content/9K4t7dXaMFPmBrUJal3YYXM67JRWNRC_7dMJf2GdaPQCA49jDPHwXiK-mEKNBWQ-.jpg?SDOSSAccessKeyId=DN7O46156U2PS6GT&Expires=1507691751&Signature=Y59CWX9BxIo9X3URtTSWEEUzJm4%3D"
          }
        ],
        "commId": "1b7b2d87a51b44dba369519275604d23",
        "commContent": "222222",
        "commDesContent": "222222",
        "commTitleId": "26353397",
        "commTitle": "赛事篇：国家德比次回合或定冠军归属",
        "commTitleType": 2,
        "likeNum": 0,
        "replyNum": 0,
        "reportNum": 0,
        "userType": 1,
        "userId": "18610911160_170923n31",
        "commStatus": 2,
        "parentCommId": null,
        "authId": "写死的",
        "createTime": "2017-10-11 18:12:21",
        "updateTime": "2017-10-11 18:12:21",
        "userNickName": "186****1160",
        "newsType": 1,
        "userheadPic": "http://image.suning.cn/uimg/cmf/cust_headpic/0000000000_01_120x120.jpg",
        "forbiddenStatus": 1,
        "forbiddenDays": 10,
        "parentComment": null,
        "contentOutDto": null
      },
      {
        "isImg": 0,
        "commId": "466a2a0cfa564f7ea4efa916f77f846b",
        "commContent": "阿卡丽",
        "commDesContent": "阿卡丽",
        "commTitleId": "1000018925",
        "commTitle": "上港争冠中超基本破碎豪赌亚冠 跨过恒大不是底线",
        "commTitleType": 1,
        "newsType": 1,
        "likeNum": 0,
        "replyNum": 0,
        "reportNum": 0,
        "userType": 1,
        "userId": "chenshenghan",
        "commStatus": 1,
        "parentCommId": null,
        "authId": "_429915446dfda8501cf3@suning",
        "createTime": "2017-10-09 16:14:29",
        "updateTime": "2017-10-09 16:14:29",
        "userNickName": "给你颜",
        "userheadPic": "http://image.suning.cn/uimg/cmf/cust_headpic/0000000000_01_120x120.jpg",
        "forbiddenStatus": 0,
        "forbiddenDays": null,
        "parentComment": null,
        "contentOutDto": null
      }
    ]
    };

    let result = {
      retCode: "0",
      data
    };

    option.success && option.success.call(option.context, result);
  }

}
