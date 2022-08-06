const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(express.json());

console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.static(`${__dirname}/public`));

const spotRouter = require("./routes/spotRoutes");
const userRouter = require("./routes/userRoutes");
const commentRouter = require("./routes/commentRoutes");

app.use("/api/v1/spots", spotRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/spots", commentRouter);

module.exports = app;
