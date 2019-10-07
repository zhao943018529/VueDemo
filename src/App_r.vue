<template>
    <div class="app-contianer">
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name:'App',
}
</script>

<style lang="scss">
    @import './styles/common.scss';

    .app-contianer{
        width:60%;
        margin:0 auto;
        border:1px solid #42e86b;
    }

    .todo-list{
        margin:0;
        padding:0;
    }
</style>