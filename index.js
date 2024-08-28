let express = require("express");
const app = express();
const port = 3000;
const path = require("path");

const fs = require("fs");

let BookStore = require("./models/BookStore");
const connectDB = require("./Config/db");
connectDB();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const multer = require("multer");
const { unlinkSync } = require("fs");

const st = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqname = `${Date.now()}-${Math.random() * 100000}`;
    cb(null, `${file.fieldname}-${uniqname}`);
  },
});

const uploadFile = multer({ storage: st }).single("image");

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
app.post("/insertbook", uploadFile, (req, res) => {
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
  // console.log("hello");
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

// update book details
app.post(
  "/updateBook",
  (req, res, next) => {
    uploadFile(req, res, (err) => {
      if (err) {
        console.log("Multer error:", err);
        return res.status(400).send("File upload error");
      }
      next();
    });
  },
  (req, res) => {
    console.log(req.body);
    console.log(req.file);

    const { editid, name, author, price, pages } = req.body;
    if (req.file) {
      console.log(req.file);
      BookStore.findById(editid)
        .then((single) => {
          fs.unlinkSync(single.image);
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
      BookStore.findByIdAndUpdate(editid, {
        name: name,
        author: author,
        price: price,
        pages: pages,
        image: req.file.path,
      })
        .then((response) => {
          console.log("Record update");
          return res.redirect("/");
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    } else {
      BookStore.findById(editid)
        .then((single) => {
          BookStore.findByIdAndUpdate(editid, {
            name: name,
            author: author,
            price: price,
            pages: pages,
            image: single.image,
          })
            .then((response) => {
              console.log("Record update");
              return res.redirect("/");
            })
            .catch((err) => {
              console.log(err);
              return false;
            });
        })
        .catch((err) => {
          console.log(err);
          return false;
        });
    }
  }
);

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
