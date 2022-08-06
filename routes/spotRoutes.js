const express = require("express");
const router = express.Router();
const spotController = require("../controllers/spotController");
const authController = require("../controllers/authController");

router
  .route("/")
  .get(authController.isAuthenticated, spotController.getAllSpots)
  .post(authController.isAuthenticated, spotController.createSpot);

router
  .route("/:id")
  .get(spotController.getSpot)
  .patch(
    authController.isAuthenticated,
    authController.checkSpotOwnership,
    spotController.updateSpot
  )
  .delete(
    authController.isAuthenticated,
    authController.checkSpotOwnership,
    authController.restrictedTo("admin"),
    spotController.deleteSpot
  );

module.exports = router;
