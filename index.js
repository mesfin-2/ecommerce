const express = require("express");
const dbConnect = require("./config/dbConnect");
const dotenv = require("dotenv").config();
const userRouter = require("./routes/user-route.js");
const authRouter = require("./routes/auth-route.js");
const middlewares = require("./middleware/middleware.js");
dbConnect();

const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json()); // This line is important for parsing JSON bodies

app.use("/api/users", middlewares.userExtractor);

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);

//

app.use(middlewares.unknownEndpoint);
app.use(middlewares.errorHandler);

app.listen(PORT, () => {
  console.log("Server is running at port " + PORT);
});
