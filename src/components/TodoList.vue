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
    props:['type'],
    components:{
        TodoItem,
    },
    computed:{
        ...mapState({
        originalTodos:state => state.todos,
        }),
        todos(){
            return !this.type?
            this.originalTodos:this.filterHelper(this.type==='completed')(this.originalTodos)
        }
    },
    methods:{
        filterHelper(isCompleted){
            return todos=>todos.filter(todo=>todo.completed===isCompleted);
        }
    },
    beforeUpdate(){
        debugger;
    }
}
</script>