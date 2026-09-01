import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";

import { ChakraProvider, ToasterProvider } from "../components/ui";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Do NOT retry 403 (Forbidden) — it's a permission issue, not transient.
      // Also don't retry 401 (Unauthorized) — the axios interceptor handles token refresh.
      retry: (failureCount, error) => {
        const axiosError = error as AxiosError;
        const status = axiosError?.response?.status;

        // Never retry 401 or 403
        if (status === 401 || status === 403) {
          return false;
        }

        // Default: retry up to 3 times for other errors
        return failureCount < 3;
      },
      // Don't refetch on window focus for 403-failed queries
      refetchOnWindowFocus: false,
    },
  },
});

export const Provider = ({ children }: PropsWithChildren) => {
  return (
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>{children}</BrowserRouter>
      </QueryClientProvider>

      <ToasterProvider />
    </ChakraProvider>
  );
};
