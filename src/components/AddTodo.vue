<template>
    <div class="addTodoContainer">
        <form v-on:submit.prevent="onSubmit">
            <input class="form-control" type="text" v-model="name"/>
        </form>
    </div>
</template>
<script>

export default {
    name:'AddTodo',
    data(){
        return {
            name:'',
        };
    },
    methods:{
        onSubmit(){
            if(this.name&&this.name.trim()){
                this.$store.commit({type:'addTodo',name:this.name});
                // this.$emit('addTodo',this.name);
                this.name='';
            }
        }
    },
}
</script>

<style lang="scss" scoped>
    .addTodoContainer{
        
    }
</style>
