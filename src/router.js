import { createBrowserRouter, redirect } from "react-router-dom";

import Apps from "./Apps";
import Account from "./Account";
import UseCase from "./UC";
import KeePass from "./KeePass";
import PrivateKeePass from "./PrivateKeePass";
import Err_404 from "./common/utils/404";
import Err_500 from "./common/utils/500";

export default createBrowserRouter([
  {
    path: "/",
    element: <Apps />,
    errorElement: <Err_500 />,
  },

  {
    path: "/use-case-management/:path",
    element: <UseCase />,
    errorElement: <Err_500 />,
  },
  {
    path: "/keepass",
    element: <KeePass />,
    errorElement: <Err_500 />,
  },
  {
    path: "/keepass/private",
    element: <PrivateKeePass />,
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
