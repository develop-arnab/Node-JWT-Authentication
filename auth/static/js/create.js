import { createAndAddShapeToCanvas } from "../js/CanvasHelpers/shapesHelper.js";
import { create } from "./CanvasHelpers/CreateFabricArt.js";
import { animator } from "./CanvasHelpers/CreateFabricAnimation.js";
import { loadAnimator } from "./CanvasHelpers/LoadAnimation.js";
import { loadTextAnimator } from "./CanvasHelpers/LoadTextAnimation.js";
const initCanvas = (id) => {
  return new fabric.Canvas(id, {
    width: 700,
    height: 680,
    selection: false,
    backgroundColor: "grey"
  });
};
const canvas = initCanvas("canvas");


canvas.on({
  "mouse:down": CanvasMouseEvent,
});

canvas.on({
  "selection:updated": OnAnimationSelected,
  "selection:created": OnAnimationSelected
});

function OnAnimationSelected(obj) {
  //Handle the object here
  //obj.target._AECanvas.id
  // obj.target.get('type')
  //canvas.getActiveObject().id
  //  obj?.target?._AECanvas?.id
  console.log("Animation SELECTED", obj.target?._AECanvas?.id);
  if(obj.target?._AECanvas?.id) {
    var target_id = obj.target._AECanvas.id;
    var target_id = target_id.split("-").slice(-1)[0];
    console.log("TARGETED ID : ", target_id)
  }
  if(canvas.getActiveObject().id) {
    var shape_id = canvas.getActiveObject().id
    console.log("TARGETED Shape ID : ", shape_id)
  }
}


function CanvasMouseEvent(obj) {
  console.log("MOUSE DOWN ", obj.id)
}

// const canvas = new fabric.Canvas("canvas");
document.getElementById("canvas").fabric = canvas;
console.log("initcanvas", canvas);

$(document).ready(function () {
  console.log("ready!");
  const restoreSavedCanvas = localStorage.getItem("savedItem");
  const restoreSelectedAnimation = localStorage.getItem("selectedAnim");

  const retrieveCanvasState = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/" + `retrieveCanvas`
      );
      console.log("RETURNED SEARCHED FILES", data);
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  const retrieveCanvasAndAnim = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8080/api/" + `retrieveCanvasAndAnim`
      );
      console.log("Canvas and Anim ", data);
      return data;
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  if (restoreSelectedAnimation) {
    console.log("Canvas exists");

    retrieveCanvasAndAnim().then((savedCanvasAndAnim) => {
      console.log("Received Canvas And Anim: ", savedCanvasAndAnim);

      var selectedAnim = savedCanvasAndAnim.anim[0].fileName;
      console.log("SELECTED ANIM", selectedAnim);
      const fabricImage = new create(`http://localhost:8080/${selectedAnim}`, {
        scaleX: 0.5
      });

      var restoredCanvas = {
        version: savedCanvasAndAnim.canvas[0].version,
        objects: savedCanvasAndAnim.canvas[0].objects
      };

      console.log("Restored", restoredCanvas);

      localStorage.removeItem("selectedAnim");
      canvas.loadFromJSON(restoredCanvas);
      canvas.add(fabricImage);
      canvas.requestRenderAll();
    });
  } else {
    console.log("Canvas is not found");
  }

  if (restoreSavedCanvas) {
    console.log("Canvas exists");

    retrieveCanvasState().then((savedCanvas) => {
      console.log("Received : ", savedCanvas);

      var restoredCanvas = {
        version: savedCanvas[0].version,
        objects: savedCanvas[0].objects
      };

      console.log("Restored", restoredCanvas);

      localStorage.removeItem("savedItem");
      canvas.loadFromJSON(restoredCanvas);
      canvas.requestRenderAll();
    });
  } else {
    console.log("Canvas is not found");
  }
});

