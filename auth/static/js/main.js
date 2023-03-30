// import { getMultipleFiles, getIconsAnimFiles } froBASE_URLm "../services/animationsServices.js";

// const axios = require('axios')
//import { retrieveCanvasState } from "../services/animationsServices.js";
// import { BASE_URL } from "./constants";




const initCanvas = (id) => {
  return new fabric.Canvas(id, {
    width: 700,
    height: 680,
    //  width: 900,
    // height: 680,

    selection: false,
    backgroundColor: "grey"
  });
};
const canvas = initCanvas("canvas");

// const canvas = new fabric.Canvas("canvas");
document.getElementById("canvas").fabric = canvas;
console.log("initcanvas", canvas);

//////


fabric.Lottie = fabric.util.createClass(fabric.Image, {
  type: 'lottie',
  lockRotation: true,
  lockSkewingX: true,
  lockSkewingY: true,
  srcFromAttribute: false,

  initialize: function (path, options) {
    if (!options.width) options.width = 480
    if (!options.height) options.height = 480

    this.path = path
    this.tmpCanvasEl = fabric.util.createCanvasElement()
    this.tmpCanvasEl.width = options.width
    this.tmpCanvasEl.height = options.height

    this.lottieItem = lottie.loadAnimation({
      renderer: 'canvas',
      loop: true,
      autoplay: true,
      path,
      rendererSettings: {
        context: this.tmpCanvasEl.getContext('2d'),
        preserveAspectRatio: 'xMidYMid meet',
      },
    })

    // this.lottieItem.addEventListener('DOMLoaded', () => {
    //   console.log('DOMLoaded')
    // })

    this.lottieItem.addEventListener('enterFrame', (e) => {
      this.canvas?.requestRenderAll()
    })

    this.callSuper('initialize', this.tmpCanvasEl, options)
  },

  play: function () {
    this.lottieItem.play()
  },
  stop: function () {
    this.lottieItem.stop()
  },
  getSrc: function () {
    return this.path
  },
})

fabric.Lottie.fromObject = function (_object, callback) {
  const object = fabric.util.object.clone(_object)
  fabric.Image.prototype._initFilters.call(object, object.filters, function (filters) {
    object.filters = filters || []
    fabric.Image.prototype._initFilters.call(object, [object.resizeFilter], function (resizeFilters) {
      object.resizeFilter = resizeFilters[0]
      fabric.util.enlivenObjects([object.clipPath], function (enlivedProps) {
        object.clipPath = enlivedProps[0]
        const fabricLottie = new fabric.Lottie(object.src, object)
        callback(fabricLottie, false)
      })
    })
  })
}

fabric.Lottie.async = true

const fabricImage = new fabric.Lottie('./assets/anim/Animals/cow.json', {
          scaleX: 0.5,
        })
const fabricNewImage = new fabric.Lottie('./assets/anim/Animals/crab.json', {
          scaleX: 0.5,
        })
// canvas.add(fabricImage)

const addLottieAnim = () => {
  console.log("Called")
  canvas.add(fabricImage);
  canvas.requestRenderAll();
}

const addNewLottieAnim = () => {
  console.log("Called New")
  canvas.add(fabricNewImage);
  canvas.requestRenderAll();
}

$( document ).ready(function() {
  console.log( "ready!" );
  const restoreSavedCanvas = localStorage.getItem('savedItem');
  const restoreSelectedAnimation = localStorage.getItem('selectedAnim');

  const retrieveCanvasState = async () => {
    try {
      const {data} = await axios.get(
        "http://localhost:8080/api/" + `retrieveCanvas`
      );
      console.log("RETURNED SEARCHED FILES", data)
      return data;
    } catch (error) {
      console.log("error", error);
      throw error
    }
  }

  const retrieveCanvasAndAnim = async () => {
    try {
      const {data} = await axios.get(
        "http://localhost:8080/api/" + `retrieveCanvasAndAnim`
      );
      console.log("Canvas and Anim ", data)
      return data;
    } catch (error) {
      console.log("error", error);
      throw error
    }
  }

  if(restoreSelectedAnimation){
    console.log('Canvas exists');
  
    retrieveCanvasAndAnim().then((savedCanvasAndAnim) => {
      console.log("Received Canvas And Anim: ", savedCanvasAndAnim);

      var selectedAnim =  savedCanvasAndAnim.anim[0].fileName
      console.log("SELECTED ANIM", selectedAnim)
      const fabricImage = new fabric.Lottie(`http://localhost:8080/${selectedAnim}`, {
        scaleX: 0.5,
      })


      var restoredCanvas = 
      {
          version : savedCanvasAndAnim.canvas[0].version,
          objects :  savedCanvasAndAnim.canvas[0].objects
      }

      console.log("Restored", restoredCanvas)

      localStorage.removeItem("selectedAnim");
      canvas.loadFromJSON(restoredCanvas);
      canvas.add(fabricImage)
      canvas.requestRenderAll();
    });
}else{
    console.log('Canvas is not found');
}

if(restoreSavedCanvas){
    console.log('Canvas exists');
  
    retrieveCanvasState().then((savedCanvas) => {
      console.log("Received : ", savedCanvas);

      var restoredCanvas = 
      {
          version : savedCanvas[0].version,
          objects :  savedCanvas[0].objects
      }

      console.log("Restored", restoredCanvas)

      localStorage.removeItem("savedItem");
      canvas.loadFromJSON(restoredCanvas);
      canvas.requestRenderAll();
    });
}else{
    console.log('Canvas is not found');
}


});



