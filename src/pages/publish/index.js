'use strict';
import Vue from 'vue';
import Page from 'views/publish-management/';
import router from 'routers/publish';
import VueComponents from 'src/main';

Vue.use(VueComponents);

const idx = new Vue({
  router,
  render: h => h(Page)
}).$mount('#idx');