function createRect() {
  const canvasCenter = canvas.getCenter();
  const rect = new fabric.Rect({
    id:"shape",
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
  createAndAddShapeToCanvas(canvas, rect);
}

window.createRect = createRect;

const createCircle = () => {
  const canvasCenter = canvas.getCenter();
  const circle = new fabric.Circle({
    id:"shape",
    radius: 50,
    fill: "#cccccc",
    left: canvasCenter.left,
    top: -50,
    originX: "center",
    originY: "center",
    cornerColor: "grey"
  });
  createAndAddShapeToCanvas(canvas, circle);
};
window.createCircle = createCircle;

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

var jsonCanvas;

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

///// Create side panel div animations ////////

const animView = document.getElementById("demo-anim");
var cowanimItem = bodymovin.loadAnimation({
  wrapper: animView,
  animType: "svg",
  loop: true,
  path: "/assets/anim/Animals/cow.json"
});

const doctorAnimView = document.getElementById("doctor-anim");
var doctoranimView = bodymovin.loadAnimation({
  wrapper: doctorAnimView,
  animType: "svg",
  loop: true,
  path: "/assets/anim/Animals/crab.json"
});

const textAnimView = document.getElementById("text-anim");
var textanimView = bodymovin.loadAnimation({
  container: textAnimView,
  renderer: "svg",
  loop: true,
  rendererSettings: {
    progressiveLoad: false
  },
  path: "/assets/anim/Text/data.json"
});

const textAnimView2 = document.getElementById("text-anim2");
var textanimView = bodymovin.loadAnimation({
  container: textAnimView2,
  renderer: "svg",
  loop: true,
  rendererSettings: {
    progressiveLoad: false
  },
  path: "/assets/anim/Text/TextComp13.json"
});

///// Initialize Animations on Canvases to be Added to the Fabric Canvas //////////

const addIconAnim = (element_id) => {
  console.log("ADDING ICON ANIM")
  console.log("CLICKKKk", element_id);
  var animationPath = ""
  var id  = ""
  if(element_id == "demo-anim") {
    id =  "One-id_IconAnim"
    animationPath = "2022-01-30T17-59-45.084Z-bat.json"

  }
  if(element_id == "doctor-anim") {
    id =  "Two-id_IconAnim"
    animationPath = "2022-01-24T20-01-36.288Z-cow.json"
  }
  const lottieCanvas = document.createElement("canvas");
  // lottieCanvas.setAttribute("elementType", "lottieCanvas");
  lottieCanvas.width = 500;
  lottieCanvas.height = 500;
  lottieCanvas.id = id;
  const animItem = loadAnimator(
    canvas,
    lottieCanvas,
    animationPath
  );

  //   console.log("ADDING ICON Demo ANIM")
  const fabricImage = new animator(lottieCanvas, {
    scaleX: 0.5,
    scaleY: 0.5,
    needsItsOwnCache: () => {
      return true;
    },
    objectCaching: true
  });
  canvas.add(fabricImage);
  canvas.requestRenderAll();
}
window.addIconAnim = addIconAnim

function addTextAnim(element_id) {
  console.log("CLICKKKk", element_id);
  var animationPath = ""
  var id  = ""
  if(element_id == "text-anim") {
    id =  "One-id_TextAnim"
    animationPath = "/assets/anim/Text/Kinetic_glyph.json"

  }
  if(element_id == "text-anim2") {
    id =  "Two-id_TextAnim"
    animationPath = "/assets/anim/Text/TextComp2.json"

  }
  const textCanvas = document.createElement("canvas");
  textCanvas.width = 1500;
  textCanvas.height = 1500;
  textCanvas.id = id;
  const textanimItem = loadTextAnimator(
    canvas,
    textCanvas,
    animationPath
  );

  const textfabricImage = new animator(textCanvas, {
    scaleX: 0.5,
    scaleY: 0.5,
    needsItsOwnCache: () => {
      return true;
    },
    objectCaching: true
  });
  canvas.add(textfabricImage);
  canvas.requestRenderAll();
}
// variable function
window.addTextAnim = addTextAnim;

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
