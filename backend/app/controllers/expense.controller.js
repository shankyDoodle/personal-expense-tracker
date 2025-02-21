const mongoose = require("mongoose");
const Expense = mongoose.model("Expense");

exports.createExpense = (req, res) => {
  const expense = new Expense({
    title: req.body.title,
    amount: req.body.amount,
    date: req.body.date,
    category: req.body.category,
  });

  expense
    .save()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json({
        message: "Fail!",
        error: err.message,
      });
    });
};

exports.getExpense = (req, res) => {
  Expense.findById(req.params.id)
    .select("-__v")
    .then((expense) => {
      res.status(200).json(expense);
    })
    .catch((err) => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Expense not found with id " + req.params.id,
          error: err,
        });
      }
      return res.status(500).send({
        message: "Error retrieving Expense with id " + req.params.id,
        error: err,
      });
    });
};

exports.expenses = (req, res) => {
  Expense.find()
    .select("-__v")
    .then((expenseInfos) => {
      res.status(200).json(expenseInfos);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error!",
        error: error,
      });
    });
};

exports.deleteExpense = (req, res) => {
  Expense.findByIdAndDelete(req.params.id)
    .select("-__v-__id")
    .then((expense) => {
      if (!expense) {
        res.status(404).json({
          message: "No expense found with id = " + req.params.id,
          error: "404",
        });
      }
      res.status(200).json();
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error -> Can't delete expense with id = " + req.params.id,
        error: err.message,
      });
    });
};

exports.updateExpense = (req, res) => {
  Expense.findByIdAndUpdate(
    req.body.id,
    {
      author: req.body.author,
      title: req.body.title,
    },
    { new: false }
  )
    .select("-__v")
    .then((expense) => {
      if (!expense) {
        return res.status(404).send({
          message:
            "Error -> Can't update an expense with id = " + req.params.id,
          error: "Not Found!",
        });
      }
      res.status(200).json(expense);
    })
    .catch((err) => {
      return res.status(500).send({
        message: "Error -> Can't update a expense with id = " + req.params.id,
        error: err.message,
      });
    });
};
