import { createBrowserRouter, redirect, useRouteError } from "react-router-dom";

import Schedule from "./schedule";
import Splunk from "./splunk";
import Apps from "./Apps";
import Account from "./Account";

function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  // Uncaught ReferenceError: path is not defined
  return <div>Dang!</div>;
}

export default createBrowserRouter([
  {
    path: "/",
    element: <Apps />,
  },
  {
    path: "/schedules/:date",
    element: <Schedule />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/schedules",
    loader: () => redirect("/schedules/current"),
  },
  {
    path: "/splunk",
    element: <Splunk />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/account",
    element: <Account />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/*",
    element: <h1>Not found</h1>,
    errorElement: <ErrorBoundary />,
  },
]);
