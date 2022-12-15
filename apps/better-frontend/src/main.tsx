import React from "react";
import ReactDOM from "react-dom/client";
import { mountStoreDevtool } from "simple-zustand-devtools";

import Router from "./Router";
import "./index.css";
import { useArticleStore } from "./store";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("Store", useArticleStore);
}
