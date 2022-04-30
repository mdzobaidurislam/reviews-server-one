const express = require("express");
const dbo = require("../config/config");
const ObjectId = require("mongodb").ObjectId;

const getReviews = async function (req, res) {
  try {
    const dbConnect = await dbo.getDb();
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);

    let reviews;
    const curser = dbConnect.collection("reviews");
    const query = {};
    if (page || size) {
      reviews = await curser
        .find(query)
        .skip(page * size)
        .limit(size)
        .toArray();
    } else {
      reviews = await curser.find(query).toArray();
    }
    res.json(reviews);
  } catch (error) {}
};
// get review count
const reviewCount = async (req, res) => {
  try {
    const dbConnect = await dbo.getDb();
    const query = {};
    const count = await dbConnect.collection("reviews").count();
    res.json({ count });
  } catch (error) {}
};

// add
const addReview = async function (req, res) {
  try {
    const dbConnect = await dbo.getDb();
    dbConnect.collection("reviews").insertOne(req.body, (err, result) => {
      if (err) {
        res.status(400).send("Error inserting!");
      } else {
        console.log(`Added a new match with id ${result.insertedId}`);
        res.status(200);
        res.json({
          msg: "Reviews added successfully!",
        });
      }
    });
  } catch (error) {
    console.error(error);
  }
};

// update
const UpdateReview = async (req, res) => {
  const id = req.params.id;
  const updateUser = req.body;
  // console.log(updateUser);
  const filter = { _id: ObjectId(id) };
  const options = { upsert: true };
  const updateDoc = {
    $set: {
      name: updateUser.name,
      comment: updateUser.comment,
      rating: updateUser.rating,
      numOfReviews: updateUser.numOfReviews,
      img: updateUser.img,
    },
  };
  const dbConnect = await dbo.getDb();
  const result = await dbConnect
    .collection("reviews")
    .updateOne(filter, updateDoc, options);
  if (result) {
    res.status(200);
    res.json({
      msg: "Review Update successfully!",
    });
  } else {
    res.json({
      msg: "Review not found!",
    });
  }
};

// edit
const EditReview = async (req, res) => {
  const id = req.params.id;
  // console.log(id);
  const query = { _id: ObjectId(id) };
  const dbConnect = await dbo.getDb();
  const result = await dbConnect.collection("reviews").findOne(query);
  if (result) {
    res.send(result);
  } else {
    res.json({
      msg: "Review not found!",
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const dbConnect = await dbo.getDb();
    const result = await dbConnect.collection("reviews").deleteOne(query);
    if (result.deletedCount === 1) {
      res.status(200);
      res.json({
        msg: "Review deleted successfully!",
      });
    } else {
      res.status(404);
      res.json({
        msg: "Reviews not deleted!",
      });
    }
  } catch (error) {}
};

module.exports = {
  getReviews,
  addReview,
  EditReview,
  UpdateReview,
  deleteReview,
  reviewCount,
};
