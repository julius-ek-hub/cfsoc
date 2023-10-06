import { createBrowserRouter, redirect } from "react-router-dom";

import Schedule from "./schedule";
import Splunk from "./splunk";
import Apps from "./Apps";
import Account from "./Account";
import UCM from "./UCM";
import Err_404 from "./common/utils/404";
import Err_500 from "./common/utils/500";

export default createBrowserRouter([
  {
    path: "/",
    // element: <Apps />,
    loader: () => redirect("/use-case-management/intro"),
  },
  // {
  //   path: "/schedules/:date",
  //   element: <Schedule />,
  //   errorElement: <Err_500 />,
  // },
  // {
  //   path: "/schedules",
  //   loader: () => redirect("/schedules/current"),
  // },
  // {
  //   path: "/splunk",
  //   element: <Splunk />,
  //   errorElement: <Err_500 />,
  // },

  {
    path: "/use-case-management/:path",
    element: <UCM />,
    errorElement: <Err_500 />,
  },
  {
    path: "/use-case-management/",
    loader: () => redirect("/use-case-management/l1_uc"),
  },
  {
    path: "/account",
    element: <Account />,
    errorElement: <Err_500 />,
  },
  {
    path: "/*",
    element: <Err_404 />,
    errorElement: <Err_500 />,
  },
]);
