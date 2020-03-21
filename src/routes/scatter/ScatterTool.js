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
    this.context = document.createElement('canvas').getContext('2d');
  }

  configGroup() {
    let layout = this.layout;
    this.groupWidth = (layout.width - layout.left - layout.right) / this.config.limit;
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
      y: Math.floor(i / 3) * this.groupHeight + 0.5 * this.groupHeight,
    };
  }

  getViewBox() {
    return [-this.layout.left, -this.layout.top, this.layout.width, this.layout.height];
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
      index: this.originData.length,
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
          data: item,
        };
      }

      item._node_ = Object.assign(current, {
        index: i,
        x: (i % 3) * this.groupWidth + 0.5 * this.groupWidth,
        y: Math.floor(i / 3) * this.groupHeight + 0.5 * this.groupHeight,
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
              id: _.uniqueId('node'),
            };
          }

          const x = Math.floor(node.x + Math.sin((angle * Math.PI) / 180) * linkWidth);
          const y = Math.floor(node.y - Math.cos((angle * Math.PI) / 180) * linkWidth);

          item._node_ = Object.assign(current, {
            data: children[i],
            level: 1,
            angle: angle,
            x: x,
            y: y,
            parent: node,
            width: Math.ceil(this.mesureText(children[i].name).width),
            index: i,
          });

          return current;
        });

        node.children = nodes2;
        return acc.concat(nodes2);
      }, []);

    const links = nodes2.map(node => ({
      source: node,
      target: node.parent,
      index: node.index,
    }));

    this.nodes = nodes.concat(nodes2);
    this.links = links;

    return [this.nodes, this.links];
  }

  setData(data) {
    this.originData = data;
  }
}
