<script>
// <template>
//   <div class="c-popper">
//     <div
//       ref="alignElement"
//       class="c-popper-reference"
//       :class="value ? activeClass : ''"
//       @click="toggle"
//     >
//       <slot name="default"></slot>
//     </div>
//     <div class="c-popper-mask" ref="maskRef" @click="closeOnMask" v-if="value"></div>
//     <div ref="popElement" class="c-popper-popup" v-show="value">
//       <div class="c-popper-content" :class="contentClass">
//         <slot name="content" v-if="value"></slot>
//         <i class="ivu-icon c-popper-close" @click="close" v-if="closable"></i>
//       </div>
//       <i ref="arrow" :class="arrowClass"></i>
//     </div>
//   </div>
// </template>
import _ from "lodash";
import CPopover from "./c-popover.vue";
import { cloneVNode, combineClassNames } from "./util.js";

export default {
  name: "poptip",
  components: {
    CPopover
  },
  data() {
    return {
      arrowClass: "c-popper-arrow",
      offset: 8,
      value: this.visible,
      gap: 20
    };
  },
  props: {
    visible: Boolean,
    titleClass: String,
    activeClass: String,
    contentClass: String,
    getContainer: Function,
    closable: Boolean
  },
  methods: {
    adjustPosition() {
      const container = this.getContainer();
      const winRect = container.getBoundingClientRect();
      const alignElement = this.$refs.alignElement;
      const popElement = this.$refs.popElement;
      const alignRect = alignElement.getBoundingClientRect();
      popElement.style.willChange = "top,left";
      popElement.style.display = "block";
      const popRect = popElement.getBoundingClientRect();
      const delta = {
        left: alignRect.left - winRect.left - this.gap,
        right: winRect.left + winRect.width - alignRect.right - this.gap,
        top: alignRect.top - winRect.top - this.gap,
        bottom: winRect.top + winRect.height - alignRect.bottom - this.gap
      };
      const layout = {
        vertical: Math.min(delta.top, delta.bottom),
        horizontal: Math.min(delta.left, delta.right)
      };
      let placement;
      if (
        delta.left > popRect.width + this.offset &&
        layout.vertical > layout.horizontal
      ) {
        placement = "left";
      } else if (
        delta.right > popRect.width + this.offset &&
        layout.vertical > layout.horizontal
      ) {
        placement = "right";
      } else if (
        delta.top > popRect.height + this.offset &&
        layout.horizontal > layout.vertical
      ) {
        placement = "top";
      } else if (
        delta.bottom > popRect.height + this.offset &&
        layout.horizontal > layout.vertical
      ) {
        placement = "bottom";
      } else if (delta.left > popRect.width + this.offset) {
        placement = "left";
      } else if (delta.right > popRect.width + this.offset) {
        placement = "right";
      } else if (delta.top > popRect.height + this.offset) {
        placement = "top";
      } else {
        placement = "bottom";
      }
      let left;
      let top;
      const halfVertical = (popRect.height - alignRect.height) * 0.5;
      const halfHorizontal = (popRect.width - alignRect.width) * 0.5;
      switch (placement) {
        case "left":
          left = -popRect.width - this.offset;
          if (delta.top < halfVertical) {
            top = -delta.top;
          } else if (delta.bottom < halfVertical) {
            top = -Math.min(
              halfVertical - delta.bottom + halfVertical,
              delta.top
            );
          } else {
            top = -halfVertical;
          }
          break;
        case "right":
          left = alignRect.width + this.offset;
          if (delta.top < halfVertical) {
            top = -delta.top;
          } else if (delta.bottom < halfVertical) {
            top = -Math.min(
              halfVertical - delta.bottom + halfVertical,
              delta.top
            );
          } else {
            top = -halfVertical;
          }
          break;
        case "top":
          top = -(this.offset + popRect.height);
          if (delta.left < halfHorizontal) {
            left = -delta.left;
          } else if (delta.right < halfHorizontal) {
            left = -Math.min(
              halfHorizontal - delta.right + halfHorizontal,
              delta.left
            );
          } else {
            left = -halfHorizontal;
          }
          break;
        case "bottom":
          top = alignRect.height + this.offset;
          if (delta.left < halfHorizontal) {
            left = -delta.left;
          } else if (delta.right < halfHorizontal) {
            left = -Math.min(
              halfHorizontal - delta.right + halfHorizontal,
              delta.left
            );
          } else {
            left = -halfHorizontal;
          }
          break;
        default:
          break;
      }
      popElement.style.left = left + "px";
      popElement.style.top = top + "px";
      let arrowLeft;
      let arrowTop;

      switch (placement) {
        case "left":
        case "right":
          arrowTop =
            (Math.min(alignRect.height, top + popRect.height) -
              Math.max(top, 0) -
              this.offset) *
              0.5 -
            Math.min(top, 0);
          break;
        case "top":
        case "bottom":
          arrowLeft =
            (Math.min(left + popRect.width, alignRect.width) -
              Math.max(0, left) -
              this.offset) *
              0.5 -
            Math.min(left, 0);
          break;
        default:
          break;
      }

      switch (placement) {
        case "left":
          arrowLeft = popRect.width;
          break;
        case "right":
          arrowLeft = -7;
          break;
        case "top":
          arrowTop = popRect.height;
          break;
        case "bottom":
          arrowTop = -7;
          break;
        default:
          break;
      }
      const arrow = this.$refs.arrow;
      arrow.style.left = arrowLeft + "px";
      arrow.style.top = arrowTop + "px";
      arrow.className = `${this.arrowClass} ${placement}`;
    },
    closeOnMask(evt) {
      if (!this.closable && !this.$refs["popElement"].contains(evt.target)) {
        this.value = false;
      }
    },
    toggle() {
      this.value = !this.value;
    },
    close() {
      this.value = false;
    },
    observeCallback(entities) {
      if (this.value) {
        this.adjustPosition();
      }
    },
    initializeObserve() {
      this.observer = new ResizeObserver(this.observeCallback);
      this.observer.observe(this.$refs["popElement"]);
      this.observer.observe(this.getContainer());
    },
    createReference(h) {
      return h(
        "div",
        {
          key: "poptipReference",
          ref: "alignElement",
          class: combineClassNames(
            "c-popper-reference",
            this.value ? this.activeClass : ""
          ),
          on: { click: this.toggle }
        },
        this.$slots.default
      );
    },
    createMask(h) {
      if (this.value) {
        return h("div", {
          class: "c-popper-mask",
          ref: "maskRef",
          on: { click: this.closeOnMask }
        });
      }
    },
    getReference() {
      return this.$refs.alignElement;
    },
    renderPopover() {
      const vnode = this.$createElement(
        "CPopover",
        {
          props: {
            open: this.value,
            close: this.close,
            getReference: this.getReference
          }
        },
        this.$slots.content
      );
      // this.popover = new vnode.componentOptions.Ctor({
      //   _isComponent: true
      // });

      this.__patch__(this.getMountNode(), vnode);
      this.popover = vnode.componentInstance;
      // vnode.componentInstance = this.popover;
      // this.popover.$mount(this.getMountNode());
      // this.popover.$vnode = vnode;
    },
    renderBody() {
      const h = this.$createElement;

      return h("template", { default: "content" }, [this.$slots.content]);
    },
    createPopup(h) {
      return h(
        "div",
        {
          ref: "popElement",
          class: "c-popper-popup",
          style: { display: this.value ? "" : "none" }
        },
        [
          h(
            "div",
            { class: combineClassNames("c-popper-content", this.contentClass) },
            [
              this.value ? this.$slots.content : undefined,
              this.closable
                ? h("i", {
                    class: "ivu-icon c-popper-close",
                    on: { click: this.close }
                  })
                : undefined
            ]
          ),
          h("i", { ref: "arrow", class: "c-popper-arrow" })
        ]
      );
    },
    // TODO: chengcheng render in body better
    getMountNode() {
      if (!this.mountNode) {
        this.mountNode = document.createElement("div");
        document.body.appendChild(this.mountNode);
      }

      return this.mountNode;
    },
    // createPopup_2(h) {
    //   if (!this.popupInstance) {
    //     this.popupInstance = new this.$options._base({
    //       methods: {
    //         close: this.close,
    //       },
    //       render(h) {
    //         return h('div', [
    //           this.createMask(h),
    //           h(
    //             'div',
    //             {
    //               ref: 'popElement',
    //               class: 'c-popper-popup',
    //               style: { display: this.value ? '' : 'none' },
    //             },
    //             [
    //               h('div', { class: combineClassNames('c-popper-content', this.contentClass) }, [
    //                 this.value ? this.$slots.content : undefined,
    //                 this.closable
    //                   ? h('i', { class: 'ivu-icon c-popper-close', on: { click: this.close } })
    //                   : undefined,
    //               ]),
    //               h('i', { ref: 'arrow', class: 'c-popper-arrow' }),
    //             ]
    //           ),
    //         ]);
    //       },
    //     });
    //     this.this.popupInstance.$mount(this.mountNode);
    //   } else {
    //   }
    // },
    destroyPopup() {
      if (this.popover) {
        this.popover.$destroy();
        this.popover = null;
      }
    }
  },
  mounted() {
    // this.initializeObserve();
  },
  beforeDestroy() {
    // this.observer.disconnect();
    this.destroyPopup();
  },
  watch: {
    value(val) {
      if (!this.popover) {
        this.renderPopover();
      } else {
        const newVnode = cloneVNode(this.popover.$vnode);
        newVnode.componentOptions.propsData.open = val;
        this.popover.$vnode.data.hook.prepatch(this.popover.$vnode, newVnode);
      }
    }
  },
  render(h) {
    return h("div", { class: "c-popper" }, [
      this.createReference(h)
      // this.createMask(h),
      // this.createPopup(h),
    ]);
  }
};
</script>

<style lang="scss">
.c-popper {
  position: relative;
  outline: 0 none;
}

.c-popper-mask {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
}

.c-popper-reference {
  display: inline-block;
}

.c-popper-close {
  position: absolute;
  right: 6px;
  top: 6px;
  font-size: 24px;

  &::before {
    content: "\F178";
  }
}

.c-popper-popup {
  position: absolute;
  z-index: 4;
}

.c-popper-content {
  max-height: 80vh;
  max-width: 80vw;
  padding: 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  overflow: auto;
  border-radius: 4px;
  background: #fff;
}
</style>
