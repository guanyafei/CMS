'use strict'
import Vue from 'vue';
import Page from 'views/info-management/library';
import router from 'routers/info-lib';
import VueComponents from 'src/main';

Vue.use(VueComponents);
const idx = new Vue({
  router,
  render: h => h(Page)
}).$mount('#idx');
