require("./db/config");

const User = require("./db/user");
const Bike = require("./db/bike");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const port = 4000;
const secretKey = "secretkey";

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
      role: req.body.role,
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

app.post("/login", async (req, res) => {
  if (req.body.email && req.body.password) {
    let data = await User.findOne(req.body).select("-password");
    if (data) {
      jwt.sign({ data }, secretKey, { expiresIn: "24h" }, (error, token) => {
        if (error) {
          res
            .status(500)
            .json({ success: false, error: "Token signing error" });
        } else {
          res
            .status(200)
            .json({ success: true, result: { data, token: token } });
        }
      });
    } else {
      res
        .status(400)
        .json({ success: false, error: "Enter Valid Information" });
    }
  } else {
    res
      .status(400)
      .json({ success: false, error: "Enter all required fields" });
  }
});

app.get("/users", verifyToken, async (req, res) => {
  jwt.verify(req.token, secretKey, async (error, authData) => {
    if (error) {
      res.json({ error: "Invalid token" });
    } else {
      let data = await User.find();
      if (data) {
        res.status(200).json({ success: true, result: data, authData });
      } else {
        res.status(400).json({ success: false, error: "No Users found" });
      }
    }
  });
});

app.post("/addBike", verifyToken, async (req, res) => {
  jwt.verify(req.token, secretKey, async (error, authData) => {
    if (error) {
      res.json({ error: "Invalid token" });
    } else {
      if (
        req.body.bike_name &&
        req.body.bike_brand &&
        req.body.model_year &&
        req.body.type &&
        req.body.price &&
        req.body.image
      ) {
        let data = new Bike({
          bike_brand: req.body.bike_brand,
          bike_name: req.body.bike_name,
          model_year: req.body.model_year,
          type: req.body.type,
          price: req.body.price,
          image: req.body.image,
          description: req.body.description,
        });
        let result = await data.save();
        result = result.toObject();

        res.status(200).json({ success: true, result: result, authData });
      } else {
        res.status(400).json({ error: "Missing required fields" });
      }
    }
  });
});

app.get("/getAllBikes", verifyToken, async (req, res) => {
  jwt.verify(req.token, secretKey, async (error, authData) => {
    if (error) {
      res.json({ error: "Invalid token" });
    } else {
      let data = await Bike.find();
      if (data) {
        res.status(200).json({ success: true, result: data, authData });
      } else {
        res.status(400).json({ success: false, error: "No bikes found" });
      }
    }
  });
});

app.post("/updateBike", verifyToken, async (req, res) => {
  jwt.verify(req.token, secretKey, async (error, authData) => {
    if (error) {
      res.json({ error: "Invalid token" });
    } else {
      if (req.query.id) {
        let data = await Bike.findOne({ _id: req.query.id });
        if (data) {
          if (
            req.body.bike_name &&
            req.body.bike_brand &&
            req.body.model_year &&
            req.body.type &&
            req.body.price &&
            req.body.image &&
            req.body.description
          ) {
            let result = await Bike.findOneAndUpdate(
              { _id: req.query.id },
              {
                $set: {
                  bike_brand: req.body.bike_brand,
                  bike_name: req.body.bike_name,
                  model_year: req.body.model_year,
                  type: req.body.type,
                  price: req.body.price,
                  image: req.body.image,
                  description: req.body.description,
                },
              },
              { new: true }
            );
            result = result.toObject();
            res.status(200).json({ success: true, result: result, authData });
          } else {
            res.status(400).json({ error: "Missing required fields" });
          }
        } else {
          res.status(400).json({ error: "Invalid bike ID" });
        }
      } else {
        res.status(400).json({ error: "Bike ID required" });
      }
    }
  });
});

app.delete("/deleteBike", verifyToken, async (req, res) => {
  jwt.verify(req.token, secretKey, async (error, authData) => {
    if (error) {
      res.status(401).json({ error: "Invalid token" });
    } else {
      if (req.query.id) {
        try {
          const data = await Bike.findOne({ _id: req.query.id });
          if (data) {
            await Bike.deleteOne({ _id: req.query.id });
            res
              .status(200)
              .json({ success: true, message: "Bike deleted successfully" });
          } else {
            res.status(400).json({ error: "Invalid bike ID" });
          }
        } catch (err) {
          res.status(500).json({ error: "Internal server error" });
        }
      } else {
        res.status(400).json({ error: "Bike ID required" });
      }
    }
  });
});

