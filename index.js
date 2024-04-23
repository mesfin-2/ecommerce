const express = require("express");
const dbConnect = require("./config/dbConnect");
const dotenv = require("dotenv").config();
const userRouter = require("./routes/user-route.js");
const authRouter = require("./routes/auth-route.js");
const blogRouter = require("./routes/blog-route.js");
const productRouter = require("./routes/product-route.js");
const productcategoryRouter = require("./routes/product-category-route.js");
const middlewares = require("./middleware/middleware.js");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

dbConnect();

const PORT = process.env.PORT || 4000;
const app = express();
app.use(morgan("dev"));
app.use(express.json()); // This line is important for parsing JSON bodies
app.use(cookieParser()); //for refresh Token feature

app.use("/api/users", middlewares.userExtractor);

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);


app.use("/api/blogs", blogRouter);

app.use("/api/category", productcategoryRouter);

app.use(middlewares.unknownEndpoint);
app.use(middlewares.errorHandler);

app.listen(PORT, () => {
  console.log("Server is running at port " + PORT);
});
