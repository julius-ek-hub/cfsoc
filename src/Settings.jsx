import { useEffect } from "react";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Box from "@mui/material/Box";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import useMediaQuery from "@mui/material/useMediaQuery";

import theme_conf from "./common/theme";
import useSettings from "./common/hooks/useSettings";

import FullScreenLoading from "./common/utils/Loading/FullScreen";
import Login from "./common/utils/Login";
import Toast from "./common/utils/Toast";
import IconButton from "./common/utils/IconButton";

export default function Settings({ children }) {
  const { initializeCommonSettings, theme, hide_header, update } =
    useSettings();
  const prefers_dark = useMediaQuery("(prefers-color-scheme: dark)");

  const is_theme = ["dark", "light"].includes(theme);
  const t = is_theme ? theme : prefers_dark ? "dark" : "light";

  useEffect(() => {
    initializeCommonSettings();
  }, []);

  return (
    <ThemeProvider theme={theme_conf(t)}>
      <CssBaseline enableColorScheme />
      <Box
        sx={{
          position: "fixed",
          top: 0,
          top: 2,
          left: "46.5%",
          zIndex: 100,
        }}
      >
        <IconButton
          sx={{ bgcolor: "background.paper" }}
          Icon={hide_header ? ArrowDownwardIcon : ArrowUpwardIcon}
          title={hide_header ? "Show headers" : "Hide headers"}
          onClick={() => update("hide_header", !Boolean(hide_header))}
        />
      </Box>
      {children}
      <Login />
      <FullScreenLoading />
      <Toast />
    </ThemeProvider>
  );
}
