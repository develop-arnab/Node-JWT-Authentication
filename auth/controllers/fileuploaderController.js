"use strict";
const SingleFile = require("../models/singlefile");
const MultipleFile = require("../models/multiplefile");
const CanvasState = require("../models/canvasState");
const SelectedAnimation = require("../models/selectedAnimation");
const User = require("../models/user");
const path = require('path');
const bcrypt = require('bcrypt')

const serveMainPage = async (req,res,next) => {
  res.sendFile(path.join(__dirname, '../../client', 'index.html'));
}

const serveRegisterPage = async (req,res,next) => {
  res.sendFile(path.join(__dirname, '../../client/pages', 'register.html'));
}

const registerUser = async (req,res,next) => {
  try{
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    console.log(salt)
    console.log(hashedPassword)
  } catch {

  }
}

const serveTextJsonFile = async (req,res,next) => {
  console.log("REQUESTED", req)
  // res.send('Hello World');
  res.sendFile(path.join(__dirname, '../../client/assets/anim/Text', 'TextComp1.json'));
}

const serveTextJsonFile2 = async (req,res,next) => {
  console.log("REQUESTED", req)
  // res.send('Hello World');
  res.sendFile(path.join(__dirname, '../../client/assets/anim/Text', 'TextComp2.json'));
}

const singleFileUpload = async (req, res, next) => {
  try {
    const file = new SingleFile({
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2) // 0.00
    });
    await file.save();
    res.status(201).send("File Uploaded Successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const multipleFileUpload = async (req, res, next) => {
  try {
    let filesArray = [];
    req.files.forEach((element) => {
      const file = {
        fileName: element.originalname,
        filePath: element.path,
        fileType: element.mimetype,
        fileSize: fileSizeFormatter(element.size, 2)
      };
      filesArray.push(file);
    });
    const multipleFiles = new MultipleFile({
      title: req.body.title,
      files: filesArray
    });
    await multipleFiles.save();
    res.status(201).send("Files Uploaded Successfully");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getallSingleFiles = async (req, res, next) => {
  try {
    const files = await SingleFile.find();
    console.log("ALL SINGLE FILES", files);
    res.status(200).send(files);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getallMultipleFiles = async (req, res, next) => {
  try {
    const files = await MultipleFile.find();
    console.log("SEnding multiple files")
    res.status(200).send(files);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getSearchedFiles = async (req, res, next) => {
  try {
    const files = await MultipleFile.find({"title": req.query.title});
    res.status(200).send(files);
  } catch (error) {

  }
};

const saveSelectedAnim = async (req, res, next) => {
  try {
    console.log("USer selected", req.query.fileName);
    var fileName = req.query.fileName
    SelectedAnimation.deleteMany ({}).then(e => {
      console.log("REMOVED ALL", fileName);
      const savedAnim = new SelectedAnimation({
        fileName : fileName.replace(/\\/g, '/')
      })
      console.log("savedAnim ", savedAnim);
      savedAnim.save().then(e => {
        console.log("SAVED Selected Animation")
      });
    });
  } catch (error) {

  }
};


const saveCanvas = async (req, res, next) => {
  try {
    console.log("received", req.query.canvas);
    var canvasJson = JSON.parse(req.query.canvas)
    console.log("parsed", canvasJson.objects);

    CanvasState.deleteMany ({}).then(e => {
      console.log("REMOVED ALL");

      const savedCanvas = new CanvasState({
        version : canvasJson.version,
        objects :  canvasJson.objects
      })
      savedCanvas.save().then(e => {
        console.log("SAVED CANVAS")
      });
    });
  } catch (error) {

  }
};

const retrieveCanvas = async (req, res, next) => {
  try {
    const savedCanvas = await CanvasState.find();
    console.log("CANVAS IS ", savedCanvas);
    res.status(200).send(savedCanvas);
  } catch (error) {

  }
};

const retrieveCanvasAnim = async (req, res, next) => {
  try {
    const savedCanvas = await CanvasState.find();
    console.log("CANVAS IS ", savedCanvas);
    const savedAnim = await SelectedAnimation.find();
    console.log("Anim IS ", savedAnim);

    var canvasAndAnim = {
      anim : savedAnim,
      canvas: savedCanvas
    }

    res.status(200).send(canvasAndAnim);
  } catch (error) {

  }
};


const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + " " + sizes[index]
  );
};

module.exports = {
  singleFileUpload,
  multipleFileUpload,
  getallSingleFiles,
  getallMultipleFiles,
  getSearchedFiles,
  saveCanvas,
  saveSelectedAnim,
  retrieveCanvas,
  retrieveCanvasAnim,
  serveMainPage,
  serveTextJsonFile,
  serveTextJsonFile2,
  serveRegisterPage,
  registerUser
};
