const express = require("express");
const {
  addCategory,
  getCategory,
  categoryCount,
  deleteCategory,
  EditCategory,
  UpdateCategory,
} = require("../routes/category");
const {
  getProduct,
  addProduct,
  productCount,
  EditProduct,
  deleteProduct,
  UpdateProduct,
  clientProduct,
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

// review
router
  .route("/review/:id")
  .delete(deleteReview)
  .get(EditReview)
  .put(UpdateReview);

// product
router.get("/clientproduct", clientProduct);
router.get("/productCount", productCount);
router.route("/product").get(apiMiddleware, getProduct).post(addProduct);
router
  .route("/product/:id")
  .delete(deleteProduct)
  .get(EditProduct)
  .put(UpdateProduct);

// login
router.post("/login", userLogin);
router.get("/verifyUser", verifyUser);

// category
router.get("/categoryCount", categoryCount);
router.route("/category").get(getCategory).post(addCategory);
router
  .route("/category/:id")
  .delete(deleteCategory)
  .get(EditCategory)
  .put(UpdateCategory);

module.exports = router;
