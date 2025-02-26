import * as React from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ReactRouterAppProvider } from "@toolpad/core/react-router";
import { Outlet, useNavigate } from "react-router";
import type { Navigation, Branding } from "@toolpad/core/AppProvider";

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "addExpense",
    title: "Add Expense",
    icon: <AddBoxIcon />,
  },
];

const BRANDING: Branding = {
  title: "Personal Expense Tracker",
  logo: (
    <CurrencyExchangeIcon
      color="primary"
      sx={{ height: "40px", width: "40px" }}
    />
  ),
};

export default function App() {
  const navigate = useNavigate();

  const signIn = React.useCallback(() => {
    navigate("/sign-in");
  }, [navigate]);

  const signOut = React.useCallback(() => {
    localStorage.removeItem("userSession");
    navigate("/sign-in");
  }, [navigate]);

  const session = localStorage.getItem("userSession")
    ? JSON.parse(localStorage.getItem("userSession") || "")
    : null;

  return (
    <ReactRouterAppProvider
      navigation={NAVIGATION}
      branding={BRANDING}
      session={session}
      authentication={{ signIn, signOut }}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Outlet />
      </LocalizationProvider>
    </ReactRouterAppProvider>
  );
}
