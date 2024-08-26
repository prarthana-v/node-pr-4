let express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const port = 3000;
let BookStore = require("./models/BookStore");
const connectDB = require("./Config/db");
connectDB();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Specify the destination folder
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        "." +
        file.originalname.split(".").pop()
    );
  },
});
app.use("/uploads", express.static("uploads"));
const upload = multer({ storage: storage }).single("image");

app.set("view engine", "ejs");
app.use(express.urlencoded());

app.get("/add", (req, res) => {
  return res.render("Home");
});

// view function
app.get("/", (req, res) => {
  BookStore.find()
    .then((record) => {
      // console.log(record);
      return res.render("view", {
        record: record,
      });
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
});

// insert function
app.post("/insertbook", upload, (req, res) => {
  const { name, price, pages, author } = req.body;
  const image = req.file.path;

  BookStore.create({
    name: name,
    price: price,
    pages: pages,
    author: author,
    image: image,
  })
    .then((bookDetails) => {
      console.log("Book Details Uploaded...! ");
      return res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
});

// delete book record
app.get("/deleteBook", (req, res) => {
  let did = req.query.did;

  BookStore.findById(did)
    .then((single) => {
      fs.unlinkSync(single.image);
    })
    .catch((err) => {
      console.log(err);
      return false;
    });

  BookStore.findByIdAndDelete(did)
    .then((data) => {
      console.log("Book Details Deleted..!");
      return res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
