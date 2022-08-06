const Spot = require("../models/spotModel");

exports.getAllSpots = async (req, res) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludedFields = ["sort", "fields", "page", "limit"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let query = Spot.find(queryObj);

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Field Limiting
    if (req.query.fields) {
      const selectedFields = req.query.fields.split(",").join(" ");
      query = query.select(selectedFields);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // EXECUTE QUERY
    const spots = await query;

    // send response
    res.status(200).json({
      status: "success",
      result: spots.length,
      data: {
        spots,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getSpot = async (req, res) => {
  try {
    const foundSpot = await Spot.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        foundSpot,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.createSpot = async (req, res) => {
  try {
    const newSpot = await Spot.create({
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      address: req.body.address,
      state: req.body.state,
      websiteUrl: req.body.websiteUrl,
      author: {
        name: req.user.name,
        id: req.user.id,
      },
    });
    newSpot.comments = undefined;
    res.status(201).json({
      status: "success",
      data: {
        newSpot,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
    console.log(err);
  }
};

exports.updateSpot = async (req, res) => {
  try {
    const updatedSpot = await Spot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      data: {
        updatedSpot,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteSpot = async (req, res) => {
  try {
    await Spot.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
