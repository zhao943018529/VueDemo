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
            const levelWidth = this.getMaxLevel() * 60;
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
                .attr('transform', d => `translate(${source.y0 + (this.lineMap[source.id] - (d.data.isMain ? 1 : 0)) * 100 + (source.depth + 1) * 48},${source.x0})`)
                .attr('fill-opacity', 0)
                .attr('stroke-opacity', 0)
            // .on('click', d => {
            //     d.children = d.children ? null : d._children;
            //     this.update(d);
            // });
            const g1Node = nodeEnter.append('g').attr('transform', 'translate(0,-13)');
            g1Node.append('use').attr('href', '#Combined-Shape')
                .attr('fill', '#29C11B')
                .attr('width', 26).attr('height', 26)
            // .attr('width', d => {
            //     return d.data.name.length * 12;
            // })
            // .attr('height', 24)
            // .attr('transform', `translate(0,-12)`);
            // g1Node.append('text').text(d => d.parent && d.parent._children.length - 1).style('display', d => {
            //     if (d.data.isMain && (d.parent && d.parent._children.length > 1)) {
            //         return "inline";
            //     } else {
            //         return "none";
            //     }
            // }).on('click', d => {
            //     if (d.parent._children.length > d.parent.children.length) {
            //         d.parent.children = d.parent._children;
            //     } else {
            //         this.dfsCollapse(_.filter(d.parent.children, item => item.id !== d.id));
            //         d.parent.children = [d];
            //     }
            //     this.update(d.parent);
            // });
            // g1Node.append('rect')
            //     // .attr('x', -40)
            //     // .attr('y', -8)
            //     .attr('width', d => d.data.name.length * 12)
            //     .attr('height', 24)
            //     // .attr('fill', d => d._children ? '#555' : '#fff')
            //     .attr('fill', d => d._children ? "#555" : "#999")

            //     .attr('stroke-width', 1.5);
            // g1Node.append('path').attr('d','M528 224H272c-8.8 0-16 7.2-16 16v144H64V144c0-8.8-7.2-16-16-16H16c-8.8 0-16 7.2-16 16v352c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16v-48h512v48c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16V336c0-61.9-50.1-112-112-112zM136 96h126.1l27.6 55.2c5.9 11.8 22.7 11.8 28.6 0L368 51.8 390.1 96H512c8.8 0 16-7.2 16-16s-7.2-16-16-16H409.9L382.3 8.8C376.4-3 359.6-3 353.7 8.8L304 108.2l-19.9-39.8c-1.4-2.7-4.1-4.4-7.2-4.4H136c-4.4 0-8 3.6-8 8v16c0 4.4 3.6 8 8 8zm24 256c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64z')
            // g1Node.append('text')
            //     .attr('dy', '1em')
            //     .attr('dx', '.2em')
            //     // .attr('x', 0)
            //     .attr('text-anchor', 'start')
            //     .attr("stroke", "#fff")
            //     .text(d => d.data.name);
            // g1Node.append('')
            g1Node.append('use').attr('class', 'expandChildren').style('display', d => {
                if (d.children || d._children) return "inline";
                else return "none";
            }).attr('height', 18).attr('width', 18).attr('stroke', '#333333')
                .attr('transform', d => `translate(30,4)`)
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
            nodeEnter.append('text').text(d => d.data.name).attr('transform', `translate(0,${28})`).attr('fill', '#333333');
            const broNodeEnter = nodeEnter.filter(function (d) { return _.some(d.children, child => child.data.isMain); });
            const broNode = broNodeEnter.append('g').attr('class','broComponent').attr('transform', 'translate(130,0)');
            broNode.append('line').attr('x1', 0).attr('x2', -82).attr('stroke', '#555').attr('stroke-width', 1.5).attr('stroke-opacity', 0.5);
            broNode.append('use').attr('class', 'broButton').attr('width', 18).attr('height', 18).attr('href', d =>d.children.length<d._children.length?'#expandBro':'#collapseBro')
            .attr('transform', 'translate(0,-9)')
                .on('click', d => {
                    if (d._children.length > d.children.length) {
                        d.children = d._children;
                    } else {
                        const found = _.findIndex(d.children, item => item.data.isMain);
                        this.dfsCollapse(_.filter(d.children, (item, index) => index !== found));
                        d.children = [d.children[found]];
                    }
                    this.update(d);
                });
            const nodeUpdate = node.merge(nodeEnter)
                .transition().attr('transform', d => `translate(${d.y + (this.lineMap[d.id] - (d.data.isMain ? 1 : 0)) * 100 + d.depth * 48},${d.x})`)
                .attr('fill-opacity', '1').attr('stroke-opacity', 1);
            const nodeExit = node.exit().transition()
                .remove().attr('transform', d => `translate(${source.y + this.lineMap[source.id] * 100 + (source.depth + 1) * 48},${source.x})`)
                .attr('fill-opacity', 0).attr('stroke-opacity', 0);

            node.select('use.expandChildren').attr('href', d => `#${d.children ? 'substract' : 'plus'}`);
            node.select('g.broComponent').filter(d=>!d.children).remove();
            node.select('use.broButton').attr('href', d => {
                if (d.children.length < d._children.length) {
                    return '#expandBro';
                } else {
                    return '#collapseBro';
                }
            });
            const link = this.gLink.selectAll('path').data(links, d => d.target.id);
            const linkEnter = link.enter().append('path').attr('d', d => {
                const o = { x: source.x0, y: source.y0 + this.lineMap[source.id] * 100 + (source.depth + 1) * 48 };
                return this.diagonal({ source: o, target: o });
            });
            link.merge(linkEnter).transition().attr('d', d => {
                const o = _.clone(d.source);
                o.y += this.lineMap[d.source.id] * 100 + d.target.depth * 48;
                const t = { x: d.target.x, y: d.target.y + this.lineMap[d.source.id] * 100 + d.target.depth * 48 };
                return this.diagonal({ source: o, target: t });
            });
            link.exit().transition().remove().attr('d', d => {
                const o = { x: source.x, y: source.y + this.lineMap[source.id] * 100 + (source.depth + 1) * 48 };
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
        this.lineMap = {};
        // this.dx = 24;
        // this.dy = this.width / (this.root.height + 1);
        this.root.x0 = this.width / 2;
        this.root.y0 = 0;
        this.root.descendants().forEach((d, i) => {
            d.id = _.uniqueId('d3');
            let width = d.data.name.length * 12;
            let lineNum = d.data.isMain ? 1 : 0;
            if (d.parent) {
                lineNum += this.lineMap[d.parent.id];
                width += this.labelWidthMap[d.parent.id];
            }
            this.lineMap[d.id] = lineNum;
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
                    <symbol id='plus' viewBox="0 0 14 14">
                        <circle fill="none" stroke="1" cx="7" cy="7" r="6.5"></circle>
                        <path d="M7.5,7.5 L7.5,11 L6.5,11 L6.5,7.5 L3,7.5 L3,6.5 L6.5,6.5 L6.5,3 L7.5,3 L7.5,6.5 L11,6.5 L11,7.5 L7.5,7.5 Z"></path>
                    </symbol>
                    <symbol id='substract' viewBox="0 0 14 14">
                        <circle fill="none" stroke="1" cx="7" cy="7" r="6.5"></circle>
                        <polygon points="11 6.5 11 7.5 3 7.5 3 6.5"></polygon>
                    </symbol>
                    <symbol id="Combined-Shape" viewBox="0 0 30 30">
                        <path d="M2,2 L28,2 L28,28 L2,28 L2,2 Z M4,8 L4,26 L26,26 L26,8 L4,8 Z M24,4 L24,6 L26,6 L26,4 L24,4 Z M21,4 L21,6 L23,6 L23,4 L21,4 Z M18,4 L18,6 L20,6 L20,4 L18,4 Z M4,4 L4,6 L16,6 L16,4 L4,4 Z M8.82842712,17.5 L10.9497475,19.6213203 L9.53553391,21.0355339 L6,17.5 L9.53553391,13.9644661 L10.9497475,15.3786797 L8.82842712,17.5 Z M17.3111114,11.9287133 L19,13 L12.6568542,23 L10.8124099,21.4643567 L17.3111114,11.9287133 Z M21.1715729,17.5 L19.0502525,15.3786797 L20.4644661,13.9644661 L24,17.5 L20.4644661,21.0355339 L19.0502525,19.6213203 L21.1715729,17.5 Z"></path>
                    </symbol>
                    <symbol id="expandBro" viewBox="0 0 448 512">
                        <path d="M448 344v112a23.94 23.94 0 0 1-24 24H312c-21.39 0-32.09-25.9-17-41l36.2-36.2L224 295.6 116.77 402.9 153 439c15.09 15.1 4.39 41-17 41H24a23.94 23.94 0 0 1-24-24V344c0-21.4 25.89-32.1 41-17l36.19 36.2L184.46 256 77.18 148.7 41 185c-15.1 15.1-41 4.4-41-17V56a23.94 23.94 0 0 1 24-24h112c21.39 0 32.09 25.9 17 41l-36.2 36.2L224 216.4l107.23-107.3L295 73c-15.09-15.1-4.39-41 17-41h112a23.94 23.94 0 0 1 24 24v112c0 21.4-25.89 32.1-41 17l-36.19-36.2L263.54 256l107.28 107.3L407 327.1c15.1-15.2 41-4.5 41 16.9z"></path>
                    </symbol>
                    <symbol id="collapseBro" viewBox="0 0 448 512">
                        <path d="M200 288H88c-21.4 0-32.1 25.8-17 41l32.9 31-99.2 99.3c-6.2 6.2-6.2 16.4 0 22.6l25.4 25.4c6.2 6.2 16.4 6.2 22.6 0L152 408l31.1 33c15.1 15.1 40.9 4.4 40.9-17V312c0-13.3-10.7-24-24-24zm112-64h112c21.4 0 32.1-25.9 17-41l-33-31 99.3-99.3c6.2-6.2 6.2-16.4 0-22.6L481.9 4.7c-6.2-6.2-16.4-6.2-22.6 0L360 104l-31.1-33C313.8 55.9 288 66.6 288 88v112c0 13.3 10.7 24 24 24zm96 136l33-31.1c15.1-15.1 4.4-40.9-17-40.9H312c-13.3 0-24 10.7-24 24v112c0 21.4 25.9 32.1 41 17l31-32.9 99.3 99.3c6.2 6.2 16.4 6.2 22.6 0l25.4-25.4c6.2-6.2 6.2-16.4 0-22.6L408 360zM183 71.1L152 104 52.7 4.7c-6.2-6.2-16.4-6.2-22.6 0L4.7 30.1c-6.2 6.2-6.2 16.4 0 22.6L104 152l-33 31.1C55.9 198.2 66.6 224 88 224h112c13.3 0 24-10.7 24-24V88c0-21.3-25.9-32-41-16.9z"></path>
                    </symbol>
                </defs>
            </svg >
        );
    },
};