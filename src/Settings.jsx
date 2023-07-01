import { useEffect } from "react";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import useMediaQuery from "@mui/material/useMediaQuery";

import theme_conf from "./common/theme";
import useSettings from "./common/hooks/useSettings";

import FullScreenLoading from "./common/utils/Loading/FullScreen";

export default function Settings({ children }) {
  const { initializeCommonSettings, theme } = useSettings();
  const prefers_dark = useMediaQuery("(prefers-color-scheme: dark)");

  const is_theme = ["dark", "light"].includes(theme);
  const t = is_theme ? theme : prefers_dark ? "dark" : "light";

  useEffect(() => {
    initializeCommonSettings();
  }, []);

  return (
    <ThemeProvider theme={theme_conf(t)}>
      <CssBaseline enableColorScheme />
      {children}
      <FullScreenLoading />
    </ThemeProvider>
  );
}
