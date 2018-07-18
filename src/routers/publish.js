'use strict';
import Vue from 'vue';
import VueRouter from 'vue-router';
import scrollBehavior from 'src/utils/scroll-behavior';
import Library from 'views/publish-management/library';
import Publish from 'views/publish-management/publish/publish';
import Edit from 'views/widgets/infoCommon/infoEditMain/edit';
import VideoLibrary from 'views/publish-management/video/library/home';
import VideoPublish from 'views/publish-management/video/add';
import { fetchInfoItemDetailsAction } from 'views/publish-management/library/fetch';
Vue.use(VueRouter);

// 3. Create the router
const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  scrollBehavior,
  routes: [
    { path: '/', component: Library },
    {
      path: '/text',
      name: '1',
      component: Publish,
      props: {
        newsType: 1
      }
    },
    {
      path: '/daily',
      name: '8',
      component: Publish,
      props: {
        newsType: 8
      }
    },
    {
      path: '/picture',
      name: '2',
      component: Publish,
      props: {
        newsType: 2
      }
    },
    {
      path: '/edit',
      component: Edit,
      props: route => ({ newsType: route.query.type })
    },
    {
      path: '/videoLib',
      component: VideoLibrary
    },
    {
      path: '/videoPublish',
      component: VideoPublish
    }
  ]
});

export default router;
