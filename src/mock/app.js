export default {
  "/channel/list": (option) => {
    let data = {
      "count": 23,
      "list": [{
        info: "第三期苏宁少儿足球夏令营开始招生了",
        type: "URL",
        href: "www.suining1.com",
        tags: "活动",
        time1: "2017-04-02 21:07",
        time2: "2017-04-02 21:07",
        state: "未开始",
      }]
    };

    let result = {
      isOK: true,
      data
    };

    option.success && option.success(result);
  },

}
