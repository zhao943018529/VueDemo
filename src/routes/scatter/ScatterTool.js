import * as _ from "lodash";

export default class ScatterTool {
  constructor(setting) {
    this.layout = Object.assign({}, setting.layout);
    this.config = Object.assign({}, setting.config);
    this.init();
  }

  init() {
    this.initContext();
    this.setFont(`${this.config.fontSize}px '${this.config.family}'`);
    this.configGroup();
  }

  initContext() {
    this.context = document.createElement("canvas").getContext("2d");
  }

  configGroup() {
    let layout = this.layout;
    this.groupWidth =
      (layout.width - layout.left - layout.right) / this.config.limit;
    this.groupHeight = layout.height / 2;
  }

  setFont(fontStr) {
    this.context.font = fontStr;
  }

  updateLayout(layout) {
    this.layout = Object.assign(this.layout, layout);
    this.init();
  }

  getPositionByIndex(i) {
    return {
      x: (i % 3) * this.groupWidth + 0.5 * this.groupWidth,
      y: Math.floor(i / 3) * this.groupHeight + 0.5 * this.groupHeight
    };
  }

  getViewBox() {
    return [
      -this.layout.left,
      -this.layout.top,
      this.layout.width,
      this.layout.height
    ];
  }

  normalizeY(y) {
    return (Math.floor(y / this.groupHeight) + 0.5) * this.groupHeight;
  }

  addNode(item, x, y) {
    const node = {
      id: item.id,
      level: 0,
      data: item,
      x: x,
      y: y,
      index: this.originData.length
    };
    item._node_ = node;
    this.originData.push(item);

    return this.resort();
  }

  resort() {
    return this.originData
      .map(item => item._node_)
      .sort((a, b) => {
        const y1 = this.normalizeY(a.y);
        const y2 = this.normalizeY(b.y);
        if (y1 > y2) {
          return 1;
        } else if (y1 < y2) {
          return -1;
        } else {
          if (a.x > b.x) {
            return 1;
          } else if (a.x < b.x) {
            return -1;
          } else {
            return 0;
          }
        }
      })
      .map(item => item.data);
  }

  mesureText(text) {
    return this.context.measureText(text);
  }

  dropHandle(node, touch) {
    // 找出与拖拽节点最近的origin位置
    node.current.x = touch.x;
    node.current.y = touch.y;
    const closest = _.minBy(
      this.nodes,
      item =>
        Math.pow(item.origin.x - node.current.x, 2) +
        Math.pow(item.origin.y - node.current.y, 2)
    );
    // 交换数据位置并返回
    const temp = node.index;
    node.index = closest.index;
    closest.index = temp;
    const sortedNodes = _.sortBy(this.nodes, item => item.index);

    return _.map(sortedNodes, item => item.data);
  }

  // dragData {node,touch:{x,y}}
  dragHandle(node, touch) {
    const others = this.nodes.filter(item => node !== item);
    node.current.x = touch.x;
    node.current.y = touch.y;
    this.clearOverlap(node, others);
  }

  clearOverlap(node, others) {
    const current = node.current;
    const area = node.area;
    const x1 = current.x + area.x1;
    const x2 = current.x + area.x2;
    const y1 = current.y + area.y1;
    const y2 = current.y + area.y2;
    // 计算那些发生重叠的节点并计算出正确的位置
    const effcts = _.filter(others, other => {
      const origin = other.origin;
      const a1 = origin.x + other.area.x1;
      const a2 = origin.x + other.area.x2;
      const xAxis = Math.min(x2, a2) - Math.max(x1, a1);
      const b1 = origin.y + other.area.y1;
      const b2 = origin.y + other.area.y2;
      const yAxis = Math.min(b2, y2) - Math.max(b1, y1);

      if (xAxis > 0 && yAxis > 0) {
        if (xAxis < yAxis) {
          if (other.origin.x < node.current.x) {
            other.current.x = other.origin.x + xAxis;
          } else {
            other.current.x = other.origin.x + xAxis;
          }
        } else {
          if (other.origin.y < node.current.y) {
            other.current.y = other.origin.y - yAxis;
          } else {
            other.current.y = other.origin.y + yAxis;
          }
        }

        return true;
      } else {
        return false;
      }
    });

    const newOthers = _.difference(others, effcts);
    _.each(effcts, item => this.clearOverlap(item, newOthers));
  }

