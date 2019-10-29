import * as d3 from "d3";
import _ from 'lodash';
import mock_data from './mock';

export default {
    name: 'd3-demo',
    data() {
        return {
            width: 954,
            height: 600,
            duration: 750,
            layout: {
                top: 40,
                right: 20,
                left: 20,
                bottom: 20,
            }
        };
    },
    computed: {

    },
    methods: {
        getMaxLevel() {
            const depthWidth = [1];
            this.root.each(node => {
                if (node.children && node.children.length > 0) {
                    if (node.depth + 1 <= depthWidth.length) {
                        depthWidth.push(0);
                    }
                    depthWidth[node.depth + 1] += node.children.length;
                }
            });

            return _.max(depthWidth);
        },
        update(source) {
            const levelWidth = this.getMaxLevel() * 40;
            this.tree = this.tree.size([levelWidth, this.height]);
            this.tree(this.root);
            const nodes = this.root.descendants().reverse();
            const links = this.root.links();
            // let left = this.root;
            // let right = this.root;
            // let bottom = this.root;
            // this.root.eachBefore(node => {
            //     if (node.x < left.x) left = node;
            //     if (node.x > right.x) right = node;
            //     if (node.y > bottom.y) bottom = node;
            // });
            // const myHeight = bottom.y + this.labelWidthMap[bottom.id] + (bottom.depth + 1) * 18 + this.layout.left + this.layout.right;
            // this.tree.size([myHeight, this.width]);
            // const height = right.x - left.x + this.layout.top + this.layout.bottom;
            // const transition = this.baseSvg.transition().duration(this.duration)
            //     .attr('viewBox', [-this.layout.left, left.x - this.layout.top, Math.max(this.width, myHeight), height])
            //     .tween("resize", window.ResizeObserver ? null : () => () => this.svg.dispatch("toggle"));

            const node = this.gNode.selectAll('g.node').data(nodes, d => d.id);
            const nodeEnter = node.enter().append('g').attr('class', 'node')
                .attr('transform', d => `translate(${source.y0 + this.labelWidthMap[source.id] + (source.depth + 1) * 18},${source.x0})`)
                .attr('fill-opacity', 0)
                .attr('stroke-opacity', 0)
            // .on('click', d => {
            //     d.children = d.children ? null : d._children;
            //     this.update(d);
            // });
            const g1Node = nodeEnter.append('g')
                // .attr('width', d => {
                //     return d.data.name.length * 12;
                // })
                // .attr('height', 24)
                .attr('transform', `translate(0,)`);
            g1Node.append('text').text(d => d.parent && d.parent._children.length - 1).style('display', d => {
                if (d.data.isMain && (d.parent && d.parent._children.length > 1)) {
                    return "inline";
                } else {
                    return "none";
                }
            }).on('click', d => {
                if (d.parent._children.length > d.parent.children.length) {
                    d.parent.children = d.parent._children;
                } else {
                    this.dfsCollapse(_.filter(d.parent.children, item => item.id !== d.id));
                    d.parent.children = [d];
                }
                this.update(d.parent);
            });
            g1Node.append('rect')
                // .attr('x', -40)
                // .attr('y', -8)
                .attr('width', d => d.data.name.length * 12)
                .attr('height', 24)
                // .attr('fill', d => d._children ? '#555' : '#fff')
                .attr('fill', d => d._children ? "#555" : "#999")

                .attr('stroke-width', 1.5);
            // g1Node.append('path').attr('d','M528 224H272c-8.8 0-16 7.2-16 16v144H64V144c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16v352c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-48h512v48c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V336c0-61.9-50.1-112-112-112zM136 96h126.1l27.6 55.2c5.9 11.8 22.7 11.8 28.6 0L368 51.8 390.1 96H512c8.8 0 16-7.2 16-16s-7.2-16-16-16H409.9L382.3 8.8C376.4-3 359.6-3 353.7 8.8L304 108.2l-19.9-39.8c-1.4-2.7-4.1-4.4-7.2-4.4H136c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8zm24 256c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64z')
            g1Node.append('text')
                .attr('dy', '1em')
                .attr('dx', '.2em')
                // .attr('x', 0)
                .attr('text-anchor', 'start')
                .attr("stroke", "#fff")
                .text(d => d.data.name);
            const g2Node = nodeEnter.append('use').attr('width', 18).style('display', d => {
                if (d.children || d._children) return "inline";
                else return "none";
            }).attr('height', 18).attr('fill','#d1ecf1').attr('stroke','#0c5460')
            .attr('transform', d => `translate(${d.data.name.length * 12},0)`)
            .attr('href', d => {
                return `#${d.children ? 'substract' : 'plus'}`;
            }).on('click', this.toggle);
            // g2Node.append('rect').attr('y', -9).attr('width', 18).attr('height', 18).attr('fill', 'blue');
            // g2Node.append('text').attr('class', 'expandText').text(d => {
            //     return d.children ? '-' : '+';
            // })
            //     // .attr('dy', '0.3em')
            //     .attr('dominant-baseline', 'middle')
            //     .attr('title', d => d.data.name)
            //     .attr('dx', 9).attr('fill', '#fff').attr('text-anchor', 'middle').style('font-weight', 700)
            //     .on('click', this.toggle);
            // .on('click', d => {
            //     if (d.children) {
            //         d._children = d.children;
            //         d.children = null;
            //     } else {
            //         d.children = d._children;
            //         d._children = null;
            //     }
            //     this.update(d);
            // });
            // .clone(true)
            // .lower().attr("stroke-linejoin", "round")
            // .attr("stroke-width", 3)
            // .attr("stroke", "white");
            const nodeUpdate = node.merge(nodeEnter)
                .transition().attr('transform', d => `translate(${d.y + (d.parent ? this.labelWidthMap[d.parent.id] : 0) + d.depth * 18},${d.x})`)
                .attr('fill-opacity', '1').attr('stroke-opacity', 1);
            const nodeExit = node.exit().transition()
                .remove().attr('transform', d => `translate(${source.y + this.labelWidthMap[source.id] + (source.depth + 1) * 18},${source.x})`)
                .attr('fill-opacity', 0).attr('stroke-opacity', 0);

            node.select('text.expandText').text(d => d.children ? '-' : '+');
            const link = this.gLink.selectAll('path').data(links, d => d.target.id);
            const linkEnter = link.enter().append('path').attr('d', d => {
                const o = { x: source.x0, y: source.y0 + this.labelWidthMap[source.id] + (source.depth + 1) * 18 };
                return this.diagonal({ source: o, target: o });
            });
            link.merge(linkEnter).transition().attr('d', d => {
                const o = _.clone(d.source);
                o.y += this.labelWidthMap[d.source.id] + d.target.depth * 18;
                const t = { x: d.target.x, y: d.target.y + this.labelWidthMap[d.source.id] + d.target.depth * 18 };
                return this.diagonal({ source: o, target: t });
            });
            link.exit().transition().remove().attr('d', d => {
                const o = { x: source.x, y: source.y + this.labelWidthMap[source.id] + (source.depth + 1) * 18 };
                return this.diagonal({ source: o, target: o });
            });
            this.root.eachBefore(d => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        },
        dfsCollapse(children) {
            _.each(children, item => {
                if (item.children) {
                    this.dfsCollapse(item.children);
                    item.children = null;
                }
            })
        },
        toggle(d) {
            if (d.children) {
                this.dfsCollapse(d.children);
                d.children = null;
            } else {
                const mainNode = _.find(d._children, item => item.data.isMain);
                if (mainNode) {
                    d.children = [mainNode];
                } else {
                    d.children = d._children;
                }
            }
            this.update(d);
        },
        zoom(event) {
            const transform = d3.event.transform;
            this.svgContainer.attr("transform", `translate(${transform.x},${transform.y})scale(${transform.k})`);
        }
    },
    mounted() {
        this.root = d3.hierarchy(mock_data);
        this.labelWidthMap = {};
        // this.dx = 24;
        // this.dy = this.width / (this.root.height + 1);
        this.root.x0 = this.width / 2;
        this.root.y0 = 0;
        this.root.descendants().forEach((d, i) => {
            d.id = _.uniqueId('d3');
            let width = d.data.name.length * 12;
            if (d.parent) {
                width += this.labelWidthMap[d.parent.id];
            }
            this.labelWidthMap[d.id] = width;
            const mainNode = _.find(d.children, item => item.data.isMain);
            d._children = d.children;
            if (mainNode) {
                d.children = [mainNode];
            } else {
                d.children = null;
            }
        });
        this.tree = d3.tree().size([this.height, this.width]);
        this.baseSvg = d3.select(this.$el)
            .style("font", "18px sans-serif")
            .style('user-select', 'none');
        this.svgContainer = this.baseSvg.append('g');
        // this.svg = this.svgContainer
        // .attr('viewBox', [-this.layout.left, -this.layout.top, this.width, this.dx])

        this.zoomListener = d3.zoom().scaleExtent([0.1, 3]).on("zoom", this.zoom);
        this.baseSvg.call(this.zoomListener);
        this.gNode = this.svgContainer.append('g').attr('cursor', 'pointer').attr('pointer-events', 'all');
        this.gLink = this.svgContainer.append('g').attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5);
        this.diagonal = d3.linkHorizontal().x((d, i) => d.y).y(d => d.x);
        this.update(this.root);
    },
    render(h) {
        return (
            <svg width={this.width} height={this.height}>
                <defs>
                    <g id='plus' viewBox="0 0 20 20">
                        <rect x="0" y="0" width="20" height="20" stroke-width="0"></rect>
                        <line x1="2" y1="10" x2="18" y2="10" stroke-width="4"></line>
                        <line x1="10" y1="2" x2="10" y2="18" stroke-width="4"></line>
                    </g>
                    <g id='substract' viewBox="0 0 20 20">
                        <rect x="0" y="0" width="20" height="20" stroke-width="0"></rect>
                        <line x1="2" y1="10" x2="18" y2="10" stroke-width="4"></line>
                    </g>
                </defs>
            </svg >
        );
    },
};