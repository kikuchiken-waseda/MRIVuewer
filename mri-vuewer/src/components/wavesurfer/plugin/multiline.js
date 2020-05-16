let TIERS = {};
/**
 * @typedef {Object} MultilinePluginParams
 * @desc Extends the `WavesurferParams` wavesurfer was initialised with
 * @property {!string|HTMLElement} container CSS selector or HTML element where
 * the multiline should be drawn. This is the only required parameter.
 * @property {number} notchPercentHeight=90 Height of notches in percent
 * that do not have labels
 * @property {string} Color='#000' The color of the main notches
 * @property {string} FontColor='#000' The color of the labels next to
 * the main notches
 * @property {number} labelPadding=5 The padding between the label and the notch
 * @property {?number} zoomDebounce A debounce timeout to increase rendering
 * performance for large files
 * @property {string} fontFamily='Arial'
 * @property {number} fontSize=10 Font size of labels in pixels
 * getDuration() for setting length of multiline
 * @property {function} formatTimeCallback (sec, pxPerSec) -> label
 * @property {?number} offset Offset for the multiline start in seconds. May also be
 * negative.
 * @property {?boolean} deferInit Set to true to manually call
 * `initPlugin('multiline')`
 */

/**
 * Adds a multi annotation tier to the waveform.
 *
 * @implements {PluginClass}
 * @extends {Observer}
 * @example
 * // es6
 * import Multiline from 'wavesurfer.multiline.js';
 *
 * // commonjs
 * var Multiline = require('wavesurfer.multiline.js');
 *
 * // if you are using <script> tags
 * var Multiline = window.WaveSurfer.multiline;
 *
 * // ... initialising wavesurfer with the plugin
 * var wavesurfer = WaveSurfer.create({
 *   // wavesurfer options ...
 *   plugins: [
 *     Multiline.create({
 *       // plugin options ...
 *     })
 *   ]
 * });
 */
export default class MultilinePlugin {
  /**
   * Multiline plugin definition factory
   *
   * This function must be used to create a plugin definition which can be
   * used by wavesurfer to correctly instantiate the plugin.
   *
   * @param  {MultilineParams} params parameters use to initialise the plugin
   * @return {PluginDefinition} an object representing the plugin
   */
  static create(params) {
    return {
      name: "multiline",
      deferInit: params && params.deferInit ? params.deferInit : false,
      params: params,
      instance: MultilinePlugin
    };
  }

  // event handlers
  /** @private */
  _onScroll = () => {
    if (this.wrapper && this.drawer.wrapper) {
      this.wrapper.scrollLeft = this.drawer.wrapper.scrollLeft;
    }
  };

  /**
   * @private
   * @returns {void}
   */
  _onRedraw = () => this.render();

  /** @private */
  _onReady = () => {
    const ws = this.wavesurfer;
    this.drawer = ws.drawer;
    this.pixelRatio = ws.drawer.params.pixelRatio;
    this.isDragging = false;
    this.draggingItemIdx = null;

    const wsp = ws.params;
    this.duration = this.wavesurfer.backend.getDuration();
    const width =
      wsp.fillParent && !wsp.scrollParent
        ? this.drawer.getWidth()
        : this.drawer.wrapper.scrollWidth * wsp.pixelRatio;
    this.pixelsPerSecond = width / this.duration;

    this.maxCanvasWidth = ws.drawer.maxCanvasWidth || ws.drawer.width;
    this.maxCanvasElementWidth =
      ws.drawer.maxCanvasElementWidth ||
      Math.round(this.maxCanvasWidth / this.pixelRatio);

    // add listeners
    ws.drawer.wrapper.addEventListener("scroll", this._onScroll);
    ws.on("redraw", this._onRedraw);
    ws.on("zoom", this._onZoom);
    this.render();
  };

