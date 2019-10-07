<template>
    <li class="todo-item">
        <div class="todo-content">
            <label>
                <input  type="radio" v-bind:checked="todo.completed" v-on:click="toggle"/>  
            </label>
            <label class="todo-name" v-if="edittingMode">
                <input
                    class="form-control"
                    ref="input" 
                    type="text" 
                    v-on:blur="escapeEditting" 
                    v-bind:value="todo.name" 
                    v-on:change="modifyTodoName"
                    v-on:deleteTodo="deleteTodo"
                />
            </label>
            <p 
                v-else
                class="todo-name" 
                v-on:dblclick="edittingMode=!todo.completed" 
                v-bind:class="{completed:todo.completed}"
                >
                    {{todo.name}}
            </p>
            <div class="todo-actions">
                <button class="todo-delete" v-on:click="deleteTodo">X</button>
            </div>
        </div>
    </li>
</template>

<script>
import {mapMutations} from 'vuex';

export default {
    name:'TodoItem',
    props:['todo'],
    data(){
        return {
            edittingMode: false,
        };
    },
    methods:{
        escapeEditting(){
            this.edittingMode=!this.edittingMode;
        },
        toggle(){
            this.$store.commit({
                type:'updateTodo',
                todo:{
                    id:this.todo.id,
                    completed:!this.todo.completed,
                },
            });
            // this.$emit('toggle',this.todo.id);
        },
        modifyTodoName(event){
            this.$store.commit({
                type:'updateTodo',
                todo:{
                    id:this.todo.id,
                    name:event.target.value
                }
            });
            // this.$emit('updateTodoName',this.todo.id,event.target.value);
        },
        deleteTodo(){
            this.$store.commit({type:'deleteTodo',id:this.todo.id});
            // this.$emit('deleteTodo',this.todo.id);
        }
    },
    updated(){
        if(this.edittingMode){
            this.$refs.input.focus();
        }
    }
}
</script>

<style lang="scss">
    .todo-item{
        list-style: none;
        padding: 0 12px;
    }

    .todo-name{
        flex:1;
        margin-left: 5px;

        &.completed{
            color:#aaa9a9;
            text-decoration:line-through;
        }
    }

    .todo-content{
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    }

    .todo-item{
        margin:6px 0;
        background:#ffffff;
    }
</style>