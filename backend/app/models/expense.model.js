const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  amount: { type: String, required: true },
  date: { type: Date, default: Date.now },
  category: { type: String },
});

module.exports = mongoose.model("Expense", expenseSchema);
