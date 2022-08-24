const mongoose = require('mongoose');

const spotSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A spot must have a name'],
      unique: true,
      trim: true,
    },
    image: {
      type: String,
      required: [true, 'A spot must have an image'],
    },

    description: {
      type: String,
      trim: true,
      required: [true, 'Please provide spot description'],
    },

    address: {
      type: String,
      required: [true, 'A spot must have an address'],
      unique: true,
    },

    state: {
      type: String,
      required: true,
    },

    websiteUrl: String,

    rating: {
      type: Number,
      default: 4.5,
    },

    createdAt: {
      type: Date,
      default: new Date().toISOString(),
      select: false,
    },

    user: {
      name: String,
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

spotSchema.virtual('comments', {
  ref: 'Comment',
  foreignField: 'spot',
  localField: '_id',
});

const Spot = mongoose.model('Spot', spotSchema);

module.exports = Spot;
