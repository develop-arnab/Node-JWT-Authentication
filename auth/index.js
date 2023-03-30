"use strict";
const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileRoutes = require("./routes/file-upload-routes");
// const authRoutes = require("./routes/auth-routes")
const request = require("request");
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')
const port = 8080;
const app = express();
var http = require("http");
let User = require('./models/user');

//bad idea
const JWT_SECRET = "{8367E87C-B794-4A04-89DD-15FE7FDBFF78}";
const JWT_REFRESH_SECRET = "{asdfasdfdsfa-B794-4A04-89DD-15FE7FDBFF78}";

const SERVER_PREFIX = "/server"

app.use(cors());

require("./database")();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(`${SERVER_PREFIX}/uploads`, express.static(path.join(__dirname, "uploads")));
app.use(express.static(path.join(__dirname, "static")));
app.use(`${SERVER_PREFIX}/create`,express.static(path.join(__dirname, "static/html/")));
app.use(`${SERVER_PREFIX}/api`, fileRoutes.routes);
// app.use("/auth", authRoutes.routes);



app.get(`${SERVER_PREFIX}/auth/`, async (req, res) => {
  const token = req.cookies.JWT_TOKEN;
  if (token) {
    //if the cookie is set, query the db
    //get the user and role
    //we are taking a hit everytime a user makes a request
    const user = await validateToken(token, JWT_SECRET);
    //session no longer there, expired etc..
    if (user === null) {
      res.send({
        message: "Invalid Token"
      });
    } else {
      res.send({
        message: "Well Hello There"
      });
    }
  } //else ask the user to login
  else {
    res.send({
      message: "Invalid"
    });
  }
});

app.post(`${SERVER_PREFIX}/auth/token`, async (req, res) => {
  const token = req.body.refreshToken;
  const user = await validateToken(token, JWT_REFRESH_SECRET);

  if (user === null) {
    res.sendStatus(403);
    return;
  }

  //now that we know the refresh token is valid
  //lets take an extra hit the database
  const result = await User.findOne({ refreshToken: token }).lean();

  if (!result) {
    res.sendStatus(403);
  } else {
    //sign my jwt
    const payLoad = { name: user.name, role: user.role };
    //sign a brand new accesstoken and update the cookie
    const token = jwt.sign(payLoad, JWT_SECRET, {
      algorithm: "HS256",
      expiresIn: "30s"
    });
    //maybe check if it succeeds..
    res.setHeader("set-cookie", [`JWT_TOKEN=${token}; httponly; samesite=lax`]);
    res.send({
      message: "Refreshed successfully in successfully"
    });
  }
});

//login post request
app.post(`${SERVER_PREFIX}/auth/login`, async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).lean();

    if (!user) {
      return res.json({ status: "error", error: "Invalid username/password" });
    }
    const saltedPassword = user.password;
    const successResult = await bcrypt.compare(password, saltedPassword);

    //logged in successfully generate session
    if (successResult === true) {
      //sign my jwt
      const payLoad = {
        name: username,
        role: "User"
      };
      const token = jwt.sign(payLoad, JWT_SECRET, {
        algorithm: "HS256"
        // expiresIn: "30"
      });
      const refreshtoken = jwt.sign(payLoad, JWT_REFRESH_SECRET, {
        algorithm: "HS256"
      });

      //save the refresh token in the database
      User.updateOne(
        { username: username },
        { $set: { refreshToken: refreshtoken } },
        { strict: false },
        function (err, docs) {
          if (err) {
            console.log(err);
          } else {
            console.log("Updated Docs : ", docs);
          }
        }
      );
      //maybe check if it succeeds..
      res.setHeader("set-cookie", [
        `JWT_TOKEN=${token}; httponly; samesite=lax`
      ]);
      res.send({
        status: "Success",
        refreshToken: refreshtoken
      });
    } else {
      res.send({ error: "Incorrect username or password" });
    }
  } catch (ex) {
    console.error(ex);
  }
});

app.post(`${SERVER_PREFIX}/auth/logout`, async (req, res) => {
  //logging out
  const token = req.body.refreshToken;
  if (token) {
    // remove token from db
  }
});

//register post request
app.post(`${SERVER_PREFIX}/auth/register`, async (req, res) => {
  const { username, password: plainTextPassword } = req.body;

  if (!username || typeof username !== "string") {
    return res.json({ status: "error", error: "Invalid username" });
  }

  if (!plainTextPassword || typeof plainTextPassword !== "string") {
    return res.json({ status: "error", error: "Invalid password" });
  }

  if (plainTextPassword.length < 5) {
    return res.json({
      status: "error",
      error: "Password too small. Should be atleast 6 characters"
    });
  }

  const password = await bcrypt.hash(plainTextPassword, 10);

  try {
    const response = await User.create({
      username,
      password
    });
    console.log("User created successfully: ", response);
  } catch (error) {
    if (error.code === 11000) {
      // duplicate key
      return res.json({ status: "error", error: "Username already in use" });
    }
    throw error;
  }

  res.json({ status: "ok" });
});

async function validateToken(token, secret) {
  try {
    const result = jwt.verify(token, secret);

    return {
      name: result.name,
      role: result.role
    };
  } catch (ex) {
    return null;
  }
}

app.listen(port, () => {
  console.log(`server is listening on url http://localhost:${port}`);
});
