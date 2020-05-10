export default {
  badge: "バッジ",
  close: "閉じる",
  dataIterator: {
    noResultsText: "検索結果が見つかりません。",
    loadingText: "項目をロード中です..."
  },
  dataTable: {
    itemsPerPageText: "1ページあたりの行数：",
    ariaLabel: {
      sortDescending: "降順の並び替え。",
      sortAscending: "昇順の並び替え。",
      sortNone: "ソートされていません。",
      activateNone: "ソートを削除するには有効にしてください。",
      activateDescending: "降順の並び替えのためには有効にしてください。",
      activateAscending: "昇順のソートのためには有効にしてください。"
    },
    sortBy: "ソート方式"
  },
  dataFooter: {
    itemsPerPageText: "1ページあたりの件数：",
    itemsPerPageAll: "すべて",
    nextPage: "次のページ",
    prevPage: "前のページ",
    firstPage: "一ページ目",
    lastPage: "最後のページ",
    pageText: "{0}-{1} 件目 / {2}件"
  },
  datePicker: {
    itemsSelected: "{0}日付選択"
  },
  noDataText: "データはありません。",
  carousel: {
    prev: "前のビジュアル",
    next: "次のビジュアル",
    ariaLabel: {
      delimiter: "Carousel slide {0} of {1}"
    }
  },
  calendar: {
    moreEvents: "さらに{0}"
  },
  fileInput: {
    counter: "{0} ファイル",
    counterSize: "{0} ファイル (合計 {1})"
  },
  timePicker: {
    am: "AM",
    pm: "PM"
  },
  validate: {
    required: "このフィールドは必須です",
    lessThen: "このフィールドは{0}文字以下でなければいけません",
    moreThen: "このフィールドは{0}文字以上でなければいけません",
    isFloat: "このフィールドは浮動小数型です"
  },
  baseFromDialog: {
    open: "ダイアログを開く",
    hint: "* は必須フィールドです",
    close: "閉じる",
    save: "保存"
  },
  movieUploadDialog: {
    file: {
      title: "動画ファイル",
      hint: "動画ファイルは mp4, webm  または ogv 形式に対応しています"
    },
    name: {
      title: "表示名",
      hint: "動画ファイルを登録する際の表示名です"
    },
    fps: {
      title: "動画フレームレート",
      hint: "動画の FPS を登録してください"
    }
  },
  sidebar: {
    files: {
      title: "アノテーション",
      add: "新規ファイル",
      list: "登録ファイル"
    },
    cache: {
      destroy: "キャッシュの削除",
      export: "キャッシュの取り出し",
      import: "キャッシュの読み込み"
    }
  },
  home: {
    disc: "MP4 動画アノテーションツール",
    upload: {
      title: "動画登録",
      btn: "アップロード",
      hint: "任意の動画ファイルをアノテーション用に取り込みます"
    },
    demo: {
      title: "サンプル",
      btn: "サンプル動画読み込み",
      hint: "サンプル動画を使いアノテーション機能を試します"
    }
  },
  movieAnnotation: {
    info: {
      title: "動画詳細",
      videoStream: {
        codec: {
          title: "ビデオコーディック"
        },
        bitrate: {
          title: "ビットレート"
        },
        fps: { title: "fps" },
        tbr: {
          title: "tbr",
          help: "ビデオストリームから推測された動画フレームレート"
        },
        tbn: {
          title: "tbn",
          help: "コンテナから取得された動画ストリームのタイムベース"
        },
        tbc: {
          title: "tbc",
          help: "特定のストリームに使用されるコーデック独自のタイムベース"
        }
      },
      audioStream: {
        codec: { title: "コーディック" },
        bitrate: {
          title: "ビットレート"
        },
        channel_layout: {
          title: "チャンネルレイアウト"
        },
        sample_rate: {
          title: "サンプリングレート"
        }
      }
    }
  }
};
