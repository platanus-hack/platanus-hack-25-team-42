import { createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a new router instance
export const getRouter = () => {
  const queryClient = new QueryClient({});

  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPendingMinMs: 0,
    context: {
      queryClient,
    },
    Wrap: ({ children }) => {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    },
  });

  return router;
};