  build_fit(data) {
    const nodes = _.map(data, (item, i) => {
      let current = null;
      if (item._node_) {
        current = item._node_;
      } else {
        current = {
          id: item.id,
          level: 0,
          data: item
        };
      }
      const x = (i % 3) * this.groupWidth + 0.5 * this.groupWidth;
      const y = Math.floor(i / 3) * this.groupHeight + 0.5 * this.groupHeight;
      item._node_ = Object.assign(current, {
        index: i,
        origin: {
          x: x,
          y: y
        },
        current: {
          x: x,
          y: y
        }
      });

      return current;
    });

    const linkWidth = this.config.linkConfig.width;

    const leaves = _.reduce(
      data,
      (a, b) => {
        const children = b.children;
        const node = b._node_;
        const angles = [];
        let n = children.length;
        let startAngle = 90;
        const avg = Math.floor(360 / n);
        do {
          angles.push(startAngle);
          startAngle = (startAngle + avg) % 360;
        } while (--n > 0);
        const _children = _.map(angles, (angle, index) => {
          const child = children[index];
          let current = null;
          // eslint-disable-next-line eqeqeq
          if (child._node_ != null) {
            current = child._node_;
          } else {
            current = {
              id: _.uniqueId("node")
            };
          }

          // 计算每个叶子节点的相对位置
          const x = Math.floor(Math.sin((angle * Math.PI) / 180) * linkWidth);
          const y = -Math.cos((angle * Math.PI) / 180) * linkWidth;
          const textWidth = Math.ceil(this.mesureText(child.name || " ").width);
          const width = textWidth + child.layout.left + child.layout.right;
          const height = child.layout.height;
          let blockX;
          let blockY;
          if (angle < 90) {
            blockX = x;
            blockY = y - height;
          } else if (angle < 180) {
            blockX = x;
            blockY = y;
          } else if (angle < 270) {
            blockX = x - width;
            blockY = y;
          } else {
            blockX = x - width;
            blockY = y - height;
          }
          child._node_ = Object.assign(current, {
            data: child,
            level: 1,
            angle: angle,
            // 相对位置
            area: {
              x: blockX,
              y: blockY,
              width,
              height
            },
            // 绝对位置 用于画Link线条
            x: x,
            y: y,
            parent: node,
            index: index
          });

          return current;
        });

        node.children = _children;

        return a.concat(_children);
      },
      []
    );
    // 计算每棵树的四个方向的值
    _.each(nodes, (node, i) => {
      // 计算x1的最小值
      const x1 = _.minBy(node.children, child => child.area.x).area.x;
      // 计算x2的最大值
      const child = _.maxBy(
        node.children,
        child => child.area.x + child.area.width
      );
      const x2 = child.area.x + child.area.width;
      // 计算y1的最小值
      const y1 = _.minBy(node.children, child => child.area.y).area.y;
      // 计算y2的最大值
      const child1 = _.maxBy(
        node.children,
        child => child.area.y + child.area.height
      );
      const y2 = child1.area.y + child.area.height;

      node.area = {
        x1: Math.min(0, x1),
        x2: Math.max(0, x2),
        y1: Math.min(0, y1),
        y2: Math.max(0, y2)
      };
    });

    // 调整可能存在长文本的树造成overlap
    _.reduce(
      nodes,
      (a, b) => {
        if (b.index % this.config.limit !== 0) {
          const dl = Math.abs(b.area.x1) - this.groupWidth / 2;
          if (dl > 0) {
            a += dl;
          }
          b.origin.x += a;
          b.current.x += a;
        }
        const dr = Math.abs(b.area.x2) - this.groupWidth / 2;
        if (dr > 0) {
          a += dr;
        }

        return a;
      },
      0
    );

    const links = leaves.map(node => ({
      source: node,
      target: node.parent,
      index: node.index
    }));

    this.nodes = nodes;
    this.links = links;

    return [this.nodes, this.links];
  }

  build(dragData) {
    if (dragData !== null && dragData !== undefined) {
      this.originData = this.resort();
    }

    const nodes = this.originData.map((item, i) => {
      let current = null;
      if (item._node_) {
        current = item._node_;
      } else {
        current = {
          id: item.id,
          level: 0,
          data: item
        };
      }

      item._node_ = Object.assign(current, {
        index: i,
        x: (i % 3) * this.groupWidth + 0.5 * this.groupWidth,
        y: Math.floor(i / 3) * this.groupHeight + 0.5 * this.groupHeight
      });

      return current;
    });
    if (dragData) {
      const found = _.find(nodes, item => item.id === dragData.id);
      if (found) {
        found.x = dragData.touch.x;
        found.y = dragData.touch.y;
      }
    }

    const linkWidth = this.config.linkConfig.width;

    const nodes2 = nodes
      .filter(node => node.data.children && node.data.children.length > 0)
      .reduce((acc, node) => {
        const children = node.data.children;
        const angles = [];
        let n = children.length;
        let startAngle = 90;
        const avg = Math.floor(360 / n);
        do {
          angles.push(startAngle);
          startAngle = (startAngle + avg) % 360;
        } while (--n > 0);

        const nodes2 = angles.map((angle, i) => {
          const item = children[i];
          let current = null;
          // eslint-disable-next-line eqeqeq
          if (item._node_ != null) {
            current = item._node_;
          } else {
            current = {
              id: _.uniqueId("node")
            };
          }

          const x = Math.floor(
            node.x + Math.sin((angle * Math.PI) / 180) * linkWidth
          );
          const y = Math.floor(
            node.y - Math.cos((angle * Math.PI) / 180) * linkWidth
          );

          item._node_ = Object.assign(current, {
            data: children[i],
            level: 1,
            angle: angle,
            x: x,
            y: y,
            parent: node,
            width: Math.ceil(this.mesureText(children[i].name).width),
            index: i
          });

          return current;
        });

        node.children = nodes2;
        return acc.concat(nodes2);
      }, []);

    const links = nodes2.map(node => ({
      source: node,
      target: node.parent,
      index: node.index
    }));

    this.nodes = nodes.concat(nodes2);
    this.links = links;

    return [this.nodes, this.links];
  }

  setData(data) {
    this.originData = data;
  }
}
