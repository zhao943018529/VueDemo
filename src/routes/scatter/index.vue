<template>
    <div class="scatter-container">
        <h1>View</h1>
        <ScatterChart />
    </div>
</template>
<script>
import ScatterChart from './ScatterChart.vue';

export default {
    name:'ScatterHome',
    components:{
        ScatterChart,
    }
}
</script>
<style lang="sass" scoped>
.scatter-container{
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}
</style>