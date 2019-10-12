<template>
  <div class="select-control">
    <div class="select-placeholder" @click="toggleDropdown">
      <input
        type="text"
        ref="reference"
        readonly="true"
        class="form-control"
        v-bind:value="selected.length?selected[0].value:''"
        placeholder="select a option"
        @keydown.up.prevent="navigate('previous')"
        @keydown.down.prevent="navigate('next')"
        @keydown.enter.prevent="selectActiveOption"
      />
    </div>
    <select-dropdown v-bind:visiable="visiable" v-show="visiable">
      <slot></slot>
    </select-dropdown>
  </div>
</template>

<script>
import SelectDropdown from "./select-dropdown.vue";
import emitter from "./emitter";
import Navigate from "./navigate-mixin";
import _ from "lodash";

export default {
  name: "select",
  mixins: [emitter, Navigate],
  props: {
    disabled: Boolean,
    handleSelect: Function
  },
  data() {
    return {
      visiable: false,
      options: [],
      selected: [],
      value: [],
      mutiple: this.mutiple,
      disabled: this.disabled,
      timeId: null
    };
  },
  provide() {
    return {
      select: this
    };
  },
  components: {
    SelectDropdown
  },
  methods: {
    toggleDropdown() {
      if (!this.disabled) {
        this.visiable = !this.visiable;
      }
    },
    closeDropdown() {
      this.visiable = false;
    },
    addOption(option) {
      this.options.push(option);
    },
    selectOption(option) {
      if (this.selected.length == 0 || this.mutiple) {
        this.selected.push(option);
      } else {
        this.selected = [option];
      }
    },
    selectActiveOption() {
      if (
        this.visiable &&
        this.hoverIndex > -1 &&
        this.hoverIndex < this.activeOptions.length &&
        !this.activeOptions[this.hoverIndex].selected
      ) {
        this.selectOption(this.activeOptions[this.hoverIndex]);
      }
    },
    clearData() {
      this.hoverIndex = -1;
    },
    focus() {
      this.$refs.reference.focus();
    }
  },
  computed: {
    activeOptions() {
      return this.options.filter(option => !option.disabled);
    }
  },
  watch: {
    visiable(val) {
      if (val) {
        this.broadcast("select-dropdown", "updatePosition", []);
        this.focus();
        if (this.selected.length > 0) {
          this.timeId = setTimeout(() => {
            this.broadcast("select-dropdown", "scrollToSelected", [
              this.selected[0].$el
            ]);
          }, 50);
        }
      } else {
        this.clearData();
        if (this.timeId) {
          window.clearTimeout(this.timeId);
          this.timeId = null;
        }
      }
    },
    hoverIndex(index, prevIndex) {
      if (prevIndex > -1 && prevIndex < this.activeOptions.length) {
        this.activeOptions[prevIndex].hover = false;
      }
      if (index > -1 && index < this.activeOptions.length) {
        this.activeOptions[index].hover = true;
      }
    },
    selected(options, removedOptions) {
      _.forEach(removedOptions, option => (option.selected = false));
      _.forEach(options, option => (option.selected = true));
      if (!this.mutiple) {
        this.$emit("collapse");
      }
    }
  },
  created() {
    this.$on("handleSelect", this.selectOption);
    this.$on("collapse", this.closeDropdown);
  }
};
</script>

<style lang="scss">
</style>