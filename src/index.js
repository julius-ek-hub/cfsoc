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

import router from "./router";

import common_settings from "./common/store/settings";
import loading from "./common/store/loading";
import toasts from "./common/store/toasts";
import ucm from "./UC/store/ucm";
import keepass from "./KeePass/store/kp";
import pkeepass from "./PrivateKeePass/store/kp";

const common_store = configureStore({
  reducer: {
    common_settings,
    loading,
    toasts,
    ucm,
    keepass,
    pkeepass,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={common_store}>
    <Settings>
      <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>
        <RouterProvider router={router} fallbackElement={<Box>Error</Box>} />
      </Box>
    </Settings>
  </Provider>
);
