require("./db/config");

const User = require("./db/user");
const Bike = require("./db/bike");
const Feedback = require("./db/feedback");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const moment = require("moment");

const app = express();
const port = 4000;
const secretKey = "secretkey";

app.use(bodyParser.json());
app.use(cors());
app.use("/image", express.static("./image"));

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./image");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

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

app.post("/addBike", verifyToken, upload.single("image"), async (req, res) => {
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
        req.file.path
      ) {
        console.log("file path", req.file.path);
        let data = new Bike({
          bike_brand: req.body.bike_brand,
          bike_name: req.body.bike_name,
          model_year: req.body.model_year,
          type: req.body.type,
          price: req.body.price,
          image: req.file.path,
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

app.post(
  "/updateBike",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
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
              req.body.description
            ) {
              const imagePath =
                req.file && req.file.path ? req.file.path : data.image;
              let result = await Bike.findOneAndUpdate(
                { _id: req.query.id },
                {
                  $set: {
                    bike_brand: req.body.bike_brand,
                    bike_name: req.body.bike_name,
                    model_year: req.body.model_year,
                    type: req.body.type,
                    price: req.body.price,
                    image: imagePath,
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
  }
);

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
                bookingCheck
                // bookingCheck.booking &&
                // bookingCheck.booking.length > 0
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

app.post("/cancel-booking", verifyToken, async (req, res) => {
  jwt.verify(req.token, secretKey, async (error, authData) => {
    if (error) {
      res.json({ error: "Invalid token" });
    } else {
      if (req.query.bookingId) {
        let booking = await Bike.findOne({
          "booking._id": req.query.bookingId,
          "booking.status": "Pending",
        });

        if (booking) {
          let updatedBooking = await Bike.findOneAndUpdate(
            { "booking._id": req.query.bookingId },
            {
              $pull: {
                booking: { _id: req.query.bookingId },
              },
            },
            { new: true }
          );

          if (updatedBooking) {
            res.status(200).json({
              success: true,
              message: "Booking canceled successfully",
            });
          } else {
            res
              .status(500)
              .json({ error: "An error occurred while canceling the booking" });
          }
        } else {
          res
            .status(400)
            .json({ error: "Booking not found or already approved" });
        }
      } else {
        res.status(400).json({ error: "Invalid booking id" });
      }
    }
  });
});

app.post("/check-booking-complete", verifyToken, async (req, res) => {
  jwt.verify(req.token, secretKey, async (error, authData) => {
    if (error) {
      res.json({ error: "Invalid token" });
    } else {
      try {
        const currentDate = moment().startOf("day");

        const bookingEndingToday = await Bike.find({
          "booking.endTime": currentDate,
          "booking.status": "Approved",
        });

        for (const booking of bookingEndingToday) {
          await Bike.findOneAndUpdate(
            { _id: booking._id },
            { $set: { "booking.$.status": "Complete" } }
          );
        }

        res.status(200).json({
          success: true,
          message: "Bookings marked as complete successfully.",
        });
      } catch (error) {
        console.error("Error marking bookings as complete:", error);
        res.status(500).json({
          success: false,
          error: "An error occurred while marking bookings as complete.",
        });
      }
    }
  });
});

// app.post("/approve", verifyToken, async (req, res) => {
//   jwt.verify(req.token, secretKey, async (error, authData) => {
//     if (error) {
//       res.json({ error: "Invalid token" });
//     } else {
//       if (req.query.userId && req.query.bikeId) {
//         let userData = await User.findOne({ _id: req.query.userId });
//         if (userData) {
//           let bikeData = await Bike.findOne({ _id: req.query.bikeId });
//           if (bikeData) {
//             let result = await Bike.findOneAndUpdate(
//               { _id: req.query.bikeId },
//               {
//                 $set: {
//                   booking: {
//                     name: req.body.name,
//                     startTime: req.body.startTime,
//                     endTime: req.body.endTime,
//                     accepted: true,
//                     status: "Approved",
//                     requestId: req.query.userId,
//                   },
//                 },
//               },
//               { new: true }
//             );
//             result = result.toObject();
//             res.status(200).json({ success: true, result: result, authData });
//           } else {
//             res.json({ error: "Invalid bike" });
//           }
//         } else {
//           res.json({ error: "Invalid user" });
//         }
//       } else {
//         res.json({ error: "User id and bike id required" });
//       }
//     }
//   });
// });

// app.post("/reject", verifyToken, async (req, res) => {
//   jwt.verify(req.token, secretKey, async (error, authData) => {
//     if (error) {
//       res.json({ error: "Invalid token" });
//     } else {
//       if (req.query.userId && req.query.bikeId) {
//         let userData = await User.findOne({ _id: req.query.userId });
//         if (userData) {
//           let bikeData = await Bike.findOne({ _id: req.query.bikeId });
//           if (bikeData) {
//             let result = await Bike.findOneAndUpdate(
//               { _id: req.query.bikeId },
//               {
//                 $set: {
//                   booking: {
//                     name: req.body.name,
//                     startTime: req.body.startTime,
//                     endTime: req.body.endTime,
//                     accepted: false,
//                     status: "Not Approved",
//                     requestId: req.query.userId,
//                   },
//                 },
//               },
//               { new: true }
//             );
//             result = result.toObject();
//             res.status(200).json({ success: true, result: result, authData });
//           } else {
//             res.json({ error: "Invalid bike" });
//           }
//         } else {
//           res.json({ error: "Invalid user" });
//         }
//       } else {
//         res.json({ error: "User and bike id required" });
//       }
//     }
//   });
// });

app.post("/admin/booking", verifyToken, async (req, res) => {
  jwt.verify(req.token, secretKey, async (error, authData) => {
    if (error) {
      res.json({ error: "Invalid token" });
    } else {
      if (req.query.bookingId && req.query.status) {
        let value =
          req.query.status === "Approved"
            ? true
            : req.query.status === "Not Approved"
            ? false
            : null;
        let result = await Bike.findOneAndUpdate(
          { "booking._id": req.query.bookingId },
          {
            $set: {
              // booking: {
              //   name: req.body.name,
              //   startTime: req.body.startTime,
              //   endTime: req.body.endTime,
              //   accepted: value,
              //   status: req.query.status,
              //   requestId: req.body.requestId,
              // },
              "booking.$.accepted": value,
              "booking.$.status": req.query.status,
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
        res.json({ error: "Invalid booking id and status" });
      }
    }
  });
});

app.get("/customer/notifications/:id", verifyToken, (req, res) => {
  jwt.verify(req.token, secretKey, async (error, authData) => {
    if (error) {
      res.json({ error: "Invalid token" });
    } else {
      let result = await Bike.findOne({ "booking._id": req.params.id });
      if (result) {
        result = result.toObject();
        res.status(200).json({ success: true, result: result, authData });
      } else {
        res.status(404).json({ error: "Booking not found" });
      }
    }
  });
});

app.post("/feedback", verifyToken, async (req, res) => {
  jwt.verify(req.token, secretKey, async (error, authData) => {
    if (error) {
      res.json({ error: "Invalid token" });
    } else {
      let data = new Feedback({
        rating: req.body.rating,
        improvement: req.body.improvement,
        email: req.body.email,
        user: req.body.user,
      });
      let result = await data.save();
      result = result.toObject();

      res.status(200).json({
        success: true,
        result: result,
      });
    }
  });
});

app.get("/testimonials", async (req, res) => {
  let data = await Feedback.find();
  if (data) {
    res.status(200).json({ success: true, result: data });
  } else {
    res.status(400).json({ success: false, error: "No testimonials found" });
  }
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
