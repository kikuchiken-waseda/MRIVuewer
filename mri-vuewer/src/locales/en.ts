export default {
  badge: "Badge",
  close: "Close",
  dataIterator: {
    noResultsText: "No matching records found",
    loadingText: "Loading items..."
  },
  dataTable: {
    itemsPerPageText: "Rows per page:",
    ariaLabel: {
      sortDescending: "Sorted descending.",
      sortAscending: "Sorted ascending.",
      sortNone: "Not sorted.",
      activateNone: "Activate to remove sorting.",
      activateDescending: "Activate to sort descending.",
      activateAscending: "Activate to sort ascending."
    },
    sortBy: "Sort by"
  },
  dataFooter: {
    itemsPerPageText: "Items per page:",
    itemsPerPageAll: "All",
    nextPage: "Next page",
    prevPage: "Previous page",
    firstPage: "First page",
    lastPage: "Last page",
    pageText: "{0}-{1} of {2}"
  },
  datePicker: {
    itemsSelected: "{0} selected"
  },
  noDataText: "No data available",
  carousel: {
    prev: "Previous visual",
    next: "Next visual",
    ariaLabel: {
      delimiter: "Carousel slide {0} of {1}"
    }
  },
  calendar: {
    moreEvents: "{0} more"
  },
  fileInput: {
    counter: "{0} files",
    counterSize: "{0} files ({1} in total)"
  },
  timePicker: {
    am: "AM",
    pm: "PM"
  },
  validate: {
    required: "This field is required",
    lessThen: "This field must be less than {0} characters",
    moreThen: "This field must be more than {0} characters",
    isFloat: "This is a float field"
  },
  movieUploadDialog: {
    file: {
      title: "Your movie",
      hint: "supported format is mp4, webm and ogv"
    },
    name: {
      title: "Display name",
      hint: "Display name of your movie"
    },
    fps: {
      title: "FPS",
      hint: "Register your video fps"
    }
  },
  baseFromDialog: {
    open: "Open Dialog",
    hint: "*indicates required field",
    close: "Close",
    save: "Save"
  },
  sidebar: {
    files: {
      title: "Annotation",
      add: "File upload",
      list: "Registered files"
    },
    cache: {
      destroy: "Destroy an app cache",
      export: "Export an app cache",
      import: "Import an app cache"
    }
  },
  home: {
    disc: "Annotation tool for web videos",
    upload: {
      title: "Register your video",
      btn: "Upload",
      hint: "Import your video file for annotation"
    },
    demo: {
      title: "Live demo",
      btn: "Go to a sample movie",
      hint:
        "Try the annotation function using a sample video"
    }
  },
  movieAnnotation: {
    info: {
      title: "video format",
      videoStream: {
        codec: {
          title: "codec"
        },
        bitrate: {
          title: "bitrate"
        },
        fps: { title: "fps" },
        tbr: {
          title: "tbr",
          help:
            "tbr is guessed from the video stream and is the value users want to see when they look for the video frame rate"
        },
        tbn: {
          title: "tbn",
          help:
            "the time base in AVStream that has come from the container"
        },
        tbc: {
          title: "tbc",
          help:
            "the time base in AVCodecContext for the codec used for a particular stream"
        }
      },
      audioStream: {
        bitrate: {
          title: "bitrate"
        },
        channel_layout: {
          title: "channel layout"
        },
        codec: { title: "codec" },
        sample_rate: {
          title: "sampling rate"
        }
      }
    }
  }
};
