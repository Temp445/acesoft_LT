const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductByPath,
} = require("../controllers/productController");

const multer = require("multer");

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });


//get
router.route("/product").get(getAllProducts);

//post
router.route("/product").post(upload.fields([{ name: "imageUrl" }, { name: "gallery" }]), createProduct);

//get product by ID
router.route("/product/:id").get(getProductById);

//get product by path
router.get("/product/v1/:productPath", getProductByPath);


//update
router.route("/product/:id").put(upload.fields([{ name: "imageUrl" }, { name: "gallery" }]), updateProduct);

//delete
router.route("/product/:id").delete(deleteProduct);

module.exports = router; 
