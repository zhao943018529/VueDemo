<template>
  <div class="app-contianer">
    <AddTodo />
    <TodoList v-bind:type="filterType" />
    <TodoFilters v-bind:type="filterType" v-on:filterTodo="filterTodo" />
  </div>
</template>

<script>
import AddTodo from "./components/AddTodo.vue";
import TodoList from "./components/TodoList.vue";
import TodoFilters from "./components/TodoFilters.vue";
import _ from "lodash";

export default {
  name: "App",
  components: {
    AddTodo,
    TodoList,
    TodoFilters
  },
  data() {
    return {
      filterType: ""
    };
  },
  methods: {
    filterTodo(type) {
      debugger;
      this.filterType = type;
    }
  }
  // {
  //     addTodo(name){
  //         this.todos.push({id:_.uniqueId('todo'),name:name,completed:false});
  //     },
  //     toggle(id){
  //         let todo = _.find(this.todos,item=>item.id===id);
  //         if(todo){
  //             todo.completed=!todo.completed;
  //         }
  //     },
  //     updateTodoName(id,name){
  //         let todo = _.find(this.todos,item=>item.id===id);
  //         if(todo){
  //             todo.name=name;
  //         }
  //     },
  //     deleteTodo(id){
  //         debugger;
  //         this.todos=this.todos.filter(todo=>todo.id!==id);
  //     }
  // }
};
</script>

<style lang="scss">
@import "./styles/common.scss";

#app {
  height: 100%;
}

.app-contianer {
  width: 60%;
  margin: 0 auto;
  border: 1px solid #42e86b;
  overflow: auto;
  height: 100%;
}

.todo-list {
  margin: 0;
  padding: 0;
}
</style>
