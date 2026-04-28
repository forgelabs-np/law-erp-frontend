import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Provider } from "@/shared/provider";
import { AppRoutes } from "@/shared/routes";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Provider>
      <AppRoutes />
    </Provider>
  </StrictMode>
);