var objectArray = new Array();

// fetch('http://localhost:8080/api/getSingleFiles', {
//   method: 'GET',
//   // body: JSON.stringify({
//   //   name : username.value,
//   //   password : password.value
//   // }),
//   headers: {
//     "Content-type" : "application/json; charset=UTF-8"
//   }
// })
// .then(function(response) {
//   console.log("DATABASE RETURN", response)
//   return response.json
// }).then(function(data) {

// });

// const getSingleFiles = async () => {
//   try {
//     const { data } = await axios.get(
//       "https://shell-create.herokuapp.com/api/" + "getSingleFiles"
//     );
//     console.log("Database Files", data);
//     return data;
//   } catch (error) {
//     throw error;
//   }
// };

// getSingleFiles();

let characterSuitsArray = [];
let characterSuitsPathArray = [];

let iconsArray = [];
let iconsPathArray = [];

let officeBoyArray = [];
let officeBoyPathArray = [];


// const getMultipleFiles = async () => {
//   try {
//     const { data } = await axios.get(
//       "https://shell-create.herokuapp.com/api/" + "getMultipleFiles"
//     );
//     characterSuitsArray = data[2].files;
//     console.log("MUltiple Files Data", characterSuitsArray);
//     characterSuitsArray.forEach((character) => {
//       console.log("CHARACTER", character);
//       characterSuitsPathArray.push(character.filePath);
//       console.log("PATHS", characterSuitsPathArray);
//     });
//     return data;
//   } catch (error) {
//     console.log("MUltiple Files Data Erro", error);
//     throw error;
//   }
// };

// getMultipleFiles();

// const getIconsAnimFiles = async () => {
//   try {
//     const { data } = await axios.get(
//       "https://shell-create.herokuapp.com/api/" + "getMultipleFiles"
//     );
//     iconsArray = data[3].files;
//     console.log("MUltiple Files Data", iconsArray);
//     iconsArray.forEach((character) => {
//       console.log("CHARACTER", character);
//       iconsPathArray.push(character.filePath);
//       console.log("ICONSPATHS", iconsPathArray);
//     });
//     return data;
//   } catch (error) {
//     console.log("MUltiple Files Data Erro", error);
//     throw error;
//   }
// };

// const getOfficeBoyAnimFiles = async () => {
//   try {
//     const { data } = await axios.get(
//       "https://shell-create.herokuapp.com/api/" + "getMultipleFiles"
//     );
//     officeBoyArray = data[4].files;
//     console.log("MUltiple Files Data", officeBoyArray);
//     officeBoyArray.forEach((officeBoy) => {
//       console.log("CHARACTER", officeBoy);
//       officeBoyPathArray.push(officeBoy.filePath);
//       console.log("ICONSPATHS", officeBoyPathArray);
//     });
//     return data;
//   } catch (error) {
//     console.log("MUltiple Files Data Erro", error);
//     throw error;
//   }
// };

// Search Box --> display Animations from API
// $(document).ready(function () {
//   const createAnimalsDivs = async () => {
//     console.log("DOMLAODED");
//     await getMultipleFiles().then((data) => {
//       characterSuitsArray = data[2].files;
//       console.log("MUltiple Files Data", characterSuitsArray);
//       characterSuitsArray.forEach((character) => {
//         console.log("CHARACTER", character);
//         characterSuitsPathArray.push(character.filePath);
//         console.log("PATHS", characterSuitsPathArray);
//       });
//     });
    
//     console.log("DOM HAS LOADED ARRAY", characterSuitsPathArray);
//     characterSuitsPathArray.forEach(function (item, index) {
//       $("#animal-column").append(
//         `<div id="animal-${index}" class="dummy-media-object">
//   </div>`
//       );
//       console.log("THE JSON FILE IS AT", item);
//       var animalDiv = document.getElementById(`animal-${index}`);
//       var searchAnimItem = bodymovin.loadAnimation({
//         wrapper: animalDiv,
//         animType: "svg",
//         loop: true,
//         path: `https://shell-create.herokuapp.com/${item}`
//       });

//       const animalCanvas = document.createElement("canvas");
//       animalCanvas.width = 1000;
//       animalCanvas.height = 1000;

