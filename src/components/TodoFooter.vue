<template>
        <ul class="normalize-ul">
            <router-link
                v-for="(link,index) in links" 
                v-bind:to="link.path"
                v-bind:key="index"
                v-bind:exact="link.exact"
                v-slot="{href, route, navigate, isActive}"
                >
                <NavLink  v-bind:href="href" v-on:click="navigate" v-bind:active="isActive">
                    {{link.display}}
                </NavLink>
            </router-link>
        </ul>
</template>

<script>
import NavLink from './NavLink.vue';

export default {
    name:'todofooter',
    data(){
        return {
            links:[{path:'/',display:'All',exact:true},{path:'/active',display:'Active'},{path:'/completed',display:'Completed'}],
        };
    },
    components:{
        NavLink
    }
}
</script>

<style lang="scss">
    .normalize-ul{
        margin:0;
        padding:0;
    }
</style>