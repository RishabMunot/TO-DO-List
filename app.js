//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

//MONGOOSE SETUP
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin-rishab:747422@cluster0-3og7i.mongodb.net/todolistD", {
  useNewUrlParser: true
});

const itemSchema = mongoose.Schema({ title: String, list: String });

const Item = mongoose.model("Item", itemSchema);

Item.deleteMany({}, () => {});

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

      var item1 = new Item({ title: "Welcome to todoList", list: "main" });
      var item2 = new Item({ title: "Hit + to add new item", list: "main" });
      var item3 = new Item({ title: "<-- to delete this item", list: "main" });

      const defaultItems = [item1, item2, item3];

      Item.insertMany(defaultItems, err =>
        err ? console.log(err) : console.log("Success!!")
      );

      res.redirect("/");
    } else {
      res.render("list", { listTitle: "main", newListItems: foundItems });
    }
  });
});

app.post("/", function(req, res) {
  console.log(req.body.list);
  
  const item = new Item({ title: req.body.newItem,list:req.body.list });
  item.save();
  res.redirect("/"+req.body.list);
});

app.post("/delete", function(req, res) {
  const data = req.body.checkbox;
  var dataa = data.split(",")

  Item.findByIdAndRemove(dataa[0], function(err) {
    if (!err) {
      console.log("Successfully deleted");
      if (dataa[1] === "main") res.redirect("/");
      else res.redirect("/"+dataa[1]);
    }
  });
});

app.get("/:listName", function(req, res) {
  const list = req.params.listName;
  Item.find({ list: list }, function(err, foundItems) {
    console.log(foundItems);
    if (foundItems.length === 0) {
      console.log("no items found");

      var item1 = new Item({
        title: "Welcome to todoList",
        list: list
      });
      var item2 = new Item({
        title: "Hit + to add new item",
        list: list
      });
      var item3 = new Item({
        title: "<-- to delete this item",
        list: list
      });

      const defaultItems = [item1, item2, item3];

      Item.insertMany(defaultItems, err =>
        err ? console.log(err) : console.log("Success!!")
      );

      res.redirect("/" + list);
    } else {
      res.render("list", { listTitle: list, newListItems: foundItems });
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});
