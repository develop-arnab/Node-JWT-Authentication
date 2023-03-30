/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */
import { getMultipleFiles, getIconsAnimFiles, getFilesByTitle, saveCanvasState, retrieveCanvasState, saveSelectedAnimation } from "../services/animationsServices.js";
// import { BASE_URL } from "./constants.js";
( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo
console.log("Seacrh Script Loaded")
function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
  // full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else {
  // browser global
  window.classie = classie;
}

})( window );


let characterSuitsArray = [];
let characterSuitsPathArray = [];

let iconsArray = [];
let iconsPathArray = [];

let officeBoyArray = [];
let officeBoyPathArray = [];
let canvas = document.getElementById("canvas").fabric; 

let inputBox = document.getElementById("searchInputBox")
let searchButton = document.getElementById("SearchButton")
$(document).ready(function () {
  // canvas = document.getElementById("canvas").fabric;

  // getFilesByTitle("animals")

  (function () {
      var morphSearch = document.getElementById("morphsearch"),
      input = morphSearch.querySelector("input.morphsearch-input"),
      ctrlClose = morphSearch.querySelector("span.morphsearch-close"),
      isOpen = false,
      // show/hide search area
      toggleSearch = function (evt) {
        // return if open and the input gets focused
        if (evt.type.toLowerCase() === "focus" && isOpen) return false;
  
        var offsets = morphsearch.getBoundingClientRect();
        if (isOpen) {
          classie.remove(morphSearch, "open");

        //  retrieveSavedCanvas();
        localStorage.setItem('savedItem', "Saved Canvas");
   
          $("#animal-column").empty();
          $("#icons-column").empty();
          // trick to hide input text once the search overlay closes
          // todo: hardcoded times, should be done after transition ends
          if (input.value !== "") {
            setTimeout(function () {
              classie.add(morphSearch, "hideInput");
              setTimeout(function () {
                classie.remove(morphSearch, "hideInput");
                input.value = "";
              }, 300);
            }, 500);
          }
          // characterSuitsArray = [];
          // iconsArray = [];
          // characterSuitsPathArray =[]
          // iconsPathArray = [];
          input.blur();
          window.location.reload();
        } else {
          classie.add(morphSearch, "open");
          saveCurrentCanvas();
          createAnimalsDivs();
          createIconDivs();
        }
        isOpen = !isOpen;
      };
      
     
    // events
    input.addEventListener("focus", toggleSearch);
    ctrlClose.addEventListener("click", toggleSearch);
    // esc key closes search overlay
    // keyboard navigation events
    document.addEventListener("keydown", function (ev) {
      var keyCode = ev.keyCode || ev.which;
      if (keyCode === 27 && isOpen) {
        toggleSearch(ev);
      }
    });
  
    /***** for demo purposes only: don't allow to submit the form *****/
    morphSearch
      .querySelector('button[type="submit"]')
      .addEventListener("click", function (ev) {
        ev.preventDefault();
      });
  })();

  
});

const retrieveSavedCanvas = () => {
  var thisCanvas;
  // retrieveCanvasState().then((savedCanvas) => {
  //   thisCanvas = savedCanvas;
  //   localStorage.setItem('savedItem', "Saved Canvas");
  //   console.log("Saved to Local Storage")
  // });

  // localStorage.setItem('savedItem', "Saved Canvas");
  // window.location.reload();
  
}

const saveCurrentCanvas = (e) => {
  // jsonCanvas = JSON.stringify(canvas);
  // console.log("Search Saved Canvas", jsonCanvas);
  // saveCanvasState(jsonCanvas);
}

const getsearchedAnimatons = (e) => {
  e.preventDefault()
    console.log()
    getFilesByTitle(inputBox.value)
  } 

searchButton.addEventListener("click", getsearchedAnimatons)



