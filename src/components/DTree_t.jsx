import * as d3 from "d3";
import _ from 'lodash';
import mock_data from './mock';

export default {
    name: 'd3-demo',
    data() {
        return {
            width: 954,
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
        update(source) {
            const nodes = this.root.descendants().reverse();
            const links = this.root.links();
        
            // Compute the new tree layout.
            this.tree(this.root);
        
            let left = this.root;
            let right = this.root;
            this.root.eachBefore(node => {
              if (node.x < left.x) left = node;
              if (node.x > right.x) right = node;
            });
        
            const height = right.x - left.x + this.layout.top + this.layout.bottom;
        
            const transition = this.svg.transition()
                .duration(this.duration)
                .attr("viewBox", [-this.layout.left, left.x - this.layout.top, this.width, height])
                .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));
        
            // Update the nodes…
            const node = this.gNode.selectAll("g")
              .data(nodes, d => d.id);
        
            // Enter any new nodes at the parent's previous position.
            const nodeEnter = node.enter().append("g")
                .attr("transform", d => `translate(${source.y0},${source.x0})`)
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0)
                .on("click", d => {
                  d.children = d.children ? null : d._children;
                  this.update(d);
                });
        
            nodeEnter.append("circle")
                .attr("r", 8)
                .attr("fill", d => d._children ? "#555" : "#999")
                .attr("stroke-width", 10);
        
            nodeEnter.append("text")
                .attr("dy", "0.31em")
                .attr("x", d => d._children ? -6 : 6)
                .attr("text-anchor", d => d._children ? "end" : "start")
                .text(d => d.data.name)
              // .clone(true).lower()
              //   .attr("stroke-linejoin", "round")
              //   .attr("stroke-width", 3)
              //   .attr("stroke", "white");
        
            // Transition nodes to their new position.
            const nodeUpdate = node.merge(nodeEnter).transition(transition)
                .attr("transform", d => `translate(${d.y},${d.x})`)
                .attr("fill-opacity", 1)
                .attr("stroke-opacity", 1);
        
            // Transition exiting nodes to the parent's new position.
            const nodeExit = node.exit().transition(transition).remove()
                .attr("transform", d => `translate(${source.y},${source.x})`)
                .attr("fill-opacity", 0)
                .attr("stroke-opacity", 0);
        
            // Update the links…
            const link = this.gLink.selectAll("path")
              .data(links, d => d.target.id);
        
            // Enter any new links at the parent's previous position.
            const linkEnter = link.enter().append("path")
                .attr("d", d => {
                  const o = {x: source.x0, y: source.y0};
                  return this.diagonal({source: o, target: o});
                });
        
            // Transition links to their new position.
            link.merge(linkEnter).transition(transition)
                .attr("d", this.diagonal);
        
            // Transition exiting nodes to the parent's new position.
            link.exit().transition(transition).remove()
                .attr("d", d => {
                  const o = {x: source.x, y: source.y};
                  return this.diagonal({source: o, target: o});
                });
        
            // Stash the old positions for transition.
            this.root.eachBefore(d => {
              d.x0 = d.x;
              d.y0 = d.y;
            });
        }
    },
    mounted() {
        this.root = d3.hierarchy(mock_data);
        this.dx = 24;
        this.dy = this.width / 6;
        this.root.x0 = this.dy / 2;
        this.root.y0 = 0;
        this.tree = d3.tree().nodeSize([this.dx, this.dy]);
        this.root.descendants().forEach((d, i) => {
            d.id = i;
            d._children = d.children;
           d.children = null;
        });
        this.svg = d3.select(this.$el)
            .attr("viewBox", [-this.layout.left, -this.layout.top, this.width, this.dx])
            .style("font", "18px sans-serif")
            .style("user-select", "none");

        this.gLink = this.svg.append("g")
            .attr("fill", "none")
            .attr("stroke", "#555")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5);

        this.gNode = this.svg.append("g")
            .attr("cursor", "pointer")
            .attr("pointer-events", "all");
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