export const loadTextAnimator = (canvas, textCanvas, path) => {
  const textanimItem = bodymovin.loadAnimation({
    renderer: "canvas",
    loop: true,
    autoplay: false,
    // animationData: JSON.parse(JSON.stringify(doctorAnimationData)),
    path: path,
    rendererSettings: {
      context: textCanvas.getContext("2d"), // the canvas context
      preserveAspectRatio: "xMidYMid meet"
      //   clearCanvas: true,
    }
  });

  var isSelected = false;

  canvas.on({
    "selection:updated": HandleElement,
    "selection:created": HandleElement,
    "before:selection:cleared": HandleDeselection
  });

  function HandleElement(obj) {
    // Handle the object here
    console.log("OBJ SELECTED ", obj.target._AECanvas.id);
    console.log("OBJ SELECTED cURRENT obj ", textCanvas.id);
    if (obj.target._AECanvas.id == textCanvas.id) {
      isSelected = true;
    } else {
      isSelected = false;
    }
  }

  function HandleDeselection(obj) {
    console.log("OBJ DESELECTED ", obj.target.get("type"));
    if (obj.target._AECanvas.id == textCanvas.id) {
      isSelected = false;
    }
  }

  textanimItem.addEventListener("enterFrame", (e) => {
    // console.log('enterFrame', textanimItem.currentFrame, textanimItem.timeCompleted, textanimItem.frameRate)
    // console.log(
    //   "current time",
    //   textanimItem.currentFrame / textanimItem.frameRate
    // );
    slider.value = e.currentTime;
    canvas.requestRenderAll();
  });
  textanimItem.addEventListener("DOMLoaded", () => {
    window.tempEl = textanimItem;
    textanimItem.goToAndStop(1, true);
    console.log("total frames", textanimItem.getDuration(false));
    slider.max = textanimItem.getDuration(true);
    // console.log(textanimItem.renderer.canvasContext.canvas === textCanvas);
  });

    document.getElementById("play").addEventListener("click", function (e) {
      console.log("It was clicked");
      textanimItem.play();
    });
    document.getElementById("pause").addEventListener("click", function (e) {
      console.log("It was clicked");
      textanimItem.pause();
    });
    document.getElementById("stop").addEventListener("click", function (e) {
      console.log("It was clicked");
      textanimItem.stop();
    });
    document
      .getElementById("addAnimText")
      .addEventListener("click", function (e) {
        console.log("addAnimText");
        var mainTitle = document.getElementById("animationText").value;
        var subTitle = document.getElementById("animationText2").value;
        console.log(
          "DOMLoadedNOW",
          textanimItem.renderer,
          " TEXT SEARCH :",
          textanimItem.assets[0].layers[0].t.d.k[0].s.t
        );

        var compsMap = {};

        textanimItem.renderer.elements.forEach((element, i) => {
          // console.log("ALL ", i);
          if (element.data.nm) {
            if (element.data.nm in compsMap) {
              compsMap[`${element.data.nm}`] = {
                layers: compsMap[`${element.data.nm}`]["layers"] + 1,
                index: [...compsMap[`${element.data.nm}`]["index"], i]
              };
              // compsMap[`${element.data.nm}`].index.push(i)
              // console.log("ALL Grouped", compsMap);
            } else {
              compsMap[`${element.data.nm}`] = { layers: 1, index: [i] };
              // compsMap[`${element.data.nm}`].index.push(i)
              // console.log("ALL Grouped", compsMap);
            }
          }
        });
        console.log("ALL Grouped Done", compsMap);

        if (isSelected) {
          Object.values(compsMap).forEach((element, i) => {
            // $('#input-container').append(`<input id="user-text-${i}" placeholder="Enter your text..." class="header__input"/>`)
            console.log("On Selected Click ", element);

            element.index.forEach((layerIndex) => {
              if (
                textanimItem.renderer.elements[layerIndex].hasOwnProperty(
                  "elements"
                )
              ) {
                textanimItem.renderer?.elements[
                  layerIndex
                ]?.elements[0]?.updateDocumentData({
                  t: mainTitle,
                  // s: 2000,
                  fc: "#000000"
                });
              }
            });
          });
        }
      });
};
