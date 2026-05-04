import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import { Provider } from "@/shared/provider";
import { AppRoutes } from "@/shared/routes";

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Provider>
      <Toaster position="top-right" reverseOrder={false} />
      <AppRoutes />
    </Provider>
  </StrictMode>
);
