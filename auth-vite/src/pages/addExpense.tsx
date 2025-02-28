import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate } from "react-router";

export default function AddExpense() {
  const navigate = useNavigate();
  const [titleError, setTitleError] = useState("");
  const [amountError, setAmountError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!!titleError || !!amountError) {
      return;
    }
    const data = new FormData(event.currentTarget);
    const newExpense = {
      title: data.get("title"),
      amount: data.get("amount"),
      date: data.get("date") || "",
      category: data.get("category") || "",
    };

    await fetch(
      "https://personal-expense-tracker-zum4.onrender.com/api/expense",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExpense),
      }
    );
    navigate("/");
  };

  const validateInputs = () => {
    const title = document.getElementById("title") as HTMLInputElement;
    const amount = document.getElementById("amount") as HTMLInputElement;

    let isValid = true;

    if (!title.value) {
      setTitleError("Title can not be empty.");
      isValid = false;
    } else {
      setTitleError("");
    }

    if (!amount.value || Number(amount.value) <= 0) {
      setAmountError("Amount can not be empty");
      isValid = false;
    } else {
      setAmountError("");
    }

    return isValid;
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      width="100%"
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "40%",
          gap: 2,
        }}
      >
        <FormControl>
          <FormLabel htmlFor="title">Title</FormLabel>
          <TextField
            id="title"
            name="title"
            error={!!titleError}
            helperText={titleError}
            autoFocus
            required
            fullWidth
            variant="outlined"
            color={!!titleError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="amount">Amount</FormLabel>
          <TextField
            id="amount"
            name="amount"
            type="number"
            InputProps={{
              inputProps: {
                min: 1,
              },
            }}
            error={!!amountError}
            helperText={amountError}
            required
            fullWidth
            variant="outlined"
            color={!!amountError ? "error" : "primary"}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="amount">Date</FormLabel>
          <DatePicker label="Pick a date" name="date" />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="amount">Category</FormLabel>
          <Select
            labelId="category-select"
            id="category-select"
            name="category"
          >
            <MenuItem value="Food">Food</MenuItem>
            <MenuItem value="Travel">Travel</MenuItem>
            <MenuItem value="Utilities">Utilities</MenuItem>
            <MenuItem value="Entertainment">Entertainment</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" onClick={validateInputs}>
          Add Expense
        </Button>
      </Box>
    </Box>
  );
}
