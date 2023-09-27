import { createBrowserRouter, redirect } from "react-router-dom";

import Schedule from "./schedule";
import Splunk from "./splunk";
import Apps from "./Apps";
import Account from "./Account";
import Mitre from "./Mitre";
import Err_404 from "./common/utils/404";
import Err_500 from "./common/utils/500";

export default createBrowserRouter([
  {
    path: "/",
    // element: <Apps />,
    loader: () => redirect("/use-case-management/tactics"),
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
    element: <Mitre />,
    errorElement: <Err_500 />,
  },
  {
    path: "/use-case-management/",
    loader: () => redirect("/use-case-management/tactics"),
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