//       const animalAnimItem = bodymovin.loadAnimation({
//         renderer: "canvas",
//         loop: true,
//         autoplay: true,
//         // animationData: JSON.parse(JSON.stringify(doctorAnimationData)),
//         path: `https://shell-create.herokuapp.com/${item}`,
//         rendererSettings: {
//           context: animalCanvas.getContext("2d"), // the canvas context
//           preserveAspectRatio: "xMidYMid meet"
//           //   clearCanvas: true,
//         }
//       });
//       document.querySelector(`#animal-${index}`).onclick = () => {
//         const fabricImage = new fabric.AEAnimation(animalCanvas, {
//           scaleX: 0.5,
//           scaleY: 0.5,
//           needsItsOwnCache: () => {
//             return true;
//           },
//           objectCaching: true
//         });
//         canvas.add(fabricImage);
//         canvas.requestRenderAll();
//       };
//     });
//   };
//   // createAnimalsDivs();

//   const createIconDivs = async () => {
//     console.log("DOMLAODED");
//     await getIconsAnimFiles().then((data) =>{
//             iconsArray = data[3].files;
//       console.log("MUltiple Files Data", iconsArray);
//       iconsArray.forEach((character) => {
//         console.log("CHARACTER", character);
//         iconsPathArray.push(character.filePath);
//         console.log("ICONSPATHS", iconsPathArray);
//       });
//     })
//     console.log("DOM HAS LOADED ARRAY", iconsPathArray);
//     iconsPathArray.forEach(function (item, index) {
//       $("#icons-column").append(
//         `<div id="icon-${index}" class="dummy-media-object">
// </div>`
//       );
//       console.log("THE JSON FILE IS AT", item);
//       var iconsDiv = document.getElementById(`icon-${index}`);
//       var searchAnimItem = bodymovin.loadAnimation({
//         wrapper: iconsDiv,
//         animType: "svg",
//         loop: true,
//         path: `https://shell-create.herokuapp.com/${item}`
//       });

//       const iconCanvas = document.createElement("canvas");
//       iconCanvas.width = 1000;
//       iconCanvas.height = 1000;

//       const animalAnimItem = bodymovin.loadAnimation({
//         renderer: "canvas",
//         loop: true,
//         autoplay: true,
//         // animationData: JSON.parse(JSON.stringify(doctorAnimationData)),
//         path: `https://shell-create.herokuapp.com/${item}`,
//         rendererSettings: {
//           context: iconCanvas.getContext("2d"), // the canvas context
//           preserveAspectRatio: "xMidYMid meet"
//           //   clearCanvas: true,
//         }
//       });
//       document.querySelector(`#icon-${index}`).onclick = () => {
//         const fabricImage = new fabric.AEAnimation(iconCanvas, {
//           scaleX: 0.5,
//           scaleY: 0.5,
//           needsItsOwnCache: () => {
//             return true;
//           },
//           objectCaching: true
//         });
//         canvas.add(fabricImage);
//         canvas.requestRenderAll();
//       };
      
//     });
//   };
//   // createIconDivs();


//   const createOfficeBoyDivs = async () => {
//     console.log("DOMLAODED");
//     await getOfficeBoyAnimFiles();
//     console.log("DOM HAS LOADED ARRAY", officeBoyPathArray);
//     officeBoyPathArray.forEach(function (item, index) {
//       $("#officeBoy-column").append(
//         `<div id="officeBoy-${index}" class="dummy-media-object">
// </div>`
//       );
//       console.log("THE JSON FILE IS AT", item);
//       var officeBoyDiv = document.getElementById(`officeBoy-${index}`);
//       var searchAnimItem = bodymovin.loadAnimation({
//         wrapper: officeBoyDiv,
//         animType: "svg",
//         loop: true,
//         path: `https://shell-create.herokuapp.com/${item}`
//       });

//       const officeBoyCanvas = document.createElement("canvas");
//       officeBoyCanvas.width = 1000;
//       officeBoyCanvas.height = 1000;

//       const animalAnimItem = bodymovin.loadAnimation({
//         renderer: "canvas",
//         loop: true,
//         autoplay: true,
//         // animationData: JSON.parse(JSON.stringify(doctorAnimationData)),
//         path: `https://shell-create.herokuapp.com/${item}`,
//         rendererSettings: {
//           context: officeBoyCanvas.getContext("2d"), // the canvas context
//           preserveAspectRatio: "xMidYMid meet"
//           //   clearCanvas: true,
//         }
//       });
//       document.querySelector(`#officeBoy-${index}`).onclick = () => {
//         const fabricImage = new fabric.AEAnimation(officeBoyCanvas, {
//           scaleX: 0.5,
//           scaleY: 0.5,
//           needsItsOwnCache: () => {
//             return true;
//           },
//           objectCaching: true
//         });
//         canvas.add(fabricImage);
//         canvas.requestRenderAll();
//       };
      
//     });
//   };
//   // createOfficeBoyDivs();
// });

