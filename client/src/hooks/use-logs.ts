import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertCalculationLog } from "@shared/routes";

export function useCreateLog() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertCalculationLog) => {
      // Validate data before sending using Zod schema
      const validated = api.logs.create.input.parse(data);
      
      const res = await fetch(api.logs.create.path, {
        method: api.logs.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.logs.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create log");
      }

      return api.logs.create.responses[201].parse(await res.json());
    },
    // We don't necessarily need to invalidate queries if we aren't showing a list,
    // but it's good practice in case we add a history view later.
    onSuccess: () => {
      // If we had a list query: queryClient.invalidateQueries({ queryKey: [api.logs.list.path] });
    },
  });
}
