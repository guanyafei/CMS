'use strict';
import Vue from 'vue';
import VueRouter from 'vue-router';
import scrollBehavior from 'src/utils/scroll-behavior';
import Home from 'views/info-management/video-mana/home';
import Edit from 'views/info-management/video-mana/edit/edit';

Vue.use(VueRouter);

// 3. Create the router
const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  scrollBehavior,
  routes: [
    { path: '/', component: Home }, // all paths are defined without the hash.
    { path: '/edit', component: Edit }
  ]
});

export default router;
