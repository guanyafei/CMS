'use strict'
import Vue from 'vue';
import Page from 'views/info-management/media';
import router from 'routers/info-media';
import VueComponents from 'src/main';

Vue.use(VueComponents);

const idx = new Vue({
  router,
  render: h => h(Page)
}).$mount('#idx');