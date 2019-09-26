<template>
    <ul class="todo-list">
        <TodoItem
            v-for="todo in todos"
            v-bind:key="todo.id"
            v-bind:todo="todo"
         />
    </ul>
</template>

<script>
import {mapState} from 'vuex';
import TodoItem from './TodoItem.vue';

export default {
    name:'todolist',
    components:{
        TodoItem,
    },
    computed:mapState({
        todos:state=>state.todos,
    }),
}
</script>