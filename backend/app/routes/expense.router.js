module.exports = function (app) {
  var controller = require("../controllers/expense.controller.js");

  app.post("/api/expense", controller.createExpense);
  app.get("/api/expense/:id", controller.getExpense);
  app.get("/api/expenses", controller.expenses);
  app.put("/api/expense", controller.updateExpense);
  app.delete("/api/expense/:id", controller.deleteExpense);
};
