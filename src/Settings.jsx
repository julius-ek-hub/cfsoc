import { useEffect } from "react";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import useMediaQuery from "@mui/material/useMediaQuery";

import theme_conf from "./common/theme";
import useSettings from "./common/hooks/useSettings";

import FullScreenLoading from "./common/utils/Loading/FullScreen";
import Login from "./common/utils/Login";
import Toast from "./common/utils/Toast";

export default function Settings({ children }) {
  const { initializeCommonSettings, theme, primary_color, primary_colors } =
    useSettings();
  const prefers_dark = useMediaQuery("(prefers-color-scheme: dark)");

  const is_theme = ["dark", "light"].includes(theme);
  const is_col = primary_colors.includes(primary_color);
  const t = is_theme ? theme : prefers_dark ? "dark" : "light";
  const col = is_col ? primary_color : primary_colors[0];

  useEffect(() => {
    initializeCommonSettings();
  }, []);

  return (
    <ThemeProvider theme={theme_conf(t, col)}>
      <CssBaseline enableColorScheme />
      {children}
      <Login />
      <FullScreenLoading />
      <Toast />
    </ThemeProvider>
  );
}
