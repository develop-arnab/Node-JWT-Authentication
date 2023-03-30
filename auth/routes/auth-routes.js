// "use strict";
// // const dotenv = require( 'dotenv')
// // dotenv.config()
// // import Express from "express";
// const crypto = require("crypto") ;
// const bcrypt = require("bcrypt") ;
// const jwt = require( "jsonwebtoken");
// const cookieParser = require("cookie-parser") ;
// const User = require("../models/User.js") ;

// const cors = require('cors') ;

// const express = require("express");
// const router = express.Router();

// router.get("/", async (req, res) => {
//     const token = req.cookies.JWT_TOKEN;
//     if (token) {
//       //if the cookie is set, query the db
//       //get the user and role
//       //we are taking a hit everytime a user makes a request
//       const user = await validateToken(token, JWT_SECRET);
//       //session no longer there, expired etc..
//       if (user === null) {
//         res.send({
//           message: "Invalid Token"
//         });
//       } else {
//         res.send({
//           message: "Well Hello There"
//         });
//       }
//     } //else ask the user to login
//     else {
//       res.send({
//         message: "Invalid"
//       });
//     }
//   });
  
//   router.post("/token", async (req, res) => {
//     const token = req.body.refreshToken;
//     const user = await validateToken(token, JWT_REFRESH_SECRET);
  
//     if (user === null) {
//       res.sendStatus(403);
//       return;
//     }
  
//     //now that we know the refresh token is valid
//     //lets take an extra hit the database
//     const result = await User.findOne({ refreshToken: token }).lean();
  
//     if (!result) {
//       res.sendStatus(403);
//     } else {
//       //sign my jwt
//       const payLoad = { name: user.name, role: user.role };
//       //sign a brand new accesstoken and update the cookie
//       const token = jwt.sign(payLoad, JWT_SECRET, {
//         algorithm: "HS256",
//         expiresIn: "30s"
//       });
//       //maybe check if it succeeds..
//       res.setHeader("set-cookie", [`JWT_TOKEN=${token}; httponly; samesite=lax`]);
//       res.send({
//         message: "Refreshed successfully in successfully"
//       });
//     }
//   });
  
//   //login post request
//   router.post("/login", async (req, res) => {
//     try {
//       const { username, password } = req.body;
//       const user = await User.findOne({ username }).lean();
  
//       if (!user) {
//         return res.json({ status: "error", error: "Invalid username/password" });
//       }
//       const saltedPassword = user.password;
//       const successResult = await bcrypt.compare(password, saltedPassword);
  
//       //logged in successfully generate session
//       if (successResult === true) {
//         //sign my jwt
//         const payLoad = {
//           name: username,
//           role: "User"
//         };
//         const token = jwt.sign(payLoad, JWT_SECRET, {
//           algorithm: "HS256"
//           // expiresIn: "30"
//         });
//         const refreshtoken = jwt.sign(payLoad, JWT_REFRESH_SECRET, {
//           algorithm: "HS256"
//         });
  
//         //save the refresh token in the database
//         User.updateOne(
//           { username: username },
//           { $set: { refreshToken: refreshtoken } },
//           { strict: false },
//           function (err, docs) {
//             if (err) {
//               console.log(err);
//             } else {
//               console.log("Updated Docs : ", docs);
//             }
//           }
//         );
//         //maybe check if it succeeds..
//         res.setHeader("set-cookie", [
//           `JWT_TOKEN=${token}; httponly; samesite=lax`
//         ]);
//         res.send({
//           status: "Success",
//           refreshToken: refreshtoken
//         });
//       } else {
//         res.send({ error: "Incorrect username or password" });
//       }
//     } catch (ex) {
//       console.error(ex);
//     }
//   });
  
//   router.post("/logout", async (req, res) => {
//     //logging out
//     const token = req.body.refreshToken;
//     if (token) {
//       // remove token from db
//     }
//   });
  
//   //register post request
//   router.post("/register", async (req, res) => {
//     const { username, password: plainTextPassword } = req.body;
  
//     if (!username || typeof username !== "string") {
//       return res.json({ status: "error", error: "Invalid username" });
//     }
  
//     if (!plainTextPassword || typeof plainTextPassword !== "string") {
//       return res.json({ status: "error", error: "Invalid password" });
//     }
  
//     if (plainTextPassword.length < 5) {
//       return res.json({
//         status: "error",
//         error: "Password too small. Should be atleast 6 characters"
//       });
//     }
  
//     const password = await bcrypt.hash(plainTextPassword, 10);
  
//     try {
//       const response = await User.create({
//         username,
//         password
//       });
//       console.log("User created successfully: ", response);
//     } catch (error) {
//       if (error.code === 11000) {
//         // duplicate key
//         return res.json({ status: "error", error: "Username already in use" });
//       }
//       throw error;
//     }
  
//     res.json({ status: "ok" });
//   });
  
//   async function validateToken(token, secret) {
//     try {
//       const result = jwt.verify(token, secret);
  
//       return {
//         name: result.name,
//         role: result.role
//       };
//     } catch (ex) {
//       return null;
//     }
//   }
  
//   async function randomString() {
//     return crypto.randomBytes(64).toString("hex");
//   }
//   function sha256(txt) {
//     const secret = "abcdefg";
//     const hash = crypto.createHmac("sha256", secret).update(txt).digest("hex");
//     return hash;
//   }

//   module.exports = {
//     routes: router,
//   };