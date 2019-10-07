<template>
    <ul class="todo-list">
        <TodoItem
            v-for="todo in filterHelper(todos)"
            v-bind:key="todo.id"
            v-bind:todo="todo"
         />
    </ul>
</template>

<script>
import {mapState} from 'vuex';
import TodoItem from './TodoItem_r.vue';

export default {
    name:'todolist',
    props:['type'],
    components:{
        TodoItem,
    },
    computed:{
        ...mapState({
        todos:state => state.todos,
        }),
    },
    methods:{
        filterHelper(todos){
            switch(this.type){
                case 'active':
                    return todos.filter(todo=>!todo.completed);
                case 'completed':
                    return todos.filter(todo=>todo.completed);
                default:
                    return todos;
            }
        }
    },
}
</script>