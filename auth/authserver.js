//Method 4
//Store salted password with bcrypt
//no additional column
import * as dotenv from 'dotenv'
dotenv.config()
import Express from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import fs from "fs";
import User from "../models/User.js";
import mongoose from "mongoose";
import cors from 'cors';
//bad idea
const JWT_SECRET = "{8367E87C-B794-4A04-89DD-15FE7FDBFF78}";
const JWT_REFRESH_SECRET = "{asdfasdfdsfa-B794-4A04-89DD-15FE7FDBFF78}";

mongoose.connect( process.env.MONGO_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

const port = process.env.PORT || 8080;
const app = new Express();
app.use(Express.json());
app.use(cookieParser());
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));


// Add a list of allowed origins.
// If you have more origins you would like to add, you can add them to the array below.
const allowedOrigins = ['http://localhost:3000', 'http://3.6.37.30:3000','*',];

const options = {
  origin: allowedOrigins
};

// Then pass these options to cors:
// app.use(cors(options));

app.use(cors());


app.get("/", async (req, res) => {
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

app.post("/token", async (req, res) => {
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
app.post("/login", async (req, res) => {
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

app.post("/logout", async (req, res) => {
  //logging out
  const token = req.body.refreshToken;
  if (token) {
    // remove token from db
  }
});

//register post request
app.post("/register", async (req, res) => {
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

app.listen(port, () => console.log("Auth - Listening on " + port));

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

async function randomString() {
  return crypto.randomBytes(64).toString("hex");
}
function sha256(txt) {
  const secret = "abcdefg";
  const hash = crypto.createHmac("sha256", secret).update(txt).digest("hex");
  return hash;
}
