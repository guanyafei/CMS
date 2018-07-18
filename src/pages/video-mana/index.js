'use strict';
import Vue from 'vue';
import Page from 'views/info-management/video-mana';
import router from 'routers/info-video';
import VueComponents from 'src/main';

Vue.use(VueComponents);

const idx = new Vue({
  router,
  render: h => h(Page)
}).$mount('#idx');
