<template>
  <div class="diagram" ref="myDiagramDiv"></div>
</template>

<script>
import go from "gojs";
import { generateLayout,convertDiagramData } from "./hutil";
import alarmData from '../mock/alarm';
const $ = go.GraphObject.make;

export default {
  name: "gotree",
  data() {
    return {
      layout: generateLayout(go),
      instance:null,
      nodeArray:convertDiagramData(alarmData),
    };
  },
  methods: {},
  mounted() {
      debugger;
      this.instance=$(go.Diagram, this.$refs.myDiagramDiv,
          {
            allowCopy: false,
            allowDelete: false,
            allowMove: false,
            initialAutoScale: go.Diagram.Uniform,
            layout:
              $(this.layout,  // custom Layout, defined below
                {
                  angle: 0,
                  compaction: go.TreeLayout.CompactionNone
                }),
            "undoManager.isEnabled": true
          });

          this.instance.nodeTemplate =
        $(go.Node, "Horizontal",
          { selectionObjectName: "BODY" },
          $(go.Panel, "Auto", { name: "BODY" },
            $(go.Shape, "RoundedRectangle",
              new go.Binding("fill"),
              new go.Binding("stroke"),{width:160}),
            $(go.Picture,new go.Binding("source"),{width:20,height:20,alignment:go.Spot.LeftCenter}),
            $(go.TextBlock,
              { font: "bold 12pt Arial, sans-serif", margin: new go.Margin(4, 2, 2, 2) },
              new go.Binding("text"))
          ),
          $(go.Panel,  // this is underneath the "BODY"
            { height: 17 },  // always this height, even if the TreeExpanderButton is not visible
            $("TreeExpanderButton")
          )
        );
        this.instance.linkTemplate =
        $(go.Link,
          $(go.Shape, { strokeWidth: 1.5 }));
          this.instance.model =
        $(go.TreeModel,
          { nodeDataArray: this.nodeArray });
  }
};
</script>

<style lang="scss">
.diagram {
  height: 600px;
}
</style>