const createRect = (canvas) => {
  $("li").removeClass("actived");
  canvas.discardActiveObject();

  const canvasCenter = canvas.getCenter();

  const rect = new fabric.Rect({
    width: 100,
    height: 100,
    fill: "#333",
    left: canvasCenter.left,
    top: canvasCenter.top,
    originX: "center",
    originY: "center",
    cornerColor: "blue",
    objectCaching: false
  });
  canvas.add(rect);
  objectArray.push(rect);
  canvas.setActiveObject(rect);
  canvas.renderAll();
  rect.animate("top", canvasCenter.top, {
    onChange: canvas.renderAll.bind(canvas)
  });

  // layer
  var id = canvas.getObjects().length - 1;
  $("#containerLayers").prepend(
    '<li id="' +
      id +
      '" class="ui-state-default circle actived"><span contenteditable="true" class="ui-icon ui-icon-arrow-2-n-s"></span> item ' +
      id +
      "</li>"
  );
  var layerContainer = document.querySelector("ul");

  $("#" + id).click(function (evt) {
    $("#containerLayers").sortable("destroy");
    if ($(this).hasClass("actived")) {
      // remove active state of all layers and objects
      $("li").removeClass("actived");
      //   $('li').setAttribute("contentEditable", true);
      layerContainer.contentEditable = true;
      canvas.discardActiveObject();
      canvas.renderAll();
    } else {
      // remove active state of all layers and objects
      $("li").removeClass("actived");
      canvas.discardActiveObject();
      canvas.renderAll();
      // activate layer and object
      $(this).addClass("actived");
      //   $('li').setAttribute("contentEditable", true);

      var obj = canvas.item(id);
      layerContainer.contentEditable = true;
      canvas.setActiveObject(obj);
      canvas.renderAll();
    }
  });

  rect.on("selected", () => {
    console.log("RECT SELECTED", rect);
    $("li").removeClass("actived");
    $("#" + id).addClass("actived");
    $("#width").val((rect.width * rect.scaleX).toFixed(2));
    $("#height").val((rect.height * rect.scaleY).toFixed(2));
    $("#color-picker")[0].jscolor.fromString(rect.fill);
  });

  rect.on("deselected", () => {
    console.log("RECT DESELECTED", rect);
  });
};

canvas.on("mouse:down", function () {
  var obj = canvas.getActiveObject();
  if (!obj) {
    $("li").removeClass("actived");
  }
});

const createCircle = (canvas) => {
  // $("li").removeClass("actived");
  // canvas.discardActiveObject();

  const canvasCenter = canvas.getCenter();
  const circle = new fabric.Circle({
    radius: 50,
    fill: "#cccccc",
    left: canvasCenter.left,
    top: -50,
    originX: "center",
    originY: "center",
    cornerColor: "grey"
  });
  canvas.add(circle);
  objectArray.push(circle);
  canvas.setActiveObject(circle);
  canvas.renderAll();

  circle.animate("top", canvas.height - 45, {
    onChange: canvas.renderAll.bind(canvas),
    onComplete: () => {
      circle.animate("top", canvasCenter.top, {
        onChange: canvas.renderAll.bind(canvas),
        easing: fabric.util.ease.easeOutBounce,
        duration: 400
      });
    }
  });

  // layer
  var id = canvas.getObjects().length - 1;
  $("#containerLayers").prepend(
    '<li id="' +
      id +
      '" class="ui-state-default circle actived"><span class="ui-icon ui-icon-arrow-2-n-s"></span> item ' +
      id +
      "</li>"
  );
  $("#" + id).click(function (evt) {
    $("#containerLayers").sortable("destroy");
    if ($(this).hasClass("actived")) {
      // remove active state of all layers and objects
      $("li").removeClass("actived");
      canvas.discardActiveObject();
      canvas.renderAll();
    } else {
      // remove active state of all layers and objects
      $("li").removeClass("actived");
      canvas.discardActiveObject();
      canvas.renderAll();
      // activate layer and object
      $(this).addClass("actived");
      var obj = canvas.item(id);
      canvas.setActiveObject(obj);
      canvas.renderAll();
    }
  });

  circle.on("selected", () => {
    console.log("RECT SELECTED", circle);
    $("li").removeClass("actived");
    $("#" + id).addClass("actived");
    $("#width").val((circle.width * circle.scaleX).toFixed(2));
    $("#height").val((circle.height * circle.scaleY).toFixed(2));
    $("#color-picker")[0].jscolor.fromString(circle.fill);
  });
};
$("#containerLayers").on("mousedown", function () {
  $("#containerLayers").sortable({
    // cancel: 'span',
    change: function (event, ui) {
      console.log(event, ui);
      $("#containerLayers li").each(function (index, list) {
        console.log("LIST", list, "index", index, "OBJECTS", objectArray);
        if (objectArray[$(list).attr("id")]) {
          canvas.moveTo(objectArray[$(list).attr("id")], index);
        }
      });
      canvas.renderAll();
    }
  });
});
$("#containerLayers").disableSelection();

function objectMovedListener(ev) {
  let target = ev.target;
  console.log(
    "left",
    target.left,
    "top",
    target.top,
    "width",
    target.width * target.scaleX,
    "height",
    target.height * target.scaleY
  );
  document.getElementById("width").value = (
    target.width * target.scaleX
  ).toFixed(2);
  document.getElementById("height").value = (
    target.height * target.scaleY
  ).toFixed(2);
}

