import { createTheme } from "@mui/material";

// TODO: devise theme
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
    text: {
      primary: "#000",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
    },
    action: {
      hover: "rgba(0, 0, 0, 0.04)",
    },
  },
  shape: {
    borderRadius: 4,
  },
});
