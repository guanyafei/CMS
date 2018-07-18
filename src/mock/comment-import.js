export default {
  "/adminMgt/commentImport/queryTask.do": (option) => {
    let list = [];
    for (let i = 1; i < 10; i++) {
      let element = {
        commCount: 200,
        commImportTaskId: i,
        commTitle: "标题001",
        commTitleId: "ac909c129",
        commTitleType: i % 4 + 1,
        newsType: i % 3 + 1,
        startTime: "2017-04-02 21:07",
        endTime: "2017-04-02 21:07",
        executeTime: "2017-04-02 21:07",
        taskStatus: i % 4 + 1
      };
      list.push(element);
    }
    let data = {
      "taskListCount": 23,
      "taskList": list
    };

    let result = {
      retCode: "0",
      data
    };

    option.success && option.success.call(option.context, result);
  },
  "/adminMgt/commentImport/taskDetail.do": (option) => {
    let list = [];
    for (let i = 1; i < 10; i++) {
      let element = {
        commContent: "君不见，黄河之水天上来⑵，奔流到海不复回君不见，高堂明镜悲白发，朝如青丝暮成雪人生得意须尽欢⑷，莫使金樽空对月"
      };
      list.push(element);
    }
    let data = {
      "commentListCount": 43,
      "commentList": list
    };

    let result = {
      retCode: "0",
      data
    };

    option.success && option.success.call(option.context, result);
  },
  "/adminMgt/wormComment/queryWormComment.do": (option) => {
    let list = [];
    for (let i = 1; i < 10; i++) {
      let element = {
        id: i,
        commTitle: "title" + i,
        createTime: "2017-08-22 22:22:00",
        commContent: "君不见，黄河之水天上来⑵，奔流到海不复回君不见，高堂明镜悲白发，朝如青丝暮成雪人生得意须尽欢⑷，莫使金樽空对月"
      };
      list.push(element);
    }
    let data = {
      "commentNum": 43,
      "commentList": list
    };

    let result = {
      retCode: "0",
      data
    };

    option.success && option.success.call(option.context, result);
  },
}