// canvas.on('object:added', objectAddedListener);
canvas.on("object:modified", objectMovedListener);

let currentMode;
const modes = {
  pan: "pan",
  drawing: "drawing"
};

const toggleMode = (mode) => {
  if (mode === modes.pan) {
    if (currentMode === modes.pan) {
      currentMode = "";
    } else {
      currentMode = modes.pan;
      canvas.isDrawingMode = false;
      canvas.renderAll();
    }
  } else if (mode === modes.drawing) {
    if (currentMode === modes.drawing) {
      currentMode = "";
      canvas.isDrawingMode = false;
      canvas.renderAll();
    } else {
      console.log(canvas.freeDrawingBrush.color);
      // canvas.freeDrawingBrush.color = color
      // canvas.freeDrawingBrush.width = 15

      currentMode = modes.drawing;
      canvas.isDrawingMode = true;
      canvas.renderAll();
    }
  }

  console.log(mode);
};
let color = "#000";
const setColorListener = () => {
  const picker = document.getElementById("color-picker");
  picker.addEventListener("change", (event) => {
    console.log("COLOR", event.target.value);
    color = event.target.value;
    // canvas.freeDrawingBrush.color = color;
    // canvas.freeDrawingBrush.width = 15;
    canvas.getActiveObject().set("fill", color);
    canvas.renderAll();
  });
};
setColorListener();

// const getsearchedAnimatons = () => {
  
//   console.log(inputBox.value)
// } 


(function () {
  var oldVal;

  $("#width").on("change textInput input", function () {
    var val = this.value;
    if (val !== oldVal) {
      oldVal = val;
      const scale = canvas.getActiveObject().getObjectScaling();
      console.log("Width", val);
      canvas.getActiveObject().set("width", val / scale.scaleX);
      canvas.getActiveObject().setCoords();
      canvas.renderAll();
    }
  });
})();

const svgState = {};
const clearCanvas = (canvas, svgState) => {
  svgState.val = canvas.toSVG();
  let obj = canvas.getObjects();
  console.log(obj);

  obj.forEach((o) => {
    // if(o !== canvas.backgroundImage) {
    //   canvas.remove(o)
    // }
    canvas.remove(o);
  });
};

const restoreCanvas = (canvas, svgState) => {
  if (svgState.val) {
    fabric.loadSVGFromString(svgState.val, (objects) => {
      console.log(objects);
      // objects = objects.filter((o) => o["xlink:href"] !== bgUrl);
      canvas.add(...objects);
      canvas.requestRenderAll();
    });
  }
};

var imageSaver = document.getElementById("lnkDownload");
imageSaver.addEventListener("click", saveImage, false);

function saveImage(e) {
  this.href = canvas.toDataURL({
    format: "png",
    quality: 0.8
  });
  console.log("Href", this.href);
  this.download = "canvas.png";
}

var canvasSaver = document.getElementById("saveCanvasButton");
canvasSaver.addEventListener("click", saveCanvas, false);

var jsonCanvas ;

function saveCanvas(e) {
  jsonCanvas = JSON.stringify(canvas);
  console.log("Saved Canvas", jsonCanvas);
}

var canvasLoader = document.getElementById("loadCanvasButton");
canvasLoader.addEventListener("click", loadCanvas, false);

function loadCanvas() {
  // canvas.clear();
  console.log("Called Load CANVAS", jsonCanvas);
  // canvas.loadFromJSON(jsonCanvas, (objects) => {
  //   console.log("Objects", objects);
  //   // objects = objects.filter((o) => o["xlink:href"] !== bgUrl);
  //   canvas.add(...objects);
  //   canvas.requestRenderAll();
  //   console.log("LOADED CANVAS", jsonCanvas);
  // }).catch(console.error("Error"));
//  canvas.clear();
  canvas.loadFromJSON(jsonCanvas);
  canvas.requestRenderAll();
}


var canvas_to_capture = $("canvas#canvas")[0];
var fps = 30,
  mediaRecorder;

function create_stream() {
  var canvasStream = canvas_to_capture.captureStream(fps);
  //create media recorder from the MediaStream object
  mediaRecorder = new MediaRecorder(canvasStream);
  var chunks = [];
  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data);
  };
  //create dynamic video tag to
  mediaRecorder.onstop = function (e) {
    var blob = new Blob(chunks, { type: "video/mp4" });
    chunks = [];
    var videoURL = URL.createObjectURL(blob);
    var tag = document.createElement("a");
    tag.href = videoURL;
    tag.download = "sample.mp4";
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
  };
  //build the data chunk
  mediaRecorder.ondataavailable = function (e) {
    chunks.push(e.data);
  };
  //start recording
  mediaRecorder.start();
}

var recordToggle = false;

const record = () => {
  if (!recordToggle) {
    startRecording();
    recordToggle = true;
  } else {
    stopRecording();
    recordToggle = false;
  }
};
const startRecording = () => {
  create_stream();
};
const stopRecording = () => {
  mediaRecorder.stop();
};

