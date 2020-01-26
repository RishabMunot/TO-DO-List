//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

//MONGOOSE SETUP
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/todolistD", {
  useNewUrlParser: true
});

const itemSchema = mongoose.Schema({ title: String });

const Item = mongoose.model("Item", itemSchema);

// Item.deleteMany({},()=>{})

//EXPRESS
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const workItems = [];

app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      console.log("no items found");

      var item1 = new Item({ title: "Welcome to todoList" });
      var item2 = new Item({ title: "Hit + to add new item" });
      var item3 = new Item({ title: "<-- to delete this item" });

      const defaultItems = [item1, item2, item3];

      Item.insertMany(defaultItems, err =>
        err ? console.log(err) : console.log("Success!!")
      );

      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
    }
  });
});

app.post("/", function(req, res) {
  const item = new Item({ title: req.body.newItem });
  item.save();
  res.redirect("/");
});

app.post("/delete", function(req, res) {
  Item.findByIdAndRemove(req.body.checkbox, function(err) {
    if (!err) {
      console.log("Successfully deleted");
      res.redirect("/");
    }
  });
});

app.get("/work", function(req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function(req, res) {
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
