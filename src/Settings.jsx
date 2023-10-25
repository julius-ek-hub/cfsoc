import { useEffect, useRef } from "react";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Box from "@mui/material/Box";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

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
  const timer = useRef();
  const boxRef = useRef();

  const is_theme = ["dark", "light"].includes(theme);
  const t = is_theme ? theme : prefers_dark ? "dark" : "light";

  const handleMouseMove = () => {
    const br = boxRef.current;
    br.style.top = 0;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      br.style.top = "-100px";
    }, 3000);
  };

  useEffect(() => {
    initializeCommonSettings();
    handleMouseMove();
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <ThemeProvider theme={theme_conf(t)}>
      <CssBaseline enableColorScheme />
      <Box
        ref={boxRef}
        sx={{
          position: "fixed",
          top: -100,
          left: "50%",
          zIndex: 100,
          transform: "translate(-50%, 0)",
          transition: "300ms top",
        }}
      >
        <IconButton
          sx={{
            bgcolor: "background.paper",
            transform: `rotate(${hide_header ? 0 : 180}deg)`,
            transition: "300ms transform",
          }}
          Icon={ArrowDownwardIcon}
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
