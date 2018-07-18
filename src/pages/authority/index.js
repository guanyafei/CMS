'use strict'
import Vue from 'vue';
import Page from 'views/sys-management/authority';
import VueComponents from 'src/main';

Vue.use(VueComponents);

const idx = new Vue({
  render: h => h(Page)
}).$mount('#idx');