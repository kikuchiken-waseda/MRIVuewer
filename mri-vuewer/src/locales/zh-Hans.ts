export default {
  badge: "徽章",
  close: "关闭",
  dataIterator: {
    noResultsText: "没有符合条件的结果",
    loadingText: "加载中……"
  },
  dataTable: {
    itemsPerPageText: "每页数目：",
    ariaLabel: {
      sortDescending: "：降序排列。",
      sortAscending: "：升序排列。",
      sortNone: "：未排序。",
      activateNone: "点击以移除排序。",
      activateDescending: "点击以降序排列。",
      activateAscending: "点击以升序排列。"
    },
    sortBy: "排序方式"
  },
  dataFooter: {
    itemsPerPageText: "每页数目：",
    itemsPerPageAll: "全部",
    nextPage: "下一页",
    prevPage: "上一页",
    firstPage: "首页",
    lastPage: "尾页",
    pageText: "{0}-{1} 共 {2}"
  },
  datePicker: {
    itemsSelected: "已选择 {0}"
  },
  noDataText: "没有数据",
  carousel: {
    prev: "上一张",
    next: "下一张",
    ariaLabel: {
      delimiter: "Carousel slide {0} of {1}"
    }
  },
  calendar: {
    moreEvents: "还有 {0} 项"
  },
  fileInput: {
    counter: "{0} 个文件",
    counterSize: "{0} 个文件（共 {1}）"
  },
  timePicker: {
    am: "AM",
    pm: "PM"
  },
  validate: {
    required: "這是必填欄",
    lessThen: "此字段必須少於{0}個字符",
    moreThen: "此字段必須超過{0}個字符",
    isFloat: "這是一個浮動字段"
  },
  movieUploadDialog: {
    file: {
      title: "您的電影",
      hint: "支持的格式是mp4，webm和ogv"
    },
    name: {
      title: "顯示名稱",
      hint: "顯示電影的名稱"
    },
    fps: {
      title: "每秒幀數",
      hint: "註冊您的視頻fps"
    }
  },
  baseFromDialog: {
    open: "打開對話框",
    hint: "*表示必填字段",
    close: "取消",
    save: "保存到"
  },
  sidebar: {
    files: {
      title: "註釋",
      add: "新文件",
      list: "註冊文件"
    },
    cache: {
      destroy: "銷毀應用程序緩存",
      export: "導出應用程序緩存",
      import: "導入應用程序緩存"
    }
  },
  home: {
    disc: "網絡視頻註釋工具",
    upload: {
      title: "註冊視頻",
      btn: "上載",
      hint: "導入任何視頻文件進行註釋"
    },
    demo: {
      title: "現場演示",
      btn: "觀看電影樣本",
      hint: "使用示例視頻嘗試註釋功能"
    }
  },
  movieAnnotation: {
    info: {
      title: "影片格式",
      videoStream: {
        codec: { title: "編解碼器" },
        bitrate: { title: "比特率" },
        fps: { title: "fps" },
        tbr: {
          title: "tbr",
          help:
            "tbr 是從視頻流中推測出來的，是用戶尋找視頻幀速率時希望看到的值"
        },
        tbn: {
          title: "tbn",
          help: "影片流中來自容器的時基"
        },
        tbc: {
          title: "tbc",
          help:
            "電影編解碼器上下文中用於特定流的編解碼器的時基"
        }
      },
      audioStream: {
        codec: { title: "編解碼器" },
        bitrate: { title: "比特率" },
        channel_layout: { title: "頻道佈局" },
        sample_rate: { title: "採樣率" }
      }
    }
  }
};
