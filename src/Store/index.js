import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'lodash';

export default function createStore() {
    return new Vuex.Store({
        state: {
            todos: [],
        },
        mutations: {
            addTodo(state, payload) {
                state.todos.push({ id: _.uniqueId('todo_'), name: payload.name, completed: false, });
            },
            updateTodo(state, payload) {
                const partitialTodo = payload.todo;
                const updateTodo = Object.keys(partitialTodo)
                    .filter(key => key !== 'id')
                    .reduce((accumlate, key) => {
                        accumlate[key] = partitialTodo[key];

                        return accumlate;
                    }, {});
                const index = _.findIndex(state.todos, item => item.id === partitialTodo.id);
                Vue.set(state.todos, index, Object.assign({}, state.todos[index], updateTodo));
            },
            deleteTodo(state, payload) {
                const index = state.todos.findIndex(todo => todo.id === payload.id);
                state.todos.splice(index, 1);
            }
        }
    });
};