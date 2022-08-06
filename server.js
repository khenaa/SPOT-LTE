const mongoose = require("mongoose");
const dotevn = require("dotenv");
dotevn.config({ path: "./config.env" });

const app = require("./app");
const DB = process.env.DATABASE_URL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DB connection is successful"));

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`App running on port ${PORT}`)
);
