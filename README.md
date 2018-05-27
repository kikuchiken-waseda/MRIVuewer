# MRIViwer

このアプリケーションは MRI 動画を始めとする調音運動系動画のアノテーションツールです.
類似のアプリケーションとしては Praat や ELAN などが存在しますが,
動画を前提とし, 音声のスペクトルグラムをうまく表示できる適当なツールが存在しないため,
新規に作成しました．

2018 年度秋期音響学会で発表予定です.

## 機能

動画と同期してスペクトルグラム表示を行います．
また, 種々アノテーションを行うことが可能です.
現状では, アノテーション結果は csv での吐き出しを考えていますが,
最終的には DB 連携を行う予定です.

## 動作環境

OS: linux, windows, mac, 
推奨ブラウザ: firefox
動画ファイル: mp4

基本的にはブラウザアプリであるので OS 環境は問いません.
ただし, chrome の場合, 右クリック時の挙動に難があります.

## 概要

- 開発言語: javascript (js)
- フレームワーク:  Vue, wavesufer.js
- UI フレームワーク:  Vuetify
- 開発時ブラウザ: Firefox

基本的には js + HTML のみで動作します.
共有含めて考えた場合, node 依存しにくいので,
しばらくはピュアな形で js を記述します.

UI に関しては CSS を組んだり, icon 作成したりが面倒なので,
特別な UI フレームワークを使用します.

### 基本操作

- 巻き戻しボタン(外): 開始地点に移動
- 巻き戻しボタン(内): 1 フレーム分の時間移動
- 再生ボタン: 現在値から動画を再生
- リロードボタン: 明るさ等の設定を反映
- 早送りボタン(外): 終了地点に移動
- 早送りボタン(内): 1 フレーム分の時間戻る

### アノテーション

音声波形レイヤーの上にマウスを置くと,
種々のアノテーションを行うことができます.

- click: 時刻の変更
- drag: 範囲付きアノテーション
- ctrl + click: 点指定アノテーション

種々操作を行うと右側のリストに情報が付け加えられます.
それそれのリストは以下の意味を持ちます.

- Regions: 開始, 終了時刻を持つ転記情報
  - contents フィールド: 文字を入力し, Enter を押すとラベルを付与することができます.
  - 再生ボタン: 該当範囲のみを再生
  - 削除ボタン: ラベル情報を削除
  - ダウンロードボタン:  現在の Region を csv 形式にてダウンロード
- Points: ある1時刻に対する転記情報
  - contents フィールド: 文字を入力し, Enter を押すとラベルを付与することができます.
  - 編集ボタン: 指定時刻の画像に対し画像アノテーションを開始

      1. 画面が遷移し, 現在の画像が表示されます
      2. 任意の点をクリックするとマークをつけることができます

  - 削除ボタン: ラベル情報を削除
  - ダウンロードボタン:  現在の Points を csv 形式にてダウンロード

### ファイル操作

ナビゲーションバー左のメニューをクリックするとファイル一覧が表示されます.
ここから任意のファイルを選択すれば表示対象の動画が変更されます.

リストにファイルを追加する場合 ./misc 以下に動画ファイルを追加して,
src/main.js の 2 行目以降を追加してください.
これは以下の形式の構造体です.

```
const files = [
  {
    url: <path to your mp4>, fps: <the fps of this video>
  },
  ...
]
```

## 諸注意
### ネットワーク

JS のライブラリを再配布したくはないので,
ブラウザ起動時に読み込みを行います.

そのため, ブラウザ表示時には, インターネットに接続している必要があります.

- ただし, それ以外での通信は一切していないです.
- ある程度開発が進行した段階でネットワーク接続は不必要にするつもりです.

### ブラウザ対応

基本的に windows, Mac 標準ブラウザはテストしていません.
また, 今後ともサポート対象にする気はあまりありません.

また, chrome を使用している場合,
ファイル参照時に問題が発生するかもしれません.
これは chrome がセキュリティの問題からローカルファイル参照を推奨していないためです.

簡単な解決策として, Mac, Linux を使用している場合,
ターミナルからこのレポジトリディレクトリに移動し,
以下のコマンドを入力すると簡易サーバーが起動します.

```
$ python3 -m http.server
```

- windows の場合, デフォルトでは python が入っていないです.
    - python3 をインストールすれば同様のことが可能です
    - ただし面倒な場合には Firefox を使用することをおすすめします.

## 参考

- wavesufer.js:
  - 公式: https://cdnjs.com/libraries/wavesurfer.js
  - github: https://github.com/katspaugh/wavesurfer.js
  - cdn: https://wavesurfer-js.org/docs/methods.html

- vue:
  - 公式: https://jp.vuejs.org/index.html
  - github: https://github.com/vuejs/vue
  - cdn: https://cdn.jsdelivr.net/npm/vue/dist/vue.js

- vuetify:
  - 公式: https://vuetifyjs.com/ja/getting-started/quick-start
  - github: https://github.com/vuetifyjs/vuetify
  - cdn: https://unpkg.com/vuetify/dist/vuetify.js

- Material design icons:
  - 本アプリケーションのアイコンは上記のものを前提とします.
  - 公式: https://material.io/tools/icons/?icon=play_circle_outline&style=baseline
