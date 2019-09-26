import Vue from 'vue';
import App from './App.vue';
import Vuex from 'vuex';
import createStore from './Store';

Vue.use(Vuex);
const store = createStore();

new Vue({
    store,
    render: h => h(App),
}).$mount('#app');