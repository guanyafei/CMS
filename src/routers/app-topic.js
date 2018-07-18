'use strict';
import Vue from 'vue';
import VueRouter from 'vue-router';
import scrollBehavior from 'src/utils/scroll-behavior';
import Home from 'views/app-management/topic0/home/home';

Vue.use(VueRouter);

// 3. Create the router
const router = new VueRouter({
    mode: 'hash',
    base: __dirname,
    scrollBehavior,
    routes: [
        { path: '/', component: Home } // all paths are defined without the hash.
    ]
});

export default router;