const createAnimalsDivs = async () => {
 
  // let  characterSuitsArray = [];
  // let characterSuitsPathArray = [];
  await getMultipleFiles().then((data) => {
    console.log("GOT ANIMATION DATA : ", data);
    characterSuitsArray = data[3].files;
    console.log("MUltiple Files Data", characterSuitsArray);
    characterSuitsArray.forEach((character) => {
      console.log("CHARACTER", character);
      characterSuitsPathArray.push(character.filePath);
      console.log("PATHS", characterSuitsPathArray);
    });
  });
  
  console.log("DOM HAS LOADED ARRAY", characterSuitsPathArray);
  characterSuitsPathArray.forEach(function (item, index) {
    $("#animal-column").append(
      `<div id="animal-${index}" class="dummy-media-object">
      </div>`
    );
    console.log("THE JSON FILE IS AT", item);
    var animalDiv = document.getElementById(`animal-${index}`);
    var searchAnimItem = bodymovin.loadAnimation({
      wrapper: animalDiv,
      animType: "svg",
      loop: true,
      path: `http://localhost:8080/${item}`
    });

    const animalCanvas = document.createElement("canvas");
    animalCanvas.width = 1000;
    animalCanvas.height = 1000;

    const animalAnimItem = bodymovin.loadAnimation({
      renderer: "canvas",
      loop: true,
      autoplay: true,
      // animationData: JSON.parse(JSON.stringify(doctorAnimationData)),
      path: `http://localhost:8080/${item}`,
      rendererSettings: {
        context: animalCanvas.getContext("2d"), // the canvas context
        preserveAspectRatio: "xMidYMid meet"
        //   clearCanvas: true,
      }
    });
    document.querySelector(`#animal-${index}`).onclick = () => {

      console.log("YOU CLICKED", item);
      var morphSearch = document.getElementById("morphsearch");
      var input = morphSearch.querySelector("input.morphsearch-input");
      saveSelectedAnimation(item);

      classie.remove(morphSearch, "open");

      //  retrieveSavedCanvas();
      localStorage.setItem('selectedAnim', "User Selection");
 
        $("#animal-column").empty();
        $("#icons-column").empty();
        // trick to hide input text once the search overlay closes
        // todo: hardcoded times, should be done after transition ends
        if (input.value !== "") {
          setTimeout(function () {
            classie.add(morphSearch, "hideInput");
            setTimeout(function () {
              classie.remove(morphSearch, "hideInput");
              input.value = "";
            }, 300);
          }, 500);
        }
        input.blur();
        window.location.reload();

      // localStorage.setItem('savedItem', "Saved Canvas");

      // const fabricImage = new fabric.AEAnimation(animalCanvas, {
      //   scaleX: 0.5,
      //   scaleY: 0.5,
      //   needsItsOwnCache: () => {
      //     return true;
      //   },
      //   objectCaching: true
      // });
      // canvas.add(fabricImage);
      // canvas.requestRenderAll();
    };
  });
};


const createIconDivs = async () => {
  console.log("DOMLAODED");
  // let iconsArray = [];
  // let iconsPathArray = [];
  await getIconsAnimFiles().then((data) =>{
    iconsArray = data[1].files;
    console.log("MUltiple Files Data", iconsArray);
    
    iconsArray.forEach((character) => {
      console.log("CHARACTER", character);
      iconsPathArray.push(character.filePath);
      console.log("ICONSPATHS", iconsPathArray);
    });
  })
  console.log("DOM HAS LOADED ARRAY", iconsPathArray);
  iconsPathArray.forEach(function (item, index) {
    $("#icons-column").append(
      `<div id="icon-${index}" class="dummy-media-object">
</div>`
    );
    console.log("THE JSON FILE IS AT", item);
    var iconsDiv = document.getElementById(`icon-${index}`);
    var searchAnimItem = bodymovin.loadAnimation({
      wrapper: iconsDiv,
      animType: "svg",
      loop: true,
      path: `http://localhost:8080/${item}`
    });

    const iconCanvas = document.createElement("canvas");
    iconCanvas.width = 1000;
    iconCanvas.height = 1000;

    const animalAnimItem = bodymovin.loadAnimation({
      renderer: "canvas",
      loop: true,
      autoplay: true,
      // animationData: JSON.parse(JSON.stringify(doctorAnimationData)),
      path: `http://localhost:8080/${item}`,
      rendererSettings: {
        context: iconCanvas.getContext("2d"), // the canvas context
        preserveAspectRatio: "xMidYMid meet"
        //   clearCanvas: true,
      }
    });
    document.querySelector(`#icon-${index}`).onclick = () => {
      // const fabricImage = new fabric.AEAnimation(iconCanvas, {
      //   scaleX: 0.5,
      //   scaleY: 0.5,
      //   needsItsOwnCache: () => {
      //     return true;
      //   },
      //   objectCaching: true
      // });
      // canvas.add(fabricImage);
      // canvas.requestRenderAll();

      console.log("YOU CLICKED", item);
      var morphSearch = document.getElementById("morphsearch");
      var input = morphSearch.querySelector("input.morphsearch-input");
      saveSelectedAnimation(item);

      classie.remove(morphSearch, "open");

      //  retrieveSavedCanvas();
      localStorage.setItem('selectedAnim', "User Selection");
 
        $("#animal-column").empty();
        $("#icons-column").empty();
        // trick to hide input text once the search overlay closes
        // todo: hardcoded times, should be done after transition ends
        if (input.value !== "") {
          setTimeout(function () {
            classie.add(morphSearch, "hideInput");
            setTimeout(function () {
              classie.remove(morphSearch, "hideInput");
              input.value = "";
            }, 300);
          }, 500);
        }
        input.blur();
        window.location.reload();
    };
    
  });
};
