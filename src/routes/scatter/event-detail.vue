<template>
  <div class="assets-alarm-detail" :class="show ? 'show' : ''">
    <h4 class="assets-alarm-detail-header">
      <button
        class="assets-close"
        color="#F79A07"
        type="ios-close"
        size="24"
        @click="handleClose"
      >
        Close
      </button>
      <span class="assets-name">Caroline Hoffman-PC</span>
      <span class="assets-ip">192.168.1.23</span>
    </h4>
  </div>
</template>

<script>
export default {
  name: "EventDetail",
  props: {
    show: Boolean,
    closeDialog: Function
  },
  data() {
    return {
      columnData: [
        {
          key: "level",
          title: "事件等级",
          slot: "level"
        },
        {
          key: "type",
          title: "事件等级"
        },
        {
          key: "alarmCreateTime",
          title: "发现时间"
        },
        {
          key: "attck",
          title: "ATT&CK指标"
        }
      ],
      tableData: [
        {
          level: 1,
          times: 4,
          type: "非正常启动进程",
          alarmCreateTime: "2019-07-30 17:08:18",
          attck: "Exfiltration Over Physical Medium"
        },
        {
          level: 3,
          times: 1,
          type: "Powershell文件下载",
          alarmCreateTime: "2020-02-13 17:08:18",
          attck: "Browser Extensions"
        },
        {
          level: 2,
          times: 7,
          type: "浏览器启动进程",
          alarmCreateTime: "2020-02-18 17:08:18",
          attck: "BITS Jobs"
        },
        {
          level: 2,
          times: 2,
          type: "浏览器启动进程",
          alarmCreateTime: "2020-02-18 17:08:18",
          attck: "BITS Jobs"
        },
        {
          level: 1,
          times: 9,
          type: "浏览器启动进程",
          alarmCreateTime: "2020-02-18 17:08:18",
          attck: "BITS Jobs"
        }
      ]
    };
  },
  methods: {
    handleClose() {
      this.closeDialog();
    },
    alarmLevelClass(level) {
      return `level-icon-${level}`;
    }
  }
};
</script>
<style lang="scss">
.assets-alarm-detail {
  position: absolute;
  overflow: hidden;
  right: 0;
  bottom: 20px;
  width: 0;
  height: 0;
  transition: all 0.25s ease-in-out;
  background: rgba(0, 148, 255, 0.26);
  &.show {
    height: 50%;
    width: 33%;
  }
}

.assets-close {
  cursor: pointer;
  font-weight: bold;
}
.assets-alarm-detail-header {
  padding: 8px 4px;
  background: rgba(0, 148, 255, 0.26);
}
.assets-ip {
  margin-left: 20px;
}
.level-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
