const mongoose = require("mongoose");
const validator = require("validator");
const bycrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a name"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email "],
  },
  image: String,

  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password do not match",
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre("save", async function (next) {
  // only hash the password if it has been modified (or is a new password)
  if (!this.isModified("password")) return next();

  // hash the password
  this.password = await bycrypt.hash(this.password, 12);

  // delete passwordConfirm field from DB
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// create an instance method
userSchema.methods.correctPassword = async function (
  userInputedPassword,
  userDBPassword
) {
  // compare user input password to user password in DB
  return await bycrypt.compare(userInputedPassword, userDBPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
