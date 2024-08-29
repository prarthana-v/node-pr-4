let express = require("express");

const port = 8000;

const app = express();

//database connection
const connectDB = require("./Config/db");
connectDB();

// model connection
let BookStore = require("./models/BookStore");

const fs = require("fs");

app.set("view engine", "ejs");

app.use(express.urlencoded());

const path = require("path");

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// file upload

const multer = require("multer");

const st = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqname = `${Date.now()}-${Math.random() * 100000}`;
    cb(null, `${file.fieldname}-${uniqname}`);
  },
});

const upload = multer({ storage: st }).single("image");

// view function
app.get("/", (req, res) => {
  BookStore.find({})
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

app.get("/add", (req, res) => {
  return res.render("Home");
});

// insert function
app.post("/insertbook", upload, (req, res) => {
  console.log(req.body);

  const { name, price, pages, author } = req.body;
  BookStore.create({
    name: name,
    price: price,
    pages: pages,
    author: author,
    image: req.file.path,
  })
    .then(() => {
      console.log("Book Details Uploaded...! ");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
});

// delete book record
app.get("/deleteBook", (req, res) => {
  let id = req.query.did;

  BookStore.findById(id)
    .then((single) => {
      fs.unlinkSync(single.image);
    })
    .catch((err) => {
      console.log(err);
      return false;
    });

  BookStore.findByIdAndDelete(id)
    .then((response) => {
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
  console.log("edit ma thi ave che", eid);

  BookStore.findById(eid)
    .then((single) => {
      console.log("edit route nu", single);

      return res.render("edit", {
        single,
      });
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
});

//update book
app.post("/updateBook", upload, (req, res) => {
  console.log(req.body);
  const { editid, name, author, price, pages } = req.body;

  if (req.file) {
    console.log("131", req.file);

    BookStore.findById(editid)
      .then((single) => {
        console.log("134", single);
        fs.unlinkSync(single.image);
      })
      .catch((err) => {
        console.log("139", err);
      });

    BookStore.findByIdAndUpdate(editid, {
      name: name,
      price: price,
      pages: pages,
      author: author,
      image: req.file.path,
    })
      .then((response) => {
        console.log("Record updated");
        return res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  } else {
    BookStore.findById(editid)
      .then((single) => {
        console.log("161", single);

        BookStore.findByIdAndUpdate(editid, {
          name: name,
          price: price,
          pages: pages,
          author: author,
          image: single.image,
        })
          .then((response) => {
            console.log("Record updated");
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
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
