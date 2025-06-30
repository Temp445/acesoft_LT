const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require('dotenv')
const path = require('path')
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");

const cors = require("cors");
const app = express();
dotenv.config({ path: path.join(__dirname, '.env') })


// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log(err));

// Routes
app.use("/api", productRoutes);
app.use("/api", userRoutes);



//server
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
