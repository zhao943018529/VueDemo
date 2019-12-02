<script>
import { getWin, getScrollParent } from "./util.js";

export default {
  name: "CPopover",
  props: {
    open: Boolean,
    close: Function,
    getReference: Function
  },
  data() {
    return {
      edge: 20
    };
  },
  methods: {
    align() {
      const popoverRect = this.$el.getBoundingClientRect();
      this.$el.style.display = "none";
      const reference = this.getReference();
      const referenceRect = reference.getBoundingClientRect();
      const scrollRect = this.scrollContainer.getBoundingClientRect();
      const winSize = getWin();
      const winOffset = { x: window.pageXOffset, y: window.pageYOffset };
      const winRect = {
        left: winOffset.x,
        right: winOffset.x + winSize.width,
        top: winOffset.y,
        bottom: winOffset.y + winSize.height,
        ...winSize
      };
      const layout = {
        top: referenceRect.top - scrollRect.top,
        bottom: scrollRect.bottom - referenceRect.bottom,
        left: referenceRect.left - scrollRect.left,
        right: scrollRect.right - referenceRect.right
      };
      const winLayout = {
        top: referenceRect.top - winRect.top,
        bottom: winRect.bottom - referenceRect.bottom,
        left: referenceRect.left - scrollRect.left,
        right: winRect.right - referenceRect.right
      };
      const verticalMin = Math.min(layout.top, layout.bottom);
      const horizontalMin = Math.min(layout.left, layout.right);
      let placement;
      let fitInScroll = false;
      if (
        layout.left >= popoverRect.width + this.edge &&
        scrollRect.height >= popoverRect.height
      ) {
        placement = "left";
        fitInScroll = true;
      } else if (
        layout.right >= popoverRect.width + this.edge &&
        scrollRect.height >= popoverRect.height
      ) {
        placement = "right";
        fitInScroll = true;
      } else if (
        layout.top >= popoverRect.height + this.edge &&
        scrollRect.width >= popoverRect.width + this.edge
      ) {
        placement = "top";
        fitInScroll = true;
      } else if (
        layout.bottom >= popoverRect.height + this.edge &&
        scrollRect.width >= popoverRect.width + this.edge
      ) {
        placement = "bottom";
        fitInScroll = true;
      } else {
        if (
          referenceRect.left - winRect.left >= popoverRect.width + this.edge &&
          winRect.height >= popoverRect.height
        ) {
          placement = "left";
        } else if (
          winRect.right - referenceRect.right >=
            popoverRect.width + this.edge &&
          winRect.height >= popoverRect.height
        ) {
          placement = "right";
        } else if (
          referenceRect.top - winRect.top >= popoverRect.height + this.edge &&
          scrollRect.width >= popoverRect.width + this.edge
        ) {
          placement = "top";
        } else {
          placement = "bottom";
        }
      }
      let left;
      let top;
      switch (placement) {
        case "left":
          left = referenceRect.left - popoverRect.width - 7;
          if (fitInScroll) {
            top = Math.min(
              Math.max(
                referenceRect.top +
                  referenceRect.height * 0.5 -
                  popoverRect.height * 0.5,
                scrollRect.top
              ),
              referenceRect.top + referenceRect.height * 0.5
            );
          } else {
            top = Math.min(
              Math.max(
                referenceRect.top +
                  referenceRect.height * 0.5 -
                  popoverRect.height * 0.5,
                winRect.top
              ),
              referenceRect.top + referenceRect.height * 0.5
            );
          }
          break;
        case "right":
          left = referenceRect.right + 7;
          if (fitInScroll) {
            top = Math.min(
              Math.max(
                referenceRect.top +
                  referenceRect.height * 0.5 -
                  popoverRect.height * 0.5,
                scrollRect.top
              ),
              referenceRect.top + referenceRect.height * 0.5
            );
          } else {
            top = Math.min(
              Math.max(
                referenceRect.top +
                  referenceRect.height * 0.5 -
                  popoverRect.height * 0.5,
                winRect.top
              ),
              referenceRect.top + referenceRect.height * 0.5
            );
          }
          break;
        case "top":
          top = referenceRect.top - popoverRect.height - 7;
          if (fitInScroll) {
            left = Math.min(
              Math.max(
                referenceRect.left +
                  referenceRect.width * 0.5 -
                  popoverRect.width * 0.5,
                scrollRect.left + this.edge
              ),
              referenceRect.left + referenceRect.width * 0.5
            );
          } else {
            left = Math.min(
              Math.max(
                winRect.left + this.edge,
                referenceRect.left +
                  referenceRect.width * 0.5 -
                  popoverRect.width * 0.5
              ),
              referenceRect.left + referenceRect.width * 0.5
            );
          }
          break;
        case "bottom":
          top = referenceRect.bottom + 7;
          if (fitInScroll) {
            left = Math.min(
              Math.max(
                referenceRect.left +
                  referenceRect.width * 0.5 -
                  popoverRect.width * 0.5,
                scrollRect.left + this.edge
              ),
              referenceRect.left + referenceRect.width * 0.5
            );
          } else {
            left = Math.min(
              Math.max(
                winRect.left + this.edge,
                referenceRect.left +
                  referenceRect.width * 0.5 -
                  popoverRect.width * 0.5
              ),
              referenceRect.left + referenceRect.width * 0.5
            );
          }
          break;
        default:
          break;
      }

      let arrowLeft;
      let arrowTop;
      switch (placement) {
        case "left":
          arrowTop =
            (Math.min(top + popoverRect.height, referenceRect.bottom) -
              Math.max(top, referenceRect.top)) *
              0.5 +
            Math.max(referenceRect.top - top, 0) -
            7;
          arrowLeft = popoverRect.width;
          break;
        case "right":
          arrowTop =
            (Math.min(top + popoverRect.height, referenceRect.bottom) -
              Math.max(top, referenceRect.top)) *
              0.5 +
            Math.max(referenceRect.top - top, 0) -
            7;
          arrowLeft = -7;
          break;
        case "top":
          arrowLeft =
            Math.min(left + popoverRect.width, referenceRect.right) -
            Math.max(left, referenceRect.left) * 0.5 +
            Math.max(referenceRect.left - left) -
            7;
          arrowTop = popoverRect.height;
          break;
        case "bottom":
          arrowLeft =
            Math.min(left + popoverRect.width, referenceRect.right) -
            Math.max(left, referenceRect.left) * 0.5 +
            Math.max(referenceRect.left - left, 0) -
            7;
          arrowTop = -7;
          break;
        default:
          break;
      }
      this.$refs.arrow.style.left = arrowLeft + "px";
      this.$refs.arrow.style.top = arrowTop + "px";
      this.$refs.arrow.classList.add(placement);
      this.$el.style.left = left + "px";
      this.$el.style.top = top + "px";
      this.$el.style.display = "";
    },
    handleClick(evt) {
      if (!this.$refs.contentRef.contains(evt.target)) {
        this.close();
      }
    }
  },
  watch: {
    open(val) {
      if (val) {
        this.$nextTick(() => this.align());
      }
    }
  },
  mounted() {
    this.scrollContainer = getScrollParent(this.getReference());
    this.align();
  },
  destroyed() {
    this.$el.parentNode.removeChild(this.$el);
  },
  render(h) {
    return h(
      "div",
      {
        class: "popover-container",
        style: { display: this.open ? "" : "none" }
      },
      [
        h("div", { class: "popover-mask", on: { click: this.handleClick } }),
        h("div", { class: "popover-content", ref: "contentRef" }, [
          this.$slots.header,
          this.$slots.default && this.$slots.default[0],
          h("i", { ref: "arrow", class: "popover-arrow" }),
          this.close
            ? h("i", {
                class: "ivu-icon c-popper-close",
                on: { click: this.close }
              })
            : undefined
        ])
      ]
    );
  }
};
</script>

