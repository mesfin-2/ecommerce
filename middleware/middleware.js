const User = require("../model/user-model.js");
const jwt = require("jsonwebtoken");

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected `email` to be unique" });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(400).json({ error: "token missing or invalid" });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }

  next(error);
};

//Isolates the token from the authorization header.
const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  //console.log("authorization", authorization);
  if (authorization && authorization.startsWith("Bearer")) {
    // Attach the extracted token to the request object

    request.token = authorization.replace("Bearer ", "");
  } else {
    request.token = null;
  }

  next();
};
//Extract User
const userExtractor = async (request, response, next) => {
  const token = request.get("authorization");

  if (token && token.startsWith("Bearer ")) {
    const decodedToken = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.SECRET
    );
    const user = await User.findById(decodedToken.id);

    if (!user) {
      request.user = null; // User not found
    } else {
      request.user = user; // Attach user to request
    }
  } else {
    request.user = null; // No token or invalid format
  }

  next();

  //next(error); // Pass any errors to the error handler middleware
};

module.exports = {
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
