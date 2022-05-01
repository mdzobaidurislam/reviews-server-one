const jwt = require("jsonwebtoken");
const dbo = require("../config/config");
const ObjectId = require("mongodb").ObjectId;

// middleware
const apiMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ meg: "Unauthorized access" });
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).json({ sucess: false, msg: "Forbidden access!" });
    }
    req.decoded = decoded;
    next();
  });
};

const userLogin = async (req, res) => {
  try {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;
    const query = { email: email };
    const dbConnect = await dbo.getDb();
    const result = await dbConnect.collection("login").findOne(query);

    let accessToken;
    if (result) {
      const userId = result._id;
      if (result.password === password && result.email === email) {
        if (result.role === "admin" && result.isAdmin) {
          accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1d",
          });
          res.json({
            email: result.email,
            accessToken: accessToken,
          });
        } else {
          res.json({ msg: "Unauthorise!" });
        }
      } else {
        res.json({ msg: "Invalid email password!" });
      }
    } else {
      res.json({ msg: "User not found!" });
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
};

const verifyUser = async (req, res) => {
  try {
    const decodedUserId = req.decoded.userId;
    const email = req.query.email;
    const query = { _id: ObjectId(decodedUserId) };
    const dbConnect = await dbo.getDb();
    const result = await dbConnect.collection("login").findOne(query);
    if (result) {
      if (result.email === email) {
        res.json({
          success: true,
          loading: false,
          email: result.email,
        });
      } else {
        res.json({
          success: false,
          loading: true,
        });
      }
    }
  } catch (error) {
    res.json({ msg: error.message });
  }
};

module.exports = { userLogin, verifyUser, apiMiddleware };
