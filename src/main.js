import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import createStore from './Store';
import routes from './routes';

Vue.use(Vuex);
Vue.use(VueRouter)
const store = createStore();

const router = new VueRouter({
    routes
});

new Vue({
    router,
    store,
}).$mount('#app');