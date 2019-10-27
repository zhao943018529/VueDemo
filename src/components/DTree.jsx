import * as d3 from "d3";
import _ from 'lodash';

export default {
    name: 'd3-demo',
    data() {
        return {
            width: 800,
            duration: 1000,
            layout: {
                top: 10,
                right: 10,
                left: 10,
                bottom: 10,
            }
        };
    },
    computed: {

    },
    methods: {
        update(source) {
            const nodes = this.root.descendants().reverse();
            const links = this.root.links();
            const tree = d3.tree().nodeSize([this.dx, this.dy]);
            tree(this.root);
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

            const node = this.gNode.selectAll('g').data(nodes, d => d.id);
            const nodeEnter = node.enter().append('g').attr('transform', d => `translate(${source.y0},${source.x0})`).attr('fill-opacity', 0).attr('stroke-opacity', 0).on('click', d => {
                d.children = d.children ? null : d._children;
                this.update(d);
            });
            nodeEnter.append('rect').attr('y', -6).attr('x', -20).attr('width', 40).attr('height', 12).attr('fill', d => d._children ? '#555' : '#fff').attr('stroke-width', 1.5);
            nodeEnter.append('text').attr('dy', '0.31em').attr('x', -18).attr('text-anchor', 'start').text(d => d.data.name).clone(true).lower().attr("stroke-linejoin", "round")
                .attr("stroke-width", 3)
                .attr("stroke", "white");
            const nodeUpdate = node.merge(nodeEnter).transition(transition).attr('transform', d => `translate(${d.y},${d.x})`).attr('fill-opacity', '1').attr('stroke-opacity', 1);
            const nodeExit = node.exit().transition(transition).remove().attr('transform', d => `translate(${source.y},${source.x})`).attr('fill-opacity', 0).attr('stroke-opacity', 0);
            const link = this.gLink.selectAll('path').data(links, d => d.target.id);
            const linkEnter = link.enter().append('path').attr('d', d => {
                const o = { x: source.x0, y: source.y0 };
                return this.diagonal({ source: o, target: o });
            });
            link.merge(linkEnter).transition(transition).attr('d', this.diagonal);
            link.exit().transition(transition).remove().attr('d', d => {
                const o = { x: source.x, y: source.y };
                return this.diagonal({ source: o, target: o });
            });
            this.root.eachBefore(d => {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }
    },
    mounted() {
        const data = d3.json("https://raw.githubusercontent.com/d3/d3-hierarchy/v1.1.8/test/data/flare.json").then(data => {
            this.root = d3.hierarchy(data);
            this.dx = 10;
            this.dy = this.width / (this.root.height + 1);
            this.root.x0 = this.dy / 2;
            this.root.y0 = 0;
            this.root.descendants().forEach((d, i) => {
                d.id = _.uniqueId('d3');
                d._children = d.children;
                d.children = null;
            });
            this.svg = d3.select(this.$el).attr('viewBox', [-this.layout.left, -this.layout.top, this.width, this.dx]).style('font', '10px sans-serif').style('user-select', 'none');
            this.gNode = this.svg.append('g').attr('cursor', 'pointer').attr('pointer-events', 'all');
            this.gLink = this.svg.append('g').attr("fill", "none")
                .attr("stroke", "#555")
                .attr("stroke-opacity", 0.4)
                .attr("stroke-width", 1.5);;
            this.diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);
            this.update(this.root);
        });
    },
    render(h) {
        return (
            <svg>
            </svg>
        );
    },
};