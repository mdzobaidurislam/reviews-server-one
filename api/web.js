const express = require("express");
const {
  addCategory,
  getCategory,
  categoryCount,
} = require("../routes/category");
const {
  getProduct,
  addProduct,
  productCount,
  deleteProduct,
} = require("../routes/products");
const {
  addReview,
  getReviews,
  EditReview,
  UpdateReview,
  deleteReview,
  reviewCount,
} = require("../routes/reviews");
const { userLogin, verifyUser, apiMiddleware } = require("../routes/user");
const router = express.Router();

router.get("/reviewCount", reviewCount);
router.get("/review", getReviews);
router.post("/review", addReview);
// router.delete("/review/:id", deleteReview);
// router.get("/review/:id", EditReview);
// router.put("/update-review/:id", UpdateReview);

// review
router
  .route("/review/:id")
  .delete(deleteReview)
  .get(EditReview)
  .put(UpdateReview);

// product
router.get("/productCount", productCount);
router.route("/product").get(apiMiddleware, getProduct).post(addProduct);
router.route("/product/:id").delete(deleteProduct);

// login
router.post("/login", userLogin);
router.get("/verifyUser", verifyUser);
// router.get("/verifyUser", verifyUser);
// category

router.get("/categoryCount", categoryCount);
router.route("/category").get(getCategory).post(addCategory);

module.exports = router;
