import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      default: "#ECECEC",
      paper: "#FFF",
    },
  },
  shape: {
    borderRadius: 4,
  },
});
