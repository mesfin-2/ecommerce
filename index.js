const express = require("express");
const dbConnect = require("./config/dbConnect");
const dotenv = require("dotenv").config();
const userRouter = require("./routes/user-route.js");
const authRouter = require("./routes/auth-route.js");
const blogRouter = require("./routes/blog-route.js");
const productRouter = require("./routes/product-route.js");
const productcategoryRouter = require("./routes/product-category-route.js");
const blogcategoryRouter = require("./routes/blog-category-route.js");
const brandRouter = require("./routes/brand-route.js");
const couponRouter = require("./routes/coupon-route.js");
const uploadRouter = require("./routes/upload-route.js");
const enquiryRouter = require("./routes/enq-route.js");
const middlewares = require("./middleware/middleware.js");
const colorRouter = require("./routes/color-route.js");
const authMiddleware = require("./middleware/authMiddleware");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

dbConnect();

const PORT = process.env.PORT || 4000;
const app = express();
app.use(morgan("dev"));
app.use(express.json()); // This line is important for parsing JSON bodies
app.use(cookieParser()); //for refresh Token feature

app.use("/api/users", authMiddleware.userExtractor);

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);


app.use("/api/blogs", blogRouter);

app.use("/api/product-category", productcategoryRouter);
app.use("/api/blog-category", blogcategoryRouter);

app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);

app.use("/api/color", colorRouter);

app.use("/api/upload", uploadRouter);

app.use("/api/enquiry", enquiryRouter);




app.use(middlewares.errorHandler);
app.use(middlewares.unknownEndpoint);

app.listen(PORT, () => {
  console.log("Server is running at port " + PORT);
});
