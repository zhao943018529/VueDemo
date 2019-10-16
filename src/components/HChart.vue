<template>
  <div>
    <div ref="panel" class="painter" />
  </div>
</template>

<script>
import _ from "lodash";
import exporting from "highcharts/modules/exporting";
import { getFilterData, getChildren, deepFilter } from "./hutil";
import alarmData from "../mock/alarm";
import * as Highcharts from "highcharts";
import HighchartsSankey from "highcharts/modules/sankey";
import HighchartsOrganization from "highcharts/modules/organization";
import highDragDrop from "highcharts/modules/draggable-points";
import HighchartsExporting from "highcharts/modules/exporting";
HighchartsSankey(Highcharts);
HighchartsOrganization(Highcharts);
HighchartsExporting(Highcharts);
highDragDrop(Highcharts);
// var Highcharts = require('highcharts');
// console.log(Highcharts);
// Load module after Highcharts is loaded
// require('highcharts/modules/exporting')(highCharts);

export default {
  name: "organization",
  data() {
    return {
      showData: getFilterData(alarmData, obj => obj.threat),
      chart: null
    };
  },
  methods: {
    toggleShow(point) {
      if (point.linksFrom.length > 0) {
        this.showData = deepFilter(this.showData, alarmData,point.id);
      } else {
        const childrenData = getChildren(alarmData, point.id);
        if (childrenData) {
          const cloneData = _.cloneDeep(this.showData);
          Array.prototype.push.apply(cloneData.data, childrenData.data);
          Array.prototype.push.apply(cloneData.nodes, childrenData.nodes);
          this.showData = cloneData;
        }
      }
    }
  },
  mounted() {
    this.chart = Highcharts.chart(this.$refs.panel, {
      chart: {
        height: 600,
        inverted: false,
        backgroundColor:"#f4f4f4",
      },
      annotations:[{
        controlPointOptions:{
          height:10,
          symbol:"circle",
          visible:true,
          width:10,
        },
        draggable:"xy",
        labels:[{
          
        }],
      }],
      title: {
        text: "Highcharts Org Chart"
      },

      series: [
        {
          type: "organization",
          name: "Highsoft",
          keys: ["from", "to"],
          data: this.showData.data,
          nodes: this.showData.nodes,
          dataLabels: {
            color: "orange",
            style:{
              color:'contrast',
              fontSize:"16px"
            },
          },
          dragDrop:{
            draggableX:true,
            draggableY:true,
          },
          events: {
            click: e => {
            // debugger;
            this.toggleShow(e.point);
            }
          },
          colorByPoint: false,
          color: "#007ad0",
          borderColor: "white",
          nodeWidth: 120,
          nodeHeight:60
        }
      ],
      tooltip: {
        outside: true
      },
      exporting: {
        allowHTML: true,
        sourceWidth: 800,
        sourceHeight: 600
      }
    });
  },
  updated() {},
  watch: {
    showData(data) {
      this.chart.update({
        series: [this.showData]
      });
    }
  }
};
// {
//       chart: {
//         height: 600,
//         inverted: false
//       },

//       title: {
//         text: "Highcharts Org Chart"
//       },
//       series: [
//         {
//           type: "organization",
//           name: "Highsoft",
//           keys: ["from", "to"],
//           data: this.data.data,
//           nodes: this.data.nodes,
//           events: {
//             click: function(e) {
//               console.log(e);
//             }
//           },
//           colorByPoint: false,
//           color: "#007ad0",
//           dataLabels: {
//             color: "white"
//           },
//           borderColor: "white",
//           nodeWidth: 65
//         }
//       ],
//       tooltip: {
//         outside: true
//       },
//       exporting: {
//         allowHTML: true,
//         sourceWidth: 800,
//         sourceHeight: 600
//       }
//     }
</script>

<style lang="scss">
.painter {
  width: 800px;
  height: 600px;
}

.myhighchart{
  max-height:60px;
}
</style>