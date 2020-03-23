<template>
  <div class="scatter-page">
    <h2>View</h2>
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
