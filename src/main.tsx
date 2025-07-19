import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MainRouter } from "./routes/MainRouter";
import { EpiaProvider } from "./infra/providers/EpiaProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    // <React.StrictMode>
    <EpiaProvider>
        <MainRouter />
    </EpiaProvider>,

    // </React.StrictMode>,
);
