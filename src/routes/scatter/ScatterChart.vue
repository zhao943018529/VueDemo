<template>
  <div
    class="scatter-container"
    @dragenter="handleDragEnter"
    @dragover="handleDragOver"
    @drop="handleDrop"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="scatter" ref="svg"></svg>
    <EventDetail :show="detailStatus" :closeDialog="collapseDetailDialog" />
  </div>
</template>

<script>
import * as d3 from "d3";
import * as _ from "lodash";
import ScatterTool from "./ScatterTool";
import EventDetail from "./event-detail.vue";

export default {
  name: "ScatterChart",
  components: {
    EventDetail
  },
  data() {
    return {
      detailStatus: false,
      selectId: null,
      duration: 250,
      delay: 150,
      assets: [
        {
          id: 11,
          name: "aaa",
          type: 0,

          alarmLevel: 0,
          color: "green",
          children: [
            {
              id: 111,
              name: "Defense Access",
              direction: 0,
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 112,
              name: "Network connection",
              direction: 0,
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 113,
              name: "Promote Access",
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 114,
              name: "Accesssibility Features",
              direction: 0,
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 115,
              name: "Accesssibility Features",
              direction: 0,
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 116,
              name: "Data from Local System",
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 117,
              name: "Data from Local System",
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 119,
              name: "Data from Local System",
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 120,
              name: "Password Policy Discovery",
              layout: { left: 8, right: 8, height: 40 }
            }
          ]
        },
        {
          id: 22,
          name: "bbb",
          type: 1,
          color: "#4BD314",
          children: [
            {
              id: 221,
              name: "bbb1",
              layout: { left: 8, right: 8, height: 40 }
            },
            { id: 222, name: "bbb2", layout: { left: 8, right: 8, height: 40 } }
          ]
        },
        {
          id: 33,
          name: "ccc",
          color: "#FF2424",
          alarmLevel: 0,
          children: [
            {
              id: 331,
              name: "Data from Local System",
              direction: 1,
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 332,
              name: "Data from Local System",
              direction: 1,
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 333,
              name: "Data from Local System",
              direction: 0,
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 334,
              name: "Data from Local System",
              direction: 0,
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 335,
              name: "192.168.134.222",
              time: "08:14:12",
              type: 1,
              layout: { left: 8, right: 8, height: 24 }
            }
          ]
        },
        {
          id: 44,
          name: "ddd",
          type: 1,
          alarmLevel: 1,
          color: "#4BD314",
          children: [
            {
              id: 441,
              name: "Browser Extensions",
              direction: 0,
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 442,
              name: "61.2.34.19",
              direction: 0,
              type: 1,
              time: "10:34:12",
              layout: { left: 8, right: 8, height: 24 }
            },
            {
              id: 443,
              name: "102.123.4.0",
              direction: 1,
              type: 1,
              time: "12:34:12",
              layout: { left: 8, right: 8, height: 24 }
            },
            {
              id: 444,
              name: "Data from Local System",
              direction: 0,
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 445,
              name: "123.14.36.111",
              direction: 1,
              type: 1,
              layout: { left: 8, right: 8, height: 24 }
            },
            {
              id: 446,
              name: "ddd6",
              direction: 1,
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 447,
              name: "Browser Extensions",
              direction: 0,
              layout: { left: 8, right: 8, height: 40 }
            }
          ]
        },
        {
          id: 55,
          name: "fff",
          type: 0,
          alarmLevel: 1,
          color: "#FF2424",
          children: [
            {
              id: 551,
              name: "Password Policy Discovery",
              direction: 0,
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 552,
              name: "128.189.1.143",
              direction: 1,
              type: 1,
              time: "16:14:13",
              layout: { left: 8, right: 8, height: 24 }
            },
            {
              id: 553,
              name: "Accesssibility Features",
              direction: 0,
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 554,
              name: "CMSTP",
              direction: 1,
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 555,
              name: "BITS Jobs",
              direction: 0,
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 556,
              name: "Exploitation for Credential Access",
              direction: 0,
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 557,
              name: "Network Sniffing",
              direction: 1,
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 558,
              name: "Data from Local System",
              direction: 1,
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 559,
              name: "Network Sniffing",
              direction: 1,
              layout: { left: 8, right: 8, height: 40 }
            },
            {
              id: 560,
              name: "Data from Local System",
              direction: 1,
              layout: { left: 8, right: 8, height: 40 }
            }
          ]
        }
      ]
    };
  },
  mounted() {
    this.initialize();
  },
  methods: {
    createLeafBg(d, height, skewWidth, edge, delta) {
      const area = d.area;

      return `M${0},${0} L${area.width},${0} L${area.width},${
        area.height
      } L${0},${area.height} L${0},${0}`;
    },
    createLeafRegularBg(width, height, edge) {
      return `M0,0 L0,${edge} M${0},${height -
        edge} L0,${height} L${edge},${height} M${width -
        edge},${height} L${width},${height} L${width},${height -
        edge} M${width},${edge} L${width},0 L${width - edge},0 M${edge},0 L0,0`;
    },
    getPosition(d) {
      let width;
      let height;
      if (d.data.type === 1) {
        width = d.width + 6 * 2 + 26 + 4;

        height = 24;
      } else {
        width = d.width + (8 + 4) * 2;
        height = 40;
      }
      let x;
      let y;
      if (d.angle < 90) {
        x = d.x;
        y = d.y - height;
      } else if (d.angle < 180) {
        x = d.x;
        y = d.y;
      } else if (d.angle < 270) {
        x = d.x - width;
        y = d.y;
      } else {
        x = d.x - width;
        y = d.y - height;
      }

      return [x, y];
    },
    getContainerRect() {
      return [this.$el.offsetWidth, this.$el.offsetHeight];
    },
    dragging(d) {
      const event = d3.event;
      const touch = {
        x: event.x,
        y: event.y
      };
      this.dragUpdate(d, touch);
    },
    dragEnd(d) {
      const x = d3.event.x;
      const y = d3.event.y;
      // d.x = x;
      // d.y = y;
      if (this.selectId == null) {
        this.assets = this.chartHelper.dropHandle(d, {
          x: x,
          y: y
        });
      }
    },
    prepare() {
      // 获取当前容器的大小(width, height)
      let rectArr = this.getContainerRect();
      // 构建tool实例
      this.chartHelper = new ScatterTool({
        layout: {
          width: rectArr[0],
          height: rectArr[1] * 0.9,
          left: 40,
          right: 40,
          top: 0,
          bottom: 0
        },
        config: {
          family: "Segoe UI",
          fontSize: 16,
          limit: 3,
          linkConfig: {
            width: 120
          }
        }
      });
      // 创建defs里的内容
      this.root = d3
        .select("svg.scatter")
        .attr("viewBox", this.chartHelper.getViewBox());
      const defsContainer = this.root.append("defs");
      this.createMarkers(defsContainer);
      this.createSymbol(defsContainer);

      // 创建根group 用来做缩放和拖动画布
      this.rootGroup = this.root
        .append("g")
        .attr("class", "root-group")
        .attr("font-family", '"Segoe UI"')
        .attr("font-size", 16);
      // 创建Link，Node容器
      this.linkContainer = this.rootGroup
        .append("g")
        .attr("class", "links")
        .attr("font-size", 14);
      this.nodeContainer = this.rootGroup.append("g").attr("class", "nodes");

      // 初始化拖拽
      this.dragControl = d3
        .drag()
        .clickDistance(5)
        // .on(
        //   'start',
        //   this.selectId == null
        //     ? function() {
        //         d3.select(this).raise();
        //       }
        //     : null
        // )
        .on("drag", this.dragging)
        .on("end", this.dragEnd);
      //初始化zoom
      this.zoomControl = d3
        .zoom()
        .scaleExtent([0.6, 1.4])
        .on("zoom", () => {
          const transform = d3.event.transform;
          this.rootGroup.attr(
            "transform",
            `translate(${transform.x},${transform.y}) scale(${transform.k})`
          );
        });
      this.root.call(this.zoomControl).on("dblclick.zoom", null);
      // 初始化移动动画
      this.moveTransition = d3
        .transition()
        .duration(this.duration)
        .ease(d3.easeLinear);
      this.enterTransition = d3
        .transition()
        .duration(this.delay)
        .ease(d3.easeLinear);
    },
    createMarkers(container) {
      const types = [
        ["red", "#FF4D4D"],
        ["blue", "#3BA1FF"],
        ["orange", "#F79A07"]
      ];
      container
        .selectAll("marker.scatter-in")
        .data(types)
        .join("marker")
        .attr("class", "scatter-in")
        .attr("id", d => `scatter-in-${d[0]}`)
        .attr("markerHeight", 10)
        .attr("markerWidth", 10)
        .attr("refX", 10)
        .attr("refY", -0.5)
        .attr("orient", "auto")
        .attr("viewBox", "0 -5 10 10")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", d => d[1]);

      container
        .selectAll("marker.scatter-out")
        .data(types)
        .join("marker")
        .attr("class", "scatter-out")
        .attr("id", d => `scatter-out-${d[0]}`)
        .attr("markerHeight", 10)
        .attr("markerWidth", 10)
        .attr("refX", 25)
        .attr("refY", -0.5)
        .attr("orient", "auto")
        .attr("viewBox", "0 -5 10 10")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", d => d[1]);
    },
    createSymbol(container) {
      container
        .append("symbol")
        .attr("id", "scatter-cloud")
        .append("path")
        .attr(
          "d",
          "M5,16 C2.23857625,16 0,13.7614237 0,11 C0,8.23857625 2.23857625,6 5,6 C7.76142375,6 10,8.23857625 10,11 C10,11.5522847 10.4477153,12 11,12 C11.5522847,12 12,11.5522847 12,11 C12,8.00641961 10.120858,5.45173634 7.47780847,4.45118463 C8.50780481,1.812392 11.0725467,0 14,0 C17.8659932,0 21,3.13400675 21,7 C21,7.55228475 21.4477153,8 22,8 C24.209139,8 26,9.790861 26,12 C26,14.209139 24.209139,16 22,16 L5,16 Z"
        );
      const scatterServer = container
        .append("symbol")
        .attr("id", "scatter-server")
        .attr("viewBox", "0 0 30 30");
      scatterServer
        .append("circle")
        .attr("r", 15)
        .attr("cx", 15)
        .attr("cy", 15);
      scatterServer
        .append("path")
        .attr("fill", "#FFFFFF")
        .attr("fill-rule", "nonzero")
        .attr(
          "d",
          "M9,5 L21,5 C21.5522847,5 22,5.44771525 22,6 L22,24 C22,24.5522847 21.5522847,25 21,25 L9,25 C8.44771525,25 8,24.5522847 8,24 L8,6 C8,5.44771525 8.44771525,5 9,5 Z M10,7 L10,9 L20,9 L20,7 L10,7 Z M10,10 L10,11 L20,11 L20,10 L10,10 Z M10,12 L10,13 L20,13 L20,12 L10,12 Z M15,22.97702 C15.8284271,22.97702 16.5,22.3054472 16.5,21.47702 C16.5,20.6485929 15.8284271,19.97702 15,19.97702 C14.1715729,19.97702 13.5,20.6485929 13.5,21.47702 C13.5,22.3054472 14.1715729,22.97702 15,22.97702 Z M15,17 C15.2761424,17 15.5,16.7761424 15.5,16.5 C15.5,16.2238576 15.2761424,16 15,16 C14.7238576,16 14.5,16.2238576 14.5,16.5 C14.5,16.7761424 14.7238576,17 15,17 Z M15,19 C15.2761424,19 15.5,18.7761424 15.5,18.5 C15.5,18.2238576 15.2761424,18 15,18 C14.7238576,18 14.5,18.2238576 14.5,18.5 C14.5,18.7761424 14.7238576,19 15,19 Z"
        );
      const scatterEnd = container
        .append("symbol")
        .attr("id", "scatter-end")
        .attr("viewBox", "0 0 30 30");
      scatterEnd
        .append("circle")
        .attr("r", 15)
        .attr("cx", 15)
        .attr("cy", 15);
      scatterEnd
        .append("path")
        .attr("fill", "#FFFFFF")
        .attr("fill-rule", "nonzero")
        .attr(
          "d",
          "M14,22 L14,20 L7,20 C6.44771525,20 6,19.5522847 6,19 L6,9 C6,8.44771525 6.44771525,8 7,8 L23,8 C23.5522847,8 24,8.44771525 24,9 L24,19 C24,19.5522847 23.5522847,20 23,20 L16,20 L16,22 L20,22 L20,24 L10,24 L10,22 L14,22 Z M13,12 L13,13 L18,13 L18,12 L13,12 Z M9,12 L9,13 L11,13 L11,12 L9,12 Z M9,15 L9,16 L11,16 L11,15 L9,15 Z M13,15 L13,16 L21,16 L21,15 L13,15 Z"
        );
    },
    initialize() {
      // 执行prepare
      this.prepare();
      this.render();
    },
    renderLinks(links) {
      let moveTransition = d3
        .transition()
        .duration(this.duration)
        .ease(d3.easeLinear);
      this.linkContainer
        .selectAll("path.link")
        .data(links, d => `${d.source.id}-${d.target.id}`)
        .join(
          enter =>
            enter
              .append("path")
              .attr("class", "link")
              .attr("marker-end", d => {
                const data = d.source.data;
                switch (d.source.data.direction) {
                  case 0:
                    return `url(#scatter-out-${
                      data.type === 1 ? "blue" : "orange"
                    })`;
                  case 1:
                    return `url(#scatter-in-${
                      data.type === 1 ? "blue" : "orange"
                    })`;
                  default:
                    return null;
                }
              })
              .attr("stroke", d =>
                d.source.data.type === 1 ? "#3BA1FF" : "#F79A07"
              )
              .call(enter =>
                enter
                  .transition(this.enterTransition)
                  .delay(d => d.index * this.delay)
                  .attr("d", d => {
                    const a = d.target.current;
                    if (d.source.data.direction === 1) {
                      return `M${a.x},${a.y} L${d.source.x + a.x},${d.source.y +
                        a.y}`;
                    } else {
                      return `M${d.source.x + a.x},${d.source.y + a.y} L${
                        a.x
                      },${a.y}`;
                    }
                  })
              ),
          update =>
            update.transition(moveTransition).attr("d", d => {
              const a = d.target.current;
              if (d.source.data.direction === 1) {
                return `M${a.x},${a.y} L${d.source.x + a.x},${d.source.y +
                  a.y}`;
              } else {
                return `M${d.source.x + a.x},${d.source.y + a.y} L${a.x},${
                  a.y
                }`;
              }
            }),
          exit => exit.remove()
        );
    },
    renderNodes(nodes) {
      let moveTransition = d3
        .transition()
        .duration(this.duration)
        .ease(d3.easeLinear);
      const nodeList = this.nodeContainer
        .selectAll("g.tree")
        .data(nodes, d => d.id)
        .join(
          enter => {
            const enterG = enter
              .append("g")
              .attr("class", "tree")
              .attr("transform", "translate(0,0)");
            enterG
              .append("use")
              .attr("cursor", "grab")
              .attr("x", -15)
              .attr("y", -15)
              .attr("width", 30)
              .attr("height", 30)
              .attr("href", d =>
                d.data.type === 0 ? "#scatter-server" : "#scatter-end"
              )
              .attr("fill", d =>
                d.data.alarmLevel > 0 ? "#FF2424" : "#FF7615"
              );

            enterG
              .on("dblclick", this.expandDetailDialog)
              .call(this.dragControl);
            enterG
              .transition(moveTransition)
              .attr(
                "transform",
                d => `translate(${d.current.x},${d.current.y})`
              );

            return enterG;
          },
          update => {
            return update
              .transition(moveTransition)
              .attr(
                "transform",
                d => `translate(${d.current.x},${d.current.y})`
              );
          }
        );
    },
    renderChildren(nodes) {
      const leafGroup = this.nodeContainer
        .selectAll("g.leaves")
        .data(nodes, d => `leaves-${d.id}`)
        .join(
          enter => enter.append("g").attr("class", "leaves"),
          update => update,
          exit => exit.remove()
        )
        .attr("transform", d => `translate(${d.current.x},${d.current.y})`);
      leafGroup
        .selectAll("g.leaf")
        .data(
          d => d.children,
          d => `leaf-${d.id}`
        )
        .join(
          enter => {
            const leafNode = enter.append("g").attr("class", "leaf");
            const largeEnter = leafNode.filter(d => d.data.type !== 1);
            largeEnter
              .append("path")
              .attr("fill", "none")
              .attr("stroke", "#F79A07")
              .attr("d", d => this.createLeafBg(d, 40, 10, 12));
            // largeEnter
            //   .append("path")
            //   .attr("fill", "#6b460d")
            //   .attr("d", d => this.createLeafBg(d, 32, 8, 8, { x: 4, y: 4 }));
            const smallG = leafNode.filter(d => d.data.type === 1);
            smallG
              .append("rect")
              .attr("fill", "rgba(0,71,108,0.41)")
              .attr("width", d => d.area.width)
              .attr("height", d => d.area.height);
            // smallG
            //   .append("path")
            //   .attr("stroke", "#3BA1FF")
            //   .attr("fill", "none")
            //   .attr("d", d =>
            //     this.createLeafRegularBg(d.width + 6 * 2 + 26 + 4, 24, 6)
            //   );
            smallG
              .append("use")
              .attr("x", 4)
              .attr("y", 4)
              .attr("href", "#scatter-cloud")
              .attr("fill", " #3BA1FF");
            // enterG
            //   .append("text")
            //   .attr("dy", d => (d.data.type !== 1 ? 26 : 18))
            //   .attr("dx", d => (d.data.type !== 1 ? 12 : 36))
            //   .attr("fill", "#FFFFFF")
            //   .text(d => d.data.name);
            // enterG.attr(
            //   "transform",
            //   d => `translate(${d.area.x},${d.area.y})`
            // );

            // enterG
            //   .attr("opacity", 0)
            //   .transition(this.enterTransition)
            //   .delay(d => d.index * this.delay)
            //   .attr("opacity", 1);
            return leafNode;
          },
          update => update
        )
        .attr("transform", d => `translate(${d.area.x},${d.area.y})`);
    },
    render() {
      let renderAssets;
      if (this.selectId != null) {
        renderAssets = _.filter(this.assets, item => item.id === this.selectId);
      } else {
        renderAssets = this.assets;
      }
      // 更新drag
      // this.dragControl.on('drag', this.dragging).on('end', this.dragEnd);
      const [nodes, links] = this.chartHelper.build_fit(renderAssets);
      this.renderLinks(links);
      this.renderChildren(nodes);
      this.renderNodes(nodes);
    },
    dragUpdate(node, touch) {
      this.chartHelper.dragHandle(node, touch);
      const transition = d3
        .transition()
        .duration(150)
        .ease(d3.easeLinear);
      // 更新link位置
      this.linkContainer
        .selectAll("path.link")
        .transition(transition)
        .attr("d", d => {
          const current = d.target.current;
          const source = d.source;
          if (d.source.data.direction === 1) {
            return `M${current.x},${current.y} L${source.x +
              current.x},${source.y + current.y}`;
          } else {
            return `M${source.x + current.x},${source.y + current.y} L${
              current.x
            },${current.y}`;
          }
        });

      // 更新link文本位置
      // this.linkContainer
      //   .selectAll("text.time")
      //   .text(d => d.source.data.time)
      //   .transition(transition)
      //   .attr(
      //     "transform",
      //     d =>
      //       `translate(${(d.source.x + d.target.x) / 2},${(d.source.y +
      //         d.target.y) /
      //         2}) rotate(${
      //         d.source.angle > 180 ? d.source.angle - 270 : d.source.angle - 90
      //       }) translate(${-27},0)`
      //   );

      // 更新主机结点
      this.nodeContainer
        .selectAll("g.tree")
        .transition(transition)
        .attr("transform", d => `translate(${d.current.x},${d.current.y})`);

      // 更新叶子结点
      this.nodeContainer
        .selectAll("g.leaves")
        .attr("opacity", 1)
        .transition(transition)
        .attr("transform", d => {
          return `translate(${d.current.x},${d.current.y})`;
        });
    },
    expandDetailDialog(d) {
      if (d3.event.defaultPrevented) return;
      this.selectId = d.id;
      this.detailStatus = true;
      const rect = this.chartHelper.getPositionByIndex(0);
      const viewBox = this.chartHelper.getViewBox();
      const scale = 1.4;
      const x = viewBox[2] / 2 + viewBox[0] - rect.x;
      const y = viewBox[3] / 2 + viewBox[1] - rect.y;
      this.zoomControl.transform(
        this.root,
        d3.zoomIdentity.translate(x, y).scale(scale)
      );
    },
    collapseDetailDialog() {
      this.detailStatus = false;
      this.selectId = null;
      this.zoomControl.transform(
        this.root,
        d3.zoomIdentity.translate(0, 0).scale(1)
      );
    },
    handleDragOver(evt) {
      evt.preventDefault();
      return false;
    },
    handleDragEnter(evt) {
      evt.preventDefault();
      return true;
    },
    handleDrop(evt) {
      const dataStr = evt.dataTransfer.getData("Text");
      if (dataStr) {
        const item = JSON.parse(dataStr);
        const rect = evt.target.getBoundingClientRect();
        const viewBox = this.chartHelper.getViewBox();
        const transform = d3.zoomTransform(this.rootGroup.node());
        const x =
          (evt.clientX - (rect.left + transform.x - viewBox[0])) / transform.k;
        const y =
          (evt.clientY - (rect.top + transform.y - viewBox[1])) / transform.k;
        const newAssets = this.chartHelper.addNode(item, x, y);
        if (newAssets.length > 6) {
          newAssets.pop();
        }
        this.assets = newAssets;
        evt.stopPropagation();
      }
      return false;
    }
  },
  watch: {
    assets(newVal) {
      this.$nextTick(() => this.render());
    },
    selectId(newVal) {
      this.$nextTick(() => this.render());
    }
  }
};
</script>

<style lang="scss">
.scatter-container {
  flex: 1;
  position: relative;
  box-sizing: border-box;
  width: 1920px;
  height: 1080px;
}
</style>
