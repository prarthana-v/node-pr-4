let express = require("express");
const app = express();
const port = 3000;
let Product = require("./models/BookStore");
const connectDB = require("./Config/db");
connectDB();

app.set("view engine", "ejs");
app.use(express.urlencoded());

app.get("/add", (req, res) => {
  return res.render("Home");
});

app.get("/", (req, res) => {
  return res.render("view");
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
