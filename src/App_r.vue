<template>
  <div class="app-contianer">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="scss">
@import "./styles/common.scss";
#app {
  height: 100%;
}

.app-contianer {
  height: 100%;
  // width: 60%;
  margin: 0 auto;
  border: 1px solid #42e86b;
  overflow: auto;
}

.todo-list {
  margin: 0;
  padding: 0;
}
</style>
