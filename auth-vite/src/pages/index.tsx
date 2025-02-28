import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Paper from "@mui/material/Paper";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModesModel,
  GridRowModes,
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowId,
  GridRowModel,
  GridEventListener,
  GridRowEditStopReasons,
} from "@mui/x-data-grid";
import type { Expense } from "../types";

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [expenseList, setExpenseList] = useState<Expense[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const fetchAllExpenses = () => {
    setIsLoading(true);
    fetch("/api/expenses")
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        setExpenseList(data);
      });
  };

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    fetch("api/expense/" + id, {
      method: "DELETE",
    }).then((result) => {
      fetchAllExpenses();
    });
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    const existingRow = expenseList.find((e) => e._id === newRow.id);
    const updatedRow = { ...newRow } as Expense;
    if (
      existingRow?.amount !== updatedRow.amount ||
      existingRow.category !== updatedRow.category ||
      existingRow.title !== updatedRow.title ||
      existingRow.date !== updatedRow.date
    ) {
      try {
        const response = await fetch(`api/expense`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(updatedRow),
        });
        if (!response.ok) throw new Error("Failed to save");
        const updatedExpense = await response.json();

        const clonedList = [...expenseList];
        const index = expenseList.findIndex(
          (e) => e._id === updatedExpense._id
        );
        clonedList[index] = updatedExpense;
        setExpenseList(clonedList);
      } catch (error) {
        console.error("Save failed:", error);
      }
    }

    fetchAllExpenses();
    return updatedRow;
  };

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
    setRowModesModel({
      ...rowModesModel,
      [params.id]: { mode: GridRowModes.View },
    });
  };

  const columns: GridColDef[] = [
    { field: "title", headerName: "Title", flex: 2, editable: true },
    { field: "amount", headerName: "Amount", flex: 1, editable: true },
    {
      field: "date",
      headerName: "Date",
      type: "date",
      valueGetter: (value, row) => new Date(row.date),
      flex: 1,
      editable: true,
    },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: ["Food", "Travel", "Utilities", "Entertainment", "Other"],
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  useEffect(() => {
    fetchAllExpenses();
  }, []);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        rows={expenseList}
        columns={columns}
        getRowId={(row) => row._id}
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 25 } },
        }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
        editMode="row"
        rowModesModel={rowModesModel}
        processRowUpdate={processRowUpdate}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
      />
    </Paper>
  );
}