  /**
   * @private
   * @param {object} e Click event
   */
  _onWrapperClick = e => {
    e.preventDefault();
    const relX = "offsetX" in e ? e.offsetX : e.layerX;
    const time = relX / this.pixelsPerSecond;
    const idx = this.getCurrentItemIndex(time);
    for (const i in this.items) {
      this.items[i].color = null;
      if (i == idx) {
        if (this.tierType == "interval") {
          this.items[idx].color = this.params.focusColor;
        } else {
          this.items[idx].color = this.params.focusPointColor;
        }
        this.lastIdx = idx;
      }
    }
    this.updateCanvases();
    this.updateCanvasesPositioning();
    this.renderCanvases();
    this.wavesurfer.seekTo(time / this.duration);
    const payload = {
      name: this.name,
      id: Number(idx),
      item: this.items[idx]
    };
    this.wavesurfer.fireEvent("multiline-update-current", payload);
  };

  /**
   * @private
   * @param {object} e Click event
   */
  _onDblClick = e => {
    e.preventDefault();
    const relX = "offsetX" in e ? e.offsetX : e.layerX;
    const time = relX / this.pixelsPerSecond;
    this.addItem({ time: time, text: "", color: null });
  };
  /**
   * @private
   * @param {object} e Mousemove event
   */
  _onMouseMove = e => {
    e.preventDefault();
    const relX = "offsetX" in e ? e.offsetX : e.layerX;
    const time = relX / this.pixelsPerSecond;
    if (this.isCollisioned(time)) {
      if (time.toFixed(this.params.csd) > 0) {
        document.body.style.cursor = "col-resize";
      }
      if (this.tierType == "point") {
        this.lastIdx = this.getCurrentItemIndex(time);
      }
    } else {
      if (!this.isDragging) {
        document.body.style.cursor = "default";
      } else if (this.draggingItemIdx > 0) {
        this.items[this.draggingItemIdx].time = time;
        this.items = this.items.sort((a, b) => {
          return a.time - b.time;
        });
        this.wavesurfer.fireEvent("multiline-update-tiers");
        this.updateCanvases();
        this.updateCanvasesPositioning();
        this.renderCanvases();
      }
    }
  };

  /**
   * @private
   * @param {object} e Click event
   */
  _onMouseUp = e => {
    e.preventDefault();
    if (this.isDragging) {
      this.isDragging = false;
      document.body.style.cursor = "default";
    }
  };

  /**
   * @private
   * @param {object} e Click event
   */
  _onMouseDown = e => {
    e.preventDefault();
    const relX = "offsetX" in e ? e.offsetX : e.layerX;
    const time = relX / this.pixelsPerSecond;
    this.isDragging = false;
    if (this.isCollisioned(time)) {
      if (time.toFixed(this.params.csd) > 0) {
        this.draggingItemIdx = this.getCurrentItemIndex(time);
        this.isDragging = true;
      }
    }
  };

  /**
   * @private
   * @param {object} e Click event
   */
  _onMouseOut = e => {
    e.preventDefault();
    document.body.style.cursor = "default";
    for (const i in this.items) {
      this.items[i].color = null;
    }
    this.updateCanvases();
    this.updateCanvasesPositioning();
    this.renderCanvases();
    this.wrapper.style.backgroundColor = null;
  };

  /**
   * @private
   * @param {object} e Click event
   */
  _onKeyDown = e => {
    if (e.key != "Shift") {
      e.preventDefault();
      if (e.key != "Control") {
        if (e.key != "Alt") {
          if (e.key == "Backspace") {
            this._onKeyBackSpace();
          } else if (e.key == "Tab") {
            this._onTab();
          }
          this.onCtrl = false;
        } else {
          this.onCtrl = true;
        }
      } else {
        this.onCtrl = true;
      }
    }
  };

  /**
   * @private
   * @param {object} e Click event
   */
  _onKeyBackSpace = () => {
    if (this.lastIdx) {
      if (this.onCtrl === true) {
        this.deleteItem(this.lastIdx);
      } else {
        this.items[this.lastIdx].text = this.items[this.lastIdx].text.slice(
          0,
          -1
        );
        this.items = this.items.sort((a, b) => {
          return a.time - b.time;
        });
        this.updateCanvases();
        this.updateCanvasesPositioning();
        this.renderCanvases();
        const payload = {
          name: this.name,
          id: Number(this.lastIdx),
          item: this.items[this.lastIdx]
        };
        this.wavesurfer.fireEvent("multiline-update-tiers");
        this.wavesurfer.fireEvent("multiline-update-tiers", payload);
      }
    }
  };

