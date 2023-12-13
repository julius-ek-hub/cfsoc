import { createBrowserRouter, redirect } from "react-router-dom";

import Schedule from "./Schedule";
import Apps from "./Apps";
import Account from "./Account";
import UseCase from "./UseCase";
import Err_404 from "./common/utils/404";
import Err_500 from "./common/utils/500";

export default createBrowserRouter([
  {
    path: "/",
    element: <Apps />,
    errorElement: <Err_500 />,
  },
  {
    path: "/schedules/:date",
    element: <Schedule />,
    errorElement: <Err_500 />,
  },
  {
    path: "/schedules",
    loader: () => redirect("/schedules/current"),
  },

  {
    path: "/use-case-management/:path",
    element: <UseCase />,
    errorElement: <Err_500 />,
  },
  {
    path: "/use-case-management/",
    loader: () => redirect("/use-case-management/intro"),
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
