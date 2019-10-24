<template>
  <div>
    <AddTodo />
    <TodoList v-bind:type="$route.params.type" />
    <TodoFooter />
    <div style="width:40%" v-if="$route.params.type=='all'">
      <el-select>
        <el-option v-for="option in options" v-bind:key="option.id" v-bind="option">
          <span>{{option.label+":"+option.value}}</span>
        </el-option>
      </el-select>
    </div>
    <TestJSX name="5555-99999999999">
      <Option key="aaa" value="bbbb" />
      <Option key="bbbb" value="ccccc" />
      <Option key="dddd" value="eee" />
      <Option key="ffff" value="ggggg" />
      <Option key="kkkk" value="jjjjj" />
    </TestJSX>
    <ListView :size="30"/>
  </div>
</template>

<script>
import AddTodo from "./AddTodo.vue";
import TodoList from "./TodoList_r.vue";
import TodoFooter from "./TodoFooter.vue";
import ElSelect from "../controls/select.vue";
import ElOption from "../controls/option.vue";
import TestJSX from './TestJSX.jsx';
import Option from './Option.jsx';
import ListView from './ListView.jsx';

export default {
  name: "mytodos",
  data() {
    return {
      options: [
        { id: 1, label: "afafd", value: 111 },
        { id: 2, label: "gggg", value: 222 },
        { id: 3, label: "ttttt", value: 3333 },
        { id: 4, label: "kkkk", value: 666655 },
        { id: 5, label: "1111111", value: 151224 },
        { id: 6, label: "hsqafasdf", value: 11142434 },
        { id: 7, label: "15252", value: 33338 },
        { id: 8, label: "qrqwrdas", value: 54779345 },
        { id: 9, label: "afafd3d222", value: 1131 },
        { id: 10, label: "ggg14sg", value: 2228 },
        { id: 11, label: "tte45ttt", value: 333323 },
        { id: 12, label: "d32fkkkk", value: 663666 },
        { id: 13, label: "`df31111111", value: 15414 },
        { id: 14, label: "qwerhsqafasdf", value: 1442434 },
        { id: 15, label: "`15252", value: 31333 },
        { id: 16, label: "`qrqwrdas", value: 54377945 }
      ]
    };
  },
  components: {
    AddTodo,
    TodoList,
    TodoFooter,
    ElSelect,
    ElOption,
    TestJSX,
    Option,
    ListView,
  },
  beforeMount() {
    console.log("i am iron");
    console.log(this.$route.params);
  }
};
</script>

<style lang="scss">

    .list-view{
        width:100px;
        height: 300px;
        overflow-y: auto;
    }

    .list-item{
        padding:12px 10px;
    }
</style>