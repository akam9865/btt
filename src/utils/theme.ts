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
      secondary: "#1b78d0",
    },
  },
  shape: {
    borderRadius: 4,
  },
});