  _onTab = () => {
    let lastTime;
    if (this.lastIdx != this.items.length - 1) {
      lastTime = this.items[this.lastIdx + 1].time;
    } else {
      lastTime = this.duration;
    }
    if (this.wavesurfer.isPlaying()) {
      this.wavesurfer.pause();
    } else {
      this.wavesurfer.play(this.items[this.lastIdx].time, lastTime);
      this.fireEvent("play");
      this.wavesurfer.fireEvent("region-play", this);
    }
  };

  /**
   * Creates an instance of Multiline.
   *
   * You probably want to use Multiline.create()
   *
   * @param {MultilineParams} params Plugin parameters
   * @param {object} ws Wavesurfer instance
   */
  constructor(params, ws) {
    /** @private */
    this.wavesurfer = ws;
    /** @private */
    this.util = ws.util;

    /** @private */
    this.container =
      "string" == typeof params.container
        ? document.querySelector(params.container)
        : params.container;
    if (!this.container) {
      throw new Error("No container for wavesurfer multiline");
    } else {
      this.wavesurfer.getTierNum = () => {
        return this.container.children.length;
      };
      this.wavesurfer.getTiers = () => {
        const res = [];
        for (const key in this.tiers) {
          res.push({
            name: this.tiers[key].name,
            tierType: this.tiers[key].tierType,
            items: this.tiers[key].items
          });
        }
        return res;
      };
    }

    /** @private */
    this.name =
      "string" == typeof params.name ? params.name : String(params.name);
    if (!this.name) {
      throw new Error("No name for wavesurfer multiline");
    }

    /** @private */
    this.tierType = "string" == typeof params.tierType ? params.tierType : null;
    if (!this.tierType) {
      throw new Error("No tierType for wavesurfer multiline");
    }
    // check tierType
    if (this.tierType != "interval" && this.tierType != "point") {
      throw new Error(`${this.tierType} is not supported tierType`);
    }

    this.tiers = TIERS;
    this.tiers[this.name] = this;

    this.items = [];
    if (params.items) {
      for (const item of params.items) {
        if (item.time) {
          this.items.push(item);
        }
      }
    }
    this.wavesurfer.fireEvent("multiline-update-tiers");

    /** @private */
    this.params = this.util.extend(
      {},
      {
        csd: 1, //collisionSignificantDigits
        height: 50,
        notchPercentHeight: 90,
        labelPadding: 5,
        focusBgColor: "#CFD8DC",
        focusColor: "#FFE082",
        focusPointColor: "#F44336",
        Color: "#000000",
        fontFamily: "Arial",
        fontSize: 10,
        zoomDebounce: false,
        formatTimeCallback: this.defaultFormatTimeCallback,
        offset: 0
      },
      params
    );

    /** @private */
    this.canvases = [];
    /** @private */
    this.wrapper = null;
    /** @private */
    this.drawer = null;
    /** @private */
    this.pixelRatio = null;
    /** @private */
    this.maxCanvasWidth = null;
    /** @private */
    this.maxCanvasElementWidth = null;
    /** @private */
    this.onCtrl = false;
    /** @private */
    this.lastIdx = null;
    /**
     * This event handler has to be in the constructor function because it
     * relies on the debounce function which is only available after
     * instantiation
     *
     * Use a debounced function if `params.zoomDebounce` is defined
     *
     * @private
     * @returns {void}
     */
    this._onZoom = this.params.zoomDebounce
      ? this.wavesurfer.util.debounce(
          () => this.render(),
          this.params.zoomDebounce
        )
      : () => this.render();
  }

  /**
   * Initialisation function used by the plugin API
   */
  init() {
    // Check if ws is ready
    if (this.wavesurfer.isReady) {
      this._onReady();
    } else {
      this.wavesurfer.once("ready", this._onReady);
    }
  }

