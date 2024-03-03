require("./db/config");

const User = require("./db/user");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken")

const app = express();
const port = 4000;
const secretKey = "secretkey"

app.use(bodyParser.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  let repeatedEmail = await User.findOne({ email: req.body.email });
  if (repeatedEmail) {
    res.status(409).json({
      success: false,
      error: "Account with same email already exists",
    });
  } else {
    let data = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    });
    let result = await data.save();
    result = result.toObject();

    delete result.password;

    res.status(200).json({
      success: true,
      result: result,
    });
  }
});

// app.post("/login", async (req, res) => {
//   if (req.body.email && req.body.password) {
//     let data = await User.findOne(req.body).select("-password");
//     if (data) {
//       res.status(200).json({ success: true, result: data });
//     } else {
//       res
//         .status(400)
//         .json({ success: false, error: "Enter Valid Information" });
//     }
//   } else {
//     res.status(400).json({ success: false, error: "Enter all required fields" });
//   }
// });

app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let data = await User.findOne(req.body).select("-password");
    if (data) {
      jwt.sign({data}, secretKey, {expiresIn: '24h'}, (error, token) => {
        if(error) {
          res.status(500).json({ success: false, error: 'Token signing error'})
        }else {
          res.status(200).json({ success: true, result: {data, token: token}});
        }
      })
    } else {
      res
        .status(400)
        .json({ success: false, error: "Enter Valid Information" });
    }
  } else {
    res.status(400).json({ success: false, error: "Enter all required fields" });
  }
});

app.post('/dashboard', verifyToken, (req,res) => {
  jwt.verify(req.token, secretKey, (error, authData) => {
    if(error) {
      res.json({ error: "Invalid token"})
    }else {
      res.json({ success: true, message: "Dashboard accessed", authData})
    }
  })
})

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization']
  if(typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(" ")[1]
    req.token = token
    next()
  }else {
    res.status(500).json({ success: false, error: "Token is not valid"})
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
