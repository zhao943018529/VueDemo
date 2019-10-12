<template>
  <div>
    <div ref="tree" style="width:800px;height:500px;"></div>
    <img src="http://localhost:8080/images/card.png" />
  </div>
</template>

<script>
import echarts from "echarts";
import _ from "lodash";
import flareData from "../mock/flare.json";
function getType(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1);
}

function isObject(obj) {
  return getType(obj) === "Object";
}

function isArray(obj) {
  return getType(obj) === "Array";
}

function selectIcon() {
  return "http://localhost:8080/" + Math.random() * 10 > 5
    ? "images/card.png"
    : "images/sustainably.png";
}

addIcon(flareData);
function addIcon(data) {
  const type = getType(data);
  switch (type) {
    case "Object":
      data.imageUrl = selectIcon();
      if (data.children) {
        addIcon(data.children);
      }
      break;
    case "Array":
      echarts.util.each(data, item => addIcon(item));
      break;
    default:
      break;
  }
}

function convertForGraphic(data) {
  const result = {
    type: "tree",
    name: "myTree",
    top: "1%",
    left: "7%",
    bottom: "1%",
    right: "20%",
    symbolSize: [42, 28],
    symbol: "emptyCircle",
    expandAndCollapse: true,
    animationDuration: 550,
    animationDurationUpdate: 750
  };
  result.data = [deepConvert(data)];

  return result;
}

function deepConvert(data) {
  const type = getType(data);
  let result;
  switch (type) {
    case "Object":
      result = {
        name: data.name,
        value: data.value,
        // symbol(val, params) {
        //   return data.imageUrl;
        // },
        collapsed:true,
        label: {
          show: true,
          position: "top",
          verticalAlign: "bottom",
          align: "right",
          fontSize: 9,
          formatter(a1, b1) {
            return ["{name|"+data.name+"}", data.value&&"{suffix|"+data.value+"}"].filter(str=>!!str);
          },
          rich: {
            name: {
              color: "orange"
            },
            suffix: {
              color: "red"
            }
          }
        },
        itemStyle: {
          color: "blue"
        }
      };
      if (data.children) {
        result.children = deepConvert(data.children);
      }
      break;
    case "Array":
      result = _.map(data, item => deepConvert(item));
      break;
    default:
      break;
  }

  return result;
}

export default {
  name: "TreeDemo",
  data() {
    return {
      data: convertForGraphic(flareData),
      chartInstance: null
    };
  },
  mounted() {
    debugger;
    this.chartInstance = echarts.init(this.$refs.tree);
    this.chartInstance.setOption({
      tooltip: {
        trigger: "item",
        triggerOn: "mousemove"
      },
      series: [this.data]
    });
    this.chartInstance.on('click',function(params){
        params.data.collapsed=!params.data.collapsed;
    });
    this.chartInstance.on('dblclick',function(params){
        debugger;
    });
  }
};
</script>

<style lang="scss">
</style>