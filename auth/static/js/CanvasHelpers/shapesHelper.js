
import {global} from "../config/global.js";
var objectArray = new Array();
export const createAndAddShapeToCanvas = (canvas, shape) => {
    
    $("li").removeClass("actived");
    canvas.discardActiveObject();
  
    const canvasCenter = canvas.getCenter();

    canvas.add(shape);
    objectArray.push(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
    shape.animate("top", canvasCenter.top, {
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
  
    shape.on("selected", (e) => {
      global.selected = "shape"
      console.log("RECT SELECTED", e.target.get('type'));
      $("li").removeClass("actived");
      $("#" + id).addClass("actived");
      $("#width").val((shape.width * shape.scaleX).toFixed(2));
      $("#height").val((shape.height * shape.scaleY).toFixed(2));
      $("#color-picker")[0].jscolor.fromString(shape.fill);
    });
  
    shape.on("deselected", () => {
      global.selected = ""
      console.log("RECT DESELECTED", objectArray);
    });

    canvas.on("mouse:down", function () {
        var obj = canvas.getActiveObject();
        if (!obj) {
          $("li").removeClass("actived");
        }
      });
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
};