  /**
   * Destroy function used by the plugin API
   */
  destroy() {
    this.unAll();
    this.wavesurfer.un("redraw", this._onRedraw);
    this.wavesurfer.un("zoom", this._onZoom);
    this.wavesurfer.un("ready", this._onReady);
    this.wavesurfer.drawer.wrapper.removeEventListener(
      "scroll",
      this._onScroll
    );
    if (this.wrapper && this.wrapper.parentNode) {
      this.wrapper.removeEventListener("click", this._onWrapperClick);
      this.wrapper.parentNode.removeChild(this.wrapper);
      this.wrapper = null;
    }
  }
  /**
   * get current item by time
   * @param {number} time Current time.
   * @return {Object} an object of this tier.
   */
  getCurrentItem(time) {
    if (this.tierType == "interval") {
      const item = this.items.find(x => {
        return time.toFixed(this.params.csd) == x.time.toFixed(this.params.csd);
      });
      if (item) {
        return item;
      } else {
        const array = this.items.filter(x => {
          return time >= x.time;
        });
        return array.length > 0 ? array[array.length - 1] : undefined;
      }
    } else {
      const array = this.items.map(x => {
        return {
          check: Math.abs(x.time - time),
          item: x
        };
      });
      array.sort((a, b) => {
        return a.check - b.check;
      });
      return array.length > 0 ? array[0].item : undefined;
    }
  }
  getCurrentItemIndex(time) {
    const item = this.getCurrentItem(time);
    if (item) {
      return this.items.findIndex(x => {
        return x.time == item.time;
      });
    }
    return null;
  }
  findItemByTime(time) {
    return this.items.find(item => {
      return item.time == time;
    });
  }
  findItemIndexByTime(time) {
    return this.items.findIndex(item => {
      return item.time == time;
    });
  }
  addItem(item) {
    if (item.time) {
      this.items.push(item);
      this.items = this.items.sort((a, b) => {
        return a.time - b.time;
      });
      this.wavesurfer.fireEvent("multiline-update-tiers");
      this.updateCanvases();
      this.updateCanvasesPositioning();
      this.renderCanvases();
    }
  }
  deleteItem(idx) {
    this.items.splice(idx, 1);
    this.items = this.items.sort((a, b) => {
      return a.time - b.time;
    });
    this.wavesurfer.fireEvent("multiline-update-tiers");
    this.updateCanvases();
    this.updateCanvasesPositioning();
    this.renderCanvases();
  }
  putText(idx, text, isRender = true) {
    this.items = this.items.sort((a, b) => {
      a.time - b.time;
    });
    this.items[idx].text = text;
    this.wavesurfer.fireEvent("multiline-update-tiers");
    if (isRender === true) {
      this.updateCanvases();
      this.updateCanvasesPositioning();
      this.renderCanvases();
    }
  }
  isCollisioned(time) {
    return this.items.some(x => {
      return time.toFixed(this.params.csd) == x.time.toFixed(this.params.csd);
    });
  }
  /**
   * Create a multiline element to wrap the canvases drawn by this plugin
   *
   * @private
   */
  createWrapper() {
    const wsParams = this.wavesurfer.params;
    this.wrapper = this.container.appendChild(
      document.createElement(`multiline-${this.name}`)
    );
    this.util.style(this.wrapper, {
      display: "block",
      position: "relative",
      userSelect: "none",
      webkitUserSelect: "none",
      height: `${this.params.height}px`
    });
    const tiers = this.container.children;
    if (tiers.length == 1) {
      this.util.style(this.wrapper, {
        "border-top": "solid 1px gray",
        "border-bottom": "solid 1px gray"
      });
    } else {
      this.util.style(this.wrapper, {
        "border-bottom": "solid 1px gray"
      });
    }
    if (wsParams.fillParent || wsParams.scrollParent) {
      this.util.style(this.wrapper, {
        width: "100%",
        overflowX: "hidden",
        overflowY: "hidden"
      });
    }
    this.wrapper.addEventListener("click", this._onWrapperClick);
  }

