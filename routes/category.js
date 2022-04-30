const express = require("express");
const dbo = require("../config/config");
const ObjectId = require("mongodb").ObjectId;

// category count
const categoryCount = async (req, res) => {
  try {
    const dbConnect = await dbo.getDb();
    const count = await dbConnect.collection("category").count();
    res.json({ count });
  } catch (error) {}
};
// get
const getCategory = async function (req, res) {
  try {
    const dbConnect = await dbo.getDb();
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);

    let categories;
    const curser = dbConnect.collection("category");
    const query = {};
    if (page || size) {
      categories = await curser
        .find(query)
        .skip(page * size)
        .limit(size)
        .toArray();
    } else {
      categories = await curser.find(query).toArray();
    }
    res.json(categories);
  } catch (error) {}
};
// add
const addCategory = async function (req, res) {
  try {
    const dbConnect = await dbo.getDb();
    dbConnect.collection("category").insertOne(req.body, (err, result) => {
      if (err) {
        res.status(400).send("Error inserting!");
      } else {
        console.log(`Added a new match with id ${result.insertedId}`);
        res.status(200);
        res.json({
          msg: "Category added successfully!",
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

module.exports = { getCategory, addCategory, categoryCount };