app.post("/booking", verifyToken, async (req, res) => {
  jwt.verify(req.token, secretKey, async (error, authData) => {
    if (error) {
      res.json({ error: "Invalid token" });
    } else {
      if (req.query.userId && req.query.bikeId) {
        let usrData = await User.findOne({ _id: req.query.userId });
        if (usrData) {
          let bikeData = await Bike.findOne({ _id: req.query.bikeId });
          if (bikeData) {
            if (req.body.startTime && req.body.endTime) {
              let startTime = new Date(req.body.startTime);
              let endTime = new Date(req.body.endTime);
              let bookingCheck = await Bike.findOne({
                _id: req.query.bikeId,
                "booking.startTime": { $lt: endTime },
                "booking.endTime": { $gt: startTime },
              });
              if (
                bookingCheck &&
                bookingCheck.booking &&
                bookingCheck.booking.length > 0
              ) {
                res
                  .status(400)
                  .json({ error: "Bike is unavailable in this time slot" });
              } else {
                let book = await Bike.findOneAndUpdate(
                  { _id: req.query.bikeId },
                  {
                    $push: {
                      booking: {
                        name: req.body.name,
                        startTime: startTime,
                        endTime: endTime,
                        accepted: false,
                        status: "Pending",
                        requestId: req.query.userId,
                      },
                    },
                  },
                  { new: true }
                );
                book = book.toObject();
                console.log("here", book);
                res.status(200).json({
                  success: true,
                  message: "Successfully sent request",
                  data: book,
                  authData,
                });
              }
            } else {
              res.status(400).json({ error: "Please provide booking time" });
            }
          } else {
            res.status(400).json({ error: "Invalid bike" });
          }
        } else {
          res.status(400).json({ error: "Invalid User" });
        }
      } else {
        res.status(400).json({ error: "Vehcile and bike id required" });
      }
    }
  });
});

app.post("/approve", verifyToken, async (req, res) => {
  jwt.verify(req.token, secretKey, async (error, authData) => {
    if (error) {
      res.json({ error: "Invalid token" });
    } else {
      if (req.query.userId && req.query.bikeId) {
        let userData = await User.findOne({ _id: req.query.userId });
        if (userData) {
          let bikeData = await Bike.findOne({ _id: req.query.bikeId });
          if (bikeData) {
            let result = await Bike.findOneAndUpdate(
              { _id: req.query.bikeId },
              {
                $set: {
                  booking: {
                    name: req.body.name,
                    startTime: req.body.startTime,
                    endTime: req.body.endTime,
                    accepted: true,
                    status: "Approved",
                    requestId: req.query.userId,
                  },
                },
              },
              { new: true }
            );
            result = result.toObject();
            res.status(200).json({ success: true, result: result, authData });
          } else {
            res.json({ error: "Invalid bike" });
          }
        } else {
          res.json({ error: "Invalid user" });
        }
      } else {
        res.json({ error: "User id and bike id required" });
      }
    }
  });
});

app.post("/reject", verifyToken, async (req, res) => {
  jwt.verify(req.token, secretKey, async (error, authData) => {
    if (error) {
      res.json({ error: "Invalid token" });
    } else {
      if (req.query.userId && req.query.bikeId) {
        let userData = await User.findOne({ _id: req.query.userId });
        if (userData) {
          let bikeData = await Bike.findOne({ _id: req.query.bikeId });
          if (bikeData) {
            let result = await Bike.findOneAndUpdate(
              { _id: req.query.bikeId },
              {
                $set: {
                  booking: {
                    name: req.body.name,
                    startTime: req.body.startTime,
                    endTime: req.body.endTime,
                    accepted: false,
                    status: "Not Approved",
                    requestId: req.query.userId,
                  },
                },
              },
              { new: true }
            );
            result = result.toObject();
            res.status(200).json({ success: true, result: result, authData });
          } else {
            res.json({ error: "Invalid bike" });
          }
        } else {
          res.json({ error: "Invalid user" });
        }
      } else {
        res.json({ error: "User and bike id required" });
      }
    }
  });
});

app.post("/admin/booking", verifyToken, async (req, res) => {
  jwt.verify(req.token, secretKey, async (error, authData) => {
    if (error) {
      res.json({ error: "Invalid token" });
    } else {
      if (req.query.bookingId && req.query.status) {
        let value = req.query.status === "Accepted" ? true : false
        let result = await Bike.findOneAndUpdate(
          { "booking._id": req.query.bookingId },
          {
            $set: {
              booking: {
                name: req.body.name,
                startTime: req.body.startTime,
                endTime: req.body.endTime,
                accepted: value,
                status: req.query.status,
                requestId: req.query.userId,
              },
            },
          },
          { new: true }
        );
        if (result) {
          result = result.toObject();
          res.status(200).json({ success: true, result: result, authData });
        } else {
          res.status(404).json({ error: "Booking not found" });
        }
      } else {
        res.json({ error: "Invalid booking id and status" })
      }
    }
  });
});

app.post("/dashboard", verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, (error, authData) => {
    if (error) {
      res.json({ error: "Invalid token" });
    } else {
      res.json({ success: true, message: "Dashboard accessed", authData });
    }
  });
});

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const token = bearerHeader.split(" ")[1];
    req.token = token;
    next();
  } else {
    res.status(500).json({ success: false, error: "Token is not valid" });
  }
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
