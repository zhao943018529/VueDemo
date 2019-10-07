<template>
    <div class="todo-filter">
        <FilterLink 
            v-for="filter in filters"
            v-bind:key="filter.display"
            v-bind:filter="filter"
            v-bind:active="filter.filter===type"
            v-on:filterTodo="filterTodo"
        >
            {{filter.display}}
        </FilterLink>
    </div>    
</template>

<script>
import FilterLink from './FilterLink.vue';

export default {
    name:'todofilters',
    props:['type'],
    data(){
        return {
            currentFilter:this.type,
            filters:[
                {display:'All',filter:''},
                {display:'Active',filter:'active'},
                {display:'Completed',filter:'completed'}
            ]
        };
    },
    components:{
        FilterLink,
    },
    methods:{
        filterTodo(type){
            if(type!==this.type)this.$emit('filterTodo',type);
        }
    }
}
</script>

<style lang="scss">

</style>