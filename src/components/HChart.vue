<template>
  <div>
    <div ref="panel" class="painter" />
  </div>
</template>

<script>
import _ from "lodash";
import highCharts from "highcharts";
import exporting from "highcharts/modules/exporting";
import { getFilterData, getChildren, deepFilter } from "./hutil";
import alarmData from "../mock/alarm";
import * as Highcharts from "highcharts";
import HighchartsSankey from "highcharts/modules/sankey";
import HighchartsOrganization from "highcharts/modules/organization";
import HighchartsExporting from "highcharts/modules/exporting";
HighchartsSankey(Highcharts);
HighchartsOrganization(Highcharts);
HighchartsExporting(Highcharts);
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
        inverted: false
      },

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
          events: {
            click: e => this.toggleShow(e.point)
          },
          colorByPoint: false,
          color: "#007ad0",
          dataLabels: {
            color: "white"
          },
          borderColor: "white",
          nodeWidth: 65
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
</style>