  /**
   * Render the multiline (also updates the already rendered multiline)
   *
   * @private
   */
  render() {
    if (!this.wrapper) {
      this.createWrapper();
    }
    this.updateCanvases();
    this.updateCanvasesPositioning();
    this.renderCanvases();
  }

  /**
   * Add new multiline canvas
   *
   * @private
   */
  addCanvas() {
    const canvas = this.wrapper.appendChild(document.createElement("canvas"));
    canvas.addEventListener("dblclick", this._onDblClick, false);
    canvas.addEventListener("mousemove", this._onMouseMove, false);
    canvas.addEventListener("mousedown", this._onMouseDown, false);
    canvas.addEventListener("mouseup", this._onMouseUp, false);
    canvas.addEventListener(
      "mouseover",
      () => {
        canvas.focus();
        this.wrapper.style.backgroundColor = this.params.focusBgColor;
      },
      false
    );
    canvas.addEventListener("mouseout", this._onMouseOut, false);
    canvas.addEventListener("keydown", this._onKeyDown, false);
    canvas.setAttribute("tabindex", 0);

    this.canvases.push(canvas);
    this.util.style(canvas, {
      position: "absolute",
      zIndex: 4
    });
  }

  /**
   * Remove multiline canvas
   *
   * @private
   */
  removeCanvas() {
    const canvas = this.canvases.pop();
    canvas.parentElement.removeChild(canvas);
  }

  /**
   * Make sure the correct of multiline canvas elements exist and are cached in
   * this.canvases
   *
   * @private
   */
  updateCanvases() {
    const totalWidth = Math.round(this.drawer.wrapper.scrollWidth);
    const requiredCanvases = Math.ceil(totalWidth / this.maxCanvasElementWidth);
    while (this.canvases.length < requiredCanvases) {
      this.addCanvas();
    }
    while (this.canvases.length > requiredCanvases) {
      this.removeCanvas();
    }
  }

  /**
   * Update the dimensions and positioning style for all the multiline canvases
   *
   * @private
   */
  updateCanvasesPositioning() {
    // cache length for performance
    const canvasesLength = this.canvases.length;
    this.canvases.forEach((canvas, i) => {
      // canvas width is the max element width, or if it is the last the
      // required width
      const canvasWidth =
        i === canvasesLength - 1
          ? this.drawer.wrapper.scrollWidth -
            this.maxCanvasElementWidth * (canvasesLength - 1)
          : this.maxCanvasElementWidth;
      // set dimensions and style
      canvas.width = canvasWidth * this.pixelRatio;
      // on certain pixel ratios the canvas appears cut off at the bottom,
      // therefore leave 1px extra
      canvas.height = (this.params.height + 1) * this.pixelRatio;
      this.util.style(canvas, {
        width: `${canvasWidth}px`,
        height: `${this.params.height}px`,
        left: `${i * this.maxCanvasElementWidth}px`
      });
    });
  }

  /**
   * Render the multiline labels and notches
   *
   * @private
   */
  renderCanvases() {
    if (this.duration <= 0) {
      return;
    }
    const wsParams = this.wavesurfer.params;
    const width =
      wsParams.fillParent && !wsParams.scrollParent
        ? this.drawer.getWidth()
        : this.drawer.wrapper.scrollWidth * wsParams.pixelRatio;
    const height = this.params.height * this.pixelRatio;
    const fontSize = this.params.fontSize * wsParams.pixelRatio;

    this.setFillStyles(this.params.Color);
    this.setFonts(`${fontSize}px ${this.params.fontFamily}`);

    // render items
    this.fillLine(0, 0, 1, height);
    for (const i in this.items) {
      const item = this.items[i];
      const curPixel = this.pixelsPerSecond * item.time;
      if (this.tierType == "interval") {
        if (item.color) {
          let rectDuration;
          if (i < this.items.length - 1) {
            rectDuration = this.items[i + 1].time - item.time;
          } else {
            rectDuration = this.duration - item.time;
          }
          const rectWidth = rectDuration * this.pixelsPerSecond;
          this.fillRect(curPixel, 0, rectWidth, height, item.color);
        }
        this.fillLine(curPixel, 0, 1, height);
        this.fillText(item.text, curPixel, height / 2, fontSize);
      } else {
        if (item.text) {
          if (item.color) {
            this.fillText(
              item.text,
              curPixel,
              height / 2,
              fontSize,
              item.color
            );
            this.fillLine(curPixel, 0, 3, height / 4, item.color);
          } else {
            this.fillText(item.text, curPixel, height / 2, fontSize);
            this.fillLine(curPixel, 0, 1, height / 4);
          }
        } else {
          if (item.color) {
            this.fillLine(curPixel, 0, 3, height, item.color);
          } else {
            this.fillLine(curPixel, 0, 1, height);
          }
        }
      }
    }
    this.fillLine(width, 0, 1, height);
  }

