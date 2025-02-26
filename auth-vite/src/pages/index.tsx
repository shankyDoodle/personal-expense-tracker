import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import type { Expense } from "../types";

const columns: GridColDef[] = [
  { field: "title", headerName: "Title", flex: 2 },
  { field: "amount", headerName: "Amount", flex: 1 },
  {
    field: "date",
    headerName: "Date",
    type: "date",
    valueGetter: (value, row) => new Date(row.date),
    flex: 1,
  },
  {
    field: "category",
    headerName: "Category",
    flex: 1,
  },
];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [expenseList, setExpenseList] = useState<Expense[]>([]);

  useEffect(() => {
    setIsLoading(true);
    fetch("/api/expenses")
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        setExpenseList(data);
      });
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }
  const paginationModel = { page: 0, pageSize: 25 };

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={expenseList}
        columns={columns}
        getRowId={(row) => row._id}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
