import * as d3 from "d3";
import _ from 'lodash';
import mock_data from './mock';

export default {
    name: 'd3-demo',
    data() {
        return {
            width: 1200,
            duration: 1000,
            layout: {
                top: 20,
                right: 20,
                left: 20,
                bottom: 20,
            }
        };
    },
    computed: {

    },
    methods: {
        update(source) {
            const nodes = this.root.descendants().reverse();
            const links = this.root.links();
            this.tree(this.root);
            let left = this.root;
            let right = this.root;
            this.root.eachBefore(node => {
                if (node.x < left.x) left = node;
                if (node.x > right.x) right = node;
            });
            const height = right.x - left.x + this.layout.top + this.layout.bottom;
            const transition = this.svg.transition().duration(this.duration)
                .attr('viewBox', [-this.layout.left, left.x - this.layout.top, this.width, height])
                .tween("resize", window.ResizeObserver ? null : () => () => this.svg.dispatch("toggle"));

            const node = this.gNode.selectAll('g.node').data(nodes, d => d.id);
            const nodeEnter = node.enter().append('g').attr('class', 'node')
                .attr('transform', d => `translate(${source.y0 + d.depth * 68},${source.x0})`)
                .attr('fill-opacity', 0)
                .attr('stroke-opacity', 0)
            // .on('click', d => {
            //     d.children = d.children ? null : d._children;
            //     this.update(d);
            // });
            const g1Node = nodeEnter.append('g').attr('width', 50).attr('height', 16).attr('transform', `translate(0,-8)`);
            g1Node.append('rect')
                // .attr('x', -40)
                // .attr('y', -8)
                .attr('width', 50)
                .attr('height', 24)
                // .attr('fill', d => d._children ? '#555' : '#fff')
                .attr('fill', d => d._children ? "#555" : "#999")

                .attr('stroke-width', 1.5);
            g1Node.append('text')
                .attr('dy', '1em')
                .attr('dx', '.2em')
                // .attr('x', 0)
                .attr('text-anchor', 'start')
                .attr("stroke", "#fff")
                .text(d => d.data.name);
            const g2Node = nodeEnter.append('g').attr('width', 18).style('display', d => {
                if (d.children || d._children) return "inline";
                else return "none";
            }).attr('height', 18).attr('transform', `translate(50,3)`);
            g2Node.append('circle').attr('cx', 9).attr('r', 9).attr('fill', 'blue');
            g2Node.append('text').attr('class', 'expandText').text(d => {
                return d.children ? '-' : '+';
            })
                // .attr('dy', '0.3em')
                .attr('dominant-baseline', 'middle')
                .attr('title', d => d.data.name)
                .attr('dx', 9).attr('fill', '#fff').attr('text-anchor', 'middle').style('font-weight', 700).on('click', d => {
                    if (d.children) {
                        d._children = d.children;
                        d.children = null;
                    } else {
                        d.children = d._children;
                        d._children = null;
                    }
                    this.update(d);
                });
            // .clone(true)
            // .lower().attr("stroke-linejoin", "round")
            // .attr("stroke-width", 3)
            // .attr("stroke", "white");
            const nodeUpdate = node.merge(nodeEnter)
                .transition(transition).attr('transform', d => `translate(${d.y + d.depth * 68},${d.x})`)
                .attr('fill-opacity', '1').attr('stroke-opacity', 1);
            const nodeExit = node.exit().transition(transition)
                .remove().attr('transform', d => `translate(${source.y + source.depth * 68},${source.x})`)
                .attr('fill-opacity', 0).attr('stroke-opacity', 0);

            node.select('text.expandText').text(d => d.children ? '-' : '+');
            const link = this.gLink.selectAll('path').data(links, d => d.target.id);
            const linkEnter = link.enter().append('path').attr('d', d => {
                const o = { x: source.x0, y: source.y0 + (source.depth + 1) * 68 };
                return this.diagonal({ source: o, target: o });
            });
            link.merge(linkEnter).transition(transition).attr('d', d => {
                const o = _.clone(d.source);
                o.y += d.target.depth * 68;
                const t = { x: d.target.x, y: d.target.y + d.target.depth * 68 };
                return this.diagonal({ source: o, target: t });
            });
            link.exit().transition(transition).remove().attr('d', d => {
                const o = { x: source.x, y: source.y + (source.depth + 1) * 68 };
                return this.diagonal({ source: o, target: o });
            });
            this.root.eachBefore(d => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }
    },
    mounted() {
        this.root = d3.hierarchy(mock_data);
        debugger;
        this.dx = 28;
        // this.dy = this.width / (this.root.height + 1);
        this.dy = 66;
        this.root.x0 = this.dy / 2;
        this.root.y0 = 0;
        this.tree = d3.tree().nodeSize([this.dx, this.dy]);
        this.root.descendants().forEach((d, i) => {
            d.id = _.uniqueId('d3');
            d._children = d.children;
            d.children = null;
        });
        this.svg = d3.select(this.$el).attr('viewBox', [-this.layout.left, -this.layout.top, this.width, this.dx]).style('user-select', 'none');
        this.gNode = this.svg.append('g').attr('cursor', 'pointer').attr('pointer-events', 'all');
        this.gLink = this.svg.append('g').attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5);
        this.diagonal = d3.linkHorizontal().x((d, i) => d.y).y(d => d.x);
        this.update(this.root);
    },
    render(h) {
        return (
            <svg class="collapse-tree">
            </svg>
        );
    },
};