<template>
    <li class="nav-link">
        <a  
            class="a-link" 
            v-bind:class="{'nav-active':active}" 
            v-bind:href="href" 
            v-on:click="click"
            >
            <slot></slot>
        </a>    
    </li>
</template>

<script>
export default {
    name:'navlink',
    props:['active','href'],
    methods:{
        click(){
            this.$emit('click');
        }
    },
    mounted(){
        console.log(this.active);
    }
}
</script>

<style lang="scss">
    .nav-link{
        padding:6px 12px;
        list-style: none;
    }

    .a-link{
        display:inline-block;

        &.nav-active{
            color:red;
        }
    }
</style>