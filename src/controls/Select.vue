<template>
    <div class="select-control">
        <div class="select-placeholder">

        </div>
        <div class="select-modal">
            <ul class="select-content">
                <slot></slot>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name:'select',
    data(){
        return {
            open:false,
        };
    }
}
</script>

<style lang="scss">

</style>