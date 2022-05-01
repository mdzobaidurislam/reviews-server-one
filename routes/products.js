const jwt = require("jsonwebtoken");
const dbo = require("../config/config");
const ObjectId = require("mongodb").ObjectId;

// get review count
const productCount = async (req, res) => {
  try {
    const dbConnect = await dbo.getDb();
    const count = await dbConnect.collection("product").count();
    res.json({ count });
  } catch (error) {}
};
// add product

const getProduct = async function (req, res) {
  try {
    const dbConnect = await dbo.getDb();
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);

    const decodedUserId = req.decoded.userId;
    const queryUser = { _id: ObjectId(decodedUserId) };
    const result = await dbConnect.collection("login").findOne(queryUser);

    if (result.role !== "admin") {
      console.log("Your not admin!");
      res.status(401).json({ msg: "Forbidden access!" });
    } else {
      let products;
      const curser = dbConnect.collection("product");
      const query = {};
      if (page || size) {
        products = await curser
          .find(query)
          .skip(page * size)
          .limit(size)
          .toArray();
      } else {
        products = await curser.find(query).toArray();
      }
      res.status(200).json(products);
    }
  } catch (error) {}
};
// add
const addProduct = async function (req, res) {
  try {
    const dbConnect = await dbo.getDb();
    dbConnect.collection("product").insertOne(req.body, (err, result) => {
      if (err) {
        res.status(400).send("Error inserting!");
      } else {
        console.log(`Added a new match with id ${result.insertedId}`);
        res.status(200);
        res.json({
          msg: "Product added successfully!",
        });
      }
    });
  } catch (error) {
    res.status(401);
    res.json({
      msg: error.message,
    });
  }
};
// edit
const EditProduct = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  const query = { _id: ObjectId(id) };
  const dbConnect = await dbo.getDb();
  const result = await dbConnect.collection("product").findOne(query);
  if (result) {
    console.log(result);
    res.json(result);
  } else {
    res.json({
      msg: "Product not found!",
    });
  }
};

// update
const UpdateProduct = async (req, res) => {
  const id = req.params.id;
  const updateProduct = req.body;
  // console.log(updateUser);
  const filter = { _id: ObjectId(id) };
  const options = { upsert: true };
  const updateDoc = {
    $set: updateProduct,
  };
  const dbConnect = await dbo.getDb();
  const result = await dbConnect
    .collection("product")
    .updateOne(filter, updateDoc, options);
  if (result) {
    res.status(200);
    res.json({
      msg: "Prodcut Update successfully!",
    });
  } else {
    res.json({
      msg: "Prodcut not found!",
    });
  }
};

// delete
const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const dbConnect = await dbo.getDb();
    const result = await dbConnect.collection("product").deleteOne(query);
    if (result.deletedCount === 1) {
      res.status(200);
      res.json({
        msg: "Product deleted successfully!",
      });
    } else {
      res.status(404);
      res.json({
        msg: "Product not deleted!",
      });
    }
  } catch (error) {}
};

// client product
const clientProduct = async function (req, res) {
  try {
    const dbConnect = await dbo.getDb();

    let products;
    const curser = dbConnect.collection("product");
    const query = {};
    products = await curser.find(query).toArray();
    res.json(products);
  } catch (error) {}
};

module.exports = {
  getProduct,
  addProduct,
  productCount,
  addProduct,
  EditProduct,
  UpdateProduct,
  deleteProduct,
  clientProduct,
};
