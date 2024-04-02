import { styled } from "@mui/material";
import NextLink from "next/link";

export const Link = styled(NextLink)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: "none",
  "&:hover": {
    color: theme.palette.text.secondary,
  },
}));
