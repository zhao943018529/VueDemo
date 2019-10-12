<template>
  <div class="select-modal">
    <ul class="select-content">
      <slot></slot>
    </ul>
  </div>
</template>

<script>
import {scrollInToView} from './util';

export default {
  name: "select-dropdown",
  inject: ["select"],
  props: ["visiable"],
  data() {
    return {};
  },
  methods: {
    updatePosition() {
      const alignRect = this.alignEl.getBoundingClientRect();
      // const targetRect = this.$el.getBoundingClientRect();
      this.$el.style.top = alignRect.bottom + "px";
      this.$el.style.left = alignRect.left + "px";
    },
    scrollToSelected(target){
      scrollInToView(this.$el,target);
    }
  },
  created() {
    this.$on("updatePosition", this.updatePosition);
    this.$on("scrollToSelected",this.scrollToSelected);
  },
  updated() {
    console.log( "visiable:" + this.visiable);
  },
  mounted() {
    document.body.appendChild(this.$el);
    this.alignEl = this.select.$refs.reference;
  },
  beforeDestroy() {
    document.body.removeChild(this.$el);
  }
};
</script>

<style lang="scss">
.select-modal {
  position: absolute;
  box-shadow: 2px 2px 4px #737369a6;
  overflow: auto;
  max-height: 200px;
}

.select-content {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>