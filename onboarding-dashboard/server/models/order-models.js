const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderDate: { type: String, required: true },
  appointmentDate: { type: Number, required: true },
  totalAmount: { type: String, required: true },
  monthlyAmount: { type: String },
});

let orderModel;
if (mongoose.models.orders) {
  orderModel = mongoose.model("orders");
}
orderModel = mongoose.model("orders", orderSchema);

module.exports = orderModel;