  /**
   * Set the canvas fill style
   *
   * @param {DOMString|CanvasGradient|CanvasPattern} fillStyle Fill style to
   * use
   * @private
   */
  setFillStyles(fillStyle) {
    this.canvases.forEach(canvas => {
      canvas.getContext("2d").fillStyle = fillStyle;
    });
  }

  getFillStyles() {
    this.canvases.forEach(canvas => {
      return canvas.getContext("2d").fillStyle;
    });
  }

  /**
   * Set the canvas font
   *
   * @param {DOMString} font Font to use
   * @private
   */
  setFonts(font) {
    this.canvases.forEach(canvas => {
      canvas.getContext("2d").font = font;
    });
  }

  fillRect(x, y, width, height, color) {
    this.setFillStyles(color);
    this.canvases.forEach((canvas, i) => {
      const leftOffset = i * this.maxCanvasWidth;
      const intersection = {
        x: Math.max(x, i * this.maxCanvasWidth),
        y2: y + height
      };
      canvas
        .getContext("2d")
        .fillRect(intersection.x - leftOffset, y, width, intersection.y2 - y);
    });
    this.setFillStyles(this.params.Color);
  }
  /**
   * Draw a rectangle on the canvases
   *
   * (it figures out the offset for each canvas)
   *
   * @param {number} x X-position
   * @param {number} y Y-position
   * @param {number} width Width
   * @param {number} height Height
   * @private
   */
  fillLine(x, y, width, height, color) {
    this.setFillStyles(color);
    this.canvases.forEach((canvas, i) => {
      const leftOffset = i * this.maxCanvasWidth;
      const intersection = {
        x1: Math.max(x, i * this.maxCanvasWidth),
        y1: y,
        x2: Math.min(x + width, i * this.maxCanvasWidth + canvas.width),
        y2: y + height
      };
      if (intersection.x1 < intersection.x2) {
        canvas
          .getContext("2d")
          .fillRect(
            intersection.x1 - leftOffset,
            intersection.y1,
            intersection.x2 - intersection.x1,
            intersection.y2 - intersection.y1
          );
      } else {
        canvas
          .getContext("2d")
          .fillRect(
            intersection.x1 - 1 - leftOffset,
            intersection.y1,
            1,
            intersection.y2 - intersection.y1
          );
      }
    });
    this.setFillStyles(this.params.Color);
  }

  /**
   * Fill a given text on the canvases
   *
   * @param {string} text Text to render
   * @param {number} x X-position
   * @param {number} y Y-position
   * @param {number} fs fontSize
   * @private
   */
  fillText(text, x, y, fs, color) {
    this.setFillStyles(color);
    let textWidth;
    let xOffset = 0;
    this.canvases.forEach(canvas => {
      const context = canvas.getContext("2d");
      const canvasWidth = context.canvas.width;
      if (xOffset > x + textWidth) {
        return;
      }
      if (xOffset + canvasWidth > x) {
        textWidth = context.measureText(text).width;
        let _x = x - textWidth / 2;
        if (this.tierType == "interval") {
          _x = x + fs / 2;
        }
        const _y = y + fs / 2;
        context.fillText(text, _x - xOffset, _y);
      }
      xOffset += canvasWidth;
      this.setFillStyles(this.params.Color);
    });
  }
}