<style lang="scss">
.popover-container {
  position: absolute;
  z-index: 1091;
  top: 0;
  left: 0;
}
.popover-content {
  position: relative;
  max-height: 80vh;
  max-width: 80vw;
  padding: 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
  overflow: auto;
  border-radius: 4px;
  background: #fff;
}
.popover-mask {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
}

.popover-arrow {
  position: absolute;
  border-color: transparent;
  border-width: 7px;
  border-style: solid;

  &::after {
    border-width: 7px;
    position: absolute;
    border-style: solid;
    border-color: transparent;
  }

  &.left {
    border-right-width: 0px;
    border-left-color: hsla(0, 0%, 85%, 0.5);

    &::after {
      content: " ";
      bottom: -7px;
      border-right-width: 0;
      border-left-color: #fff;
      left: -8px;
    }
  }

  &.right {
    border-right-color: hsla(0, 0%, 85%, 0.5);
    border-left-width: 0px;

    &::after {
      content: " ";
      bottom: -7px;
      left: 1px;
      border-left-width: 0;
      border-right-color: #fff;
    }
  }

  &.top {
    border-bottom-width: 0px;
    border-top-color: hsla(0, 0%, 85%, 0.5);

    &::after {
      content: " ";
      top: -8px;
      left: -7px;
      border-bottom-width: 0;
      border-top-color: #fff;
    }
  }

  &.bottom {
    border-top-width: 0px;
    border-bottom-color: hsla(0, 0%, 85%, 0.5);

    &::after {
      content: " ";
      left: -7px;
      top: 1px;
      border-top-width: 0;
      border-bottom-color: #fff;
    }
  }
}
</style>
