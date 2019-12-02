<script>
import { getWin, getScrollParent } from '@/utils/html';

export default {
  name: 'CPopover',
  props: {
    open: Boolean,
    close: Function,
    getReference: Function,
    edge: 20,
  },
  methods: {
    align() {
      const popoverRect = this.$el.getBoundingClientRect();
      this.$el.style.display = 'none';
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
        ...winSize,
      };
      const layout = {
        top: referenceRect.top - scrollRect.top,
        bottom: scrollRect.bottom - referenceRect.bottom,
        left: referenceRect.left - scrollRect.left,
        right: scrollRect.right - referenceRect.right,
      };
      const winLayout = {
        top: referenceRect.top - winRect.top,
        bottom: winRect.bottom - referenceRect.bottom,
        left: referenceRect.left - scrollRect.left,
        right: winRect.right - referenceRect.right,
      };
      const verticalMin = Math.min(layout.top, layout.bottom);
      const horizontalMin = Math.min(layout.left, layout.right);
      let placement;
      let fitInScroll = false;
      if (layout.left >= popoverRect.width + this.edge && scrollRect.height >= popoverRect.height) {
        placement = 'left';
        fitInScroll = true;
      } else if (
        layout.right >= popoverRect.width + this.edge &&
        scrollRect.height >= popoverRect.height
      ) {
        placement = 'right';
        fitInScroll = true;
      } else if (
        layout.top >= popoverRect.height + this.edge &&
        scrollRect.width >= popoverRect.width + this.edge
      ) {
        placement = 'top';
        fitInScroll = true;
      } else if (
        layout.bottom >= popoverRect.height + this.edge &&
        scrollRect.width >= popoverRect.width + this.edge
      ) {
        placement = 'bottom';
        fitInScroll = true;
      } else {
        if (winRect.left >= popoverRect.width + this.edge && winRect.height >= popoverRect.height) {
          placement = 'left';
        } else if (
          winRect.right >= popoverRect.width + this.edge &&
          winRect.height >= popoverRect.height
        ) {
          placement = 'right';
        } else if (
          winRect.top >= popoverRect.height + this.edge &&
          scrollRect.width >= popoverRect.width + this.edge
        ) {
          placement = 'top';
        } else {
          placement = 'bottom';
        }
      }
      let left;
      let top;
      switch (placement) {
        case 'left':
          left = referenceRect.left - popoverRect.width - 7;
          if (fitInScroll) {
            top = Math.min(
              Math.max(
                referenceRect.top + referenceRect.height * 0.5 - popoverRect.height * 0.5,
                scrollRect.top
              ),
              referenceRect.bottom - 14
            );
          } else {
            top = Math.min(
              Math.max(
                referenceRect.top + referenceRect.height * 0.5 - popoverRect.height * 0.5,
                winRect.top
              ),
              referenceRect.bottom - 14
            );
          }
          break;
        case 'right':
          left = referenceRect.right + 7;
          if (fitInScroll) {
            top = Math.min(
              Math.max(
                referenceRect.top + referenceRect.height * 0.5 - popoverRect.height * 0.5,
                scrollRect.top
              ),
              referenceRect.bottom - 14
            );
          } else {
            top = Math.min(
              Math.max(
                referenceRect.top + referenceRect.height * 0.5 - popoverRect.height * 0.5,
                winRect.top
              ),
              referenceRect.bottom - 14
            );
          }
          break;
        case 'top':
          top = referenceRect.top - popoverRect.height - 7;
          if (fitInScroll) {
              left = 
          } else {
          }
          break;
        case 'bottom':
          break;
        default:
          break;
      }
    },
    handleClick(evt) {
      if (!this.$refs.contentRef.contains(evt.target)) {
        this.close();
      }
    },
  },
  mounted() {
    this.scrollContainer = getScrollParent(this.getReference());
  },
  destroyed() {
    this.$el.parentNode.removeChild(this.$el);
  },
  render(h) {
    return h('div', { class: 'popover-container', style: { display: this.open ? '' : 'none' } }, [
      h('div', { class: 'popover-mask', on: { click: this.handleClick } }),
      h('div', { class: 'popover-content', ref: 'contentRef' }, [
        this.$slots.header,
        this.$slots.default && this.$slots.default[0],
        h('i', { ref: 'arrow', class: 'c-popper-arrow' }),
        this.close
          ? h('i', { class: 'ivu-icon c-popper-close', on: { click: this.close } })
          : undefined,
      ]),
    ]);
  },
};
</script>

<style lang="stylus">
.popover-container
    position absolute
    z-index 1091
    top 0
    left 0
.popover-content
    position relative
    max-height 80vh
    max-width 80vw
    padding 10px
    box-shadow 0 1px 6px rgba(0,0,0,.2)
    overflow auto
    border-radius 4px
    background #fff
.popover-mask
    position fixed
    top 0
    right 0
    left 0
    bottom 0
</style>
