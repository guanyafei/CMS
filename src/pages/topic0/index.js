'use strict';
import Vue from 'vue';
import Page from 'views/app-management/topic0';
import router from 'routers/app-topic';
import VueComponents from 'src/main';

Vue.use(VueComponents);

const idx = new Vue({
    router,
    render: h => h(Page)
}).$mount('#idx');