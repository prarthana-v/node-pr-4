let express = require("express");
const app = express();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const port = 3000;
let BookStore = require("./models/BookStore");
const connectDB = require("./Config/db");
const { log } = require("console");
const { name } = require("ejs");
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

// edit book record
app.get("/edit", (req, res) => {
  console.log("hello");
  let eid = req.query.eid;
  console.log(eid);

  BookStore.findById(eid)
    .then((single) => {
      // console.log(single);
      res.render("edit", {
        single,
      });
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
});

app.post("/updateBook", upload, (req, res) => {
  console.log(req.body);
  const { id, name, author, price, pages } = req.body;
  BookStore.findByIdAndUpdate(id, {
    name: name,
    author: author,
    pages: pages,
    price: price,
  })
    .then((updatedBook) => {
      if (!updatedBook) {
        return res.status(404).send("Book not found");
      }
      // console.log(updatedB ook);
      return res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("Error updating book");
    });
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
