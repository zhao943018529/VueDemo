<template>
  <div class="scatter-page">
    <h1>View</h1>
    <ScatterChart />
  </div>
</template>
<script>
import ScatterChart from "./ScatterChart.vue";

export default {
  name: "ScatterHome",
  components: {
    ScatterChart
  }
};
</script>
<style lang="scss">
.scatter-page {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: lightblue;
}
</style>
