import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./router";
import { BrowserRouter } from "react-router";

import "./styles/globals.css";
import "@mantine/core/styles.css";

import LayoutComponent from "./layout";
import { MantineProvider } from "@mantine/core";
import { theme } from "./styles/mantine";

console.log(import.meta.env);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <LayoutComponent>
          <Router />
        </LayoutComponent>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
);
