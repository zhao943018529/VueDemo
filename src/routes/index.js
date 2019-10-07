import App from '../App_r.vue';
import MyTodos from '../components/MyTodos.vue';


export default [{
    path: '/',
    component: App,
    children: [{
        path: '',
        redirect: '/all'
    }, {
        path: '/:type',
        component: MyTodos
    }]
}];