<template>
    <div>
        <AddTodo/>
        <TodoList v-bind:type="$route.params.type"/>
        <TodoFooter/>
    </div>
</template>

<script>
import AddTodo from './AddTodo.vue';
import TodoList from './TodoList_r.vue';
import TodoFooter from './TodoFooter.vue';

export default {
    name:'mytodos',
    components:{
        AddTodo,
        TodoList,
        TodoFooter
    },
    beforeMount(){
        console.log('i am iron');
        console.log(this.$route.params);
    }
}
</script>

<style lang="scss">

</style>