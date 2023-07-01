import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import Box from "@mui/material/Box";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import Settings from "./Settings";
import Login from "./common/utils/Login";

import router from "./router";

import common_settings from "./common/store/settings";
import loading from "./common/store/loading";
import schedule_settings from "./schedule/store/settings";
import schedules from "./schedule/store/schedules";

const common_store = configureStore({
  reducer: { common_settings, loading, schedule_settings, schedules },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Provider store={common_store}>
      <Settings>
        <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>
          <RouterProvider router={router} />
          <Login />
        </Box>
      </Settings>
    </Provider>
  </StrictMode>
);
