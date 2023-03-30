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

      window.addEventListener("load", function () {
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
        document.getElementById("addAnimText").addEventListener("click", function (e) {
          console.log("addAnimText");
          var mainTitle = document.getElementById("animationText").value;
          var subTitle = document.getElementById("animationText2").value;
          console.log(
            "DOMLoadedNOW",
            textanimItem.renderer,
            " TEXT SEARCH :",
            textanimItem.assets[0].layers[0].t.d.k[0].s.t
          );
          console.log("DOMLoadedNOW", textanimItem.renderer.elements[4]);
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
          textanimItem.renderer.elements[4].elements[0].updateDocumentData(
            {
              t: mainTitle
            },
            0
          );
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
        });
      });
      
}