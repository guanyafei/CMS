import Vue from 'vue';
import DI from 'interface';
// import common from 'js/common';
// 新的bus
let bus = new Vue({
  created() {
    // 添加全局on事件
  },
  methods: {
    // 添加on回调函数或公共事件
    deleteNullProperty(obj) {
      for (let key in obj) {
        if (obj[key] === '' || obj[key] == undefined) {
          delete obj[key];
        }
      }

      return obj;
    },
    filterNum(str) {
      return parseInt(str.replace(/[^0-9]/gi, ''), 10);
    },
    sensitiveCheck(option) {
      if (!option) return;
      let isArray = this.isArray(option);
      if (isArray) {
        option.map(item => {
          check.call(this, item);
        });
      } else {
        check.call(this, option);
      }

      function check(item) {
        this.$ajax({
          url: DI.common.checkLimitWords,
          context: this,
          loadingText: item.loadingText,
          data: JSON.stringify({
            ...item.params
          }),
          success: res => {
            item.callback(res);
          },
          error: () => {
            console.log('error');
          }
        });
      }
    },
    isArray(object) {
      return (
        object && typeof object === 'object' && Array == object.constructor
      );
    },
    openPreview(url) {
      let availHeight = screen.availHeight;
      let availWidth = screen.availWidth;
      let windowWidth = 480;
      let screenLeft = (availWidth - windowWidth) / 2;

      window.open(
        url,
        '_blank',
        `width=${windowWidth},height=${availHeight - 150},left=${
          screenLeft
        },top=50,menubar=no,toolbar=no,status=no,scrollbars=yes`
      );
    }
  }
});
if (!window.globalBus) {
  window.globalBus = bus;
}
export default bus;
