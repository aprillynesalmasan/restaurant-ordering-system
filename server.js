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


  app.listen(3000, () => console.log("port 3000 is running..."));