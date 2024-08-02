const orderModel = require("../models/order-models");

const handleCreateOrder = async (req, res) => {
  const { orderDate, appointmentDate, totalAmount, monthlyAmount } = req.body;

  try {
    const newOrganization = await orderModel.create({
      orderDate,
      appointmentDate,
      totalAmount,
      monthlyAmount,
    });
    return res.json({
      message: "Organization created successfully",
      success: true,
      status: 201,
      data: newOrganization,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server side error occurred",
      success: false,
      status: 500,
    });
  }
};

const express = require("express");
const orderPostingRouter = express.Router();
orderPostingRouter.post("/orders/post-order", handleCreateOrder);
module.exports = orderPostingRouter;
