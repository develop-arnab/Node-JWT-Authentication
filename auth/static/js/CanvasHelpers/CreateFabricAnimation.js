export const animator = fabric.util.createClass(fabric.Image, {
    type: "AEAnimation",
    initialize: function (AECanvas, options) {
      options = options || {};
      this.callSuper("initialize", AECanvas, options);
      this._AECanvas = AECanvas;
    },
    drawCacheOnCanvas: function (ctx) {
      // ctx.scale(1 / this.zoomX, 1 / this.zoomY);
      // ctx.drawImage(this._AECanvas, -this.cacheTranslationX, -this.cacheTranslationY);
      // ctx.scale(1 / this.zoomX, 1 / this.zoomY);
      ctx.drawImage(this._AECanvas, -this.width / 2, -this.height / 2);
    },
    _createCacheCanvas: function () {
      console.log("override!!!");
      this._cacheProperties = {};
      this._cacheCanvas = this._AECanvas;
      console.log(this._cacheCanvas);
      this._cacheContext = this._cacheCanvas.getContext("2d");
      // debugger
      // this._updateCacheCanvas();
      // if canvas gets created, is empty, so dirty.
      this.dirty = true;
    },
    toObject: function () {
      return fabric.util.object.extend(this.callSuper("toObject"));
    },
  
    // toObject: function(options) {
    //   return fabric.util.object.extend(this.callSuper('toObject'), {
    //     name: this.get('name'),
    //     selectable: this.get('selectable'),
    //     roomNumText: this.get('roomNumText'),
    //     label: this.get('label'),
    //     lbl_font: this.get('lbl_font'),
    //     rnr_font: this.get('rnr_font'),
    //     lbl_color: this.get('lbl_color'),
    //     idoit_type: this.get('idoit_type')
    //   });
    //   },
    render: function (ctx) {
      // do not render if width/height are zeros or object is not visible
      if (this.isNotVisible()) {
        return;
      }
      if (
        this.canvas &&
        this.canvas.skipOffscreen &&
        !this.group &&
        !this.isOnScreen()
      ) {
        return;
      }
      ctx.save();
      this._setupCompositeOperation(ctx);
      this.drawSelectionBackground(ctx);
      this.transform(ctx);
      this._setOpacity(ctx);
      this._setShadow(ctx, this);
      if (this.transformMatrix) {
        ctx.transform.apply(ctx, this.transformMatrix);
      }
      this.clipTo && fabric.util.clipContext(this, ctx);
      if (this.shouldCache()) {
        if (!this._cacheCanvas) {
          console.log("create cache");
          this._createCacheCanvas();
        }
        // if (this.isCacheDirty()) {
        //   console.log('cache dirty')
        //   this.statefullCache && this.saveState({ propertySet: 'cacheProperties' });
        //   this.drawObject(this._cacheContext);
        //   this.dirty = false;
        // }
        // console.log('draw cache')
        this.drawCacheOnCanvas(ctx);
      } else {
        console.log("remove cache and draw");
        this._removeCacheCanvas();
        this.dirty = false;
        this.drawObject(ctx);
        if (this.objectCaching && this.statefullCache) {
          this.saveState({ propertySet: "cacheProperties" });
        }
      }
      this.clipTo && ctx.restore();
      ctx.restore();
    }
  });
  
  // animator.fromObject = function(object, callback) {
  //   fabric.util.loadImage(object.src, function(img) {
  //     callback && callback(new animator(img, object));
  //   });
  // };
  
  // animator.fromObject = function (_object, callback) {
  //   const object = fabric.util.object.clone(_object)
  //   fabric.Image.prototype._initFilters.call(object, object.filters, function (filters) {
  //     object.filters = filters || []
  //     fabric.Image.prototype._initFilters.call(object, [object.resizeFilter], function (resizeFilters) {
  //       object.resizeFilter = resizeFilters[0]
  //       fabric.util.enlivenObjects([object.clipPath], function (enlivedProps) {
  //         object.clipPath = enlivedProps[0]
  //         const fabricLottie = new animator(object.src, object)
  //         callback(fabricLottie, false)
  //       })
  //     })
  //   })
  // }
  
  // used to recreate an animation when canvases are restored
  animator.fromObject = (obj, callback) => {
    let animationData = JSON.stringify(obj);
    console.log("ParsingAE", jsonCanvas);
    //const animationDataParsed = JSON.parse(animationData)
    //console.log('animator.fromObject parsing:')
    //console.log(obj)
    // const animationWidth = animationData.w
    // const animationHeight = animationData.h
    // temporary canvas
    let temp_canvas = document.createElement("canvas");
    temp_canvas.width = 100;
    // animationWidth;
    temp_canvas.height = 100;
    //animationHeight;
  
    // canvas.getContext('2d').setTransform(0.5,0,0,0.5,30,30)
    //const svgContainer = document.getElementById('svgContainer')
    let animItem = bodymovin.loadAnimation({
      renderer: "canvas",
      loop: true,
      autoplay: true,
      animationData: jsonCanvas,
      // path: "./assets/anim/Animals/cow.json",
      rendererSettings: {
        context: temp_canvas.getContext("2d"), // the canvas context
        preserveAspectRatio: "xMidYMid meet"
        // clearCanvas: false,
      }
    });
    animItem.addEventListener("DOMLoaded", () => {
      window.tempEl = animItem;
      callback && callback(new animator(temp_canvas, animItem, obj));
    });
  
    //return fabric.Object._fromObject('AeAnimation', object, callback);
  };
  
  animator.async = true;
  // function(options) {
  //   return new animator(options);
  // }