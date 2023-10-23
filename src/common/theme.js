import { createTheme } from "@mui/material/styles";

const styleOverrides = (rootStyle) => ({
  styleOverrides: {
    root: rootStyle,
  },
});

const defaultProps = (props) => ({ defaultProps: props });

const theme = (mode = "light") => {
  mode = mode === "dark" ? "dark" : "light";
  return createTheme({
    palette: {
      mode,
      ...(mode === "dark" && {
        background: {
          default: "#1F1B24",
          paper: "#1F1B24",
        },
      }),
      primary: {
        main: "#1D6F42",
      },
    },
    typography: {
      fontSize: 16,
    },
    components: {
      MuiButtonBase: defaultProps({
        disableRipple: true,
        sx: {
          textTransform: "none !important",
        },
      }),
      MuiLink: defaultProps({
        underline: "none",
        href: "#",
        sx: { cursor: "pointer", color: "red" },
      }),
      MuiList: defaultProps({
        sx: { a: { textDecoration: "none", color: "inherit" } },
      }),
      MuiBackdrop: styleOverrides({
        backgroundColor:
          mode === "light" ? "rgba(255, 255, 255, 0.9)" : "rgba(0, 0, 0, 0.9)",
        zIndex: 1000,
      }),
      MuiTypography: styleOverrides({ wordBreak: "break-all" }),
    },
  });
};

export default theme;
