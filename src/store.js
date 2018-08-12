/**
 * @desc このスクリプトには MRIViewer で使用するデータ型及びストアの定義をおこないます.
 */

// eslint-disable-next-line no-unused-vars
class Region {
  constructor (id, start, end, label = null, highlight = false, color = 'rgba(255,183,77, 0.3)') {
    this.id = id
    this.start = start
    this.end = end
    this.color = color
    this.data = { duration: end - start }
    this.attributes = {
      label: label,
      type: 'region',
      highlight: highlight
    }
  }
}

// eslint-disable-next-line no-unused-vars
class Point {
  constructor (id, time, frame, range, label = null, highlight = false, color = 'rgba(103, 58, 183, 0.5)') {
    this.id = id
    this.resize = false
    this.start = time - range
    this.end = time + range
    this.color = color
    this.data = { time: time, frame: frame }
    this.attributes = {
      label: label,
      type: 'point',
      highlight: highlight
    }
  }
}

// eslint-disable-next-line no-unused-vars
const DataStore = {
  debug: true, // store データ変更時に console log に表示
  url: null,
  state: {
    regions: [], points: [], marks: {}
  },
  getBasename: function () {
    if (this.url !== null) {
      const pathes = this.url.split('/')
      const fname = pathes[pathes.length - 1]
      return fname.split('.')[0]
    } else { return null }
  },
  getCachename: function () {
    if (this.url !== null) {
      return 'cache_' + this.getBasename()
    } else { return null }
  },
  getCache: function () {
    if (this.url !== null) {
      return JSON.parse(localStorage.getItem(this.getCachename()))
    } else { return null }
  },
  setURL (url) {
    this.url = url
    const cache = this.getCache()
    if (cache === null) {
      this.state.regions = []
      this.state.points = []
      this.state.marks = {}
    } else {
      this.state.points = cache.points
      this.state.regions = cache.regions
      this.state.marks = {}
    }
  },
  addRegionAction (Region) {
    this.regions.push(Region)
    if (this.debug) {
      console.log('Region: Add', Region)
    }
  },
  addPointAction (Point) {
    this.points.push(Point)
    if (this.debug) {
      console.log('Point: Add', Point)
    }
  },
  addMarkAction (Mark) {
    this.Mark.push(Mark)
    if (this.debug) {
      console.log('Mark: Add', Mark)
    }
  }
}
