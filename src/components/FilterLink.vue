<template>
    <a 
        class="fliter-link" 
        v-bind:class="{active:active}" 
        href="javascript:void(0)"
        v-on:click="filterTodo"
    >
        <slot>All</slot>
    </a>
</template>

<script>
export default {
    name:'filterlink',
    props:['filter','active'],
    methods:{
        filterTodo(){
            this.$emit('filterTodo',this.filter.filter);
        }
    }
}
</script>

<style lang="scss">
    .filter{
        &.active{
            color:red;
        }
    }
</style>