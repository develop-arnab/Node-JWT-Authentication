export const loadAnimator = (canvas, lottieCanvas, path) => {
  const loadAnimation = bodymovin.loadAnimation({
    renderer: "canvas",
    loop: true,
    autoplay: true,
    //   animationData: JSON.parse(JSON.stringify(animationData)),
    // path: "https://shell-create.herokuapp.com/uploads/2022-01-24T20-01-36.288Z-cow.json",
    // path: "./assets/anim/Animals/cow.json",
    path: `http://localhost:8080/server/uploads/${path}`,
    rendererSettings: {
      context: lottieCanvas.getContext("2d"), // the canvas context
      preserveAspectRatio: "xMidYMid meet"
      // clearCanvas: false,
    }
  });

  function onObjectSelected(e) {
    console.log("Animation selected" , e.target.get('type'));
  }
  canvas.on('object:selected', onObjectSelected);

  const slider = document.querySelector("#slider");

//   loadAnimation.on("selected", () => {
//     console.log("Animation SELECTED");
//   })

  loadAnimation.addEventListener("enterFrame", (e) => {
    // console.log('enterFrame', loadAnimation.currentFrame, loadAnimation.timeCompleted, loadAnimation.frameRate)
    // console.log("current time", loadAnimation.currentFrame / loadAnimation.frameRate);
    slider.value = e.currentTime;
    canvas.requestRenderAll();
  });
  loadAnimation.addEventListener("DOMLoaded", () => {
    window.tempEl = loadAnimation;
    loadAnimation.goToAndStop(1, true);
    console.log("total frames", loadAnimation.getDuration(false));
    slider.max = loadAnimation.getDuration(true);
    console.log(loadAnimation.renderer.canvasContext.canvas === lottieCanvas);
  });


    document.getElementById("play").addEventListener("click", function (e) {
      console.log("It was clicked");
      loadAnimation.play();
    });
    document.getElementById("pause").addEventListener("click", function (e) {
      console.log("It was clicked");
      loadAnimation.pause();
    });
    document.getElementById("stop").addEventListener("click", function (e) {
      console.log("It was clicked");
      loadAnimation.stop();
    });

};
