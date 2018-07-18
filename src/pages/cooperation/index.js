'use strict';
import Vue from 'vue';
import Page from 'views/cooperation-management/cooperation';
import VueComponents from 'src/main';

Vue.use(VueComponents);

new Vue({
  render: h => h(Page)
}).$mount('#idx');
