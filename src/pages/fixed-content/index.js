import Vue from 'vue';
import Page from 'views/search-management/fixedContent';
import vueComponents from 'src/main';

Vue.use(vueComponents);

const idx = new Vue({
    render: h => h(Page)
}).$mount('#idx')