const express = require("express")
const mongoose = require("mongoose")

const app = express()
app.use(express.json())
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/restaurantDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect:", err));


  //Schemas
const menuItemSchema = new mongoose.Schema({
    foodName: {type: String, required: [true, "Food name is required"]},
    category: {type: String, default: "General"},
    price: {type: Number, required: [true, "Price is required"]},
    isAvailable: {type: Boolean, default: true}
});

const orderSchema = new mongoose.Schema({
    orderNumber: {type: Number, unique: true},
    tableNumber: {type: Number, required: [true, "Table number is required"]},
    status: {type: String, enum:["preparing", "served"], default: "preparing"},
    total: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now}
});


const orderItemSchema = new mongoose.Schema({
    order: {type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true},
    menuItem: {type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    quantity: { type: Number, required: [true, "Quantity is required"], min: [1, "Quantity must be at least 1"] },
    price: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
})

//models
const MenuItem = mongoose.model("MenuItem", menuItemSchema);
const Order = mongoose.model("Order", orderSchema);
const OrderItem = mongoose.model("OrderItem", orderItemSchema);

//Menu Routes


//all menu items
app.get("/menu", async (req, res) =>{
try {
    const items = await MenuItem.find();
    res.json(items);
} catch (err) {
    res.status(500).json ({ message: err.message});
}
})


//Get one specific menu item

app.get("/menu/:id", async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
});

//Post add a menu item
app.post("/menu", async (req, res) => {
  try {
    const item = await new MenuItem(req.body).save();
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//put update a menu item

app.put("/menu/:id", async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


//delete a menu item
app.delete("/menu/:id", async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found" });
    res.json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
});

app.listen(3000, () => console.log("port 3000 is running..."));