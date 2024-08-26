const mongoose = require("mongoose");

// Define the schema for the new collection
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  pages: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});

// Create a model for the new collection
const BookStore = mongoose.model("BookStore", productSchema);

module.exports = BookStore;
