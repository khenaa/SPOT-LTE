const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.patch(
  "/updateMyPassword",
  authController.isAuthenticated,
  authController.updatePassword
);

router.patch(
  "/updateMe",
  authController.isAuthenticated,
  userController.updateMe
);

router.delete(
  "/deleteMe",
  authController.isAuthenticated,
  userController.deleteMe
);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(
    authController.isAuthenticated,
    authController.restrictedTo("admin"),
    userController.createUser
  );

router
  .route("/:id")
  .get(userController.getUser)
  .patch(
    authController.isAuthenticated,
    authController.restrictedTo("admin"),
    userController.updateUser
  )
  .delete(
    authController.isAuthenticated,
    authController.restrictedTo("admin"),
    userController.deleteUser
  );

module.exports = router;
