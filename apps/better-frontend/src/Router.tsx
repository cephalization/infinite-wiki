import { createBrowserRouter, defer, RouterProvider } from "react-router-dom";

import App from "./App";
import { Article } from "./routes/Article";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "article/:articleName",
        element: <Article />,
      },
    ],
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
