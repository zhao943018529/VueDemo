<template>
  <li
    class="select-option"
    :class="{
    'selected':selected,
    'hover':hover,
  }"
    @click="handleSelect"
  >
    <slot>
      <span>{{label||value}}</span>
    </slot>
  </li>
</template>

<script>
import emitter from "./emitter";
export default {
  name: "select-option",
  mixins: [emitter],
  inject: ["select"],
  props: {
    label: String,
    value: String || Number,
    disabled:Boolean,
  },
  data() {
    return {
      hover: false,
      selected: false
    };
  },
  methods: {
    handleSelect() {
      this.dispatch("select", "handleSelect", [this]);
    },
    addOption() {
      this.select.addOption(this);
    }
  },
  created() {
    this.addOption();
  },
};
</script>

<style lang="scss">
.select-option {
  cursor: pointer;
  padding: 6px 12px;

  &.hover,&:hover{
    background: #e8e8e8;
  }
  &.selected{
    background:#c8c8c8;
  }
}
</style>