const animView = document.getElementById("demo-anim");
var cowanimItem = bodymovin.loadAnimation({
  wrapper: animView,
  animType: "svg",
  loop: true,
  path: "./assets/anim/Animals/cow.json"
});

const doctorAnimView = document.getElementById("doctor-anim");
var doctoranimView = bodymovin.loadAnimation({
  wrapper: doctorAnimView,
  animType: "svg",
  loop: true,
  path: "./assets/anim/Animals/crab.json"
});

const textAnimView = document.getElementById("text-anim");
var textanimView = bodymovin.loadAnimation({
  container: textAnimView,
  renderer: "svg",
  loop: true,
  rendererSettings: {
    progressiveLoad: false
  },
  path: "./assets/anim/Text/TextComp13.json"
});

const textAnimView2 = document.getElementById("text-anim2");
var textanimView = bodymovin.loadAnimation({
  container: textAnimView2,
  renderer: "svg",
  loop: true,
  rendererSettings: {
    progressiveLoad: false
  },
  path: "./assets/anim/Text/TextComp2.json"
});

fabric.AEAnimation = fabric.util.createClass(fabric.Image, {
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
    return fabric.util.object.extend(this.callSuper('toObject'));
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

// fabric.AEAnimation.fromObject = function(object, callback) {
//   fabric.util.loadImage(object.src, function(img) {
//     callback && callback(new fabric.AEAnimation(img, object));
//   });
// };

// fabric.AEAnimation.fromObject = function (_object, callback) {
//   const object = fabric.util.object.clone(_object)
//   fabric.Image.prototype._initFilters.call(object, object.filters, function (filters) {
//     object.filters = filters || []
//     fabric.Image.prototype._initFilters.call(object, [object.resizeFilter], function (resizeFilters) {
//       object.resizeFilter = resizeFilters[0]
//       fabric.util.enlivenObjects([object.clipPath], function (enlivedProps) {
//         object.clipPath = enlivedProps[0]
//         const fabricLottie = new fabric.AEAnimation(object.src, object)
//         callback(fabricLottie, false)
//       })
//     })
//   })
// }

// used to recreate an animation when canvases are restored
fabric.AEAnimation.fromObject = (obj, callback) => {

  let animationData = JSON.stringify(obj);
  console.log("ParsingAE", jsonCanvas);
  //const animationDataParsed = JSON.parse(animationData)
  //console.log('fabric.AEAnimation.fromObject parsing:')
  //console.log(obj)
  // const animationWidth = animationData.w
  // const animationHeight = animationData.h
  // temporary canvas
  let temp_canvas = document.createElement('canvas')
  temp_canvas.width = 100;
 // animationWidth;
  temp_canvas.height = 100;
  //animationHeight;
  
  // canvas.getContext('2d').setTransform(0.5,0,0,0.5,30,30)
  //const svgContainer = document.getElementById('svgContainer')
  let animItem = bodymovin.loadAnimation({
  renderer: 'canvas',
  loop:true,
  autoplay: true,
  animationData: jsonCanvas,
 // path: "./assets/anim/Animals/cow.json",
  rendererSettings: {
  context: temp_canvas.getContext('2d'), // the canvas context
  preserveAspectRatio: 'xMidYMid meet',
  // clearCanvas: false,
  }
  });
  animItem.addEventListener('DOMLoaded', () => {
  window.tempEl = animItem
  callback && callback(new fabric.AEAnimation(temp_canvas, animItem, obj, ));
  })
  
  //return fabric.Object._fromObject('AeAnimation', object, callback);
  
  };

  fabric.AEAnimation.async = true;
// function(options) {
//   return new fabric.AEAnimation(options);
// }

const lottieCanvas = document.createElement("canvas");
lottieCanvas.width = 500;
lottieCanvas.height = 500;

const doctorCanvas = document.createElement("canvas");
doctorCanvas.width = 1000;
doctorCanvas.height = 1000;

const textCanvas = document.createElement("canvas");
textCanvas.width = 2000;
textCanvas.height = 2000;

const textCanvas2 = document.createElement("canvas");
textCanvas2.width = 1000;
textCanvas2.height = 1000;

const textanimItem = bodymovin.loadAnimation({
  renderer: "canvas",
  loop: true,
  autoplay: false,
  // animationData: JSON.parse(JSON.stringify(doctorAnimationData)),
  path: "./assets/anim/Text/TextComp13.json",
  rendererSettings: {
    context: textCanvas.getContext("2d"), // the canvas context
    preserveAspectRatio: "xMidYMid meet"
    //   clearCanvas: true,
  }
});

const textanimItem2 = bodymovin.loadAnimation({
  renderer: "canvas",
  loop: true,
  autoplay: false,
  // animationData: JSON.parse(JSON.stringify(doctorAnimationData)),
  path: "./assets/anim/Text/TextComp2.json",
  rendererSettings: {
    context: textCanvas2.getContext("2d"), // the canvas context
    preserveAspectRatio: "xMidYMid meet"
    //   clearCanvas: true,
  }
});

const doctoranimItem = bodymovin.loadAnimation({
  renderer: "canvas",
  loop: true,
  autoplay: false,
  // animationData: JSON.parse(JSON.stringify(doctorAnimationData)),
  path: "./assets/anim/Animals/crab.json",
  rendererSettings: {
    context: doctorCanvas.getContext("2d"), // the canvas context
    preserveAspectRatio: "xMidYMid meet"
    //   clearCanvas: true,
  }
});

const animItem = bodymovin.loadAnimation({
  renderer: "canvas",
  loop: true,
  autoplay: false,
  //   animationData: JSON.parse(JSON.stringify(animationData)),
  // path: "https://shell-create.herokuapp.com/uploads/2022-01-24T20-01-36.288Z-cow.json",
 // path: "./assets/anim/Animals/cow.json",
 path : 'http://localhost:8080/uploads/2022-01-30T17-59-45.084Z-bat.json',
  rendererSettings: {
    context: lottieCanvas.getContext("2d"), // the canvas context
    preserveAspectRatio: "xMidYMid meet"
    // clearCanvas: false,
  }
});

const slider = document.querySelector("#slider");

animItem.addEventListener("enterFrame", (e) => {
  // console.log('enterFrame', animItem.currentFrame, animItem.timeCompleted, animItem.frameRate)
  console.log("current time", animItem.currentFrame / animItem.frameRate);
  slider.value = e.currentTime;
  canvas.requestRenderAll();
});
animItem.addEventListener("DOMLoaded", () => {
  window.tempEl = animItem;
  animItem.goToAndStop(1, true);
  console.log("total frames", animItem.getDuration(false));
  slider.max = animItem.getDuration(true);
  console.log(animItem.renderer.canvasContext.canvas === lottieCanvas);
});

doctoranimItem.addEventListener("enterFrame", (e) => {
  // console.log('enterFrame', doctoranimItem.currentFrame, doctoranimItem.timeCompleted, doctoranimItem.frameRate)
  console.log(
    "current time",
    doctoranimItem.currentFrame / doctoranimItem.frameRate
  );
  slider.value = e.currentTime;
  canvas.requestRenderAll();
});
doctoranimItem.addEventListener("DOMLoaded", () => {
  window.tempEl = doctoranimItem;
  doctoranimItem.goToAndStop(1, true);
  console.log("total frames", doctoranimItem.getDuration(false));
  slider.max = doctoranimItem.getDuration(true);
  console.log(doctoranimItem.renderer.canvasContext.canvas === doctorCanvas);
});

textanimItem.addEventListener("enterFrame", (e) => {
  // console.log('enterFrame', textanimItem.currentFrame, textanimItem.timeCompleted, textanimItem.frameRate)
  console.log(
    "current time",
    textanimItem.currentFrame / textanimItem.frameRate
  );
  slider.value = e.currentTime;
  canvas.requestRenderAll();
});
textanimItem.addEventListener("DOMLoaded", () => {
  window.tempEl = textanimItem;
  textanimItem.goToAndStop(1, true);
  console.log("total frames", textanimItem.getDuration(false));
  slider.max = textanimItem.getDuration(true);
  console.log(textanimItem.renderer.canvasContext.canvas === doctorCanvas);
});

textanimItem2.addEventListener("enterFrame", (e) => {
  // console.log('enterFrame', textanimItem.currentFrame, textanimItem.timeCompleted, textanimItem.frameRate)
  console.log(
    "current time",
    textanimItem2.currentFrame / textanimItem2.frameRate
  );
  slider.value = e.currentTime;
  canvas.requestRenderAll();
});
textanimItem2.addEventListener("DOMLoaded", () => {
  window.tempEl = textanimItem2;
  textanimItem2.goToAndStop(1, true);
  console.log("total frames", textanimItem2.getDuration(false));
  slider.max = textanimItem2.getDuration(true);
  console.log(textanimItem2.renderer.canvasContext.canvas === doctorCanvas);
});

const addAnimText = () => {
  var mainTitle = document.getElementById("animationText").value;
  var subTitle = document.getElementById("animationText2").value;
  console.log("DOMLoadedNOW",  (textanimItem.renderer)," TEXT SEARCH :" ,textanimItem.assets[0].layers[0].t.d.k[0].s.t);
  console.log("DOMLoadedNOW",  (textanimItem.renderer.elements[4]));
  // console.log("ANIMATION DATA : ",textanimItem ," TEXT SEARCH :" ,textanimItem.assets[0].layers[0].t.d.k[0].s.t)
  // textanimItem.renderer.elements[0].elements[0].updateDocumentData({
  //   t: subTitle, fc : "#000000"
  // });
  // textanimItem.renderer.elements[2].elements[0].updateDocumentData({
  //   t: subTitle
  // },0);
  // textanimItem.renderer.elements[1].elements[0].updateDocumentData({
  //   t: mainTitle,s:40, fc : "#000000"
  // },0);
  // textanimItem.renderer.elements[3].elements[0].updateDocumentData({
  //   t: mainTitle,s:40, fc : "#000000"
  // },0);
  textanimItem.renderer.elements[4].elements[0].updateDocumentData({
    t: mainTitle
  },0);
  // textanimItem.renderer.elements[5].elements[0].updateDocumentData({
  //   t: mainTitle, fc : "#000000"
  // });

  // textanimItem.renderer.elements[4].updateDocumentData({
  //   t: subTitle
  // });
  // textanimItem.renderer.elements[5].updateDocumentData({
  //   t: subTitle
  // });
  textanimItem.renderer.elements[6].elements[0].updateDocumentData({
    t: subTitle
  });
  // textanimItem.renderer.elements[7].updateDocumentData({
  //   t: mainTitle
  // });
    textanimItem.renderer.elements[8].elements[0].updateDocumentData({
    t: mainTitle
  });
};

document.querySelector("#demo-anim").onclick = () => {
  const fabricImage = new fabric.AEAnimation(lottieCanvas, {
    scaleX: 0.5,
    scaleY: 0.5,
    needsItsOwnCache: () => {
      return true;
    },
    objectCaching: true
  });
  canvas.add(fabricImage);
  canvas.requestRenderAll();
};

document.querySelector("#doctor-anim").onclick = () => {
  const doctorfabricImage = new fabric.AEAnimation(doctorCanvas, {
    scaleX: 0.5,
    scaleY: 0.5,
    needsItsOwnCache: () => {
      return true;
    },
    objectCaching: true
  });
  canvas.add(doctorfabricImage);
  canvas.requestRenderAll();
};

document.querySelector("#text-anim").onclick = () => {
  const textfabricImage = new fabric.AEAnimation(textCanvas, {
    scaleX: 0.5,
    scaleY: 0.5,
    needsItsOwnCache: () => {
      return true;
    },
    objectCaching: true
  });
  canvas.add(textfabricImage);
  canvas.requestRenderAll();
};

document.querySelector("#text-anim2").onclick = () => {
  const textfabricImage2 = new fabric.AEAnimation(textCanvas2, {
    scaleX: 0.5,
    scaleY: 0.5,
    needsItsOwnCache: () => {
      return true;
    },
    objectCaching: true
  });
  canvas.add(textfabricImage2);
  canvas.requestRenderAll();
};

document.querySelector("#play").onclick = () => {
  doctoranimItem.play();
  animItem.play();
  textanimItem.play();
};
document.querySelector("#pause").onclick = () => {
  doctoranimItem.pause();
  animItem.pause();
  textanimItem.pause();
};
document.querySelector("#stop").onclick = () => {
  doctoranimItem.stop();
  animItem.stop();
  textanimItem.stop();
};
slider.oninput = (e) => {
  console.log(
    e.target.value,
    parseInt(e.target.value, 10) / 25,
    doctoranimItem.frameModifier
  );
  doctoranimItem.goToAndStop((parseInt(e.target.value, 10) / 25) * 1000, false);
};

const addDemoText = () => {
  canvas.add(textbox).setActiveObject(textbox);
};

var fonts = ["LuckiestGuy-Regular", "AirbnbCerealBlack", "AirbnbCerealBook"];

var textbox = new fabric.Textbox("Lorum ipsum dolor sit amet", {
  left: 50,
  top: 50,
  width: 150,
  fontSize: 20
});

var select = document.getElementById("font-family");
fonts.forEach(function (font) {
  var option = document.createElement("option");
  option.innerHTML = font;
  option.value = font;
  select.appendChild(option);
});

document.getElementById("font-family").onchange = function () {
  if (this.value !== "Times New Roman") {
    loadAndUse(this.value);
  } else {
    canvas.getActiveObject().set("fontFamily", this.value);
    canvas.requestRenderAll();
  }
};
function loadAndUse(font) {
  var myfont = new FontFaceObserver(font);
  myfont
    .load()
    .then(function () {
      // when font is loaded, use it.
      canvas.getActiveObject().set("fontFamily", font);
      canvas.requestRenderAll();
    })
    .catch(function (e) {
      console.log(e);
      alert("font loading failed " + font);
    });
}

/*==================== SHOW NAVBAR ====================*/
const showMenu = (headerToggle, navbarId) => {
  const toggleBtn = document.getElementById(headerToggle),
    nav = document.getElementById(navbarId);

  // Validate that variables exist
  if (headerToggle && navbarId) {
    toggleBtn.addEventListener("click", () => {
      // We add the show-menu class to the div tag with the nav__menu class
      nav.classList.toggle("show-menu");
      // change icon
      toggleBtn.classList.toggle("bx-x");
    });
  }
};
showMenu("header-toggle", "navbar");

/*==================== LINK ACTIVE ====================*/
const linkColor = document.querySelectorAll(".nav__link");

function colorLink() {
  linkColor.forEach((l) => l.classList.remove("active"));
  this.classList.add("active");
}

linkColor.forEach((l) => l.addEventListener("click", colorLink));


